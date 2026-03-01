"use client";

import { useState } from "react";
import { useShopStore, Customer } from "@/lib/store";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  X,
  Check,
} from "lucide-react";

function CustomerModal({
  customer,
  onClose,
  onSave,
}: {
  customer?: Customer | null;
  onClose: () => void;
  onSave: (data: Omit<Customer, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    status: customer?.status || "active" as Customer["status"],
    totalOrders: customer?.totalOrders || 0,
    totalSpent: customer?.totalSpent || 0,
    joinDate: customer?.joinDate || new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

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
        style={{ width: "480px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#212121" }}>
            {customer ? "Edit Customer" : "Add New Customer"}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9E9E9E" }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Full Name", key: "name", type: "text" },
            { label: "Email Address", key: "email", type: "email" },
            { label: "Phone Number", key: "phone", type: "tel" },
            { label: "Address", key: "address", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label style={{ fontSize: "12px", color: "#9E9E9E", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                required
                value={form[field.key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#212121",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: "12px", color: "#9E9E9E", fontWeight: 500, display: "block", marginBottom: "6px" }}>
              Status
            </label>
            <div className="flex gap-3">
              {(["active", "inactive"] as Customer["status"][]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: form.status === s ? "2px solid #6200EE" : "1px solid #E0E0E0",
                    borderRadius: "6px",
                    background: form.status === s ? "#F8F5FF" : "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: form.status === s ? "#6200EE" : "#616161",
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                background: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: "#616161",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                background: "#6200EE",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: "white",
              }}
            >
              {customer ? "Update" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useShopStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const avatarColors = [
    "#6200EE", "#03DAC6", "#FF6D00", "#00BCD4", "#9C27B0", "#F44336",
  ];

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#212121" }}>Customers</h2>
          <p style={{ fontSize: "13px", color: "#9E9E9E", marginTop: "2px" }}>
            {customers.length} total customers
          </p>
        </div>
        <button
          onClick={() => { setEditCustomer(null); setModalOpen(true); }}
          className="flex items-center gap-2 ripple"
          style={{
            padding: "10px 20px",
            background: "#6200EE",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="material-card elevation-1 flex flex-wrap gap-3 items-center">
        <div
          className="flex items-center gap-2"
          style={{
            background: "#F5F5F5",
            borderRadius: "8px",
            padding: "8px 14px",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <Search size={16} color="#9E9E9E" />
          <input
            type="text"
            placeholder="Search customers..."
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

        <div className="flex gap-2">
          {["All", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: filterStatus === s ? "none" : "1px solid #E0E0E0",
                background: filterStatus === s ? "#6200EE" : "white",
                color: filterStatus === s ? "white" : "#616161",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(["grid", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #E0E0E0",
                background: viewMode === mode ? "#6200EE" : "white",
                color: viewMode === mode ? "white" : "#616161",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {mode === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Grid/List */}
      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((customer, idx) => (
            <div
              key={customer.id}
              className="material-card elevation-1 transition-all"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: avatarColors[idx % avatarColors.length],
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#212121" }}>
                      {customer.name}
                    </p>
                    <span
                      className={`chip ${customer.status === "active" ? "badge-success" : "badge-neutral"}`}
                      style={{ fontSize: "11px", marginTop: "2px" }}
                    >
                      {customer.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditCustomer(customer); setModalOpen(true); }}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid #E0E0E0",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6200EE",
                    }}
                  >
                    <Edit2 size={13} />
                  </button>
                  {deleteConfirm === customer.id ? (
                    <>
                      <button
                        onClick={() => { deleteCustomer(customer.id); setDeleteConfirm(null); }}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#F44336",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "1px solid #E0E0E0",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9E9E9E",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(customer.id)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "1px solid #FFCDD2",
                        background: "#FFF5F5",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#F44336",
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                <div className="flex items-center gap-2">
                  <Mail size={13} color="#9E9E9E" />
                  <span style={{ fontSize: "12px", color: "#616161" }}>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} color="#9E9E9E" />
                  <span style={{ fontSize: "12px", color: "#616161" }}>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} color="#9E9E9E" />
                  <span style={{ fontSize: "12px", color: "#616161" }}>{customer.address}</span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  padding: "10px",
                  background: "#F8F5FF",
                  borderRadius: "8px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "#6200EE" }}>
                    {customer.totalOrders}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9E9E9E" }}>Orders</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "#6200EE" }}>
                    ${customer.totalSpent.toFixed(0)}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9E9E9E" }}>Spent</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="material-card elevation-1" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
                {["Customer", "Email", "Phone", "Orders", "Total Spent", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#9E9E9E",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, idx) => (
                <tr
                  key={customer.id}
                  style={{ borderBottom: "1px solid #FAFAFA" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: "36px",
                          height: "36px",
                          background: avatarColors[idx % avatarColors.length],
                          color: "white",
                          fontSize: "13px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#212121" }}>
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#616161" }}>
                    {customer.email}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#616161" }}>
                    {customer.phone}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#212121", textAlign: "center" }}>
                    {customer.totalOrders}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#6200EE" }}>
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`chip ${customer.status === "active" ? "badge-success" : "badge-neutral"}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditCustomer(customer); setModalOpen(true); }}
                        style={{
                          padding: "5px 12px",
                          border: "1px solid #6200EE",
                          borderRadius: "6px",
                          background: "transparent",
                          color: "#6200EE",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        style={{
                          padding: "5px 12px",
                          border: "1px solid #FFCDD2",
                          borderRadius: "6px",
                          background: "#FFF5F5",
                          color: "#F44336",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center" style={{ padding: "60px", color: "#9E9E9E" }}>
              <Users size={48} color="#E0E0E0" />
              <p style={{ marginTop: "16px", fontSize: "16px" }}>No customers found</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <CustomerModal
          customer={editCustomer}
          onClose={() => { setModalOpen(false); setEditCustomer(null); }}
          onSave={(data) => {
            if (editCustomer) {
              updateCustomer(editCustomer.id, data);
            } else {
              addCustomer(data);
            }
            setModalOpen(false);
            setEditCustomer(null);
          }}
        />
      )}
    </div>
  );
}
