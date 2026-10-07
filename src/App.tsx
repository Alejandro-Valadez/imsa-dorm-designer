import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CameraViewMode, LightingMode, PlacedItem, RoomConfig, FurnitureItemDefinition } from './types';
import { PRESET_LAYOUTS, FURNITURE_CATALOG } from './data/furnitureCatalog';
import { HeaderNav } from './components/HeaderNav';
import { SidebarCatalog } from './components/SidebarCatalog';
import { ThreeCanvas } from './components/ThreeCanvas';
import { ItemPropertiesPanel } from './components/ItemPropertiesPanel';
import { PolicyCheckerModal } from './components/PolicyCheckerModal';
import { InventoryModal } from './components/InventoryModal';
import { PresetSelectorModal } from './components/PresetSelectorModal';

export const App: React.FC = () => {
  // 1. Room Configuration (IMSA Standard Double: 11'8" x 15'0" living room)
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    type: 'standard-double',
    name: 'Standard Double Room',
    width: 11.67, // 11'8"
    length: 15.0, // 15'0"
    ceilingHeight: 8.5,
    bathroomPosition: 'left-entry',
    hasQuadDoor: false,
    windowWall: 'north',
    hallNumber: '1501',
    wing: 'A',
    roomNumber: '102',
  });

  // 2. Placed Furniture Items (Default to Classic Bunked preset)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(() => {
    const defaultPreset = PRESET_LAYOUTS[0];
    return defaultPreset.items.map((it, idx) => ({
      ...it,
      instanceId: `item_${Date.now()}_${idx}`,
    }));
  });

  // 3. Selection & Viewport Controls
  const [selectedItemInstanceId, setSelectedItemInstanceId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<CameraViewMode>('orbit-3d');
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [cutawayWalls, setCutawayWalls] = useState<boolean>(true);
  const [snapGrid] = useState<number>(0.25); // 3-inch fine snap grid

  // 4. Modals
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // Snapshot callback ref
  const snapshotFnRef = useRef<(() => string) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate live room statistics
  const roomArea = roomConfig.width * roomConfig.length;
  const occupiedArea = placedItems.reduce((acc, it) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === it.definitionId);
    if (!def || def.category === 'decor' || it.y > 1.0) return acc;
    return acc + def.width * def.depth;
  }, 0);
  const walkablePercent = Math.max(0, Math.round(((roomArea - occupiedArea) / roomArea) * 100));

  // Compute live safety warnings count (Handbook p.51-52 compliance)
  const doorMargin = 1.0;
  const doorWidth = 3.0;
  const doorX = roomConfig.width / 2 - doorMargin - doorWidth / 2;
  const doorZ = roomConfig.length / 2;
  const doorBlocked = placedItems.some((item) => {
    return Math.hypot(item.x - doorX, item.z - doorZ) < 3.0 && item.y < 2.0;
  });

  // PTAC 2ft clearance check
  const ptacBlocked = placedItems.some((item) => {
    const dx = Math.abs(item.x - 0);
    const dz = item.z - (-roomConfig.length / 2 + 0.4);
    return dx < 2.5 && dz > 0 && dz < 2.0 && item.y < 3.0;
  });

  // Refrigerator limit
  const fridgeCount = placedItems.filter((i) => i.definitionId === 'dorm-microfridge').length;
  
  // Wall rule check
  const bedsAndWardrobes = placedItems.filter(
    (i) => i.definitionId === 'imsa-bunk-bed' || i.definitionId === 'imsa-single-bed' || i.definitionId === 'imsa-wardrobe'
  );
  const hasFloatingItem = bedsAndWardrobes.some((item) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def) return false;
    const halfW = roomConfig.width / 2;
    const halfL = roomConfig.length / 2;
    const distToLeft = Math.abs(item.x - (-halfW));
    const distToRight = Math.abs(item.x - halfW);
    const distToNorth = Math.abs(item.z - (-halfL));
    const distToSouth = Math.abs(item.z - halfL);
    const minDist = Math.min(distToLeft, distToRight, distToNorth, distToSouth);
    return minDist > Math.max(def.width, def.depth) / 2 + 1.2;
  });

  const warningCount =
    (doorBlocked ? 1 : 0) +
    (ptacBlocked ? 1 : 0) +
    (fridgeCount > 1 ? 1 : 0) +
    (hasFloatingItem ? 1 : 0);

  // Item Management Handlers
  const handleAddItem = (def: FurnitureItemDefinition) => {
    const offset = (Math.random() - 0.5) * 1.5;
    const newItem: PlacedItem = {
      instanceId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      definitionId: def.id,
      x: Math.round(offset / snapGrid) * snapGrid,
      z: Math.round(offset / snapGrid) * snapGrid,
      y: 0,
      rotationY: 0,
      color: def.defaultColor,
      owner: def.isOfficialIMSA ? 'Resident A' : 'Shared',
    };

    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemInstanceId(newItem.instanceId);
  };

  const handleUpdateItemPosition = (instanceId: string, x: number, z: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, x, z } : item))
    );
  };

  const handleRotateItem = (instanceId: string, angleDelta: number) => {
    setPlacedItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, rotationY: (item.rotationY + angleDelta + 360) % 360 }
          : item
      )
    );
  };

  const handleElevationChange = (instanceId: string, delta: number) => {
    setPlacedItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, y: Math.max(0, Math.min(6, item.y + delta)) }
          : item
      )
    );
  };

  const handleChangeColor = (instanceId: string, color: string) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, color } : item))
    );
  };

  const handleChangeOwner = (instanceId: string, owner: 'Resident A' | 'Resident B' | 'Shared') => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, owner } : item))
    );
  };

  const handleDeleteItem = (instanceId: string) => {
    setPlacedItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
    if (selectedItemInstanceId === instanceId) {
      setSelectedItemInstanceId(null);
    }
  };

  const handleDuplicateItem = (instanceId: string) => {
    const item = placedItems.find((i) => i.instanceId === instanceId);
    if (!item) return;

    const dup: PlacedItem = {
      ...item,
      instanceId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      x: item.x + 0.5,
      z: item.z + 0.5,
    };
    setPlacedItems((prev) => [...prev, dup]);
    setSelectedItemInstanceId(dup.instanceId);
  };

  const handleApplyPreset = (presetItems: any[], presetRoomType: any) => {
    setRoomConfig((prev) => ({
      ...prev,
      type: presetRoomType,
      width: presetRoomType === 'standard-double' ? 11.67 : prev.width,
      length: presetRoomType === 'standard-double' ? 15.0 : prev.length,
    }));

    const instantiated: PlacedItem[] = presetItems.map((it, idx) => ({
      ...it,
      instanceId: `item_${Date.now()}_${idx}`,
    }));

    setPlacedItems(instantiated);
    setSelectedItemInstanceId(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#002B49', '#F5C242', '#007A87'],
    });
  };

  const handleResetLayout = () => {
    if (window.confirm('Reset this room back to the IMSA Classic Bunked layout?')) {
      handleApplyPreset(PRESET_LAYOUTS[0].items, PRESET_LAYOUTS[0].roomType);
    }
  };

  const handleTakeSnapshot = () => {
    if (snapshotFnRef.current) {
      const dataUrl = snapshotFnRef.current();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `IMSA-Hall${roomConfig.hallNumber}-Wing${roomConfig.wing}-Room${roomConfig.roomNumber}-DormPlan.png`;
      a.click();
    }
  };

  const handleExportPlan = () => {
    const data = {
      timestamp: new Date().toISOString(),
      roomConfig,
      placedItems,
      generator: 'IMSA Dorm 3D Studio',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IMSA-RoomPlan-${roomConfig.hallNumber}-${roomConfig.wing}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedItem = placedItems.find((i) => i.instanceId === selectedItemInstanceId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#060B12] text-white font-sans antialiased">
      {/* Top Navigation */}
      <HeaderNav
        roomConfig={roomConfig}
        onUpdateRoomConfig={(updates) => setRoomConfig((prev) => ({ ...prev, ...updates }))}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        lightingMode={lightingMode}
        onChangeLightingMode={setLightingMode}
        cutawayWalls={cutawayWalls}
        onToggleCutaway={() => setCutawayWalls(!cutawayWalls)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenInventory={() => setIsInventoryModalOpen(true)}
        onTakeSnapshot={handleTakeSnapshot}
        onExportPlan={handleExportPlan}
        onResetLayout={handleResetLayout}
        ruleWarningCount={warningCount}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Furniture Catalog */}
        <SidebarCatalog onAddItem={handleAddItem} />

        {/* 3D Viewport Canvas */}
        <main className="flex-1 relative bg-gradient-to-b from-[#0A131F] to-[#04080E] overflow-hidden">
          <ThreeCanvas
            roomConfig={roomConfig}
            placedItems={placedItems}
            selectedItemInstanceId={selectedItemInstanceId}
            onSelectItem={setSelectedItemInstanceId}
            onUpdateItemPosition={handleUpdateItemPosition}
            viewMode={viewMode}
            lightingMode={lightingMode}
            cutawayWalls={cutawayWalls}
            snapGrid={snapGrid}
            onRegisterSnapshotFn={(fn) => {
              snapshotFnRef.current = fn;
            }}
          />

          {/* HUD Top Left Stats Bar */}
          <div className="absolute top-4 left-4 bg-[#0B1726]/90 backdrop-blur-md border border-[#1E3A5F] rounded-2xl px-4 py-2.5 shadow-xl flex items-center space-x-4 text-xs select-none">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Room Dimensions
              </div>
              <div className="font-bold text-white font-mono flex items-center gap-1">
                <span>11′8″ × 15′0″</span>
                <span className="text-slate-400 font-normal">({Math.round(roomArea)} sq. ft.)</span>
              </div>
            </div>

            <div className="h-6 w-px bg-[#1E3A5F]" />

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Walkable Floor
              </div>
              <div className="font-bold text-emerald-400 font-mono">
                {walkablePercent}% open
              </div>
            </div>

            <div className="h-6 w-px bg-[#1E3A5F]" />

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Placed Items
              </div>
              <div className="font-bold text-amber-300 font-mono">
                {placedItems.length} pieces
              </div>
            </div>
          </div>

          {/* HUD Bottom Left Legend */}
          <div className="absolute bottom-4 left-4 bg-[#0B1726]/85 backdrop-blur-md border border-[#1E3A5F] rounded-xl px-3 py-2 text-[11px] text-slate-400 select-none flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f] border border-[#2b4c7e]"></span>
              Official Furniture
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              PTAC Unit Zone (2ft buffer)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500/80"></span>
              En-Suite Private Bath
            </span>
          </div>

          {/* Active Item Properties Inspector */}
          <ItemPropertiesPanel
            selectedItem={selectedItem}
            onDeselect={() => setSelectedItemInstanceId(null)}
            onRotate={handleRotateItem}
            onDelete={handleDeleteItem}
            onDuplicate={handleDuplicateItem}
            onChangeColor={handleChangeColor}
            onChangeOwner={handleChangeOwner}
            onChangeElevation={handleElevationChange}
          />
        </main>
      </div>

      {/* Hidden File Input for JSON import */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".json" />

      {/* Modals */}
      <PolicyCheckerModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        placedItems={placedItems}
        roomConfig={roomConfig}
      />

      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        placedItems={placedItems}
        roomConfig={roomConfig}
      />

      <PresetSelectorModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onApplyPreset={handleApplyPreset}
      />
    </div>
  );
};

export default App;
