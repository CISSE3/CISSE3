/**
 * Customer Service
 * Handles Firestore CRUD for the `customers` collection.
 *
 * Equivalent to Flutter's CustomerService using cloud_firestore package.
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
  where,
} from "firebase/firestore";
import { db } from "@/core/firebase";
import { Customer, CustomerInput } from "@/models/customer.model";
import { Sale } from "@/models/sale.model";

const COLLECTION = "customers";

/**
 * Fetch all customers, ordered by name.
 */
export async function getCustomers(): Promise<Customer[]> {
  const q = query(collection(db, COLLECTION), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Customer));
}

/**
 * Add a new customer.
 */
export async function addCustomer(input: CustomerInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    totalOrders: 0,
    totalSpent: 0,
    joinDate: new Date().toISOString().split("T")[0],
  });
  return docRef.id;
}

/**
 * Update customer details.
 */
export async function updateCustomer(
  id: string,
  updates: Partial<CustomerInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), updates);
}

/**
 * Delete a customer by ID.
 */
export async function deleteCustomer(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Get purchase history for a specific customer.
 * Queries the `sales` collection filtered by customerId.
 */
export async function getCustomerPurchaseHistory(
  customerId: string
): Promise<Sale[]> {
  const q = query(
    collection(db, "sales"),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Sale));
}
