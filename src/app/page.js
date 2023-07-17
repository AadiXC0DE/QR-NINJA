"use client";
import { useState } from "react";
import QRCode from "qrcode.react";
import { useRef } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [qrValue, setQrValue] = useState(null);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const generateQR = () => {
    setQrValue(input);
    setInput("");
  };
  const qrRef = useRef();

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-10">QR Ninja</h1>

      {qrValue && (
        <div className="mb-10" ref={qrRef}>
          <QRCode value={qrValue} size={256} />
        </div>
      )}

      <div className="flex items-center mb-10">
        <input
          type="text"
          className="rounded-lg p-2 mr-2 text-black"
          placeholder="Enter link here..."
          value={input}
          onChange={handleChange}
        />
        <button
          className="bg-white text-black px-8 py-2 rounded-lg transform transition-all duration-200 hover:scale-110"
          onClick={generateQR}
        >
          Create
        </button>
      </div>

      {qrValue && (
        <div>
          <button
            className="bg-white text-black px-8 py-2 rounded-lg mr-2"
            onClick={downloadQR}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
