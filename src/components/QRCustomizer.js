'use client';

import { useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode.react';
import StyleTemplates from '@/components/StyleTemplates';

/**
 * Professional QR Customizer Component
 * Tabbed interface for comprehensive QR code editing
 */

const TABS = [
  {
    id: 'colors',
    label: 'Colors',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
  {
    id: 'logo',
    label: 'Logo',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: 'size',
    label: 'Size',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    ),
  },
  {
    id: 'frame',
    label: 'Frame',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v3a1 1 0 01-2 0V5zm16 0a1 1 0 00-1-1h-4a1 1 0 000 2h3v3a1 1 0 002 0V5zM4 19a1 1 0 001 1h4a1 1 0 000-2H6v-3a1 1 0 00-2 0v4zm16 0a1 1 0 01-1 1h-4a1 1 0 010-2h3v-3a1 1 0 012 0v4z"
        />
      </svg>
    ),
  },
];

const ERROR_LEVELS = [
  { value: 'L', label: 'Low (7%)', desc: 'Fastest scan' },
  { value: 'M', label: 'Medium (15%)', desc: 'Balanced' },
  { value: 'Q', label: 'Quartile (25%)', desc: 'Good for logos' },
  { value: 'H', label: 'High (30%)', desc: 'Best recovery' },
];

const FRAME_STYLES = [
  { id: 'none', label: 'None' },
  { id: 'simple', label: 'Simple' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'shadow', label: 'Shadow' },
];

