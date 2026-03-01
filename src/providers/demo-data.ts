/**
 * Demo Data Provider
 *
 * Provides sample data for development/demo mode when Firebase is not configured.
 * In production, this data comes from Firestore.
 */

import { Product } from "@/models/product.model";
import { Sale } from "@/models/sale.model";
import { Customer } from "@/models/customer.model";

export const demoProducts: Product[] = [
  { id: "p1", name: "Wireless Headphones", category: "Electronics", price: 79.99, stock: 45, description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.", sku: "WH-001", status: "in_stock", createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-02-01T12:00:00Z" },
  { id: "p2", name: "Coffee Maker Pro", category: "Appliances", price: 49.99, stock: 12, description: "12-cup programmable coffee maker with built-in grinder.", sku: "CM-002", status: "in_stock", createdAt: "2024-01-20T10:00:00Z", updatedAt: "2024-02-05T12:00:00Z" },
  { id: "p3", name: "Running Shoes X1", category: "Footwear", price: 89.99, stock: 8, description: "Lightweight running shoes with advanced cushioning technology.", sku: "RS-003", status: "low_stock", createdAt: "2024-01-25T10:00:00Z", updatedAt: "2024-02-10T12:00:00Z" },
  { id: "p4", name: "Yoga Mat Premium", category: "Sports", price: 29.99, stock: 0, description: "Non-slip premium yoga mat, 6mm thick, eco-friendly material.", sku: "YM-004", status: "out_of_stock", createdAt: "2024-02-01T10:00:00Z", updatedAt: "2024-02-15T12:00:00Z" },
  { id: "p5", name: "LED Desk Lamp", category: "Furniture", price: 34.99, stock: 23, description: "Adjustable LED desk lamp with USB charging port and 5 brightness levels.", sku: "DL-005", status: "in_stock", createdAt: "2024-02-05T10:00:00Z", updatedAt: "2024-02-20T12:00:00Z" },
  { id: "p6", name: "Bluetooth Speaker", category: "Electronics", price: 59.99, stock: 5, description: "Portable waterproof Bluetooth speaker with 360° sound.", sku: "BS-006", status: "low_stock", createdAt: "2024-02-10T10:00:00Z", updatedAt: "2024-02-25T12:00:00Z" },
  { id: "p7", name: "Stainless Water Bottle", category: "Sports", price: 19.99, stock: 67, description: "32oz insulated stainless steel water bottle, keeps cold 24h.", sku: "WB-007", status: "in_stock", createdAt: "2024-02-12T10:00:00Z", updatedAt: "2024-02-26T12:00:00Z" },
  { id: "p8", name: "Notebook Set (5-pack)", category: "Stationery", price: 14.99, stock: 34, description: "Set of 5 premium ruled notebooks, A5 size, 200 pages each.", sku: "NB-008", status: "in_stock", createdAt: "2024-02-15T10:00:00Z", updatedAt: "2024-02-27T12:00:00Z" },
  { id: "p9", name: "Smart Watch Series 3", category: "Electronics", price: 199.99, stock: 9, description: "Fitness tracking smartwatch with heart rate monitor and GPS.", sku: "SW-009", status: "low_stock", createdAt: "2024-02-18T10:00:00Z", updatedAt: "2024-02-28T12:00:00Z" },
  { id: "p10", name: "Ergonomic Chair", category: "Furniture", price: 299.99, stock: 6, description: "Fully adjustable ergonomic office chair with lumbar support.", sku: "EC-010", status: "low_stock", createdAt: "2024-02-20T10:00:00Z", updatedAt: "2024-02-28T12:00:00Z" },
];

export const demoCustomers: Customer[] = [
  { id: "c1", name: "Alice Johnson", email: "alice@example.com", phone: "+1 555-0101", address: "123 Main St", city: "New York", country: "USA", totalOrders: 12, totalSpent: 1240.50, status: "active", joinDate: "2023-01-15", notes: "VIP customer" },
  { id: "c2", name: "Bob Smith", email: "bob@example.com", phone: "+1 555-0102", address: "456 Oak Ave", city: "Los Angeles", country: "USA", totalOrders: 8, totalSpent: 890.00, status: "active", joinDate: "2023-03-22", notes: "" },
  { id: "c3", name: "Carol White", email: "carol@example.com", phone: "+1 555-0103", address: "789 Pine Rd", city: "Houston", country: "USA", totalOrders: 3, totalSpent: 245.75, status: "active", joinDate: "2023-06-10", notes: "" },
  { id: "c4", name: "David Brown", email: "david@example.com", phone: "+1 555-0104", address: "321 Elm St", city: "Miami", country: "USA", totalOrders: 15, totalSpent: 2100.00, status: "active", joinDate: "2022-11-05", notes: "Wholesale buyer" },
  { id: "c5", name: "Eva Martinez", email: "eva@example.com", phone: "+1 555-0105", address: "654 Maple Dr", city: "Seattle", country: "USA", totalOrders: 1, totalSpent: 79.99, status: "inactive", joinDate: "2024-01-20", notes: "" },
  { id: "c6", name: "Frank Lee", email: "frank@example.com", phone: "+1 555-0106", address: "987 Cedar Ln", city: "Portland", country: "USA", totalOrders: 6, totalSpent: 567.30, status: "active", joinDate: "2023-08-14", notes: "" },
];

