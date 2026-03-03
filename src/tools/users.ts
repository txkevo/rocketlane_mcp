import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerUserTools(server: McpServer, client: RocketlaneClient) {
  // List users
  server.registerTool(
    "rocketlane_list_users",
    {
      title: "List Users",
      description: "List all users in the workspace.",
      inputSchema: {
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/users", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get user
  server.registerTool(
    "rocketlane_get_user",
    {
      title: "Get User",
      description: "Get a single user by their ID.",
      inputSchema: {
        userId: z.number().int().describe("User ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ userId }) => {
      const result = await client.get(`/users/${userId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
