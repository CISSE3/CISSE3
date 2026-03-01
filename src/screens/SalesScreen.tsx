/**
 * Sales Screen
 *
 * Create new sales, view invoice history, auto-update stock.
 * Equivalent to Flutter's SalesScreen widget.
 */

"use client";

import { useState } from "react";
import { useAppStore } from "@/providers/app.provider";
import { Sale, SaleItem, generateInvoiceNumber } from "@/models/sale.model";
import { deriveStockStatus } from "@/models/product.model";
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
  Eye,
  X,
  ShoppingCart,
  Printer,
  Trash2,
} from "lucide-react";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

// ─── New Sale Dialog ──────────────────────────────────────────────────────────
function NewSaleDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, "id" | "invoiceNumber" | "createdAt">) => void;
}) {
  const { products, customers } = useAppStore();
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<Sale["paymentMethod"]>("cash");
  const [tax, setTax] = useState("10");
  const [notes, setNotes] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState("1");
  const [error, setError] = useState("");

  const customer = customers.find((c) => c.id === customerId);
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const taxAmount = (subtotal * parseFloat(tax || "0")) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    const quantity = parseInt(qty) || 1;
    if (quantity > product.stock) {
      setError(`Only ${product.stock} units available for ${product.name}`);
      return;
    }
    setError("");
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      setItems(
        items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity, subtotal: (i.quantity + quantity) * i.unitPrice }
            : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.price,
          subtotal: quantity * product.price,
        },
      ]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      setError("Please add at least one product");
      return;
    }
    onSave({
      customerId,
      customerName: customer?.name ?? "Walk-in Customer",
      items,
      subtotal,
      tax: parseFloat(tax || "0"),
      taxAmount,
      total,
      paymentMethod,
      status: "completed",
      notes,
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} title="Create New Sale" maxWidth="600px">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Customer */}
        <SelectField
          label="Customer"
          value={customerId}
          onChange={setCustomerId}
          options={[
            { value: "", label: "Walk-in Customer" },
            ...customers.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        {/* Add Product */}
        <div
          style={{
            padding: "14px",
            background: "#F6F2FF",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#49454F", marginBottom: "10px" }}>
            ADD PRODUCT
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{
                flex: 2,
                padding: "9px 12px",
                border: "1.5px solid #CAC4D0",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1C1B1F",
                background: "white",
                outline: "none",
                minWidth: "160px",
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} — ${p.price.toFixed(2)} ({p.stock} left)
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={{
                width: "70px",
                padding: "9px 12px",
                border: "1.5px solid #CAC4D0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                color: "#1C1B1F",
              }}
            />
            <Button onClick={addItem} icon={<Plus size={14} />} size="small">
              Add
            </Button>
          </div>
          {error && (
            <p style={{ fontSize: "12px", color: colors.error, marginTop: "6px" }}>{error}</p>
          )}
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div
            style={{
              border: "1px solid #E7E0EC",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F6F2FF" }}>
                  {["Product", "Qty", "Unit Price", "Subtotal", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        fontSize: "11px",
                        color: "#49454F",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} style={{ borderTop: "1px solid #F4EFF4" }}>
                    <td style={{ padding: "8px 12px", fontSize: "13px" }}>{item.productName}</td>
                    <td style={{ padding: "8px 12px", fontSize: "13px" }}>{item.quantity}</td>
                    <td style={{ padding: "8px 12px", fontSize: "13px" }}>${item.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: "8px 12px", fontSize: "13px", fontWeight: 600, color: colors.primary }}>
                      ${item.subtotal.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <button
                        onClick={() => removeItem(item.productId)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: colors.error,
                          padding: "2px",
                        }}
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div
          style={{
            padding: "14px",
            background: "#F6F2FF",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: "#49454F" }}>Subtotal</span>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#49454F" }}>Tax (%)</span>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              style={{
                width: "60px",
                padding: "4px 8px",
                border: "1px solid #CAC4D0",
                borderRadius: "6px",
                fontSize: "13px",
                textAlign: "right",
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: "#49454F" }}>Tax Amount</span>
            <span style={{ fontSize: "13px" }}>${taxAmount.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #E7E0EC",
              paddingTop: "8px",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#1C1B1F" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: colors.primary }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment & Notes */}
        <SelectField
          label="Payment Method"
          value={paymentMethod}
          onChange={(v) => setPaymentMethod(v as Sale["paymentMethod"])}
          options={PAYMENT_METHODS}
        />
        <TextField
          label="Notes (optional)"
          value={notes}
          onChange={setNotes}
          multiline
          rows={2}
          placeholder="Any special instructions..."
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button onClick={handleSubmit} fullWidth icon={<ShoppingCart size={15} />}>
            Complete Sale
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Invoice Detail Dialog ────────────────────────────────────────────────────
function InvoiceDialog({
  sale,
  onClose,
  onStatusChange,
}: {
  sale: Sale;
  onClose: () => void;
  onStatusChange: (status: Sale["status"]) => void;
}) {
  return (
    <Dialog open={true} onClose={onClose} title={`Invoice ${sale.invoiceNumber}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Invoice Header */}
        <div
          style={{
            padding: "14px",
            background: colors.primaryContainer,
            borderRadius: "10px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <div>
            <p style={{ fontSize: "11px", color: "#49454F" }}>Invoice #</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: colors.primary }}>
              {sale.invoiceNumber}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#49454F" }}>Date</p>
            <p style={{ fontSize: "14px", fontWeight: 600 }}>{sale.date}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#49454F" }}>Customer</p>
            <p style={{ fontSize: "14px", fontWeight: 600 }}>{sale.customerName}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#49454F" }}>Payment</p>
            <p style={{ fontSize: "14px", fontWeight: 600 }}>
              {sale.paymentMethod.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Items */}
        <div>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#49454F", marginBottom: "8px" }}>
            ITEMS
          </p>
          {sale.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < sale.items.length - 1 ? "1px solid #F4EFF4" : "none",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>{item.productName}</p>
                <p style={{ fontSize: "12px", color: "#79747E" }}>
                  ${item.unitPrice.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: colors.primary }}>
                ${item.subtotal.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ background: "#F6F2FF", borderRadius: "10px", padding: "14px" }}>
          {[
            { label: "Subtotal", value: `$${sale.subtotal.toFixed(2)}` },
            { label: `Tax (${sale.tax}%)`, value: `$${sale.taxAmount.toFixed(2)}` },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "13px", color: "#49454F" }}>{row.label}</span>
              <span style={{ fontSize: "13px" }}>{row.value}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #E7E0EC",
              paddingTop: "8px",
              marginTop: "4px",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: colors.primary }}>
              ${sale.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#49454F", marginBottom: "8px" }}>
            UPDATE STATUS
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(["pending", "completed", "cancelled", "refunded"] as Sale["status"][]).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "20px",
                  border: sale.status === s ? "none" : "1px solid #CAC4D0",
                  background: sale.status === s ? colors.primary : "white",
                  color: sale.status === s ? "white" : "#49454F",
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

        {sale.notes && (
          <div style={{ padding: "10px 14px", background: "#FFF8E1", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#E65100", fontWeight: 600 }}>Notes</p>
            <p style={{ fontSize: "13px", color: "#49454F", marginTop: "4px" }}>{sale.notes}</p>
          </div>
        )}

        <Button
          variant="outlined"
          icon={<Printer size={15} />}
          onClick={() => window.print()}
          fullWidth
        >
          Print Invoice
        </Button>
      </div>
    </Dialog>
  );
}

// ─── Sales Screen ─────────────────────────────────────────────────────────────
export default function SalesScreen() {
  const { sales, products, addSale, updateSaleStatus, upsertProduct } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [newSaleOpen, setNewSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filtered = sales.filter((s) => {
    const matchSearch =
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    All: sales.length,
    completed: sales.filter((s) => s.status === "completed").length,
    pending: sales.filter((s) => s.status === "pending").length,
    cancelled: sales.filter((s) => s.status === "cancelled").length,
  };

  const handleNewSale = (saleData: Omit<Sale, "id" | "invoiceNumber" | "createdAt">) => {
    const now = new Date().toISOString();
    const newSale: Sale = {
      ...saleData,
      id: `s${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(sales.length),
      createdAt: now,
    };
    addSale(newSale);

    // Reduce stock for each item
    saleData.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        upsertProduct({
          ...product,
          stock: newStock,
          status: deriveStockStatus(newStock),
          updatedAt: now,
        });
      }
    });

    setNewSaleOpen(false);
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1C1B1F" }}>Sales</h2>
          <p style={{ fontSize: "13px", color: "#79747E", marginTop: "2px" }}>
            {sales.length} total · $
            {sales
              .filter((s) => s.status === "completed")
              .reduce((sum, s) => sum + s.total, 0)
              .toFixed(2)}{" "}
            revenue
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setNewSaleOpen(true)}>
          New Sale
        </Button>
      </div>

      {/* Status Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: statusFilter === status ? "none" : "1px solid #CAC4D0",
              background: statusFilter === status ? colors.primary : "white",
              color: statusFilter === status ? "white" : "#49454F",
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
                background: statusFilter === status ? "rgba(255,255,255,0.25)" : "#F4EFF4",
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
      <Card style={{ padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#F6F2FF",
            borderRadius: "8px",
            padding: "8px 14px",
          }}
        >
          <Search size={16} color="#79747E" />
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
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
      </Card>

      {/* Sales Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          headers={["Invoice", "Customer", "Items", "Subtotal", "Tax", "Total", "Payment", "Status", "Date", "Actions"]}
        >
          {filtered.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell style={{ fontWeight: 700, color: colors.primary }}>
                {sale.invoiceNumber}
              </TableCell>
              <TableCell>{sale.customerName}</TableCell>
              <TableCell style={{ color: "#79747E" }}>
                {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
              </TableCell>
              <TableCell>${sale.subtotal.toFixed(2)}</TableCell>
              <TableCell style={{ color: "#79747E" }}>{sale.tax}%</TableCell>
              <TableCell style={{ fontWeight: 700 }}>${sale.total.toFixed(2)}</TableCell>
              <TableCell style={{ color: "#49454F" }}>
                {sale.paymentMethod.replace(/_/g, " ")}
              </TableCell>
              <TableCell>
                <StatusBadge status={sale.status} />
              </TableCell>
              <TableCell style={{ color: "#79747E" }}>{sale.date}</TableCell>
              <TableCell>
                <button
                  onClick={() => setSelectedSale(sale)}
                  style={{
                    padding: "5px 12px",
                    border: `1px solid ${colors.primary}`,
                    borderRadius: "6px",
                    background: "transparent",
                    color: colors.primary,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Eye size={12} /> View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
        {filtered.length === 0 && (
          <EmptyState
            icon={<ShoppingCart size={52} />}
            title="No sales found"
            subtitle="Create your first sale or adjust filters"
          />
        )}
      </Card>

      {/* New Sale Dialog */}
      <NewSaleDialog
        open={newSaleOpen}
        onClose={() => setNewSaleOpen(false)}
        onSave={handleNewSale}
      />

      {/* Invoice Detail Dialog */}
      {selectedSale && (
        <InvoiceDialog
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onStatusChange={(status) => {
            updateSaleStatus(selectedSale.id, status);
            setSelectedSale({ ...selectedSale, status });
          }}
        />
      )}
    </div>
  );
}

// Suppress unused import
void Trash2;
