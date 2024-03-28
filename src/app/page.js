"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  const handleClick = () => {
    toast("QR created! Visit dashboard to download.");
    if (typeof window !== "undefined") {
      const qrData = localStorage.getItem("qrData")
        ? JSON.parse(localStorage.getItem("qrData"))
        : [];
      qrData.push({ data: inputValue, date: new Date() });
      localStorage.setItem("qrData", JSON.stringify(qrData));
    }
    setQrValue(inputValue);
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 60 },
            opacity: { value: 0.8 },
            shape: { type: "circle" },
            size: { random: true, value: 5 },
          },
          detectRetina: true,
        }}
      />
      <Navbar />
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
        theme="dark"
      />
      <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-6xl md:text-8xl mb-10 md:mb-20 text-center">
          QR Ninja
        </h1>
        {qrValue && <QRCode value={qrValue} size={256} />}
        <div className="flex flex-col md:flex-row items-center mt-4 mb-4 md:mb-12">
          <input
            type="text"
            placeholder="Enter link/data here"
            className="mr-0 md:mr-2 mb-2 md:mb-0 p-1 text-black w-full md:w-auto"
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
            className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all"
          >
            Download QR Code
          </button>
        )}
      </div>
    </>
  );
}
