import { useEffect, useRef, useState, type FC } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;
    let scene: THREE.Scene | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let animationFrame = 0;
    const request = new AbortController();
    const modelPath = '/assets/models/' + machineId + '/model.glb';
    setStatus('checking');

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

        const loaded = await new GLTFLoader().loadAsync(modelPath);
        if (disposed) return;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x091421);
        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
        cameraRef.current = camera;

        scene.add(new THREE.HemisphereLight(0xdde9ff, 0x33333d, 2));
        const keyLight = new THREE.DirectionalLight(0xffe9d6, 3);
        keyLight.position.set(5, 8, 7);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0x79a7df, 2);
        rimLight.position.set(-7, 3, -5);
        scene.add(rimLight);

        const model = loaded.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const extents = bounds.getSize(new THREE.Vector3());
        const size = Math.max(extents.x, extents.y, extents.z);
        if (!Number.isFinite(size) || size <= 0) throw new Error('Empty 3D model');
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);

        const distance = Math.max(1, (size / (2 * Math.tan(THREE.MathUtils.degToRad(45 / 2)))) * 1.7);
        homeDistanceRef.current = distance;
        camera.position.set(distance * 0.65, distance * 0.38, distance * 0.85);
        camera.near = Math.max(0.001, size / 1000);
        camera.far = Math.max(1000, size * 100);
        camera.updateProjectionMatrix();

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        host.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = distance * 0.25;
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
          animationFrame = requestAnimationFrame(renderFrame);
          controls?.update();
          if (renderer && scene) renderer.render(scene, camera);
        };
        renderFrame();
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
      request.abort();
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      controls?.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
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
  }, [machineId]);

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
          <strong>{status === 'checking' || status === 'loading' ? 'Preparing 3D model…' :
            status === 'missing' ? '3D model coming soon' : '3D preview unavailable'}</strong>
          <p>{status === 'missing' ? 'Our exhibition is ready for this machine\'s GLB file. The mission story and timeline are available below.' :
            status === 'error' ? 'The model could not be displayed. Please check its file format and try again.' :
            'Loading the engineering exhibit.'}</p>
        </div>
      )}
      {status === 'ready' && (
        <div className="viewer-controls">
          <span>DRAG TO ROTATE · SCROLL OR PINCH TO ZOOM</span>
          <button type="button" onClick={resetView} aria-label={'Reset ' + machineName + ' 3D view'}>Reset view ↺</button>
        </div>
      )}
    </div>
  );
};
