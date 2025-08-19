"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "./login.css";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      }
    };
    
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Handle different error types with Thai messages
        switch (error.message) {
          case 'Invalid login credentials':
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            break;
          case 'Email not confirmed':
            setError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
            break;
          case 'Too many requests':
            setError("ลองเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่");
            break;
          default:
            setError(error.message);
        }
        console.error("Login error:", error);
      } else if (data.user) {
        // Successful login - redirect handled by auth state change
        console.log("Login successful:", data.user.email);
      }
    } catch (error) {
      console.error("Exception during login:", error);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-container">
            <span className="login-logo-icon">👁️</span>
          </div>
          <h1 className="login-title">Eye Auth</h1>
          <p className="login-subtitle">เข้าสู่ระบบด้วยความปลอดภัย</p>
        </div>

        {/* Form Card */}
        <div className="login-form-card">
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="login-error-message">
                <div className="login-error-content">
                  <span className="login-error-icon">⚠️</span>
                  <p className="login-error-text">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="login-input-group">
              <label className="login-label">อีเมล</label>
              <div className="login-input-container">
                <div className="login-input-icon">
                  <span>📧</span>
                </div>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="login-input-group">
              <label className="login-label">รหัสผ่าน</label>
              <div className="login-input-container">
                <div className="login-input-icon">
                  <span>🔒</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="login-input login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <span>{showPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="login-options-row">
              <label className="login-checkbox-container">
                <input type="checkbox" className="login-checkbox" disabled={loading} />
                <span className="login-checkbox-label">จดจำฉันไว้</span>
              </label>
              <a href="#" className="login-forgot-password">
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading || !email || !password} className="login-button">
              {loading ? (
                <div className="login-loading-content">
                  <div className="login-spinner"></div>
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>

            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line">
                <div className="login-divider-border"></div>
              </div>
              <div className="login-divider-content">
                <span className="login-divider-text">หรือ</span>
              </div>
            </div>
          </form>

          {/* Register Link */}
          <div className="login-register-section">
  <p className="login-register-text">
  ยังไม่มีบัญชี?{" "}
  <Link href="/register" className="login-register-link">
    สมัครสมาชิกเลย
  </Link>
</p>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="login-footer-text">
            © 2025 Eye Auth. ระบบรักษาความปลอดภัยขั้นสูง
          </p>
        </div>
      </div>
    </div>
  );
}