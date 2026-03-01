/**
 * Products Screen
 *
 * Full CRUD for product management with search, filter, and stock tracking.
 * Equivalent to Flutter's ProductsScreen widget.
 */

"use client";

import { useState } from "react";
import { useAppStore } from "@/providers/app.provider";
import { Product, ProductInput, deriveStockStatus } from "@/models/product.model";
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
import { Plus, Search, Edit2, Trash2, Package, Filter } from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Appliances",
  "Sports",
  "Footwear",
  "Furniture",
  "Stationery",
  "Clothing",
  "Food & Beverage",
  "Other",
];

// ─── Product Form Dialog ──────────────────────────────────────────────────────
function ProductFormDialog({
  open,
  onClose,
  product,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (data: ProductInput) => void;
}) {
  const [form, setForm] = useState<ProductInput>({
    name: product?.name ?? "",
    category: product?.category ?? CATEGORIES[0],
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    description: product?.description ?? "",
    sku: product?.sku ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (form.price <= 0) e.price = "Price must be greater than 0";
    if (form.stock < 0) e.stock = "Stock cannot be negative";
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
      title={product ? "Edit Product" : "Add New Product"}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField
          label="Product Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
          error={errors.name}
        />
        <TextField
          label="SKU"
          value={form.sku}
          onChange={(v) => setForm({ ...form, sku: v })}
          required
          placeholder="e.g. WH-001"
          error={errors.sku}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <TextField
            label="Price ($)"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: parseFloat(v) || 0 })}
            type="number"
            required
            error={errors.price}
          />
          <TextField
            label="Stock Quantity"
            value={form.stock}
            onChange={(v) => setForm({ ...form, stock: parseInt(v) || 0 })}
            type="number"
            required
            error={errors.stock}
          />
        </div>
        <SelectField
          label="Category"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          required
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
          multiline
          rows={3}
          placeholder="Product description..."
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" fullWidth>
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Products Screen ──────────────────────────────────────────────────────────
export default function ProductsScreen() {
  const { products, upsertProduct, removeProduct } = useAppStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = (data: ProductInput) => {
    const now = new Date().toISOString();
    if (editProduct) {
      upsertProduct({
        ...editProduct,
        ...data,
        status: deriveStockStatus(data.stock),
        updatedAt: now,
      });
    } else {
      upsertProduct({
        id: `p${Date.now()}`,
        ...data,
        status: deriveStockStatus(data.stock),
        createdAt: now,
        updatedAt: now,
      });
    }
    setDialogOpen(false);
    setEditProduct(null);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditProduct(null);
    setDialogOpen(true);
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1C1B1F" }}>Products</h2>
          <p style={{ fontSize: "13px", color: "#79747E", marginTop: "2px" }}>
            {products.length} total · {products.filter((p) => p.status === "low_stock").length} low stock · {products.filter((p) => p.status === "out_of_stock").length} out of stock
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
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
              placeholder="Search by name, SKU, or category..."
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

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={14} color="#79747E" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1.5px solid #CAC4D0",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#1C1B1F",
                background: "white",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1.5px solid #CAC4D0",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#1C1B1F",
              background: "white",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* View Toggle */}
          <div style={{ display: "flex", gap: "4px" }}>
            {(["table", "grid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1.5px solid #CAC4D0",
                  background: viewMode === mode ? colors.primary : "white",
                  color: viewMode === mode ? "white" : "#79747E",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {mode === "table" ? "☰ Table" : "⊞ Grid"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products Table */}
      {viewMode === "table" ? (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <DataTable
            headers={["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"]}
          >
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: colors.primaryContainer,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Package size={20} color={colors.primary} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#1C1B1F", fontSize: "14px" }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#79747E" }}>
                        {product.description.slice(0, 40)}
                        {product.description.length > 40 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ color: "#79747E", fontFamily: "monospace" }}>
                  {product.sku}
                </TableCell>
                <TableCell style={{ color: "#49454F" }}>{product.category}</TableCell>
                <TableCell style={{ fontWeight: 700, color: colors.primary }}>
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      fontWeight: 600,
                      color: product.stock === 0 ? colors.error : product.stock <= 10 ? colors.warning : colors.success,
                    }}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={product.status} />
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => openEdit(product)}
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
                      <Edit2 size={12} /> Edit
                    </button>
                    {deleteId === product.id ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => { removeProduct(product.id); setDeleteId(null); }}
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
                        onClick={() => setDeleteId(product.id)}
                        style={{
                          padding: "5px 12px",
                          border: `1px solid ${colors.errorContainer}`,
                          borderRadius: "6px",
                          background: colors.errorContainer,
                          color: colors.error,
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 500,
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
              icon={<Package size={52} />}
              title="No products found"
              subtitle="Try adjusting your search or filters"
            />
          )}
        </Card>
      ) : (
        /* Grid View */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((product) => (
            <Card
              key={product.id}
              style={{ cursor: "default", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(103,80,164,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                style={{
                  height: "80px",
                  background: `linear-gradient(135deg, ${colors.primaryContainer}, #E8DEF8)`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <Package size={36} color={colors.primary} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1C1B1F" }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "#79747E", marginTop: "2px" }}>
                    {product.category} · {product.sku}
                  </p>
                </div>
                <StatusBadge status={product.status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                <div>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: colors.primary }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <p style={{ fontSize: "12px", color: "#79747E" }}>
                    {product.stock} units
                  </p>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => openEdit(product)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `1px solid ${colors.primary}`,
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.primary,
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `1px solid ${colors.errorContainer}`,
                      background: colors.errorContainer,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.error,
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1" }}>
              <Card>
                <EmptyState
                  icon={<Package size={52} />}
                  title="No products found"
                  subtitle="Try adjusting your search or filters"
                />
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditProduct(null); }}
        product={editProduct}
        onSave={handleSave}
      />
    </div>
  );
}
