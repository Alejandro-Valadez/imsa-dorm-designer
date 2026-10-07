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
    roughness: 0.65,
    metalness: 0.05
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F1EFEA'), // Off-white painted cinder block / drywall
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3A2111'), // Dark brown vinyl cove base trim
    roughness: 0.5,
    metalness: 0.05
  });

  const doorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5C3D28'), // Solid wood core door
    roughness: 0.45,
    metalness: 0.08
  });

  const windowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#93C5FD'),
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.55
  });

  const ptacMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D1D5DB'), // Beige/off-white metal AC cover
    roughness: 0.4,
    metalness: 0.3
  });

  const ptacGrilleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#4B5563'),
    roughness: 0.7,
    metalness: 0.2
  });

  // 1. FLOOR
  const floorGeo = new THREE.BoxGeometry(w, 0.2, l);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  roomGroup.add(floorMesh);

  // 1b. 1-Foot Grid Overlay on floor
  const gridHelper = new THREE.GridHelper(Math.max(w, l) + 2, Math.round(Math.max(w, l) + 2), 0x002B49, 0xCBD5E1);
  gridHelper.position.set(0, 0.01, 0);
  roomGroup.add(gridHelper);

  // Wall height (cutaway mode allows seeing inside with orbital cameras)
  const wallH = cutawayWalls ? 3.5 : h;
  const wallThick = 0.35;

  // 2. BACK WALL (North: Exterior Window Wall & PTAC Unit)
  const northWallGroup = new THREE.Group();
  const windowWidth = 4.8;
  const wallSideWidth = (w - windowWidth) / 2;

  const backWallLeft = new THREE.Mesh(new THREE.BoxGeometry(wallSideWidth, wallH, wallThick), wallMat);
  backWallLeft.position.set(-w / 2 + wallSideWidth / 2, wallH / 2, -l / 2);
  const backWallRight = new THREE.Mesh(new THREE.BoxGeometry(wallSideWidth, wallH, wallThick), wallMat);
  backWallRight.position.set(w / 2 - wallSideWidth / 2, wallH / 2, -l / 2);
  northWallGroup.add(backWallLeft, backWallRight);

  // Window Sill, Frame & Glazing
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, 3.2, 0.38), trimMat);
  winFrame.position.set(0, wallH > 4 ? 4.8 : 2.2, -l / 2);
  const winGlass = new THREE.Mesh(new THREE.BoxGeometry(windowWidth - 0.4, 2.8, 0.05), windowMat);
  winGlass.position.set(0, wallH > 4 ? 4.8 : 2.2, -l / 2);
  northWallGroup.add(winFrame, winGlass);

  // PTAC (Packaged Terminal Air Conditioner / Heater) Unit under the window!
  // IMSA rooms have a wall PTAC unit beneath the window that requires 2 feet clearance
  const ptacGroup = new THREE.Group();
  ptacGroup.name = 'ptac_unit';
  const ptacBody = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 0.8), ptacMat);
  ptacBody.position.set(0, 0.7, -l / 2 + 0.4);
  ptacBody.castShadow = true;
  const ptacGrille = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 0.82), ptacGrilleMat);
  ptacGrille.position.set(0, 1.15, -l / 2 + 0.41);
  // 2-ft clearance zone indicator dashed outline on floor
  const ptacZoneMat = new THREE.MeshBasicMaterial({
    color: 0xF59E0B,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const ptacZoneMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.0), ptacZoneMat);
  ptacZoneMesh.rotation.x = -Math.PI / 2;
  ptacZoneMesh.position.set(0, 0.015, -l / 2 + 1.0);
  ptacGroup.add(ptacBody, ptacGrille, ptacZoneMesh);
  northWallGroup.add(ptacGroup);

  roomGroup.add(northWallGroup);

  // 3. FRONT WALL (South: Entryway & Corridor Door)
  const southWall = new THREE.Group();
  const doorWidth = 3.0; // standard 36" commercial door
  const doorMargin = 1.0;
  const doorPosX = w / 2 - doorMargin - doorWidth / 2;

  const frontWallSolid = new THREE.Mesh(new THREE.BoxGeometry(w - doorWidth - doorMargin, wallH, wallThick), wallMat);
  frontWallSolid.position.set(-w / 2 + (w - doorWidth - doorMargin) / 2, wallH / 2, l / 2);
  southWall.add(frontWallSolid);

  // Hall Entry Door
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, 6.8, 0.16), doorMat);
  doorMesh.position.set(doorPosX, 3.4, l / 2);
  doorMesh.name = 'entry_door';
  southWall.add(doorMesh);

  // Door Lever Hardware
  const leverMat = new THREE.MeshStandardMaterial({ color: 0xD1D5DB, roughness: 0.2, metalness: 0.9 });
  const lever = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.12), leverMat);
  lever.position.set(doorPosX - 1.2, 3.2, l / 2 - 0.1);
  southWall.add(lever);

  // Hall Identification Plaque (e.g. "1501-102")
  const signMat = new THREE.MeshStandardMaterial({ color: 0x002B49, roughness: 0.3 });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.05), signMat);
  signMesh.position.set(doorPosX, 7.2, l / 2 + 0.1);
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
    // Quad Room connecting door
    const segL = (l - 3.2) / 2;
    const eastWallA = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, segL), wallMat);
    eastWallA.position.set(w / 2, wallH / 2, -l / 4 - 0.8);
    const eastWallB = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, segL), wallMat);
    eastWallB.position.set(w / 2, wallH / 2, l / 4 + 0.8);
    eastWallGroup.add(eastWallA, eastWallB);

    const quadDoor = new THREE.Mesh(new THREE.BoxGeometry(0.14, 6.8, 3.0), doorMat);
    quadDoor.position.set(w / 2, 3.4, 0);
    quadDoor.name = 'quad_door';
    eastWallGroup.add(quadDoor);
  } else {
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, l), wallMat);
    eastWall.position.set(w / 2, wallH / 2, 0);
    eastWallGroup.add(eastWall);
  }
  roomGroup.add(eastWallGroup);

  // 6. EN-SUITE PRIVATE BATHROOM (IMSA Signature Feature)
  // Shared only between the two roommates. Standard 4.5' x 5.0' enclosure with 3'x3' stall shower & sink.
  if (config.bathroomPosition !== 'none') {
    const bathGroup = new THREE.Group();
    bathGroup.name = 'bathroom_alcove';

    const bathW = 4.5;
    const bathL = 5.0;
    const isLeft = config.bathroomPosition === 'left-entry';
    const bx = isLeft ? -w / 2 + bathW / 2 : w / 2 - bathW / 2;
    const bz = l / 2 - bathL / 2;

    // Bathroom north partition wall
    const bathWallNorth = new THREE.Mesh(new THREE.BoxGeometry(bathW, wallH, 0.22), wallMat);
    bathWallNorth.position.set(bx, wallH / 2, l / 2 - bathL);
    bathGroup.add(bathWallNorth);

    // Bathroom inner partition wall
    const bathWallInner = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallH, bathL), wallMat);
    const wInnerX = isLeft ? -w / 2 + bathW : w / 2 - bathW;
    bathWallInner.position.set(wInnerX, wallH / 2, bz);
    bathGroup.add(bathWallInner);

    // Bathroom Doorway & Door (opens inward into bath or swings along wall)
    const bathDoor = new THREE.Mesh(new THREE.BoxGeometry(2.5, 6.6, 0.12), doorMat);
    bathDoor.position.set(bx, 3.3, l / 2 - bathL);
    bathDoor.name = 'bathroom_door';
    bathGroup.add(bathDoor);

    // Plaque above bathroom door
    const bathSign = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x007A87 })
    );
    bathSign.position.set(bx, 6.8, l / 2 - bathL + 0.1);
    bathGroup.add(bathSign);

    roomGroup.add(bathGroup);
  }

  // 7. Baseboards along floor perimeter
  const bbNorth = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, 0.08), trimMat);
  bbNorth.position.set(0, 0.15, -l / 2 + 0.15);
  const bbWest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, l), trimMat);
  bbWest.position.set(-w / 2 + 0.15, 0.15, 0);
  const bbEast = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, l), trimMat);
  bbEast.position.set(w / 2 - 0.15, 0.15, 0);
  roomGroup.add(bbNorth, bbWest, bbEast);

  return roomGroup;
}
