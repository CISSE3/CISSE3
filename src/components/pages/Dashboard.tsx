"use client";

import { useShopStore } from "@/lib/store";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const salesData = [
  { month: "Sep", sales: 4200 },
  { month: "Oct", sales: 5800 },
  { month: "Nov", sales: 7200 },
  { month: "Dec", sales: 9800 },
  { month: "Jan", sales: 6400 },
  { month: "Feb", sales: 8100 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#6200EE" },
  { name: "Appliances", value: 20, color: "#03DAC6" },
  { name: "Sports", value: 18, color: "#FF6D00" },
  { name: "Footwear", value: 15, color: "#00BCD4" },
  { name: "Other", value: 12, color: "#9C27B0" },
];

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="material-card elevation-1"
      style={{ flex: 1, minWidth: "200px" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p style={{ fontSize: "13px", color: "#9E9E9E", marginBottom: "8px" }}>{title}</p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#212121" }}>{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {positive ? (
              <ArrowUpRight size={16} color="#4CAF50" />
            ) : (
              <ArrowDownRight size={16} color="#F44336" />
            )}
            <span
              style={{
                fontSize: "12px",
                color: positive ? "#4CAF50" : "#F44336",
                fontWeight: 500,
              }}
            >
              {change} vs last month
            </span>
          </div>
        </div>
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "52px",
            height: "52px",
            background: `${color}20`,
          }}
        >
          <Icon size={26} color={color} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { orders, products, customers } = useShopStore();

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;

  const lowStockProducts = products.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock"
  ).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statusColors: Record<string, string> = {
    completed: "badge-success",
    processing: "badge-info",
    pending: "badge-warning",
    cancelled: "badge-error",
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stats Row */}
      <div className="flex gap-4 flex-wrap">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change="+12.5%"
          positive={true}
          icon={TrendingUp}
          color="#6200EE"
        />
        <StatCard
          title="Total Orders"
          value={orders.length.toString()}
          change="+8.2%"
          positive={true}
          icon={ShoppingCart}
          color="#03DAC6"
        />
        <StatCard
          title="Customers"
          value={customers.length.toString()}
          change="+3.1%"
          positive={true}
          icon={Users}
          color="#FF6D00"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.toString()}
          change="+2"
          positive={false}
          icon={Package}
          color="#F44336"
        />
      </div>

      {/* Charts Row */}
      <div className="flex gap-4 flex-wrap">
        {/* Sales Chart */}
        <div
          className="material-card elevation-1"
          style={{ flex: 2, minWidth: "300px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121" }}>
              Sales Overview
            </h3>
            <span
              className="chip badge-info"
              style={{ fontSize: "11px" }}
            >
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6200EE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6200EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9E9E9E" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9E9E9E" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6200EE"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div
          className="material-card elevation-1"
          style={{ flex: 1, minWidth: "260px" }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
            Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: "12px", color: "#616161" }}>{value}</span>
                )}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex gap-4 flex-wrap">
        {/* Recent Orders */}
        <div
          className="material-card elevation-1"
          style={{ flex: 2, minWidth: "300px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121" }}>
              Recent Orders
            </h3>
            <span style={{ fontSize: "12px", color: "#6200EE", cursor: "pointer", fontWeight: 500 }}>
              View all
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
                  {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontSize: "12px",
                        color: "#9E9E9E",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #FAFAFA" }}
                    className="transition-all"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAFAFA")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600, color: "#6200EE" }}>
                      #{order.id.toUpperCase()}
                    </td>
                    <td style={{ padding: "12px", fontSize: "13px", color: "#424242" }}>
                      {order.customerName}
                    </td>
                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600, color: "#212121" }}>
                      ${order.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span className={`chip ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "13px", color: "#9E9E9E" }}>
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className="material-card elevation-1"
          style={{ flex: 1, minWidth: "220px" }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
            Quick Stats
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Pending Orders", value: pendingOrders, color: "#FF9800" },
              { label: "Active Customers", value: customers.filter((c) => c.status === "active").length, color: "#4CAF50" },
              { label: "Total Products", value: products.length, color: "#6200EE" },
              { label: "Out of Stock", value: products.filter((p) => p.status === "out_of_stock").length, color: "#F44336" },
              { label: "Completed Orders", value: orders.filter((o) => o.status === "completed").length, color: "#03DAC6" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: stat.color,
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "#616161" }}>{stat.label}</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#212121" }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "linear-gradient(135deg, #6200EE, #03DAC6)",
              borderRadius: "8px",
              color: "white",
            }}
          >
            <p style={{ fontSize: "12px", opacity: 0.85 }}>Monthly Revenue</p>
            <p style={{ fontSize: "24px", fontWeight: 700, marginTop: "4px" }}>
              ${totalRevenue.toFixed(0)}
            </p>
            <p style={{ fontSize: "11px", opacity: 0.75, marginTop: "4px" }}>
              ↑ 12.5% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
