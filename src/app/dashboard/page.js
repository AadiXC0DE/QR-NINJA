"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";

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

  const handleDownload = (data) => {
    const canvas = document.getElementById(`canvas-${data}`);
    const img = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const a = document.createElement("a");
    a.href = img;
    a.download = "QRCode.png";
    a.click();
  };

  return (
    <>
      <Navbar /> {/* Include Navbar */}
      <div className="bg-black text-white p-6">
        <h1 className="text-4xl mb-4">Your Dashboard</h1>
        <h2 className="text-xl mb-8">Previously Created QR's</h2>
        {qrData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Creation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-200">
                {qrData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <QRCode
                        id={`canvas-${item.data}`}
                        value={item.data}
                        size={64}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownload(item.data)}
                        className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No QR codes found. Create one from the Home page.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
