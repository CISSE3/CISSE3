"use client";

import { useState } from "react";
import { useShopStore, Order } from "@/lib/store";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
} from "lucide-react";

const statusColors: Record<string, string> = {
  completed: "badge-success",
  processing: "badge-info",
  pending: "badge-warning",
  cancelled: "badge-error",
};

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: Order["status"]) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        className="material-card elevation-4"
        style={{ width: "520px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#212121" }}>
              Order #{order.id.toUpperCase()}
            </h2>
            <p style={{ fontSize: "13px", color: "#9E9E9E", marginTop: "2px" }}>
              {order.date} · {order.paymentMethod}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9E9E9E" }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Customer Info */}
        <div
          style={{
            padding: "14px",
            background: "#F8F5FF",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#9E9E9E", marginBottom: "4px" }}>Customer</p>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#212121" }}>
            {order.customerName}
          </p>
        </div>

        {/* Items */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#616161", marginBottom: "10px" }}>
            ORDER ITEMS
          </p>
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{
                padding: "10px 0",
                borderBottom: i < order.items.length - 1 ? "1px solid #F5F5F5" : "none",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#212121" }}>
                  {item.productName}
                </p>
                <p style={{ fontSize: "12px", color: "#9E9E9E" }}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#6200EE" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px",
            background: "#F5F5F5",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#424242" }}>Total</p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#212121" }}>
            ${order.total.toFixed(2)}
          </p>
        </div>

        {/* Status Update */}
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#616161", marginBottom: "10px" }}>
            UPDATE STATUS
          </p>
          <div className="flex gap-2 flex-wrap">
            {(["pending", "processing", "completed", "cancelled"] as Order["status"][]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: order.status === status ? "none" : "1px solid #E0E0E0",
                    background:
                      order.status === status
                        ? status === "completed"
                          ? "#4CAF50"
                          : status === "processing"
                          ? "#2196F3"
                          : status === "pending"
                          ? "#FF9800"
                          : "#F44336"
                        : "white",
                    color: order.status === status ? "white" : "#616161",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { orders, updateOrderStatus } = useShopStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = orders
    .filter((o) => {
      const matchSearch =
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || o.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDir === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return sortDir === "desc" ? b.total - a.total : a.total - b.total;
    });

  const toggleSort = (field: "date" | "total") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: "date" | "total" }) =>
    sortField === field ? (
      sortDir === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />
    ) : null;

  const statusCounts = {
    All: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#212121" }}>Orders</h2>
        <p style={{ fontSize: "13px", color: "#9E9E9E", marginTop: "2px" }}>
          {orders.length} total orders
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: filterStatus === status ? "none" : "1px solid #E0E0E0",
              background: filterStatus === status ? "#6200EE" : "white",
              color: filterStatus === status ? "white" : "#616161",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span
              style={{
                background: filterStatus === status ? "rgba(255,255,255,0.3)" : "#F5F5F5",
                borderRadius: "10px",
                padding: "1px 7px",
                fontSize: "11px",
              }}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="material-card elevation-1">
        <div
          className="flex items-center gap-2"
          style={{
            background: "#F5F5F5",
            borderRadius: "8px",
            padding: "8px 14px",
          }}
        >
          <Search size={16} color="#9E9E9E" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      </div>

      {/* Table */}
      <div className="material-card elevation-1" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
              {[
                { label: "Order ID", field: null },
                { label: "Customer", field: null },
                { label: "Items", field: null },
                { label: "Total", field: "total" as const },
                { label: "Status", field: null },
                { label: "Date", field: "date" as const },
                { label: "Payment", field: null },
                { label: "Actions", field: null },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={() => col.field && toggleSort(col.field)}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "#9E9E9E",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: col.field ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                style={{ borderBottom: "1px solid #FAFAFA" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "#6200EE" }}>
                  #{order.id.toUpperCase()}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#424242" }}>
                  {order.customerName}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#616161" }}>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 700, color: "#212121" }}>
                  ${order.total.toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span className={`chip ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#9E9E9E" }}>
                  {order.date}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#616161" }}>
                  {order.paymentMethod}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: "6px 14px",
                      border: "1px solid #6200EE",
                      borderRadius: "6px",
                      background: "transparent",
                      color: "#6200EE",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Eye size={13} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center"
            style={{ padding: "60px", color: "#9E9E9E" }}
          >
            <ShoppingCart size={48} color="#E0E0E0" />
            <p style={{ marginTop: "16px", fontSize: "16px" }}>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(status) => {
            updateOrderStatus(selectedOrder.id, status);
            setSelectedOrder({ ...selectedOrder, status });
          }}
        />
      )}
    </div>
  );
}
