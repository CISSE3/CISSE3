/**
 * Product Service
 * Handles all Firestore CRUD operations for the `products` collection.
 *
 * Equivalent to Flutter's ProductService using cloud_firestore package.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/core/firebase";
import { Product, ProductInput, deriveStockStatus } from "@/models/product.model";

const COLLECTION = "products";

/**
 * Fetch all products from Firestore, ordered by name.
 */
export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, COLLECTION), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

/**
 * Add a new product to Firestore.
 * Automatically derives stock status and sets timestamps.
 */
export async function addProduct(input: ProductInput): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    status: deriveStockStatus(input.stock),
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Update an existing product.
 * Recalculates stock status on every update.
 */
export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const payload: Record<string, unknown> = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  if (updates.stock !== undefined) {
    payload.status = deriveStockStatus(updates.stock);
  }
  await updateDoc(ref, payload);
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Reduce product stock after a sale.
 * Called automatically when a sale is created.
 */
export async function reduceStock(
  productId: string,
  quantity: number,
  currentStock: number
): Promise<void> {
  const newStock = Math.max(0, currentStock - quantity);
  await updateProduct(productId, { stock: newStock });
}

// Suppress unused import warning for Timestamp (used in Firestore internally)
void Timestamp;
