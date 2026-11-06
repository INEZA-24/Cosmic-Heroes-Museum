import { useEffect, useRef, useState, type FC } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type ViewerStatus = 'checking' | 'loading' | 'ready' | 'missing' | 'error';

interface MachineModelViewerProps {
  machineId: string;
  machineName: string;
}

const modelPathFor = (id: string) => '/assets/models/' + encodeURIComponent(id) + '/model.glb';

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
  const [loadError, setLoadError] = useState('');
  const [phase, setPhase] = useState('Downloading spacecraft model…');
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
    let draco: DRACOLoader | null = null;
    let active = true;
    let timedOut = false;
    let loadTimer = 0;
    const request = new AbortController();
    const modelPath = modelPathFor(machineId);
    setStatus('checking');
    setProgress(null);
    setLoadError('');
    setPhase('Connecting to exhibit archive…');

    const start = async () => {
      try {
        // A single GET is more reliable than HEAD + GLTFLoader's second request:
        // some CDNs/proxies handle HEAD differently, leaving the viewer spinning.
        // Validate the actual GLB bytes before parsing so HTML/404 fallbacks are diagnosable.
        loadTimer = window.setTimeout(() => {
          timedOut = true;
          request.abort();
          if (!disposed) {
            setLoadError('Loading exceeded 75 seconds. Check your connection, then retry.');
            setStatus('error');
          }
        }, 75000);

        setStatus('loading');
        const response = await fetch(modelPath, { signal: request.signal, cache: 'default' });
        if (response.status === 404 || (response.headers.get('content-type') || '').includes('text/html')) {
          if (!disposed) setStatus('missing');
          return;
        }
        if (!response.ok) throw new Error('Model download returned HTTP ' + response.status);

        const contentLength = Number(response.headers.get('content-length') || '0');
        if (contentLength > 75 * 1024 * 1024) throw new Error('Model exceeds the 75 MB viewer safety limit');

        const reader = response.body?.getReader();
        let data: ArrayBuffer;
        if (reader) {
          const chunks: Uint8Array[] = [];
          let received = 0;
          setPhase('Downloading spacecraft model…');
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) continue;
            received += value.byteLength;
            if (received > 75 * 1024 * 1024) {
              await reader.cancel();
              throw new Error('Model exceeds the 75 MB viewer safety limit');
            }
            chunks.push(value);
            if (!disposed && !timedOut && contentLength > 0) {
              setProgress(Math.min(100, Math.round(received / contentLength * 100)));
            }
          }
          const bytes = new Uint8Array(received);
          let offset = 0;
          for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
          data = bytes.buffer;
        } else {
          data = await response.arrayBuffer();
        }
        if (disposed || timedOut) return;

        const header = new DataView(data);
        if (data.byteLength < 12 ||
            String.fromCharCode(...new Uint8Array(data, 0, 4)) !== 'glTF' ||
            header.getUint32(4, true) !== 2 ||
            header.getUint32(8, true) !== data.byteLength) {
          throw new Error('The server did not return a valid GLB 2.0 file');
        }

        setPhase('Preparing textures and engineering details…');
        setProgress(null);
        // NASA's compact GLBs may rely on compressed geometry. A valid GLB header
        // does not imply that a bare GLTFLoader can decode its extensions.
        const loader = new GLTFLoader();
        draco = new DRACOLoader();
        // Pinned official Google Draco decoder release, fetched only by Draco models.
        draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        draco.setWorkerLimit(2);
        loader.setDRACOLoader(draco);
        loader.setMeshoptDecoder(MeshoptDecoder);
        const loaded = await loader.parseAsync(data, '/assets/models/' + machineId + '/');
        if (disposed || timedOut) return;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbac1c8);
        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
        cameraRef.current = camera;

        // Soft mid-gray photography studio: the backdrop separates white parts from
        // the floor, while layered key/fill/rim lights reveal metal and dark panels.
        scene.add(new THREE.HemisphereLight(0xffffff, 0x79838f, 1.45));
        scene.add(new THREE.AmbientLight(0xffffff, 0.42));
        const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.55);
        keyLight.position.set(5, 9, 9);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xe3eeff, 1.7);
        fillLight.position.set(-8, 5, 4);
        scene.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0xffffff, 1.9);
        rimLight.position.set(2, 6, -9);
        scene.add(rimLight);
        const underLight = new THREE.DirectionalLight(0xffffff, 0.65);
        underLight.position.set(1, -6, 3);
        scene.add(underLight);

        const model = loaded.scene;
        // The GLBs come from different creators with dramatically different units.
        // Normalize them to a consistent studio display size without altering originals.
        const rawBounds = new THREE.Box3().setFromObject(model);
        const rawSize = rawBounds.getSize(new THREE.Vector3());
        const largestDimension = Math.max(rawSize.x, rawSize.y, rawSize.z);
        if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
          throw new Error('This GLB has no visible geometry');
        }
        model.scale.multiplyScalar(3.6 / largestDimension);
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
        model.position.sub(center);
        model.updateMatrixWorld(true);
        scene.add(model);

        const studioAspect = Math.max(0.4, host.clientWidth / Math.max(1, host.clientHeight));
        const verticalHalfFov = THREE.MathUtils.degToRad(45 / 2);
        const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * studioAspect);
        const distance = Math.max(5, radius / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov)) * 1.22);
        homeDistanceRef.current = distance;
        camera.position.set(distance * 0.7, distance * 0.43, distance * 0.82);
        camera.lookAt(0, 0, 0);
        camera.near = 0.01;
        camera.far = 300;
        camera.updateProjectionMatrix();

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.95;
        renderer.setClearColor(0xbac1c8, 1);

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
              material.envMapIntensity = Math.max(1.35, material.envMapIntensity ?? 1);
              material.needsUpdate = true;
            }
          }
        });
        host.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.target.set(0, 0, 0);
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
          try {
            if (controls) { controls.autoRotate = autoRotateRef.current; controls.update(); }
            if (renderer && scene) renderer.render(scene, camera);
            animationFrame = requestAnimationFrame(renderFrame);
          } catch (error) {
            active = false;
            console.error('3D render failed:', machineId, error);
            setLoadError('Your browser could not draw this model. Try reloading the exhibit.');
            setStatus('error');
          }
        };
        // Don't hide the loading placeholder until an actual WebGL frame is drawn.
        renderFrame();
        if (active && !timedOut) {
          setProgress(null);
          setStatus('ready');
        }
      } catch (error) {
        if (disposed || timedOut) return;
        console.error('3D exhibit failed to initialize:', machineId, error);
        const message = error instanceof Error ? error.message : 'Unknown model-loading error';
        setLoadError(
          /draco/i.test(message)
            ? 'Compressed geometry could not be decoded. Please check the Draco connection and retry.'
            : /meshopt/i.test(message)
              ? 'Compressed geometry could not be decoded. Please retry on an updated browser.'
              : message.slice(0, 160)
        );
        setStatus('error');
      } finally {
        window.clearTimeout(loadTimer);
      }
    };

    void start();
    return () => {
      disposed = true;
      active = false;
      request.abort();
      window.clearTimeout(loadTimer);
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      controls?.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      draco?.dispose();
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
          <strong>{status === 'checking' || status === 'loading' ? (progress !== null ? `Loading 3D model… ${progress}%` : phase) :
            status === 'missing' ? '3D model coming soon' : '3D preview unavailable'}</strong>
          <p>{status === 'missing' ? 'Our exhibition is ready for this machine\'s GLB file. The mission story and timeline are available below.' :
            status === 'error' ? loadError || 'This model could not be displayed. Please try again.' :
            'Loading the engineering exhibit. Large detailed models can take a little longer.'}</p>
          {status === 'error' && <a className="viewer-file-link" href={modelPathFor(machineId)} download={machineId + '.glb'}>Download model for troubleshooting</a>}
          {status === 'error' && <button type="button" className="viewer-retry-button" onClick={() => setReloadKey(key => key + 1)}>Try loading again ↻</button>}
        </div>
      )}
      {status === 'ready' && (
        <div className="viewer-controls">
          <span>DRAG TO ROTATE · SCROLL OR PINCH TO ZOOM · GRAY STUDIO</span>
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
