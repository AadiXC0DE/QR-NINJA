"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import { debounce } from "lodash";

const QRCodeRenderer = memo(({ item }) => {
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
});

const QRListItem = memo(({ item, index, onEdit, onDelete, onDownload }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.data);
    toast("Link copied to clipboard!");
  };

  return (
    <tr className="hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4">
        <div className="h-28 w-28 flex items-center justify-center">
          <QRCodeRenderer item={item} />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative group">
          <div className="hover:text-gray-300 cursor-default">
            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
          </div>
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
            onClick={handleCopy}
          >
            {item.data}
          </div>
          <div className="absolute hidden group-hover:block bg-gray-900 text-white p-2 rounded shadow-lg -top-12 left-0 max-w-md z-50 break-all">
            {item.data}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => onDownload(item.data)}
            className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all rounded-md"
          >
            Download
          </button>
          <button
            onClick={() => onDelete(index)}
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
            onClick={() => onEdit(item, index)}
            className="bg-white p-1 px-4 text-black hover:bg-gray-200 transition-all rounded-md"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
});

const QRList = memo(({ data, onEdit, onDelete, onDownload }) => {
  return (
    <tbody className="divide-y divide-gray-600">
      {data.map((item, index) => (
        <QRListItem
          key={item.data}
          item={item}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </tbody>
  );
});

const Dashboard = () => {
  const [qrData, setQrData] = useState([]);
  const [modalState, dispatchModal] = useReducer(modalReducer, initialModalState);
  const [customization, setCustomization] = useState(initialQRCustomization);

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
    setCustomization({
      logo: item.logo || null,
      isCentered: item.isCentered ?? true,
      dimensions: item.dimensions || 512,
      bgColor: item.bgColor || "#FFFFFF",
      fgColor: item.fgColor || "#000000"
    });
    dispatchModal({ type: 'OPEN_EDIT', payload: { ...item, index } });
  };

  const handleCustomizationChange = useCallback((key, value) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // memoized debounced function
  const debouncedSetDimensions = useMemo(
    () => debounce((value) => {
      const newValue = parseInt(value);
      if (!isNaN(newValue) && newValue >= 128 && newValue <= 2048) {
        handleCustomizationChange('dimensions', newValue);
      }
    }, 300),
    [handleCustomizationChange]
  );

  const handleDimensionChange = (value) => {
    if (value === '') {
      handleCustomizationChange('dimensions', '');
      return;
    }
    handleCustomizationChange('dimensions', value);
    debouncedSetDimensions(value);
  };

  const handleDimensionBlur = () => {
    const currentValue = parseInt(customization.dimensions);
    if (isNaN(currentValue) || currentValue < 128) {
      handleCustomizationChange('dimensions', 128);
    } else if (currentValue > 2048) {
      handleCustomizationChange('dimensions', 2048);
    }
  };

  const saveQREdit = () => {
    const { data: editingQR } = modalState.edit;
    const updatedQRData = [...qrData];
    updatedQRData[editingQR.index] = {
      ...editingQR,
      ...customization,
      date: new Date()
    };

    setQrData(updatedQRData);
    localStorage.setItem("qrData", JSON.stringify(updatedQRData));
    dispatchModal({ type: 'CLOSE_EDIT' });
    setCustomization(initialQRCustomization);
    toast("QR code updated successfully!");
  };

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
              <QRList 
                data={qrData}
                onEdit={handleEditQR}
                onDelete={handleDelete}
                onDownload={(data) => dispatchModal({ type: 'OPEN_DOWNLOAD', payload: data })}
              />
            </table>
          </div>
        ) : (
          <p>No QR codes found. Create one from the Home page.</p>
        )}
      </div>

      {/* Download Options Modal */}
      {modalState.download.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Download QR Code
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => handleDownload("png", modalState.download.selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload("jpg", modalState.download.selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => handleDownload("webp", modalState.download.selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    WEBP
                  </button>
                  <button
                    onClick={() => handleDownload("svg", modalState.download.selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    SVG
                  </button>
                  <button
                    onClick={() => handleDownload("tiff", modalState.download.selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    TIFF
                  </button>
                  <button
                    onClick={() => handleDownload("bmp", modalState.download.selectedData)}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    BMP
                  </button>
                </div>
                <button
                  onClick={() => dispatchModal({ type: 'CLOSE_DOWNLOAD' })}
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
      {modalState.edit.isOpen && modalState.edit.data && (
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
                      value={customization.bgColor}
                      onChange={(e) => handleCustomizationChange('bgColor', e.target.value)}
                      className="mr-2"
                    />
                    <input 
                      type="text" 
                      value={customization.bgColor}
                      onChange={(e) => handleCustomizationChange('bgColor', e.target.value)}
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
                      value={customization.fgColor}
                      onChange={(e) => handleCustomizationChange('fgColor', e.target.value)}
                      className="mr-2"
                    />
                    <input 
                      type="text" 
                      value={customization.fgColor}
                      onChange={(e) => handleCustomizationChange('fgColor', e.target.value)}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleCustomizationChange('logo', reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="bg-gray-700 text-white p-2 rounded w-full"
                  />
                  {customization.logo && (
                    <button 
                      onClick={() => handleCustomizationChange('logo', null)}
                      className="mt-2 text-red-400 hover:text-red-300"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                {/* Center Logo Option */}
                {customization.logo && (
                  <div className="mb-4">
                    <label className="flex items-center text-white">
                      <input 
                        type="checkbox" 
                        checked={customization.isCentered}
                        onChange={(e) => handleCustomizationChange('isCentered', e.target.checked)}
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
                      value={customization.dimensions}
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
                      value={customization.dimensions}
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
                    onClick={() => dispatchModal({ type: 'CLOSE_EDIT' })}
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
                    value={modalState.edit.data.data}
                    size={Math.min(customization.dimensions, 256)} // Limit preview size
                    bgColor={customization.bgColor}
                    fgColor={customization.fgColor}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    imageSettings={
                      customization.logo
                        ? {
                            src: customization.logo,
                            height: Math.floor(Math.min(customization.dimensions, 256) * 0.1875),
                            width: Math.floor(Math.min(customization.dimensions, 256) * 0.1875),
                            excavate: true,
                            x: customization.isCentered ? undefined : 0,
                            y: customization.isCentered ? undefined : 0,
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

export default Dashboard;
