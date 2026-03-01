/**
 * Product Model
 * Mirrors the Firestore document structure for the `products` collection.
 *
 * Firestore path: /products/{productId}
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  sku: string;
  image?: string; // Product image URL (base64 or URL)
  status: "in_stock" | "low_stock" | "out_of_stock";
  createdAt: string; // ISO date string
  updatedAt: string;
}

export type ProductInput = Omit<Product, "id" | "status" | "createdAt" | "updatedAt">;

/**
 * Derives stock status from quantity.
 * Low stock threshold: <= 10 units
 */
export function deriveStockStatus(stock: number): Product["status"] {
  if (stock === 0) return "out_of_stock";
  if (stock <= 10) return "low_stock";
  return "in_stock";
}

/**
 * Sample Firestore data structure:
 * {
 *   name: "Wireless Headphones",
 *   category: "Electronics",
 *   price: 79.99,
 *   stock: 45,
 *   description: "High-quality wireless headphones with noise cancellation",
 *   sku: "WH-001",
 *   status: "in_stock",
 *   createdAt: "2024-01-15T10:00:00Z",
 *   updatedAt: "2024-02-01T12:00:00Z"
 * }
 */
