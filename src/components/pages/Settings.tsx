"use client";

import { useState } from "react";
import { Store, Bell, Shield, Palette, Globe, Save } from "lucide-react";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        background: checked ? "#6200EE" : "#E0E0E0",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="material-card elevation-1">
      <div
        className="flex items-center gap-3 mb-5"
        style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "14px" }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#F8F5FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color="#6200EE" />
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#212121" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [shopName, setShopName] = useState("ShopManager Pro");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    dailyReport: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    color: "#212121",
  };

  const selectStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#212121",
    background: "white",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#9E9E9E",
    fontWeight: 500,
    display: "block",
    marginBottom: "6px",
  } as React.CSSProperties;

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "800px",
      }}
    >
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#212121" }}>Settings</h2>
        <p style={{ fontSize: "13px", color: "#9E9E9E", marginTop: "2px" }}>
          Manage your shop preferences
        </p>
      </div>

      {/* Shop Info */}
      <Section icon={Store} title="Shop Information">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Shop Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
              onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
            />
          </div>
          <div>
            <label style={labelStyle}>Business Email</label>
            <input
              type="email"
              defaultValue="admin@shopmanager.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
              onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
            />
          </div>
          <div>
            <label style={labelStyle}>Business Address</label>
            <textarea
              defaultValue="123 Commerce Street, Business District, NY 10001"
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
              onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
            />
          </div>
        </div>
      </Section>

      {/* Regional */}
      <Section icon={Globe} title="Regional Settings">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={selectStyle}
            >
              {["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              style={selectStyle}
            >
              {["UTC", "EST", "PST", "CST", "MST", "GMT"].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date Format</label>
            <select style={selectStyle}>
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Language</label>
            <select style={selectStyle}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { key: "newOrder", label: "New Order Alerts", desc: "Get notified when a new order is placed" },
            { key: "lowStock", label: "Low Stock Warnings", desc: "Alert when product stock falls below threshold" },
            { key: "newCustomer", label: "New Customer Registration", desc: "Notify when a new customer signs up" },
            { key: "dailyReport", label: "Daily Summary Report", desc: "Receive daily business performance report" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#212121" }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "#9E9E9E", marginTop: "2px" }}>{item.desc}</p>
              </div>
              <ToggleSwitch
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
              onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                placeholder="New password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6200EE")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance">
        <div>
          <p style={{ fontSize: "13px", color: "#616161", marginBottom: "12px" }}>Theme Color</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { color: "#6200EE", label: "Purple" },
              { color: "#1976D2", label: "Blue" },
              { color: "#388E3C", label: "Green" },
              { color: "#F57C00", label: "Orange" },
              { color: "#C62828", label: "Red" },
              { color: "#00838F", label: "Teal" },
            ].map((theme) => (
              <button
                key={theme.color}
                title={theme.label}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: theme.color,
                  border: theme.color === "#6200EE" ? "3px solid #212121" : "3px solid transparent",
                  cursor: "pointer",
                  outline: "none",
                }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 ripple"
        style={{
          padding: "14px 28px",
          background: saved ? "#4CAF50" : "#6200EE",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: 600,
          alignSelf: "flex-start",
          transition: "background 0.3s",
        }}
      >
        <Save size={18} />
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
