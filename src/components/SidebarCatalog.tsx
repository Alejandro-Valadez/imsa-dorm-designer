import React, { useState } from 'react';
import { FurnitureCategory, FurnitureItemDefinition } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { Search, Plus, Info, CheckCircle2 } from 'lucide-react';

interface SidebarCatalogProps {
  onAddItem: (itemDef: FurnitureItemDefinition) => void;
}

export const SidebarCatalog: React.FC<SidebarCatalogProps> = ({ onAddItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory | 'all'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories: { id: FurnitureCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '📦' },
    { id: 'official', label: 'IMSA Issued', icon: '🎓' },
    { id: 'lounge', label: 'Lounge', icon: '🛋️' },
    { id: 'tech', label: 'Tech & Study', icon: '💻' },
    { id: 'storage', label: 'Storage', icon: '🧊' },
    { id: 'decor', label: 'Decor', icon: '✨' },
  ];

  const filteredItems = FURNITURE_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (item: FurnitureItemDefinition) => {
    onAddItem(item);
    setRecentlyAddedId(item.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1200);
  };

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] bg-[#0B1726] border-r border-[#1E3A5F] flex flex-col z-10 select-none shadow-xl">
      {/* Search Header */}
      <div className="p-3.5 border-b border-[#1E3A5F] space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search dorm furniture & decor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#112238] border border-[#223E61] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C59B27] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center space-x-1 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#002B49] text-[#F5C242] border border-[#C59B27]/40 shadow-sm'
                  : 'bg-[#16273F] text-slate-300 border border-transparent hover:bg-[#1E3554]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Catalog List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-1">
          Catalog ({filteredItems.length} items)
        </div>

        {filteredItems.map((item) => {
          const isAdded = recentlyAddedId === item.id;
          return (
            <div
              key={item.id}
              className="group relative bg-[#112238] border border-[#1E3A5F] hover:border-[#007A87] rounded-xl p-3 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2.5">
                  <span className="text-2xl p-1 bg-[#16273F] rounded-lg border border-[#223E61]">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleAdd(item)}
                  title="Add to room"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ml-2 shrink-0 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#002B49] hover:bg-[#003B66] text-[#F5C242] border border-[#C59B27]/50 active:scale-95'
                  }`}
                >
                  {isAdded ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {/* Badges / Dimensions */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] border-t border-[#1E3A5F]/70 pt-2">
                <span className="text-slate-400 font-mono">
                  {item.width}'W × {item.depth}'D × {item.height}'H
                </span>

                {item.isOfficialIMSA ? (
                  <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded font-semibold tracking-wide">
                    IMSA Issued
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-medium">
                    Bring-Your-Own
                  </span>
                )}
              </div>

              {/* IMSA Rule Note if present */}
              {item.imsaRuleNote && (
                <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded px-1.5 py-0.5">
                  <Info size={11} className="shrink-0 text-amber-400" />
                  <span className="truncate">{item.imsaRuleNote}</span>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No items found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#0B131E] border-t border-[#1E3A5F] text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          Res Life Compliant
        </span>
        <span className="font-mono text-slate-500">1 unit = 1 ft</span>
      </div>
    </aside>
  );
};
