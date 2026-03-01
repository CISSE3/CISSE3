/**
 * Shared UI Widgets
 *
 * Reusable Material 3 design components.
 * Equivalent to Flutter's widget library.
 */

"use client";

import React from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useTranslation } from "@/i18n/provider";

// ─── Color System (Material 3) ────────────────────────────────────────────────
export const colors = {
  primary: "#6750A4",
  primaryContainer: "#EADDFF",
  secondary: "#625B71",
  secondaryContainer: "#E8DEF8",
  tertiary: "#7D5260",
  surface: "#FFFBFE",
  surfaceVariant: "#E7E0EC",
  background: "#F6F2FF",
  error: "#B3261E",
  errorContainer: "#F9DEDC",
  onPrimary: "#FFFFFF",
  onSurface: "#1C1B1F",
  onSurfaceVariant: "#49454F",
  outline: "#79747E",
  success: "#2E7D32",
  successContainer: "#E8F5E9",
  warning: "#E65100",
  warningContainer: "#FFF3E0",
  info: "#1565C0",
  infoContainer: "#E3F2FD",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusConfig = {
  in_stock: { bg: colors.successContainer, color: colors.success, label: "In Stock" },
  low_stock: { bg: colors.warningContainer, color: colors.warning, label: "Low Stock" },
  out_of_stock: { bg: colors.errorContainer, color: colors.error, label: "Out of Stock" },
  active: { bg: colors.successContainer, color: colors.success, label: "Active" },
  inactive: { bg: "#F5F5F5", color: "#616161", label: "Inactive" },
  completed: { bg: colors.successContainer, color: colors.success, label: "Completed" },
  pending: { bg: colors.warningContainer, color: colors.warning, label: "Pending" },
  processing: { bg: colors.infoContainer, color: colors.info, label: "Processing" },
  cancelled: { bg: colors.errorContainer, color: colors.error, label: "Cancelled" },
  refunded: { bg: "#F3E5F5", color: "#6A1B9A", label: "Refunded" },
  cash: { bg: colors.successContainer, color: colors.success, label: "Cash" },
  credit_card: { bg: colors.infoContainer, color: colors.info, label: "Credit Card" },
  debit_card: { bg: "#E8EAF6", color: "#283593", label: "Debit Card" },
  paypal: { bg: "#E3F2FD", color: "#0277BD", label: "PayPal" },
  bank_transfer: { bg: "#F3E5F5", color: "#6A1B9A", label: "Bank Transfer" },
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const statusLabels: Record<string, string> = {
    in_stock: t.status.in_stock,
    low_stock: t.status.low_stock,
    out_of_stock: t.status.out_of_stock,
    active: t.customers.active,
    inactive: t.customers.inactive,
    completed: t.sales.completed,
    pending: t.sales.pending,
    processing: t.reports.thisMonth, // Using closest available
    cancelled: t.sales.cancelled,
    refunded: t.sales.refunded,
    cash: t.sales.paymentMethods.cash,
    credit_card: t.sales.paymentMethods.credit_card,
    debit_card: t.sales.paymentMethods.debit_card,
    paypal: t.sales.paymentMethods.paypal,
    bank_transfer: t.sales.paymentMethods.bank_transfer,
  };
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? {
    bg: "#F5F5F5",
    color: "#616161",
    label: status,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.color,
        whiteSpace: "nowrap",
      }}
    >
      {statusLabels[status] || cfg.label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  style,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Dialog / Modal ───────────────────────────────────────────────────────────
export function Dialog({
  open,
  onClose,
  title,
  children,
  maxWidth = "480px",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1C1B1F" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#79747E",
              padding: "4px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Text Field ───────────────────────────────────────────────────────────────
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  multiline,
  rows = 3,
  error,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  error?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? colors.error : focused ? colors.primary : "#CAC4D0";

  const commonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${borderColor}`,
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#1C1B1F",
    fontFamily: "inherit",
    background: "white",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: error ? colors.error : focused ? colors.primary : "#49454F",
        }}
      >
        {label}
        {required && <span style={{ color: colors.error }}> *</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...commonStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={commonStyle}
        />
      )}
      {error && (
        <span style={{ fontSize: "11px", color: colors.error }}>{error}</span>
      )}
    </div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────
export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: focused ? colors.primary : "#49454F",
        }}
      >
        {label}
        {required && <span style={{ color: colors.error }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1.5px solid ${focused ? colors.primary : "#CAC4D0"}`,
          borderRadius: "8px",
          fontSize: "14px",
          outline: "none",
          color: "#1C1B1F",
          background: "white",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({
  children,
  onClick,
  variant = "filled",
  color = "primary",
  disabled,
  type = "button",
  fullWidth,
  size = "medium",
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "filled" | "outlined" | "text" | "tonal";
  color?: "primary" | "error" | "success";
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
}) {
  const colorMap = {
    primary: colors.primary,
    error: colors.error,
    success: colors.success,
  };
  const c = colorMap[color];

  const padding = size === "small" ? "6px 14px" : size === "large" ? "14px 28px" : "10px 20px";
  const fontSize = size === "small" ? "13px" : size === "large" ? "16px" : "14px";

  const styles: Record<string, React.CSSProperties> = {
    filled: { background: c, color: "white", border: "none" },
    outlined: { background: "transparent", color: c, border: `1.5px solid ${c}` },
    text: { background: "transparent", color: c, border: "none" },
    tonal: { background: `${c}20`, color: c, border: "none" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding,
        fontSize,
        fontWeight: 500,
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        width: fullWidth ? "100%" : "auto",
        justifyContent: "center",
        fontFamily: "inherit",
        transition: "opacity 0.15s",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── Snackbar / Toast ─────────────────────────────────────────────────────────
export function Snackbar({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}) {
  const config = {
    success: { bg: colors.success, icon: CheckCircle },
    error: { bg: colors.error, icon: AlertCircle },
    info: { bg: colors.info, icon: Info },
    warning: { bg: colors.warning, icon: AlertCircle },
  };
  const { bg, icon: Icon } = config[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: bg,
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 300,
        minWidth: "280px",
        maxWidth: "480px",
      }}
    >
      <Icon size={18} />
      <span style={{ flex: 1, fontSize: "14px" }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", color: "white", padding: "2px" }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${colors.primaryContainer}`,
        borderTop: `3px solid ${colors.primary}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        color: "#79747E",
        gap: "12px",
      }}
    >
      <div style={{ opacity: 0.4 }}>{icon}</div>
      <p style={{ fontSize: "16px", fontWeight: 500, color: "#49454F" }}>{title}</p>
      {subtitle && <p style={{ fontSize: "13px", color: "#79747E" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────
export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #E7E0EC" }}>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: "12px",
                  color: "#49454F",
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
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid #F4EFF4",
        background: hovered ? "#F6F2FF" : "transparent",
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.1s",
      }}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: "13px 16px",
        fontSize: "14px",
        color: "#1C1B1F",
        ...style,
      }}
    >
      {children}
    </td>
  );
}
