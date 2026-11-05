import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { planetDataList, planetDescriptions } from '../data';
import { DestinationArea, PlanetData } from '../types';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createEarthCloudsTexture,
  createMoonTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createUranusTexture,
  createNeptuneTexture,
  createPlutoTexture,
} from '../utils/planetTextures';

export interface SolarSystemHandle {
  resetCamera: () => void;
  focusPlanet: (key: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface SolarSystemProps {
  onOpenDestination: (area: DestinationArea) => void;
}

interface PlanetSceneItem extends PlanetData {
  pivot: THREE.Group;
  tiltGroup: THREE.Group;
  sphere: THREE.Mesh;
  angle: number;
  cloud?: THREE.Mesh | null;
  moonPivot?: THREE.Group | null;
}

export const SolarSystem = forwardRef<SolarSystemHandle, SolarSystemProps>(
  ({ onOpenDestination }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [selectedPlanetKey, setSelectedPlanetKey] = useState<string | null>(null);
    const [isOrbitPaused, setIsOrbitPaused] = useState(false);
    const [webglError, setWebglError] = useState(false);

    const isOrbitPausedRef = useRef(false);
    isOrbitPausedRef.current = isOrbitPaused;

    const controlsRef = useRef<{
      reset: () => void;
      focus: (key: string) => void;
      update: (dt: number) => void;
      zoomIn: () => void;
      zoomOut: () => void;
    } | null>(null);

    const resetCamera = () => {
      setSelectedPlanetKey(null);
      controlsRef.current?.reset();
    };

    const focusPlanet = (key: string) => {
      setSelectedPlanetKey(key);
      controlsRef.current?.focus(key);
    };

    const zoomIn = () => {
      controlsRef.current?.zoomIn();
    };

    const zoomOut = () => {
      controlsRef.current?.zoomOut();
    };

    useImperativeHandle(ref, () => ({
      resetCamera,
      focusPlanet,
      zoomIn,
      zoomOut,
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let renderer: THREE.WebGLRenderer | null = null;
      let scene: THREE.Scene | null = null;
      let camera: THREE.PerspectiveCamera | null = null;
      let rafId = 0;
      let resizeObserver: ResizeObserver | null = null;

      const planets = new Map<string, PlanetSceneItem>();
      const clock = new THREE.Clock();
      const currentTarget = new THREE.Vector3(0, 0, 0);
      const targetLookAt = new THREE.Vector3(0, 0, 0);
      let pointerDownPos: { x: number; y: number } | null = null;
      let focusedPlanetKey: string | null = null;

      function radialTexture(inner: string, outer: string): THREE.CanvasTexture {
        const c = document.createElement('canvas');
        c.width = 128;
        c.height = 128;
        const x = c.getContext('2d');
        if (x) {
          const g = x.createRadialGradient(64, 64, 2, 64, 64, 64);
          g.addColorStop(0, inner);
          g.addColorStop(0.25, outer);
          g.addColorStop(1, 'rgba(255,100,20,0)');
          x.fillStyle = g;
          x.fillRect(0, 0, 128, 128);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      }

      function makeLabel(text: string): THREE.Sprite {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 128;
        const x = c.getContext('2d');
        if (x) {
          x.font = '600 36px "DM Sans", Arial, sans-serif';
          x.fillStyle = '#f0f4fa';
          x.textAlign = 'center';
          x.shadowColor = 'rgba(0,0,0,0.9)';
          x.shadowBlur = 14;
          x.fillText(text, 256, 74);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
          })
        );
        s.scale.set(4.5, 1.12, 1);
        return s;
      }

      function addAtmosphere(
        mesh: THREE.Mesh,
        radius: number,
        color: number,
        opacity: number,
        interactives?: THREE.Object3D[]
      ) {
        const shell = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.08, 64, 48),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        shell.userData = { planet: mesh.userData.planet };
        mesh.add(shell);
        if (interactives) interactives.push(shell);
      }

      function addSaturnRings(item: PlanetSceneItem, ringTexture: THREE.CanvasTexture) {
        const inner = item.radius * 1.35;
        const outer = item.radius * 2.35;
        const ringGeo = new THREE.RingGeometry(inner, outer, 180);

        // Adjust UV mapping for radial ring texture
        const pos = ringGeo.attributes.position;
        const uv = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const dist = Math.sqrt(x * x + y * y);
          const u = (dist - inner) / (outer - inner);
          uv.setXY(i, u, 0.5);
        }

        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
          roughness: 0.85,
          metalness: 0.05,
        });

        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        item.tiltGroup.add(ring);
      }

      function addUranusRings(item: PlanetSceneItem) {
        const inner = item.radius * 1.35;
        const outer = item.radius * 1.75;
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(inner, outer, 120),
          new THREE.MeshStandardMaterial({
            color: 0x98cfd8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45,
            roughness: 0.9,
          })
        );
        ring.rotation.x = Math.PI / 2;
        item.tiltGroup.add(ring);
      }

