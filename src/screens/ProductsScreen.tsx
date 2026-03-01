/**
 * Products Screen
 *
 * Full CRUD for product management with search, filter, and stock tracking.
 * Equivalent to Flutter's ProductsScreen widget.
 */

"use client";

import { useState, useRef } from "react";
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
import { Plus, Search, Edit2, Trash2, Package, Filter, Image, X, Upload } from "lucide-react";
import { useTranslation } from "@/i18n/provider";

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
  const { t } = useTranslation();
  const [form, setForm] = useState<ProductInput>({
    name: product?.name ?? "",
    category: product?.category ?? CATEGORIES[0],
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    description: product?.description ?? "",
    sku: product?.sku ?? "",
    image: product?.image ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: "" });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = t.errors.required;
    if (!form.sku.trim()) e.sku = t.errors.required;
    if (form.price <= 0) e.price = t.errors.positiveNumber;
    if (form.stock < 0) e.stock = t.errors.positiveNumber;
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
      title={product ? t.products.editProduct : t.products.addProduct}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Image Upload */}
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#49454F", display: "block", marginBottom: "8px" }}>
            {t.products.image}
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          {form.image ? (
            <div style={{ position: "relative", width: "120px", height: "120px" }}>
              <img
                src={form.image}
                alt="Product"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: colors.error,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "120px",
                height: "120px",
                border: "2px dashed #CAC4D0",
                borderRadius: "10px",
                background: "#F6F2FF",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#79747E",
              }}
            >
              <Upload size={24} />
              <span style={{ fontSize: "11px" }}>{t.products.uploadImage}</span>
            </button>
          )}
        </div>

        <TextField
          label={t.products.productName}
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
          error={errors.name}
        />
        <TextField
          label={t.products.sku}
          value={form.sku}
          onChange={(v) => setForm({ ...form, sku: v })}
          required
          placeholder="e.g. WH-001"
          error={errors.sku}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <TextField
            label={`${t.products.price} ($)`}
            value={form.price}
            onChange={(v) => setForm({ ...form, price: parseFloat(v) || 0 })}
            type="number"
            required
            error={errors.price}
          />
          <TextField
            label={t.products.stock}
            value={form.stock}
            onChange={(v) => setForm({ ...form, stock: parseInt(v) || 0 })}
            type="number"
            required
            error={errors.stock}
          />
        </div>
        <SelectField
          label={t.products.category}
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          options={CATEGORIES.map((c) => ({ value: c, label: (t.products.categories as Record<string, string>)[c.toLowerCase().replace(" ", "")] || c }))}
          required
        />
        <TextField
          label={t.products.description}
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
          multiline
          rows={3}
          placeholder="Product description..."
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <Button variant="outlined" onClick={onClose} fullWidth>
            {t.common.cancel}
          </Button>
          <Button type="submit" fullWidth>
            {product ? t.products.updateProduct : t.products.addProduct}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Products Screen ──────────────────────────────────────────────────────────
export default function ProductsScreen() {
  const { t } = useTranslation();
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
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1C1B1F" }}>{t.products.title}</h2>
          <p style={{ fontSize: "13px", color: "#79747E", marginTop: "2px" }}>
            {products.length} {t.products.totalProducts} · {products.filter((p) => p.status === "low_stock").length} {t.products.lowStockItems} · {products.filter((p) => p.status === "out_of_stock").length} {t.products.outOfStockItems}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd}>
          {t.products.addProduct}
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
              placeholder={t.products.searchPlaceholder}
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
              <option value="All">{t.products.allCategories}</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{(t.products.categories as Record<string, string>)[c.toLowerCase().replace(" ", "")] || c}</option>)}
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
            <option value="All">{t.products.allStatus}</option>
            <option value="in_stock">{t.products.inStock}</option>
            <option value="low_stock">{t.products.lowStock}</option>
            <option value="out_of_stock">{t.products.outOfStock}</option>
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
                {mode === "table" ? "☰ " + t.products.tableView : "⊞ " + t.products.gridView}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products Table */}
      {viewMode === "table" ? (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <DataTable
            headers={[t.products.productName, t.products.sku, t.products.category, t.products.price, t.products.stock, t.products.status, t.common.actions]}
          >
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover" }}
                      />
                    ) : (
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
                    )}
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
                  {product.price.toFixed(0)} €
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
                      <Edit2 size={12} /> {t.common.edit}
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
                          {t.common.confirm}
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
                          {t.common.cancel}
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
                        <Trash2 size={12} /> {t.common.delete}
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
              title={t.products.noProductsFound}
              subtitle={t.products.tryAdjustingSearch}
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
                  background: product.image 
                    ? `url(${product.image}) center/cover` 
                    : `linear-gradient(135deg, ${colors.primaryContainer}, #E8DEF8)`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                {!product.image && <Package size={36} color={colors.primary} />}
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
                    {product.price.toFixed(0)} €
                  </p>
                  <p style={{ fontSize: "12px", color: "#79747E" }}>
                    {product.stock} {t.products.stock.toLowerCase()}
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
                  title={t.products.noProductsFound}
                  subtitle={t.products.tryAdjustingSearch}
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
