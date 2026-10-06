import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraViewMode, LightingMode, PlacedItem, RoomConfig } from '../types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';
import { buildFurnitureMesh } from '../utils/meshBuilders';
import { buildRoomShell } from '../utils/roomBuilder';

interface ThreeCanvasProps {
  roomConfig: RoomConfig;
  placedItems: PlacedItem[];
  selectedItemInstanceId: string | null;
  onSelectItem: (instanceId: string | null) => void;
  onUpdateItemPosition: (instanceId: string, x: number, z: number) => void;
  viewMode: CameraViewMode;
  lightingMode: LightingMode;
  cutawayWalls: boolean;
  snapGrid: number; // e.g. 0.5 or 0.25 feet
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

  // 1. Initialize Scene & Three.js Renderer
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0B131E');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 18, 22);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below floor
    controls.minDistance = 3;
    controls.maxDistance = 50;
    controls.target.set(0, 2, 0);
    controlsRef.current = controls;

    // Lights Container
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // Items Group
    const itemsGroup = new THREE.Group();
    itemsGroup.name = 'placed_items';
    scene.add(itemsGroup);
    itemsGroupRef.current = itemsGroup;

    // Selection Indicator Group
    const selGroup = new THREE.Group();
    selGroup.name = 'selection_indicator';
    scene.add(selGroup);
    selectionIndicatorRef.current = selGroup;

    // Snapshot Function
    onRegisterSnapshotFn(() => {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // 2. Update Lights based on lightingMode
  useEffect(() => {
    if (!lightsGroupRef.current || !sceneRef.current) return;
    const group = lightsGroupRef.current;
    group.clear();

    if (lightingMode === 'day') {
      sceneRef.current.background = new THREE.Color('#0F172A');
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
      hemiLight.position.set(0, 20, 0);
      group.add(hemiLight);

      // Window sunlight
      const sunLight = new THREE.DirectionalLight(0xFFF7ED, 1.4);
      sunLight.position.set(0, 12, -15);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 40;
      sunLight.shadow.camera.left = -15;
      sunLight.shadow.camera.right = 15;
      sunLight.shadow.camera.top = 15;
      sunLight.shadow.camera.bottom = -15;
      group.add(sunLight);
    } else if (lightingMode === 'golden') {
      sceneRef.current.background = new THREE.Color('#1A1324');
      const hemiLight = new THREE.HemisphereLight(0xFDBA74, 0x332211, 0.7);
      group.add(hemiLight);

      const sunsetLight = new THREE.DirectionalLight(0xF97316, 1.8);
      sunsetLight.position.set(10, 8, -14);
      sunsetLight.castShadow = true;
      group.add(sunsetLight);
    } else {
      // Night Study Mode
      sceneRef.current.background = new THREE.Color('#060B12');
      const ambient = new THREE.AmbientLight(0x1E293B, 0.5);
      group.add(ambient);

      // Warm desk glow
      const studyLamp1 = new THREE.PointLight(0xFDE047, 1.5, 12);
      studyLamp1.position.set(0, 4, -4);
      studyLamp1.castShadow = true;
      group.add(studyLamp1);

      // Fairy light ambient glow
      const fairyLight = new THREE.PointLight(0xA855F7, 0.8, 15);
      fairyLight.position.set(-4, 6, 2);
      group.add(fairyLight);
    }
  }, [lightingMode]);

  // 3. Update Camera based on viewMode
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (viewMode === 'orbit-3d') {
      cam.position.set(0, 16, 20);
      ctrl.target.set(0, 2, 0);
      cam.lookAt(0, 2, 0);
    } else if (viewMode === 'top-down-2d') {
      // Direct 2D blueprint overhead
      cam.position.set(0, 24, 0.001);
      ctrl.target.set(0, 0, 0);
      cam.lookAt(0, 0, 0);
    } else if (viewMode === 'isometric') {
      cam.position.set(18, 18, 18);
      ctrl.target.set(0, 2, 0);
      cam.lookAt(0, 2, 0);
    } else if (viewMode === 'eye-level') {
      // Standing in the room doorway looking inside
      cam.position.set(roomConfig.width / 2 - 2, 5.0, roomConfig.length / 2 - 1);
      ctrl.target.set(0, 3.5, 0);
      cam.lookAt(0, 3.5, 0);
    }
    ctrl.update();
  }, [viewMode, roomConfig.width, roomConfig.length]);

