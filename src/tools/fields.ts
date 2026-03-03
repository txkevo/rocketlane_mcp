import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerFieldTools(server: McpServer, client: RocketlaneClient) {
  // List fields
  server.registerTool(
    "rocketlane_list_fields",
    {
      title: "List Custom Fields",
      description: "List all custom fields defined in the workspace.",
      inputSchema: {
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/fields", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get field
  server.registerTool(
    "rocketlane_get_field",
    {
      title: "Get Custom Field",
      description: "Get a custom field by its ID.",
      inputSchema: {
        fieldId: z.number().int().describe("Field ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ fieldId }) => {
      const result = await client.get(`/fields/${fieldId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create field
  server.registerTool(
    "rocketlane_create_field",
    {
      title: "Create Custom Field",
      description: "Create a new custom field for tasks, projects, or invoices.",
      inputSchema: {
        fieldLabel: z.string().describe("Display label for the field"),
        fieldType: z.enum(["TEXT", "NUMBER", "DATE", "DROPDOWN", "MULTI_SELECT", "CHECKBOX", "URL"]).describe("Field type"),
        entityType: z.enum(["TASK", "PROJECT", "INVOICE"]).describe("Entity this field applies to"),
        required: z.boolean().optional().describe("Whether the field is required"),
        options: z.array(z.string()).optional().describe("Options for DROPDOWN or MULTI_SELECT types"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ options, ...rest }) => {
      const body: Record<string, unknown> = { ...rest };
      if (options) {
        body.options = options.map((o) => ({ label: o }));
      }
      const result = await client.post("/fields", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update field
  server.registerTool(
    "rocketlane_update_field",
    {
      title: "Update Custom Field",
      description: "Update a custom field by ID.",
      inputSchema: {
        fieldId: z.number().int().describe("Field ID to update"),
        fieldLabel: z.string().optional(),
        required: z.boolean().optional(),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ fieldId, ...body }) => {
      const result = await client.put(`/fields/${fieldId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete field
  server.registerTool(
    "rocketlane_delete_field",
    {
      title: "Delete Custom Field",
      description: "Permanently delete a custom field by ID.",
      inputSchema: {
        fieldId: z.number().int().describe("Field ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ fieldId }) => {
      await client.delete(`/fields/${fieldId}`);
      return { content: [{ type: "text", text: `Field ${fieldId} deleted successfully.` }] };
    }
  );

  // Add field options
  server.registerTool(
    "rocketlane_add_field_options",
    {
      title: "Add Field Options",
      description: "Add options to a DROPDOWN or MULTI_SELECT custom field.",
      inputSchema: {
        fieldId: z.number().int().describe("Field ID"),
        options: z.array(z.string()).describe("Option labels to add"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ fieldId, options }) => {
      const result = await client.post(`/fields/${fieldId}/options`, {
        options: options.map((o) => ({ label: o })),
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Remove field options
  server.registerTool(
    "rocketlane_remove_field_options",
    {
      title: "Remove Field Options",
      description: "Remove options from a DROPDOWN or MULTI_SELECT custom field.",
      inputSchema: {
        fieldId: z.number().int().describe("Field ID"),
        optionIds: z.array(z.number().int()).describe("Option IDs to remove"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ fieldId, optionIds }) => {
      await client.delete(`/fields/${fieldId}/options`, {
        options: optionIds.map((optionId) => ({ optionId })),
      });
      return { content: [{ type: "text", text: `Options removed from field ${fieldId}.` }] };
    }
  );
}
