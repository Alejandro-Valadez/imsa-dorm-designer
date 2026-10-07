import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraViewMode, LightingMode, PlacedItem, RoomConfig } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { buildRoomShell } from '../utils/roomBuilder';
import { buildFurnitureMesh } from '../utils/meshBuilders';

interface ThreeCanvasProps {
  roomConfig: RoomConfig;
  placedItems: PlacedItem[];
  selectedItemInstanceId: string | null;
  onSelectItem: (instanceId: string | null) => void;
  onUpdateItemPosition: (instanceId: string, x: number, z: number) => void;
  viewMode: CameraViewMode;
  lightingMode: LightingMode;
  cutawayWalls: boolean;
  snapGrid: number;
  onRegisterSnapshotFn: (fn: () => string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  roomConfig,
  placedItems,
  selectedItemInstanceId,
  onSelectItem,
  onUpdateItemPosition,
  viewMode,
  lightingMode,
  cutawayWalls,
  snapGrid,
  onRegisterSnapshotFn,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const itemsGroupRef = useRef<THREE.Group | null>(null);
  const selectionIndicatorRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Dragging state
  const isDraggingRef = useRef(false);
  const draggedItemIdRef = useRef<string | null>(null);
  const floorPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // 1. Initialize Scene & Three.js Renderer (Zoomed closer for bigger room view)
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#08101C');

    // Camera FOV 42 with closer position gives an immersive, grand room presence
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 11, 14.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // don't go below floor
    controls.minDistance = 2.5; // allowed to zoom in very close
    controls.maxDistance = 35;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // Lights Container
    const lightsGroup = new THREE.Group();
    lightsGroup.name = 'lights';
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // Furniture Items Group
    const itemsGroup = new THREE.Group();
    itemsGroup.name = 'furniture_items';
    scene.add(itemsGroup);
    itemsGroupRef.current = itemsGroup;

    // Selection Indicator Group
    const selGroup = new THREE.Group();
    selGroup.name = 'selection_indicator';
    scene.add(selGroup);
    selectionIndicatorRef.current = selGroup;

    // Provide snapshot generator callback
    onRegisterSnapshotFn(() => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return '';
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      return rendererRef.current.domElement.toDataURL('image/png');
    });

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // 2. Update Lights based on lightingMode
  useEffect(() => {
    if (!lightsGroupRef.current || !sceneRef.current) return;
    const group = lightsGroupRef.current;
    group.clear();

    if (lightingMode === 'day') {
      sceneRef.current.background = new THREE.Color('#0A131F');
      const ambient = new THREE.AmbientLight(0xffffff, 0.95);
      const sun = new THREE.DirectionalLight(0xfffaf0, 1.4);
      sun.position.set(6, 16, -10); // streaming through north window
      sun.castShadow = true;
      sun.shadow.mapSize.width = 2048;
      sun.shadow.mapSize.height = 2048;
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far = 40;
      sun.shadow.camera.left = -12;
      sun.shadow.camera.right = 12;
      sun.shadow.camera.top = 12;
      sun.shadow.camera.bottom = -12;
      sun.shadow.bias = -0.0005;

      const fill = new THREE.DirectionalLight(0x93C5FD, 0.45);
      fill.position.set(-8, 12, 10);
      group.add(ambient, sun, fill);
    } else if (lightingMode === 'golden') {
      sceneRef.current.background = new THREE.Color('#140F1E');
      const ambient = new THREE.AmbientLight(0xFDBA74, 0.65);
      const sunset = new THREE.DirectionalLight(0xFB923C, 1.8);
      sunset.position.set(12, 8, -12);
      sunset.castShadow = true;
      group.add(ambient, sunset);
    } else {
      // Night study mode
      sceneRef.current.background = new THREE.Color('#05080E');
      const ambient = new THREE.AmbientLight(0x1E293B, 0.55);
      group.add(ambient);

      // Warm desk glow
      const studyLamp1 = new THREE.PointLight(0xFDE047, 1.6, 14);
      studyLamp1.position.set(0, 4, -4);
      studyLamp1.castShadow = true;
      group.add(studyLamp1);

      // Fairy light ambient glow
      const fairyLight = new THREE.PointLight(0xA855F7, 0.9, 15);
      fairyLight.position.set(-4, 6, 2);
      group.add(fairyLight);
    }
  }, [lightingMode]);

