import { FurnitureItemDefinition } from '../types';

export const FURNITURE_CATALOG: FurnitureItemDefinition[] = [
  // OFFICIAL IMSA ISSUED FURNITURE
  {
    id: 'imsa-bunk-bed',
    name: 'IMSA Bunk Bed Set (Stacked)',
    category: 'official',
    description: 'Official Twin XL wooden/steel bunkable bed frames stacked with guardrails & ladder. Standard freshman move-in configuration.',
    width: 3.33, // 40"
    depth: 7.08, // 85" (Twin XL frame footprint: 40" x 85")
    height: 5.67, // 68"
    widthInches: 40,
    depthInches: 85,
    heightInches: 68,
    isOfficialIMSA: true,
    defaultColor: '#1e3a5f',
    colorOptions: ['#1e3a5f', '#8B0000', '#2E4F4F', '#4A5568', '#6B46C1'],
    icon: '🛌',
    meshType: 'bunk_bed',
    imsaRuleNote: 'Handbook p.51: Must be placed against a wall. Do not dismantle frames.'
  },
  {
    id: 'imsa-single-bed',
    name: 'IMSA Twin XL Bed (Unbunked)',
    category: 'official',
    description: 'Official Twin XL single bed frame (40" W × 85" L × 34" H with 38" × 80" mattress). Adjustable spring notch frame.',
    width: 3.33, // 40"
    depth: 7.08, // 85"
    height: 2.83, // 34"
    widthInches: 40,
    depthInches: 85,
    heightInches: 34,
    isOfficialIMSA: true,
    defaultColor: '#2b4c7e',
    colorOptions: ['#2b4c7e', '#9B2C2C', '#276749', '#4A5568', '#44337A'],
    icon: '🛏️',
    meshType: 'single_bed',
    imsaRuleNote: 'Handbook p.51: Long side must touch a wall. Mattress cannot be placed directly on floor.'
  },
  {
    id: 'imsa-captains-bed',
    name: 'IMSA Lofted Bed (Underbed Clearance)',
    category: 'official',
    description: 'Official bed set to high notch frame setting (~30" underbed clearance). Fits IMSA 3-drawer dresser directly underneath.',
    width: 3.33,
    depth: 7.08,
    height: 4.5,
    widthInches: 40,
    depthInches: 85,
    heightInches: 54,
    isOfficialIMSA: true,
    defaultColor: '#3182CE',
    colorOptions: ['#3182CE', '#E53E3E', '#38A169', '#718096', '#805AD5'],
    icon: '🪜',
    meshType: 'captains_bed',
    imsaRuleNote: 'Official frame pins only. Handbook p.51: DIY homemade lofts are strictly forbidden.'
  },
  {
    id: 'imsa-desk',
    name: 'IMSA Study Desk',
    category: 'official',
    description: 'Official solid oak student desk (42" W × 24" D × 30" H) with 3 utility drawers and modesty panel.',
    width: 3.5, // 42"
    depth: 2.0, // 24"
    height: 2.5, // 30"
    widthInches: 42,
    depthInches: 24,
    heightInches: 30,
    isOfficialIMSA: true,
    defaultColor: '#8C5E35',
    colorOptions: ['#8C5E35', '#A06D3B', '#5A3D28', '#2D3748'],
    icon: '🪵',
    meshType: 'desk',
    imsaRuleNote: 'Handbook p.51: Must touch at least one wall. 2 desks issued per double room.'
  },
  {
    id: 'imsa-chair',
    name: 'IMSA Desk Chair',
    category: 'official',
    description: 'Durable solid wood student desk chair (19" W × 19" D × 34" H) issued with each desk.',
    width: 1.58, // 19"
    depth: 1.58, // 19"
    height: 2.83, // 34"
    widthInches: 19,
    depthInches: 19,
    heightInches: 34,
    isOfficialIMSA: true,
    defaultColor: '#784E29',
    colorOptions: ['#784E29', '#374151', '#1E3A8A', '#991B1B'],
    icon: '🪑',
    meshType: 'chair'
  },
  {
    id: 'imsa-dresser',
    name: 'IMSA 3-Drawer Dresser',
    category: 'official',
    description: 'Official 3-drawer wooden chest (30" W × 24" D × 30" H). Slides neatly under unbunked bed or stands against wall.',
    width: 2.5, // 30"
    depth: 2.0, // 24"
    height: 2.5, // 30"
    widthInches: 30,
    depthInches: 24,
    heightInches: 30,
    isOfficialIMSA: true,
    defaultColor: '#8C5E35',
    colorOptions: ['#8C5E35', '#A06D3B', '#5A3D28'],
    icon: '🗄️',
    meshType: 'dresser',
    imsaRuleNote: 'Fits under bed in loft position or next to wardrobe against wall.'
  },
  {
    id: 'imsa-wardrobe',
    name: 'IMSA 2-Door Wardrobe / Armoire',
    category: 'official',
    description: 'Official free-standing wardrobe (36" W × 24" D × 72" H) with hanging rod, upper shelf, and padlock latch.',
    width: 3.0, // 36"
    depth: 2.0, // 24"
    height: 6.0, // 72"
    widthInches: 36,
    depthInches: 24,
    heightInches: 72,
    isOfficialIMSA: true,
    defaultColor: '#7D512D',
    colorOptions: ['#7D512D', '#54361C'],
    icon: '🚪',
    meshType: 'wardrobe',
    imsaRuleNote: 'Handbook p.51: Must be placed against a wall. Bring your own padlock.'
  },
  {
    id: 'imsa-trash-recycle',
    name: 'IMSA Waste & Recycling Bins',
    category: 'official',
    description: 'Pair of official black trash can and blue IMSA recycling can (each ~12" × 14" × 16" H).',
    width: 2.0,
    depth: 1.17,
    height: 1.33,
    widthInches: 24,
    depthInches: 14,
    heightInches: 16,
    isOfficialIMSA: true,
    defaultColor: '#2563EB',
    colorOptions: ['#2563EB', '#1F2937'],
    icon: '🗑️',
    meshType: 'trash_duo'
  },

  // LOUNGE & COMFORT (STUDENT ADDITIONS)
  {
    id: 'dorm-rug-medium',
    name: 'Area Rug (5ft × 7ft)',
    category: 'lounge',
    description: 'The standard recommended area rug (60" × 84") that fits cleanly between IMSA unbunked beds and desks.',
    width: 5.0,
    depth: 7.0,
    height: 0.05,
    widthInches: 60,
    depthInches: 84,
    heightInches: 1,
    isOfficialIMSA: false,
    defaultColor: '#E2E8F0',
    colorOptions: ['#E2E8F0', '#1E293B', '#78350F', '#1E3A8A', '#047857'],
    icon: '🧶',
    meshType: 'rug'
  },
  {
    id: 'dorm-rug-runner',
    name: 'Runner Rug (2.5ft × 8ft)',
    category: 'lounge',
    description: 'Narrow runner rug (30" × 96") designed for the central walkway between beds in a Symmetric Split layout.',
    width: 2.5,
    depth: 8.0,
    height: 0.05,
    widthInches: 30,
    depthInches: 96,
    heightInches: 1,
    isOfficialIMSA: false,
    defaultColor: '#1E293B',
    colorOptions: ['#1E293B', '#E2E8F0', '#78350F', '#047857'],
    icon: '🧣',
    meshType: 'rug'
  },
  {
    id: 'gaming-chair',
    name: 'Approved Rolling Desk Chair',
    category: 'lounge',
    description: 'Ergonomic task chair with caster wheels (Handbook p.52: Rolling desk chairs are explicitly allowed with RC approval).',
    width: 2.08, // 25"
    depth: 2.08, // 25"
    height: 3.5, // 42"
    widthInches: 25,
    depthInches: 25,
    heightInches: 42,
    isOfficialIMSA: false,
    defaultColor: '#111827',
    colorOptions: ['#111827', '#DC2626', '#2563EB', '#059669'],
    icon: '💺',
    meshType: 'gaming_chair',
    imsaRuleNote: 'Handbook p.52: Allowed in dorm rooms with RC approval.'
  },
  {
    id: 'beanbag-chair',
    name: 'Floor Beanbag Lounger',
    category: 'lounge',
    description: 'Comfortable soft floor cushion (32" × 32" × 24" H) for studying or reading.',
    width: 2.67, // 32"
    depth: 2.67, // 32"
    height: 2.0, // 24"
    widthInches: 32,
    depthInches: 32,
    heightInches: 24,
    isOfficialIMSA: false,
    defaultColor: '#0284C7',
    colorOptions: ['#0284C7', '#DC2626', '#16A34A', '#7C3AED', '#F59E0B'],
    icon: '🟣',
    meshType: 'beanbag'
  },
  {
    id: 'dorm-futon',
    name: 'Convertible Futon / Sofa (Restricted)',
    category: 'lounge',
    description: 'Convertible sofa (66" × 32" × 30"). Note: Outside sofas/futons require strict special RC exemption.',
    width: 5.5,
    depth: 2.67,
    height: 2.5,
    widthInches: 66,
    depthInches: 32,
    heightInches: 30,
    isOfficialIMSA: false,
    defaultColor: '#374151',
    colorOptions: ['#374151', '#1E3A8A', '#064E3B', '#4C1D95', '#9A3412'],
    icon: '🛋️',
    meshType: 'futon',
    imsaRuleNote: 'Handbook p.52: Outside couches/futons generally prohibited without formal RC exception.'
  },

  // TECH & STUDY SETUP
  {
    id: 'dual-monitor-setup',
    name: 'Desk Monitor & Laptop Setup',
    category: 'tech',
    description: 'Desktop setup with external display (Handbook: 22"-27" screen standard), keyboard, and study laptop.',
    width: 2.83, // 34"
    depth: 1.17, // 14"
    height: 1.5, // 18"
    widthInches: 34,
    depthInches: 14,
    heightInches: 18,
    isOfficialIMSA: false,
    defaultColor: '#18181B',
    icon: '🖥️',
    meshType: 'monitor_setup',
    allowElevation: true,
    imsaRuleNote: 'Handbook p.52: 22" monitor guideline. Daisy-chaining power strips prohibited.'
  },
  {
    id: 'desk-lamp',
    name: 'LED Architect Desk Lamp',
    category: 'tech',
    description: 'UL-approved LED study lamp (Handbook: Halogen lamps and multi-head lamps are strictly prohibited for fire safety).',
    width: 0.83,
    depth: 0.83,
    height: 1.5,
    widthInches: 10,
    depthInches: 10,
    heightInches: 18,
    isOfficialIMSA: false,
    defaultColor: '#000000',
    icon: '💡',
    meshType: 'desk_lamp',
    allowElevation: true,
    imsaRuleNote: 'Handbook p.52: LED only. Halogen lamps and open bulbs are strictly forbidden.'
  },
  {
    id: 'whiteboard-easel',
    name: 'Standing Whiteboard Easel',
    category: 'tech',
    description: 'Double-sided dry-erase board (32" W × 18" D × 60" H) for physics problem sets and study sessions.',
    width: 2.67,
    depth: 1.5,
    height: 5.0,
    widthInches: 32,
    depthInches: 18,
    heightInches: 60,
    isOfficialIMSA: false,
    defaultColor: '#FFFFFF',
    icon: '📋',
    meshType: 'whiteboard'
  },

  // APPLIANCES & STORAGE
  {
    id: 'dorm-microfridge',
    name: 'Compact Refrigerator (≤ 4.3 cu. ft.)',
    category: 'storage',
    description: 'Handbook compliant mini-fridge (20" W × 20" D × 34" H). Maximum 4.3 cu. ft. permitted per room; limit 1 per room.',
    width: 1.67, // 20"
    depth: 1.67, // 20"
    height: 2.83, // 34"
    widthInches: 20,
    depthInches: 20,
    heightInches: 34,
    isOfficialIMSA: false,
    defaultColor: '#1F2937',
    colorOptions: ['#1F2937', '#9CA3AF', '#FFFFFF'],
    icon: '🧊',
    meshType: 'microfridge',
    imsaRuleNote: 'Handbook p.52: Max 4.3 cubic feet. 1 refrigerator per room. Personal microwaves & air fryers banned.'
  },
  {
    id: 'bookshelf-unit',
    name: 'IMSA Compliant Bookshelf (3ft × 3ft)',
    category: 'storage',
    description: 'Wooden bookshelf (36" W × 12" D × 36" H). Exactly complies with Handbook rule: "no larger than 3 feet by 3 feet".',
    width: 3.0, // 36" (3 ft)
    depth: 1.0, // 12" (1 ft)
    height: 3.0, // 36" (3 ft)
    widthInches: 36,
    depthInches: 12,
    heightInches: 36,
    isOfficialIMSA: false,
    defaultColor: '#8C5E35',
    colorOptions: ['#8C5E35', '#2D3748', '#FFFFFF'],
    icon: '📚',
    meshType: 'bookshelf',
    imsaRuleNote: 'Handbook p.52: Must be no larger than 3 feet by 3 feet. Requires RC approval.'
  },
  {
    id: 'rolling-cart',
    name: '3-Tier Rolling Utility Cart',
    category: 'storage',
    description: 'Narrow wire mesh cart (17" W × 13" D × 33" H) for toiletries, shower caddy, and study snacks.',
    width: 1.42,
    depth: 1.08,
    height: 2.75,
    widthInches: 17,
    depthInches: 13,
    heightInches: 33,
    isOfficialIMSA: false,
    defaultColor: '#F3F4F6',
    colorOptions: ['#F3F4F6', '#111827', '#0284C7', '#EC4899'],
    icon: '🛒',
    meshType: 'rolling_cart'
  },
  {
    id: 'laundry-hamper',
    name: 'Foldable Laundry Hamper',
    category: 'storage',
    description: 'Fabric laundry basket (15" × 15" × 26" H) for trips to hall basement laundry machines.',
    width: 1.25,
    depth: 1.25,
    height: 2.17,
    widthInches: 15,
    depthInches: 15,
    heightInches: 26,
    isOfficialIMSA: false,
    defaultColor: '#4B5563',
    icon: '🧺',
    meshType: 'hamper'
  },
  {
    id: 'full-mirror',
    name: 'Over-The-Door / Wall Mirror',
    category: 'storage',
    description: 'Full-length mirror (16" W × 2" D × 50" H). Must be hung without damaging wall paint.',
    width: 1.33,
    depth: 0.25,
    height: 4.17,
    widthInches: 16,
    depthInches: 3,
    heightInches: 50,
    isOfficialIMSA: false,
    defaultColor: '#1F2937',
    icon: '🪞',
    meshType: 'full_mirror'
  },

  // DECOR & SPIRIT
  {
    id: 'imsa-banner',
    name: 'IMSA Titans Wall Pennant',
    category: 'decor',
    description: 'Official Illinois Math and Science Academy blue & gold spirit banner (painter tape or pushpins only).',
    width: 2.5,
    depth: 0.1,
    height: 1.4,
    widthInches: 30,
    depthInches: 1,
    heightInches: 17,
    isOfficialIMSA: false,
    defaultColor: '#002B49',
    icon: '🚩',
    meshType: 'wall_banner',
    allowElevation: true,
    imsaRuleNote: 'Handbook p.51: Hang with painter tape or pushpins only. No adhesive strips that peel paint.'
  },
  {
    id: 'plant-stand',
    name: 'Potted Succulent / Plant Stand',
    category: 'decor',
    description: 'Low-maintenance dorm plant (12" × 12" × 24" H) to brighten up the room windowsill.',
    width: 1.0,
    depth: 1.0,
    height: 2.0,
    widthInches: 12,
    depthInches: 12,
    heightInches: 24,
    isOfficialIMSA: false,
    defaultColor: '#15803D',
    icon: '🪴',
    meshType: 'plant_stand'
  },
  {
    id: 'acoustic-guitar',
    name: 'Acoustic Guitar & Stand',
    category: 'decor',
    description: 'Guitar on floor stand (18" × 16" × 42" H) for downtime during hall weekend hours.',
    width: 1.5,
    depth: 1.33,
    height: 3.5,
    widthInches: 18,
    depthInches: 16,
    heightInches: 42,
    isOfficialIMSA: false,
    defaultColor: '#B45309',
    icon: '🎸',
    meshType: 'guitar'
  }
];

