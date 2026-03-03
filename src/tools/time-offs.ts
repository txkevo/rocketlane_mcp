import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerTimeOffTools(server: McpServer, client: RocketlaneClient) {
  // List time-offs
  server.registerTool(
    "rocketlane_list_time_offs",
    {
      title: "List Time-Offs",
      description: "List or search time-off records. Filter by date range, user, or type.",
      inputSchema: {
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
        "startDate.ge": z.string().optional().describe("Filter: start date >= YYYY-MM-DD"),
        "startDate.le": z.string().optional().describe("Filter: start date <= YYYY-MM-DD"),
        "endDate.ge": z.string().optional().describe("Filter: end date >= YYYY-MM-DD"),
        "endDate.le": z.string().optional().describe("Filter: end date <= YYYY-MM-DD"),
        "userId.eq": z.number().int().optional().describe("Filter: user ID"),
        "userId.oneOf": z.string().optional().describe("Filter: comma-separated user IDs"),
        "type.eq": z.enum(["FULL_DAY", "HALF_DAY", "CUSTOM"]).optional().describe("Filter: time-off type"),
        sortBy: z.enum(["startDate", "endDate"]).optional(),
        includeFields: z.string().optional().describe("Comma-separated: note,notifyUsers"),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/time-offs", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get time-off
  server.registerTool(
    "rocketlane_get_time_off",
    {
      title: "Get Time-Off",
      description: "Get a single time-off record by its ID.",
      inputSchema: {
        timeOffId: z.number().int().describe("Time-off ID"),
        includeFields: z.string().optional().describe("Comma-separated: note,notifyUsers"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ timeOffId, includeFields }) => {
      const params = includeFields ? { includeFields } : undefined;
      const result = await client.get(`/time-offs/${timeOffId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create time-off
  server.registerTool(
    "rocketlane_create_time_off",
    {
      title: "Create Time-Off",
      description: "Create a time-off record for a user.",
      inputSchema: {
        userId: z.number().int().describe("User ID for whom to create the time-off"),
        startDate: z.string().describe("Start date YYYY-MM-DD (required)"),
        endDate: z.string().describe("End date YYYY-MM-DD (required, must be >= startDate)"),
        type: z.enum(["FULL_DAY", "HALF_DAY", "CUSTOM"]).describe("Type of time-off (required)"),
        durationInMinutes: z.number().int().optional().describe("Per-day duration in minutes (for CUSTOM type)"),
        note: z.string().optional(),
        notifyProjectOwners: z.boolean().optional().describe("Notify project owners of this time-off"),
        notifyUserIds: z.array(z.number().int()).optional().describe("Additional user IDs to notify"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ userId, notifyProjectOwners, notifyUserIds, ...rest }) => {
      const body: Record<string, unknown> = {
        ...rest,
        user: { userId },
      };
      if (notifyProjectOwners !== undefined || notifyUserIds) {
        body.notifyUsers = {
          projectOwners: notifyProjectOwners ?? false,
          others: (notifyUserIds ?? []).map((id) => ({ userId: id })),
        };
      }
      const result = await client.post("/time-offs", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete time-off
  server.registerTool(
    "rocketlane_delete_time_off",
    {
      title: "Delete Time-Off",
      description: "Delete a time-off record by ID.",
      inputSchema: {
        timeOffId: z.number().int().describe("Time-off ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ timeOffId }) => {
      await client.delete(`/time-offs/${timeOffId}`);
      return { content: [{ type: "text", text: `Time-off ${timeOffId} deleted successfully.` }] };
    }
  );
}
