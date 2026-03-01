"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useShopStore } from "@/lib/store";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products & Inventory",
  orders: "Orders & Sales",
  customers: "Customers",
  reports: "Reports & Analytics",
  settings: "Settings",
};

export default function TopBar() {
  const { activeTab, toggleSidebar } = useShopStore();

  return (
    <header
      className="flex items-center justify-between px-6"
      style={{
        height: "64px",
        background: "white",
        borderBottom: "1px solid #E0E0E0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-full"
          style={{
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#616161",
          }}
        >
          <Menu size={22} />
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#212121" }}>
          {pageTitles[activeTab] || "Shop Manager"}
        </h1>
      </div>

      {/* Center - Search */}
      <div
        className="flex items-center"
        style={{
          background: "#F5F5F5",
          borderRadius: "24px",
          padding: "8px 16px",
          gap: "8px",
          width: "320px",
        }}
      >
        <Search size={18} color="#9E9E9E" />
        <input
          type="text"
          placeholder="Search..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#424242",
            width: "100%",
          }}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center justify-center rounded-full"
          style={{
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#616161",
            position: "relative",
          }}
        >
          <Bell size={22} />
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#F44336",
              border: "2px solid white",
            }}
          />
        </button>

        <div
          className="flex items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "36px",
              height: "36px",
              background: "#6200EE",
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#212121" }}>Admin</p>
            <p style={{ fontSize: "11px", color: "#9E9E9E" }}>Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
