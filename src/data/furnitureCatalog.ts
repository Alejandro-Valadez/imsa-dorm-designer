import { FurnitureItemDefinition } from '../types';

export const FURNITURE_CATALOG: FurnitureItemDefinition[] = [
  // OFFICIAL IMSA ISSUED FURNITURE
  {
    id: 'imsa-bunk-bed',
    name: 'IMSA Bunk Bed Set (Stacked)',
    category: 'official',
    description: 'Two Twin XL frames safely stacked with safety guardrails and ladder. Default freshman setup.',
    width: 3.3, // ~40 inches
    depth: 7.0, // ~84 inches (Twin XL)
    height: 5.6, // ~67 inches
    isOfficialIMSA: true,
    defaultColor: '#1e3a5f',
    colorOptions: ['#1e3a5f', '#8B0000', '#2E4F4F', '#4A5568', '#6B46C1'],
    icon: '🛏️',
    meshType: 'bunk_bed',
    imsaRuleNote: 'Standard move-in configuration. Maximizes floor space for couches & desks.'
  },
  {
    id: 'imsa-single-bed',
    name: 'IMSA Twin XL Bed (Unbunked)',
    category: 'official',
    description: 'Single Twin XL spring bed frame and mattress. Standard sleeping height (approx 28").',
    width: 3.3,
    depth: 7.0,
    height: 2.8,
    isOfficialIMSA: true,
    defaultColor: '#2b4c7e',
    colorOptions: ['#2b4c7e', '#9B2C2C', '#276749', '#4A5568', '#44337A'],
    icon: '🛌',
    meshType: 'single_bed',
    imsaRuleNote: 'Unbunking requires Resident Counselor (RC) approval & proper locking pins.'
  },
  {
    id: 'imsa-captains-bed',
    name: 'IMSA Captain / High Loft Bed',
    category: 'official',
    description: 'Elevated single bed allowing standard IMSA 3-drawer dressers or desk underneath.',
    width: 3.3,
    depth: 7.0,
    height: 4.5,
    isOfficialIMSA: true,
    defaultColor: '#3182CE',
    colorOptions: ['#3182CE', '#E53E3E', '#38A169', '#718096', '#805AD5'],
    icon: '🪜',
    meshType: 'captains_bed',
    imsaRuleNote: 'High pin setting on official frame. DIY homemade lofts are strictly forbidden.'
  },
  {
    id: 'imsa-desk',
    name: 'IMSA Study Desk',
    category: 'official',
    description: 'Solid oak student desk (42" x 24" x 30") with right-hand utility drawers & wire grommet.',
    width: 3.5, // 42"
    depth: 2.0, // 24"
    height: 2.5, // 30"
    isOfficialIMSA: true,
    defaultColor: '#8C5E35',
    colorOptions: ['#8C5E35', '#A06D3B', '#5A3D28', '#2D3748'],
    icon: '🪵',
    meshType: 'desk',
    imsaRuleNote: 'Must touch a wall per Res Life safety regulations. Includes 2 keys or drawer locks.'
  },
  {
    id: 'imsa-chair',
    name: 'IMSA Desk Chair',
    category: 'official',
    description: 'Durable wooden desk chair designed to slide completely under the IMSA desk.',
    width: 1.6,
    depth: 1.6,
    height: 2.8,
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
    description: 'Modular chest of drawers. Can be placed standalone or nested underneath elevated beds.',
    width: 2.5, // 30"
    depth: 1.8, // 22"
    height: 2.5, // 30"
    isOfficialIMSA: true,
    defaultColor: '#8C5E35',
    colorOptions: ['#8C5E35', '#A06D3B', '#5A3D28'],
    icon: '🗄️',
    meshType: 'dresser',
    imsaRuleNote: 'Fits perfectly under Captain bed setting or alongside wardrobe.'
  },
  {
    id: 'imsa-wardrobe',
    name: 'IMSA 2-Door Wardrobe / Armoire',
    category: 'official',
    description: 'Tall wooden standing closet with coat hanging rod, interior top shelf, and bottom drawer.',
    width: 3.0,
    depth: 2.0,
    height: 6.0,
    isOfficialIMSA: true,
    defaultColor: '#7D512D',
    colorOptions: ['#7D512D', '#54361C'],
    icon: '🚪',
    meshType: 'wardrobe',
    imsaRuleNote: 'Standard in all 1501-1507 dorm rooms. Must not block doorway or thermostat.'
  },
  {
    id: 'imsa-trash-recycle',
    name: 'IMSA Waste & Recycling Duo',
    category: 'official',
    description: 'Standard black trash bin and blue IMSA recycling receptacle.',
    width: 1.8,
    depth: 1.0,
    height: 1.3,
    isOfficialIMSA: true,
    defaultColor: '#2563EB',
    colorOptions: ['#2563EB', '#1F2937'],
    icon: '🗑️',
    meshType: 'trash_duo'
  },

  // LOUNGE & COMFORT (STUDENT ADDITIONS)
  {
    id: 'dorm-futon',
    name: 'Compact Dorm Futon / Sofa',
    category: 'lounge',
    description: 'Foldable convertible sofa for socializing during wing check and weekend visits.',
    width: 5.5,
    depth: 2.8,
    height: 2.6,
    isOfficialIMSA: false,
    defaultColor: '#374151',
    colorOptions: ['#374151', '#1E3A8A', '#064E3B', '#4C1D95', '#9A3412'],
    icon: '🛋️',
    meshType: 'futon'
  },
  {
    id: 'beanbag-chair',
    name: 'Plush Floor Beanbag Chair',
    category: 'lounge',
    description: 'Comfortable oversized reading and gaming chair for relaxation between STEM problem sets.',
    width: 2.8,
    depth: 2.8,
    height: 2.2,
    isOfficialIMSA: false,
    defaultColor: '#0284C7',
    colorOptions: ['#0284C7', '#DC2626', '#16A34A', '#7C3AED', '#F59E0B'],
    icon: '🟣',
    meshType: 'beanbag'
  },
  {
    id: 'gaming-chair',
    name: 'Ergonomic Gaming / Rolling Chair',
    category: 'lounge',
    description: 'High-back ergonomic lumbar support chair with smooth caster wheels.',
    width: 2.2,
    depth: 2.2,
    height: 4.0,
    isOfficialIMSA: false,
    defaultColor: '#111827',
    colorOptions: ['#111827', '#DC2626', '#2563EB', '#059669'],
    icon: '💺',
    meshType: 'gaming_chair'
  },
  {
    id: 'dorm-rug-medium',
    name: 'Cozy Area Rug (5ft × 7ft)',
    category: 'lounge',
    description: 'Soft floor rug to cover the IMSA linoleum/tile floor for warmth and homey vibe.',
    width: 5.0,
    depth: 7.0,
    height: 0.05,
    isOfficialIMSA: false,
    defaultColor: '#E2E8F0',
    colorOptions: ['#E2E8F0', '#1E293B', '#78350F', '#1E3A8A', '#047857'],
    icon: '🧶',
    meshType: 'rug'
  },

  // TECH & STUDY SETUP
  {
    id: 'dual-monitor-setup',
    name: 'Dual Monitor & Laptop Station',
    category: 'tech',
    description: 'Twin 27" screens mounted with an open laptop, mechanical keyboard, and XXL desk mat.',
    width: 3.2,
    depth: 1.2,
    height: 1.8,
    isOfficialIMSA: false,
    defaultColor: '#18181B',
    icon: '🖥️',
    meshType: 'monitor_setup',
    allowElevation: true,
    imsaRuleNote: 'Must plug into a UL-approved surge protector strip (daisy chaining is prohibited).'
  },
  {
    id: 'desk-lamp',
    name: 'Architect LED Desk Lamp',
    category: 'tech',
    description: 'Adjustable swing-arm study light with warm LED color temperature.',
    width: 0.8,
    depth: 0.8,
    height: 1.6,
    isOfficialIMSA: false,
    defaultColor: '#000000',
    icon: '💡',
    meshType: 'desk_lamp',
    allowElevation: true
  },
  {
    id: 'whiteboard-easel',
    name: 'Standing Mobile Whiteboard',
    category: 'tech',
    description: 'Double-sided magnetic dry-erase board for late night calc and physics derivations.',
    width: 3.0,
    depth: 1.5,
    height: 5.2,
    isOfficialIMSA: false,
    defaultColor: '#FFFFFF',
    icon: '📋',
    meshType: 'whiteboard'
  },

  // APPLIANCES & STORAGE
  {
    id: 'dorm-microfridge',
    name: 'Mini-Fridge & Microwave Combo',
    category: 'storage',
    description: 'Compact 3.2 cu. ft. two-door refrigerator with top-mounted microwave.',
    width: 1.8,
    depth: 1.8,
    height: 4.2,
    isOfficialIMSA: false,
    defaultColor: '#1F2937',
    colorOptions: ['#1F2937', '#9CA3AF', '#FFFFFF'],
    icon: '🧊',
    meshType: 'microfridge',
    imsaRuleNote: 'Limit 1 per room or share with roommate. Maximum 1000W peak consumption.'
  },
  {
    id: 'rolling-cart',
    name: '3-Tier Rolling Utility Cart',
    category: 'storage',
    description: 'Narrow wire mesh cart for snacks, tea kettle, mugs, and shower toiletries.',
    width: 1.4,
    depth: 1.0,
    height: 2.8,
    isOfficialIMSA: false,
    defaultColor: '#F3F4F6',
    colorOptions: ['#F3F4F6', '#111827', '#0284C7', '#EC4899'],
    icon: '🛒',
    meshType: 'rolling_cart'
  },
  {
    id: 'bookshelf-unit',
    name: '3-Tier College Bookshelf',
    category: 'storage',
    description: 'Vertical wooden shelving unit for AP/STEM textbooks, board games, and binders.',
    width: 2.4,
    depth: 1.0,
    height: 3.8,
    isOfficialIMSA: false,
    defaultColor: '#8C5E35',
    colorOptions: ['#8C5E35', '#2D3748', '#FFFFFF'],
    icon: '📚',
    meshType: 'bookshelf'
  },
  {
    id: 'laundry-hamper',
    name: 'Foldable Laundry Hamper',
    category: 'storage',
    description: 'Fabric laundry bin with carry handles for trips to the hall basement washrooms.',
    width: 1.3,
    depth: 1.3,
    height: 2.2,
    isOfficialIMSA: false,
    defaultColor: '#4B5563',
    icon: '🧺',
    meshType: 'hamper'
  },
  {
    id: 'full-mirror',
    name: 'Full-Length Floor / Wall Mirror',
    category: 'storage',
    description: 'Dorm mirror with beveled frame for checking dress code and outfit.',
    width: 1.4,
    depth: 0.3,
    height: 4.8,
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
    description: 'Official Illinois Math and Science Academy blue & gold spirit banner.',
    width: 2.5,
    depth: 0.1,
    height: 1.4,
    isOfficialIMSA: false,
    defaultColor: '#002B49',
    icon: '🚩',
    meshType: 'wall_banner',
    allowElevation: true
  },
  {
    id: 'plant-stand',
    name: 'Potted Succulent / Plant Stand',
    category: 'decor',
    description: 'Low-maintenance snake plant or pothos in ceramic pot to brighten the room.',
    width: 1.0,
    depth: 1.0,
    height: 2.0,
    isOfficialIMSA: false,
    defaultColor: '#15803D',
    icon: '🪴',
    meshType: 'plant_stand'
  },
  {
    id: 'acoustic-guitar',
    name: 'Acoustic Guitar & Stand',
    category: 'decor',
    description: 'Guitar on floor stand for acoustic jams during hall weekend hours.',
    width: 1.4,
    depth: 1.2,
    height: 3.5,
    isOfficialIMSA: false,
    defaultColor: '#B45309',
    icon: '🎸',
    meshType: 'guitar'
  }
];

