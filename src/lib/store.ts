"use client";

import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  image?: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: "active" | "inactive";
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
}

interface ShopStore {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  activeTab: string;
  sidebarOpen: boolean;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const initialProducts: Product[] = [
  { id: "p1", name: "Wireless Headphones", category: "Electronics", price: 79.99, stock: 45, sku: "WH-001", status: "in_stock" },
  { id: "p2", name: "Coffee Maker", category: "Appliances", price: 49.99, stock: 12, sku: "CM-002", status: "in_stock" },
  { id: "p3", name: "Running Shoes", category: "Footwear", price: 89.99, stock: 8, sku: "RS-003", status: "low_stock" },
  { id: "p4", name: "Yoga Mat", category: "Sports", price: 29.99, stock: 0, sku: "YM-004", status: "out_of_stock" },
  { id: "p5", name: "Desk Lamp", category: "Furniture", price: 34.99, stock: 23, sku: "DL-005", status: "in_stock" },
  { id: "p6", name: "Bluetooth Speaker", category: "Electronics", price: 59.99, stock: 5, sku: "BS-006", status: "low_stock" },
  { id: "p7", name: "Water Bottle", category: "Sports", price: 19.99, stock: 67, sku: "WB-007", status: "in_stock" },
  { id: "p8", name: "Notebook Set", category: "Stationery", price: 14.99, stock: 34, sku: "NB-008", status: "in_stock" },
];

const initialCustomers: Customer[] = [
  { id: "c1", name: "Alice Johnson", email: "alice@example.com", phone: "+1 555-0101", address: "123 Main St, NY", totalOrders: 12, totalSpent: 1240.50, joinDate: "2023-01-15", status: "active" },
  { id: "c2", name: "Bob Smith", email: "bob@example.com", phone: "+1 555-0102", address: "456 Oak Ave, CA", totalOrders: 8, totalSpent: 890.00, joinDate: "2023-03-22", status: "active" },
  { id: "c3", name: "Carol White", email: "carol@example.com", phone: "+1 555-0103", address: "789 Pine Rd, TX", totalOrders: 3, totalSpent: 245.75, joinDate: "2023-06-10", status: "active" },
  { id: "c4", name: "David Brown", email: "david@example.com", phone: "+1 555-0104", address: "321 Elm St, FL", totalOrders: 15, totalSpent: 2100.00, joinDate: "2022-11-05", status: "active" },
  { id: "c5", name: "Eva Martinez", email: "eva@example.com", phone: "+1 555-0105", address: "654 Maple Dr, WA", totalOrders: 1, totalSpent: 79.99, joinDate: "2024-01-20", status: "inactive" },
  { id: "c6", name: "Frank Lee", email: "frank@example.com", phone: "+1 555-0106", address: "987 Cedar Ln, OR", totalOrders: 6, totalSpent: 567.30, joinDate: "2023-08-14", status: "active" },
];

const initialOrders: Order[] = [
  { id: "o1", customerId: "c1", customerName: "Alice Johnson", items: [{ productId: "p1", productName: "Wireless Headphones", quantity: 1, price: 79.99 }, { productId: "p5", productName: "Desk Lamp", quantity: 2, price: 34.99 }], total: 149.97, status: "completed", date: "2024-02-28", paymentMethod: "Credit Card" },
  { id: "o2", customerId: "c2", customerName: "Bob Smith", items: [{ productId: "p2", productName: "Coffee Maker", quantity: 1, price: 49.99 }], total: 49.99, status: "processing", date: "2024-02-27", paymentMethod: "PayPal" },
  { id: "o3", customerId: "c3", customerName: "Carol White", items: [{ productId: "p3", productName: "Running Shoes", quantity: 1, price: 89.99 }, { productId: "p7", productName: "Water Bottle", quantity: 2, price: 19.99 }], total: 129.97, status: "pending", date: "2024-02-26", paymentMethod: "Debit Card" },
  { id: "o4", customerId: "c4", customerName: "David Brown", items: [{ productId: "p6", productName: "Bluetooth Speaker", quantity: 2, price: 59.99 }], total: 119.98, status: "completed", date: "2024-02-25", paymentMethod: "Credit Card" },
  { id: "o5", customerId: "c1", customerName: "Alice Johnson", items: [{ productId: "p8", productName: "Notebook Set", quantity: 3, price: 14.99 }], total: 44.97, status: "cancelled", date: "2024-02-24", paymentMethod: "Credit Card" },
  { id: "o6", customerId: "c6", customerName: "Frank Lee", items: [{ productId: "p1", productName: "Wireless Headphones", quantity: 1, price: 79.99 }, { productId: "p2", productName: "Coffee Maker", quantity: 1, price: 49.99 }], total: 129.98, status: "completed", date: "2024-02-23", paymentMethod: "PayPal" },
  { id: "o7", customerId: "c2", customerName: "Bob Smith", items: [{ productId: "p4", productName: "Yoga Mat", quantity: 1, price: 29.99 }], total: 29.99, status: "completed", date: "2024-02-22", paymentMethod: "Debit Card" },
  { id: "o8", customerId: "c5", customerName: "Eva Martinez", items: [{ productId: "p1", productName: "Wireless Headphones", quantity: 1, price: 79.99 }], total: 79.99, status: "completed", date: "2024-02-20", paymentMethod: "Credit Card" },
];

export const useShopStore = create<ShopStore>((set) => ({
  products: initialProducts,
  customers: initialCustomers,
  orders: initialOrders,
  activeTab: "dashboard",
  sidebarOpen: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: `p${Date.now()}` }],
    })),

  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, { ...customer, id: `c${Date.now()}` }],
    })),

  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...customer } : c)),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, { ...order, id: `o${Date.now()}` }],
    })),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
