# 🏠 IMSA Dorm Room 3D Studio

An interactive 3D layout planner and dorm designer built specifically for students at the **Illinois Mathematics and Science Academy (IMSA)** in Aurora, IL. 

Inspired by 3D room planners and equipment layout engines, this application allows future and current IMSA students to realistically test and design their residence hall rooms before move-in day.

---

## ✨ Features

- **Accurate IMSA Residence Hall Blueprints**:
  - **Standard Double** (12' × 15' living space with private en-suite bathroom alcove)
  - **Corner L-Rooms** (14' × 16' end-wing units)
  - **Connected Quad Suites** (24' × 15' double rooms with central adjoining quad door)
  - **Customizable Dimensions** (adjust width and length)
  - Select your specific Hall (1501 to 1507) and Wing (A, B, C, or D).

- **Complete Official IMSA & Student Furniture Catalog**:
  - 🎓 **Official IMSA-Issued Furniture**: Twin XL Bunk Beds, Single Unbunked Beds, Captain / Loft Beds, Solid Oak Study Desks, Desk Chairs, 3-Drawer Dressers, 2-Door Wardrobes, Trash & Recycling Cans.
  - 🛋️ **Lounge & Comfort**: Futon sofas, floor gaming beanbag loungers, ergonomic rolling gaming chairs, 5'×7' area rugs.
  - 💻 **Tech & Study Setup**: Dual monitor + laptop battlestation with desk mats, architect swing-arm lamps, standing mobile whiteboard easels.
  - 🧊 **Appliances & Storage**: MicroFridge combo (mini-fridge + microwave), 3-tier rolling utility cart, college bookshelf, collapsible laundry hampers, full-length mirrors.
  - ✨ **Decor & Spirit**: IMSA Titans banners, succulents/plant stands, acoustic guitars.

- **Interactive 3D Controls**:
  - **Direct Drag & Drop**: Click & drag furniture smoothly across the floor with automatic 6-inch grid snapping.
  - **Rotation & Elevation**: Rotate 90° / 180° or adjust elevation (stack items on desks or under elevated beds).
  - **Bedding & Color Customizer**: Change comforter colors, upholstery fabrics, and finishes.
  - **Multi-Angle Camera Modes**: 3D Orbit, 2D Top-Down Blueprint, Isometric Angled, and First-Person Walkthrough (standing in doorway).
  - **Dynamic Lighting**: Daylight (window sunlight with real-time shadows), Golden Hour Sunset, and Night Study (warm desk lamp glow & fairy lights).
  - **Cutaway Walls**: Toggle cutaway wall height to easily view interior arrangements without clipping.

- **IMSA Res Life Policy & Safety Validator**:
  - Validates **36" clear emergency egress** to the hallway door.
  - Verifies **private bathroom door swing clearance**.
  - Reminds students of the **unbunking approval policy** and proper locking pins.
  - Warns against overloading electrical circuits with multiple MicroFridges (>1000W limit).
  - Checks for issued desk completeness.

- **Roommate Coordination & Export**:
  - **Move-in Checklist**: Categorizes gear by Resident A, Resident B, and Shared items.
  - **1-Click Clipboard Export**: Copy formatted Markdown shopping checklist to share directly on Discord or SMS.
  - **High-Res Snapshot**: 1-click 3D camera screenshot export as PNG.
  - **JSON Save & Load**: Save layouts and share `.json` room design files.

- **Popular 1-Click Presets**:
  - *IMSA Classic Bunked* (max floor space for lounge & fridge)
  - *Symmetric Split* (unbunked twin beds on opposite walls)
  - *L-Shape & Lounge Corner* (angled beds with open hangout space)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

```bash
# Navigate to the app directory
cd apps/imsa-dorm-designer

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your web browser.

---

## 🛠️ Tech Stack
- **Three.js** (`three`) - Procedural 3D geometries, materials, PBR lighting, and soft shadows.
- **OrbitControls** - Responsive camera navigation and bounds.
- **React 19** + **TypeScript** - UI state management, modals, and reactive updates.
- **Tailwind CSS** - Sleek IMSA navy (`#002B49`) and gold (`#C59B27`) themed UI.
- **Lucide Icons** - Clean vector iconography.
- **Canvas Confetti** - Celebratory layout export effects.