  // 3. Update Camera based on viewMode (Tightly framed so room is big and clear)
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (viewMode === 'orbit-3d') {
      cam.position.set(0, 11, 14.5);
      ctrl.target.set(0, 1.8, 0);
      cam.lookAt(0, 1.8, 0);
    } else if (viewMode === 'top-down-2d') {
      // Direct 2D blueprint overhead, closely framed
      cam.position.set(0, 15.5, 0.001);
      ctrl.target.set(0, 0, 0);
      cam.lookAt(0, 0, 0);
    } else if (viewMode === 'isometric') {
      cam.position.set(12.5, 12.5, 12.5);
      ctrl.target.set(0, 1.5, 0);
      cam.lookAt(0, 1.5, 0);
    } else if (viewMode === 'eye-level') {
      // Standing in the room doorway looking inside
      cam.position.set(roomConfig.width / 2 - 2.5, 4.8, roomConfig.length / 2 - 1.2);
      ctrl.target.set(0, 3.2, 0);
      cam.lookAt(0, 3.2, 0);
    }
    ctrl.update();
  }, [viewMode, roomConfig.width, roomConfig.length]);

  // 4. Build or Rebuild Room Shell (Floor, Walls, Bathroom, PTAC)
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const existing = scene.getObjectByName('room_shell');
    if (existing) scene.remove(existing);

    const roomShell = buildRoomShell(roomConfig, cutawayWalls);
    scene.add(roomShell);
  }, [roomConfig, cutawayWalls]);

  // 5. Render Placed Furniture Items
  useEffect(() => {
    if (!itemsGroupRef.current) return;
    const group = itemsGroupRef.current;
    group.clear();

    placedItems.forEach((item) => {
      const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
      if (!def) return;

      const mesh = buildFurnitureMesh(item, def);
      mesh.position.set(item.x, item.y, item.z);
      mesh.rotation.y = (item.rotationY * Math.PI) / 180;
      mesh.userData = { instanceId: item.instanceId };

      group.add(mesh);
    });
  }, [placedItems]);

  // 6. Selection Highlight Overlay
  useEffect(() => {
    if (!selectionIndicatorRef.current) return;
    const selGroup = selectionIndicatorRef.current;
    selGroup.clear();

    if (!selectedItemInstanceId) return;

    const item = placedItems.find((p) => p.instanceId === selectedItemInstanceId);
    if (!item) return;

    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def) return;

    const boxHelperGeo = new THREE.BoxGeometry(def.width + 0.15, 0.05, def.depth + 0.15);
    const edgeGeo = new THREE.EdgesGeometry(boxHelperGeo);
    const outlineMat = new THREE.LineBasicMaterial({ color: 0xF5C242, linewidth: 2 });
    const outline = new THREE.LineSegments(edgeGeo, outlineMat);

    outline.position.set(item.x, 0.02, item.z);
    outline.rotation.y = (item.rotationY * Math.PI) / 180;
    selGroup.add(outline);

    // Glowing corner brackets
    const bracketMat = new THREE.MeshBasicMaterial({ color: 0xF5C242 });
    const cornerW = def.width / 2 + 0.1;
    const cornerD = def.depth / 2 + 0.1;
    [
      [cornerW, cornerD],
      [-cornerW, cornerD],
      [cornerW, -cornerD],
      [-cornerW, -cornerD],
    ].forEach(([cx, cz]) => {
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8), bracketMat);
      pin.position.set(item.x + cx, 0.05, item.z + cz);
      selGroup.add(pin);
    });
  }, [selectedItemInstanceId, placedItems]);

  // 7. Interactive Pointer & Wall-Aware Collision Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !itemsGroupRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(itemsGroupRef.current.children, true);

    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      while (current && current.parent && !current.userData?.instanceId) {
        current = current.parent;
      }

      if (current && current.userData?.instanceId) {
        const id = current.userData.instanceId;
        onSelectItem(id);

        isDraggingRef.current = true;
        draggedItemIdRef.current = id;
        if (controlsRef.current) controlsRef.current.enabled = false;

        const floorIntersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(floorPlaneRef.current, floorIntersection);
        const item = placedItems.find((p) => p.instanceId === id);
        if (item) {
          dragOffsetRef.current.set(item.x - floorIntersection.x, 0, item.z - floorIntersection.z);
        }
      }
    } else {
      onSelectItem(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !draggedItemIdRef.current || !cameraRef.current || !mountRef.current)
      return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const floorIntersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(floorPlaneRef.current, floorIntersection)) {
      const targetX = floorIntersection.x + dragOffsetRef.current.x;
      const targetZ = floorIntersection.z + dragOffsetRef.current.z;

      // Snap to fine grid
      const snappedX = Math.round(targetX / snapGrid) * snapGrid;
      const snappedZ = Math.round(targetZ / snapGrid) * snapGrid;

      // PHYSICAL WALL COLLISION & ROOM BOUNDARY CLAMPING:
      // Calculate true bounding box of the item based on its rotation
      const currentItem = placedItems.find((p) => p.instanceId === draggedItemIdRef.current);
      const def = currentItem ? FURNITURE_CATALOG.find((d) => d.id === currentItem.definitionId) : null;
      const isRotated90 = currentItem ? Math.round(currentItem.rotationY / 90) % 2 !== 0 : false;
      const itemW = def ? (isRotated90 ? def.depth : def.width) : 1.0;
      const itemD = def ? (isRotated90 ? def.width : def.depth) : 1.0;

      // Perimeter room walls limits (items CANNOT physically face or penetrate through walls!)
      const halfW = roomConfig.width / 2;
      const halfL = roomConfig.length / 2;
      const minX = -halfW + itemW / 2;
      const maxX = halfW - itemW / 2;
      const minZ = -halfL + itemD / 2;
      const maxZ = halfL - itemD / 2;

      let clampedX = Math.max(minX, Math.min(maxX, snappedX));
      let clampedZ = Math.max(minZ, Math.min(maxZ, snappedZ));

      // PTAC Heater physical body in the corner underneath corner window
      const cornerPtacX = -halfW + 0.5 + 2.0;
      if (Math.abs(clampedX - cornerPtacX) < 1.8 + itemW / 2 && clampedZ - itemD / 2 < -halfL + 0.85) {
        clampedZ = -halfL + 0.85 + itemD / 2;
      }

      // En-Suite Private Bathroom Walls Collision
      // (Student bedroom furniture cannot penetrate inside the bathroom footprint)
      if (roomConfig.bathroomPosition !== 'none') {
        const bathW = 4.5;
        const bathL = 5.0;
        const isLeft = roomConfig.bathroomPosition === 'left-entry';
        const bathMinX = isLeft ? -halfW : halfW - bathW;
        const bathMaxX = isLeft ? -halfW + bathW : halfW;
        const bathMinZ = halfL - bathL;
        const bathMaxZ = halfL;

        // Check if item bounding box overlaps the bathroom enclosure
        const itemLeft = clampedX - itemW / 2;
        const itemRight = clampedX + itemW / 2;
        const itemBack = clampedZ - itemD / 2;
        const itemFront = clampedZ + itemD / 2;

        const overlapsX = itemRight > bathMinX && itemLeft < bathMaxX;
        const overlapsZ = itemFront > bathMinZ && itemBack < bathMaxZ;

        if (overlapsX && overlapsZ) {
          // Push out along the shortest collision vector (either North of bath or East/West of bath)
          const distToBathNorth = Math.abs(itemFront - bathMinZ);
          const distToBathInner = isLeft
            ? Math.abs(itemLeft - bathMaxX)
            : Math.abs(itemRight - bathMinX);

          if (distToBathNorth < distToBathInner) {
            // Push forward (North) of the bathroom wall
            clampedZ = bathMinZ - itemD / 2;
          } else {
            // Push outside the bathroom side partition wall
            if (isLeft) {
              clampedX = bathMaxX + itemW / 2;
            } else {
              clampedX = bathMinX - itemW / 2;
            }
          }
        }
      }

      onUpdateItemPosition(draggedItemIdRef.current, clampedX, clampedZ);
    }
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      draggedItemIdRef.current = null;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing outline-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
};
