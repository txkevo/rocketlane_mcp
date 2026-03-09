# Rocketlane MCP Server

A TypeScript [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes the full [Rocketlane REST API](https://docs.rocketlane.com) as LLM-callable tools.

**Disclaimers:** 

- This project is a proof of concept and is not affiliated or endorsed by the team at [Rocketlane](https://www.rocketlane.com). See [DISCLAIMERS.md](./DISCLAIMERS.md) before use.
- This project is distributed under the **MIT License**.
- This project comes with no support.

## Features

- **69 API endpoints** across 11 resources, all exposed as typed MCP tools
- Full CRUD for Tasks, Projects, Phases, Custom Fields, Spaces, and Space Documents
- Time Tracking (entries, categories) and Time-Off management
- Invoice read access (list, detail, payments, line items)
- Resource Allocation queries
- User listing
- Pagination, filtering, and sorting support on all list endpoints
- Actionable error messages with HTTP status and field context

## Covered Resources & Tools

| Resource | Tools |
|---|---|
| Tasks | list, get, create, update, delete, add/remove assignees, followers, dependencies, move to phase |
| Projects | list, get, create, update, delete, archive, get/add/remove members, import template |
| Phases | list, get, create, update, delete |
| Custom Fields | list, get, create, update, delete, add/remove options |
| Users | list, get |
| Spaces | list, get, create, update, delete |
| Time Tracking | list, get, create, update, delete, search, list categories |
| Time-Offs | list, get, create, delete |
| Space Documents | list, get, create, update, delete |
| Invoices | list, get, get payments, get line items |
| Resource Allocations | list |

## Setup

### Prerequisites
- Node.js 18+
- A Rocketlane API key (Settings → API in Rocketlane)

### Install

```bash
npm install
npm run build
```

### Run

```bash
ROCKETLANE_API_KEY=your_api_key_here node dist/index.js
```

### Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rocketlane": {
      "command": "node",
      "args": ["/path/to/rocketlane_mcp/dist/index.js"],
      "env": {
        "ROCKETLANE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Tool Naming Convention

All tools follow the pattern `rocketlane_<action>_<resource>`, e.g.:
- `rocketlane_list_tasks`
- `rocketlane_create_project`
- `rocketlane_get_invoice_payments`

## Development

```bash
npm run dev   # Run with ts-node (requires ROCKETLANE_API_KEY env var)
npm run build # Compile TypeScript to dist/
```
