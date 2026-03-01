/**
 * Reports Screen
 *
 * Daily/monthly sales reports with CSV export functionality.
 * Equivalent to Flutter's ReportsScreen widget.
 */

"use client";

import { useState } from "react";
import { useAppStore } from "@/providers/app.provider";
import { exportSalesToCSV, exportDailySummaryCSV, exportMonthlySummaryCSV } from "@/core/csv-export";
import { Card, StatusBadge, DataTable, TableRow, TableCell, colors } from "@/widgets/ui";
import { useTranslation } from "@/i18n/provider";
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
} from "recharts";
import {
  Download,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PAYMENT_COLORS: Record<string, string> = {
  cash: colors.success,
  credit_card: colors.primary,
  debit_card: "#283593",
  paypal: "#0277BD",
  bank_transfer: "#6A1B9A",
};

export default function ReportsScreen() {
  const { t } = useTranslation();
  const { sales, products } = useAppStore();
  const [reportType, setReportType] = useState<"daily" | "monthly" | "all">("monthly");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter sales based on report type
  const filteredSales = (() => {
    if (reportType === "daily") {
      return sales.filter((s) => s.date === selectedDate && s.status === "completed");
    }
    if (reportType === "monthly") {
      const prefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
      return sales.filter((s) => s.date.startsWith(prefix) && s.status === "completed");
    }
    return sales.filter((s) => s.status === "completed");
  })();

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalTax = filteredSales.reduce((sum, s) => sum + s.taxAmount, 0);
  const avgOrderValue = filteredSales.length ? totalRevenue / filteredSales.length : 0;

  // Monthly breakdown for chart
  const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthSales = sales.filter(
      (s) => s.date.startsWith(prefix) && s.status === "completed"
    );
    return {
      month: MONTHS[d.getMonth()].slice(0, 3),
      revenue: monthSales.reduce((sum, s) => sum + s.total, 0),
      orders: monthSales.length,
    };
  });

  // Payment method breakdown
  const paymentBreakdown = Object.entries(
    filteredSales.reduce((acc, s) => {
      acc[s.paymentMethod] = (acc[s.paymentMethod] || 0) + s.total;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace(/_/g, " "), value: parseFloat(value.toFixed(2)), key: name }));

  // Top products by revenue
  const productRevenue: Record<string, { name: string; revenue: number; qty: number }> = {};
  filteredSales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productRevenue[item.productId]) {
        productRevenue[item.productId] = { name: item.productName, revenue: 0, qty: 0 };
      }
      productRevenue[item.productId].revenue += item.subtotal;
      productRevenue[item.productId].qty += item.quantity;
    });
  });
  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const handleExport = () => {
    if (reportType === "daily") {
      exportDailySummaryCSV(sales, selectedDate);
    } else if (reportType === "monthly") {
      exportMonthlySummaryCSV(sales, selectedYear, selectedMonth + 1);
    } else {
      exportSalesToCSV(filteredSales);
    }
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1C1B1F" }}>Reports & Analytics</h2>
          <p style={{ fontSize: "13px", color: "#79747E", marginTop: "2px" }}>
            Business performance insights
          </p>
        </div>
        <button
          onClick={handleExport}
          style={{
            padding: "10px 20px",
            background: colors.success,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Report Type Selector */}
      <Card style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {(["daily", "monthly", "all"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: reportType === type ? "none" : "1px solid #CAC4D0",
                  background: reportType === type ? colors.primary : "white",
                  color: reportType === type ? "white" : "#49454F",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {type === "daily" && <Calendar size={13} />}
                {type === "monthly" && <FileText size={13} />}
                {type === "all" && <TrendingUp size={13} />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {reportType === "daily" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1.5px solid #CAC4D0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                color: "#1C1B1F",
              }}
            />
          )}

          {reportType === "monthly" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{
                  padding: "8px 12px",
                  border: "1.5px solid #CAC4D0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#1C1B1F",
                  background: "white",
                  outline: "none",
                }}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  padding: "8px 12px",
                  border: "1.5px solid #CAC4D0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#1C1B1F",
                  background: "white",
                  outline: "none",
                }}
              >
                {[2022, 2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* KPI Summary */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {[
          { label: t.reports.totalRevenue, value: `${totalRevenue.toFixed(0)} €`, icon: DollarSign, color: colors.primary },
          { label: t.reports.totalOrders, value: filteredSales.length.toString(), icon: FileText, color: "#03DAC6" },
          { label: t.reports.averageOrderValue, value: `${avgOrderValue.toFixed(0)} €`, icon: TrendingUp, color: "#FF6D00" },
          { label: "Total Taxes", value: `${totalTax.toFixed(0)} €`, icon: DollarSign, color: "#9C27B0" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} style={{ flex: 1, minWidth: "180px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#79747E", marginBottom: "6px" }}>{kpi.label}</p>
                  <p style={{ fontSize: "24px", fontWeight: 700, color: "#1C1B1F" }}>{kpi.value}</p>
                </div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${kpi.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} color={kpi.color} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Monthly Revenue Bar Chart */}
        <Card style={{ flex: 2, minWidth: "300px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F", marginBottom: "16px" }}>
            Monthly Revenue (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyBreakdown} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4EFF4" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#79747E" }} />
              <YAxis tick={{ fontSize: 12, fill: "#79747E" }} />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                formatter={(value) => [`${Number(value).toFixed(0)} €`, t.reports.totalRevenue]}
              />
              <Bar dataKey="revenue" fill={colors.primary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods Pie */}
        <Card style={{ flex: 1, minWidth: "240px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F", marginBottom: "16px" }}>
            Revenue by Payment Method
          </h3>
          {paymentBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentBreakdown.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={PAYMENT_COLORS[entry.key] || colors.primary}
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
                <Tooltip formatter={(value) => [`${Number(value).toFixed(0)} €`, t.reports.totalRevenue]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center", color: "#79747E", fontSize: "14px" }}>
              No data for selected period
            </div>
          )}
        </Card>
      </div>

      {/* Orders Trend */}
      <Card>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F", marginBottom: "16px" }}>
          Orders Trend (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4EFF4" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#79747E" }} />
            <YAxis tick={{ fontSize: 12, fill: "#79747E" }} />
            <Tooltip
              contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke={colors.primary}
              strokeWidth={2.5}
              dot={{ r: 5, fill: colors.primary }}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F", marginBottom: "16px" }}>
            Top Products by Revenue
          </h3>
          <DataTable headers={["Product", "Units Sold", "Revenue", "% of Total"]}>
            {topProducts.map((p) => (
              <TableRow key={p.name}>
                <TableCell style={{ fontWeight: 500 }}>{p.name}</TableCell>
                <TableCell style={{ color: "#49454F" }}>{p.qty}</TableCell>
                <TableCell style={{ fontWeight: 700, color: colors.primary }}>
                  {p.revenue.toFixed(0)} €
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        flex: 1,
                        height: "6px",
                        background: "#E7E0EC",
                        borderRadius: "3px",
                        overflow: "hidden",
                        maxWidth: "100px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0}%`,
                          background: colors.primary,
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "13px", color: "#49454F" }}>
                      {totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </DataTable>
        </Card>
      )}

      {/* Detailed Sales Table */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1C1B1F" }}>
            Sales Detail ({filteredSales.length} records)
          </h3>
          <button
            onClick={handleExport}
            style={{
              padding: "6px 14px",
              border: `1px solid ${colors.success}`,
              borderRadius: "6px",
              background: "transparent",
              color: colors.success,
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
        <DataTable headers={["Invoice", "Date", "Customer", "Items", "Total", "Payment", "Status"]}>
          {filteredSales.slice(0, 10).map((sale) => (
            <TableRow key={sale.id}>
              <TableCell style={{ fontWeight: 600, color: colors.primary }}>
                {sale.invoiceNumber}
              </TableCell>
              <TableCell style={{ color: "#79747E" }}>{sale.date}</TableCell>
              <TableCell>{sale.customerName}</TableCell>
              <TableCell style={{ color: "#79747E" }}>
                {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
              </TableCell>
              <TableCell style={{ fontWeight: 700 }}>{sale.total.toFixed(0)} €</TableCell>
              <TableCell style={{ color: "#49454F" }}>
                {sale.paymentMethod.replace(/_/g, " ")}
              </TableCell>
              <TableCell>
                <StatusBadge status={sale.status} />
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
        {filteredSales.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#79747E" }}>
            No sales data for the selected period
          </div>
        )}
        {filteredSales.length > 10 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid #F4EFF4", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "#79747E" }}>
              Showing 10 of {filteredSales.length} records. Export CSV to see all.
            </span>
          </div>
        )}
      </Card>

      {/* Low Stock Alert */}
      {products.filter((p) => p.status !== "in_stock").length > 0 && (
        <Card style={{ border: `1px solid ${colors.warningContainer}`, background: colors.warningContainer }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: colors.warning, marginBottom: "12px" }}>
            ⚠️ Stock Alerts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {products
              .filter((p) => p.status !== "in_stock")
              .map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "white",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{p.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "13px", color: "#79747E" }}>{p.stock} units</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
