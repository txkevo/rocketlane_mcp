import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerPhaseTools(server: McpServer, client: RocketlaneClient) {
  // List phases
  server.registerTool(
    "rocketlane_list_phases",
    {
      title: "List Phases",
      description: "List all phases for a given project. The projectId filter is required.",
      inputSchema: {
        "projectId.eq": z.number().int().describe("Project ID (required)"),
        "phaseName.cn": z.string().optional().describe("Filter: phase name contains"),
        sortBy: z.enum(["phaseName", "startDate", "dueDate"]).optional(),
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/phases", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get phase
  server.registerTool(
    "rocketlane_get_phase",
    {
      title: "Get Phase",
      description: "Get a single phase by its ID.",
      inputSchema: {
        phaseId: z.number().int().describe("Phase ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ phaseId }) => {
      const result = await client.get(`/phases/${phaseId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create phase
  server.registerTool(
    "rocketlane_create_phase",
    {
      title: "Create Phase",
      description: "Create a new phase in a project.",
      inputSchema: {
        phaseName: z.string().describe("Phase name (required)"),
        projectId: z.number().int().describe("Project ID (required)"),
        startDate: z.string().optional().describe("YYYY-MM-DD"),
        dueDate: z.string().optional().describe("YYYY-MM-DD"),
        order: z.number().int().optional().describe("Display order"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      const result = await client.post("/phases", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update phase
  server.registerTool(
    "rocketlane_update_phase",
    {
      title: "Update Phase",
      description: "Update an existing phase by ID.",
      inputSchema: {
        phaseId: z.number().int().describe("Phase ID to update"),
        phaseName: z.string().optional(),
        startDate: z.string().optional().describe("YYYY-MM-DD"),
        dueDate: z.string().optional().describe("YYYY-MM-DD"),
        order: z.number().int().optional(),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ phaseId, ...body }) => {
      const result = await client.put(`/phases/${phaseId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete phase
  server.registerTool(
    "rocketlane_delete_phase",
    {
      title: "Delete Phase",
      description: "Permanently delete a phase by ID.",
      inputSchema: {
        phaseId: z.number().int().describe("Phase ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ phaseId }) => {
      await client.delete(`/phases/${phaseId}`);
      return { content: [{ type: "text", text: `Phase ${phaseId} deleted successfully.` }] };
    }
  );
}
