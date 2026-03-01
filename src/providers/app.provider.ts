/**
 * App Provider (State Management)
 *
 * Equivalent to Flutter's Provider/Riverpod pattern.
 * Uses Zustand for global state management with Firebase integration.
 *
 * Manages:
 * - Authentication state
 * - Products, Sales, Customers data
 * - UI state (active screen, sidebar)
 * - Loading/error states
 */

"use client";

import { create } from "zustand";
import { User } from "firebase/auth";
import { Product } from "@/models/product.model";
import { Sale } from "@/models/sale.model";
import { Customer } from "@/models/customer.model";

export type Screen =
  | "login"
  | "dashboard"
  | "products"
  | "sales"
  | "customers"
  | "reports"
  | "settings";

interface AppState {
  // Auth
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;

  // Navigation
  activeScreen: Screen;
  sidebarOpen: boolean;
  setActiveScreen: (screen: Screen) => void;
  toggleSidebar: () => void;

  // Products
  products: Product[];
  productsLoading: boolean;
  setProducts: (products: Product[]) => void;
  setProductsLoading: (loading: boolean) => void;
  upsertProduct: (product: Product) => void;
  removeProduct: (id: string) => void;

  // Sales
  sales: Sale[];
  salesLoading: boolean;
  setSales: (sales: Sale[]) => void;
  setSalesLoading: (loading: boolean) => void;
  addSale: (sale: Sale) => void;
  updateSaleStatus: (id: string, status: Sale["status"]) => void;

  // Customers
  customers: Customer[];
  customersLoading: boolean;
  setCustomers: (customers: Customer[]) => void;
  setCustomersLoading: (loading: boolean) => void;
  upsertCustomer: (customer: Customer) => void;
  removeCustomer: (id: string) => void;

  // Global error
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthLoading: true,
  setUser: (user) => set({ user }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  // Navigation
  activeScreen: "dashboard",
  sidebarOpen: true,
  setActiveScreen: (activeScreen) => set({ activeScreen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Products
  products: [],
  productsLoading: false,
  setProducts: (products) => set({ products }),
  setProductsLoading: (productsLoading) => set({ productsLoading }),
  upsertProduct: (product) =>
    set((s) => {
      const exists = s.products.find((p) => p.id === product.id);
      return {
        products: exists
          ? s.products.map((p) => (p.id === product.id ? product : p))
          : [...s.products, product],
      };
    }),
  removeProduct: (id) =>
    set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

  // Sales
  sales: [],
  salesLoading: false,
  setSales: (sales) => set({ sales }),
  setSalesLoading: (salesLoading) => set({ salesLoading }),
  addSale: (sale) => set((s) => ({ sales: [sale, ...s.sales] })),
  updateSaleStatus: (id, status) =>
    set((s) => ({
      sales: s.sales.map((sale) =>
        sale.id === id ? { ...sale, status } : sale
      ),
    })),

  // Customers
  customers: [],
  customersLoading: false,
  setCustomers: (customers) => set({ customers }),
  setCustomersLoading: (customersLoading) => set({ customersLoading }),
  upsertCustomer: (customer) =>
    set((s) => {
      const exists = s.customers.find((c) => c.id === customer.id);
      return {
        customers: exists
          ? s.customers.map((c) => (c.id === customer.id ? customer : c))
          : [...s.customers, customer],
      };
    }),
  removeCustomer: (id) =>
    set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),

  // Error
  error: null,
  setError: (error) => set({ error }),
}));