export const PRESET_LAYOUTS = [
  {
    id: 'preset-classic-bunked',
    name: 'IMSA Classic Bunked',
    description: 'Bunk beds against the left wall, dual desks side-by-side along the window, mini-fridge by the bathroom.',
    roomType: 'standard-double' as const,
    items: [
      { definitionId: 'imsa-bunk-bed', x: -4.0, z: -3.0, y: 0, rotationY: 0, color: '#1e3a5f', owner: 'Shared' },
      { definitionId: 'imsa-wardrobe', x: -4.2, z: 2.5, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: -4.2, z: 5.5, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident B' },
      { definitionId: 'imsa-desk', x: 1.8, z: -6.0, y: 0, rotationY: 180, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: 1.8, z: -4.6, y: 0, rotationY: 0, color: '#784E29', owner: 'Resident A' },
      { definitionId: 'imsa-desk', x: -1.8, z: -6.0, y: 0, rotationY: 180, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: -1.8, z: -4.6, y: 0, rotationY: 0, color: '#784E29', owner: 'Resident B' },
      { definitionId: 'imsa-dresser', x: 4.2, z: -3.0, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-dresser', x: 4.2, z: -0.5, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'dorm-futon', x: 4.0, z: 3.5, y: 0, rotationY: -90, color: '#374151', owner: 'Shared' },
      { definitionId: 'dorm-microfridge', x: 4.3, z: 6.2, y: 0, rotationY: -90, color: '#1F2937', owner: 'Shared' },
      { definitionId: 'dorm-rug-medium', x: 0, z: 0.5, y: 0, rotationY: 0, color: '#1E293B', owner: 'Shared' },
      { definitionId: 'imsa-trash-recycle', x: 2.0, z: 6.8, y: 0, rotationY: 0, color: '#2563EB', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-symmetric-split',
    name: 'Symmetric Split (Twin Twins)',
    description: 'Unbunked beds on opposite sides for maximum personal privacy. Desks facing the center or window.',
    roomType: 'standard-double' as const,
    items: [
      { definitionId: 'imsa-single-bed', x: -4.2, z: -2.8, y: 0, rotationY: 0, color: '#2b4c7e', owner: 'Resident A' },
      { definitionId: 'imsa-single-bed', x: 4.2, z: -2.8, y: 0, rotationY: 0, color: '#9B2C2C', owner: 'Resident B' },
      { definitionId: 'imsa-desk', x: -4.0, z: 3.2, y: 0, rotationY: 90, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: -2.6, z: 3.2, y: 0, rotationY: 90, color: '#784E29', owner: 'Resident A' },
      { definitionId: 'imsa-desk', x: 4.0, z: 3.2, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 2.6, z: 3.2, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      { definitionId: 'imsa-wardrobe', x: -4.2, z: 5.8, y: 0, rotationY: 90, color: '#7D512D', owner: 'Resident A' },
      { definitionId: 'imsa-wardrobe', x: 4.2, z: 5.8, y: 0, rotationY: -90, color: '#7D512D', owner: 'Resident B' },
      { definitionId: 'dorm-microfridge', x: 0, z: -6.0, y: 0, rotationY: 180, color: '#1F2937', owner: 'Shared' },
      { definitionId: 'dorm-rug-medium', x: 0, z: 0.5, y: 0, rotationY: 0, color: '#E2E8F0', owner: 'Shared' }
    ]
  },
  {
    id: 'preset-l-shape-lounge',
    name: 'L-Shape & Lounge Corner',
    description: 'Beds arranged in an L-formation corner, opening up the other half of the room for beanbags and entertainment.',
    roomType: 'standard-double' as const,
    items: [
      { definitionId: 'imsa-single-bed', x: -4.2, z: -3.0, y: 0, rotationY: 0, color: '#2E4F4F', owner: 'Resident A' },
      { definitionId: 'imsa-single-bed', x: -1.0, z: -6.2, y: 0, rotationY: 90, color: '#4A5568', owner: 'Resident B' },
      { definitionId: 'imsa-desk', x: 4.0, z: -4.0, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident A' },
      { definitionId: 'imsa-chair', x: 2.6, z: -4.0, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident A' },
      { definitionId: 'imsa-desk', x: 4.0, z: -0.5, y: 0, rotationY: -90, color: '#8C5E35', owner: 'Resident B' },
      { definitionId: 'imsa-chair', x: 2.6, z: -0.5, y: 0, rotationY: -90, color: '#784E29', owner: 'Resident B' },
      { definitionId: 'beanbag-chair', x: -2.5, z: 2.5, y: 0, rotationY: 45, color: '#0284C7', owner: 'Resident A' },
      { definitionId: 'beanbag-chair', x: 0.5, z: 3.5, y: 0, rotationY: -30, color: '#F59E0B', owner: 'Resident B' },
      { definitionId: 'dorm-microfridge', x: 4.2, z: 5.5, y: 0, rotationY: -90, color: '#1F2937', owner: 'Shared' },
      { definitionId: 'dorm-rug-medium', x: -0.5, z: 2.0, y: 0, rotationY: 90, color: '#78350F', owner: 'Shared' }
    ]
  }
];
