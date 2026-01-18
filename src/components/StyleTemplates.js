"use client";

import styleTemplates from "@/utils/styleTemplates";

/**
 * Style Templates Grid Component
 * Shows pre-designed color themes for quick QR styling
 */
const StyleTemplates = ({ onSelectTemplate, currentBgColor, currentFgColor }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <p className="text-gray-400 text-sm mb-3 text-center">Quick Style Templates</p>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {styleTemplates.map((template) => {
          const isSelected = 
            currentBgColor === template.bgColor && 
            currentFgColor === template.fgColor;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`
                p-2 rounded-lg transition-all duration-200
                flex flex-col items-center gap-1
                ${isSelected
                  ? "ring-2 ring-white scale-105"
                  : "hover:scale-105 hover:bg-gray-700/50"
                }
              `}
              style={{
                background: `linear-gradient(135deg, ${template.bgColor} 50%, ${template.fgColor} 50%)`
              }}
              title={template.name}
            >
              <span className="text-xl">{template.preview}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleTemplates;
