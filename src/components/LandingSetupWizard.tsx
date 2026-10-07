import React, { useState } from 'react';
import { RoomConfig, PlacedItem } from '../types';
import { PRESET_LAYOUTS } from '../data/furnitureCatalog';
import { 
  Sparkles, 
  Check, 
  Sun, 
  Layers, 
  DoorClosed, 
  ShieldCheck, 
  Compass, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface LandingSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  roomConfig: RoomConfig;
  onApplySetup: (newRoomConfig: Partial<RoomConfig>, items: PlacedItem[]) => void;
}

export const LandingSetupWizard: React.FC<LandingSetupWizardProps> = ({
  isOpen,
  onClose,
  roomConfig,
  onApplySetup,
}) => {
  // Hall & Wing
  const [hallNumber, setHallNumber] = useState(roomConfig.hallNumber || '1501');
  const [wing, setWing] = useState(roomConfig.wing || 'A');
  const [roomNumber, setRoomNumber] = useState(roomConfig.roomNumber || '102');

  // Bed configuration choice
  const [bedSetup, setBedSetup] = useState<'bunked' | 'separate' | 'captains' | 'l-shape'>('bunked');

  // Window layout preference
  const [windowPreference, setWindowPreference] = useState<'window-desks' | 'window-lounge' | 'open-path'>('window-desks');

  // Room Inventory checkboxes
  const [includeDesks, setIncludeDesks] = useState(true);
  const [includeWardrobes, setIncludeWardrobes] = useState(true);
  const [includeDressers, setIncludeDressers] = useState(false); // as user noted: some students don't have dressers, some do
  const [includeFridge, setIncludeFridge] = useState(true);
  const [includeBookshelf, setIncludeBookshelf] = useState(true);
  const [includeRug, setIncludeRug] = useState(true);

  if (!isOpen) return null;

  const handleLaunchStudio = () => {
    // Determine closest preset or custom item composition based on selections
    let chosenPresetId = 'preset-window-workstations';

    if (windowPreference === 'window-lounge') {
      chosenPresetId = 'preset-window-lounge';
    } else if (bedSetup === 'bunked') {
      chosenPresetId = 'preset-classic-bunked';
    } else if (bedSetup === 'captains' || includeDressers) {
      chosenPresetId = 'preset-captains-storage';
    } else if (bedSetup === 'l-shape') {
      chosenPresetId = 'preset-l-shape-lounge';
    } else {
      chosenPresetId = 'preset-symmetric-split';
    }

    const basePreset = PRESET_LAYOUTS.find((p) => p.id === chosenPresetId) || PRESET_LAYOUTS[0];

    // Filter or adjust items based on student inventory checkboxes
    let finalItems = [...basePreset.items];

    // Desks
    if (!includeDesks) {
      finalItems = finalItems.filter((i) => i.definitionId !== 'imsa-desk' && i.definitionId !== 'imsa-chair');
    }

    // Wardrobes
    if (!includeWardrobes) {
      finalItems = finalItems.filter((i) => i.definitionId !== 'imsa-wardrobe');
    }

    // Dressers
    if (!includeDressers) {
      finalItems = finalItems.filter((i) => i.definitionId !== 'imsa-dresser');
    } else if (!finalItems.some((i) => i.definitionId === 'imsa-dresser')) {
      // Add 2 dressers if requested
      finalItems.push(
        { definitionId: 'imsa-dresser', x: 4.8, z: 2.8, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident A' },
        { definitionId: 'imsa-dresser', x: 4.8, z: 5.4, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' }
      );
    }

    // Mini-fridge
    if (!includeFridge) {
      finalItems = finalItems.filter((i) => i.definitionId !== 'dorm-microfridge');
    } else if (!finalItems.some((i) => i.definitionId === 'dorm-microfridge')) {
      finalItems.push({
        definitionId: 'dorm-microfridge',
        x: -4.8,
        z: 3.5,
        y: 0,
        rotationY: 90,
        color: '#1F2937',
        owner: 'Shared',
      });
    }

    // Bookshelf
    if (!includeBookshelf) {
      finalItems = finalItems.filter((i) => i.definitionId !== 'bookshelf-unit');
    }

    // Rug
    if (!includeRug) {
      finalItems = finalItems.filter((i) => i.definitionId !== 'dorm-rug-medium' && i.definitionId !== 'dorm-rug-runner');
    }

    const instantiated: PlacedItem[] = finalItems.map((it, idx) => ({
      ...it,
      instanceId: `item_init_${Date.now()}_${idx}`,
    }));

    onApplySetup(
      {
        hallNumber,
        wing,
        roomNumber,
        type: 'standard-double',
        width: 11.67,
        length: 15.0,
      },
      instantiated
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Hero Header */}
        <div className="p-6 bg-gradient-to-r from-[#001D33] via-[#002B49] to-[#00385E] border-b border-[#1E3A5F] relative">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">🏠</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  IMSA Dorm 3D Studio
                </h1>
                <span className="bg-[#C59B27]/25 text-[#F5C242] border border-[#C59B27]/50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Official 11′8″ × 15′0″
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Illinois Math and Science Academy • Residence Life Room Setup
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300/90 leading-relaxed max-w-xl">
            Configure your hall, bed style, issued inventory, and window layout preference. The 3D studio will automatically generate an authentic, code-compliant room.
          </p>
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Hall & Room */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <DoorClosed size={14} />
              <span>1. Your Residence Hall & Room</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Residence Hall</label>
                <select
                  value={hallNumber}
                  onChange={(e) => setHallNumber(e.target.value)}
                  className="w-full bg-[#112238] border border-[#223E61] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C59B27]"
                >
                  {[1501, 1502, 1503, 1504, 1505, 1506, 1507].map((h) => (
                    <option key={h} value={h}>Hall {h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Wing</label>
                <select
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  className="w-full bg-[#112238] border border-[#223E61] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C59B27]"
                >
                  {['A', 'B', 'C', 'D'].map((w) => (
                    <option key={w} value={w}>Wing {w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-[#112238] border border-[#223E61] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C59B27]"
                  placeholder="e.g. 102"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bed Configuration */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Layers size={14} />
              <span>2. Are Your Beds Stacked or Separate?</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'bunked' as const,
                  title: 'Stacked Bunks',
                  desc: 'Stacked frame saves maximum floor space for rugs',
                  icon: '🛌',
                },
                {
                  id: 'separate' as const,
                  title: 'Two Separate Beds',
                  desc: 'Unbunked Twin XL beds against opposite walls',
                  icon: '🛏️',
                },
                {
                  id: 'captains' as const,
                  title: 'Captain’s Lofted',
                  desc: 'Elevated notch frame with underbed storage',
                  icon: '🪜',
                },
                {
                  id: 'l-shape' as const,
                  title: 'L-Shape Beds',
                  desc: 'Corner head-to-toe formation on adjacent walls',
                  icon: '📐',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBedSetup(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    bedSetup === opt.id
                      ? 'bg-[#002B49] border-[#F5C242] text-white shadow-md'
                      : 'bg-[#112238] border-[#223E61] text-slate-300 hover:bg-[#16273F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{opt.icon}</span>
                    {bedSetup === opt.id && (
                      <span className="w-5 h-5 rounded-full bg-[#F5C242] text-black flex items-center justify-center text-[10px]">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{opt.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Window Layout Setup */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sun size={14} />
              <span>3. Window Setup Preference</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: 'window-desks' as const,
                  title: 'Window Workstations',
                  desc: 'Both study desks face the window for natural study daylight',
                  icon: '☀️',
                },
                {
                  id: 'window-lounge' as const,
                  title: 'Window Lounge Nook',
                  desc: 'Sunny window nook dedicated to beanbags, rug & plants',
                  icon: '🪴',
                },
                {
                  id: 'open-path' as const,
                  title: 'Open Window Path',
                  desc: 'Wide unobstructed central walking aisle directly to window',
                  icon: '↔️',
                },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWindowPreference(w.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    windowPreference === w.id
                      ? 'bg-[#002B49] border-[#F5C242] text-white shadow-md'
                      : 'bg-[#112238] border-[#223E61] text-slate-300 hover:bg-[#16273F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{w.icon}</span>
                    {windowPreference === w.id && (
                      <span className="w-5 h-5 rounded-full bg-[#F5C242] text-black flex items-center justify-center text-[10px]">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold leading-tight">{w.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{w.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: What is in Your Room Checklist */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>4. What Furniture Is In Your Room?</span>
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              All double rooms have 2 desks and 2 wardrobes. Select whether your room has 3-drawer dressers or student additions:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#112238] border border-[#223E61] cursor-pointer hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={includeDesks}
                  onChange={(e) => setIncludeDesks(e.target.checked)}
                  className="rounded border-slate-700 text-[#002B49] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">2 Official IMSA Desks & Chairs</div>
                  <div className="text-[10px] text-slate-400">42″ × 24″ solid oak workstations</div>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#112238] border border-[#223E61] cursor-pointer hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={includeWardrobes}
                  onChange={(e) => setIncludeWardrobes(e.target.checked)}
                  className="rounded border-slate-700 text-[#002B49] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">2 Wardrobe Armoires</div>
                  <div className="text-[10px] text-slate-400">36″ × 24″ × 72″ with padlock hasp</div>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#112238] border border-[#223E61] cursor-pointer hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={includeDressers}
                  onChange={(e) => setIncludeDressers(e.target.checked)}
                  className="rounded border-slate-700 text-[#002B49] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">3-Drawer Dressers (Optional)</div>
                  <div className="text-[10px] text-slate-400">Underbed or standalone drawers</div>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#112238] border border-[#223E61] cursor-pointer hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={includeFridge}
                  onChange={(e) => setIncludeFridge(e.target.checked)}
                  className="rounded border-slate-700 text-[#002B49] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">Compact Mini-Fridge</div>
                  <div className="text-[10px] text-slate-400">IMSA compliant ≤ 4.3 cu. ft.</div>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#112238] border border-[#223E61] cursor-pointer hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={includeBookshelf}
                  onChange={(e) => setIncludeBookshelf(e.target.checked)}
                  className="rounded border-slate-700 text-[#002B49] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">Bookshelf Unit</div>
                  <div className="text-[10px] text-slate-400">Handbook limit: 3′ × 3′ max</div>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#112238] border border-[#223E61] cursor-pointer hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={includeRug}
                  onChange={(e) => setIncludeRug(e.target.checked)}
                  className="rounded border-slate-700 text-[#002B49] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">5′ × 7′ Cozy Area Rug</div>
                  <div className="text-[10px] text-slate-400">Fits room floor center</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#001D33] border-t border-[#1E3A5F] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>En-suite bath & PTAC clearance auto-configured</span>
          </div>

          <button
            onClick={handleLaunchStudio}
            className="bg-gradient-to-r from-[#002B49] to-[#005B94] hover:from-[#003B66] hover:to-[#0070B8] text-[#F5C242] border border-[#C59B27] font-bold px-6 py-2.5 rounded-2xl flex items-center space-x-2 shadow-lg transition-all active:scale-95 cursor-pointer text-sm"
          >
            <span>Generate & Launch 3D Room</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
