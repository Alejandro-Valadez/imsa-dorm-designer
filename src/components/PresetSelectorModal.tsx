import React from 'react';
import { PRESET_LAYOUTS } from '../data/furnitureCatalog';
import { PlacedItem, RoomConfig } from '../types';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (presetItems: any[], roomType: any) => void;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#1E3A5F] bg-[#001D33] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                IMSA Dorm Layout Presets
              </h2>
              <p className="text-xs text-slate-400">
                Popular tried-and-true room arrangements used by IMSA students
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#16273F] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Cards */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {PRESET_LAYOUTS.map((preset) => (
            <div
              key={preset.id}
              className="bg-[#112238] border border-[#1E3A5F] hover:border-[#C59B27] rounded-xl p-4 transition-all duration-200 hover:shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#F5C242] transition-colors flex items-center gap-2">
                    <span>{preset.name}</span>
                    <span className="text-[10px] bg-[#002B49] text-amber-300 px-2 py-0.5 rounded-full font-normal border border-[#C59B27]/40">
                      {preset.items.length} pieces
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      onApplyPreset(preset.items, preset.roomType);
                      onClose();
                    }}
                    className="bg-[#002B49] group-hover:bg-[#003B66] text-[#F5C242] border border-[#C59B27]/50 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <span>Apply Layout</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E3A5F] bg-[#001D33] text-right">
          <button
            onClick={onClose}
            className="bg-[#16273F] text-slate-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
