/**
 * Customer Model
 * Mirrors the Firestore document structure for the `customers` collection.
 *
 * Firestore path: /customers/{customerId}
 */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  joinDate: string; // ISO date string
  notes: string;
}

export type CustomerInput = Omit<Customer, "id" | "totalOrders" | "totalSpent" | "joinDate">;

/**
 * Sample Firestore data structure:
 * {
 *   name: "Alice Johnson",
 *   email: "alice@example.com",
 *   phone: "+1 555-0101",
 *   address: "123 Main St",
 *   city: "New York",
 *   country: "USA",
 *   totalOrders: 12,
 *   totalSpent: 1240.50,
 *   status: "active",
 *   joinDate: "2023-01-15",
 *   notes: "VIP customer"
 * }
 */
