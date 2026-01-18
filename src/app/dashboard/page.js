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
import { QR_TYPE_CONFIG } from "@/utils/qrDataEncoders";

const initialModalState = {
  download: { isOpen: false, selectedData: null },
  edit: { isOpen: false, data: null }
};

const initialQRCustomization = {
  logo: null,
  isCentered: true,
  dimensions: 400,
  bgColor: "#FFFFFF",
  fgColor: "#000000"
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DOWNLOAD': return { ...state, download: { isOpen: true, selectedData: action.payload } };
    case 'CLOSE_DOWNLOAD': return { ...state, download: { isOpen: false, selectedData: null } };
    case 'OPEN_EDIT': return { ...state, edit: { isOpen: true, data: action.payload } };
    case 'CLOSE_EDIT': return { ...state, edit: { isOpen: false, data: null } };
    default: return state;
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
      const data = localStorage.getItem("qrData") ? JSON.parse(localStorage.getItem("qrData")) : [];
      setQrData(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, []);

  const filteredQrData = useMemo(() => {
    if (!searchQuery.trim()) return qrData;
    const query = searchQuery.toLowerCase();
    return qrData.filter(item => 
      item.data?.toLowerCase().includes(query) || 
      item.type?.toLowerCase().includes(query)
    );
  }, [qrData, searchQuery]);

  const handleDownload = (format, data) => {
    const canvas = document.getElementById(`canvas-${data}`);
    if (!canvas) return;
    if (format === 'svg') {
      const blob = new Blob([canvas.outerHTML], { type: 'image/svg+xml' });
      saveAs(blob, `QRCode.svg`);
    } else {
      canvas.toBlob(blob => {
        saveAs(blob, `QRCode.${format}`);
        toast.success(`Downloaded as ${format.toUpperCase()}`);
      }, `image/${format}`);
    }
  };

  const handleDelete = (index) => {
    const target = filteredQrData[index];
    const updatedData = qrData.filter(item => item !== target);
    setQrData(updatedData);
    localStorage.setItem("qrData", JSON.stringify(updatedData));
    toast.success("Code removed");
  };

  const handleEditQR = (item) => {
    const originalIndex = qrData.indexOf(item);
    setCustomization({
      logo: item.logo || null,
      isCentered: item.isCentered ?? true,
      dimensions: item.dimensions || 400,
      bgColor: item.bgColor || "#FFFFFF",
      fgColor: item.fgColor || "#000000"
    });
    dispatchModal({ type: 'OPEN_EDIT', payload: { ...item, index: originalIndex } });
  };

  const handleCustomizationChange = useCallback((key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  }, []);

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
    updatedQRData[editingQR.index] = { ...editingQR, ...customization, date: new Date() };
    setQrData(updatedQRData);
    localStorage.setItem("qrData", JSON.stringify(updatedQRData));
    dispatchModal({ type: 'CLOSE_EDIT' });
    toast.success("Updated successfully");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      <ToastContainer
        position="top-center" autoClose={2000} hideProgressBar newestOnTop theme="dark"
        toastStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-4">
              Vault <span className="text-zinc-500 font-medium tracking-normal italic">History</span>
            </h1>
            <p className="text-zinc-500 font-medium">Manage and refine your previously generated ninja codes.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" placeholder="Search codes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 focus:border-zinc-700 focus:outline-none transition-all"
              />
            </div>
          </div>
        </header>

        {filteredQrData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQrData.map((item, index) => {
              const config = QR_TYPE_CONFIG[item.type] || QR_TYPE_CONFIG.url;
              return (
                <div key={index} className="group bg-zinc-900/40 backdrop-blur-xl rounded-[32px] border border-zinc-800/50 overflow-hidden hover:border-zinc-700 transition-all duration-500 hover:translate-y-[-4px]">
                  <div className="p-8 flex justify-center bg-transparent" ref={el => qrRefs.current[index] = el}>
                    <div className="p-5 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: item.bgColor || '#FFFFFF' }}>
                      <QRCode id={`canvas-${item.data}`} value={item.data} size={160} bgColor={item.bgColor || "#FFFFFF"} fgColor={item.fgColor || "#000000"} level="H" />
                    </div>
                  </div>
                  
                  <div className="px-8 pb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/30">
                        <span className="text-zinc-500 scale-75">{config.icon}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{config.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-600 font-medium">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span>
                    </div>
                    
                    <h3 className="text-sm text-zinc-300 font-medium truncate mb-6" title={item.data}>{item.data}</h3>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatchModal({ type: 'OPEN_DOWNLOAD', payload: item.data })}
                        className="flex-1 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleEditQR(item)}
                        className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 hover:text-white transition-all active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-600 rounded-xl hover:border-red-500/50 hover:text-red-500 transition-all active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-[40px] flex items-center justify-center mb-8 border border-zinc-800">
              <svg className="w-10 h-10 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No codes found</h2>
            <p className="text-zinc-600 mb-8 max-w-xs">Start creating ninja codes and they will be safely stored in your local vault.</p>
            <a href="/" className="px-8 py-3.5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all">Create New</a>
          </div>
        )}
      </div>

      {/* Download Modal - Same Premium Aesthetic */}
      {modalState.download.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-2xl rounded-[40px] border border-zinc-800 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8">Export</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['png', 'jpg', 'webp', 'svg'].map(fmt => (
                <button key={fmt} onClick={() => handleDownload(fmt, modalState.download.selectedData)} className="py-4 bg-zinc-800 hover:bg-white hover:text-black font-bold rounded-2xl transition-all uppercase text-xs tracking-widest">{fmt}</button>
              ))}
            </div>
            <button onClick={() => dispatchModal({ type: 'CLOSE_DOWNLOAD' })} className="w-full py-4 text-zinc-500 hover:text-white font-bold transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Modal - Same Premium Aesthetic */}
      {modalState.edit.isOpen && modalState.edit.data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-4xl bg-zinc-900 rounded-[40px] border border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
              <h3 className="text-2xl font-bold mb-8">Refine <span className="text-zinc-500">Code</span></h3>
              <div className="space-y-10">
                <StyleTemplates onSelectTemplate={handleTemplateSelect} currentBgColor={customization.bgColor} currentFgColor={customization.fgColor} />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Background</label>
                    <div className="flex gap-2">
                       <input type="color" value={customization.bgColor} onChange={e => handleCustomizationChange('bgColor', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer bg-transparent" />
                       <input type="text" value={customization.bgColor} onChange={e => handleCustomizationChange('bgColor', e.target.value)} className="flex-1 bg-zinc-800 rounded-xl px-4 text-xs font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Foreground</label>
                    <div className="flex gap-2">
                       <input type="color" value={customization.fgColor} onChange={e => handleCustomizationChange('fgColor', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer bg-transparent" />
                       <input type="text" value={customization.fgColor} onChange={e => handleCustomizationChange('fgColor', e.target.value)} className="flex-1 bg-zinc-800 rounded-xl px-4 text-xs font-mono" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveQREdit} className="flex-1 py-4 bg-white text-black font-bold rounded-2xl">Save Changes</button>
                  <button onClick={() => dispatchModal({ type: 'CLOSE_EDIT' })} className="px-8 py-4 bg-zinc-800 font-bold rounded-2xl">Cancel</button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-800/30 flex items-center justify-center p-12">
              <div className="p-8 rounded-[40px] shadow-2xl" style={{ backgroundColor: customization.bgColor }}>
                <QRCode value={modalState.edit.data.data} size={240} bgColor={customization.bgColor} fgColor={customization.fgColor} level="H" />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;
