"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "./register.css"; // ใช้ CSS แยกสำหรับ register page

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // ฟังก์ชันตรวจสอบความแข็งแรงของรหัสผ่าน
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])/.test(password)) return "medium";
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return "strong";
    return "medium";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ตรวจสอบรหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    // ตรวจสอบความยาวรหัสผ่าน
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // ถ้าไม่ต้องยืนยันอีเมลให้ redirect ไป login ได้เลย
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo-container">
            <span className="register-logo-icon">👁️</span>
          </div>
          <h1 className="register-title">Eye Auth</h1>
          <p className="register-subtitle">สร้างบัญชีใหม่เพื่อความปลอดภัย</p>
        </div>

        {/* Form Card */}
        <div className="register-form-card">
          <form onSubmit={handleRegister} className="register-form">
            {error && (
              <div className="register-error-message">
                <div className="register-message-content">
                  <span className="register-error-icon">⚠️</span>
                  <p className="register-error-text">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="register-success-message">
                <div className="register-message-content">
                  <span className="register-success-icon">✅</span>
                  <p className="register-success-text">
                    สมัครสมาชิกสำเร็จ! กำลังนำไปหน้าเข้าสู่ระบบ...
                  </p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="register-input-group">
              <label className="register-label">อีเมล</label>
              <div className="register-input-container">
                <div className="register-input-icon">
                  <span>📧</span>
                </div>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="register-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="register-input-group">
              <label className="register-label">รหัสผ่าน</label>
              <div className="register-input-container">
                <div className="register-input-icon">
                  <span>🔒</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="register-input register-password-input"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span>{showPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="register-password-strength">
                  <div className={`register-strength-text register-strength-${passwordStrength}`}>
                    ความแข็งแรงของรหัสผ่าน: {
                      passwordStrength === "weak" ? "อ่อน" :
                      passwordStrength === "medium" ? "ปานกลาง" : "แข็งแรง"
                    }
                  </div>
                  <div className="register-strength-bar">
                    <div className={`register-strength-fill ${passwordStrength}`}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="register-input-group">
              <label className="register-label">ยืนยันรหัสผ่าน</label>
              <div className="register-input-container">
                <div className="register-input-icon">
                  <span>🔒</span>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="register-input register-password-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span>{showConfirmPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="register-options-row">
              <label className="register-checkbox-container">
                <input type="checkbox" className="register-checkbox" required />
                <span className="register-checkbox-label">
                  ฉันยอมรับ{" "}
                  <a href="#" className="register-terms-link">เงื่อนไขการใช้งาน</a>
                  {" "}และ{" "}
                  <a href="#" className="register-terms-link">นโยบายความเป็นส่วนตัว</a>
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button type="submit" disabled={loading} className="register-button">
              {loading ? (
                <div className="register-loading-content">
                  <div className="register-spinner"></div>
                  กำลังสมัครสมาชิก...
                </div>
              ) : (
                "สมัครสมาชิก"
              )}
            </button>

            {/* Divider */}
            <div className="register-divider">
              <div className="register-divider-line">
                <div className="register-divider-border"></div>
              </div>
              <div className="register-divider-content">
                <span className="register-divider-text">หรือ</span>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="register-login-section">
            <p className="register-login-text">
              มีบัญชีอยู่แล้ว?{" "}
              <a href="/login" className="register-login-link">
                เข้าสู่ระบบเลย
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="register-footer">
          <p className="register-footer-text">
            © 2025 Eye Auth. ระบบรักษาความปลอดภัยขั้นสูง
          </p>
        </div>
      </div>
    </div>
  );
}