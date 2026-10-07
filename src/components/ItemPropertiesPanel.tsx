import React from 'react';
import { PlacedItem } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { 
  RotateCw, 
  RotateCcw, 
  Trash2, 
  Copy, 
  X, 
  User, 
  Palette, 
  ArrowUp, 
  ArrowDown,
  Info,
  ShieldCheck
} from 'lucide-react';

interface ItemPropertiesPanelProps {
  selectedItem: PlacedItem | null;
  onDeselect: () => void;
  onRotate: (instanceId: string, angleDelta: number) => void;
  onDelete: (instanceId: string) => void;
  onDuplicate: (instanceId: string) => void;
  onChangeColor: (instanceId: string, color: string) => void;
  onChangeOwner: (instanceId: string, owner: 'Resident A' | 'Resident B' | 'Shared') => void;
  onChangeElevation: (instanceId: string, elevationDelta: number) => void;
}

export const ItemPropertiesPanel: React.FC<ItemPropertiesPanelProps> = ({
  selectedItem,
  onDeselect,
  onRotate,
  onDelete,
  onDuplicate,
  onChangeColor,
  onChangeOwner,
  onChangeElevation,
}) => {
  if (!selectedItem) return null;

  const def = FURNITURE_CATALOG.find((d) => d.id === selectedItem.definitionId);
  if (!def) return null;

  const colorOptions = def.colorOptions || [
    '#1e3a5f',
    '#8B0000',
    '#2E4F4F',
    '#4A5568',
    '#8C5E35',
    '#374151',
    '#0284C7',
    '#E2E8F0',
  ];

  return (
    <div className="absolute top-20 right-4 w-76 bg-[#0B1726]/95 backdrop-blur-md border border-[#1E3A5F] rounded-2xl p-4 shadow-2xl z-30 select-none text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#1E3A5F] pb-3">
        <div className="flex items-start space-x-2.5">
          <span className="text-2xl p-1 bg-[#16273F] rounded-lg border border-[#223E61]">
            {def.icon}
          </span>
          <div>
            <h3 className="text-xs font-bold text-white leading-tight">
              {def.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-amber-400 font-mono font-medium">
                {def.widthInches}″ × {def.depthInches}″ (H: {def.heightInches}″)
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                [{def.width.toFixed(1)}′ × {def.depth.toFixed(1)}′]
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onDeselect}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#16273F]"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body Controls */}
      <div className="mt-3.5 space-y-3.5 text-xs">
        {/* Owner Tag */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <User size={11} />
            <span>Assigned Resident</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['Resident A', 'Resident B', 'Shared'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onChangeOwner(selectedItem.instanceId, r)}
                className={`py-1 text-[10px] font-semibold rounded-md border transition-all ${
                  selectedItem.owner === r
                    ? 'bg-[#002B49] text-[#F5C242] border-[#C59B27]'
                    : 'bg-[#16273F] text-slate-300 border-transparent hover:bg-[#1E3554]'
                }`}
              >
                {r === 'Resident A' ? 'Res A' : r === 'Resident B' ? 'Res B' : 'Shared'}
              </button>
            ))}
          </div>
        </div>

        {/* Rotation Controls */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
            <span>Orientation</span>
            <span className="font-mono text-amber-400">{Math.round(selectedItem.rotationY % 360)}°</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onRotate(selectedItem.instanceId, -90)}
              className="bg-[#16273F] hover:bg-[#1E3554] border border-[#223E61] py-1.5 rounded-lg flex items-center justify-center space-x-1 text-slate-200 transition-colors"
            >
              <RotateCcw size={13} />
              <span className="text-[10px]">-90°</span>
            </button>
            <button
              onClick={() => onRotate(selectedItem.instanceId, 90)}
              className="bg-[#16273F] hover:bg-[#1E3554] border border-[#223E61] py-1.5 rounded-lg flex items-center justify-center space-x-1 text-slate-200 transition-colors"
            >
              <RotateCw size={13} />
              <span className="text-[10px]">+90°</span>
            </button>
            <button
              onClick={() => onRotate(selectedItem.instanceId, 180)}
              className="bg-[#16273F] hover:bg-[#1E3554] border border-[#223E61] py-1.5 rounded-lg flex items-center justify-center space-x-1 text-slate-200 transition-colors"
            >
              <RotateCw size={13} />
              <span className="text-[10px]">180°</span>
            </button>
          </div>
        </div>

        {/* Elevation Controls (if allowElevation or captain bed) */}
        {def.allowElevation && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
              <span>Elevation / Surface Mount</span>
              <span className="font-mono text-amber-400">{(selectedItem.y * 12).toFixed(0)}″ high</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onChangeElevation(selectedItem.instanceId, 0.5)}
                className="bg-[#16273F] hover:bg-[#1E3554] border border-[#223E61] py-1.5 rounded-lg flex items-center justify-center space-x-1 text-slate-200"
              >
                <ArrowUp size={13} />
                <span className="text-[10px]">+6″</span>
              </button>
              <button
                onClick={() => onChangeElevation(selectedItem.instanceId, -0.5)}
                className="bg-[#16273F] hover:bg-[#1E3554] border border-[#223E61] py-1.5 rounded-lg flex items-center justify-center space-x-1 text-slate-200"
              >
                <ArrowDown size={13} />
                <span className="text-[10px]">-6″</span>
              </button>
            </div>
          </div>
        )}

        {/* Color Palette */}
        {colorOptions.length > 1 && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Palette size={11} />
              <span>Finish & Bedding Tint</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeColor(selectedItem.instanceId, c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedItem.color === c ? 'border-amber-400 scale-110 shadow-lg' : 'border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* IMSA Rule Note */}
        {def.imsaRuleNote && (
          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[10px] text-amber-300 leading-snug space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-400">
              <ShieldCheck size={12} />
              <span>IMSA Handbook Rule</span>
            </div>
            <p>{def.imsaRuleNote}</p>
          </div>
        )}

        {/* Duplicate & Delete Actions */}
        <div className="pt-2 border-t border-[#1E3A5F] grid grid-cols-2 gap-2">
          <button
            onClick={() => onDuplicate(selectedItem.instanceId)}
            className="bg-[#16273F] hover:bg-[#1E3554] border border-[#223E61] py-1.5 rounded-xl flex items-center justify-center space-x-1.5 text-slate-200 transition-colors"
          >
            <Copy size={13} />
            <span className="text-[11px] font-medium">Duplicate</span>
          </button>
          <button
            onClick={() => onDelete(selectedItem.instanceId)}
            className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 py-1.5 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Trash2 size={13} />
            <span className="text-[11px] font-semibold">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
