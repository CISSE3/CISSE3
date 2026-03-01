/**
 * AppBar Widget
 *
 * Top navigation bar with shop name, search, notifications, and logout.
 * Equivalent to Flutter's AppBar widget.
 */

"use client";

import { Bell, Search, LogOut, Menu } from "lucide-react";
import { useAppStore, Screen } from "@/providers/app.provider";
import { logout } from "@/services/auth.service";
import { colors } from "@/widgets/ui";

const screenTitles: Record<Screen, string> = {
  login: "Login",
  dashboard: "Dashboard",
  products: "Products & Inventory",
  sales: "Sales Management",
  customers: "Customer Management",
  reports: "Reports & Analytics",
  settings: "Settings",
};

export default function AppBar() {
  const { activeScreen, toggleSidebar, setUser, products } = useAppStore();

  const lowStockCount = products.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock"
  ).length;

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <header
      style={{
        height: "64px",
        background: "white",
        borderBottom: "1px solid #E7E0EC",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Left: Menu + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={toggleSidebar}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#49454F",
          }}
        >
          <Menu size={22} />
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1C1B1F" }}>
          {screenTitles[activeScreen]}
        </h1>
      </div>

      {/* Center: Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#F6F2FF",
          borderRadius: "24px",
          padding: "8px 18px",
          width: "300px",
        }}
      >
        <Search size={16} color="#79747E" />
        <input
          type="text"
          placeholder="Search..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#1C1B1F",
            width: "100%",
          }}
        />
      </div>

      {/* Right: Notifications + User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Notification Bell */}
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#49454F",
            position: "relative",
          }}
        >
          <Bell size={22} />
          {lowStockCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: colors.error,
                border: "2px solid white",
              }}
            />
          )}
        </button>

        {/* User Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px 12px",
            borderRadius: "24px",
            background: "#F6F2FF",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.primary}, #03DAC6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1C1B1F", lineHeight: 1.2 }}>
              Admin
            </p>
            <p style={{ fontSize: "11px", color: "#79747E", lineHeight: 1.2 }}>Manager</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#FFF0F0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.error,
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
