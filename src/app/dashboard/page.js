"use client";
import { useState, useEffect, useMemo, useCallback, useReducer, useRef } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import ShareButton from "@/components/ShareButton";
import StyleTemplates from "@/components/StyleTemplates";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import { debounce } from "lodash";
import { QR_TYPES } from "@/utils/qrDataEncoders";

const initialModalState = {
  download: {
    isOpen: false,
    selectedData: null
  },
  edit: {
    isOpen: false,
    data: null
  }
};

const initialQRCustomization = {
  logo: null,
  isCentered: true,
  dimensions: 512,
  bgColor: "#FFFFFF",
  fgColor: "#000000"
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DOWNLOAD':
      return {
        ...state,
        download: { isOpen: true, selectedData: action.payload }
      };
    case 'CLOSE_DOWNLOAD':
      return {
        ...state,
        download: { isOpen: false, selectedData: null }
      };
    case 'OPEN_EDIT':
      return {
        ...state,
        edit: { isOpen: true, data: action.payload }
      };
    case 'CLOSE_EDIT':
      return {
        ...state,
        edit: { isOpen: false, data: null }
      };
    default:
      return state;
  }
};

const Dashboard = () => {
  const [qrData, setQrData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalState, dispatchModal] = useReducer(modalReducer, initialModalState);
  const [customization, setCustomization] = useState(initialQRCustomization);
  const qrRefs = useRef({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("qrData")
        ? JSON.parse(localStorage.getItem("qrData"))
        : [];
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setQrData(sortedData);
    }
  }, []);

  // Filter QR codes based on search
  const filteredQrData = useMemo(() => {
    if (!searchQuery.trim()) return qrData;
    
    const query = searchQuery.toLowerCase();
    return qrData.filter((item) => {
      const dataMatch = item.data?.toLowerCase().includes(query);
      const typeMatch = item.type?.toLowerCase().includes(query);
      const dateMatch = new Date(item.date).toLocaleDateString().includes(query);
      return dataMatch || typeMatch || dateMatch;
    });
  }, [qrData, searchQuery]);

  const handleDownload = (format, data) => {
    const canvas = document.getElementById(`canvas-${data}`);
    if (canvas) {
      if (format === 'svg') {
        const svgData = canvas.outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        saveAs(blob, `QRCode.svg`);
      } else {
        canvas.toBlob((blob) => {
          saveAs(blob, `QRCode.${format}`);
          toast(`QR downloaded as ${format.toUpperCase()}!`);
        }, `image/${format}`);
      }
    }
  };

  const handleDelete = (index) => {
    const originalIndex = qrData.findIndex((item) => item === filteredQrData[index]);
    const updatedData = [...qrData];
    updatedData.splice(originalIndex, 1);
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
    const originalIndex = qrData.findIndex((qr) => qr === item);
    dispatchModal({ type: 'OPEN_EDIT', payload: { ...item, index: originalIndex } });
  };

  const handleCustomizationChange = useCallback((key, value) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

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

  const handleTemplateSelect = (template) => {
    setCustomization(prev => ({
      ...prev,
      bgColor: template.bgColor,
      fgColor: template.fgColor
    }));
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

  const getQRTypeLabel = (type) => {
    return QR_TYPES[type]?.label || "URL / Text";
  };

  const getQRTypeIcon = (type) => {
    return QR_TYPES[type]?.icon || "🔗";
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

  const clearAllQRCodes = () => {
    if (window.confirm("Are you sure you want to delete all QR codes? This action cannot be undone.")) {
      setQrData([]);
      localStorage.setItem("qrData", JSON.stringify([]));
      toast("All QR codes deleted!");
    }
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
      <div className="bg-black text-white p-6 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold">Your Dashboard</h1>
            <p className="text-gray-400 mt-1">
              {qrData.length} QR code{qrData.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {qrData.length > 0 && (
            <button
              onClick={clearAllQRCodes}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Search Bar */}
        {qrData.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none transition-colors"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-gray-500 text-sm mt-2">
                Found {filteredQrData.length} result{filteredQrData.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {filteredQrData.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full divide-y divide-gray-600 bg-gray-800 text-gray-100">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {filteredQrData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div 
                        className="h-28 w-28 flex items-center justify-center"
                        ref={el => qrRefs.current[index] = el}
                      >
                        {renderQRCode(item)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-700">
                        <span>{getQRTypeIcon(item.type)}</span>
                        <span>{getQRTypeLabel(item.type)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group">
                        <div className="hover:text-gray-300 cursor-default">
                          {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                          })}
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
                          onClick={() => {
                            navigator.clipboard.writeText(item.data);
                            toast("Copied to clipboard!");
                          }}
                        >
                          {item.data}
                        </div>
                        <div className="absolute hidden group-hover:block bg-gray-900 text-white p-2 rounded shadow-lg -top-12 left-0 max-w-md z-50 break-all">
                          {item.data}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            dispatchModal({ type: 'OPEN_DOWNLOAD', payload: item.data });
                          }}
                          className="bg-white p-2 px-3 text-black hover:bg-gray-200 transition-all rounded-md text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleEditQR(item, index)}
                          className="bg-gray-600 p-2 px-3 text-white hover:bg-gray-500 transition-all rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <ShareButton 
                          qrRef={{ current: qrRefs.current[index] }} 
                          data={item.data} 
                        />
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-red-600 p-2 text-white hover:bg-red-500 transition-all rounded-md"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : qrData.length > 0 && filteredQrData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No QR codes match your search.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-white underline hover:text-gray-300"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No QR codes found. Create one from the Home page.</p>
            <a href="/" className="inline-block mt-4 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-all">
              Create QR Code
            </a>
          </div>
        )}
      </div>

      {/* Download Options Modal */}
      {modalState.download.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative max-w-md w-full mx-auto bg-gray-800 rounded-lg shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Download QR Code
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {['png', 'jpg', 'webp', 'svg', 'tiff', 'bmp'].map((format) => (
                    <button
                      key={format}
                      onClick={() => handleDownload(format, modalState.download.selectedData)}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors uppercase"
                    >
                      {format}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => dispatchModal({ type: 'CLOSE_DOWNLOAD' })}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Options Modal */}
      {modalState.edit.isOpen && modalState.edit.data && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl flex flex-col md:flex-row">
              {/* Left Side - Controls */}
              <div className="w-full md:w-1/2 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Customize QR Code
                </h3>
                
                {/* Style Templates */}
                <div className="mb-6">
                  <label className="block text-white mb-2 text-sm">Quick Templates</label>
                  <StyleTemplates
                    onSelectTemplate={handleTemplateSelect}
                    currentBgColor={customization.bgColor}
                    currentFgColor={customization.fgColor}
                  />
                </div>

                {/* Background Color */}
                <div className="mb-4">
                  <label className="block text-white mb-2">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customization.bgColor}
                      onChange={(e) => handleCustomizationChange('bgColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={customization.bgColor}
                      onChange={(e) => handleCustomizationChange('bgColor', e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded flex-1"
                    />
                  </div>
                </div>

                {/* Foreground Color */}
                <div className="mb-4">
                  <label className="block text-white mb-2">Foreground Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customization.fgColor}
                      onChange={(e) => handleCustomizationChange('fgColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={customization.fgColor}
                      onChange={(e) => handleCustomizationChange('fgColor', e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded flex-1"
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
                    className="bg-gray-700 text-white p-2 rounded w-full text-sm"
                  />
                  {customization.logo && (
                    <button 
                      onClick={() => handleCustomizationChange('logo', null)}
                      className="mt-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                {/* Center Logo Option */}
                {customization.logo && (
                  <div className="mb-4">
                    <label className="flex items-center text-white cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={customization.isCentered}
                        onChange={(e) => handleCustomizationChange('isCentered', e.target.checked)}
                        className="mr-2 w-4 h-4"
                      />
                      Center Logo
                    </label>
                  </div>
                )}

                {/* Dimension Controls */}
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <label className="block text-white mb-2">Dimensions</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={customization.dimensions}
                      onChange={(e) => handleDimensionChange(e.target.value)}
                      onBlur={handleDimensionBlur}
                      className="bg-gray-600 text-white p-2 rounded w-24"
                      min="128"
                      max="2048"
                      step="32"
                    />
                    <span className="text-gray-400">x</span>
                    <input
                      type="number"
                      value={customization.dimensions}
                      onChange={(e) => handleDimensionChange(e.target.value)}
                      onBlur={handleDimensionBlur}
                      className="bg-gray-600 text-white p-2 rounded w-24"
                      min="128"
                      max="2048"
                      step="32"
                    />
                    <span className="text-gray-400">px</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">128px - 2048px</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={saveQREdit}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => dispatchModal({ type: 'CLOSE_EDIT' })}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Right Side - QR Code Preview */}
              <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-700 rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
                <div 
                  className="p-6 rounded-lg shadow-lg"
                  style={{ backgroundColor: customization.bgColor }}
                >
                  <QRCode
                    value={modalState.edit.data.data}
                    size={Math.min(customization.dimensions, 256)}
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
