"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";

/**
 * Share Button Component
 * Provides copy to clipboard and share functionality
 */
const ShareButton = ({ qrRef, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const copyQRAsImage = async () => {
    if (!qrRef?.current) return;

    try {
      const canvas = qrRef.current.querySelector("canvas");
      if (!canvas) {
        toast.error("QR code not found");
        return;
      }

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("QR code copied to clipboard!");
      } else {
        toast.error("Clipboard API not supported");
      }
    } catch (err) {
      toast.error("Failed to copy QR code");
      console.error(err);
    }
    setIsOpen(false);
  };

  const copyDataUrl = async () => {
    if (!qrRef?.current) return;

    try {
      const canvas = qrRef.current.querySelector("canvas");
      if (!canvas) {
        toast.error("QR code not found");
        return;
      }

      const dataUrl = canvas.toDataURL("image/png");
      await navigator.clipboard.writeText(dataUrl);
      toast.success("Data URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy data URL");
      console.error(err);
    }
    setIsOpen(false);
  };

  const webShare = async () => {
    if (!qrRef?.current) return;

    try {
      const canvas = qrRef.current.querySelector("canvas");
      if (!canvas) {
        toast.error("QR code not found");
        return;
      }

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      const file = new File([blob], "qr-code.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR Code",
          text: data ? `QR code for: ${data}` : "Check out this QR code!",
          files: [file],
        });
        toast.success("Shared successfully!");
      } else {
        toast.info("Web Share not supported on this device");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error("Failed to share");
        console.error(err);
      }
    }
    setIsOpen(false);
  };

  const copyLink = async () => {
    if (!data) return;
    
    try {
      await navigator.clipboard.writeText(data);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 hover:bg-gray-600 text-white p-2 px-4 rounded-lg transition-all flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-20 py-2 border border-gray-700">
            <button
              onClick={copyQRAsImage}
              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
            >
              <span>📋</span> Copy as Image
            </button>
            <button
              onClick={copyLink}
              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
            >
              <span>🔗</span> Copy Link/Data
            </button>
            <button
              onClick={copyDataUrl}
              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
            >
              <span>🖼️</span> Copy Data URL
            </button>
            <hr className="my-1 border-gray-700" />
            <button
              onClick={webShare}
              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 flex items-center gap-2"
            >
              <span>📤</span> Share via...
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
