'use client';
import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode.react';
import Navbar from '@/components/Navbar';
import QRTypeSelector from '@/components/QRTypeSelector';
import QRFormFields from '@/components/QRFormFields';
import StyleTemplates from '@/components/StyleTemplates';
import ShareButton from '@/components/ShareButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import {
  encodeWiFi,
  encodeVCard,
  encodeEmail,
  encodePhone,
  encodeSMS,
  encodeEvent,
} from '@/utils/qrDataEncoders';

export default function Page() {
  const [qrType, setQrType] = useState('url');
  const [formData, setFormData] = useState({});
  const [qrValue, setQrValue] = useState('');
  const [batchQRs, setBatchQRs] = useState([]);
  const [customization, setCustomization] = useState({
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    logo: null,
    logoSize: 20,
    logoPosition: 'center',
    errorCorrection: 'M',
    frameStyle: 'none',
    frameColor: '#000000',
    ctaText: '',
    ctaPosition: 'bottom',
  });
  const qrRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const generateQRData = () => {
    switch (qrType) {
      case 'url':
        return formData.url || '';
      case 'wifi':
        if (!formData.ssid) return null;
        return encodeWiFi(formData);
      case 'vcard':
        if (!formData.firstName) return null;
        return encodeVCard(formData);
      case 'email':
        if (!formData.email) return null;
        return encodeEmail(formData);
      case 'phone':
        if (!formData.phone) return null;
        return encodePhone(formData.phone);
      case 'sms':
        if (!formData.phone) return null;
        return encodeSMS(formData);
      case 'event':
        if (!formData.title || !formData.startDate) return null;
        return encodeEvent(formData);
      case 'batch':
        return 'batch';
      default:
        return formData.url || '';
    }
  };

  const handleCreate = () => {
    if (qrType === 'batch') {
      const lines = (formData.batchData || '')
        .split('\n')
        .filter((line) => line.trim())
        .slice(0, 50);

      if (lines.length === 0) {
        toast.error('Please enter at least one URL or text');
        return;
      }

      setBatchQRs(lines);
      setQrValue('');

      if (typeof window !== 'undefined') {
        const qrData = localStorage.getItem('qrData')
          ? JSON.parse(localStorage.getItem('qrData'))
          : [];

        lines.forEach((line) => {
          qrData.push({
            data: line,
            date: new Date(),
            type: 'url',
            bgColor: customization.bgColor,
            fgColor: customization.fgColor,
          });
        });

        localStorage.setItem('qrData', JSON.stringify(qrData));
      }
      toast.success(`${lines.length} QR codes generated!`);
      return;
    }

    const data = generateQRData();
    if (!data) {
      toast.error('Please fill in the required fields');
      return;
    }

    setQrValue(data);
    setBatchQRs([]);

    if (typeof window !== 'undefined') {
      const qrData = localStorage.getItem('qrData')
        ? JSON.parse(localStorage.getItem('qrData'))
        : [];
      qrData.push({
        data,
        date: new Date(),
        type: qrType,
        bgColor: customization.bgColor,
        fgColor: customization.fgColor,
        ...formData,
      });
      localStorage.setItem('qrData', JSON.stringify(qrData));
    }
    toast.success('QR code generated!');
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `QRCode-${qrType}.png`;
        link.click();
      }
    }
  };

  const downloadAllBatch = async () => {
    const canvases = document.querySelectorAll('.batch-qr-canvas canvas');
    canvases.forEach((canvas, index) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
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
    setQrValue('');
    setBatchQRs([]);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 120,
          particles: {
            color: { value: '#333333' },
            links: {
              color: '#333333',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: false,
              speed: 0.8,
              straight: false,
            },
            number: { density: { enable: true, area: 1000 }, value: 30 },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { random: true, value: 2 },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 pointer-events-none"
      />

      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        draggable
        theme="dark"
        toastStyle={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
        }}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Left Panel: Configuration */}
        <section className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 flex flex-col no-scrollbar">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">
              Create{' '}
              <span className="text-white/40 font-medium italic">Your QR</span>
            </h1>
            <p className="text-zinc-500 font-medium">
              Configure and customize your ninja code.
            </p>
          </div>

          <QRTypeSelector
            selectedType={qrType}
            onTypeChange={handleTypeChange}
          />

          <div className="flex-1 flex flex-col gap-10">
            <div className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-zinc-800/50 shadow-2xl">
              <QRFormFields
                type={qrType}
                formData={formData}
                onChange={setFormData}
              />

              <div className="mt-8">
                <StyleTemplates
                  onSelectTemplate={handleTemplateSelect}
                  currentBgColor={customization.bgColor}
                  currentFgColor={customization.fgColor}
                />
              </div>
            </div>

            <div className="flex justify-start pb-8">
              <button
                onClick={handleCreate}
                className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 
                         transition-all duration-300 flex items-center gap-3 active:scale-[0.98]"
              >
                {qrType === 'batch' ? 'Generate Batch' : 'Generate Code'}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Right Panel: Preview */}
        <section className="lg:w-[450px] xl:w-[500px] bg-zinc-950/80 backdrop-blur-3xl border-l border-zinc-900 border-t lg:border-t-0 p-8 flex flex-col items-center justify-center animate-fadeIn">
          {qrValue && qrType !== 'batch' ? (
            <div className="w-full flex flex-col items-center gap-10">
              <div
                ref={qrRef}
                className="p-8 rounded-[40px] shadow-2xl relative transition-transform duration-500 hover:scale-[1.02]"
                style={{ backgroundColor: customization.bgColor }}
              >
                {/* Visual Polish: Inner shadow/glow */}
                <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_0_80px_rgba(0,0,0,0.05)] pointer-events-none" />

                {/* CTA Top */}
                {customization.ctaText &&
                  customization.ctaPosition === 'top' && (
                    <p
                      className="text-center font-bold text-sm mb-4"
                      style={{ color: customization.fgColor }}
                    >
                      {customization.ctaText}
                    </p>
                  )}

                <QRCode
                  value={qrValue}
                  size={260}
                  bgColor={customization.bgColor}
                  fgColor={customization.fgColor}
                  renderAs="canvas"
                  level={customization.errorCorrection || 'M'}
                  imageSettings={
                    customization.logo
                      ? {
                          src: customization.logo,
                          height: Math.floor(
                            (260 * (customization.logoSize || 20)) / 100
                          ),
                          width: Math.floor(
                            (260 * (customization.logoSize || 20)) / 100
                          ),
                          excavate: true,
                          x:
                            customization.logoPosition === 'corner'
                              ? 10
                              : undefined,
                          y:
                            customization.logoPosition === 'corner'
                              ? 10
                              : undefined,
                        }
                      : undefined
                  }
                />

                {/* CTA Bottom */}
                {customization.ctaText &&
                  (customization.ctaPosition || 'bottom') === 'bottom' && (
                    <p
                      className="text-center font-bold text-sm mt-4"
                      style={{ color: customization.fgColor }}
                    >
                      {customization.ctaText}
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[280px]">
                <button
                  onClick={downloadQRCode}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-2xl 
                           transition-all duration-300 flex items-center justify-center gap-3"
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
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PNG
                </button>
                <ShareButton qrRef={qrRef} data={qrValue} />
              </div>
            </div>
          ) : batchQRs.length > 0 ? (
            <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Generated{' '}
                  <span className="text-zinc-500">({batchQRs.length})</span>
                </h2>
                <button
                  onClick={downloadAllBatch}
                  className="text-sm px-4 py-2 bg-white text-black font-bold rounded-xl active:scale-95 transition-all"
                >
                  Download All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {batchQRs.map((data, index) => (
                  <div
                    key={index}
                    className="batch-qr-canvas bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800/50 flex flex-col items-center gap-3"
                  >
                    <div
                      style={{ backgroundColor: customization.bgColor }}
                      className="p-2 rounded-xl"
                    >
                      <QRCode
                        value={data}
                        size={100}
                        bgColor={customization.bgColor}
                        fgColor={customization.fgColor}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 truncate w-full text-center px-2">
                      {data}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 px-12">
              <div className="w-20 h-20 mx-auto bg-zinc-900 rounded-[32px] flex items-center justify-center border border-zinc-800">
                <svg
                  className="w-10 h-10 text-zinc-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Live Preview</h3>
                <p className="text-zinc-600 text-sm">
                  Your generated QR Ninja code will appear here instantly.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
