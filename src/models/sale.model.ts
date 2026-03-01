/**
 * Sale Model
 * Mirrors the Firestore document structure for the `sales` collection.
 *
 * Firestore path: /sales/{saleId}
 */

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string; // e.g. "INV-2024-0001"
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number; // percentage, e.g. 10 for 10%
  taxAmount: number;
  total: number;
  paymentMethod: "cash" | "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  status: "pending" | "completed" | "cancelled" | "refunded";
  notes: string;
  date: string; // ISO date string
  createdAt: string;
}

export type SaleInput = Omit<Sale, "id" | "invoiceNumber" | "taxAmount" | "total" | "createdAt">;

/**
 * Generates a sequential invoice number.
 * Format: INV-YYYY-NNNN
 */
export function generateInvoiceNumber(count: number): string {
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, "0");
  return `INV-${year}-${seq}`;
}

/**
 * Sample Firestore data structure:
 * {
 *   invoiceNumber: "INV-2024-0001",
 *   customerId: "cust_001",
 *   customerName: "Alice Johnson",
 *   items: [
 *     { productId: "prod_001", productName: "Wireless Headphones", quantity: 2, unitPrice: 79.99, subtotal: 159.98 }
 *   ],
 *   subtotal: 159.98,
 *   tax: 10,
 *   taxAmount: 16.00,
 *   total: 175.98,
 *   paymentMethod: "credit_card",
 *   status: "completed",
 *   notes: "",
 *   date: "2024-02-28",
 *   createdAt: "2024-02-28T14:30:00Z"
 * }
 */
