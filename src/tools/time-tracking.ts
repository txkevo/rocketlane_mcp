import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerTimeTrackingTools(server: McpServer, client: RocketlaneClient) {
  // List time entries
  server.registerTool(
    "rocketlane_list_time_entries",
    {
      title: "List Time Entries",
      description: "List or search time entries. Filter by date range, user, project, task, billable status, or category.",
      inputSchema: {
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
        "date.ge": z.string().optional().describe("Filter: date >= YYYY-MM-DD"),
        "date.le": z.string().optional().describe("Filter: date <= YYYY-MM-DD"),
        "date.eq": z.string().optional().describe("Filter: exact date YYYY-MM-DD"),
        "billable.eq": z.boolean().optional().describe("Filter: billable status"),
        "userId.eq": z.number().int().optional().describe("Filter: user ID"),
        "userId.oneOf": z.string().optional().describe("Filter: comma-separated user IDs"),
        "projectId.eq": z.number().int().optional().describe("Filter: project ID"),
        "projectId.oneOf": z.string().optional().describe("Filter: comma-separated project IDs"),
        "taskId.eq": z.number().int().optional().describe("Filter: task ID"),
        "categoryId.eq": z.number().int().optional().describe("Filter: category ID"),
        sortBy: z.enum(["date", "minutes"]).optional(),
        includeFields: z.string().optional().describe("Comma-separated: notes,category"),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/time-entries", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get time entry
  server.registerTool(
    "rocketlane_get_time_entry",
    {
      title: "Get Time Entry",
      description: "Get a single time entry by its ID.",
      inputSchema: {
        timeEntryId: z.number().int().describe("Time entry ID"),
        includeFields: z.string().optional().describe("Comma-separated: notes,category"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ timeEntryId, includeFields }) => {
      const params = includeFields ? { includeFields } : undefined;
      const result = await client.get(`/time-entries/${timeEntryId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create time entry
  server.registerTool(
    "rocketlane_create_time_entry",
    {
      title: "Create Time Entry",
      description: "Log a time entry for a user on a task or project.",
      inputSchema: {
        userId: z.number().int().describe("User ID (required)"),
        minutes: z.number().int().describe("Duration in minutes (required)"),
        date: z.string().describe("Date YYYY-MM-DD (required)"),
        taskId: z.number().int().optional().describe("Task ID"),
        projectId: z.number().int().optional().describe("Project ID"),
        billable: z.boolean().optional(),
        categoryId: z.number().int().optional(),
        notes: z.string().optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      const result = await client.post("/time-entries", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update time entry
  server.registerTool(
    "rocketlane_update_time_entry",
    {
      title: "Update Time Entry",
      description: "Update an existing time entry by ID.",
      inputSchema: {
        timeEntryId: z.number().int().describe("Time entry ID to update"),
        minutes: z.number().int().optional(),
        date: z.string().optional().describe("YYYY-MM-DD"),
        billable: z.boolean().optional(),
        categoryId: z.number().int().optional(),
        notes: z.string().optional(),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ timeEntryId, ...body }) => {
      const result = await client.put(`/time-entries/${timeEntryId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete time entry
  server.registerTool(
    "rocketlane_delete_time_entry",
    {
      title: "Delete Time Entry",
      description: "Permanently delete a time entry by ID.",
      inputSchema: {
        timeEntryId: z.number().int().describe("Time entry ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ timeEntryId }) => {
      await client.delete(`/time-entries/${timeEntryId}`);
      return { content: [{ type: "text", text: `Time entry ${timeEntryId} deleted successfully.` }] };
    }
  );

  // Search time entries
  server.registerTool(
    "rocketlane_search_time_entries",
    {
      title: "Search Time Entries (Advanced)",
      description: "Advanced search for time entries using POST body filters.",
      inputSchema: {
        filters: z.record(z.unknown()).optional().describe("Filter object with field.operator keys"),
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.post("/time-entries/search", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // List time entry categories
  server.registerTool(
    "rocketlane_list_time_entry_categories",
    {
      title: "List Time Entry Categories",
      description: "List all available time entry categories.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      const result = await client.get("/time-entry-categories");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
