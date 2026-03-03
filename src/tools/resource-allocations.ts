import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerResourceAllocationTools(server: McpServer, client: RocketlaneClient) {
  // List resource allocations
  server.registerTool(
    "rocketlane_list_resource_allocations",
    {
      title: "List Resource Allocations",
      description:
        "List resource allocations for team members or placeholders. startDate and endDate are required to define the date range window.",
      inputSchema: {
        startDate: z.string().describe("Start of date range YYYY-MM-DD (required)"),
        endDate: z.string().describe("End of date range YYYY-MM-DD (required)"),
        "memberId.eq": z.number().int().optional().describe("Filter: specific member user ID"),
        "memberId.oneOf": z.string().optional().describe("Filter: comma-separated member user IDs"),
        "projectId.eq": z.number().int().optional().describe("Filter: specific project ID"),
        "projectId.oneOf": z.string().optional().describe("Filter: comma-separated project IDs"),
        "placeholderId.eq": z.number().int().optional().describe("Filter: specific placeholder ID"),
        sortBy: z.enum(["startDate", "endDate", "allocationType", "allocationFor"]).optional(),
        includeFields: z.string().optional().describe("Comma-separated: member,task,placeholder,duration"),
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/resource-allocations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
