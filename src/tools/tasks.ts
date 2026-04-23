import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerTaskTools(server: McpServer, client: RocketlaneClient) {
  // List / search tasks
  server.registerTool(
    "rocketlane_list_tasks",
    {
      title: "List Tasks",
      description:
        "List or search tasks across all projects. Supports filtering by status, priority, assignee, project, phase, and dates. Returns paginated results.",
      inputSchema: {
        pageSize: z.number().int().min(1).max(500).optional().describe("Results per page (default 100)"),
        pageToken: z.string().optional().describe("Pagination token for next page"),
        "taskName.cn": z.string().optional().describe("Filter: task name contains"),
        "status.eq": z.string().optional().describe("Filter: exact status"),
        "status.oneOf": z.string().optional().describe("Filter: status in comma-separated list"),
        "priority.eq": z.enum(["LOW", "MEDIUM", "HIGH"]).optional().describe("Filter: exact priority"),
        "priority.oneOf": z.string().optional().describe("Filter: priority in comma-separated list (LOW,MEDIUM,HIGH)"),
        "startDate.ge": z.string().optional().describe("Filter: start date >= YYYY-MM-DD"),
        "startDate.le": z.string().optional().describe("Filter: start date <= YYYY-MM-DD"),
        "dueDate.ge": z.string().optional().describe("Filter: due date >= YYYY-MM-DD"),
        "dueDate.le": z.string().optional().describe("Filter: due date <= YYYY-MM-DD"),
        "assignee.eq": z.number().int().optional().describe("Filter: assigned to userId"),
        "projectId.eq": z.number().int().optional().describe("Filter: exact project ID"),
        "projectId.oneOf": z.string().optional().describe("Filter: project IDs (comma-separated)"),
        "phaseId.eq": z.number().int().optional().describe("Filter: exact phase ID"),
        sortBy: z.enum(["taskName", "startDate", "dueDate", "priority", "status"]).optional(),
        includeFields: z.string().optional().describe("Comma-separated: description,assignees,followers,dependencies,fields,estimatedMinutes"),
        match: z.enum(["all", "any"]).optional().describe("Combine filters with AND (all) or OR (any)"),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/tasks", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get task by ID
  server.registerTool(
    "rocketlane_get_task",
    {
      title: "Get Task",
      description: "Get a single task by its ID with optional additional fields.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        includeFields: z.string().optional().describe("Comma-separated: description,assignees,followers,dependencies,fields,estimatedMinutes"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ taskId, includeFields }) => {
      const params = includeFields ? { includeFields } : undefined;
      const result = await client.get(`/tasks/${taskId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Create task
  server.registerTool(
    "rocketlane_create_task",
    {
      title: "Create Task",
      description: "Create a new task in a project/phase.",
      inputSchema: {
        taskName: z.string().describe("Task name (required)"),
        projectId: z.number().int().optional().describe("Project ID to create task in"),
        phaseId: z.number().int().optional().describe("Phase ID to create task in"),
        description: z.string().optional(),
        status: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        startDate: z.string().optional().describe("YYYY-MM-DD"),
        dueDate: z.string().optional().describe("YYYY-MM-DD"),
        estimatedMinutes: z.number().int().optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async ({ projectId, phaseId, description, estimatedMinutes, ...rest }) => {
      const body: Record<string, unknown> = { ...rest };
      if (projectId !== undefined) body.project = { projectId };
      if (phaseId !== undefined) body.phase = { phaseId };
      if (description !== undefined) body.taskDescription = description;
      if (estimatedMinutes !== undefined) body.effortInMinutes = estimatedMinutes;
      const result = await client.post("/tasks", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Update task
  server.registerTool(
    "rocketlane_update_task",
    {
      title: "Update Task",
      description: "Update an existing task by ID.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID to update"),
        taskName: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        startDate: z.string().optional().describe("YYYY-MM-DD"),
        dueDate: z.string().optional().describe("YYYY-MM-DD"),
        estimatedMinutes: z.number().int().optional(),
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
    },
    async ({ taskId, ...body }) => {
      const result = await client.put(`/tasks/${taskId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Delete task
  server.registerTool(
    "rocketlane_delete_task",
    {
      title: "Delete Task",
      description: "Permanently delete a task by ID.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID to delete"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ taskId }) => {
      await client.delete(`/tasks/${taskId}`);
      return { content: [{ type: "text", text: `Task ${taskId} deleted successfully.` }] };
    }
  );

  // Add assignees
  server.registerTool(
    "rocketlane_add_task_assignees",
    {
      title: "Add Task Assignees",
      description: "Add one or more users as assignees to a task.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        userIds: z.array(z.number().int()).describe("Array of user IDs to assign"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ taskId, userIds }) => {
      const result = await client.post(`/tasks/${taskId}/assignees`, {
        assignees: userIds.map((userId) => ({ userId })),
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Remove assignees
  server.registerTool(
    "rocketlane_remove_task_assignees",
    {
      title: "Remove Task Assignees",
      description: "Remove one or more users from a task's assignees.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        userIds: z.array(z.number().int()).describe("Array of user IDs to remove"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ taskId, userIds }) => {
      await client.delete(`/tasks/${taskId}/assignees`, {
        assignees: userIds.map((userId) => ({ userId })),
      });
      return { content: [{ type: "text", text: `Assignees removed from task ${taskId}.` }] };
    }
  );

  // Add followers
  server.registerTool(
    "rocketlane_add_task_followers",
    {
      title: "Add Task Followers",
      description: "Add one or more users as followers to a task.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        userIds: z.array(z.number().int()).describe("Array of user IDs to add as followers"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ taskId, userIds }) => {
      const result = await client.post(`/tasks/${taskId}/followers`, {
        followers: userIds.map((userId) => ({ userId })),
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Remove followers
  server.registerTool(
    "rocketlane_remove_task_followers",
    {
      title: "Remove Task Followers",
      description: "Remove one or more users from a task's followers.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        userIds: z.array(z.number().int()).describe("Array of user IDs to remove as followers"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ taskId, userIds }) => {
      await client.delete(`/tasks/${taskId}/followers`, {
        followers: userIds.map((userId) => ({ userId })),
      });
      return { content: [{ type: "text", text: `Followers removed from task ${taskId}.` }] };
    }
  );

  // Add dependencies
  server.registerTool(
    "rocketlane_add_task_dependencies",
    {
      title: "Add Task Dependencies",
      description: "Add task dependencies (tasks that must complete before this one).",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        dependencyTaskIds: z.array(z.number().int()).describe("Task IDs that this task depends on"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ taskId, dependencyTaskIds }) => {
      const result = await client.post(`/tasks/${taskId}/add-dependencies`, {
        dependencies: dependencyTaskIds.map((id) => ({ taskId: id })),
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Remove dependencies
  server.registerTool(
    "rocketlane_remove_task_dependencies",
    {
      title: "Remove Task Dependencies",
      description: "Remove task dependencies.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        dependencyTaskIds: z.array(z.number().int()).describe("Task IDs to remove as dependencies"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true },
    },
    async ({ taskId, dependencyTaskIds }) => {
      await client.delete(`/tasks/${taskId}/dependencies`, {
        dependencies: dependencyTaskIds.map((id) => ({ taskId: id })),
      });
      return { content: [{ type: "text", text: `Dependencies removed from task ${taskId}.` }] };
    }
  );

  // Move task to phase
  server.registerTool(
    "rocketlane_move_task_to_phase",
    {
      title: "Move Task to Phase",
      description: "Move a task to a different phase within its project.",
      inputSchema: {
        taskId: z.number().int().describe("Task ID"),
        phaseId: z.number().int().describe("Target phase ID"),
      },
      annotations: { readOnlyHint: false },
    },
    async ({ taskId, phaseId }) => {
      const result = await client.post(`/tasks/${taskId}/move-to-phase`, { phaseId });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
