import * as THREE from 'three';
import { RoomConfig } from '../types';

export function buildRoomShell(config: RoomConfig, cutawayWalls: boolean = true): THREE.Group {
  const roomGroup = new THREE.Group();
  roomGroup.name = 'room_shell';

  const w = config.width;
  const l = config.length;
  const h = config.ceilingHeight;

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E2D9CC'), // IMSA dorm linoleum tile tint
    roughness: 0.6,
    metalness: 0.05
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F1EFEA'), // Off-white painted cinder block / drywall
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#4A2E18'), // Dark brown baseboard trim
    roughness: 0.5,
    metalness: 0.05
  });

  const doorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5C3D28'), // Wooden door
    roughness: 0.4,
    metalness: 0.1
  });

  const windowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#93C5FD'),
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.6
  });

  // 1. FLOOR
  const floorGeo = new THREE.BoxGeometry(w, 0.2, l);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  roomGroup.add(floorMesh);

  // 1b. Grid Overlay on floor (1-foot grid)
  const gridHelper = new THREE.GridHelper(Math.max(w, l), Math.max(w, l), 0x002B49, 0xCBD5E1);
  gridHelper.position.set(0, 0.01, 0);
  roomGroup.add(gridHelper);

  // Wall dimensions
  const wallH = cutawayWalls ? 3.5 : h; // cutaway allows seeing inside easily
  const wallThick = 0.3;

  // 2. BACK WALL (North: Window Wall by default)
  const northWallGroup = new THREE.Group();
  const backWallLeft = new THREE.Mesh(new THREE.BoxGeometry((w - 4.5) / 2, wallH, wallThick), wallMat);
  backWallLeft.position.set(-w / 2 + (w - 4.5) / 4, wallH / 2, -l / 2);
  const backWallRight = new THREE.Mesh(new THREE.BoxGeometry((w - 4.5) / 2, wallH, wallThick), wallMat);
  backWallRight.position.set(w / 2 - (w - 4.5) / 4, wallH / 2, -l / 2);
  northWallGroup.add(backWallLeft, backWallRight);

  // Window frame & glass
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.8, 0.32), trimMat);
  winFrame.position.set(0, wallH > 4 ? 4.5 : 2.0, -l / 2);
  const winGlass = new THREE.Mesh(new THREE.BoxGeometry(4.3, 2.5, 0.05), windowMat);
  winGlass.position.set(0, wallH > 4 ? 4.5 : 2.0, -l / 2);
  northWallGroup.add(winFrame, winGlass);

  roomGroup.add(northWallGroup);

  // 3. FRONT WALL (South: Entryway Wall)
  const southWall = new THREE.Group();
  // Main Hall Entry Door
  const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(w - 3.4, wallH, wallThick), wallMat);
  frontWallLeft.position.set(-w / 2 + (w - 3.4) / 2, wallH / 2, l / 2);
  southWall.add(frontWallLeft);

  // Entry Door
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 6.8, 0.15), doorMat);
  doorMesh.position.set(w / 2 - 1.8, 3.4, l / 2);
  doorMesh.name = 'entry_door';
  southWall.add(doorMesh);

  // "IMSA Hall # Room #" sign above/beside door
  const signMat = new THREE.MeshStandardMaterial({ color: 0x002B49 });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.05), signMat);
  signMesh.position.set(w / 2 - 1.8, 7.2, l / 2 + 0.1);
  southWall.add(signMesh);

  roomGroup.add(southWall);

  // 4. WEST WALL (Left)
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, l), wallMat);
  westWall.position.set(-w / 2, wallH / 2, 0);
  westWall.name = 'west_wall';
  roomGroup.add(westWall);

  // 5. EAST WALL (Right)
  const eastWallGroup = new THREE.Group();
  if (config.hasQuadDoor) {
    // Wall with quad door opening
    const eastWallA = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, (l - 3.2) / 2), wallMat);
    eastWallA.position.set(w / 2, wallH / 2, -l / 4);
    const eastWallB = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, (l - 3.2) / 2), wallMat);
    eastWallB.position.set(w / 2, wallH / 2, l / 4);
    eastWallGroup.add(eastWallA, eastWallB);

    // Quad Door
    const quadDoor = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.8, 3.0), doorMat);
    quadDoor.position.set(w / 2, 3.4, 0);
    quadDoor.name = 'quad_door';
    eastWallGroup.add(quadDoor);
  } else {
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, l), wallMat);
    eastWall.position.set(w / 2, wallH / 2, 0);
    eastWallGroup.add(eastWall);
  }
  roomGroup.add(eastWallGroup);

  // 6. EN-SUITE PRIVATE BATHROOM ALCOVE (IMSA Specialty!)
  if (config.bathroomPosition !== 'none') {
    const bathGroup = new THREE.Group();
    bathGroup.name = 'bathroom_alcove';

    const bx = config.bathroomPosition === 'left-entry' ? -w / 2 + 2.5 : w / 2 - 2.5;
    const bz = l / 2 - 2.5;

    // Bathroom partition walls
    const bathWall1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, wallH, 0.2), wallMat);
    bathWall1.position.set(bx, wallH / 2, l / 2 - 5.0);
    bathGroup.add(bathWall1);

    const bathWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, wallH, 5.0), wallMat);
    const w2x = config.bathroomPosition === 'left-entry' ? -w / 2 + 5.0 : w / 2 - 5.0;
    bathWall2.position.set(w2x, wallH / 2, bz);
    bathGroup.add(bathWall2);

    // Bathroom Door
    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(2.6, 6.6, 0.12), doorMat);
    bathDoor.position.set(bx, 3.3, l / 2 - 5.0);
    bathDoor.name = 'bathroom_door';
    bathGroup.add(bathDoor);

    // Bathroom Label Marker
    const bathSign = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x007A87 }));
    bathSign.position.set(bx, 6.9, l / 2 - 4.9);
    bathGroup.add(bathSign);

    roomGroup.add(bathGroup);
  }

  // 7. Baseboards along walls
  const baseboardMat = trimMat;
  const bb1 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, 0.08), baseboardMat);
  bb1.position.set(0, 0.15, -l / 2 + 0.1);
  const bb2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, l), baseboardMat);
  bb2.position.set(-w / 2 + 0.1, 0.15, 0);
  roomGroup.add(bb1, bb2);

  return roomGroup;
}