export const demoSales: Sale[] = [
  { id: "s1", invoiceNumber: "INV-2024-0001", customerId: "c1", customerName: "Alice Johnson", items: [{ productId: "p1", productName: "Wireless Headphones", quantity: 1, unitPrice: 79.99, subtotal: 79.99 }, { productId: "p5", productName: "LED Desk Lamp", quantity: 2, unitPrice: 34.99, subtotal: 69.98 }], subtotal: 149.97, tax: 10, taxAmount: 15.00, total: 164.97, paymentMethod: "credit_card", status: "completed", notes: "", date: "2024-02-28", createdAt: "2024-02-28T14:30:00Z" },
  { id: "s2", invoiceNumber: "INV-2024-0002", customerId: "c2", customerName: "Bob Smith", items: [{ productId: "p2", productName: "Coffee Maker Pro", quantity: 1, unitPrice: 49.99, subtotal: 49.99 }], subtotal: 49.99, tax: 10, taxAmount: 5.00, total: 54.99, paymentMethod: "paypal", status: "completed", notes: "", date: "2024-02-27", createdAt: "2024-02-27T10:15:00Z" },
  { id: "s3", invoiceNumber: "INV-2024-0003", customerId: "c3", customerName: "Carol White", items: [{ productId: "p3", productName: "Running Shoes X1", quantity: 1, unitPrice: 89.99, subtotal: 89.99 }, { productId: "p7", productName: "Stainless Water Bottle", quantity: 2, unitPrice: 19.99, subtotal: 39.98 }], subtotal: 129.97, tax: 10, taxAmount: 13.00, total: 142.97, paymentMethod: "debit_card", status: "pending", notes: "Express delivery requested", date: "2024-02-26", createdAt: "2024-02-26T16:45:00Z" },
  { id: "s4", invoiceNumber: "INV-2024-0004", customerId: "c4", customerName: "David Brown", items: [{ productId: "p6", productName: "Bluetooth Speaker", quantity: 2, unitPrice: 59.99, subtotal: 119.98 }], subtotal: 119.98, tax: 10, taxAmount: 12.00, total: 131.98, paymentMethod: "bank_transfer", status: "completed", notes: "Wholesale order", date: "2024-02-25", createdAt: "2024-02-25T09:00:00Z" },
  { id: "s5", invoiceNumber: "INV-2024-0005", customerId: "c1", customerName: "Alice Johnson", items: [{ productId: "p8", productName: "Notebook Set (5-pack)", quantity: 3, unitPrice: 14.99, subtotal: 44.97 }], subtotal: 44.97, tax: 10, taxAmount: 4.50, total: 49.47, paymentMethod: "credit_card", status: "cancelled", notes: "Customer cancelled", date: "2024-02-24", createdAt: "2024-02-24T11:30:00Z" },
  { id: "s6", invoiceNumber: "INV-2024-0006", customerId: "c6", customerName: "Frank Lee", items: [{ productId: "p1", productName: "Wireless Headphones", quantity: 1, unitPrice: 79.99, subtotal: 79.99 }, { productId: "p9", productName: "Smart Watch Series 3", quantity: 1, unitPrice: 199.99, subtotal: 199.99 }], subtotal: 279.98, tax: 10, taxAmount: 28.00, total: 307.98, paymentMethod: "credit_card", status: "completed", notes: "", date: "2024-02-23", createdAt: "2024-02-23T14:00:00Z" },
  { id: "s7", invoiceNumber: "INV-2024-0007", customerId: "c2", customerName: "Bob Smith", items: [{ productId: "p10", productName: "Ergonomic Chair", quantity: 1, unitPrice: 299.99, subtotal: 299.99 }], subtotal: 299.99, tax: 10, taxAmount: 30.00, total: 329.99, paymentMethod: "bank_transfer", status: "completed", notes: "", date: "2024-02-22", createdAt: "2024-02-22T10:00:00Z" },
  { id: "s8", invoiceNumber: "INV-2024-0008", customerId: "c5", customerName: "Eva Martinez", items: [{ productId: "p1", productName: "Wireless Headphones", quantity: 1, unitPrice: 79.99, subtotal: 79.99 }], subtotal: 79.99, tax: 10, taxAmount: 8.00, total: 87.99, paymentMethod: "credit_card", status: "completed", notes: "", date: "2024-02-20", createdAt: "2024-02-20T15:30:00Z" },
];