const QRCustomizer = ({
  qrData,
  customization,
  onChange,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState('colors');

  const handleChange = (key, value) => {
    onChange({ ...customization, [key]: value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-zinc-500 focus:outline-none transition-all text-sm';
  const labelClass =
    'block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2';

  const getFrameClasses = () => {
    switch (customization.frameStyle) {
      case 'simple':
        return 'border-4';
      case 'rounded':
        return 'border-4 rounded-3xl';
      case 'shadow':
        return 'shadow-2xl shadow-black/50';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-5xl bg-zinc-900 rounded-[32px] border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Customize QR Code</h2>
            <p className="text-zinc-500 text-sm mt-1">
              Fine-tune every detail of your code
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-zinc-800 rounded-xl transition-all"
          >
            <svg
              className="w-6 h-6 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 border-b border-zinc-800 shrink-0">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Controls Panel */}
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-8">
                {/* Quick Templates */}
                <div>
                  <label className={labelClass}>Quick Templates</label>
                  <StyleTemplates
                    onSelectTemplate={(t) => {
                      handleChange('bgColor', t.bgColor);
                      handleChange('fgColor', t.fgColor);
                    }}
                    currentBgColor={customization.bgColor}
                    currentFgColor={customization.fgColor}
                  />
                </div>

                {/* Manual Colors */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Background Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={customization.bgColor || '#FFFFFF'}
                        onChange={(e) =>
                          handleChange('bgColor', e.target.value)
                        }
                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customization.bgColor || '#FFFFFF'}
                        onChange={(e) =>
                          handleChange('bgColor', e.target.value)
                        }
                        className={`${inputClass} flex-1 font-mono`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Foreground Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={customization.fgColor || '#000000'}
                        onChange={(e) =>
                          handleChange('fgColor', e.target.value)
                        }
                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customization.fgColor || '#000000'}
                        onChange={(e) =>
                          handleChange('fgColor', e.target.value)
                        }
                        className={`${inputClass} flex-1 font-mono`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logo Tab */}
            {activeTab === 'logo' && (
              <div className="space-y-8">
                {/* Logo Upload */}
                <div>
                  <label className={labelClass}>Upload Logo</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center hover:border-zinc-500 transition-all">
                      {customization.logo ? (
                        <div className="flex items-center justify-center gap-4">
                          <Image
                            src={customization.logo}
                            alt="Logo"
                            width={64}
                            height={64}
                            className="w-16 h-16 object-contain rounded-xl"
                            unoptimized
                          />
                          <div className="text-left">
                            <p className="text-white font-medium">
                              Logo uploaded
                            </p>
                            <p className="text-zinc-500 text-sm">
                              Click to replace
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-10 h-10 mx-auto text-zinc-600 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-zinc-400">
                            Click or drag to upload logo
                          </p>
                          <p className="text-zinc-600 text-sm mt-1">
                            PNG, JPG, SVG up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {customization.logo && (
                    <button
                      onClick={() => handleChange('logo', null)}
                      className="mt-3 text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Remove logo
                    </button>
                  )}
                </div>

                {/* Logo Size */}
                {customization.logo && (
                  <>
                    <div>
                      <label className={labelClass}>
                        Logo Size ({customization.logoSize || 20}%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        value={customization.logoSize || 20}
                        onChange={(e) =>
                          handleChange('logoSize', parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                      />
                      <div className="flex justify-between text-xs text-zinc-600 mt-1">
                        <span>Small</span>
                        <span>Large</span>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Logo Position</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleChange('logoPosition', 'center')}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                            (customization.logoPosition || 'center') ===
                            'center'
                              ? 'bg-white text-black'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          Center
                        </button>
                        <button
                          onClick={() => handleChange('logoPosition', 'corner')}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                            customization.logoPosition === 'corner'
                              ? 'bg-white text-black'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          Corner
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Logo Padding ({customization.logoPadding || 0}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={customization.logoPadding || 0}
                        onChange={(e) =>
                          handleChange('logoPadding', parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Size Tab */}
            {activeTab === 'size' && (
              <div className="space-y-8">
                {/* Dimensions */}
                <div>
                  <label className={labelClass}>
                    Dimensions ({customization.dimensions || 512}px)
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="2048"
                    step="32"
                    value={customization.dimensions || 512}
                    onChange={(e) =>
                      handleChange('dimensions', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1">
                    <span>128px</span>
                    <span>2048px</span>
                  </div>
                </div>

                {/* Error Correction */}
                <div>
                  <label className={labelClass}>Error Correction Level</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ERROR_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() =>
                          handleChange('errorCorrection', level.value)
                        }
                        className={`p-4 rounded-xl text-left transition-all ${
                          (customization.errorCorrection || 'M') === level.value
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold">{level.label}</div>
                        <div className="text-xs opacity-60 mt-0.5">
                          {level.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-zinc-600 text-xs mt-3">
                    Higher levels allow more damage tolerance. Use Q or H when
                    adding a logo.
                  </p>
                </div>

                {/* Margin */}
                <div>
                  <label className={labelClass}>
                    Margin / Quiet Zone ({customization.margin || 4} modules)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={customization.margin || 4}
                    onChange={(e) =>
                      handleChange('margin', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1">
                    <span>None</span>
                    <span>Large</span>
                  </div>
                </div>
              </div>
            )}

            {/* Frame Tab */}
            {activeTab === 'frame' && (
              <div className="space-y-8">
                {/* Frame Style */}
                <div>
                  <label className={labelClass}>Frame Style</label>
                  <div className="grid grid-cols-4 gap-3">
                    {FRAME_STYLES.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => handleChange('frameStyle', frame.id)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all ${
                          (customization.frameStyle || 'none') === frame.id
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Color */}
                {customization.frameStyle &&
                  customization.frameStyle !== 'none' && (
                    <div>
                      <label className={labelClass}>Frame Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={
                            customization.frameColor ||
                            customization.fgColor ||
                            '#000000'
                          }
                          onChange={(e) =>
                            handleChange('frameColor', e.target.value)
                          }
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={
                            customization.frameColor ||
                            customization.fgColor ||
                            '#000000'
                          }
                          onChange={(e) =>
                            handleChange('frameColor', e.target.value)
                          }
                          className={`${inputClass} flex-1 font-mono`}
                        />
                      </div>
                    </div>
                  )}

                {/* CTA Text */}
                <div>
                  <label className={labelClass}>Call-to-Action Text</label>
                  <input
                    type="text"
                    value={customization.ctaText || ''}
                    onChange={(e) => handleChange('ctaText', e.target.value)}
                    placeholder="e.g. Scan Me, Learn More..."
                    className={inputClass}
                  />
                </div>

                {customization.ctaText && (
                  <div>
                    <label className={labelClass}>Text Position</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleChange('ctaPosition', 'bottom')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          (customization.ctaPosition || 'bottom') === 'bottom'
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Below QR
                      </button>
                      <button
                        onClick={() => handleChange('ctaPosition', 'top')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          customization.ctaPosition === 'top'
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Above QR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="w-full md:w-[400px] bg-zinc-950 p-8 flex flex-col items-center justify-center shrink-0 border-t md:border-t-0 md:border-l border-zinc-800">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-6">
              Live Preview
            </p>

            <div
              className={`p-6 rounded-[32px] transition-all duration-300 ${getFrameClasses()}`}
              style={{
                backgroundColor: customization.bgColor || '#FFFFFF',
                borderColor:
                  customization.frameColor ||
                  customization.fgColor ||
                  '#000000',
              }}
            >
              {/* CTA Top */}
              {customization.ctaText && customization.ctaPosition === 'top' && (
                <p
                  className="text-center font-bold text-sm mb-4"
                  style={{ color: customization.fgColor || '#000000' }}
                >
                  {customization.ctaText}
                </p>
              )}

              <QRCode
                value={qrData || 'https://qrninja.app'}
                size={220}
                bgColor={customization.bgColor || '#FFFFFF'}
                fgColor={customization.fgColor || '#000000'}
                level={customization.errorCorrection || 'M'}
                includeMargin={false}
                imageSettings={
                  customization.logo
                    ? {
                        src: customization.logo,
                        height: Math.floor(
                          (220 * (customization.logoSize || 20)) / 100
                        ),
                        width: Math.floor(
                          (220 * (customization.logoSize || 20)) / 100
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
                    style={{ color: customization.fgColor || '#000000' }}
                  >
                    {customization.ctaText}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-zinc-800 flex gap-4 shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-700 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

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
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QRCustomizer;
