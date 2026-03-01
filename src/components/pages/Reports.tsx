"use client";

import { useShopStore } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";

const monthlyData = [
  { month: "Sep", revenue: 4200, orders: 28, customers: 18 },
  { month: "Oct", revenue: 5800, orders: 35, customers: 24 },
  { month: "Nov", revenue: 7200, orders: 48, customers: 31 },
  { month: "Dec", revenue: 9800, orders: 62, customers: 45 },
  { month: "Jan", revenue: 6400, orders: 41, customers: 28 },
  { month: "Feb", revenue: 8100, orders: 54, customers: 38 },
];

const topProducts = [
  { name: "Wireless Headphones", sales: 45, revenue: 3599.55 },
  { name: "Running Shoes", sales: 32, revenue: 2879.68 },
  { name: "Coffee Maker", sales: 28, revenue: 1399.72 },
  { name: "Bluetooth Speaker", sales: 22, revenue: 1319.78 },
  { name: "Desk Lamp", sales: 19, revenue: 664.81 },
];

const paymentData = [
  { name: "Credit Card", value: 45, color: "#6200EE" },
  { name: "PayPal", value: 30, color: "#03DAC6" },
  { name: "Debit Card", value: 25, color: "#FF6D00" },
];

export default function Reports() {
  const { orders, products, customers } = useShopStore();

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  const avgOrderValue = totalRevenue / orders.filter((o) => o.status === "completed").length || 0;

  const conversionRate = (
    (orders.filter((o) => o.status === "completed").length / orders.length) *
    100
  ).toFixed(1);

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#212121" }}>Reports & Analytics</h2>
        <p style={{ fontSize: "13px", color: "#9E9E9E", marginTop: "2px" }}>
          Business performance overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="flex gap-4 flex-wrap">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            sub: "All completed orders",
            icon: DollarSign,
            color: "#6200EE",
            trend: "+12.5%",
            up: true,
          },
          {
            label: "Avg Order Value",
            value: `$${avgOrderValue.toFixed(2)}`,
            sub: "Per completed order",
            icon: ShoppingBag,
            color: "#03DAC6",
            trend: "+5.2%",
            up: true,
          },
          {
            label: "Conversion Rate",
            value: `${conversionRate}%`,
            sub: "Orders completed",
            icon: TrendingUp,
            color: "#FF6D00",
            trend: "-2.1%",
            up: false,
          },
          {
            label: "Total Customers",
            value: customers.length.toString(),
            sub: `${customers.filter((c) => c.status === "active").length} active`,
            icon: TrendingDown,
            color: "#9C27B0",
            trend: "+8.3%",
            up: true,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="material-card elevation-1"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontSize: "12px", color: "#9E9E9E", marginBottom: "8px" }}>{kpi.label}</p>
                  <p style={{ fontSize: "26px", fontWeight: 700, color: "#212121" }}>{kpi.value}</p>
                  <p style={{ fontSize: "12px", color: "#9E9E9E", marginTop: "4px" }}>{kpi.sub}</p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: kpi.up ? "#4CAF50" : "#F44336",
                    }}
                  >
                    {kpi.trend} vs last month
                  </span>
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: `${kpi.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={kpi.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="flex gap-4 flex-wrap">
        <div className="material-card elevation-1" style={{ flex: 2, minWidth: "300px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6200EE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6200EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9E9E9E" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9E9E9E" }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6200EE" strokeWidth={2} fill="url(#revenueGrad)" name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="material-card elevation-1" style={{ flex: 1, minWidth: "260px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
            Payment Methods
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
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
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders & Customers Chart */}
      <div className="flex gap-4 flex-wrap">
        <div className="material-card elevation-1" style={{ flex: 1, minWidth: "280px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
            Orders vs New Customers
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9E9E9E" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9E9E9E" }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#6200EE" strokeWidth={2} dot={{ r: 4 }} name="Orders" />
              <Line type="monotone" dataKey="customers" stroke="#03DAC6" strokeWidth={2} dot={{ r: 4 }} name="New Customers" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="material-card elevation-1" style={{ flex: 1, minWidth: "280px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
            Top Products by Revenue
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9E9E9E" }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#616161" }}
                width={120}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#6200EE" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="material-card elevation-1">
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121", marginBottom: "16px" }}>
          Monthly Summary
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
                {["Month", "Revenue", "Orders", "New Customers", "Avg Order Value", "Growth"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
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
              {monthlyData.map((row, i) => {
                const prev = monthlyData[i - 1];
                const growth = prev
                  ? (((row.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
                  : null;
                const avgOrder = (row.revenue / row.orders).toFixed(2);
                return (
                  <tr
                    key={row.month}
                    style={{ borderBottom: "1px solid #FAFAFA" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#212121" }}>
                      {row.month}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#6200EE" }}>
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#424242" }}>
                      {row.orders}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#424242" }}>
                      {row.customers}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#424242" }}>
                      ${avgOrder}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {growth !== null ? (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: parseFloat(growth) >= 0 ? "#4CAF50" : "#F44336",
                          }}
                        >
                          {parseFloat(growth) >= 0 ? "↑" : "↓"} {Math.abs(parseFloat(growth))}%
                        </span>
                      ) : (
                        <span style={{ fontSize: "13px", color: "#9E9E9E" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
