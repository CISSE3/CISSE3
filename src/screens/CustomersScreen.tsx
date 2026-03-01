/**
 * Customers Screen
 *
 * Customer management with CRUD and purchase history view.
 * Equivalent to Flutter's CustomersScreen widget.
 */

"use client";

import { useState } from "react";
import { useAppStore } from "@/providers/app.provider";
import { Customer, CustomerInput } from "@/models/customer.model";
import { Sale } from "@/models/sale.model";
import {
  Card,
  Dialog,
  TextField,
  SelectField,
  Button,
  StatusBadge,
  DataTable,
  TableRow,
  TableCell,
  EmptyState,
  colors,
} from "@/widgets/ui";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  History,
} from "lucide-react";

// ─── Customer Form Dialog ─────────────────────────────────────────────────────
function CustomerFormDialog({
  open,
  onClose,
  customer,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (data: CustomerInput) => void;
}) {
  const [form, setForm] = useState<CustomerInput>({
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    city: customer?.city ?? "",
    country: customer?.country ?? "USA",
    status: customer?.status ?? "active",
    notes: customer?.notes ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInput, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add New Customer"}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <TextField
          label="Full Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
          error={errors.name}
        />
        <TextField
          label="Email Address"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          type="email"
          required
          error={errors.email}
        />
        <TextField
          label="Phone Number"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          type="tel"
          placeholder="+1 555-0100"
        />
        <TextField
          label="Street Address"
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <TextField
            label="City"
            value={form.city}
            onChange={(v) => setForm({ ...form, city: v })}
          />
          <TextField
            label="Country"
            value={form.country}
            onChange={(v) => setForm({ ...form, country: v })}
          />
        </div>
        <SelectField
          label="Status"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v as Customer["status"] })}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <TextField
          label="Notes"
          value={form.notes}
          onChange={(v) => setForm({ ...form, notes: v })}
          multiline
          rows={2}
          placeholder="Any notes about this customer..."
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" fullWidth>
            {customer ? "Update Customer" : "Add Customer"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Purchase History Dialog ──────────────────────────────────────────────────
function PurchaseHistoryDialog({
  customer,
  sales,
  onClose,
}: {
  customer: Customer;
  sales: Sale[];
  onClose: () => void;
}) {
  const customerSales = sales.filter((s) => s.customerId === customer.id);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      title={`${customer.name} — Purchase History`}
      maxWidth="560px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          {[
            { label: "Total Orders", value: customerSales.length.toString() },
            {
              label: "Total Spent",
              value: `$${customerSales
                .filter((s) => s.status === "completed")
                .reduce((sum, s) => sum + s.total, 0)
                .toFixed(2)}`,
            },
            {
              label: "Avg Order",
              value: customerSales.length
                ? `$${(
                    customerSales
                      .filter((s) => s.status === "completed")
                      .reduce((sum, s) => sum + s.total, 0) /
                    Math.max(1, customerSales.filter((s) => s.status === "completed").length)
                  ).toFixed(2)}`
                : "$0.00",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "12px",
                background: colors.primaryContainer,
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: 700, color: colors.primary }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "11px", color: "#49454F", marginTop: "4px" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sales List */}
        {customerSales.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {customerSales.map((sale) => (
              <div
                key={sale.id}
                style={{
                  padding: "12px 14px",
                  border: "1px solid #E7E0EC",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: colors.primary }}>
                    {sale.invoiceNumber}
                  </p>
                  <p style={{ fontSize: "12px", color: "#79747E", marginTop: "2px" }}>
                    {sale.date} · {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "16px", fontWeight: 700 }}>${sale.total.toFixed(2)}</p>
                  <StatusBadge status={sale.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<History size={40} />}
            title="No purchase history"
            subtitle="This customer hasn't made any purchases yet"
          />
        )}
      </div>
    </Dialog>
  );
}

