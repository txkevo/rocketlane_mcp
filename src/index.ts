#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { RocketlaneClient } from "./client.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerPhaseTools } from "./tools/phases.js";
import { registerFieldTools } from "./tools/fields.js";
import { registerUserTools } from "./tools/users.js";
import { registerSpaceTools } from "./tools/spaces.js";
import { registerTimeTrackingTools } from "./tools/time-tracking.js";
import { registerTimeOffTools } from "./tools/time-offs.js";
import { registerSpaceDocumentTools } from "./tools/space-documents.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerResourceAllocationTools } from "./tools/resource-allocations.js";

const API_KEY = process.env.ROCKETLANE_API_KEY;
if (!API_KEY) {
  console.error("Error: ROCKETLANE_API_KEY environment variable is required.");
  process.exit(1);
}

const client = new RocketlaneClient(API_KEY);

const server = new McpServer({
  name: "rocketlane",
  version: "1.0.0",
});

// Register all tool groups
registerTaskTools(server, client);
registerProjectTools(server, client);
registerPhaseTools(server, client);
registerFieldTools(server, client);
registerUserTools(server, client);
registerSpaceTools(server, client);
registerTimeTrackingTools(server, client);
registerTimeOffTools(server, client);
registerSpaceDocumentTools(server, client);
registerInvoiceTools(server, client);
registerResourceAllocationTools(server, client);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Rocketlane MCP server running on stdio");
