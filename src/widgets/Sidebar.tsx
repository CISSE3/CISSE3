/**
 * Sidebar Navigation Widget
 *
 * Collapsible sidebar with navigation items.
 * Equivalent to Flutter's NavigationDrawer/NavigationRail widget.
 */

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
import { useAppStore, Screen } from "@/providers/app.provider";
import { colors } from "@/widgets/ui";
import { useTranslation } from "@/i18n/provider";

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export default function Sidebar() {
  const { activeScreen, setActiveScreen, sidebarOpen, toggleSidebar, products, sales } =
    useAppStore();
  const { t } = useTranslation();

  const lowStockCount = products.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock"
  ).length;

  const pendingSalesCount = sales.filter((s) => s.status === "pending").length;

  const navItems: NavItem[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "products", label: t.nav.products, icon: Package, badge: lowStockCount || undefined },
    { id: "sales", label: t.nav.sales, icon: ShoppingCart, badge: pendingSalesCount || undefined },
    { id: "customers", label: t.nav.customers, icon: Users },
    { id: "reports", label: t.nav.reports, icon: BarChart3 },
    { id: "settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside
      style={{
        width: sidebarOpen ? "240px" : "72px",
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colors.primary} 0%, #3700B3 100%)`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: sidebarOpen ? "0 16px" : "0",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Store size={22} color="white" />
        </div>
        {sidebarOpen && (
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {t.nav.shopManager}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}
            >
              {t.nav.proEdition}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: sidebarOpen ? "12px 16px" : "12px",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                borderLeft: isActive ? "4px solid white" : "4px solid transparent",
                border: "none",
                borderRight: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                borderLeftColor: isActive ? "white" : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                marginBottom: "2px",
                position: "relative",
                transition: "background 0.15s",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Icon size={22} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#FF6D00",
                      color: "white",
                      fontSize: "9px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
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

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          right: "-14px",
          top: "80px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "white",
          border: `2px solid ${colors.primary}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 20,
        }}
      >
        {sidebarOpen ? (
          <ChevronLeft size={14} color={colors.primary} />
        ) : (
          <ChevronRight size={14} color={colors.primary} />
        )}
      </button>

      {/* User Profile Footer */}
      <div
        style={{
          padding: sidebarOpen ? "14px 16px" : "14px 0",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#03DAC6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            fontSize: "14px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          A
        </div>
        {sidebarOpen && (
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {t.auth.login === "Connexion" ? "Administrateur" : "Admin User"}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}
            >
              admin@shop.com
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
