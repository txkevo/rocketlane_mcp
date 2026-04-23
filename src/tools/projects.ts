import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerProjectTools(server: McpServer, client: RocketlaneClient) {
  // List projects
  server.registerTool(
    "rocketlane_list_projects",
    {
      title: "List Projects",
      description: "List or search all projects. Filter by name, status, owner, company, dates, or members.",
      inputSchema: {
        pageSize: z.number().int().min(1).max(500).optional(),
        pageToken: z.string().optional(),
        "projectName.cn": z.string().optional().describe("Filter: project name contains"),
        "status.eq": z.string().optional().describe("Filter: exact status"),
        "status.oneOf": z.string().optional().describe("Filter: comma-separated statuses"),
        "startDate.ge": z.string().optional().describe("Filter: start date >= YYYY-MM-DD"),
        "startDate.le": z.string().optional().describe("Filter: start date <= YYYY-MM-DD"),
        "dueDate.ge": z.string().optional().describe("Filter: due date >= YYYY-MM-DD"),
        "dueDate.le": z.string().optional().describe("Filter: due date <= YYYY-MM-DD"),
        "ownerId.eq": z.number().int().optional().describe("Filter: owner user ID"),
        "companyId.eq": z.number().int().optional().describe("Filter: company ID"),
        "member.eq": z.number().int().optional().describe("Filter: member user ID"),
        sortBy: z.enum(["projectName", "startDate", "dueDate", "status", "createdAt"]).optional(),
        includeFields: z.string().optional().describe("Comma-separated: description,members,placeholders,fields"),
        match: z.enum(["all", "any"]).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/projects", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get project
  server.registerTool(
    "rocketlane_get_project",
    {
      title: "Get Project",
      description: "Get a single project by ID.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID"),
        includeFields: z.string().optional().describe("Comma-separated: description,members,placeholders,fields"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ projectId, includeFields }) => {
      const params = includeFields ? { includeFields } : undefined;
      const result = await client.get(`/projects/${projectId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create project
  server.registerTool(
    "rocketlane_create_project",
    {
      title: "Create Project",
      description: "Create a new project.",
      inputSchema: {
        projectName: z.string().describe("Project name (required)"),
        description: z.string().optional(),
        status: z.string().optional(),
        startDate: z.string().optional().describe("YYYY-MM-DD"),
        dueDate: z.string().optional().describe("YYYY-MM-DD"),
        ownerId: z.number().int().optional().describe("Owner user ID"),
        companyId: z.number().int().optional().describe("Company ID"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ ownerId, companyId, ...rest }) => {
      const body: Record<string, unknown> = { ...rest };
      if (ownerId !== undefined) body.owner = { userId: ownerId };
      if (companyId !== undefined) body.customer = { companyId };
      const result = await client.post("/projects", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update project
  server.registerTool(
    "rocketlane_update_project",
    {
      title: "Update Project",
      description: "Update an existing project by ID.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID to update"),
        projectName: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        startDate: z.string().optional().describe("YYYY-MM-DD"),
        dueDate: z.string().optional().describe("YYYY-MM-DD"),
        ownerId: z.number().int().optional(),
        companyId: z.number().int().optional(),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ projectId, ownerId, companyId, ...rest }) => {
      const body: Record<string, unknown> = { ...rest };
      if (ownerId !== undefined) body.owner = { userId: ownerId };
      if (companyId !== undefined) body.customer = { companyId };
      const result = await client.put(`/projects/${projectId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete project
  server.registerTool(
    "rocketlane_delete_project",
    {
      title: "Delete Project",
      description: "Permanently delete a project by ID.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ projectId }) => {
      await client.delete(`/projects/${projectId}`);
      return { content: [{ type: "text", text: `Project ${projectId} deleted successfully.` }] };
    }
  );

  // Archive project
  server.registerTool(
    "rocketlane_archive_project",
    {
      title: "Archive Project",
      description: "Archive a project (non-destructive, can be unarchived).",
      inputSchema: {
        projectId: z.number().int().describe("Project ID to archive"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ projectId }) => {
      const result = await client.post(`/projects/${projectId}/archive`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get project members
  server.registerTool(
    "rocketlane_get_project_members",
    {
      title: "Get Project Members",
      description: "Get all members of a project.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ projectId }) => {
      const result = await client.get(`/projects/${projectId}/members`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Add project members
  server.registerTool(
    "rocketlane_add_project_members",
    {
      title: "Add Project Members",
      description: "Add users as members to a project.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID"),
        userIds: z.array(z.number().int()).describe("User IDs to add as members"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ projectId, userIds }) => {
      const result = await client.post(`/projects/${projectId}/members`, {
        members: userIds.map((userId) => ({ userId })),
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Remove project members
  server.registerTool(
    "rocketlane_remove_project_members",
    {
      title: "Remove Project Members",
      description: "Remove users from a project's member list.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID"),
        userIds: z.array(z.number().int()).describe("User IDs to remove"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ projectId, userIds }) => {
      await client.delete(`/projects/${projectId}/members`, {
        members: userIds.map((userId) => ({ userId })),
      });
      return { content: [{ type: "text", text: `Members removed from project ${projectId}.` }] };
    }
  );

  // Import template into project
  server.registerTool(
    "rocketlane_import_template_to_project",
    {
      title: "Import Template into Project",
      description: "Import a template into an existing project to populate phases and tasks.",
      inputSchema: {
        projectId: z.number().int().describe("Project ID"),
        templateId: z.number().int().describe("Template ID to import"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ projectId, templateId }) => {
      const result = await client.post(`/projects/${projectId}/import-template`, { templateId });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
