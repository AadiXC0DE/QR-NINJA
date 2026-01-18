'use client';

import styleTemplates from '@/utils/styleTemplates';

/**
 * Style Templates - More compact premium design
 */
const StyleTemplates = ({
  onSelectTemplate,
  currentBgColor,
  currentFgColor,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
          Style Presets
        </p>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-3">
        {styleTemplates.map((template) => {
          const isSelected =
            currentBgColor === template.bgColor &&
            currentFgColor === template.fgColor;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`
                group relative aspect-square rounded-full transition-all duration-300
                overflow-hidden border border-zinc-800/50
                ${
                  isSelected
                    ? 'ring-2 ring-white ring-offset-4 ring-offset-zinc-900 scale-110'
                    : 'hover:scale-125 hover:z-10'
                }
              `}
              title={template.name}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${template.bgColor} 50%, ${template.fgColor} 50%)`,
                }}
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleTemplates;
