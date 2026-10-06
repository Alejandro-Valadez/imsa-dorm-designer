export type FurnitureCategory = 'official' | 'lounge' | 'tech' | 'storage' | 'decor';

export interface FurnitureItemDefinition {
  id: string;
  name: string;
  category: FurnitureCategory;
  description: string;
  width: number; // in feet (X axis)
  depth: number; // in feet (Z axis)
  height: number; // in feet (Y axis)
  isOfficialIMSA: boolean;
  defaultColor: string;
  colorOptions?: string[];
  icon: string;
  meshType: string;
  maxRecommended?: number;
  imsaRuleNote?: string;
  allowElevation?: boolean;
}

export interface PlacedItem {
  instanceId: string;
  definitionId: string;
  x: number; // position on floor in feet
  z: number; // position on floor in feet
  y: number; // elevation above floor in feet
  rotationY: number; // rotation in degrees (0, 90, 180, 270 or continuous)
  color: string;
  owner?: 'Resident A' | 'Resident B' | 'Shared';
  notes?: string;
}

export type RoomType = 'standard-double' | 'corner-l-room' | 'quad-suite' | 'custom';

export interface RoomConfig {
  type: RoomType;
  name: string;
  width: number; // feet (X)
  length: number; // feet (Z)
  ceilingHeight: number; // feet (Y)
  bathroomPosition: 'left-entry' | 'right-entry' | 'none';
  hasQuadDoor: boolean;
  windowWall: 'north' | 'south' | 'east' | 'west';
  hallNumber: string;
  wing: string;
  roomNumber: string;
}

export type CameraViewMode = 'orbit-3d' | 'top-down-2d' | 'isometric' | 'eye-level';
export type LightingMode = 'day' | 'golden' | 'night-study';

export interface RuleCheckResult {
  ruleId: string;
  title: string;
  status: 'pass' | 'warning' | 'info';
  message: string;
}
