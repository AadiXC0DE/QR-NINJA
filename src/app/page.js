"use client";
import { useState, useRef, useCallback } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import QRTypeSelector from "@/components/QRTypeSelector";
import QRFormFields from "@/components/QRFormFields";
import StyleTemplates from "@/components/StyleTemplates";
import ShareButton from "@/components/ShareButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import {
  encodeWiFi,
  encodeVCard,
  encodeEmail,
  encodePhone,
  encodeSMS,
  encodeEvent,
} from "@/utils/qrDataEncoders";

export default function Page() {
  const [qrType, setQrType] = useState("url");
  const [formData, setFormData] = useState({});
  const [qrValue, setQrValue] = useState("");
  const [batchQRs, setBatchQRs] = useState([]);
  const [customization, setCustomization] = useState({
    bgColor: "#FFFFFF",
    fgColor: "#000000",
  });
  const qrRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Particles loaded
  }, []);

  const generateQRData = () => {
    switch (qrType) {
      case "url":
        return formData.url || "";
      case "wifi":
        if (!formData.ssid) return null;
        return encodeWiFi(formData);
      case "vcard":
        if (!formData.firstName) return null;
        return encodeVCard(formData);
      case "email":
        if (!formData.email) return null;
        return encodeEmail(formData);
      case "phone":
        if (!formData.phone) return null;
        return encodePhone(formData.phone);
      case "sms":
        if (!formData.phone) return null;
        return encodeSMS(formData);
      case "event":
        if (!formData.title || !formData.startDate) return null;
        return encodeEvent(formData);
      case "batch":
        return "batch";
      default:
        return formData.url || "";
    }
  };

  const handleCreate = () => {
    if (qrType === "batch") {
      const lines = (formData.batchData || "")
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 50);

      if (lines.length === 0) {
        toast.error("Please enter at least one URL or text");
        return;
      }

      setBatchQRs(lines);
      setQrValue("");

      // Save all to localStorage
      if (typeof window !== "undefined") {
        const qrData = localStorage.getItem("qrData")
          ? JSON.parse(localStorage.getItem("qrData"))
          : [];
        
        lines.forEach((line) => {
          qrData.push({
            data: line,
            date: new Date(),
            type: "url",
            bgColor: customization.bgColor,
            fgColor: customization.fgColor,
          });
        });
        
        localStorage.setItem("qrData", JSON.stringify(qrData));
      }

      toast.success(`${lines.length} QR codes created! Visit dashboard to manage.`);
      return;
    }

    const data = generateQRData();
    if (!data) {
      toast.error("Please fill in the required fields");
      return;
    }

    setQrValue(data);
    setBatchQRs([]);

    // Save to localStorage
    if (typeof window !== "undefined") {
      const qrData = localStorage.getItem("qrData")
        ? JSON.parse(localStorage.getItem("qrData"))
        : [];
      qrData.push({
        data,
        date: new Date(),
        type: qrType,
        bgColor: customization.bgColor,
        fgColor: customization.fgColor,
        ...formData,
      });
      localStorage.setItem("qrData", JSON.stringify(qrData));
    }

    toast.success("QR code created! Visit dashboard to manage.");
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `QRCode-${qrType}.png`;
        link.click();
      }
    }
  };

  const downloadAllBatch = async () => {
    // Simple individual download for batch
    const canvases = document.querySelectorAll(".batch-qr-canvas canvas");
    canvases.forEach((canvas, index) => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `QRCode-batch-${index + 1}.png`;
      link.click();
    });
    toast.success(`Downloaded ${canvases.length} QR codes!`);
  };

  const handleTemplateSelect = (template) => {
    setCustomization({
      bgColor: template.bgColor,
      fgColor: template.fgColor,
    });
  };

  const handleTypeChange = (type) => {
    setQrType(type);
    setFormData({});
    setQrValue("");
    setBatchQRs([]);
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
      <div className="bg-black text-white flex flex-col items-center justify-start min-h-screen pt-8 pb-16 px-4">
        <h1 className="text-5xl md:text-7xl mb-6 text-center font-bold">
          QR Ninja
        </h1>
        <p className="text-gray-400 mb-8 text-center max-w-xl">
          Free, privacy-first QR code generator. All processing happens in your browser.
        </p>

        {/* QR Type Selector */}
        <QRTypeSelector selectedType={qrType} onTypeChange={handleTypeChange} />

        {/* Dynamic Form Fields */}
        <div className="w-full flex justify-center mb-6">
          <QRFormFields
            type={qrType}
            formData={formData}
            onChange={setFormData}
          />
        </div>

        {/* Style Templates */}
        <div className="mb-6">
          <StyleTemplates
            onSelectTemplate={handleTemplateSelect}
            currentBgColor={customization.bgColor}
            currentFgColor={customization.fgColor}
          />
        </div>

        {/* Create Button */}
        <button
          className="py-3 px-8 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all text-lg mb-8 hover:scale-105"
          onClick={handleCreate}
        >
          {qrType === "batch" ? "Generate All QR Codes" : "Generate QR Code"}
        </button>

        {/* Single QR Display */}
        {qrValue && qrType !== "batch" && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <div 
              ref={qrRef} 
              className="bg-white p-4 rounded-xl shadow-2xl"
              style={{ backgroundColor: customization.bgColor }}
            >
              <QRCode
                value={qrValue}
                size={256}
                bgColor={customization.bgColor}
                fgColor={customization.fgColor}
              />
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={downloadQRCode}
                className="bg-white text-black py-2 px-6 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </button>
              <ShareButton qrRef={qrRef} data={qrValue} />
            </div>
          </div>
        )}

        {/* Batch QR Display */}
        {batchQRs.length > 0 && (
          <div className="w-full max-w-4xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Generated {batchQRs.length} QR Codes
              </h2>
              <button
                onClick={downloadAllBatch}
                className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {batchQRs.map((data, index) => (
                <div
                  key={index}
                  className="batch-qr-canvas bg-gray-800 p-3 rounded-lg flex flex-col items-center"
                >
                  <div 
                    className="bg-white p-2 rounded mb-2"
                    style={{ backgroundColor: customization.bgColor }}
                  >
                    <QRCode
                      value={data}
                      size={100}
                      bgColor={customization.bgColor}
                      fgColor={customization.fgColor}
                    />
                  </div>
                  <p className="text-xs text-gray-400 truncate w-full text-center" title={data}>
                    {data.length > 20 ? data.substring(0, 20) + "..." : data}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
