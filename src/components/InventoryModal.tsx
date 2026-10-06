import React, { useState } from 'react';
import { PlacedItem, RoomConfig } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { X, ShoppingBag, CheckSquare, Square, Copy, Check } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  placedItems: PlacedItem[];
  roomConfig: RoomConfig;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  placedItems,
  roomConfig,
}) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Group items by IMSA Official vs Bring Your Own
  const officialItems: PlacedItem[] = [];
  const studentItems: PlacedItem[] = [];

  placedItems.forEach((item) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def) return;
    if (def.isOfficialIMSA) {
      officialItems.push(item);
    } else {
      studentItems.push(item);
    }
  });

  // Group student items by owner
  const resA = studentItems.filter((i) => i.owner === 'Resident A');
  const resB = studentItems.filter((i) => i.owner === 'Resident B');
  const shared = studentItems.filter((i) => !i.owner || i.owner === 'Shared');

  const handleCopyList = () => {
    let text = `📦 IMSA DORM ROOM SHOPPING & PACKING LIST\n`;
    text += `📍 Hall ${roomConfig.hallNumber} - Wing ${roomConfig.wing} (${roomConfig.type})\n\n`;

    text += `🤝 SHARED APPLIANCES & GEAR:\n`;
    shared.forEach((i) => {
      const def = FURNITURE_CATALOG.find((d) => d.id === i.definitionId);
      text += ` - [ ] ${def?.name || 'Item'}\n`;
    });

    text += `\n👤 RESIDENT A PACKING LIST:\n`;
    resA.forEach((i) => {
      const def = FURNITURE_CATALOG.find((d) => d.id === i.definitionId);
      text += ` - [ ] ${def?.name || 'Item'}\n`;
    });

    text += `\n👤 RESIDENT B PACKING LIST:\n`;
    resB.forEach((i) => {
      const def = FURNITURE_CATALOG.find((d) => d.id === i.definitionId);
      text += ` - [ ] ${def?.name || 'Item'}\n`;
    });

    text += `\n🏛️ IMSA-PROVIDED FURNITURE ON MOVE-IN:\n`;
    officialItems.forEach((i) => {
      const def = FURNITURE_CATALOG.find((d) => d.id === i.definitionId);
      text += ` - ✓ ${def?.name || 'Item'}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#1E3A5F] bg-[#001D33] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#007A87]/30 border border-[#007A87]/60 flex items-center justify-center text-[#38BDF8]">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Roommate Move-in & Shopping Checklist
              </h2>
              <p className="text-xs text-slate-400">
                Coordinate who brings what for IMSA Hall {roomConfig.hallNumber}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Shared Items */}
          <div className="bg-[#112238] border border-[#1E3A5F] rounded-xl p-3.5 space-y-2.5">
            <h3 className="text-xs font-bold text-[#F5C242] flex items-center justify-between">
              <span>🤝 Shared Appliances & Essentials ({shared.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Split or coordinate</span>
            </h3>

            {shared.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No shared items placed yet (e.g. mini-fridge, rug).</p>
            ) : (
              <div className="space-y-1.5">
                {shared.map((item) => {
                  const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
                  const isChecked = checkedIds[item.instanceId];
                  return (
                    <div
                      key={item.instanceId}
                      onClick={() => toggleCheck(item.instanceId)}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#16273F]/70 hover:bg-[#1A304E] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        {isChecked ? (
                          <CheckSquare size={16} className="text-emerald-400" />
                        ) : (
                          <Square size={16} className="text-slate-400" />
                        )}
                        <span className="text-sm">{def?.icon}</span>
                        <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {def?.name}
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#002B49] text-amber-300 px-2 py-0.5 rounded font-mono">
                        Shared
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Individual Resident Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Resident A */}
            <div className="bg-[#112238] border border-[#1E3A5F] rounded-xl p-3.5 space-y-2.5">
              <h3 className="text-xs font-bold text-[#38BDF8] flex items-center justify-between">
                <span>👤 Resident A Gear ({resA.length})</span>
              </h3>
              {resA.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No specific items assigned to Resident A.</p>
              ) : (
                <div className="space-y-1.5">
                  {resA.map((item) => {
                    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
                    const isChecked = checkedIds[item.instanceId];
                    return (
                      <div
                        key={item.instanceId}
                        onClick={() => toggleCheck(item.instanceId)}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#16273F]/70 hover:bg-[#1A304E] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {isChecked ? (
                            <CheckSquare size={15} className="text-emerald-400" />
                          ) : (
                            <Square size={15} className="text-slate-400" />
                          )}
                          <span className="text-sm">{def?.icon}</span>
                          <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {def?.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resident B */}
            <div className="bg-[#112238] border border-[#1E3A5F] rounded-xl p-3.5 space-y-2.5">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                <span>👤 Resident B Gear ({resB.length})</span>
              </h3>
              {resB.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No specific items assigned to Resident B.</p>
              ) : (
                <div className="space-y-1.5">
                  {resB.map((item) => {
                    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
                    const isChecked = checkedIds[item.instanceId];
                    return (
                      <div
                        key={item.instanceId}
                        onClick={() => toggleCheck(item.instanceId)}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#16273F]/70 hover:bg-[#1A304E] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {isChecked ? (
                            <CheckSquare size={15} className="text-emerald-400" />
                          ) : (
                            <Square size={15} className="text-slate-400" />
                          )}
                          <span className="text-sm">{def?.icon}</span>
                          <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {def?.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Official IMSA Included List */}
          <div className="bg-[#0B131E] border border-[#1E3A5F] rounded-xl p-3 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              🏛️ Academy-Issued Furniture Already In Room ({officialItems.length} items)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              {officialItems.map((item) => {
                const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
                return (
                  <div key={item.instanceId} className="flex items-center space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="truncate">{def?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E3A5F] bg-[#001D33] flex items-center justify-between">
          <button
            onClick={handleCopyList}
            className="bg-[#112238] hover:bg-[#16273F] text-slate-200 border border-[#223E61] text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy to Roommate Chat'}</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#002B49] hover:bg-[#003B66] text-[#F5C242] border border-[#C59B27]/50 text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
