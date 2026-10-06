import * as THREE from 'three';
import { FurnitureItemDefinition } from '../types';

// Helper for caching basic materials
const materialsCache: Record<string, THREE.Material> = {};

function getMaterial(colorHex: string, roughness: number = 0.5, metalness: number = 0.1): THREE.MeshStandardMaterial {
  const key = `${colorHex}_${roughness}_${metalness}`;
  if (!materialsCache[key]) {
    materialsCache[key] = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness,
      metalness,
    });
  }
  return materialsCache[key] as THREE.MeshStandardMaterial;
}

export function buildFurnitureMesh(def: FurnitureItemDefinition, colorHex: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture_${def.id}`;

  const mainMat = getMaterial(colorHex, 0.45, 0.05);
  const woodMat = getMaterial('#7A4E2D', 0.6, 0.02);
  const darkWoodMat = getMaterial('#4A2E18', 0.6, 0.02);
  const metalMat = getMaterial('#2B303A', 0.3, 0.8);
  const chromeMat = getMaterial('#D1D5DB', 0.15, 0.95);
  const whiteMat = getMaterial('#F8FAFC', 0.7, 0.0);
  const mattressMat = getMaterial('#ECEFF1', 0.8, 0.0);
  const blackPlasticMat = getMaterial('#1E232A', 0.5, 0.1);

  switch (def.meshType) {
    case 'bunk_bed': {
      // 4 corner posts
      const postGeo = new THREE.BoxGeometry(0.18, 5.6, 0.18);
      const hw = def.width / 2 - 0.09;
      const hd = def.depth / 2 - 0.09;
      const postPositions = [
        [-hw, 2.8, -hd],
        [hw, 2.8, -hd],
        [-hw, 2.8, hd],
        [hw, 2.8, hd],
      ];
      postPositions.forEach(([x, y, z]) => {
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(x, y, z);
        post.castShadow = true;
        group.add(post);
      });

      // Bottom Bed Frame & Mattress
      const lowerFrame = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.25, def.depth), woodMat);
      lowerFrame.position.set(0, 1.2, 0);
      lowerFrame.castShadow = true;
      group.add(lowerFrame);

      const lowerMattress = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.2, 0.5, def.depth - 0.2), mattressMat);
      lowerMattress.position.set(0, 1.55, 0);
      lowerMattress.castShadow = true;
      group.add(lowerMattress);

      // Lower Comforter
      const lowerComforter = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.15, 0.52, (def.depth - 0.2) * 0.7), mainMat);
      lowerComforter.position.set(0, 1.57, 0.8);
      lowerComforter.castShadow = true;
      group.add(lowerComforter);

      // Lower Pillow
      const lowerPillow = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.8, 0.2, 1.2), whiteMat);
      lowerPillow.position.set(0, 1.9, -hd + 0.8);
      group.add(lowerPillow);

      // Upper Bed Frame & Mattress
      const upperFrame = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.25, def.depth), woodMat);
      upperFrame.position.set(0, 4.0, 0);
      upperFrame.castShadow = true;
      group.add(upperFrame);

      const upperMattress = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.2, 0.5, def.depth - 0.2), mattressMat);
      upperMattress.position.set(0, 4.35, 0);
      upperMattress.castShadow = true;
      group.add(upperMattress);

      // Upper Comforter
      const upperComforter = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.15, 0.52, (def.depth - 0.2) * 0.7), mainMat);
      upperComforter.position.set(0, 4.37, 0.8);
      upperComforter.castShadow = true;
      group.add(upperComforter);

      // Upper Pillow
      const upperPillow = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.8, 0.2, 1.2), whiteMat);
      upperPillow.position.set(0, 4.7, -hd + 0.8);
      group.add(upperPillow);

      // Guard rails on top bed
      const railGeo = new THREE.BoxGeometry(0.08, 0.15, def.depth - 0.4);
      const railLeft = new THREE.Mesh(railGeo, woodMat);
      railLeft.position.set(-hw, 4.9, 0);
      group.add(railLeft);
      const railRight = new THREE.Mesh(railGeo, woodMat);
      railRight.position.set(hw, 4.9, 0);
      group.add(railRight);

      // Ladder on foot side
      const ladderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.2, 0.08), woodMat);
      ladderLeft.position.set(0.6, 2.1, hd + 0.08);
      const ladderRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.2, 0.08), woodMat);
      ladderRight.position.set(1.2, 2.1, hd + 0.08);
      group.add(ladderLeft, ladderRight);

      for (let r = 0.8; r <= 3.8; r += 0.7) {
        const rung = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.06, 0.06), woodMat);
        rung.position.set(0.9, r, hd + 0.08);
        group.add(rung);
      }
      break;
    }

    case 'single_bed':
    case 'captains_bed': {
      const isCaptain = def.meshType === 'captains_bed';
      const frameHeight = isCaptain ? 3.2 : 1.3;
      const postHeight = isCaptain ? 4.5 : 2.8;

      const postGeo = new THREE.BoxGeometry(0.18, postHeight, 0.18);
      const hw = def.width / 2 - 0.09;
      const hd = def.depth / 2 - 0.09;

      [
        [-hw, postHeight / 2, -hd],
        [hw, postHeight / 2, -hd],
        [-hw, postHeight / 2, hd],
        [hw, postHeight / 2, hd],
      ].forEach(([x, y, z]) => {
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(x, y, z);
        post.castShadow = true;
        group.add(post);
      });

      // Headboard panel
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.2, 1.2, 0.1), woodMat);
      headboard.position.set(0, postHeight - 0.7, -hd);
      group.add(headboard);

      // Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.25, def.depth), woodMat);
      frame.position.set(0, frameHeight, 0);
      frame.castShadow = true;
      group.add(frame);

      // Mattress
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.2, 0.5, def.depth - 0.2), mattressMat);
      mattress.position.set(0, frameHeight + 0.35, 0);
      mattress.castShadow = true;
      group.add(mattress);

      // Comforter
      const comforter = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.14, 0.52, (def.depth - 0.2) * 0.72), mainMat);
      comforter.position.set(0, frameHeight + 0.37, 0.8);
      comforter.castShadow = true;
      group.add(comforter);

      // Pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.8, 0.22, 1.2), whiteMat);
      pillow.position.set(0, frameHeight + 0.68, -hd + 0.8);
      group.add(pillow);

      // If captain bed, show open clearance or modular shelf
      if (isCaptain) {
        const underBar = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.4, 0.1, 0.1), metalMat);
        underBar.position.set(0, 1.5, 0);
        group.add(underBar);
      }
      break;
    }

    case 'desk': {
      // Desktop
      const top = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.15, def.depth), woodMat);
      top.position.set(0, def.height - 0.075, 0);
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      // Left leg panel
      const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, def.height - 0.15, def.depth - 0.1), woodMat);
      leftLeg.position.set(-def.width / 2 + 0.1, (def.height - 0.15) / 2, 0);
      leftLeg.castShadow = true;
      group.add(leftLeg);

      // Back modesty panel
      const backPanel = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.3, def.height - 0.8, 0.08), woodMat);
      backPanel.position.set(0, (def.height - 0.8) / 2 + 0.35, -def.depth / 2 + 0.1);
      group.add(backPanel);

      // Right Drawer pedestal
      const pedW = 1.1;
      const pedH = def.height - 0.15;
      const pedD = def.depth - 0.15;
      const ped = new THREE.Mesh(new THREE.BoxGeometry(pedW, pedH, pedD), darkWoodMat);
      ped.position.set(def.width / 2 - pedW / 2 - 0.05, pedH / 2, 0);
      ped.castShadow = true;
      group.add(ped);

      // 3 Drawer front lines & handles
      for (let i = 0; i < 3; i++) {
        const dh = (pedH - 0.2) / 3;
        const dy = 0.15 + i * (dh + 0.05) + dh / 2;
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.04), chromeMat);
        handle.position.set(def.width / 2 - pedW / 2 - 0.05, dy, pedD / 2 + 0.02);
        group.add(handle);
      }

      // Cable grommet hole on top right
      const grommet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16), blackPlasticMat);
      grommet.position.set(def.width / 2 - 0.35, def.height - 0.07, -def.depth / 2 + 0.3);
      group.add(grommet);
      break;
    }

    case 'chair': {
      // Seat cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.12, def.depth), mainMat);
      seat.position.set(0, 1.4, 0);
      seat.castShadow = true;
      group.add(seat);

      // 4 wooden legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
      const lx = def.width / 2 - 0.12;
      const lz = def.depth / 2 - 0.12;
      [
        [-lx, 0.7, -lz],
        [lx, 0.7, -lz],
        [-lx, 0.7, lz],
        [lx, 0.7, lz],
      ].forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(x, y, z);
        leg.castShadow = true;
        group.add(leg);
      });

      // Backrest supports
      const supGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.4, 8);
      const sup1 = new THREE.Mesh(supGeo, woodMat);
      sup1.position.set(-lx, 2.1, -lz);
      const sup2 = new THREE.Mesh(supGeo, woodMat);
      sup2.position.set(lx, 2.1, -lz);
      group.add(sup1, sup2);

      // Backrest horizontal slat
      const back = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.05, 0.5, 0.08), woodMat);
      back.position.set(0, 2.5, -lz);
      group.add(back);
      break;
    }

    case 'dresser': {
      // Main box
      const box = new THREE.Mesh(new THREE.BoxGeometry(def.width, def.height, def.depth), woodMat);
      box.position.set(0, def.height / 2, 0);
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);

      // 3 Drawer front plates & chrome handles
      const drawerHeight = (def.height - 0.3) / 3;
      for (let i = 0; i < 3; i++) {
        const yPos = 0.15 + i * (drawerHeight + 0.05) + drawerHeight / 2;
        const drawerFront = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.15, drawerHeight, 0.04), darkWoodMat);
        drawerFront.position.set(0, yPos, def.depth / 2 + 0.02);
        group.add(drawerFront);

        // 2 pull handles per drawer
        const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), chromeMat);
        h1.position.set(-def.width / 4, yPos, def.depth / 2 + 0.05);
        const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), chromeMat);
        h2.position.set(def.width / 4, yPos, def.depth / 2 + 0.05);
        group.add(h1, h2);
      }
      break;
    }

    case 'wardrobe': {
      // Main tall cabinet
      const body = new THREE.Mesh(new THREE.BoxGeometry(def.width, def.height, def.depth), woodMat);
      body.position.set(0, def.height / 2, 0);
      body.castShadow = true;
      group.add(body);

      // Double door center line
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.02, def.height - 0.3, 0.02), blackPlasticMat);
      line.position.set(0, def.height / 2, def.depth / 2 + 0.02);
      group.add(line);

      // Handles
      const hLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), chromeMat);
      hLeft.position.set(-0.15, def.height / 2, def.depth / 2 + 0.05);
      const hRight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), chromeMat);
      hRight.position.set(0.15, def.height / 2, def.depth / 2 + 0.05);
      group.add(hLeft, hRight);

      // Top decorative cornice
      const topCap = new THREE.Mesh(new THREE.BoxGeometry(def.width + 0.1, 0.12, def.depth + 0.1), darkWoodMat);
      topCap.position.set(0, def.height + 0.06, 0);
      group.add(topCap);
      break;
    }

    case 'trash_duo': {
      // Blue Recycling Can
      const blueMat = getMaterial('#2563EB', 0.4, 0.1);
      const bin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, def.height, 16), blueMat);
      bin1.position.set(-0.45, def.height / 2, 0);
      bin1.castShadow = true;
      group.add(bin1);

      // Black Waste Can
      const blackMat = getMaterial('#1F2937', 0.5, 0.1);
      const bin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, def.height, 16), blackMat);
      bin2.position.set(0.45, def.height / 2, 0);
      bin2.castShadow = true;
      group.add(bin2);
      break;
    }

    case 'futon': {
      // Frame
      const base = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.3, def.depth), woodMat);
      base.position.set(0, 0.5, 0);
      base.castShadow = true;
      group.add(base);

      // Legs
      [-def.width / 2 + 0.2, def.width / 2 - 0.2].forEach(x => {
        [-def.depth / 2 + 0.2, def.depth / 2 - 0.2].forEach(z => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), woodMat);
          leg.position.set(x, 0.2, z);
          group.add(leg);
        });
      });

      // Bottom Cushion
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.4, 0.45, def.depth * 0.65), mainMat);
      cushion.position.set(0, 0.85, 0.2);
      cushion.castShadow = true;
      group.add(cushion);

      // Backrest Cushion
      const backCushion = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.4, 1.4, 0.35), mainMat);
      backCushion.position.set(0, 1.6, -def.depth / 2 + 0.35);
      backCushion.rotation.x = -0.15;
      backCushion.castShadow = true;
      group.add(backCushion);

      // Armrests
      [-def.width / 2 + 0.1, def.width / 2 - 0.1].forEach(x => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, def.depth - 0.2), woodMat);
        arm.position.set(x, 0.9, 0);
        group.add(arm);
      });
      break;
    }

    case 'beanbag': {
      const beanGeo = new THREE.SphereGeometry(def.width / 2, 16, 12);
      beanGeo.scale(1.0, 0.7, 1.0);
      const beanMesh = new THREE.Mesh(beanGeo, mainMat);
      beanMesh.position.set(0, (def.height * 0.7) / 2 + 0.2, 0);
      beanMesh.castShadow = true;
      group.add(beanMesh);
      break;
    }

    case 'gaming_chair': {
      // 5-star base
      const starHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), blackPlasticMat);
      starHub.position.set(0, 0.25, 0);
      group.add(starHub);

      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.9), blackPlasticMat);
        spoke.position.set(Math.sin(angle) * 0.45, 0.2, Math.cos(angle) * 0.45);
        spoke.rotation.y = angle;
        group.add(spoke);
      }

      // Hydraulic lift cylinder
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8), chromeMat);
      piston.position.set(0, 0.8, 0);
      group.add(piston);

      // Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 1.6), mainMat);
      seat.position.set(0, 1.4, 0);
      seat.castShadow = true;
      group.add(seat);

      // Ergonomic Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.2), mainMat);
      back.position.set(0, 2.6, -0.65);
      back.rotation.x = -0.05;
      back.castShadow = true;
      group.add(back);

      // Headrest pillow
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.15), blackPlasticMat);
      headrest.position.set(0, 3.4, -0.62);
      group.add(headrest);

      // Armrests
      [-0.85, 0.85].forEach(x => {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.06), blackPlasticMat);
        stem.position.set(x, 1.7, 0);
        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.6), blackPlasticMat);
        pad.position.set(x, 2.0, 0);
        group.add(stem, pad);
      });
      break;
    }

    case 'rug': {
      const rugMesh = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.03, def.depth), mainMat);
      rugMesh.position.set(0, 0.015, 0);
      rugMesh.receiveShadow = true;
      group.add(rugMesh);

      // Border fringe / edge
      const edgeMat = getMaterial('#94A3B8', 0.9, 0.0);
      const edge1 = new THREE.Mesh(new THREE.BoxGeometry(def.width + 0.1, 0.035, 0.1), edgeMat);
      edge1.position.set(0, 0.017, -def.depth / 2);
      const edge2 = new THREE.Mesh(new THREE.BoxGeometry(def.width + 0.1, 0.035, 0.1), edgeMat);
      edge2.position.set(0, 0.017, def.depth / 2);
      group.add(edge1, edge2);
      break;
    }

    case 'monitor_setup': {
      // Desk Mat / Mousepad
      const mat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.02, 1.1), blackPlasticMat);
      mat.position.set(0, 0.01, 0);
      group.add(mat);

      // Left Monitor
      const screenMat = getMaterial('#0F172A', 0.2, 0.1);
      const screenGlow = getMaterial('#38BDF8', 0.1, 0.1); // subtle glowing display

      // Screen 1
      const mon1Stand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.3), metalMat);
      mon1Stand.position.set(-0.7, 0.4, -0.3);
      const mon1Bezel = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.04), blackPlasticMat);
      mon1Bezel.position.set(-0.7, 0.9, -0.2);
      mon1Bezel.rotation.y = 0.1;
      const mon1Display = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.74, 0.02), screenGlow);
      mon1Display.position.set(-0.7, 0.9, -0.18);
      mon1Display.rotation.y = 0.1;
      group.add(mon1Stand, mon1Bezel, mon1Display);

      // Screen 2
      const mon2Stand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.3), metalMat);
      mon2Stand.position.set(0.7, 0.4, -0.3);
      const mon2Bezel = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.04), blackPlasticMat);
      mon2Bezel.position.set(0.7, 0.9, -0.2);
      mon2Bezel.rotation.y = -0.1;
      const mon2Display = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.74, 0.02), screenMat);
      mon2Display.position.set(0.7, 0.9, -0.18);
      mon2Display.rotation.y = -0.1;
      group.add(mon2Stand, mon2Bezel, mon2Display);

      // Open Laptop
      const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.55), metalMat);
      lapBase.position.set(0, 0.03, 0.15);
      const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.03), metalMat);
      lapScreen.position.set(0, 0.3, -0.12);
      lapScreen.rotation.x = -0.25;
      group.add(lapBase, lapScreen);
      break;
    }

    case 'desk_lamp': {
      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16), metalMat);
      base.position.set(0, 0.025, 0);
      group.add(base);

      // Arm
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), metalMat);
      arm1.position.set(0, 0.4, 0);
      arm1.rotation.z = -0.15;
      const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), metalMat);
      arm2.position.set(-0.15, 1.0, 0);
      arm2.rotation.z = 0.35;
      group.add(arm1, arm2);

      // Shade
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 16, 1, true), metalMat);
      shade.position.set(-0.25, 1.3, 0);
      shade.rotation.z = Math.PI * 0.75;
      group.add(shade);

      // Bulb glow
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), getMaterial('#FDE047', 0.1, 0.0));
      bulb.position.set(-0.25, 1.25, 0);
      group.add(bulb);
      break;
    }

    case 'whiteboard': {
      // Mobile Stand
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.5, 0.08), metalMat);
      leg1.position.set(-def.width / 2 + 0.15, 2.25, 0);
      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.5, 0.08), metalMat);
      leg2.position.set(def.width / 2 - 0.15, 2.25, 0);
      group.add(leg1, leg2);

      // Caster feet
      [-def.width / 2 + 0.15, def.width / 2 - 0.15].forEach(x => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), metalMat);
        foot.position.set(x, 0.04, 0);
        group.add(foot);
      });

      // Board Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.2, 2.8, 0.08), chromeMat);
      frame.position.set(0, 3.2, 0);
      group.add(frame);

      // White Surface
      const surface = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.35, 2.65, 0.09), whiteMat);
      surface.position.set(0, 3.2, 0);
      group.add(surface);

      // Marker Tray
      const tray = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.15), chromeMat);
      tray.position.set(0, 1.8, 0.08);
      group.add(tray);
      break;
    }

    case 'microfridge': {
      // Refrigerator base unit
      const fridge = new THREE.Mesh(new THREE.BoxGeometry(def.width, 2.8, def.depth), mainMat);
      fridge.position.set(0, 1.4, 0);
      fridge.castShadow = true;
      group.add(fridge);

      // Split Door Line (Freezer on top, Fridge on bottom)
      const doorLine = new THREE.Mesh(new THREE.BoxGeometry(def.width + 0.01, 0.04, 0.04), blackPlasticMat);
      doorLine.position.set(0, 2.1, def.depth / 2 + 0.01);
      group.add(doorLine);

      // Handles
      const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.04), chromeMat);
      h1.position.set(def.width / 2 - 0.15, 2.4, def.depth / 2 + 0.04);
      const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.04), chromeMat);
      h2.position.set(def.width / 2 - 0.15, 1.4, def.depth / 2 + 0.04);
      group.add(h1, h2);

      // Microwave on top
      const uWave = new THREE.Mesh(new THREE.BoxGeometry(def.width * 0.95, 1.2, def.depth * 0.9), blackPlasticMat);
      uWave.position.set(0, 3.4, 0);
      uWave.castShadow = true;
      group.add(uWave);

      // Microwave Glass Window
      const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(def.width * 0.55, 0.8, 0.02), getMaterial('#1E293B', 0.1, 0.8));
      windowMesh.position.set(-0.25, 3.4, (def.depth * 0.9) / 2 + 0.01);
      group.add(windowMesh);

      // Keypad
      const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.02), getMaterial('#334155', 0.5, 0.2));
      keypad.position.set(def.width * 0.3, 3.4, (def.depth * 0.9) / 2 + 0.01);
      group.add(keypad);
      break;
    }

    case 'rolling_cart': {
      // 4 upright tubes
      const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, def.height, 8);
      const hx = def.width / 2 - 0.06;
      const hz = def.depth / 2 - 0.06;
      [
        [-hx, def.height / 2, -hz],
        [hx, def.height / 2, -hz],
        [-hx, def.height / 2, hz],
        [hx, def.height / 2, hz],
      ].forEach(([x, y, z]) => {
        const tube = new THREE.Mesh(tubeGeo, mainMat);
        tube.position.set(x, y, z);
        group.add(tube);
      });

      // 3 Baskets
      for (let i = 0; i < 3; i++) {
        const by = 0.4 + i * 1.0;
        const basket = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.05, 0.35, def.depth - 0.05), mainMat);
        basket.position.set(0, by, 0);
        basket.castShadow = true;
        group.add(basket);
      }
      break;
    }

    case 'bookshelf': {
      // Outer carcass
      const sideGeo = new THREE.BoxGeometry(0.08, def.height, def.depth);
      const leftSide = new THREE.Mesh(sideGeo, woodMat);
      leftSide.position.set(-def.width / 2 + 0.04, def.height / 2, 0);
      const rightSide = new THREE.Mesh(sideGeo, woodMat);
      rightSide.position.set(def.width / 2 - 0.04, def.height / 2, 0);
      group.add(leftSide, rightSide);

      const topShelf = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.08, def.depth), woodMat);
      topShelf.position.set(0, def.height - 0.04, 0);
      const botShelf = new THREE.Mesh(new THREE.BoxGeometry(def.width, 0.08, def.depth), woodMat);
      botShelf.position.set(0, 0.04, 0);
      group.add(topShelf, botShelf);

      // 2 interior shelves
      for (let i = 1; i <= 2; i++) {
        const sy = (def.height / 3) * i;
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.16, 0.06, def.depth - 0.05), woodMat);
        shelf.position.set(0, sy, 0);
        group.add(shelf);
      }

      // Books decoration
      const bookColors = ['#DC2626', '#2563EB', '#16A34A', '#9333EA', '#D97706'];
      for (let b = 0; b < 6; b++) {
        const bookMat = getMaterial(bookColors[b % bookColors.length], 0.6, 0.0);
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7 + (b % 3) * 0.1, 0.65), bookMat);
        book.position.set(-def.width / 3 + b * 0.16, def.height / 3 + 0.4, 0);
        group.add(book);
      }
      break;
    }

    case 'hamper': {
      const hamperGeo = new THREE.CylinderGeometry(def.width / 2, (def.width / 2) * 0.85, def.height, 16);
      const hamper = new THREE.Mesh(hamperGeo, mainMat);
      hamper.position.set(0, def.height / 2, 0);
      hamper.castShadow = true;
      group.add(hamper);
      break;
    }

    case 'full_mirror': {
      // Wooden/Plastic Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(def.width, def.height, 0.1), blackPlasticMat);
      frame.position.set(0, def.height / 2, 0);
      group.add(frame);

      // Reflective Mirror Glass
      const mirrorMat = getMaterial('#E0F2FE', 0.05, 0.98);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(def.width - 0.2, def.height - 0.2, 0.02), mirrorMat);
      glass.position.set(0, def.height / 2, 0.05);
      group.add(glass);
      break;
    }

    case 'wall_banner': {
      // Banner cloth
      const bannerMat = getMaterial('#002B49', 0.8, 0.0); // IMSA Navy
      const cloth = new THREE.Mesh(new THREE.BoxGeometry(def.width, def.height, 0.02), bannerMat);
      cloth.position.set(0, def.height / 2, 0);
      group.add(cloth);

      // Gold crest/stripe
      const goldMat = getMaterial('#C59B27', 0.4, 0.3); // IMSA Gold
      const crest = new THREE.Mesh(new THREE.BoxGeometry(def.width * 0.8, 0.25, 0.03), goldMat);
      crest.position.set(0, def.height / 2, 0.01);
      group.add(crest);
      break;
    }

    case 'plant_stand': {
      // Ceramic pot
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.6, 16), whiteMat);
      pot.position.set(0, 0.7, 0);
      pot.castShadow = true;
      group.add(pot);

      // Wood tripod stand
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), woodMat);
        leg.position.set(Math.sin(angle) * 0.28, 0.45, Math.cos(angle) * 0.28);
        leg.rotation.z = Math.sin(angle) * 0.1;
        leg.rotation.x = Math.cos(angle) * 0.1;
        group.add(leg);
      }

      // Leaves / Succulent foliage
      const plantMat = getMaterial('#15803D', 0.7, 0.0);
      for (let l = 0; l < 5; l++) {
        const leafAngle = (l * Math.PI * 2) / 5;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 6), plantMat);
        leaf.position.set(Math.sin(leafAngle) * 0.12, 1.2, Math.cos(leafAngle) * 0.12);
        leaf.rotation.x = 0.3 * Math.cos(leafAngle);
        leaf.rotation.z = 0.3 * Math.sin(leafAngle);
        group.add(leaf);
      }
      break;
    }

    case 'guitar': {
      // Guitar Stand
      const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 8), blackPlasticMat);
      standBase.position.set(0, 0.03, 0);
      const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), blackPlasticMat);
      standPole.position.set(0, 1.6, -0.15);
      group.add(standBase, standPole);

      // Guitar Body
      const bodyMat = getMaterial('#B45309', 0.3, 0.1);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.25), bodyMat);
      body.position.set(0, 1.2, 0.05);
      body.rotation.x = 0.1;

      // Sound hole
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), blackPlasticMat);
      hole.position.set(0, 1.2, 0.18);
      hole.rotation.x = Math.PI / 2 + 0.1;

      // Neck
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.8, 0.1), woodMat);
      neck.position.set(0, 2.4, -0.05);
      neck.rotation.x = 0.1;

      group.add(body, hole, neck);
      break;
    }

    default: {
      // Fallback box with nice beveled look
      const fallbackBox = new THREE.Mesh(new THREE.BoxGeometry(def.width, def.height, def.depth), mainMat);
      fallbackBox.position.set(0, def.height / 2, 0);
      fallbackBox.castShadow = true;
      group.add(fallbackBox);
    }
  }

  return group;
}
