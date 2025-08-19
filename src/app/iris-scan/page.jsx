"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./iris-scan.css";

export default function IrisScanPage() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const startCamera = async () => {
    try {
      setStatus({ type: 'info', message: 'กำลังเปิดกล้อง...' });
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.classList.add('camera-starting');
      }
      setIsCameraOn(true);
      setStatus({ type: 'success', message: 'กล้องพร้อมใช้งาน' });
    } catch (err) {
      console.error("ไม่สามารถเข้าถึงกล้องได้:", err);
      setStatus({ type: 'error', message: 'ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.classList.add('camera-stopping');
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setStatus(null);
  };

  const goBack = () => {
    stopCamera();
    router.push("/dashboard");
  };

  return (
    <div className="iris-scan-container">
      <div className="iris-scan-main">
        <div className="iris-scan-logo-container">
          <span className="iris-scan-logo">👁️</span>
        </div>

        <h1 className="iris-scan-title">สแกนม่านตา</h1>
        <p className="iris-scan-subtitle">กรุณาจัดให้ดวงตาอยู่ในตำแหน่งที่เหมาะสม</p>

        {status && (
          <div className={`iris-scan-status iris-scan-status-${status.type}`}>
            <p className="iris-scan-message">{status.message}</p>
          </div>
        )}

        <div className="iris-scan-video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`iris-scan-video ${isCameraOn ? 'scanning' : ''}`}
          />
          <div className="iris-scan-overlay"></div>
          <div className="iris-scan-lines">
            <div className="iris-scan-line"></div>
          </div>
        </div>

        <div className="iris-scan-controls">
          {!isCameraOn ? (
            <button
              onClick={startCamera}
              className="iris-scan-btn iris-scan-btn-start"
            >
              <span>📷</span> เปิดกล้อง
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="iris-scan-btn iris-scan-btn-stop"
            >
              <span>⏹️</span> ปิดกล้อง
            </button>
          )}

          <button
            onClick={goBack}
            className="iris-scan-btn iris-scan-btn-back"
          >
            <span>↩️</span> กลับไป Dashboard
          </button>
        </div>

        <p className="iris-scan-instructions">
          วางดวงตาของคุณให้อยู่ในตำแหน่งกลางของกรอบ และรอสักครู่เพื่อให้ระบบทำการสแกน
        </p>
      </div>

      <div className="iris-scan-footer">
        <p className="iris-scan-footer-text">
          Powered by Advanced Iris Recognition Technology
        </p>
      </div>
    </div>
  );
}
