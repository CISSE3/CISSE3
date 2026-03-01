"use client";

import { useShopStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Dashboard from "@/components/pages/Dashboard";
import Products from "@/components/pages/Products";
import Orders from "@/components/pages/Orders";
import Customers from "@/components/pages/Customers";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";

const pages: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  products: Products,
  orders: Orders,
  customers: Customers,
  reports: Reports,
  settings: Settings,
};

export default function Home() {
  const { activeTab } = useShopStore();
  const ActivePage = pages[activeTab] || Dashboard;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#F5F5F5",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#F5F5F5",
          }}
        >
          <ActivePage />
        </main>
      </div>
    </div>
  );
}
