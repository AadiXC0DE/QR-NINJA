'use client';

import { QR_TYPE_CONFIG } from '@/utils/qrDataEncoders';

/**
 * QR Type Selector - Compact premium tab-based selector
 */
const QRTypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <div className="w-full mb-8">
      <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-1.5 border border-zinc-800/50 flex flex-nowrap overflow-x-auto no-scrollbar gap-1">
        {Object.entries(QR_TYPE_CONFIG).map(([type, { label, icon }]) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`
              relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium
              transition-all duration-300 text-sm whitespace-nowrap min-w-fit flex-1
              ${
                selectedType === type
                  ? 'bg-white text-black shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }
            `}
          >
            <span className="shrink-0">{icon}</span>
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Scroll indicator for mobile */}
      <div className="mt-2 text-[10px] text-zinc-600 uppercase tracking-widest text-center lg:hidden opacity-50 font-semibold">
        Swipe to select type
      </div>
    </div>
  );
};

export default QRTypeSelector;
