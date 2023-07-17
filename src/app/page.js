"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleClick = () => {
    // Store the QR code data in localStorage before setting it as the QR code value
    toast("QR created! Visit dashboard to download.");
    if (typeof window !== "undefined") {
      const qrData = localStorage.getItem("qrData")
        ? JSON.parse(localStorage.getItem("qrData"))
        : [];
      qrData.push({ data: inputValue, date: new Date() }); // Store date with each QR code
      localStorage.setItem("qrData", JSON.stringify(qrData));
    }
    setQrValue(inputValue);
  };

  return (
    <>
      <Navbar /> {/* Include Navbar */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-8xl mb-20">QR Ninja</h1>
        {qrValue && <QRCode value={qrValue} size={256} />}
        <div className="flex mt-4 mb-48">
          <input
            type="text"
            placeholder="Enter link/data here"
            className="mr-2 p-1 text-black"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="p-1 px-4 bg-white text-black hover:bg-gray-200 transition-all"
            onClick={handleClick}
          >
            Create
          </button>
        </div>
        {qrValue && (
          <button
            onClick={() => {
              var canvas = document.getElementsByTagName("canvas")[0];
              var img = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
              var a = document.createElement("a");
              a.href = img;
              a.download = "QRCode.png";
              a.click();
            }}
            className="mt-4 bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all"
          >
            Download QR Code
          </button>
        )}
      </div>
    </>
  );
}
