"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";

const Dashboard = () => {
  const [qrData, setQrData] = useState([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [editingQR, setEditingQR] = useState(null);

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
    canvas.toBlob((blob) => {
      saveAs(blob, `QRCode.${format}`);
      toast(`QR downloaded as ${format}!`);
    }, `image/${format}`);
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
    setShowEditOptions(true);
  };

  const handleColorChange = (type, color) => {
    setEditingQR(prev => ({
      ...prev,
      [type]: color
    }));
  };

  const saveQREdit = () => {
    const updatedQRData = [...qrData];
    updatedQRData[editingQR.index] = {
      ...editingQR,
      bgColor: editingQR.bgColor,
      fgColor: editingQR.fgColor
    };

    setQrData(updatedQRData);
    localStorage.setItem("qrData", JSON.stringify(updatedQRData));
    setShowEditOptions(false);
    toast("QR code updated!");
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
              <tbody className="divide-y divide-gray-600">
                {qrData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="h-28 w-28 flex items-center justify-center">
                        <QRCode
                          id={`canvas-${item.data}`}
                          value={item.data}
                          size={1024}
                          bgColor={item.bgColor || "#FFFFFF"}
                          fgColor={item.fgColor || "#000000"}
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap ">
                      {item.data}
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
                <div className="flex items-center justify-between mb-4 gap-4">
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
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative max-w-4xl w-full mx-auto bg-gray-800 rounded-lg shadow-lg flex">
              {/* Left Side - Color Controls */}
              <div className="w-1/2 p-6">
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

                {/* Save Button */}
                <button
                  onClick={saveQREdit}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors mt-4"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditOptions(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors mt-4 ml-2"
                >
                  Cancel
                </button>
              </div>

              {/* Right Side - QR Code Preview */}
              <div className="w-1/2 p-6 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <QRCode
                    value={editingQR.data}
                    size={256}
                    bgColor={editingQR.bgColor}
                    fgColor={editingQR.fgColor}
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

export default Dashboard;
