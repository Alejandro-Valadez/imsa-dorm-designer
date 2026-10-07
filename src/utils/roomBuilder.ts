import * as THREE from 'three';
import { RoomConfig } from '../types';

export function buildRoomShell(config: RoomConfig, cutawayWalls: boolean = true): THREE.Group {
  const roomGroup = new THREE.Group();
  roomGroup.name = 'room_shell';

  const w = config.width;
  const l = config.length;
  const h = config.ceilingHeight;

  // Materials
  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#DFD7CA'), // IMSA dorm linoleum tile tint
    roughness: 0.6,
    metalness: 0.05,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F3F1EC'), // Painted cinder block / off-white drywall
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3A2111'), // Dark brown vinyl cove base trim
    roughness: 0.5,
    metalness: 0.05,
  });

  const doorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5C3D28'), // Solid wood core door
    roughness: 0.45,
    metalness: 0.08,
  });

  const windowGlassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#93C5FD'),
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.5,
  });

  const ptacMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D1D5DB'),
    roughness: 0.4,
    metalness: 0.3,
  });

  const ptacGrilleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#374151'),
    roughness: 0.7,
    metalness: 0.2,
  });

  // Bathroom fixture materials
  const porcelainMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFFFF'),
    roughness: 0.15,
    metalness: 0.05,
  });

  const bathTileMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C7D2FE'), // Light periwinkle blue ceramic bathroom tile
    roughness: 0.3,
    metalness: 0.1,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E2E8F0'),
    roughness: 0.15,
    metalness: 0.95,
  });

  const showerGlassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E0F2FE'),
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.4,
  });

  const vanityWoodMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6B4627'),
    roughness: 0.5,
    metalness: 0.05,
  });

  // 1. MAIN ROOM FLOOR
  const floorGeo = new THREE.BoxGeometry(w, 0.2, l);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  roomGroup.add(floorMesh);

  // 1b. HIGH-DETAIL ARCHITECTURAL FLOOR GRIDS (Major 1-foot & Minor 6-inch tiles)
  // Major 1-foot grid lines
  const majorGrid = new THREE.GridHelper(
    Math.max(w, l) + 2,
    Math.round(Math.max(w, l) + 2),
    0x002B49,
    0x64748B
  );
  majorGrid.position.set(0, 0.012, 0);
  (majorGrid.material as THREE.Material).transparent = true;
  (majorGrid.material as THREE.Material).opacity = 0.55;
  roomGroup.add(majorGrid);

  // Minor 6-inch (0.5 ft) subdivisions for fine-grained placement
  const minorGrid = new THREE.GridHelper(
    Math.max(w, l) + 2,
    Math.round((Math.max(w, l) + 2) * 2),
    0x94A3B8,
    0xCBD5E1
  );
  minorGrid.position.set(0, 0.01, 0);
  (minorGrid.material as THREE.Material).transparent = true;
  (minorGrid.material as THREE.Material).opacity = 0.35;
  roomGroup.add(minorGrid);

  // Wall heights
  const wallH = cutawayWalls ? 3.2 : h;
  const wallThick = 0.35;

  // 2. BACK WALL (North: Corner Window & Corner PTAC AC Unit)
  // IMSA Architecture: Windows are always in corners, and the AC is also in that same corner!
  const northWallGroup = new THREE.Group();
  const windowWidth = 4.0;
  const cornerJamb = 0.5; // slight corner clearance post
  const winPosX = -w / 2 + cornerJamb + windowWidth / 2; // northwest corner

  // Solid corner post to the left of window
  const backWallCorner = new THREE.Mesh(new THREE.BoxGeometry(cornerJamb, wallH, wallThick), wallMat);
  backWallCorner.position.set(-w / 2 + cornerJamb / 2, wallH / 2, -l / 2);

  // Solid wall segment to the right of the window (stretching across to east wall)
  const rightWallWidth = w - cornerJamb - windowWidth;
  const backWallRight = new THREE.Mesh(new THREE.BoxGeometry(rightWallWidth, wallH, wallThick), wallMat);
  backWallRight.position.set(-w / 2 + cornerJamb + windowWidth + rightWallWidth / 2, wallH / 2, -l / 2);
  northWallGroup.add(backWallCorner, backWallRight);

  // Window Sill Ledge & Frame in the corner
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, 3.2, 0.4), trimMat);
  winFrame.position.set(winPosX, wallH > 4 ? 4.8 : 2.0, -l / 2);
  const winGlass = new THREE.Mesh(new THREE.BoxGeometry(windowWidth - 0.4, 2.8, 0.06), windowGlassMat);
  winGlass.position.set(winPosX, wallH > 4 ? 4.8 : 2.0, -l / 2);

  // Window Center Mullion (divider)
  const winMullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.8, 0.1), trimMat);
  winMullion.position.set(winPosX, wallH > 4 ? 4.8 : 2.0, -l / 2 + 0.02);

  // Window Sill Shelf (for plants/study items)
  const winSill = new THREE.Mesh(new THREE.BoxGeometry(windowWidth + 0.2, 0.12, 0.6), trimMat);
  winSill.position.set(winPosX, wallH > 4 ? 3.3 : 0.5, -l / 2 + 0.15);

  northWallGroup.add(winFrame, winGlass, winMullion, winSill);

  // PTAC Heating / Air Conditioning Unit (directly in that SAME corner underneath window!)
  const ptacGroup = new THREE.Group();
  ptacGroup.name = 'ptac_unit';
  const ptacBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 0.8), ptacMat);
  ptacBody.position.set(winPosX, 0.7, -l / 2 + 0.4);
  ptacBody.castShadow = true;

  const ptacGrille = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.35, 0.82), ptacGrilleMat);
  ptacGrille.position.set(winPosX, 1.15, -l / 2 + 0.41);

  // Digital thermostat control panel on PTAC
  const ptacPanel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.3), chromeMat);
  ptacPanel.position.set(winPosX + 1.2, 1.41, -l / 2 + 0.4);

  // Official 2-ft clearance safety perimeter zone on floor in front of corner PTAC
  const ptacZoneGeo = new THREE.PlaneGeometry(4.4, 2.0);
  const ptacZoneMat = new THREE.MeshBasicMaterial({
    color: 0xF59E0B,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });
  const ptacZone = new THREE.Mesh(ptacZoneGeo, ptacZoneMat);
  ptacZone.rotation.x = -Math.PI / 2;
  ptacZone.position.set(winPosX, 0.015, -l / 2 + 1.0);
  ptacGroup.add(ptacBody, ptacGrille, ptacPanel, ptacZone);
  northWallGroup.add(ptacGroup);

  roomGroup.add(northWallGroup);

  // 3. FRONT WALL (South: Corridor Entrance Door)
  const southWall = new THREE.Group();
  const doorWidth = 3.0; // standard 36" commercial door
  const doorMargin = 1.0;
  const doorPosX = w / 2 - doorMargin - doorWidth / 2;

  const frontWallSolid = new THREE.Mesh(
    new THREE.BoxGeometry(w - doorWidth - doorMargin, wallH, wallThick),
    wallMat
  );
  frontWallSolid.position.set(-w / 2 + (w - doorWidth - doorMargin) / 2, wallH / 2, l / 2);
  southWall.add(frontWallSolid);

  // Hallway Entry Door
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, 6.8, 0.16), doorMat);
  doorMesh.position.set(doorPosX, 3.4, l / 2);
  doorMesh.name = 'entry_door';
  southWall.add(doorMesh);

  // Chrome Lever Hardware
  const lever = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.12), chromeMat);
  lever.position.set(doorPosX - 1.2, 3.2, l / 2 - 0.1);
  southWall.add(lever);

  roomGroup.add(southWall);

  // 4. WEST WALL (Left)
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, l), wallMat);
  westWall.position.set(-w / 2, wallH / 2, 0);
  westWall.name = 'west_wall';
  roomGroup.add(westWall);

  // 5. EAST WALL (Right)
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, l), wallMat);
  eastWall.position.set(w / 2, wallH / 2, 0);
  eastWall.name = 'east_wall';
  roomGroup.add(eastWall);

  // 6. EN-SUITE PRIVATE BATHROOM (With 3D Shower, Toilet, and Vanity Sink!)
  if (config.bathroomPosition !== 'none') {
    const bathGroup = new THREE.Group();
    bathGroup.name = 'bathroom_alcove';

    const bathW = 4.5;
    const bathL = 5.0;
    const isLeft = config.bathroomPosition === 'left-entry';
    const bx = isLeft ? -w / 2 + bathW / 2 : w / 2 - bathW / 2;
    const bz = l / 2 - bathL / 2;

    // A. Ceramic Bathroom Tiled Floor
    const bathFloorGeo = new THREE.BoxGeometry(bathW, 0.22, bathL);
    const bathFloor = new THREE.Mesh(bathFloorGeo, bathTileMat);
    bathFloor.position.set(bx, -0.09, bz);
    bathFloor.receiveShadow = true;
    bathGroup.add(bathFloor);

    // Tiled Floor Grid Lines inside bathroom
    const bathGrid = new THREE.GridHelper(Math.max(bathW, bathL), Math.round(Math.max(bathW, bathL) * 2), 0x312E81, 0x818CF8);
    bathGrid.position.set(bx, 0.025, bz);
    (bathGrid.material as THREE.Material).transparent = true;
    (bathGrid.material as THREE.Material).opacity = 0.4;
    bathGroup.add(bathGrid);

    // B. Bathroom Partition Walls
    // In cutaway mode, lower the inner walls to 2.2 ft so the shower, toilet, and sink are 100% visible!
    const bathWallHeight = cutawayWalls ? 2.2 : wallH;

    // North partition wall
    const bathWallNorth = new THREE.Mesh(new THREE.BoxGeometry(bathW, bathWallHeight, 0.2), wallMat);
    bathWallNorth.position.set(bx, bathWallHeight / 2, l / 2 - bathL);
    bathGroup.add(bathWallNorth);

    // Inner partition wall
    const bathWallInner = new THREE.Mesh(new THREE.BoxGeometry(0.2, bathWallHeight, bathL), wallMat);
    const wInnerX = isLeft ? -w / 2 + bathW : w / 2 - bathW;
    bathWallInner.position.set(wInnerX, bathWallHeight / 2, bz);
    bathGroup.add(bathWallInner);

    // Bathroom Door Frame & Door (swung open so you see inside!)
    const bathDoorSwing = new THREE.Mesh(new THREE.BoxGeometry(2.3, 6.4, 0.1), doorMat);
    bathDoorSwing.position.set(bx, 3.2, l / 2 - bathL);
    bathDoorSwing.rotation.y = isLeft ? 0.6 : -0.6;
    bathGroup.add(bathDoorSwing);

    // Plaque above bathroom: "PRIVATE BATH"
    const bathSign = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.35, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x007A87 })
    );
    bathSign.position.set(bx, wallH > 4 ? 6.8 : 2.5, l / 2 - bathL - 0.1);
    bathGroup.add(bathSign);

    // ==========================================
    // C. 3D SHOWER STALL (3ft x 3ft Stall Shower)
    // ==========================================
    const showerGroup = new THREE.Group();
    showerGroup.name = 'shower_stall';
    const showerX = isLeft ? -w / 2 + 1.6 : w / 2 - 1.6;
    const showerZ = l / 2 - bathL + 1.6;

    // Shower Base Tray / Curb
    const showerTray = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 2.8), porcelainMat);
    showerTray.position.set(showerX, 0.175, showerZ);
    showerTray.castShadow = true;
    showerTray.receiveShadow = true;
    showerGroup.add(showerTray);

    // Chrome Drain
    const showerDrain = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), chromeMat);
    showerDrain.position.set(showerX, 0.36, showerZ);
    showerGroup.add(showerDrain);

    // Glass Shower Screen / Door
    const showerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.5, 2.6), showerGlassMat);
    showerGlass.position.set(isLeft ? showerX + 1.35 : showerX - 1.35, 2.4, showerZ);
    showerGroup.add(showerGlass);

    // Chrome Shower Pipe & Head
    const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.5, 8), chromeMat);
    showerPipe.position.set(showerX, 3.2, showerZ - 1.3);
    const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.08, 0.1, 16), chromeMat);
    showerHead.position.set(showerX, 4.8, showerZ - 1.0);
    showerHead.rotation.x = 0.5;

    // Hot/Cold mixer valve handle
    const mixerValve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8), chromeMat);
    mixerValve.position.set(showerX, 2.8, showerZ - 1.35);
    mixerValve.rotation.x = Math.PI / 2;
    showerGroup.add(showerPipe, showerHead, mixerValve);

    bathGroup.add(showerGroup);

    // ==========================================
    // D. 3D CERAMIC TOILET
    // ==========================================
    const toiletGroup = new THREE.Group();
    toiletGroup.name = 'porcelain_toilet';
    const toiletX = isLeft ? -w / 2 + 1.2 : w / 2 - 1.2;
    const toiletZ = l / 2 - 1.3;

    // Toilet Bowl
    const bowlGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.2, 16);
    bowlGeo.scale(1.0, 1.0, 1.25);
    const bowl = new THREE.Mesh(bowlGeo, porcelainMat);
    bowl.position.set(toiletX, 0.6, toiletZ);
    bowl.castShadow = true;
    toiletGroup.add(bowl);

    // Toilet Seat Rim & Cover
    const seatGeo = new THREE.BoxGeometry(1.0, 0.08, 1.25);
    const seat = new THREE.Mesh(seatGeo, porcelainMat);
    seat.position.set(toiletX, 1.24, toiletZ);
    toiletGroup.add(seat);

    // Water Tank
    const tank = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.55), porcelainMat);
    tank.position.set(toiletX, 1.7, toiletZ + 0.7);
    tank.castShadow = true;
    toiletGroup.add(tank);

    // Chrome Flush Lever
    const flushLever = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.08), chromeMat);
    flushLever.position.set(toiletX - 0.5, 2.15, toiletZ + 0.7);
    toiletGroup.add(flushLever);

    // Chrome Toilet Paper Holder on side wall
    const tpRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 12), porcelainMat);
    tpRoll.position.set(isLeft ? -w / 2 + 0.2 : w / 2 - 0.2, 1.8, toiletZ);
    tpRoll.rotation.z = Math.PI / 2;
    toiletGroup.add(tpRoll);

    bathGroup.add(toiletGroup);

    // ==========================================
    // E. 3D VANITY SINK & MIRROR
    // ==========================================
    const vanityGroup = new THREE.Group();
    vanityGroup.name = 'bathroom_vanity';
    const vanityX = isLeft ? -w / 2 + 3.4 : w / 2 - 3.4;
    const vanityZ = l / 2 - 1.4;

    // Vanity Cabinet Base
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 1.6), vanityWoodMat);
    cabinet.position.set(vanityX, 1.2, vanityZ);
    cabinet.castShadow = true;
    vanityGroup.add(cabinet);

    // Ceramic Countertop & Sink Basin
    const sinkTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.15, 1.7), porcelainMat);
    sinkTop.position.set(vanityX, 2.45, vanityZ);
    sinkTop.castShadow = true;
    vanityGroup.add(sinkTop);

    // Chrome Faucet Tap
    const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), chromeMat);
    faucetStem.position.set(vanityX, 2.65, vanityZ + 0.5);
    const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.25), chromeMat);
    faucetSpout.position.set(vanityX, 2.8, vanityZ + 0.4);
    vanityGroup.add(faucetStem, faucetSpout);

    // Vanity Mirror above Sink
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 0.08), vanityWoodMat);
    mirrorFrame.position.set(vanityX, 4.0, l / 2 - 0.1);
    const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.02), chromeMat);
    mirrorGlass.position.set(vanityX, 4.0, l / 2 - 0.14);
    vanityGroup.add(mirrorFrame, mirrorGlass);

    // Towel Bar with hanging white towel
    const towelBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.08), chromeMat);
    towelBar.position.set(vanityX, 2.0, vanityZ - 0.85);
    const towel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.06), porcelainMat);
    towel.position.set(vanityX, 1.6, vanityZ - 0.88);
    vanityGroup.add(towelBar, towel);

    bathGroup.add(vanityGroup);

    roomGroup.add(bathGroup);
  }

  // 7. Baseboards
  const bbNorth = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, 0.08), trimMat);
  bbNorth.position.set(0, 0.15, -l / 2 + 0.15);
  const bbWest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, l), trimMat);
  bbWest.position.set(-w / 2 + 0.15, 0.15, 0);
  const bbEast = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, l), trimMat);
  bbEast.position.set(w / 2 - 0.15, 0.15, 0);
  roomGroup.add(bbNorth, bbWest, bbEast);

  return roomGroup;
}
