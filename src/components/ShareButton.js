"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";

/**
 * Premium Share Button Component
 */
const ShareButton = ({ qrRef, data, variant = "default" }) => {
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
      toast.success("Data URL copied!");
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
        toast.info("Web Share not supported");
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
      toast.success("Link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
    setIsOpen(false);
  };

  const buttonClasses = variant === "compact" 
    ? "p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-all duration-200"
    : "flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-all duration-200 font-medium";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {variant !== "compact" && <span>Share</span>}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-52 bg-zinc-900 rounded-xl shadow-2xl z-20 py-2 border border-zinc-800 overflow-hidden">
            <button
              onClick={copyQRAsImage}
              className="w-full px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy as Image
            </button>
            <button
              onClick={copyLink}
              className="w-full px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Copy Link
            </button>
            <button
              onClick={copyDataUrl}
              className="w-full px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Copy Data URL
            </button>
            <div className="my-1 border-t border-zinc-800" />
            <button
              onClick={webShare}
              className="w-full px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Share via...
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