  // 4. Build & Update Room Shell
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing room shell
    const existing = scene.getObjectByName('room_shell');
    if (existing) scene.remove(existing);

    const roomShell = buildRoomShell(roomConfig, cutawayWalls);
    scene.add(roomShell);
  }, [roomConfig, cutawayWalls]);

  // 5. Update Placed Furniture Meshes
  useEffect(() => {
    if (!itemsGroupRef.current) return;
    const itemsGroup = itemsGroupRef.current;
    itemsGroup.clear();

    placedItems.forEach((item) => {
      const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
      if (!def) return;

      const mesh = buildFurnitureMesh(def, item.color);
      mesh.position.set(item.x, item.y, item.z);
      mesh.rotation.y = (item.rotationY * Math.PI) / 180;
      mesh.userData = { instanceId: item.instanceId, definitionId: item.definitionId };
      itemsGroup.add(mesh);
    });
  }, [placedItems]);

  // 6. Update Selection Box Indicator
  useEffect(() => {
    if (!selectionIndicatorRef.current) return;
    const selGroup = selectionIndicatorRef.current;
    selGroup.clear();

    if (!selectedItemInstanceId) return;

    const item = placedItems.find((p) => p.instanceId === selectedItemInstanceId);
    if (!item) return;

    const def = FURNITURE_CATALOG.find((d) => d.id === item.definitionId);
    if (!def) return;

    // Create a sleek glowing bounding outline on the floor
    const ringGeo = new THREE.RingGeometry(0.1, 0.2, 32);
    const boxHelperGeo = new THREE.BoxGeometry(def.width + 0.15, 0.05, def.depth + 0.15);
    const edgeGeo = new THREE.EdgesGeometry(boxHelperGeo);
    const outlineMat = new THREE.LineBasicMaterial({ color: 0xF59E0B, linewidth: 2 });
    const outline = new THREE.LineSegments(edgeGeo, outlineMat);

    outline.position.set(item.x, 0.02, item.z);
    outline.rotation.y = (item.rotationY * Math.PI) / 180;
    selGroup.add(outline);

    // Glowing corner brackets
    const bracketMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const cornerW = def.width / 2 + 0.1;
    const cornerD = def.depth / 2 + 0.1;
    [
      [-cornerW, -cornerD],
      [cornerW, -cornerD],
      [-cornerW, cornerD],
      [cornerW, cornerD],
    ].forEach(([cx, cz]) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.2), bracketMat);
      p.position.set(item.x + cx, 0.04, item.z + cz);
      selGroup.add(p);
    });
  }, [selectedItemInstanceId, placedItems]);

  // 7. Interactive Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !itemsGroupRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Raycast against furniture items
    const intersects = raycaster.intersectObjects(itemsGroupRef.current.children, true);

    if (intersects.length > 0) {
      // Find top-level item mesh with userData.instanceId
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

        // Calculate offset between intersection point on floor and item position
        const floorIntersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(floorPlaneRef.current, floorIntersection);
        const item = placedItems.find((p) => p.instanceId === id);
        if (item && floorIntersection) {
          dragOffsetRef.current.set(item.x - floorIntersection.x, 0, item.z - floorIntersection.z);
        }
      }
    } else {
      // Clicked on empty space / floor
      onSelectItem(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !draggedItemIdRef.current || !mountRef.current || !cameraRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const floorIntersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(floorPlaneRef.current, floorIntersection)) {
      const targetX = floorIntersection.x + dragOffsetRef.current.x;
      const targetZ = floorIntersection.z + dragOffsetRef.current.z;

      // Snap to grid
      const snappedX = Math.round(targetX / snapGrid) * snapGrid;
      const snappedZ = Math.round(targetZ / snapGrid) * snapGrid;

      // Constrain within room bounds
      const halfW = roomConfig.width / 2 - 0.5;
      const halfL = roomConfig.length / 2 - 0.5;
      const clampedX = Math.max(-halfW, Math.min(halfW, snappedX));
      const clampedZ = Math.max(-halfL, Math.min(halfL, snappedZ));

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
