"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import { debounce } from "lodash";

const Dashboard = () => {
  const [qrData, setQrData] = useState([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [editingQR, setEditingQR] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isCentered, setIsCentered] = useState(true);
  const [dimensions, setDimensions] = useState(512);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("qrData")
        ? JSON.parse(localStorage.getItem("qrData"))
        : [];
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setQrData(sortedData);
    }
  }, []);

  const handleDownload = (format, data) => {
    const canvas = document.getElementById(`canvas-${data}`);
    if (canvas) {
      if (format === 'svg') {
        // For SVG, we need to create a new SVG from the canvas
        const svgData = canvas.outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        saveAs(blob, `QRCode.svg`);
      } else {
        // For other formats
        canvas.toBlob((blob) => {
          saveAs(blob, `QRCode.${format}`);
          toast(`QR downloaded as ${format.toUpperCase()}!`);
        }, `image/${format}`);
      }
    }
  };

  const handleDelete = (index) => {
    const updatedData = [...qrData];
    updatedData.splice(index, 1);
    setQrData(updatedData);
    localStorage.setItem("qrData", JSON.stringify(updatedData));
    toast("QR code deleted!");
  };

  const handleEditQR = (item, index) => {
    setEditingQR({
      ...item,
      index,
      bgColor: item.bgColor || "#FFFFFF",
      fgColor: item.fgColor || "#000000"
    });
    setLogo(item.logo || null);
    setIsCentered(item.isCentered !== undefined ? item.isCentered : true);
    setDimensions(item.dimensions || 512);
    setShowEditOptions(true);
  };

  const handleColorChange = (type, color) => {
    setEditingQR(prev => ({
      ...prev,
      [type]: color
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setIsCentered(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCenterLogo = () => {
    setIsCentered(prev => !prev);
  };

  // memoized debounced function
  const debouncedSetDimensions = useMemo(
    () => debounce((value) => {
      const newValue = parseInt(value);
      if (!isNaN(newValue) && newValue >= 128 && newValue <= 2048) {
        setDimensions(newValue);
      }
    }, 300),
    []
  );

  // Validation handler
  const handleDimensionChange = (value) => {
    if (value === '') {
      setDimensions('');
      return;
    }

    setDimensions(value);

    debouncedSetDimensions(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetDimensions.cancel();
    };
  }, [debouncedSetDimensions]);

  const handleDimensionBlur = () => {
    const currentValue = parseInt(dimensions);
    if (isNaN(currentValue) || currentValue < 128) {
      setDimensions(128);
    } else if (currentValue > 2048) {
      setDimensions(2048);
    }
  };

  const saveQREdit = () => {
    const updatedQRData = [...qrData];
    updatedQRData[editingQR.index] = {
      ...editingQR,
      bgColor: editingQR.bgColor,
      fgColor: editingQR.fgColor,
      logo: logo,
      isCentered: isCentered,
      dimensions: dimensions,
      date: new Date()
    };

    setQrData(updatedQRData);
    localStorage.setItem("qrData", JSON.stringify(updatedQRData));
    setShowEditOptions(false);
    setEditingQR(null);
    setLogo(null);
    toast("QR code updated successfully!");
  };

  const renderQRCode = useMemo(() => {
    return function renderQRCode(item) {
      const size = item.dimensions || 512;
      const logoSize = Math.floor(size * 0.1875);

      return (
        <QRCode
          id={`canvas-${item.data}`}
          value={item.data}
          size={size}
          bgColor={item.bgColor || "#FFFFFF"}
          fgColor={item.fgColor || "#000000"}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          imageSettings={
            item.logo
              ? {
                  src: item.logo,
                  height: logoSize,
                  width: logoSize,
                  excavate: true,
                  x: item.isCentered ? undefined : 0,
                  y: item.isCentered ? undefined : 0,
                }
              : undefined
          }
        />
      );
    };
  }, []);

  return (
    <>
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
      <div className="bg-black text-white p-6">
        <h1 className="text-4xl mb-4">Your Dashboard</h1>
        <h2 className="text-xl mb-8">Previously Created QRs</h2>
        {qrData.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full divide-y divide-gray-600 bg-gray-800 text-gray-100">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Creation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {qrData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="h-28 w-28 flex items-center justify-center">
                        {renderQRCode(item)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group">
                        <div className="hover:text-gray-300 cursor-default">
                          {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                          })}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute hidden group-hover:block bg-gray-900 text-white p-2 rounded shadow-lg -top-12 left-0 z-50">
                          {new Date(item.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="relative group">
                        <div 
                          className="truncate hover:text-gray-300 cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(item.data);
                            toast("Link copied to clipboard!");
                          }}
                        >
                          {item.data}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute hidden group-hover:block bg-gray-900 text-white p-2 rounded shadow-lg -top-12 left-0 max-w-md z-50 break-all">
                          {item.data}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 justify-between">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setSelectedData(item.data);
                            setShowDownloadOptions(true);
                          }}
                          className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all rounded-md"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditQR(item, index)}
                          className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all rounded-md"
                        >
                          Edit
                        </button>
                      </div>
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

      {/* Download Options Modal */}
      {showDownloadOptions && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Download QR Code
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => handleDownload("png", selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload("jpg", selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => handleDownload("webp", selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    WEBP
                  </button>
                  <button
                    onClick={() => handleDownload("svg", selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    SVG
                  </button>
                  <button
                    onClick={() => handleDownload("tiff", selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    TIFF
                  </button>
                  <button
                    onClick={() => handleDownload("bmp", selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    BMP
                  </button>
                </div>
                <button
                  onClick={() => setShowDownloadOptions(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Options Modal */}
      {showEditOptions && editingQR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row">
              {/* Left Side - Color Controls */}
              <div className="w-full md:w-1/2 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Customize QR Code
                </h3>
                
                {/* Background Color */}
                <div className="mb-4">
                  <label className="block text-white mb-2">Background Color</label>
                  <div className="flex items-center">
                    <input 
                      type="color" 
                      value={editingQR.bgColor}
                      onChange={(e) => handleColorChange('bgColor', e.target.value)}
                      className="mr-2"
                    />
                    <input 
                      type="text" 
                      value={editingQR.bgColor}
                      onChange={(e) => handleColorChange('bgColor', e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                </div>

                {/* Foreground Color */}
                <div className="mb-4">
                  <label className="block text-white mb-2">Foreground Color</label>
                  <div className="flex items-center">
                    <input 
                      type="color" 
                      value={editingQR.fgColor}
                      onChange={(e) => handleColorChange('fgColor', e.target.value)}
                      className="mr-2"
                    />
                    <input 
                      type="text" 
                      value={editingQR.fgColor}
                      onChange={(e) => handleColorChange('fgColor', e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="mb-4">
                  <label className="block text-white mb-2">Upload Logo</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoChange}
                    className="bg-gray-700 text-white p-2 rounded w-full"
                  />
                  {logo && (
                    <button 
                      onClick={() => setLogo(null)}
                      className="mt-2 text-red-400 hover:text-red-300"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                {/* Center Logo Option */}
                {logo && (
                  <div className="mb-4">
                    <label className="flex items-center text-white">
                      <input 
                        type="checkbox" 
                        checked={isCentered}
                        onChange={toggleCenterLogo}
                        className="mr-2"
                      />
                      Center Logo
                    </label>
                  </div>
                )}

                {/* Dimension Controls */}
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <label className="block text-white mb-2">QR Code Dimensions</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={dimensions}
                      onChange={(e) => handleDimensionChange(e.target.value)}
                      onBlur={handleDimensionBlur}
                      className="bg-gray-700 text-white p-2 rounded w-24"
                      min="128"
                      max="2048"
                      step="32"
                    />
                    <span className="text-white">x</span>
                    <input
                      type="number"
                      value={dimensions}
                      onChange={(e) => handleDimensionChange(e.target.value)}
                      onBlur={handleDimensionBlur}
                      className="bg-gray-700 text-white p-2 rounded w-24"
                      min="128"
                      max="2048"
                      step="32"
                    />
                    <span className="text-white">px</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Recommended: 128px - 2048px
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    onClick={saveQREdit}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full sm:w-auto"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setShowEditOptions(false);
                      setEditingQR(null);
                      setLogo(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Right Side - QR Code Preview */}
              <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-700 rounded-b-lg md:rounded-r-lg">
                <div className="bg-white p-4 rounded-lg shadow-md max-w-full max-h-[400px] flex items-center justify-center">
                  <QRCode
                    value={editingQR.data}
                    size={Math.min(dimensions, 256)} // Limit preview size
                    bgColor={editingQR.bgColor}
                    fgColor={editingQR.fgColor}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    imageSettings={
                      logo
                        ? {
                            src: logo,
                            height: Math.floor(Math.min(dimensions, 256) * 0.1875),
                            width: Math.floor(Math.min(dimensions, 256) * 0.1875),
                            excavate: true,
                            x: isCentered ? undefined : 0,
                            y: isCentered ? undefined : 0,
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Dashboard.displayName = "Dashboard";

Dashboard.displayName = "Dashboard";

export default Dashboard;
