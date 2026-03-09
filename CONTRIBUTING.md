# Contributing to Rocketlane MCP Server

Thanks for your interest in contributing! This is a community project maintained on a best-effort basis. All contributions are welcome.

## Before You Start

- This is an **unofficial** project, not affiliated with Rocketlane. See [DISCLAIMERS.md](./DISCLAIMERS.md).
- Please review the [Rocketlane API docs](https://docs.rocketlane.com) if you're adding or modifying tool coverage.

## Ways to Contribute

- **Bug reports** — Open a GitHub Issue with steps to reproduce and the API response or error you're seeing.
- **New tools or resources** — If the Rocketlane API has endpoints not yet covered, PRs are welcome.
- **Fixes for broken tools** — The Rocketlane API may change without notice. If something breaks, please open an issue or submit a fix.
- **Documentation improvements** — Corrections or clarifications to the README or docs are always appreciated.

## Development Setup

```bash
git clone https://github.com/txkevo/rocketlane_mcp.git
cd rocketlane_mcp
npm install
```

Copy your Rocketlane API key into your environment:

```bash
export ROCKETLANE_API_KEY=your_api_key_here
```

Build and run:

```bash
npm run build
node dist/index.js
```

## Adding a New Tool

Tools are registered in `src/index.ts` using the MCP SDK's `registerTool` pattern. Follow the existing conventions:

- **Naming:** `rocketlane_[action]_[resource]` (e.g. `rocketlane_create_task`)
- **Input validation:** Use `zod` schemas for all parameters
- **Error handling:** Return meaningful error messages including the HTTP status and any field-level errors from the Rocketlane API

## Submitting a Pull Request

1. Fork the repo and create a branch from `main`
2. Make your changes and verify the build passes (`npm run build`)
3. Open a PR with a clear description of what changed and why
4. PRs may not be reviewed immediately — this is a volunteer project

## No Guarantees

There is no SLA on issue responses or PR reviews. If you need a fix urgently, please fork and adapt the project for your own use.
