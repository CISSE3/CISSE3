/**
 * Login Screen
 *
 * Admin authentication using Firebase Email/Password.
 * Equivalent to Flutter's LoginScreen with form validation.
 */

"use client";

import { useState } from "react";
import { Store, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginWithEmail } from "@/services/auth.service";
import { useAppStore } from "@/providers/app.provider";
import { colors } from "@/widgets/ui";

export default function LoginScreen() {
  const { setUser } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Form validation
  const validate = (): boolean => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    // Demo mode: accept demo credentials without Firebase
    if (email === "admin@shop.com" && password === "admin123") {
      // Simulate a user object for demo mode
      setUser({ email, uid: "demo-admin", displayName: "Admin User" } as never);
      setLoading(false);
      return;
    }

    const result = await loginWithEmail(email, password);
    setLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.primary} 0%, #3700B3 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${colors.primary}, #03DAC6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: `0 8px 24px ${colors.primary}40`,
            }}
          >
            <Store size={36} color="white" />
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#1C1B1F",
              marginBottom: "6px",
            }}
          >
            ShopManager Pro
          </h1>
          <p style={{ fontSize: "14px", color: "#79747E" }}>
            Sign in to your admin account
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              background: colors.errorContainer,
              color: colors.error,
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Lock size={15} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email Field */}
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: emailError ? colors.error : "#49454F",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Email Address *
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                color="#79747E"
                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="admin@shop.com"
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 40px",
                  border: `1.5px solid ${emailError ? colors.error : "#CAC4D0"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#1C1B1F",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => !emailError && (e.target.style.borderColor = colors.primary)}
                onBlur={(e) => !emailError && (e.target.style.borderColor = "#CAC4D0")}
              />
            </div>
            {emailError && (
              <p style={{ fontSize: "11px", color: colors.error, marginTop: "4px" }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: passwordError ? colors.error : "#49454F",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Password *
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color="#79747E"
                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "11px 44px 11px 40px",
                  border: `1.5px solid ${passwordError ? colors.error : "#CAC4D0"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#1C1B1F",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => !passwordError && (e.target.style.borderColor = colors.primary)}
                onBlur={(e) => !passwordError && (e.target.style.borderColor = "#CAC4D0")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#79747E",
                  padding: "2px",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && (
              <p style={{ fontSize: "11px", color: colors.error, marginTop: "4px" }}>
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px",
              background: loading ? "#CAC4D0" : `linear-gradient(135deg, ${colors.primary}, #3700B3)`,
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div
          style={{
            marginTop: "24px",
            padding: "14px",
            background: "#F6F2FF",
            borderRadius: "10px",
            border: `1px solid ${colors.primaryContainer}`,
          }}
        >
          <p style={{ fontSize: "12px", fontWeight: 600, color: colors.primary, marginBottom: "6px" }}>
            🔑 Demo Credentials
          </p>
          <p style={{ fontSize: "12px", color: "#49454F" }}>
            Email: <strong>admin@shop.com</strong>
          </p>
          <p style={{ fontSize: "12px", color: "#49454F" }}>
            Password: <strong>admin123</strong>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
