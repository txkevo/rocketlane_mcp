import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerSpaceTools(server: McpServer, client: RocketlaneClient) {
  // List spaces
  server.registerTool(
    "rocketlane_list_spaces",
    {
      title: "List Spaces",
      description: "List all spaces across projects.",
      inputSchema: {
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/spaces", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get space
  server.registerTool(
    "rocketlane_get_space",
    {
      title: "Get Space",
      description: "Get a single space by its ID.",
      inputSchema: {
        spaceId: z.number().int().describe("Space ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ spaceId }) => {
      const result = await client.get(`/spaces/${spaceId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create space
  server.registerTool(
    "rocketlane_create_space",
    {
      title: "Create Space",
      description: "Create a new space within a project.",
      inputSchema: {
        spaceName: z.string().describe("Space name (required)"),
        projectId: z.number().int().describe("Project ID (required)"),
        private: z.boolean().optional().describe("Whether the space is private"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ projectId, ...rest }) => {
      const result = await client.post("/spaces", { ...rest, project: { projectId } });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update space
  server.registerTool(
    "rocketlane_update_space",
    {
      title: "Update Space",
      description: "Update a space by ID.",
      inputSchema: {
        spaceId: z.number().int().describe("Space ID to update"),
        spaceName: z.string().optional(),
        private: z.boolean().optional(),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ spaceId, ...body }) => {
      const result = await client.put(`/spaces/${spaceId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete space
  server.registerTool(
    "rocketlane_delete_space",
    {
      title: "Delete Space",
      description: "Permanently delete a space by ID.",
      inputSchema: {
        spaceId: z.number().int().describe("Space ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ spaceId }) => {
      await client.delete(`/spaces/${spaceId}`);
      return { content: [{ type: "text", text: `Space ${spaceId} deleted successfully.` }] };
    }
  );
}
