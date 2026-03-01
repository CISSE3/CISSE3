/**
 * Main App Entry Point
 *
 * Equivalent to Flutter's main.dart + MaterialApp + runApp().
 * Handles auth state, loads demo data, and renders the appropriate screen.
 */

"use client";

import { useEffect } from "react";
import { useAppStore } from "@/providers/app.provider";
import { onAuthChange } from "@/services/auth.service";
import { demoProducts, demoCustomers, demoSales } from "@/providers/demo-data";

// Screens
import LoginScreen from "@/screens/LoginScreen";
import DashboardScreen from "@/screens/DashboardScreen";
import ProductsScreen from "@/screens/ProductsScreen";
import SalesScreen from "@/screens/SalesScreen";
import CustomersScreen from "@/screens/CustomersScreen";
import ReportsScreen from "@/screens/ReportsScreen";

// Widgets
import Sidebar from "@/widgets/Sidebar";
import AppBar from "@/widgets/AppBar";

const screens: Record<string, React.ComponentType> = {
  dashboard: DashboardScreen,
  products: ProductsScreen,
  sales: SalesScreen,
  customers: CustomersScreen,
  reports: ReportsScreen,
};

/**
 * App Shell — wraps authenticated screens with Sidebar + AppBar.
 * Equivalent to Flutter's Scaffold with drawer.
 */
function AppShell() {
  const { activeScreen } = useAppStore();
  const ActiveScreen = screens[activeScreen] || DashboardScreen;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#F6F2FF",
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* AppBar */}
        <AppBar />

        {/* Screen Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#F6F2FF",
          }}
        >
          <ActiveScreen />
        </main>
      </div>
    </div>
  );
}

/**
 * Root App Component
 * Handles Firebase auth state and initializes demo data.
 */
export default function App() {
  const {
    user,
    setUser,
    setAuthLoading,
    isAuthLoading,
    setProducts,
    setSales,
    setCustomers,
  } = useAppStore();

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [setUser, setAuthLoading]);

  // Load demo data on mount (replaces Firestore in demo mode)
  useEffect(() => {
    setProducts(demoProducts);
    setSales(demoSales);
    setCustomers(demoCustomers);
  }, [setProducts, setSales, setCustomers]);

  // Loading state
  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6750A4 0%, #3700B3 100%)",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid rgba(255,255,255,0.3)",
            borderTop: "4px solid white",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "white", fontSize: "16px", fontWeight: 500 }}>
          Loading ShopManager...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Show main app
  return <AppShell />;
}
