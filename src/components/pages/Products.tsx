"use client";

import { useState } from "react";
import { useShopStore, Product } from "@/lib/store";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Check,
} from "lucide-react";

const categories = ["Electronics", "Appliances", "Sports", "Footwear", "Furniture", "Stationery", "Other"];

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || categories[0],
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    sku: product?.sku || "",
    status: product?.status || "in_stock" as Product["status"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = parseInt(form.stock);
    const status: Product["status"] =
      stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "in_stock";
    onSave({
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock,
      sku: form.sku,
      status,
    });
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
            {product ? "Edit Product" : "Add New Product"}
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
            { label: "Product Name", key: "name", type: "text", required: true },
            { label: "SKU", key: "sku", type: "text", required: true },
            { label: "Price ($)", key: "price", type: "number", required: true },
            { label: "Stock Quantity", key: "stock", type: "number", required: true },
          ].map((field) => (
            <div key={field.key}>
              <label style={{ fontSize: "12px", color: "#9E9E9E", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                required={field.required}
                value={form[field.key as keyof typeof form]}
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
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                color: "#212121",
                background: "white",
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
              {product ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShopStore();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const statusBadge: Record<string, string> = {
    in_stock: "badge-success",
    low_stock: "badge-warning",
    out_of_stock: "badge-error",
  };

  const statusLabel: Record<string, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#212121" }}>Products</h2>
          <p style={{ fontSize: "13px", color: "#9E9E9E", marginTop: "2px" }}>
            {products.length} total products
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setModalOpen(true); }}
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
          Add Product
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
            placeholder="Search products..."
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

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "8px 14px",
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#424242",
            background: "white",
            outline: "none",
          }}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 14px",
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#424242",
            background: "white",
            outline: "none",
          }}
        >
          <option value="All">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((product) => (
          <div
            key={product.id}
            className="material-card elevation-1 transition-all"
            style={{ cursor: "default" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.15)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            {/* Product Icon */}
            <div
              className="flex items-center justify-center rounded-lg mb-3"
              style={{
                height: "80px",
                background: "linear-gradient(135deg, #6200EE15, #03DAC615)",
                borderRadius: "8px",
              }}
            >
              <Package size={36} color="#6200EE" />
            </div>

            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#212121" }}>
                  {product.name}
                </p>
                <p style={{ fontSize: "12px", color: "#9E9E9E", marginTop: "2px" }}>
                  {product.category} · {product.sku}
                </p>
              </div>
              <span className={`chip ${statusBadge[product.status]}`} style={{ fontSize: "11px", marginLeft: "8px" }}>
                {statusLabel[product.status]}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#6200EE" }}>
                  ${product.price.toFixed(2)}
                </p>
                <p style={{ fontSize: "12px", color: "#9E9E9E" }}>
                  {product.stock} units in stock
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditProduct(product); setModalOpen(true); }}
                  style={{
                    width: "34px",
                    height: "34px",
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
                  <Edit2 size={15} />
                </button>
                {deleteConfirm === product.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }}
                      style={{
                        width: "34px",
                        height: "34px",
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
                      <Check size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      style={{
                        width: "34px",
                        height: "34px",
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
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    style={{
                      width: "34px",
                      height: "34px",
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
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="material-card elevation-1 flex flex-col items-center justify-center"
          style={{ padding: "60px", color: "#9E9E9E" }}
        >
          <Package size={48} color="#E0E0E0" />
          <p style={{ marginTop: "16px", fontSize: "16px" }}>No products found</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>Try adjusting your filters</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
          onSave={(data) => {
            if (editProduct) {
              updateProduct(editProduct.id, data);
            } else {
              addProduct(data);
            }
            setModalOpen(false);
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
}
