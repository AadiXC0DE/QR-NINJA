"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [qrData, setQrData] = useState([]);

  useEffect(() => {
    // Check if we're in a browser
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("qrData")
        ? JSON.parse(localStorage.getItem("qrData"))
        : [];
      setQrData(data);
    }
  }, []);

  return (
    <>
      <Navbar /> {/* Include Navbar */}
      <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl mb-8">Dashboard</h1>
        {qrData.length > 0 ? (
          qrData.map((data, index) => (
            <QRCode key={index} value={data} size={128} />
          ))
        ) : (
          <p>No QR codes found. Create one from the Home page.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
