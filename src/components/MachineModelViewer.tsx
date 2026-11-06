import { useEffect, useRef, useState, type FC } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type ViewerStatus = 'checking' | 'loading' | 'ready' | 'missing' | 'error';

interface MachineModelViewerProps {
  machineId: string;
  machineName: string;
}

/**
 * Looks for a single self-contained model in public/assets/models/<machineId>/model.glb.
 * A missing file is an ordinary museum state, not a broken exhibit.
 */
export const MachineModelViewer: FC<MachineModelViewerProps> = ({ machineId, machineName }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const homeDistanceRef = useRef(4);
  const [status, setStatus] = useState<ViewerStatus>('checking');
  const [progress, setProgress] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const autoRotateRef = useRef(false);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;
    let scene: THREE.Scene | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let animationFrame = 0;
    let environmentTexture: THREE.Texture | null = null;
    let active = true;
    const request = new AbortController();
    const modelPath = '/assets/models/' + machineId + '/model.glb';
    setStatus('checking');
    setProgress(null);

    const start = async () => {
      try {
        // A missing static file sometimes returns the SPA's HTML instead of 404.
        const response = await fetch(modelPath, { method: 'HEAD', signal: request.signal });
        if (!response.ok || (response.headers.get('content-type') || '').includes('text/html')) {
          if (!disposed) setStatus('missing');
          return;
        }
        if (disposed) return;
        setStatus('loading');

        const loaded = await new GLTFLoader().loadAsync(modelPath, (event) => {
          if (!disposed && event.total > 0) {
            const value = Math.min(99, Math.round(event.loaded * 100 / event.total));
            setProgress(previous => previous === null || value >= previous + 5 ? value : previous);
          }
        });
        if (disposed) return;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
        cameraRef.current = camera;

        // Bright photo-studio lighting: illuminate metal, white panels and dark undersides
        // without changing or replacing any of the original GLB materials.
        scene.add(new THREE.HemisphereLight(0xffffff, 0xe2e7ed, 2.5));
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
        keyLight.position.set(5, 9, 9);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xeaf2ff, 3.0);
        fillLight.position.set(-8, 5, 4);
        scene.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0xffffff, 2.4);
        rimLight.position.set(2, 6, -9);
        scene.add(rimLight);
        const underLight = new THREE.DirectionalLight(0xffffff, 1.25);
        underLight.position.set(1, -6, 3);
        scene.add(underLight);

        const model = loaded.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const extents = bounds.getSize(new THREE.Vector3());
        const size = Math.max(extents.x, extents.y, extents.z);
        if (!Number.isFinite(size) || size <= 0) throw new Error('Empty 3D model');
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);

        const distance = Math.max(1, (size / (2 * Math.tan(THREE.MathUtils.degToRad(45 / 2)))) * 1.5);
        homeDistanceRef.current = distance;
        camera.position.set(distance * 0.65, distance * 0.38, distance * 0.85);
        camera.near = Math.max(0.001, size / 1000);
        camera.far = Math.max(1000, size * 100);
        camera.updateProjectionMatrix();

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.55;
        renderer.setClearColor(0xffffff, 1);

        // Direct lights alone make fully metallic glTF parts appear nearly black.
        // This generated studio environment gives reflective materials soft fill light.
        const pmrem = new THREE.PMREMGenerator(renderer);
        const studio = new RoomEnvironment();
        try {
          environmentTexture = pmrem.fromScene(studio).texture;
          scene.environment = environmentTexture;
        } finally {
          studio.dispose();
          pmrem.dispose();
        }
        model.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of materials) {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.envMapIntensity = Math.max(1.8, material.envMapIntensity ?? 1);
              material.needsUpdate = true;
            }
          }
        });
        host.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = distance * 0.18;
        controls.autoRotateSpeed = 1.1;
        controls.maxDistance = distance * 4;

        const resize = () => {
          if (!renderer || !camera || !host) return;
          const width = host.clientWidth;
          const height = host.clientHeight;
          if (width === 0 || height === 0) return;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        };
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const renderFrame = () => {
          if (!active) return;
          animationFrame = requestAnimationFrame(renderFrame);
          if (controls) { controls.autoRotate = autoRotateRef.current; controls.update(); }
          if (renderer && scene) renderer.render(scene, camera);
        };
        renderFrame();
        setProgress(null);
        setStatus('ready');
      } catch (error) {
        if (disposed || request.signal.aborted) return;
        console.error('3D exhibit failed to initialize:', machineId, error);
        setStatus('error');
      }
    };

    void start();
    return () => {
      disposed = true;
      active = false;
      request.abort();
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      controls?.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      environmentTexture?.dispose();
      renderer?.dispose();
      if (renderer && host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
      scene?.traverse(object => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(material => material?.dispose());
        }
      });
      scene?.clear();
    };
  }, [machineId, reloadKey]);

  const zoom = (factor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const target = controls.target;
    const offset = camera.position.clone().sub(target);
    const distance = THREE.MathUtils.clamp(
      offset.length() * factor,
      controls.minDistance,
      controls.maxDistance,
    );
    offset.setLength(distance);
    camera.position.copy(target).add(offset);
    controls.update();
  };

  const resetView = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const distance = homeDistanceRef.current;
    camera.position.set(distance * 0.65, distance * 0.38, distance * 0.85);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  return (
    <div className="machine-viewer">
      <div ref={containerRef} className="machine-viewer-canvas" role="img" aria-label={'Interactive three-dimensional model of ' + machineName} />
      {status !== 'ready' && (
        <div className="machine-viewer-placeholder" role="status">
          <span className="viewer-symbol" aria-hidden="true">✳</span>
          <strong>{status === 'checking' || status === 'loading' ? (progress !== null ? `Loading 3D model… ${progress}%` : 'Preparing 3D model…') :
            status === 'missing' ? '3D model coming soon' : '3D preview unavailable'}</strong>
          <p>{status === 'missing' ? 'Our exhibition is ready for this machine\'s GLB file. The mission story and timeline are available below.' :
            status === 'error' ? 'The model could not be displayed. Please check its file format and try again.' :
            'Loading the engineering exhibit. Large detailed models can take a little longer.'}</p>
          {status === 'error' && <button type="button" className="viewer-retry-button" onClick={() => setReloadKey(key => key + 1)}>Try loading again ↻</button>}
        </div>
      )}
      {status === 'ready' && (
        <div className="viewer-controls">
          <span>DRAG TO ROTATE · SCROLL OR PINCH TO ZOOM · BRIGHT STUDIO</span>
          <div className="viewer-button-group">
            <button type="button" onClick={() => zoom(0.8)} aria-label="Zoom in on model">Zoom +</button>
            <button type="button" onClick={() => zoom(1.25)} aria-label="Zoom out from model">Zoom −</button>
            <button type="button" aria-pressed={autoRotate} onClick={() => setAutoRotate(v => !v)}>{autoRotate ? 'Stop rotation' : 'Auto rotate'}</button>
            <button type="button" onClick={resetView} aria-label={'Reset ' + machineName + ' 3D view'}>Reset ↺</button>
          </div>
        </div>
      )}
    </div>
  );
};
