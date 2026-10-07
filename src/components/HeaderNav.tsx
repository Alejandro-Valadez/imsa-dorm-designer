import React from 'react';
import { CameraViewMode, LightingMode, RoomConfig, RoomType } from '../types';
import { 
  Box, 
  Layers, 
  Compass, 
  Sun, 
  Sunset, 
  Moon, 
  Eye, 
  Camera, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  Download, 
  RotateCcw,
  Sliders
} from 'lucide-react';

interface HeaderNavProps {
  roomConfig: RoomConfig;
  onUpdateRoomConfig: (updates: Partial<RoomConfig>) => void;
  viewMode: CameraViewMode;
  onChangeViewMode: (mode: CameraViewMode) => void;
  lightingMode: LightingMode;
  onChangeLightingMode: (mode: LightingMode) => void;
  cutawayWalls: boolean;
  onToggleCutaway: () => void;
  onOpenPresets: () => void;
  onOpenRules: () => void;
  onOpenInventory: () => void;
  onTakeSnapshot: () => void;
  onExportPlan: () => void;
  onResetLayout: () => void;
  ruleWarningCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  roomConfig,
  onUpdateRoomConfig,
  viewMode,
  onChangeViewMode,
  lightingMode,
  onChangeLightingMode,
  cutawayWalls,
  onToggleCutaway,
  onOpenPresets,
  onOpenRules,
  onOpenInventory,
  onTakeSnapshot,
  onExportPlan,
  onResetLayout,
  ruleWarningCount,
}) => {
  return (
    <header className="h-16 bg-[#001D33] border-b border-[#1E3A5F] px-4 flex items-center justify-between z-20 select-none shadow-lg">
      {/* Left: Branding & Hall Info */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002B49] to-[#007A87] border border-[#C59B27]/40 flex items-center justify-center shadow-inner">
          <span className="text-xl">🏠</span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              IMSA Dorm 3D Studio
            </h1>
            <span className="bg-[#C59B27]/20 text-[#F5C242] border border-[#C59B27]/40 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
              Res Life 3D
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            {/* Hall selector */}
            <select
              value={roomConfig.hallNumber}
              onChange={(e) => onUpdateRoomConfig({ hallNumber: e.target.value })}
              className="bg-[#0B1726] border border-[#223E61] rounded px-1.5 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-[#C59B27]"
            >
              {[1501, 1502, 1503, 1504, 1505, 1506, 1507].map((h) => (
                <option key={h} value={h}>Hall {h}</option>
              ))}
            </select>

            {/* Wing selector */}
            <select
              value={roomConfig.wing}
              onChange={(e) => onUpdateRoomConfig({ wing: e.target.value })}
              className="bg-[#0B1726] border border-[#223E61] rounded px-1.5 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-[#C59B27]"
            >
              {['A', 'B', 'C', 'D'].map((w) => (
                <option key={w} value={w}>Wing {w}</option>
              ))}
            </select>

            <span className="text-slate-400">|</span>

            {/* Room Style */}
            <select
              value={roomConfig.type}
              onChange={(e) => {
                const t = e.target.value as RoomType;
                if (t === 'standard-double') {
                  onUpdateRoomConfig({ type: t, width: 11.67, length: 15.0, hasQuadDoor: false });
                } else if (t === 'corner-l-room') {
                  onUpdateRoomConfig({ type: t, width: 14.0, length: 16.0, hasQuadDoor: false });
                } else if (t === 'quad-suite') {
                  onUpdateRoomConfig({ type: t, width: 23.33, length: 15.0, hasQuadDoor: true });
                } else {
                  onUpdateRoomConfig({ type: 'custom' });
                }
              }}
              className="bg-[#0B1726] border border-[#223E61] rounded px-2 py-0.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#C59B27]"
            >
              <option value="standard-double">Standard Double (11′8″ × 15′0″)</option>
              <option value="corner-l-room">Corner L-Room (14′0″ × 16′0″)</option>
              <option value="quad-suite">Connected Quad Suite</option>
              <option value="custom">Custom Dimensions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Center: Camera & Lighting Switchers */}
      <div className="flex items-center space-x-3">
        {/* View Mode */}
        <div className="bg-[#0B1726] p-1 rounded-xl border border-[#223E61] flex items-center space-x-1">
          <button
            onClick={() => onChangeViewMode('orbit-3d')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'orbit-3d'
                ? 'bg-[#002B49] text-[#F5C242] border border-[#C59B27]/40 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Free 3D Orbit Camera"
          >
            <Box size={14} />
            <span>3D Orbit</span>
          </button>

          <button
            onClick={() => onChangeViewMode('top-down-2d')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'top-down-2d'
                ? 'bg-[#002B49] text-[#F5C242] border border-[#C59B27]/40 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="2D Blueprint Floorplan View"
          >
            <Compass size={14} />
            <span>2D Blueprint</span>
          </button>

          <button
            onClick={() => onChangeViewMode('isometric')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'isometric'
                ? 'bg-[#002B49] text-[#F5C242] border border-[#C59B27]/40 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Isometric Architectural Angle"
          >
            <Layers size={14} />
            <span>Isometric</span>
          </button>

          <button
            onClick={() => onChangeViewMode('eye-level')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'eye-level'
                ? 'bg-[#002B49] text-[#F5C242] border border-[#C59B27]/40 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="First-Person Doorway Eye Level"
          >
            <Eye size={14} />
            <span>Door View</span>
          </button>
        </div>

        {/* Lighting Mode */}
        <div className="bg-[#0B1726] p-1 rounded-xl border border-[#223E61] flex items-center space-x-1">
          <button
            onClick={() => onChangeLightingMode('day')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              lightingMode === 'day' ? 'bg-[#1E3A5F] text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Bright Natural Daylight"
          >
            <Sun size={15} />
          </button>
          <button
            onClick={() => onChangeLightingMode('golden')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              lightingMode === 'golden' ? 'bg-[#1E3A5F] text-amber-500' : 'text-slate-400 hover:text-white'
            }`}
            title="Golden Hour Sunset"
          >
            <Sunset size={15} />
          </button>
          <button
            onClick={() => onChangeLightingMode('night-study')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              lightingMode === 'night-study' ? 'bg-[#1E3A5F] text-indigo-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Late Night Study Lamp Mode"
          >
            <Moon size={15} />
          </button>
        </div>

        {/* Wall Cutaway Toggle */}
        <button
          onClick={onToggleCutaway}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            cutawayWalls
              ? 'bg-[#0B1726] border-[#223E61] text-sky-300'
              : 'bg-[#1E3A5F] border-sky-500/50 text-white shadow-sm'
          }`}
          title="Toggle Full Walls vs Cutaway Walls"
        >
          {cutawayWalls ? 'Cutaway Walls' : 'Full Walls'}
        </button>
      </div>

      {/* Right: Actions, Modals & Res Life Check */}
      <div className="flex items-center space-x-2">
        {/* Presets */}
        <button
          onClick={onOpenPresets}
          className="bg-[#0B1726] hover:bg-[#16273F] border border-[#223E61] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors"
        >
          <Sparkles size={14} className="text-[#F5C242]" />
          <span>Presets</span>
        </button>

        {/* Move-In Inventory List */}
        <button
          onClick={onOpenInventory}
          className="bg-[#0B1726] hover:bg-[#16273F] border border-[#223E61] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors"
        >
          <ShoppingBag size={14} className="text-emerald-400" />
          <span>Move-In Sheet</span>
        </button>

        {/* Safety & Policy Checker */}
        <button
          onClick={onOpenRules}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm ${
            ruleWarningCount > 0
              ? 'bg-amber-950/80 border border-amber-600/70 text-amber-300 animate-pulse'
              : 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Handbook Check</span>
          {ruleWarningCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
              {ruleWarningCount}
            </span>
          )}
        </button>

        {/* Snapshot Photo */}
        <button
          onClick={onTakeSnapshot}
          className="bg-[#0B1726] hover:bg-[#16273F] border border-[#223E61] text-slate-300 p-2 rounded-xl transition-colors"
          title="Save High-Res Snapshot Image"
        >
          <Camera size={15} />
        </button>

        {/* Export / Share Plan */}
        <button
          onClick={onExportPlan}
          className="bg-[#002B49] hover:bg-[#003B66] text-[#F5C242] border border-[#C59B27]/50 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors shadow-sm"
          title="Export Layout as JSON"
        >
          <Download size={14} />
          <span>Export Plan</span>
        </button>

        {/* Reset Layout */}
        <button
          onClick={onResetLayout}
          className="bg-[#0B1726] hover:bg-[#16273F] border border-[#223E61] text-slate-400 hover:text-white p-2 rounded-xl transition-colors"
          title="Reset to Default Preset"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
};
