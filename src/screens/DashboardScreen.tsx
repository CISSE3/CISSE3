/**
 * Dashboard Screen
 *
 * Displays KPI metrics, sales bar chart, and recent activity.
 * Equivalent to Flutter's DashboardScreen widget.
 */

"use client";

import { useAppStore } from "@/providers/app.provider";
import { Card, colors, StatusBadge, DataTable, TableRow, TableCell } from "@/widgets/ui";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Monthly sales data (in production, computed from Firestore)
const monthlySalesData = [
  { month: "Sep", revenue: 4200, orders: 28 },
  { month: "Oct", revenue: 5800, orders: 35 },
  { month: "Nov", revenue: 7200, orders: 48 },
  { month: "Dec", revenue: 9800, orders: 62 },
  { month: "Jan", revenue: 6400, orders: 41 },
  { month: "Feb", revenue: 8100, orders: 54 },
];

const categoryColors = ["#6750A4", "#03DAC6", "#FF6D00", "#00BCD4", "#9C27B0"];

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card style={{ flex: 1, minWidth: "200px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "13px", color: "#79747E", marginBottom: "8px" }}>{title}</p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#1C1B1F", lineHeight: 1 }}>
            {value}
          </p>
          <p style={{ fontSize: "12px", color: "#79747E", marginTop: "6px" }}>{subtitle}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
            {trendUp ? (
              <ArrowUpRight size={14} color={colors.success} />
            ) : (
              <ArrowDownRight size={14} color={colors.error} />
            )}
            <span
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: trendUp ? colors.success : colors.error,
              }}
            >
              {trend} vs last month
            </span>
          </div>
        </div>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={26} color={color} />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardScreen() {
  const { products, sales, customers } = useAppStore();

  const completedSales = sales.filter((s) => s.status === "completed");
  const totalRevenue = completedSales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = sales.length;
  const lowStockCount = products.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock"
  ).length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Category breakdown from products
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="All completed sales"
          icon={TrendingUp}
          color={colors.primary}
          trend="+12.5%"
          trendUp={true}
        />
        <KPICard
          title="Total Sales"
          value={totalSales.toString()}
          subtitle={`${completedSales.length} completed`}
          icon={ShoppingCart}
          color="#03DAC6"
          trend="+8.2%"
          trendUp={true}
        />
        <KPICard
          title="Active Customers"
          value={activeCustomers.toString()}
          subtitle={`${customers.length} total`}
          icon={Users}
          color="#FF6D00"
          trend="+3.1%"
          trendUp={true}
        />
        <KPICard
          title="Low Stock Items"
          value={lowStockCount.toString()}
          subtitle="Need restocking"
          icon={lowStockCount > 0 ? AlertTriangle : Package}
          color={lowStockCount > 0 ? colors.error : colors.success}
          trend={`+${lowStockCount}`}
          trendUp={false}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Sales Bar Chart */}
        <Card style={{ flex: 2, minWidth: "300px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F" }}>
              Sales Overview
            </h3>
            <span
              style={{
                fontSize: "11px",
                background: colors.primaryContainer,
                color: colors.primary,
                padding: "3px 10px",
                borderRadius: "12px",
                fontWeight: 500,
              }}
            >
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={monthlySalesData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4EFF4" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#79747E" }} />
              <YAxis tick={{ fontSize: 12, fill: "#79747E" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="revenue" fill={colors.primary} radius={[6, 6, 0, 0]} name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Pie */}
        <Card style={{ flex: 1, minWidth: "260px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1C1B1F",
              marginBottom: "16px",
            }}
          >
            Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryColors[index % categoryColors.length]}
                  />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: "12px", color: "#49454F" }}>{value}</span>
                )}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1C1B1F",
            marginBottom: "16px",
          }}
        >
          Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlySalesData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4EFF4" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#79747E" }} />
            <YAxis tick={{ fontSize: 12, fill: "#79747E" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="url(#revGrad)"
              name="Revenue ($)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Sales Table */}
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F" }}>
            Recent Sales
          </h3>
          <span
            style={{
              fontSize: "13px",
              color: colors.primary,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            View all →
          </span>
        </div>
        <DataTable
          headers={["Invoice", "Customer", "Items", "Total", "Status", "Date"]}
        >
          {recentSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell style={{ fontWeight: 600, color: colors.primary }}>
                {sale.invoiceNumber}
              </TableCell>
              <TableCell>{sale.customerName}</TableCell>
              <TableCell style={{ color: "#79747E" }}>
                {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
              </TableCell>
              <TableCell style={{ fontWeight: 700 }}>
                {sale.total.toFixed(0)} €
              </TableCell>
              <TableCell>
                <StatusBadge status={sale.status} />
              </TableCell>
              <TableCell style={{ color: "#79747E" }}>{sale.date}</TableCell>
            </TableRow>
          ))}
        </DataTable>
      </Card>
    </div>
  );
}
