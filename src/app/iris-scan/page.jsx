"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function IrisScanPage() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const router = useRouter();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("ไม่สามารถเข้าถึงกล้องได้:", err);
      alert("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const goBack = () => {
    stopCamera();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">สแกนม่านตา</h1>

      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="rounded-lg border w-[400px] h-[300px] bg-gray-900"
      />

      <div className="mt-4 flex gap-3">
        {!isCameraOn ? (
          <button 
            onClick={startCamera} 
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            เปิดกล้อง
          </button>
        ) : (
          <button 
            onClick={stopCamera} 
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            ปิดกล้อง
          </button>
        )}

        <button 
          onClick={goBack} 
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          กลับไป Dashboard
        </button>
      </div>
    </div>
  );
}
