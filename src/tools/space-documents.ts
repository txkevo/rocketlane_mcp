import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerSpaceDocumentTools(server: McpServer, client: RocketlaneClient) {
  // List space documents
  server.registerTool(
    "rocketlane_list_space_documents",
    {
      title: "List Space Documents",
      description: "List all space documents for a project. The projectId is required.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID (required)"),
        "spaceDocumentName.cn": z.string().optional().describe("Filter: document name contains"),
        "spaceId.eq": z.number().int().optional().describe("Filter: specific space ID"),
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
        sortBy: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/space-documents", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get space document
  server.registerTool(
    "rocketlane_get_space_document",
    {
      title: "Get Space Document",
      description: "Get a single space document by its ID.",
      inputSchema: {
        spaceDocumentId: z.number().int().describe("Space document ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ spaceDocumentId }) => {
      const result = await client.get(`/space-documents/${spaceDocumentId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create space document
  server.registerTool(
    "rocketlane_create_space_document",
    {
      title: "Create Space Document",
      description: "Create a new document in a space. Use ROCKETLANE_DOCUMENT for native docs or EMBEDDED_DOCUMENT for external URLs.",
      inputSchema: {
        spaceId: z.number().int().describe("Space ID (required)"),
        spaceDocumentType: z.enum(["ROCKETLANE_DOCUMENT", "EMBEDDED_DOCUMENT"]).describe("Document type (required)"),
        spaceDocumentName: z.string().optional().describe("Document name (default: Untitled)"),
        url: z.string().optional().describe("URL for EMBEDDED_DOCUMENT type"),
        private: z.boolean().optional(),
        templateId: z.number().int().optional().describe("Template ID to create from"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ spaceId, templateId, ...rest }) => {
      const body: Record<string, unknown> = {
        ...rest,
        space: { spaceId },
      };
      if (templateId) {
        body.source = { templateId };
      }
      const result = await client.post("/space-documents", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update space document
  server.registerTool(
    "rocketlane_update_space_document",
    {
      title: "Update Space Document",
      description: "Update a space document's name or URL (for embedded docs).",
      inputSchema: {
        spaceDocumentId: z.number().int().describe("Space document ID to update"),
        spaceDocumentName: z.string().optional(),
        url: z.string().optional().describe("New URL (for EMBEDDED_DOCUMENT only)"),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ spaceDocumentId, ...body }) => {
      const result = await client.put(`/space-documents/${spaceDocumentId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete space document
  server.registerTool(
    "rocketlane_delete_space_document",
    {
      title: "Delete Space Document",
      description: "Permanently delete a space document by ID.",
      inputSchema: {
        spaceDocumentId: z.number().int().describe("Space document ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ spaceDocumentId }) => {
      await client.delete(`/space-documents/${spaceDocumentId}`);
      return { content: [{ type: "text", text: `Space document ${spaceDocumentId} deleted successfully.` }] };
    }
  );
}
