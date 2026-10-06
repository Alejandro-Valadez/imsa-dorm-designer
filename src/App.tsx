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
  // 1. Room Configuration
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    type: 'standard-double',
    name: 'Standard Double Room',
    width: 12,
    length: 15,
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
  const [snapGrid] = useState<number>(0.5); // 6 inches snap

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

  // Compute live safety warnings count
  const doorBlocked = placedItems.some((item) => {
    const doorX = roomConfig.width / 2 - 1.8;
    const doorZ = roomConfig.length / 2;
    return Math.hypot(item.x - doorX, item.z - doorZ) < 3.0 && item.y < 2.0;
  });
  const fridgeCount = placedItems.filter((i) => i.definitionId === 'dorm-microfridge').length;
  const warningCount = (doorBlocked ? 1 : 0) + (fridgeCount > 1 ? 1 : 0);

  // Item Management Handlers
  const handleAddItem = (def: FurnitureItemDefinition) => {
    // Place near center of room with slight randomness
    const offset = (Math.random() - 0.5) * 2;
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

  const handleChangeOwner = (
    instanceId: string,
    owner: 'Resident A' | 'Resident B' | 'Shared'
  ) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, owner } : item))
    );
  };

  const handleDeleteItem = (instanceId: string) => {
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    if (selectedItemInstanceId === instanceId) {
      setSelectedItemInstanceId(null);
    }
  };

  const handleDuplicateItem = (instanceId: string) => {
    const item = placedItems.find((p) => p.instanceId === instanceId);
    if (!item) return;

    const dup: PlacedItem = {
      ...item,
      instanceId: `item_${Date.now()}_dup`,
      x: Math.min(roomConfig.width / 2 - 1, item.x + 1),
      z: Math.min(roomConfig.length / 2 - 1, item.z + 1),
    };

    setPlacedItems((prev) => [...prev, dup]);
    setSelectedItemInstanceId(dup.instanceId);
  };

  // Apply Preset Layout
  const handleApplyPreset = (items: any[], roomType: any) => {
    if (roomType) {
      setRoomConfig((prev) => ({ ...prev, type: roomType }));
    }
    const newPlaced = items.map((it, idx) => ({
      ...it,
      instanceId: `preset_${Date.now()}_${idx}`,
    }));
    setPlacedItems(newPlaced);
    setSelectedItemInstanceId(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#002B49', '#C59B27', '#007A87'],
    });
  };

  // Snapshot PNG Download
  const handleTakeSnapshot = () => {
    if (!snapshotFnRef.current) return;
    const dataUrl = snapshotFnRef.current();
    const link = document.createElement('a');
    link.download = `IMSA-Hall${roomConfig.hallNumber}-Wing${roomConfig.wing}-RoomPlan.png`;
    link.href = dataUrl;
    link.click();

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.2, x: 0.9 },
    });
  };

  // Export layout JSON
  const handleExportPlan = () => {
    const plan = {
      title: 'IMSA Dorm Room Layout',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      roomConfig,
      placedItems,
    };
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `IMSA-Dorm-Plan-${roomConfig.hallNumber}-${roomConfig.wing}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import layout JSON
  const handleImportPlan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.roomConfig && json.placedItems) {
          setRoomConfig(json.roomConfig);
          setPlacedItems(json.placedItems);
          setSelectedItemInstanceId(null);
        }
      } catch (err) {
        alert('Invalid layout file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetLayout = () => {
    if (window.confirm('Reset all furniture layout to default empty room?')) {
      setPlacedItems([]);
      setSelectedItemInstanceId(null);
    }
  };

  const selectedItem = placedItems.find((p) => p.instanceId === selectedItemInstanceId) || null;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#0B131E] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hidden File Input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportPlan}
        accept=".json"
        className="hidden"
      />

      {/* Navigation Header */}
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

      {/* Main Workspace Area */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Furniture & Decor Catalog */}
        <SidebarCatalog onAddItem={handleAddItem} />

        {/* Center 3D Viewport */}
        <div className="flex-1 relative h-full">
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

          {/* Floating Item Inspector Properties Panel */}
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

          {/* Bottom HUD: Room Dimensions, Walkable Area, Instructions */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center justify-between">
            {/* Room Dimension & Space Stats */}
            <div className="pointer-events-auto bg-[#001D33]/90 backdrop-blur-md border border-[#1E3A5F] rounded-xl px-4 py-2.5 shadow-xl flex items-center space-x-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Room Dimensions
                </span>
                <span className="font-mono text-white font-semibold">
                  {roomConfig.width}' × {roomConfig.length}' ({roomArea} sq. ft)
                </span>
              </div>

              <div className="h-6 w-px bg-slate-700/60" />

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Walkable Floor Space
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {walkablePercent}% open ({Math.round(roomArea - occupiedArea)} sq. ft)
                </span>
              </div>

              <div className="h-6 w-px bg-slate-700/60" />

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Items Placed
                </span>
                <span className="font-mono text-[#F5C242] font-semibold">
                  {placedItems.length} objects
                </span>
              </div>
            </div>

            {/* Quick 3D Interaction Tip */}
            <div className="pointer-events-auto bg-[#001D33]/85 backdrop-blur-md border border-[#1E3A5F] rounded-xl px-3 py-2 text-[11px] text-slate-300 shadow-xl flex items-center space-x-2">
              <span className="text-amber-400">💡</span>
              <span>
                <strong className="text-white">Left-click</strong> & drag items to move ·{' '}
                <strong className="text-white">Right-click</strong> to orbit room ·{' '}
                <strong className="text-white">Scroll</strong> to zoom
              </span>
            </div>
          </div>
        </div>
      </div>

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
