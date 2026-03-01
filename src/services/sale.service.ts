/**
 * Sale Service
 * Handles Firestore CRUD for the `sales` collection.
 * Automatically reduces product stock and updates customer totals on sale creation.
 *
 * Equivalent to Flutter's SaleService using cloud_firestore package.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "@/core/firebase";
import { Sale, SaleInput, generateInvoiceNumber } from "@/models/sale.model";
import { deriveStockStatus } from "@/models/product.model";

const COLLECTION = "sales";

/**
 * Fetch all sales from Firestore, ordered by date descending.
 */
export async function getSales(): Promise<Sale[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Sale));
}

/**
 * Create a new sale.
 * Uses a Firestore batch write to:
 * 1. Create the sale document
 * 2. Reduce stock for each product
 * 3. Update customer's totalOrders and totalSpent
 */
export async function createSale(
  input: SaleInput,
  currentSaleCount: number,
  productStocks: Record<string, number>
): Promise<string> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // Calculate totals
  const taxAmount = (input.subtotal * input.tax) / 100;
  const total = input.subtotal + taxAmount;
  const invoiceNumber = generateInvoiceNumber(currentSaleCount);

  // Create sale document
  const saleRef = doc(collection(db, COLLECTION));
  batch.set(saleRef, {
    ...input,
    invoiceNumber,
    taxAmount,
    total,
    createdAt: now,
  });

  // Reduce stock for each product
  for (const item of input.items) {
    const productRef = doc(db, "products", item.productId);
    const currentStock = productStocks[item.productId] ?? 0;
    const newStock = Math.max(0, currentStock - item.quantity);
    batch.update(productRef, {
      stock: newStock,
      status: deriveStockStatus(newStock),
      updatedAt: now,
    });
  }

  // Update customer totals
  if (input.customerId) {
    const customerRef = doc(db, "customers", input.customerId);
    batch.update(customerRef, {
      totalOrders: increment(1),
      totalSpent: increment(total),
    });
  }

  await batch.commit();
  return saleRef.id;
}

/**
 * Update sale status (e.g., mark as cancelled or refunded).
 */
export async function updateSaleStatus(
  id: string,
  status: Sale["status"]
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status });
}
