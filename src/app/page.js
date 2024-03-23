"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");

  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

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
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,

          particles: {
            color: {
              value: "#ffffff",
            },
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
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.8,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />
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
        <div className="flex mt-4 mb-64">
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