// PRESET LAYOUTS - Accurately planned for 11'8" x 15'0" IMSA Double Room with Corner Window & AC
export const PRESET_LAYOUTS = [
  {
    id: 'preset-window-workstations',
    name: '☀️ Sunny Corner Window Setup (Desks by Window & AC)',
    description: 'Positions the primary study desk next to the corner window to catch maximum natural daylight. Twin XL beds against West and East walls with wardrobes near the entryway.',
    roomType: 'standard-double' as const,
    items: [
      // Bed A along West wall (x = -4.1, z = 0.8)
      { definitionId: 'imsa-single-bed', x: -4.1, z: 0.8, y: 0, rotationY: 0, color: '#1e3a5f', owner: 'Resident A' },
      // Bed B along East wall (x = 4.1, z = 0.8)
      { definitionId: 'imsa-single-bed', x: 4.1, z: 0.8, y: 0, rotationY: 0, color: '#8B0000', owner: 'Resident B' },
      // Desk A at North wall near corner window (x = -1.2, z = -6.2, facing window)
      { definitionId: 'imsa-desk', x: -1.2, z: -6.2, y: 0, rotationY: 180, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: -1.2, z: -4.9, y: 0, rotationY: 0, color: '#784E29', owner: 'Resident A' },
      // Desk B along East wall (x = 4.8, z = -5.0, facing wall)
      { definitionId: 'imsa-desk', x: 4.8, z: -5.0, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 3.4, z: -5.0, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      // Wardrobe A against West wall near door
      { definitionId: 'imsa-wardrobe', x: -4.8, z: 5.8, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      // Wardrobe B against East wall near door
      { definitionId: 'imsa-wardrobe', x: 4.8, z: 5.8, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      // Central runner rug
      { definitionId: 'dorm-rug-runner', x: 0, z: 0.5, y: 0, rotationY: 0, color: '#1E293B', owner: 'Shared' },
      // Mini-fridge
      { definitionId: 'dorm-microfridge', x: 2.2, z: -6.4, y: 0, rotationY: 180, color: '#1F2937', owner: 'Shared' },
      // Corner windowsill plant
      { definitionId: 'plant-stand', x: -4.8, z: -6.5, y: 0, rotationY: 0, color: '#15803D', owner: 'Shared' },
      // Waste cans near entry
      { definitionId: 'imsa-trash-recycle', x: 1.8, z: 6.8, y: 0, rotationY: 0, color: '#2563EB', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-classic-bunked',
    name: '🛌 Classic Bunked (Maximum Floor Space)',
    description: 'Bunk beds stacked against the West wall. Study desk by the corner window. Wardrobes against the East wall. Leaves a huge open center floor area for rugs and socializing.',
    roomType: 'standard-double' as const,
    items: [
      // Stacked bunk beds on West wall
      { definitionId: 'imsa-bunk-bed', x: -4.1, z: 0.2, y: 0, rotationY: 0, color: '#1e3a5f', owner: 'Shared' },
      // Desk A at North wall facing out (x = -1.2, z = -6.2)
      { definitionId: 'imsa-desk', x: -1.2, z: -6.2, y: 0, rotationY: 180, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: -1.2, z: -4.9, y: 0, rotationY: 0, color: '#784E29', owner: 'Resident A' },
      // Desk B along East wall
      { definitionId: 'imsa-desk', x: 4.8, z: -5.0, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 3.4, z: -5.0, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      // Wardrobes against East wall
      { definitionId: 'imsa-wardrobe', x: 4.8, z: -1.5, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: 4.8, z: 1.8, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      // Mini-fridge against West wall near door
      { definitionId: 'dorm-microfridge', x: -4.8, z: 5.5, y: 0, rotationY: 90, color: '#1F2937', owner: 'Shared' },
      // 3x3 Bookshelf
      { definitionId: 'bookshelf-unit', x: 2.2, z: -6.4, y: 0, rotationY: 180, color: '#8C5E35', owner: 'Shared' },
      // 5x7 Cozy Area Rug in the wide-open center
      { definitionId: 'dorm-rug-medium', x: 0, z: 0.5, y: 0, rotationY: 0, color: '#1E293B', owner: 'Shared' },
      // Waste duo near entry
      { definitionId: 'imsa-trash-recycle', x: 1.5, z: 6.8, y: 0, rotationY: 0, color: '#2563EB', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-window-lounge',
    name: '🪴 Corner Window Lounge & Reading Nook',
    description: 'Stacked bunk beds on the West wall and workstations along the East wall. Leaves the corner window zone completely open as a sunny lounge with beanbag seating, rug, and plant.',
    roomType: 'standard-double' as const,
    items: [
      // Stacked bunk beds on West wall
      { definitionId: 'imsa-bunk-bed', x: -4.1, z: 1.5, y: 0, rotationY: 0, color: '#2E4F4F', owner: 'Shared' },
      // Desks along East wall
      { definitionId: 'imsa-desk', x: 4.8, z: -0.5, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: 3.4, z: -0.5, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident A' },
      { definitionId: 'imsa-desk', x: 4.8, z: 3.2, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 3.4, z: 3.2, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      // Wardrobes against West wall near door
      { definitionId: 'imsa-wardrobe', x: -4.8, z: 5.8, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: 4.8, z: 6.2, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      // Sunny Corner Window Lounge Nook
      { definitionId: 'dorm-rug-medium', x: 0, z: -4.5, y: 0, rotationY: 0, color: '#047857', owner: 'Shared' },
      { definitionId: 'beanbag-chair', x: -1.5, z: -5.0, y: 0, rotationY: 45, color: '#0284C7', owner: 'Resident A' },
      { definitionId: 'beanbag-chair', x: 1.8, z: -5.0, y: 0, rotationY: -45, color: '#F59E0B', owner: 'Resident B' },
      { definitionId: 'plant-stand', x: 4.8, z: -6.4, y: 0, rotationY: 0, color: '#15803D', owner: 'Shared' },
      { definitionId: 'dorm-microfridge', x: 2.2, z: -6.4, y: 0, rotationY: 180, color: '#1F2937', owner: 'Shared' },
      { definitionId: 'imsa-trash-recycle', x: 1.8, z: 6.8, y: 0, rotationY: 0, color: '#2563EB', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-symmetric-split',
    name: '↔️ Symmetric Split (Open Window Path)',
    description: 'Unbunked Twin XL beds with long sides against opposite walls (West & East). Study desks facing inwards. Creates a wide, clear walking aisle straight from the hallway door to the window.',
    roomType: 'standard-double' as const,
    items: [
      // Bed A on West wall
      { definitionId: 'imsa-single-bed', x: -4.1, z: -2.0, y: 0, rotationY: 0, color: '#2b4c7e', owner: 'Resident A' },
      // Bed B on East wall
      { definitionId: 'imsa-single-bed', x: 4.1, z: -2.0, y: 0, rotationY: 0, color: '#9B2C2C', owner: 'Resident B' },
      // Desk A against West wall forward of bed
      { definitionId: 'imsa-desk', x: -4.8, z: 2.5, y: 0, rotationY: 90, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: -3.4, z: 2.5, y: 0, rotationY: 90, color: '#784E29', owner: 'Resident A' },
      // Desk B against East wall forward of bed
      { definitionId: 'imsa-desk', x: 4.8, z: 2.5, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 3.4, z: 2.5, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      // Wardrobes against West & East walls near entrance
      { definitionId: 'imsa-wardrobe', x: -4.8, z: 5.8, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: 4.8, z: 5.8, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      // Center runner rug
      { definitionId: 'dorm-rug-runner', x: 0, z: 0.5, y: 0, rotationY: 0, color: '#1E293B', owner: 'Shared' },
      // Mini-fridge
      { definitionId: 'dorm-microfridge', x: 2.2, z: -6.4, y: 0, rotationY: 180, color: '#1F2937', owner: 'Shared' },
      { definitionId: 'imsa-trash-recycle', x: 1.8, z: 6.8, y: 0, rotationY: 0, color: '#2563EB', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-captains-storage',
    name: '🪜 Captain’s Lofted Storage (With Dressers)',
    description: 'Elevated Captain’s bed frames with IMSA 3-drawer dressers nested underneath. Desks placed by the window with wardrobes against the entrance.',
    roomType: 'standard-double' as const,
    items: [
      // Bed A elevated on West wall
      { definitionId: 'imsa-captains-bed', x: -4.1, z: 0.2, y: 0, rotationY: 0, color: '#3182CE', owner: 'Resident A' },
      // Bed B elevated on East wall
      { definitionId: 'imsa-captains-bed', x: 4.1, z: 0.2, y: 0, rotationY: 0, color: '#E53E3E', owner: 'Resident B' },
      // Dressers tucked under captain beds
      { definitionId: 'imsa-dresser', x: -4.1, z: 0.2, y: 0, rotationY: 0, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-dresser', x: 4.1, z: 0.2, y: 0, rotationY: 0, color: '#8C5E35', owner: 'Resident B' },
      // Desk A at North window
      { definitionId: 'imsa-desk', x: -1.2, z: -6.2, y: 0, rotationY: 180, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: -1.2, z: -4.9, y: 0, rotationY: 0, color: '#784E29', owner: 'Resident A' },
      // Desk B along East wall
      { definitionId: 'imsa-desk', x: 4.8, z: -5.0, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 3.4, z: -5.0, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      // Wardrobes
      { definitionId: 'imsa-wardrobe', x: -4.8, z: 5.8, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: 4.8, z: 5.8, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      // Rug
      { definitionId: 'dorm-rug-medium', x: 0, z: 0.5, y: 0, rotationY: 0, color: '#1E293B', owner: 'Shared' },
      { definitionId: 'imsa-trash-recycle', x: 1.8, z: 6.8, y: 0, rotationY: 0, color: '#2563EB', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-l-shape-lounge',
    name: '📐 L-Shape Corner Beds',
    description: 'Beds arranged along adjacent West and North walls in an L-configuration. Leaves the East wall wide open for study workstations.',
    roomType: 'standard-double' as const,
    items: [
      { definitionId: 'imsa-single-bed', x: -4.1, z: 0.5, y: 0, rotationY: 0, color: '#2E4F4F', owner: 'Resident A' },
      { definitionId: 'imsa-single-bed', x: 1.5, z: -6.2, y: 0, rotationY: 90, color: '#4A5568', owner: 'Resident B' },
      { definitionId: 'imsa-desk', x: 4.8, z: -2.5, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: 3.4, z: -2.5, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident A' },
      { definitionId: 'imsa-desk', x: 4.8, z: 1.5, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 3.4, z: 1.5, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      { definitionId: 'imsa-wardrobe', x: -4.8, z: 5.0, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: 4.8, z: 6.2, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      { definitionId: 'beanbag-chair', x: -1.5, z: 2.5, y: 0, rotationY: 45, color: '#0284C7', owner: 'Resident A' },
      { definitionId: 'dorm-microfridge', x: 2.0, z: 5.8, y: 0, rotationY: 0, color: '#1F2937', owner: 'Shared' },
      { definitionId: 'dorm-rug-medium', x: -0.5, z: 2.0, y: 0, rotationY: 0, color: '#78350F', owner: 'Shared' }
    ]
  }
];
