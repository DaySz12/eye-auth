"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./dashboard.css"; // Import the new CSS file

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 42,
    successRate: 98,
    lastScan: "2 ชั่วโมงที่แล้ว"
  });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleIrisScan = () => {
    // Navigate to iris scan page (to be created)
    router.push("/iris-scan");
  };

  const handleSecuritySettings = () => {
    // Navigate to security settings
    router.push("/settings/security");
  };

  const handleProfile = () => {
    // Navigate to profile settings
    router.push("/profile");
  };

  const getUserInitial = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="dashboard-welcome-card">
            <div className="dashboard-user-avatar">
              <div className="dashboard-spinner"></div>
            </div>
            <p>กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-logo-container">
            <span className="dashboard-logo-icon">👁️</span>
          </div>
          <h1 className="dashboard-title">Eye Auth Dashboard</h1>
          <p className="dashboard-subtitle">ระบบรักษาความปลอดภัยขั้นสูง</p>
        </div>

        {/* Welcome Card */}
        <div className="dashboard-welcome-card">
          <div className="dashboard-user-avatar">
            <span>{getUserInitial()}</span>
          </div>
          <h2 className="dashboard-welcome-title">
            ยินดีต้อนรับ!
          </h2>
          <p className="dashboard-user-email">{user?.email}</p>
          <div className="dashboard-user-status">
            <div className="dashboard-status-dot"></div>
            ออนไลน์ - ระบบพร้อมใช้งาน
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">{stats.totalScans}</div>
            <div className="dashboard-stat-label">การสแกนทั้งหมด</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">{stats.successRate}%</div>
            <div className="dashboard-stat-label">ความแม่นยำ</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">24/7</div>
            <div className="dashboard-stat-label">ระบบรักษาความปลอดภัย</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-quick-actions">
          <h3 className="dashboard-quick-actions-title">การดำเนินการด่วน</h3>
          <div className="dashboard-quick-buttons">
            <button className="dashboard-quick-button" onClick={handleIrisScan}>
              <span>👁️</span>
              สแกนม่านตาด่วน
            </button>
            <button className="dashboard-quick-button" onClick={handleProfile}>
              <span>👤</span>
              ข้อมูลส่วนตัว
            </button>
            <button className="dashboard-quick-button">
              <span>📊</span>
              ดูประวัติ
            </button>
            <button className="dashboard-quick-button">
              <span>🔒</span>
              ตั้งค่าความปลอดภัย
            </button>
          </div>
        </div>

        {/* Action Cards */}
        <div className="dashboard-actions-grid">
          <div className="dashboard-action-card" onClick={handleIrisScan}>
            <div className="dashboard-card-icon iris">
              <span>👁️</span>
            </div>
            <h3 className="dashboard-card-title">สแกนม่านตา</h3>
            <p className="dashboard-card-description">
              เริ่มการสแกนม่านตาเพื่อยืนยันตัวตนด้วยเทคโนโลยี AI ขั้นสูง
            </p>
          </div>

          <div className="dashboard-action-card" onClick={handleSecuritySettings}>
            <div className="dashboard-card-icon security">
              <span>🔐</span>
            </div>
            <h3 className="dashboard-card-title">ตั้งค่าความปลอดภัย</h3>
            <p className="dashboard-card-description">
              จัดการการตั้งค่าความปลอดภัยและการเข้าถึงระบบ
            </p>
          </div>

          <div className="dashboard-action-card" onClick={handleProfile}>
            <div className="dashboard-card-icon settings">
              <span>⚙️</span>
            </div>
            <h3 className="dashboard-card-title">จัดการโปรไฟล์</h3>
            <p className="dashboard-card-description">
              แก้ไขข้อมูลส่วนตัวและการตั้งค่าบัญชีผู้ใช้
            </p>
          </div>
        </div>

        {/* Logout Section */}
        <div className="dashboard-logout-section">
          <button onClick={handleLogout} className="dashboard-logout-button">
            <span>🚪</span>
            ออกจากระบบ
          </button>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <p className="dashboard-footer-text">
            © 2025 Eye Auth. ระบบรักษาความปลอดภัยขั้นสูง - การสแกนล่าสุด: {stats.lastScan}
          </p>
        </div>
      </div>
    </div>
  );
}