// ─── Customers Screen ─────────────────────────────────────────────────────────
export default function CustomersScreen() {
  const { customers, sales, upsertCustomer, removeCustomer } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    colors.primary, "#03DAC6", "#FF6D00", "#00BCD4", "#9C27B0", "#F44336",
  ];

  const handleSave = (data: CustomerInput) => {
    if (editCustomer) {
      upsertCustomer({ ...editCustomer, ...data });
    } else {
      upsertCustomer({
        id: `c${Date.now()}`,
        ...data,
        totalOrders: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().split("T")[0],
      });
    }
    setDialogOpen(false);
    setEditCustomer(null);
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1C1B1F" }}>Customers</h2>
          <p style={{ fontSize: "13px", color: "#79747E", marginTop: "2px" }}>
            {customers.length} total · {customers.filter((c) => c.status === "active").length} active
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => { setEditCustomer(null); setDialogOpen(true); }}
        >
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#F6F2FF",
              borderRadius: "8px",
              padding: "8px 14px",
              flex: 1,
              minWidth: "200px",
            }}
          >
            <Search size={16} color="#79747E" />
            <input
              type="text"
              placeholder="Search by name, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: statusFilter === s ? "none" : "1px solid #CAC4D0",
                  background: statusFilter === s ? colors.primary : "white",
                  color: statusFilter === s ? "white" : "#49454F",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          headers={["Customer", "Contact", "Location", "Orders", "Total Spent", "Status", "Actions"]}
        >
          {filtered.map((customer, idx) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: avatarColors[idx % avatarColors.length],
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "#1C1B1F", fontSize: "14px" }}>
                      {customer.name}
                    </p>
                    <p style={{ fontSize: "11px", color: "#79747E" }}>
                      Since {customer.joinDate}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Mail size={12} color="#79747E" />
                    <span style={{ fontSize: "12px", color: "#49454F" }}>{customer.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Phone size={12} color="#79747E" />
                    <span style={{ fontSize: "12px", color: "#49454F" }}>{customer.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <MapPin size={12} color="#79747E" />
                  <span style={{ fontSize: "13px", color: "#49454F" }}>
                    {customer.city}, {customer.country}
                  </span>
                </div>
              </TableCell>
              <TableCell style={{ fontWeight: 600, textAlign: "center" }}>
                {customer.totalOrders}
              </TableCell>
              <TableCell style={{ fontWeight: 700, color: colors.primary }}>
                ${customer.totalSpent.toFixed(2)}
              </TableCell>
              <TableCell>
                <StatusBadge status={customer.status} />
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => setHistoryCustomer(customer)}
                    style={{
                      padding: "5px 10px",
                      border: "1px solid #CAC4D0",
                      borderRadius: "6px",
                      background: "white",
                      color: "#49454F",
                      cursor: "pointer",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <History size={12} /> History
                  </button>
                  <button
                    onClick={() => { setEditCustomer(customer); setDialogOpen(true); }}
                    style={{
                      padding: "5px 10px",
                      border: `1px solid ${colors.primary}`,
                      borderRadius: "6px",
                      background: "transparent",
                      color: colors.primary,
                      cursor: "pointer",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  {deleteId === customer.id ? (
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => { removeCustomer(customer.id); setDeleteId(null); }}
                        style={{
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "6px",
                          background: colors.error,
                          color: "white",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        style={{
                          padding: "5px 10px",
                          border: "1px solid #CAC4D0",
                          borderRadius: "6px",
                          background: "white",
                          color: "#79747E",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(customer.id)}
                      style={{
                        padding: "5px 10px",
                        border: `1px solid ${colors.errorContainer}`,
                        borderRadius: "6px",
                        background: colors.errorContainer,
                        color: colors.error,
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
        {filtered.length === 0 && (
          <EmptyState
            icon={<Users size={52} />}
            title="No customers found"
            subtitle="Add your first customer or adjust filters"
          />
        )}
      </Card>

      {/* Customer Form Dialog */}
      <CustomerFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditCustomer(null); }}
        customer={editCustomer}
        onSave={handleSave}
      />

      {/* Purchase History Dialog */}
      {historyCustomer && (
        <PurchaseHistoryDialog
          customer={historyCustomer}
          sales={sales}
          onClose={() => setHistoryCustomer(null)}
        />
      )}
    </div>
  );
}
