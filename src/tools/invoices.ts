import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { RocketlaneClient } from "../client.js";

export function registerInvoiceTools(server: McpServer, client: RocketlaneClient) {
  // List/search invoices
  server.registerTool(
    "rocketlane_list_invoices",
    {
      title: "List Invoices",
      description: "List or search invoices. Filter by status, company, date, amount, or invoice number.",
      inputSchema: {
        pageSize: z.number().int().optional(),
        pageToken: z.string().optional(),
        "status.eq": z.string().optional().describe("Filter: exact status (DRAFT, PAID, OVERDUE)"),
        "status.oneOf": z.string().optional().describe("Filter: comma-separated statuses"),
        "companyId.eq": z.number().int().optional().describe("Filter: company ID"),
        "companyId.oneOf": z.string().optional().describe("Filter: comma-separated company IDs"),
        "dateOfIssue.ge": z.string().optional().describe("Filter: issue date >= YYYY-MM-DD"),
        "dateOfIssue.le": z.string().optional().describe("Filter: issue date <= YYYY-MM-DD"),
        "dueDate.ge": z.string().optional().describe("Filter: due date >= YYYY-MM-DD"),
        "dueDate.le": z.string().optional().describe("Filter: due date <= YYYY-MM-DD"),
        "amount.ge": z.number().optional().describe("Filter: total amount >="),
        "amount.le": z.number().optional().describe("Filter: total amount <="),
        "amountOutstanding.gt": z.number().optional().describe("Filter: outstanding amount >"),
        "invoiceNumber.cn": z.string().optional().describe("Filter: invoice number contains"),
        sortBy: z.enum(["createdAt", "invoiceNumber"]).optional(),
        includeFields: z.string().optional().describe("Comma-separated: notes,attachments"),
      },
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      const result = await client.get("/invoices", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get invoice
  server.registerTool(
    "rocketlane_get_invoice",
    {
      title: "Get Invoice",
      description: "Get a single invoice by its ID with full details.",
      inputSchema: {
        invoiceId: z.number().int().describe("Invoice ID"),
        includeFields: z.string().optional().describe("Comma-separated: notes,attachments"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ invoiceId, includeFields }) => {
      const params = includeFields ? { includeFields } : undefined;
      const result = await client.get(`/invoices/${invoiceId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get invoice payments
  server.registerTool(
    "rocketlane_get_invoice_payments",
    {
      title: "Get Invoice Payments",
      description: "Get all payment records for a specific invoice.",
      inputSchema: {
        invoiceId: z.number().int().describe("Invoice ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ invoiceId }) => {
      const result = await client.get(`/invoices/${invoiceId}/payments`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // Get invoice line items
  server.registerTool(
    "rocketlane_get_invoice_line_items",
    {
      title: "Get Invoice Line Items",
      description: "Get all line items for a specific invoice.",
      inputSchema: {
        invoiceId: z.number().int().describe("Invoice ID"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ invoiceId }) => {
      const result = await client.get(`/invoices/${invoiceId}/lines`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
