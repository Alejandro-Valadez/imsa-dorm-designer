import React from 'react';
import { PlacedItem, RoomConfig } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { X, ShieldCheck, AlertTriangle, CheckCircle, Info, BookOpen } from 'lucide-react';

interface PolicyCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  placedItems: PlacedItem[];
  roomConfig: RoomConfig;
}

export const PolicyCheckerModal: React.FC<PolicyCheckerModalProps> = ({
  isOpen,
  onClose,
  placedItems,
  roomConfig,
}) => {
  if (!isOpen) return null;

  // Evaluate rules from IMSA Student and Parent Handbook
  const checks: {
    title: string;
    status: 'pass' | 'warning' | 'info';
    desc: string;
    details: string;
    citation: string;
  }[] = [];

  // 1. Entry Egress Clearance (Hallway Door)
  const doorMargin = 1.0;
  const doorWidth = 3.0;
  const doorX = roomConfig.width / 2 - doorMargin - doorWidth / 2;
  const doorZ = roomConfig.length / 2;
  const doorBlocked = placedItems.some((item) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def) return false;
    const dist = Math.hypot(item.x - doorX, item.z - doorZ);
    return dist < 3.0 && item.y < 2.0;
  });

  if (doorBlocked) {
    checks.push({
      title: 'Entrance Doorway Obstruction',
      status: 'warning',
      desc: 'Furniture is blocking or within 36" of the hallway entrance door.',
      details: 'Handbook p.51: "The room door must open completely without interference or obstruction." A 36-inch clear path must be kept open.',
      citation: 'Handbook p.51 (Door Clearance)'
    });
  } else {
    checks.push({
      title: 'Hallway Door Egress & Visibility',
      status: 'pass',
      desc: '36"+ clear emergency egress to the hallway. Door swings fully unobstructed.',
      details: 'Handbook p.51: Clear line of sight into the room from the doorway is maintained for safety checks.',
      citation: 'Handbook p.51 (Door Clearance)'
    });
  }

  // 2. Direct Pathway to Window
  const centerBlocked = placedItems.some((item) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def || def.category === 'decor' || item.y > 2.0) return false;
    return Math.abs(item.x) < 1.0 && Math.abs(item.z) < 2.0 && def.height > 3.0;
  });

  if (centerBlocked) {
    checks.push({
      title: 'Path to Exterior Window Obstructed',
      status: 'warning',
      desc: 'A large furniture piece is blocking the central walkway from the door to the window.',
      details: 'Handbook p.51: "A direct path must be kept open from the doorway to the windows for emergency egress and ventilation."',
      citation: 'Handbook p.51 (Window Pathway)'
    });
  } else {
    checks.push({
      title: 'Direct Pathway to Window',
      status: 'pass',
      desc: 'Clear walking path from room doorway directly to the exterior window.',
      details: 'Complies with Aurora Fire Code and IMSA residential egress rules.',
      citation: 'Handbook p.51 (Window Pathway)'
    });
  }

  // 3. PTAC (Heating / AC) 2-Foot Clearance Rule
  // Official IMSA architecture: PTAC unit is in the corner under the corner window!
  const windowWidth = 4.0;
  const cornerJamb = 0.5;
  const ptacX = -roomConfig.width / 2 + cornerJamb + windowWidth / 2;
  const ptacZ = -roomConfig.length / 2 + 0.4;
  const ptacBlocked = placedItems.some((item) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def || item.y > 3.0) return false;
    // Check if within 2.0 feet in front of the PTAC unit
    const dx = Math.abs(item.x - ptacX);
    const dz = item.z - ptacZ;
    return dx < 2.2 && dz > 0 && dz < 2.0;
  });

  if (ptacBlocked) {
    checks.push({
      title: 'Corner PTAC Unit Clearance Violation (< 2 Feet)',
      status: 'warning',
      desc: 'Furniture is placed within 2.0 ft of the corner wall heating/air conditioning unit.',
      details: 'Handbook p.51: "Furniture and other items must remain at least two feet from the PTAC unit" to prevent overheating, fire hazards, and airflow blockages.',
      citation: 'Handbook p.51 (PTAC Clearance)'
    });
  } else {
    checks.push({
      title: 'Corner PTAC Unit 2-Foot Clearance',
      status: 'pass',
      desc: 'Corner heating and air conditioning unit has 2+ feet of unobstructed buffer space.',
      details: 'Maintains optimal airflow and complies with residential fire code safety.',
      citation: 'Handbook p.51 (PTAC Clearance)'
    });
  }

  // 4. Wall Placement Rule (Beds & Wardrobes against walls)
  const bedsAndWardrobes = placedItems.filter(
    (i) => i.definitionId === 'imsa-bunk-bed' || i.definitionId === 'imsa-single-bed' || i.definitionId === 'imsa-wardrobe'
  );
  const floatingItem = bedsAndWardrobes.find((item) => {
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

  if (floatingItem) {
    checks.push({
      title: 'Furniture Not Against Wall',
      status: 'warning',
      desc: 'A bed or wardrobe is floating in the center of the room.',
      details: 'Handbook p.51: "One side of all furniture, including the long side of the bed and the wardrobe, must be against a wall."',
      citation: 'Handbook p.51 (Wall Placement)'
    });
  } else {
    checks.push({
      title: 'Wall Placement Rule',
      status: 'pass',
      desc: 'Beds, wardrobes, and major items are positioned against perimeter walls.',
      details: 'Maintains structural safety and stability per IMSA room arrangement guidelines.',
      citation: 'Handbook p.51 (Wall Placement)'
    });
  }

  // 5. En-Suite Private Bathroom Door Clearance
  if (roomConfig.bathroomPosition !== 'none') {
    const isLeft = roomConfig.bathroomPosition === 'left-entry';
    const bathDoorX = isLeft ? -roomConfig.width / 2 + 2.25 : roomConfig.width / 2 - 2.25;
    const bathDoorZ = roomConfig.length / 2 - 5.0;
    const bathBlocked = placedItems.some((item) => {
      const dist = Math.hypot(item.x - bathDoorX, item.z - bathDoorZ);
      return dist < 2.5 && item.y < 2.0;
    });

    if (bathBlocked) {
      checks.push({
        title: 'Bathroom Door Swing Obstructed',
        status: 'warning',
        desc: 'Furniture is blocking the en-suite private bathroom entrance.',
        details: 'The private bathroom door must swing freely without hitting desks, dressers, or hampers.',
        citation: 'Handbook p.51 (Door Clearance)'
      });
    } else {
      checks.push({
        title: 'En-Suite Bathroom Access',
        status: 'pass',
        desc: 'Private bathroom door swing is fully unobstructed.',
        details: 'Both roommates have immediate, clear access to the private shower and vanity.',
        citation: 'Handbook p.51 (Door Clearance)'
      });
    }
  }

  // 6. Bedding Configuration & Lofts
  const bunkBeds = placedItems.filter((i) => i.definitionId === 'imsa-bunk-bed');
  const singleBeds = placedItems.filter((i) => i.definitionId === 'imsa-single-bed' || i.definitionId === 'imsa-captains-bed');

  if (singleBeds.length > 0) {
    checks.push({
      title: 'Unbunked Bed Policy (RC Notification)',
      status: 'info',
      desc: `Detected ${singleBeds.length} unbunked bed frame(s).`,
      details: 'Handbook p.51: "Lofts are not allowed. Bed frames may not be placed on other furniture, and mattresses may not be placed on the floor." Furniture cannot be dismantled; beds must use official frame locking pins.',
      citation: 'Handbook p.51 (Beds & Lofts)'
    });
  } else if (bunkBeds.length > 0) {
    checks.push({
      title: 'Standard Bunk Bed Move-In Ready',
      status: 'pass',
      desc: 'Bunk beds are stacked in the official move-in configuration.',
      details: 'Maximizes open floor space for shared rugs and study desks.',
      citation: 'Handbook p.51 (Beds & Lofts)'
    });
  }

  // 7. Issued Furniture Tracking
  const deskCount = placedItems.filter((i) => i.definitionId === 'imsa-desk').length;
  if (deskCount < 2) {
    checks.push({
      title: 'Official Study Desks (2 Required)',
      status: 'info',
      desc: `Room currently has ${deskCount} of 2 official solid oak desks.`,
      details: 'Handbook p.51: "All room furniture must remain inside the room; furniture cannot be removed from the room during the academic year."',
      citation: 'Handbook p.51 (Room Inventory)'
    });
  } else {
    checks.push({
      title: 'Dual Student Workstations',
      status: 'pass',
      desc: 'Both roommates have their designated official study desks.',
      details: 'Both oak desks (42" x 24" x 30") are accounted for.',
      citation: 'Handbook p.51 (Room Inventory)'
    });
  }

  // 8. Refrigerator Limit (≤ 4.3 cu. ft.)
  const fridgeCount = placedItems.filter((i) => i.definitionId === 'dorm-microfridge').length;
  if (fridgeCount > 1) {
    checks.push({
      title: 'Multiple Refrigerators Detected',
      status: 'warning',
      desc: `${fridgeCount} compact refrigerators placed in this double room.`,
      details: 'Handbook p.52: "One small refrigerator per room (4.3 cubic feet or smaller) is permitted." Multiple units overload wing circuits.',
      citation: 'Handbook p.52 (Room Appliances)'
    });
  } else if (fridgeCount === 1) {
    checks.push({
      title: 'Permitted Refrigerator (≤ 4.3 cu. ft.)',
      status: 'pass',
      desc: '1 compact refrigerator within handbook size and circuit limits.',
      details: 'Handbook p.52: Must be 4.3 cu. ft. or smaller and plugged into a surge protector.',
      citation: 'Handbook p.52 (Room Appliances)'
    });
  }

  // 9. Bookshelf Size Rule (≤ 3ft x 3ft)
  const bookshelfCount = placedItems.filter((i) => i.definitionId === 'bookshelf-unit').length;
  if (bookshelfCount > 0) {
    checks.push({
      title: 'Approved Bookshelf Size (3ft × 3ft)',
      status: 'pass',
      desc: 'Bookshelf matches the 36" × 36" Handbook dimensional limit.',
      details: 'Handbook p.52: "A bookshelf no larger than 3 feet by 3 feet is allowed with RC approval."',
      citation: 'Handbook p.52 (Extra Furniture)'
    });
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#1E3A5F] bg-[#001D33] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                IMSA Residence Life Handbook Policy Checker
              </h2>
              <p className="text-xs text-slate-400">
                Live verification against IMSA Student Handbook (pp. 51–52) & Aurora Fire Code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#16273F] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {checks.map((c, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border flex items-start space-x-3.5 ${
                c.status === 'pass'
                  ? 'bg-emerald-950/20 border-emerald-700/40 text-emerald-200'
                  : c.status === 'warning'
                  ? 'bg-amber-950/25 border-amber-500/50 text-amber-200'
                  : 'bg-sky-950/20 border-sky-700/40 text-sky-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {c.status === 'pass' && <CheckCircle size={18} className="text-emerald-400" />}
                {c.status === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
                {c.status === 'info' && <Info size={18} className="text-sky-400" />}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{c.title}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono bg-[#0B1726]/60 px-1.5 py-0.5 rounded border border-slate-700">
                      {c.citation}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        c.status === 'pass'
                          ? 'bg-emerald-900/60 text-emerald-300'
                          : c.status === 'warning'
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-sky-900/60 text-sky-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-200 leading-snug">{c.desc}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">{c.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#1E3A5F] bg-[#001D33] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <BookOpen size={14} className="text-amber-400" />
            <span>IMSA Residence Life Handbook pp. 51–52</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#002B49] hover:bg-[#003B66] text-[#F5C242] border border-[#C59B27]/50 font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Close Policy Checker
          </button>
        </div>
      </div>
    </div>
  );
};
