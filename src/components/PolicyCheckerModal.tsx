import React from 'react';
import { PlacedItem, RoomConfig } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { X, ShieldCheck, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';

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

  // Evaluate rules
  const checks: {
    title: string;
    status: 'pass' | 'warning' | 'info';
    desc: string;
    details: string;
  }[] = [];

  // 1. Entry Egress Clearance (Check if any item is blocking south wall door)
  const doorBlocked = placedItems.some((item) => {
    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def) return false;
    // Main entrance is at (w/2 - 1.8, l/2)
    const doorX = roomConfig.width / 2 - 1.8;
    const doorZ = roomConfig.length / 2;
    const dist = Math.hypot(item.x - doorX, item.z - doorZ);
    return dist < 3.0 && item.y < 2.0;
  });

  if (doorBlocked) {
    checks.push({
      title: 'Entrance Doorway Blocked',
      status: 'warning',
      desc: 'An item is within 3.0 ft of the hallway entrance door.',
      details: 'IMSA Res Life and Aurora Fire Code require a minimum 36-inch clear emergency egress path to the hallway.'
    });
  } else {
    checks.push({
      title: 'Emergency Hallway Egress',
      status: 'pass',
      desc: 'Hallway entrance door path is completely clear (36"+ clearance).',
      details: 'Passes standard Illinois residential evacuation requirements.'
    });
  }

  // 2. Bathroom Door Clearance
  if (roomConfig.bathroomPosition !== 'none') {
    const bathDoorX = roomConfig.bathroomPosition === 'left-entry' ? -roomConfig.width / 2 + 2.5 : roomConfig.width / 2 - 2.5;
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
        details: 'The private bathroom door must swing freely without hitting desks, beds, or storage bins.'
      });
    } else {
      checks.push({
        title: 'En-Suite Bathroom Access',
        status: 'pass',
        desc: 'Private bathroom door swing is fully unobstructed.',
        details: 'Residents and RC room inspectors will have full, effortless access to the private shower and sink.'
      });
    }
  }

  // 3. Bedding Configuration & Bunking Pins
  const bunkBeds = placedItems.filter((i) => i.definitionId === 'imsa-bunk-bed');
  const singleBeds = placedItems.filter((i) => i.definitionId === 'imsa-single-bed' || i.definitionId === 'imsa-captains-bed');

  if (singleBeds.length > 0) {
    checks.push({
      title: 'Unbunked Bed Policy (RC Approval)',
      status: 'info',
      desc: `Detected ${singleBeds.length} unbunked bed frame(s).`,
      details: 'IMSA Student Handbook: Unbunking beds requires formal Resident Counselor (RC) notification and proper four-corner metal locking pins installed by facilities.'
    });
  } else if (bunkBeds.length > 0) {
    checks.push({
      title: 'Standard Bunk Bed Move-in Ready',
      status: 'pass',
      desc: 'Bunk beds are stacked in the official move-in configuration.',
      details: 'Maximizes open floor space for shared rugs, workstations, or lounge seating.'
    });
  }

  // 4. Issued Furniture Completeness
  const deskCount = placedItems.filter((i) => i.definitionId === 'imsa-desk').length;
  const wardrobeCount = placedItems.filter((i) => i.definitionId === 'imsa-wardrobe').length;
  const dresserCount = placedItems.filter((i) => i.definitionId === 'imsa-dresser').length;

  if (deskCount < 2) {
    checks.push({
      title: 'IMSA Issued Study Desks',
      status: 'info',
      desc: `Room currently has ${deskCount} of 2 official study desks placed.`,
      details: 'Both roommates are issued their own solid oak desk. Academy furniture cannot be removed from the room during the academic year.'
    });
  } else {
    checks.push({
      title: 'Dual Student Workstations',
      status: 'pass',
      desc: 'Both residents have their designated study desks.',
      details: 'Ready for collaborative problem sets and late-night study sessions.'
    });
  }

  // 5. Appliance Wattage & MicroFridge Limit
  const fridgeCount = placedItems.filter((i) => i.definitionId === 'dorm-microfridge').length;
  if (fridgeCount > 1) {
    checks.push({
      title: 'Multiple MicroFridges Detected',
      status: 'warning',
      desc: `${fridgeCount} Mini-Fridge/Microwave combos placed in one room.`,
      details: 'IMSA Res Life strongly encourages 1 shared refrigerator per double room to prevent electrical circuit breaker trips on the wing electrical panel (max 1000W).'
    });
  } else if (fridgeCount === 1) {
    checks.push({
      title: 'Shared Appliance Power Load',
      status: 'pass',
      desc: '1 Shared Mini-Fridge / Microwave combo within electrical limits.',
      details: 'Remember to plug directly into a wall receptacle or a UL-approved surge protector.'
    });
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B1726] border border-[#1E3A5F] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#1E3A5F] bg-[#001D33] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                IMSA Residence Life Policy Checklist
              </h2>
              <p className="text-xs text-slate-400">
                Hall {roomConfig.hallNumber} · Wing {roomConfig.wing} Safety & Floor Regulation Validator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#16273F] transition-colors"
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
                  ? 'bg-amber-950/20 border-amber-600/40 text-amber-200'
                  : 'bg-sky-950/20 border-sky-700/40 text-sky-200'
              }`}
            >
              <div className="mt-0.5">
                {c.status === 'pass' && <CheckCircle size={18} className="text-emerald-400" />}
                {c.status === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
                {c.status === 'info' && <Info size={18} className="text-sky-400" />}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{c.title}</h4>
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
                <p className="text-xs font-medium opacity-90">{c.desc}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-700/40">
                  {c.details}
                </p>
              </div>
            </div>
          ))}

          {/* Handbook Reference Box */}
          <div className="bg-[#112238] border border-[#1E3A5F] rounded-xl p-3.5 mt-4 text-xs text-slate-300 flex items-start space-x-3">
            <span className="text-xl">📖</span>
            <div className="space-y-1">
              <span className="font-semibold text-white">IMSA Student Handbook Reference</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Per Academy Res Life guidelines: DIY homemade lofts, dismantlement of wooden bed frames, and daisy-chaining electrical cords are strictly prohibited. All furniture issued by the academy must stay in the room.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E3A5F] bg-[#001D33] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#002B49] hover:bg-[#003B66] text-[#F5C242] border border-[#C59B27]/50 text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Understood & Return to 3D Room
          </button>
        </div>
      </div>
    </div>
  );
};
