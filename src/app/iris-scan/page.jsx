"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./iris-scan.css";

export default function IrisScanPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("ready"); // ready, scanning, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // ตรวจสอบ authentication
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, [router]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      setErrorMessage("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง");
      setScanStatus("error");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startScan = async () => {
    if (!videoRef.current) return;

    setIsScanning(true);
    setScanStatus("scanning");
    setScanProgress(0);
    setErrorMessage("");

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          completeScan();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const completeScan = async () => {
    // Simulate API call for iris verification
    setTimeout(() => {
      const isVerified = Math.random() > 0.3; // 70% success rate for demo
      
      if (isVerified) {
        setScanStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setScanStatus("error");
        setErrorMessage("การยืนยันม่านตาล้มเหลว กรุณาลองใหม่อีกครั้ง");
      }
      setIsScanning(false);
    }, 1000);
  };

  const resetScan = () => {
    setScanStatus("ready");
    setScanProgress(0);
    setErrorMessage("");
    setIsScanning(false);
  };

  const handleLogout = async () => {
    stopCamera();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="iris-scan-loading">
        <div className="iris-scan-spinner"></div>
      </div>
    );
  }

  return (
    <div className="iris-scan-container">
      {/* Header */}
      <header className="iris-scan-header">
        <div className="iris-scan-header-content">
          <div className="iris-scan-header-inner">
            <div className="iris-scan-logo-section">
              <div className="iris-scan-logo-icon">
                <span>👁️</span>
              </div>
              <div className="iris-scan-logo-text">
                <h1>Eye Auth</h1>
                <p>ระบบยืนยันตัวตนด้วยม่านตา</p>
              </div>
            </div>
            <button onClick={handleLogout} className="iris-scan-logout-btn">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="iris-scan-main">
        <div className="iris-scan-title-section">
          <h2 className="iris-scan-title">การยืนยันตัวตนด้วยม่านตา</h2>
          <p className="iris-scan-subtitle">
            กรุณาวางตาของคุณให้อยู่ในกรอบและกดปุ่มเริ่มสแกน
          </p>
        </div>

        <div className="iris-scan-main-card">
          <div className="iris-scan-content">
            {/* Camera Section */}
            <div className="iris-scan-camera-section">
              <div className="iris-scan-video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="iris-scan-video"
                />
                
                {/* Iris Detection Overlay */}
                <div className="iris-scan-overlay">
                  <div className={`iris-scan-detection-circle ${
                    scanStatus === "scanning" ? "scanning" :
                    scanStatus === "success" ? "success" :
                    scanStatus === "error" ? "error" : ""
                  }`}>
                    {/* Corner guides */}
                    <div className="iris-scan-corner-guide iris-scan-corner-tl"></div>
                    <div className="iris-scan-corner-guide iris-scan-corner-tr"></div>
                    <div className="iris-scan-corner-guide iris-scan-corner-bl"></div>
                    <div className="iris-scan-corner-guide iris-scan-corner-br"></div>
                    
                    {/* Center crosshair */}
                    <div className="iris-scan-crosshair">
                      <div className="iris-scan-crosshair-dot"></div>
                    </div>
                    
                    {/* Scanning animation */}
                    {isScanning && (
                      <div className="iris-scan-animation"></div>
                    )}
                  </div>
                </div>

                {/* Status overlay */}
                {scanStatus === "success" && (
                  <div className="iris-scan-success-overlay">
                    <div className="iris-scan-success-icon">
                      <div>✓</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {isScanning && (
                <div className="iris-scan-progress-section">
                  <div className="iris-scan-progress-header">
                    <span>กำลังสแกนม่านตา...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="iris-scan-progress-bar">
                    <div
                      className="iris-scan-progress-fill"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Panel */}
            <div className="iris-scan-control-panel">
              <div className="iris-scan-panel-section">
                {/* User Info */}
                <div className="iris-scan-user-info">
                  <h3>ข้อมูลผู้ใช้</h3>
                  <p>{user?.email}</p>
                </div>

                {/* Status */}
                <div className="iris-scan-status-section">
                  <h3>สถานะ</h3>
                  <div className={`iris-scan-status-indicator ${scanStatus}`}>
                    <div className={`iris-scan-status-dot ${scanStatus}`}></div>
                    <span className="iris-scan-status-text">
                      {scanStatus === "ready" && "พร้อมสแกน"}
                      {scanStatus === "scanning" && "กำลังสแกน..."}
                      {scanStatus === "success" && "สแกนสำเร็จ"}
                      {scanStatus === "error" && "เกิดข้อผิดพลาด"}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="iris-scan-error-message">
                    <p className="iris-scan-error-text">{errorMessage}</p>
                  </div>
                )}

                {/* Instructions */}
                <div className="iris-scan-instructions">
                  <h3>คำแนะนำ</h3>
                  <div className="iris-scan-instructions-list">
                    <div className="iris-scan-instruction-item">
                      <span className="iris-scan-instruction-bullet">•</span>
                      <span>วางใบหน้าให้อยู่ในกรอบวงกลม</span>
                    </div>
                    <div className="iris-scan-instruction-item">
                      <span className="iris-scan-instruction-bullet">•</span>
                      <span>มองตรงเข้ากล้องและอย่าเคลื่อนไหว</span>
                    </div>
                    <div className="iris-scan-instruction-item">
                      <span className="iris-scan-instruction-bullet">•</span>
                      <span>ควรอยู่ในที่ที่มีแสงเพียงพอ</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="iris-scan-actions">
                  {!stream ? (
                    <button onClick={startCamera} className="iris-scan-btn iris-scan-btn-camera">
                      เปิดกล้อง
                    </button>
                  ) : (
                    <>
                      {scanStatus === "ready" && (
                        <button onClick={startScan} className="iris-scan-btn iris-scan-btn-start">
                          เริ่มสแกนม่านตา
                        </button>
                      )}
                      
                      {scanStatus === "error" && (
                        <button onClick={resetScan} className="iris-scan-btn iris-scan-btn-retry">
                          ลองใหม่อีกครั้ง
                        </button>
                      )}
                      
                      {scanStatus === "success" && (
                        <div className="iris-scan-success-message">
                          <p className="iris-scan-success-title">✓ ยืนยันสำเร็จ</p>
                          <p className="iris-scan-success-subtitle">กำลังเข้าสู่หน้าหลัก...</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="iris-scan-footer">
          <p>© 2025 Eye Auth - ระบบรักษาความปลอดภัยขั้นสูง</p>
          <p>ข้อมูลม่านตาของคุณจะถูกเข้ารหัสและปกป้องอย่างปลอดภัย</p>
        </div>
      </main>
    </div>
  );
}