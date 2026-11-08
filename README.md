# 🏠 IMSA Dorm Room 3D Studio

A 3D room planner for students at the Illinois Mathematics and Science Academy (IMSA). Lay out your residence hall room before move-in day, check it against the residential handbook, and send your roommate a shopping list.

**[Try it at imsa-dorm-designer.vercel.app](https://imsa-dorm-designer.vercel.app)**

A student project, not affiliated with or endorsed by IMSA. The rule checks cite the residential handbook, but your room may not match the templates exactly. Measure it and check with your RC before you move furniture.

## What you can do

**Set up your room.** Pick a room type (standard double, corner L-room, quad suite, or custom width and length), your hall (1501 to 1507), and your wing. The standard double starts at 11'8" by 15'.

**Furnish it.** 24 furniture pieces in five groups:

| Group | Examples |
|---|---|
| School-issued | Twin XL bunk beds, single beds, captain's loft beds, study desks, desk chairs, dressers, wardrobes |
| Lounge | Futon, beanbag, gaming chair, area rug |
| Tech and study | Dual-monitor desk setup, swing-arm lamp, rolling whiteboard |
| Appliances and storage | MicroFridge, rolling cart, bookshelf, hamper, mirror |
| Decor | Titans pennant, plant stand, guitar |

Drag pieces across the floor with 6-inch grid snapping, rotate them, stack them (on a desk or under a lofted bed), and change bedding and fabric colors.

**Start from a layout.** 6 presets, including Classic Bunked (most floor space), Symmetric Split (open path to the window), and L-Shape Corner Beds.

**Look at it four ways.** 3D orbit, 2D blueprint, isometric, and first-person from the doorway. Switch between daylight, golden hour, and night-study lighting, and lower the walls to see inside.

**Check the rules.** The policy checker runs 8 checks and cites the handbook page for each:

1. 36" clear path at the hallway door
2. Clear path from the door to the window
3. 2 feet of clearance around the corner PTAC (heating and AC) unit
4. Furniture placed against walls
5. Bathroom door can swing open
6. Unbunked beds flagged for RC notification
7. Both school-issued study desks present
8. One refrigerator per room (4.3 cu. ft. or smaller)

**Share it.** A move-in checklist split by Resident A, Resident B, and shared items, copied as Markdown for Discord or text. Also: PNG screenshots and JSON save files you can send to your roommate.

## Run it locally

Needs Node.js 18+ and npm.

```bash
git clone https://github.com/Alejandro-Valadez/imsa-dorm-designer.git
cd imsa-dorm-designer
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## How it's built

- **Three.js** for the room, furniture meshes, lighting, and shadows (`src/utils/roomBuilder.ts`, `src/utils/meshBuilders.ts`)
- **React 19 and TypeScript** for the interface (`src/components/`)
- **Tailwind CSS** in IMSA navy and gold
- **Vite** for the dev server and build

Furniture and presets live in `src/data/furnitureCatalog.ts`. The rule checks live in `src/components/PolicyCheckerModal.tsx`.

Built by Alejandro Valadez.
