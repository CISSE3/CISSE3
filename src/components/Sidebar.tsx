"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useShopStore } from "@/lib/store";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar } = useShopStore();

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: sidebarOpen ? "240px" : "72px",
        background: "linear-gradient(180deg, #6200EE 0%, #3700B3 100%)",
        minHeight: "100vh",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center px-4 py-5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          minHeight: "72px",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "40px",
            height: "40px",
            background: "rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        >
          <Store size={22} color="white" />
        </div>
        {sidebarOpen && (
          <div className="ml-3 overflow-hidden">
            <p style={{ color: "white", fontWeight: 700, fontSize: "16px", whiteSpace: "nowrap" }}>
              ShopManager
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", whiteSpace: "nowrap" }}>
              Pro Edition
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="ripple w-full flex items-center transition-all"
              style={{
                padding: sidebarOpen ? "12px 16px" : "12px",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                borderLeft: isActive ? "4px solid white" : "4px solid transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                border: "none",
                outline: "none",
                marginBottom: "2px",
              }}
            >
              <Icon size={22} style={{ flexShrink: 0 }} />
              {sidebarOpen && (
                <span
                  style={{
                    marginLeft: "12px",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center"
        style={{
          position: "absolute",
          right: "-14px",
          top: "80px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "white",
          border: "2px solid #6200EE",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        {sidebarOpen ? (
          <ChevronLeft size={14} color="#6200EE" />
        ) : (
          <ChevronRight size={14} color="#6200EE" />
        )}
      </button>

      {/* User Profile */}
      <div
        className="flex items-center px-4 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "36px",
            height: "36px",
            background: "#03DAC6",
            flexShrink: 0,
            fontSize: "14px",
            fontWeight: 700,
            color: "#000",
          }}
        >
          A
        </div>
        {sidebarOpen && (
          <div className="ml-3 overflow-hidden">
            <p style={{ color: "white", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
              Admin User
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", whiteSpace: "nowrap" }}>
              admin@shop.com
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
