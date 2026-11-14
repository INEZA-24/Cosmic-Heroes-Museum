import { useEffect, useRef, type FC } from 'react';
import * as THREE from 'three';
import { createEarthCloudsTexture, createEarthTexture } from '../utils/planetTextures';

/**
 * Entrance-only ambient Earth. Reuses the museum's existing local Earth textures
 * so the entrance never depends on network-hosted imagery or additional packages.
 * The globe is decorative: keyboard, pointer and scrolling are never captured.
 */
export const EntranceEarth: FC = () => {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let observer: ResizeObserver | null = null;
    let frame = 0;
    let earthTexture: THREE.CanvasTexture | null = null;
    let cloudTexture: THREE.CanvasTexture | null = null;
    let earthGeometry: THREE.SphereGeometry | null = null;
    let cloudGeometry: THREE.SphereGeometry | null = null;
    let earthMaterial: THREE.MeshStandardMaterial | null = null;
    let cloudMaterial: THREE.MeshStandardMaterial | null = null;
    let onResize: (() => void) | null = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
      camera.position.set(0, 0, 6.7);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.className = 'entrance-earth-canvas';
      host.appendChild(renderer.domElement);

      const globe = new THREE.Group();
      globe.position.x = 0.65;
      globe.rotation.z = 0.15;
      scene.add(globe);

      earthTexture = createEarthTexture();
      cloudTexture = createEarthCloudsTexture();
      earthGeometry = new THREE.SphereGeometry(2, 64, 48);
      cloudGeometry = new THREE.SphereGeometry(2.025, 64, 48);
      earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 1,
        metalness: 0,
      });
      cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.33,
        roughness: 1,
        depthWrite: false,
      });

      const surface = new THREE.Mesh(earthGeometry, earthMaterial);
      const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
      surface.rotation.y = -0.6;
      clouds.rotation.y = -0.42;
      globe.add(surface, clouds);

      scene.add(new THREE.AmbientLight(0x9bb4d3, 0.32));
      const sun = new THREE.DirectionalLight(0xe5f1ff, 2.1);
      sun.position.set(-3.2, 2.2, 4.5);
      scene.add(sun);

      const resize = () => {
        if (!renderer) return;
        const width = Math.max(1, host.clientWidth);
        const height = Math.max(1, host.clientHeight);
        camera.aspect = width / height;
        camera.position.z = width < 620 ? 8.5 : width < 960 ? 7.6 : 6.7;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.render(scene, camera);
      };
      onResize = resize;
      resize();
      if ('ResizeObserver' in window) {
        observer = new ResizeObserver(resize);
        observer.observe(host);
      } else {
        window.addEventListener('resize', resize);
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reducedMotion) {
        const clock = new THREE.Clock();
        const animate = () => {
          frame = window.requestAnimationFrame(animate);
          const delta = Math.min(clock.getDelta(), 0.05);
          if (document.hidden) return;
          surface.rotation.y += delta * 0.018;
          clouds.rotation.y += delta * 0.022;
          renderer?.render(scene, camera);
        };
        animate();
      }
    } catch {
      // Keep the CSS globe visible when WebGL is unavailable or blocked.
      host.setAttribute('data-earth-fallback', 'true');
    }

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (onResize) window.removeEventListener('resize', onResize);
      earthGeometry?.dispose();
      cloudGeometry?.dispose();
      earthMaterial?.dispose();
      cloudMaterial?.dispose();
      earthTexture?.dispose();
      cloudTexture?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <div className="entrance-earth-scene" aria-hidden="true" ref={hostRef}>
      <div className="entrance-earth-fallback" />
    </div>
  );
};
