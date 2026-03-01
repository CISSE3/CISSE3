/**
 * CSV Export Utility
 *
 * Generates and downloads CSV files for sales reports.
 * Equivalent to Flutter's csv package integration.
 */

import { Sale } from "@/models/sale.model";

/**
 * Convert an array of objects to CSV string.
 */
function objectsToCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) =>
    `"${val.replace(/"/g, '""')}"`;

  const headerRow = headers.map(escape).join(",");
  const dataRows = rows.map((row) => row.map(escape).join(","));
  return [headerRow, ...dataRows].join("\n");
}

/**
 * Trigger a browser download of a CSV file.
 */
function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export sales data to CSV.
 * Includes invoice number, customer, items, totals, status, and date.
 */
export function exportSalesToCSV(sales: Sale[], filename?: string): void {
  const headers = [
    "Invoice Number",
    "Date",
    "Customer",
    "Items",
    "Subtotal",
    "Tax (%)",
    "Tax Amount",
    "Total",
    "Payment Method",
    "Status",
    "Notes",
  ];

  const rows = sales.map((sale) => [
    sale.invoiceNumber,
    sale.date,
    sale.customerName,
    sale.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
    sale.subtotal.toFixed(2),
    sale.tax.toString(),
    sale.taxAmount.toFixed(2),
    sale.total.toFixed(2),
    sale.paymentMethod.replace(/_/g, " "),
    sale.status,
    sale.notes,
  ]);

  const csv = objectsToCSV(headers, rows);
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(filename || `sales-report-${date}.csv`, csv);
}

/**
 * Export daily sales summary to CSV.
 */
export function exportDailySummaryCSV(sales: Sale[], date: string): void {
  const daySales = sales.filter((s) => s.date === date && s.status === "completed");
  exportSalesToCSV(daySales, `daily-report-${date}.csv`);
}

/**
 * Export monthly sales summary to CSV.
 */
export function exportMonthlySummaryCSV(sales: Sale[], year: number, month: number): void {
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;
  const monthlySales = sales.filter(
    (s) => s.date.startsWith(prefix) && s.status === "completed"
  );
  exportSalesToCSV(monthlySales, `monthly-report-${prefix}.csv`);
}
