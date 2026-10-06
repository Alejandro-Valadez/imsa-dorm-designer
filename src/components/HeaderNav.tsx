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
                  onUpdateRoomConfig({ type: t, width: 12, length: 15, hasQuadDoor: false });
                } else if (t === 'corner-l-room') {
                  onUpdateRoomConfig({ type: t, width: 14, length: 16, hasQuadDoor: false });
                } else if (t === 'quad-suite') {
                  onUpdateRoomConfig({ type: t, width: 24, length: 15, hasQuadDoor: true });
                } else {
                  onUpdateRoomConfig({ type: 'custom' });
                }
              }}
              className="bg-[#0B1726] border border-[#223E61] rounded px-2 py-0.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#C59B27]"
            >
              <option value="standard-double">Standard Double (12' × 15')</option>
              <option value="corner-l-room">Corner L-Room (14' × 16')</option>
              <option value="quad-suite">Connected Quad Suite</option>
              <option value="custom">Custom Dimensions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle: View Modes & Lighting */}
      <div className="flex items-center space-x-2">
        {/* Camera Views */}
        <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-lg p-0.5 flex items-center space-x-0.5">
          <button
            onClick={() => onChangeViewMode('orbit-3d')}
            title="3D Orbit View"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'orbit-3d' ? 'bg-[#002B49] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box size={14} />
            <span>3D Orbit</span>
          </button>

          <button
            onClick={() => onChangeViewMode('top-down-2d')}
            title="2D Top-Down Blueprint"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'top-down-2d' ? 'bg-[#002B49] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            <span>2D Blueprint</span>
          </button>

          <button
            onClick={() => onChangeViewMode('isometric')}
            title="Isometric Angled View"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'isometric' ? 'bg-[#002B49] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass size={14} />
            <span>Isometric</span>
          </button>

          <button
            onClick={() => onChangeViewMode('eye-level')}
            title="Doorway First-Person View"
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
              viewMode === 'eye-level' ? 'bg-[#002B49] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye size={14} />
            <span>Walkthrough</span>
          </button>
        </div>

        {/* Lighting Mode */}
        <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-lg p-0.5 flex items-center space-x-0.5">
          <button
            onClick={() => onChangeLightingMode('day')}
            title="Daylight (Natural Window Sun)"
            className={`p-1.5 rounded transition-all ${
              lightingMode === 'day' ? 'bg-[#002B49] text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun size={15} />
          </button>
          <button
            onClick={() => onChangeLightingMode('golden')}
            title="Golden Hour Sunset"
            className={`p-1.5 rounded transition-all ${
              lightingMode === 'golden' ? 'bg-[#002B49] text-orange-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sunset size={15} />
          </button>
          <button
            onClick={() => onChangeLightingMode('night-study')}
            title="Night Study (Desk and Lamp Glow)"
            className={`p-1.5 rounded transition-all ${
              lightingMode === 'night-study' ? 'bg-[#002B49] text-indigo-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon size={15} />
          </button>
        </div>

        {/* Cutaway Toggle */}
        <button
          onClick={onToggleCutaway}
          title={cutawayWalls ? 'Cutaway Walls Active (Easy viewing)' : 'Full Height Walls'}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1 transition-all ${
            cutawayWalls
              ? 'bg-[#0B1726] border-[#007A87] text-[#38BDF8]'
              : 'bg-[#0B1726] border-[#1E3A5F] text-slate-400'
          }`}
        >
          <Sliders size={13} />
          <span>{cutawayWalls ? 'Cutaway ON' : 'Full Walls'}</span>
        </button>
      </div>

      {/* Right: Actions, Presets, Rules, Export */}
      <div className="flex items-center space-x-2">
        {/* Presets Button */}
        <button
          onClick={onOpenPresets}
          className="bg-gradient-to-r from-amber-600/30 to-amber-500/20 border border-amber-500/50 hover:bg-amber-600/40 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>Presets</span>
        </button>

        {/* IMSA Res Life Rules Button */}
        <button
          onClick={onOpenRules}
          className="relative bg-[#0B1726] border border-[#1E3A5F] hover:border-emerald-500/50 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
        >
          <ShieldCheck size={14} className={ruleWarningCount > 0 ? 'text-amber-400' : 'text-emerald-400'} />
          <span>Res Life Check</span>
          {ruleWarningCount > 0 && (
            <span className="w-4 h-4 bg-amber-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
              {ruleWarningCount}
            </span>
          )}
        </button>

        {/* Roommate Checklist */}
        <button
          onClick={onOpenInventory}
          className="bg-[#0B1726] border border-[#1E3A5F] hover:border-[#007A87] text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
        >
          <ShoppingBag size={14} className="text-[#007A87]" />
          <span>Checklist</span>
        </button>

        {/* Snapshot PNG */}
        <button
          onClick={onTakeSnapshot}
          title="Download High-Res 3D Snapshot"
          className="bg-[#002B49] hover:bg-[#003B66] border border-[#007A87]/50 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Camera size={14} />
          <span>Snapshot</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportPlan}
          title="Export Layout File (.json)"
          className="bg-[#0B1726] border border-[#1E3A5F] hover:border-slate-400 text-slate-300 p-1.5 rounded-lg transition-all"
        >
          <Download size={15} />
        </button>

        {/* Reset */}
        <button
          onClick={onResetLayout}
          title="Reset Room"
          className="bg-[#0B1726] border border-[#1E3A5F] hover:border-red-500/50 text-slate-400 hover:text-red-400 p-1.5 rounded-lg transition-all"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
};