      function addMoon(earthItem: PlanetSceneItem, interactives: THREE.Object3D[]) {
        const moonPivot = new THREE.Group();
        earthItem.sphere.add(moonPivot);

        const moonTexture = createMoonTexture();
        const moonMat = new THREE.MeshStandardMaterial({
          map: moonTexture,
          roughness: 0.95,
          metalness: 0.05,
        });
        const moon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 48, 36), moonMat);
        moon.position.set(1.5, 0, 0);
        moon.userData = { planet: 'moon' };
        moonPivot.add(moon);

        // Generous invisible hit proxy for Moon
        const moonHitProxy = new THREE.Mesh(
          new THREE.SphereGeometry(1.2, 12, 12),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        moonHitProxy.position.set(1.5, 0, 0);
        moonHitProxy.userData = { planet: 'moon' };
        moonPivot.add(moonHitProxy);

        interactives.push(moon);
        interactives.push(moonHitProxy);

        earthItem.moonPivot = moonPivot;
      }

      function addAsteroidBelt(sc: THREE.Scene) {
        const count = 2600;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorA = new THREE.Color(0xb5a490);
        const colorB = new THREE.Color(0x73695d);

        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = 19.3 + Math.random() * 2.8;
          const y = (Math.random() - 0.5) * 0.75;

          positions[i * 3] = Math.cos(a) * r;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = Math.sin(a) * r;

          const mixed = colorA.clone().lerp(colorB, Math.random());
          colors[i * 3] = mixed.r;
          colors[i * 3 + 1] = mixed.g;
          colors[i * 3 + 2] = mixed.b;
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const points = new THREE.Points(
          g,
          new THREE.PointsMaterial({
            size: 0.075,
            vertexColors: true,
            transparent: true,
            opacity: 0.78,
            sizeAttenuation: true,
          })
        );
        sc.add(points);
      }

      function addPluto(sc: THREE.Scene, interactives: THREE.Object3D[]) {
        const plutoTexture = createPlutoTexture();
        const pMat = new THREE.MeshStandardMaterial({
          map: plutoTexture,
          roughness: 0.92,
          metalness: 0.02,
        });
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 36), pMat);
        p.position.set(-49.5, 0, 4);
        p.rotation.z = 2.14; // Pluto's real tilt (~122°)
        p.name = 'pluto';
        p.userData = { planet: 'pluto' };
        sc.add(p);

        // Generous invisible hit proxy for Pluto
        const hitProxy = new THREE.Mesh(
          new THREE.SphereGeometry(2.0, 12, 12),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        hitProxy.position.copy(p.position);
        hitProxy.userData = { planet: 'pluto' };
        sc.add(hitProxy);

        const l = makeLabel('Pluto');
        l.position.set(-49.5, 0.95, 4);
        l.userData = { planet: 'pluto' };
        sc.add(l);

        interactives.push(p);
        interactives.push(hitProxy);
        interactives.push(l);
      }

      function createStars(sc: THREE.Scene) {
        const count = 7500;
        const arr = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const white = new THREE.Color(0xffffff);
        const warm = new THREE.Color(0xffedd5);
        const cool = new THREE.Color(0xc7d9ff);

        for (let i = 0; i < count; i++) {
          const radius = 95 + Math.random() * 110;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          arr[i * 3 + 1] = radius * Math.cos(phi);
          arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

          const rChoice = Math.random();
          const c = rChoice > 0.6 ? cool : rChoice > 0.2 ? white : warm;
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        sc.add(
          new THREE.Points(
            g,
            new THREE.PointsMaterial({
              size: 0.42,
              vertexColors: true,
              transparent: true,
              opacity: 0.9,
              sizeAttenuation: true,
            })
          )
        );
      }

      function createNebulaDust(sc: THREE.Scene) {
        const count = 1400;
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          arr[i * 3] = (Math.random() - 0.5) * 220;
          arr[i * 3 + 1] = (Math.random() - 0.5) * 90;
          arr[i * 3 + 2] = -70 - Math.random() * 65;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        sc.add(
          new THREE.Points(
            g,
            new THREE.PointsMaterial({
              color: 0x5a6f9f,
              size: 0.85,
              transparent: true,
              opacity: 0.24,
            })
          )
        );
      }

      try {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x030812);

        camera = new THREE.PerspectiveCamera(48, 1, 0.1, 300);
        camera.position.set(0, 38, 79);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;

        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Lighting rig
        // Gentle ambient so planet unlit sides remain softly readable
        scene.add(new THREE.AmbientLight(0x7d90b2, 0.26));
        // Soft hemisphere fill for realistic cosmic contrast
        scene.add(new THREE.HemisphereLight(0x89a4cc, 0x221a14, 0.24));

        // The radiant central Sun
        const sunlight = new THREE.PointLight(0xfff2df, 320, 260, 1.35);
        sunlight.position.set(0, 0, 0);
        scene.add(sunlight);

        // Array for Raycaster interactive testing
        const interactiveObjects: THREE.Object3D[] = [];

        // Sun Mesh with high-detail procedural texture
        const sunTexture = createSunTexture();
        const sunMat = new THREE.MeshBasicMaterial({
          map: sunTexture,
        });
        const sun = new THREE.Mesh(new THREE.SphereGeometry(3.0, 64, 48), sunMat);
        sun.userData = { planet: 'sun' };
        scene.add(sun);

        // Invisible hit proxy for Sun
        const sunHitProxy = new THREE.Mesh(
          new THREE.SphereGeometry(4.5, 16, 16),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        sunHitProxy.userData = { planet: 'sun' };
        scene.add(sunHitProxy);
        interactiveObjects.push(sunHitProxy);
        interactiveObjects.push(sun);

        // Sun atmospheric glow shells
        const sunInnerGlow = new THREE.Mesh(
          new THREE.SphereGeometry(3.5, 48, 36),
          new THREE.MeshBasicMaterial({
            color: 0xffa43b,
            transparent: true,
            opacity: 0.16,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
          })
        );
        scene.add(sunInnerGlow);

        const sunOuterGlow = new THREE.Mesh(
          new THREE.SphereGeometry(4.2, 48, 36),
          new THREE.MeshBasicMaterial({
            color: 0xff7010,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
          })
        );
        scene.add(sunOuterGlow);

        const corona = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: radialTexture('#fff5d0', '#ff8522'),
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        corona.scale.set(19, 19, 1);
        scene.add(corona);

        createStars(scene);
        createNebulaDust(scene);

        // Generate procedural textures for all planets
        const mercuryTexture = createMercuryTexture();
        const venusTexture = createVenusTexture();
        const earthTexture = createEarthTexture();
        const earthCloudsTexture = createEarthCloudsTexture();
        const marsTexture = createMarsTexture();
        const jupiterTexture = createJupiterTexture();
        const saturnTexture = createSaturnTexture();
        const saturnRingTexture = createSaturnRingTexture();
        const uranusTexture = createUranusTexture();
        const neptuneTexture = createNeptuneTexture();

        const textureMap: Record<string, THREE.CanvasTexture> = {
          mercury: mercuryTexture,
          venus: venusTexture,
          earth: earthTexture,
          mars: marsTexture,
          jupiter: jupiterTexture,
          saturn: saturnTexture,
          uranus: uranusTexture,
          neptune: neptuneTexture,
        };

        planetDataList.forEach((data, index) => {
          if (!scene) return;
          const pivot = new THREE.Group();
          scene.add(pivot);

          // Clean, understated orbital guide ring
          const orbit = new THREE.Mesh(
            new THREE.RingGeometry(data.distance - 0.015, data.distance + 0.015, 256),
            new THREE.MeshBasicMaterial({
              color: 0x6e849e,
              transparent: true,
              opacity: 0.18,
              side: THREE.DoubleSide,
            })
          );
          orbit.rotation.x = -Math.PI / 2;
          scene.add(orbit);

          // Tilt group applies authentic planetary axial tilt
          const tiltGroup = new THREE.Group();
          tiltGroup.position.x = data.distance;
          if (data.axialTilt) {
            tiltGroup.rotation.z = data.axialTilt;
          }
          pivot.add(tiltGroup);

          const tex = textureMap[data.key];
          const material = new THREE.MeshStandardMaterial({
            map: tex || null,
            color: tex ? 0xffffff : data.color,
            roughness: data.roughness !== undefined ? data.roughness : 0.85,
            metalness: data.metalness !== undefined ? data.metalness : 0.02,
          });

          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(data.radius, 64, 48),
            material
          );
          sphere.userData = { planet: data.key };
          tiltGroup.add(sphere);

          // Generous hit proxy: minimum radius 2.4 so even small bodies (Earth 0.66, Mercury 0.38)
          // have an effortless, generous click target
          const hitRadius = Math.max(2.4, data.radius * 2.2);
          const hitProxy = new THREE.Mesh(
            new THREE.SphereGeometry(hitRadius, 16, 16),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
          );
          hitProxy.userData = { planet: data.key };
          tiltGroup.add(hitProxy);

          interactiveObjects.push(hitProxy);
          interactiveObjects.push(sphere);

          // Label sprite (placed above the planet in world space)
          const label = makeLabel(data.name);
          label.position.set(0, data.radius + 1.25, 0);
          label.userData = { planet: data.key };
          tiltGroup.add(label);
          interactiveObjects.push(label);

          const item: PlanetSceneItem = {
            ...data,
            pivot,
            tiltGroup,
            sphere,
            angle: index * 0.35 + 0.2,
            cloud: null,
          };
          planets.set(data.key, item);

          if (data.key === 'saturn') {
            addSaturnRings(item, saturnRingTexture);
          } else if (data.key === 'uranus') {
            addUranusRings(item);
          }

          if (data.key === 'earth') {
            // Earth cloud layer
            const cloudsMat = new THREE.MeshStandardMaterial({
              map: earthCloudsTexture,
              transparent: true,
              opacity: 0.42,
              depthWrite: false,
              roughness: 0.9,
            });
            const cloudMesh = new THREE.Mesh(
              new THREE.SphereGeometry(data.radius * 1.018, 64, 48),
              cloudsMat
            );
            cloudMesh.userData = { planet: 'earth' };
            sphere.add(cloudMesh);
            item.cloud = cloudMesh;
            interactiveObjects.push(cloudMesh);

            // Earth blue Rayleigh atmosphere
            addAtmosphere(sphere, data.radius, 0x58a8ff, 0.25, interactiveObjects);
            addMoon(item, interactiveObjects);
          } else if (data.key === 'venus') {
            addAtmosphere(sphere, data.radius, 0xdfab6f, 0.16, interactiveObjects);
          } else if (data.key === 'mars') {
            addAtmosphere(sphere, data.radius, 0xb85b3a, 0.12, interactiveObjects);
          } else if (data.key === 'uranus' || data.key === 'neptune') {
            addAtmosphere(sphere, data.radius, 0x64bfe8, 0.16, interactiveObjects);
          }
        });

        addAsteroidBelt(scene);
        addPluto(scene, interactiveObjects);

        // Camera orbit and zoom state
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        let theta = 0.28;
        let phi = 0.95;
        let radius = 88;

        let targetRadius = radius;
        let targetTheta = theta;
        let targetPhi = phi;

        const activePointers = new Map<number, { x: number; y: number }>();
        let initialPinchDistance = 0;
        let pinchBaseRadius = radius;

        const updateCameraPosition = (dt: number) => {
          if (!camera) return;
          targetPhi = THREE.MathUtils.clamp(targetPhi, 0.12, 1.48);
          targetRadius = THREE.MathUtils.clamp(targetRadius, 7, 150);

          const safeDt = Math.max(0.001, Math.min(dt, 0.1));
          phi = THREE.MathUtils.damp(phi, targetPhi, 14, safeDt);
          theta = THREE.MathUtils.damp(theta, targetTheta, 14, safeDt);
          radius = THREE.MathUtils.damp(radius, targetRadius, 12, safeDt);

          currentTarget.lerp(targetLookAt, 0.08);

          camera.position.set(
            currentTarget.x + radius * Math.sin(phi) * Math.sin(theta),
            currentTarget.y + radius * Math.cos(phi),
            currentTarget.z + radius * Math.sin(phi) * Math.cos(theta)
          );
          camera.lookAt(currentTarget);
        };

        const onPointerDown = (e: PointerEvent) => {
          if ((e.target as HTMLElement)?.closest('button, a, input, select, .planet-popover, .planet-selector-bar')) return;

          activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (activePointers.size === 1) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            pointerDownPos = { x: e.clientX, y: e.clientY };
            if (container) container.style.cursor = 'grabbing';
          } else if (activePointers.size === 2) {
            isDragging = false;
            const pts = Array.from(activePointers.values());
            initialPinchDistance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            pinchBaseRadius = targetRadius;
          }
        };

        const onPointerMove = (e: PointerEvent) => {
          if (activePointers.has(e.pointerId)) {
            activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (activePointers.size === 1 && isDragging) {
              const deltaX = e.clientX - lastX;
              const deltaY = e.clientY - lastY;
              lastX = e.clientX;
              lastY = e.clientY;

              targetTheta -= deltaX * 0.005;
              targetPhi += deltaY * 0.005;
              targetPhi = THREE.MathUtils.clamp(targetPhi, 0.12, 1.48);
            } else if (activePointers.size === 2 && initialPinchDistance > 0) {
              const pts = Array.from(activePointers.values());
              const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
              if (currentDist > 5) {
                const scale = initialPinchDistance / currentDist;
                targetRadius = THREE.MathUtils.clamp(pinchBaseRadius * scale, 7, 150);
              }
            }
          } else if (!isDragging && renderer && camera && container) {
            // Hover feedback over celestial bodies
            const rect = renderer.domElement.getBoundingClientRect();
            if (
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
            ) {
              const p = new THREE.Vector2(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1
              );
              const ray = new THREE.Raycaster();
              ray.setFromCamera(p, camera);
              const hits = ray.intersectObjects(interactiveObjects, true);
              let hasHitPlanet = false;
              for (const hit of hits) {
                let cur: THREE.Object3D | null = hit.object;
                while (cur) {
                  if (cur.userData?.planet) {
                    hasHitPlanet = true;
                    break;
                  }
                  cur = cur.parent;
                }
                if (hasHitPlanet) break;
              }
              container.style.cursor = hasHitPlanet ? 'pointer' : 'grab';
            }
          }
        };

        const onPointerUp = (e: PointerEvent) => {
          activePointers.delete(e.pointerId);
          if (activePointers.size === 0) {
            isDragging = false;
            if (container) container.style.cursor = 'grab';
          }

          // Generous jitter threshold (<= 14px) so clicks aren't cancelled on subtle trackpad release
          if (
            pointerDownPos &&
            Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y) <= 14 &&
            renderer &&
            camera
          ) {
            const rect = renderer.domElement.getBoundingClientRect();
            const p = new THREE.Vector2(
              ((e.clientX - rect.left) / rect.width) * 2 - 1,
              -((e.clientY - rect.top) / rect.height) * 2 + 1
            );
            const ray = new THREE.Raycaster();
            ray.setFromCamera(p, camera);

            const hits = ray.intersectObjects(interactiveObjects, true);
            if (hits.length > 0) {
              let hitKey: string | null = null;
              for (const hit of hits) {
                let cur: THREE.Object3D | null = hit.object;
                while (cur) {
                  if (cur.userData?.planet) {
                    hitKey = cur.userData.planet;
                    break;
                  }
                  cur = cur.parent;
                }
                if (hitKey) break;
              }
              if (hitKey) {
                focusPlanet(hitKey);
              }
            }
          }
          pointerDownPos = null;
        };

        const onPointerCancel = (e: PointerEvent) => {
          activePointers.delete(e.pointerId);
          if (activePointers.size === 0) {
            isDragging = false;
            if (container) container.style.cursor = 'grab';
          }
          pointerDownPos = null;
        };

        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          const zoomFactor = e.deltaY > 0 ? 1.09 : 0.91;
          targetRadius = THREE.MathUtils.clamp(targetRadius * zoomFactor, 7, 150);
        };

        container.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        container.addEventListener('wheel', onWheel, { passive: false });

        const controls = {
          update: (dt: number) => updateCameraPosition(dt),
          reset: () => {
            targetTheta = 0.28;
            targetPhi = 0.95;
            targetRadius = 88;
            targetLookAt.set(0, 0, 0);
            focusedPlanetKey = null;
          },
          focus: (key: string) => {
            if (key === 'sun') {
              focusedPlanetKey = null;
              targetLookAt.set(0, 0, 0);
              targetRadius = 24;
              return;
            }
            if (key === 'moon') {
              const earth = planets.get('earth');
              if (earth) {
                focusedPlanetKey = 'earth';
                const worldPos = new THREE.Vector3();
                earth.sphere.getWorldPosition(worldPos);
                targetLookAt.copy(worldPos);
                targetRadius = 4.2;
              }
              return;
            }
            if (key === 'pluto') {
              focusedPlanetKey = 'pluto';
              const plutoObj = scene?.getObjectByName('pluto');
              if (plutoObj) {
                plutoObj.getWorldPosition(targetLookAt);
              } else {
                targetLookAt.set(-49.5, 0, 4);
              }
              targetRadius = 8;
              return;
            }
            if (key === 'deep-space') {
              focusedPlanetKey = null;
              targetLookAt.set(0, 0, 0);
              targetRadius = 110;
              return;
            }
            const p = planets.get(key);
            if (!p) return;
            focusedPlanetKey = key;
            const worldPos = new THREE.Vector3();
            p.sphere.getWorldPosition(worldPos);
            targetLookAt.copy(worldPos);
            targetRadius = Math.max(4.2, p.radius * 5.2);
          },
          zoomIn: () => {
            targetRadius = THREE.MathUtils.clamp(targetRadius * 0.78, 7, 150);
          },
          zoomOut: () => {
            targetRadius = THREE.MathUtils.clamp(targetRadius * 1.28, 7, 150);
          },
        };
        controlsRef.current = controls;

        const resize = () => {
          if (!renderer || !camera || !container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (!w || !h) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        const animate = () => {
          rafId = requestAnimationFrame(animate);
          const dt = Math.min(clock.getDelta(), 0.05);

          const orbitMultiplier = isOrbitPausedRef.current ? 0 : 1;

          planets.forEach((p) => {
            // Orbit progression
            p.angle += dt * (0.035 / (p.distance * 0.13)) * orbitMultiplier;
            p.pivot.rotation.y = p.angle;

            // Axial planetary rotation
            p.sphere.rotation.y += p.rotation * dt * 60;

            // Earth clouds differential speed
            if (p.cloud) {
              p.cloud.rotation.y += 0.00035 * dt * 60;
            }

            // Moon orbit around Earth
            if (p.moonPivot) {
              p.moonPivot.rotation.y += 0.0028 * dt * 60 * (orbitMultiplier || 1);
            }
          });

          // If tracking a focused planet, follow its orbital movement
          if (focusedPlanetKey) {
            if (focusedPlanetKey === 'pluto') {
              const plutoObj = scene?.getObjectByName('pluto');
              if (plutoObj) {
                plutoObj.getWorldPosition(targetLookAt);
              }
            } else {
              const p = planets.get(focusedPlanetKey);
              if (p) {
                p.sphere.getWorldPosition(targetLookAt);
              }
            }
          }

          // Subtle sun surface animation
          sun.rotation.y += 0.0004 * dt * 60;
          corona.rotation.z += 0.0002 * dt * 60;

          controls.update(dt);

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };

        animate();

        return () => {
          cancelAnimationFrame(rafId);
          if (resizeObserver) resizeObserver.disconnect();
          container.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          window.removeEventListener('pointercancel', onPointerCancel);
          container.removeEventListener('wheel', onWheel);

          if (renderer) {
            renderer.dispose();
            if (renderer.domElement.parentNode === container) {
              container.removeChild(renderer.domElement);
            }
          }
          if (scene) {
            scene.clear();
          }
        };
      } catch (err) {
        console.error('Universe renderer failed', err);
        setWebglError(true);
      }
    }, []);

    const selectedPlanet = selectedPlanetKey
      ? planetDataList.find((p) => p.key === selectedPlanetKey) || {
          name:
            selectedPlanetKey.charAt(0).toUpperCase() +
            selectedPlanetKey.slice(1).replace('-', ' '),
          key: selectedPlanetKey,
        }
      : null;

    const selectedDescription = selectedPlanetKey
      ? planetDescriptions[selectedPlanetKey] ||
        'A celestial destination in our interactive exploration gallery.'
      : '';

    const hasMissionAction =
      selectedPlanetKey === 'earth' ||
      selectedPlanetKey === 'moon' ||
      selectedPlanetKey === 'mars' ||
      selectedPlanetKey === 'jupiter' ||
      selectedPlanetKey === 'deep-space';

    const getMissionTargetArea = (key: string): DestinationArea => {
      if (key === 'earth' || key === 'moon') return 'moon';
      if (key === 'mars') return 'mars';
      return 'deep-space';
    };

    const getActionLabel = (key: string): string => {
      if (key === 'earth' || key === 'moon') {
        return 'Explore Moon Missions (Surveyor 3 & Apollo 15 LRV) ↗';
      }
      if (key === 'mars') {
        return 'Explore Mars Missions (Sojourner, Opportunity, InSight) ↗';
      }
      if (key === 'jupiter') {
        return 'Explore Jupiter Encounter (Pioneer 10) ↗';
      }
      return 'Explore Deep Space Missions (Pioneer 10) ↗';
    };

    const getPopoverEyebrow = (key: string): string => {
      if (key === 'earth') return 'SOLAR SYSTEM / CRADLE OF EXPLORATION';
      if (key === 'moon') return 'SOLAR SYSTEM / LUNAR PROVING GROUND';
      if (key === 'mars') return 'SOLAR SYSTEM / THE RED PLANET';
      if (key === 'jupiter' || key === 'deep-space') return 'SOLAR SYSTEM / DEEP SPACE FRONTIER';
      return 'SOLAR SYSTEM / PLANETARY PROFILE';
    };

    return (
      <section className="solar-hero" id="solar-view">
        <div
          id="solar-canvas"
          ref={containerRef}
          aria-label="Interactive three-dimensional Solar System"
        />

        <div className="hero-vignette"></div>

        <div className="hero-topline">
          <div>
            <p className="eyebrow">THE EXPLORATION HALL</p>
            <h2>Our Solar System</h2>
          </div>
          <div className="scale-note">
            ILLUSTRATIVE DISTANCES · REALISTIC PLANETARY TEXTURES & AXIAL TILTS
          </div>
        </div>

        <div className="planet-selector-bar" role="navigation" aria-label="Solar System Destinations">
          <button
            className={`planet-chip ${selectedPlanetKey === 'sun' ? 'active' : ''}`}
            onClick={() => focusPlanet('sun')}
          >
            Sun
          </button>
          {planetDataList.map((p) => (
            <button
              key={p.key}
              className={`planet-chip ${selectedPlanetKey === p.key ? 'active' : ''}`}
              onClick={() => focusPlanet(p.key)}
            >
              {p.name}
            </button>
          ))}
          <button
            className={`planet-chip ${selectedPlanetKey === 'moon' ? 'active' : ''}`}
            onClick={() => focusPlanet('moon')}
          >
            The Moon
          </button>
          <button
            className={`planet-chip ${selectedPlanetKey === 'pluto' ? 'active' : ''}`}
            onClick={() => focusPlanet('pluto')}
          >
            Pluto
          </button>
          <button
            className={`planet-chip ${selectedPlanetKey === 'deep-space' ? 'active' : ''}`}
            onClick={() => focusPlanet('deep-space')}
          >
            Deep Space
          </button>
        </div>

        <div className="hero-bottomline">
          <div className="interaction-hint">
            <span>DRAG</span> rotate <i>·</i> <span>SCROLL</span> zoom <i>·</i>{' '}
            <span>SELECT</span> explore
          </div>

          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto', alignItems: 'center' }}>
            <button
              className="reset-button"
              onClick={() => setIsOrbitPaused(!isOrbitPaused)}
              title="Pause or resume orbital revolutions"
            >
              {isOrbitPaused ? '▶  Resume orbits' : '⏸  Pause orbits'}
            </button>
            <button
              className="reset-button"
              onClick={zoomIn}
              title="Zoom in closer"
              style={{ fontWeight: 'bold', fontSize: '0.9rem', padding: '12px 16px' }}
            >
              +
            </button>
            <button
              className="reset-button"
              onClick={zoomOut}
              title="Zoom out farther"
              style={{ fontWeight: 'bold', fontSize: '0.9rem', padding: '12px 16px' }}
            >
              −
            </button>
            <button id="reset-camera" className="reset-button" onClick={resetCamera}>
              ◎  Full system view
            </button>
          </div>
        </div>

        {webglError && (
          <div className="canvas-fallback" id="canvas-fallback">
            <div>
              <p style={{ marginBottom: 16 }}>
                Your browser could not start the 3D universe. Please select a destination below:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {planetDataList.map((p) => (
                  <button
                    key={p.key}
                    className="button button-quiet"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    onClick={() => focusPlanet(p.key)}
                  >
                    {p.name}
                  </button>
                ))}
                <button
                  className="button button-quiet"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  onClick={() => focusPlanet('moon')}
                >
                  The Moon
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedPlanet && (
          <div className="planet-popover" id="planet-popover">
            <button
              className="popover-close"
              id="close-popover"
              aria-label="Close"
              onClick={() => setSelectedPlanetKey(null)}
            >
              ×
            </button>
            <p className="eyebrow" id="planet-kind">
              {getPopoverEyebrow(selectedPlanetKey || '')}
            </p>
            <h3 id="planet-name">{selectedPlanet.name}</h3>
            <p id="planet-copy">{selectedDescription}</p>
            <div id="planet-missions">
              {hasMissionAction && (
                <button
                  className="popover-action"
                  onClick={() => {
                    const dest = getMissionTargetArea(selectedPlanetKey!);
                    onOpenDestination(dest);
                  }}
                >
                  {getActionLabel(selectedPlanetKey!)}
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }
);
SolarSystem.displayName = 'SolarSystem';
