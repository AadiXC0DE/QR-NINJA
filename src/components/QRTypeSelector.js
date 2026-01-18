"use client";

import { QR_TYPES } from "@/utils/qrDataEncoders";

/**
 * QR Type Selector - Tab-based selector for different QR types
 */
const QRTypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(QR_TYPES).map(([type, { label, icon }]) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-200 text-sm
              ${selectedType === type
                ? "bg-white text-black shadow-lg scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QRTypeSelector;
