import { useEffect, useRef, useState, type FC } from 'react';
import * as THREE from 'three';
import { machines } from '../data';
import { sitesForWorld, formatSiteCoordinates, type MissionSite } from '../data/missionSites';
import { createMoonTexture, createMarsTexture } from '../utils/planetTextures';
import { PlanetArtwork } from './PlanetArtwork';

type World = 'moon' | 'mars';

interface PlanetarySiteExplorerProps {
  world: World;
  onSelectExhibit: (machineId: string) => void;
}
interface SurfaceSource {
  source: 'nasa-trek' | 'solar-system-scope' | 'procedural';
  sourceUrl: string;
  credit: string;
  name: string;
}

const localHero: Record<string, string> = {
  'surveyor-3': '/assets/exhibits/surveyor-3/Surveyor3.webp',
  'apollo-15-lrv': '/assets/exhibits/apollo-15-lrv/hero.webp',
  'viking-1': '/assets/exhibits/viking-1/hero.webp',
  'sojourner': '/assets/exhibits/sojourner/hero.webp',
  opportunity: '/assets/exhibits/opportunity/hero.webp',
  insight: '/assets/exhibits/insight/hero.webp',
};

/** NASA coordinates: planetocentric, latitude north-positive, longitude east-positive.
 * Three SphereGeometry U is (longitude + 180)/360 for the equirectangular mosaic. */
function surfacePoint(lat: number, lon: number, radius: number): THREE.Vector3 {
  const theta = THREE.MathUtils.degToRad(90 - lat);
  const phi = THREE.MathUtils.degToRad(180 + lon);
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function facingYaw(site: MissionSite): number {
  const p = surfacePoint(site.latitude, site.longitude, 1);
  return Math.atan2(-p.x, p.z);
}

/**
 * Our own Moon/Mars mission-history interface: an archival dispatch panel,
 * NASA surface globe, source attribution, and compact chronological selector.
 * Deliberately differs from the broad, multi-object EXOARCHIVE archive.
 */
export const PlanetarySiteExplorer: FC<PlanetarySiteExplorerProps> = ({ world, onSelectExhibit }) => {
  const sites = sitesForWorld(world);
  const [selectedId, setSelectedId] = useState<string>(sites[0]?.machineId ?? '');
  const [webglFailed, setWebglFailed] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [source, setSource] = useState<SurfaceSource>({
    source: 'procedural', sourceUrl: '', credit: 'Procedural fallback illustration',
    name: 'Illustrative globe',
  });
  const mount = useRef<HTMLDivElement | null>(null);
  const sceneApi = useRef<{ focus: (site: MissionSite) => void } | null>(null);
  const chosenId = useRef(selectedId);
  chosenId.current = selectedId;

  const active = sites.find(s => s.machineId === selectedId) ?? sites[0];
  const machine = machines.find(m => m.id === active?.machineId);

  useEffect(() => {
    setSelectedId(sitesForWorld(world)[0]?.machineId ?? '');
  }, [world]);

  useEffect(() => {
    let stopped = false;
    setMapFailed(false);
    setMapLoaded(false);
    fetch('/assets/nasa-maps/sources.json')
      .then(r => { if (!r.ok) throw new Error('Source manifest unavailable'); return r.json(); })
      .then(data => { if (!stopped && data[world]) setSource(data[world] as SurfaceSource); })
      .catch(() => { if (!stopped) setSource({
        source: 'procedural', sourceUrl: '', credit: 'Illustrative backup texture',
        name: 'Procedural educational globe',
      }); });
    return () => { stopped = true; };
  }, [world]);

  useEffect(() => {
    const canvasMount = mount.current;
    if (!canvasMount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch {
      setWebglFailed(true);
      return;
    }

    let destroyed = false;
    setWebglFailed(false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    canvasMount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0, 4.55);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xa3bdd5, 0.55));
    const sun = new THREE.DirectionalLight(0xffeddb, 2.5);
    sun.position.set(-3, 2.5, 5);
    scene.add(sun);

    const globe = new THREE.Group();
    scene.add(globe);
    const radius = 1.5;
    const procedural = world === 'moon' ? createMoonTexture() : createMarsTexture();
    const material = new THREE.MeshStandardMaterial({
      map: procedural, roughness: 1, metalness: 0,
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), material);
    globe.add(sphere);
    const markerHits: THREE.Object3D[] = [];
    const materialsById = new Map<string, THREE.MeshBasicMaterial>();

    const worldSites = sitesForWorld(world);
    for (const site of worldSites) {
      const position = surfacePoint(site.latitude, site.longitude, radius * 1.012);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xd9a066 });
      const marker = new THREE.Mesh(new THREE.SphereGeometry(.035, 16, 12), dotMaterial);
      marker.position.copy(position);
      marker.userData.machineId = site.machineId;
      globe.add(marker);
      materialsById.set(site.machineId, dotMaterial);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(.055, .082, 32),
        new THREE.MeshBasicMaterial({ color: 0xf3e1c5, transparent: true, opacity: .68, side: THREE.DoubleSide, depthWrite: false }),
      );
      halo.position.copy(position.clone().multiplyScalar(1.016));
      halo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
      globe.add(halo);

      // Larger invisible target for easier pointing on narrow screens.
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(.11, 12, 10),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      hit.position.copy(position);
      hit.userData.machineId = site.machineId;
      globe.add(hit);
      markerHits.push(hit);
    }

    let targetYaw = facingYaw(worldSites[0]);
    globe.rotation.y = targetYaw;
    let rafId = 0;
    let last = 0;
    let dragging = false;
    let dragged = false;
    let startX = 0;
    let previousX = 0;
    let pointId: number | null = null;

    const focus = (site: MissionSite) => {
      const angle = facingYaw(site);
      const delta = Math.atan2(Math.sin(angle - targetYaw), Math.cos(angle - targetYaw));
      targetYaw += delta;
      for (const [key, mat] of materialsById) {
        mat.color.setHex(key === site.machineId ? 0xffe8bc : 0xd9a066);
      }
    };
    sceneApi.current = { focus };
    focus(worldSites.find(s => s.machineId === chosenId.current) ?? worldSites[0]);

    const updateSize = () => {
      if (!canvasMount.clientWidth || !canvasMount.clientHeight || !renderer) return;
      camera.aspect = canvasMount.clientWidth / canvasMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasMount.clientWidth, canvasMount.clientHeight, false);
    };
    updateSize();
    const resize = new ResizeObserver(updateSize);
    resize.observe(canvasMount);

    // Keep rendering only while the active destination section is visible.
    let isVisible = true;
    const visibility = new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting ?? false;
    }, { rootMargin: '140px' });
    visibility.observe(canvasMount);

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      const deltaSeconds = Math.min((time - last) / 1000 || 0.016, .1);
      last = time;
      if (!isVisible) return;
      const drift = Math.atan2(Math.sin(targetYaw - globe.rotation.y), Math.cos(targetYaw - globe.rotation.y));
      globe.rotation.y += drift * Math.min(1, deltaSeconds * 6);
      renderer?.render(scene, camera);
    };
    rafId = requestAnimationFrame(draw);

    const surfaceMap = new THREE.TextureLoader();
    const file = '/assets/nasa-maps/' + world + '_2k.webp';
    surfaceMap.load(
      file,
      texture => {
        if (destroyed) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = Math.min(renderer?.capabilities.getMaxAnisotropy() ?? 1, 8);
        material.map = texture;
        material.needsUpdate = true;
        setMapLoaded(true);
      },
      undefined,
      () => { if (!destroyed) setMapFailed(true); },
    );

    const dom = renderer.domElement;
    const down = (e: PointerEvent) => {
      dragging = true; dragged = false; startX = e.clientX; previousX = e.clientX;
      pointId = e.pointerId;
      dom.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointId) return;
      if (Math.abs(e.clientX - startX) > 5) dragged = true;
      const dx = e.clientX - previousX;
      previousX = e.clientX;
      if (dragged) targetYaw += dx * .006;
    };
    const up = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointId) return;
      dragging = false;
      if (dom.hasPointerCapture?.(e.pointerId)) dom.releasePointerCapture(e.pointerId);
      if (!dragged) {
        const rect = dom.getBoundingClientRect();
        const pointer = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(pointer, camera);
        const planetHit = ray.intersectObject(sphere, false)[0]?.distance ?? Number.POSITIVE_INFINITY;
        const siteHit = ray.intersectObjects(markerHits, false)
          .find(hit => hit.distance <= planetHit + .14);
        const id = siteHit?.object.userData.machineId as string | undefined;
        if (id) setSelectedId(id);
      }
      pointId = null;
    };
    dom.addEventListener('pointerdown', down);
    dom.addEventListener('pointermove', move);
    dom.addEventListener('pointerup', up);
    dom.addEventListener('pointercancel', up);
    dom.style.touchAction = 'pan-y';

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      resize.disconnect();
      visibility.disconnect();
      dom.removeEventListener('pointerdown', down);
      dom.removeEventListener('pointermove', move);
      dom.removeEventListener('pointerup', up);
      dom.removeEventListener('pointercancel', up);
      sceneApi.current = null;
      scene.traverse(obj => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat?.dispose();
      });
      material.map?.dispose();
      if (material.map !== procedural) procedural.dispose();
      renderer.dispose();
      if (dom.parentNode === canvasMount) canvasMount.removeChild(dom);
    };
  }, [world]);

  useEffect(() => {
    const selected = sitesForWorld(world).find(s => s.machineId === selectedId);
    if (selected) sceneApi.current?.focus(selected);
  }, [world, selectedId]);

  if (!machine || !active) return null;

  const image = localHero[machine.id];
  const sourceLabel = !mapLoaded || mapFailed
    ? 'Illustrated globe · NASA-referenced site coordinates'
    : source.source === 'nasa-trek'
      ? 'NASA Trek global surface mosaic'
      : source.source === 'solar-system-scope'
        ? 'Solar System Scope visual texture · CC BY 4.0'
        : 'Planetary illustration';

  return (
    <section className="planetary-site-explorer" aria-label={`${world} mission landing sites`}>
      <div className="planetary-site-heading">
        <div>
          <p className="eyebrow">THE EXPLORATION ATLAS · {world.toUpperCase()}</p>
          <h3>Where the missions began.</h3>
          <p>Select a year to reveal a machine's landing region and the science it made possible.</p>
        </div>
        <span className="planetary-site-count">{sites.length} historic landing regions</span>
      </div>

      <nav className="planetary-site-years" aria-label="Mission landing chronology">
        {sites.map(site => {
          const selected = active.machineId === site.machineId;
          const m = machines.find(item => item.id === site.machineId);
          return (
            <button key={site.machineId} type="button"
              className={`mission-site-year${selected ? ' is-selected' : ''}`}
              aria-current={selected ? 'step' : undefined}
              onClick={() => setSelectedId(site.machineId)}>
              <span className="mission-site-year-number">{site.arrivalYear}</span>
              <span className="mission-site-year-title">{m?.name ?? site.machineId}</span>
            </button>
          );
        })}
      </nav>

      <div className="planetary-site-stage">
        <div className="planetary-site-story" aria-live="polite">
          <p className="eyebrow">MISSION {String(sites.indexOf(active) + 1).padStart(2,'0')} / {String(sites.length).padStart(2,'0')}</p>
          <h4>{machine.name}</h4>
          <div className="planetary-site-region">{active.region}</div>
          <p>{active.detail}</p>
          <div className="planetary-site-meta">
            <span>{formatSiteCoordinates(active.latitude, active.longitude)}</span>
            <span>{active.kind === 'landing-region' ? 'Landing region · approximate' : 'Historic landing site'}</span>
          </div>
          <div className="planetary-site-actions">
            <button type="button" className="planetary-site-primary" onClick={() => onSelectExhibit(machine.id)}>
              Explore {machine.name} <span aria-hidden="true">→</span>
            </button>
            <a href={active.source} target="_blank" rel="noopener noreferrer">NASA source ↗</a>
          </div>
        </div>

        <div className="planetary-site-globe-area">
          <div className="planetary-site-globe" ref={mount} aria-label={`Rotatable 3D ${world} globe with mission landing-site markers`}/>
          {webglFailed && (
            <div className="planetary-site-2d" role="img" aria-label={`Planetary surface map for ${world}`}>
              <img src={`/assets/nasa-maps/${world}_2k.webp`} alt="" onError={() => setMapFailed(true)} />
              {mapFailed && <PlanetArtwork planetKey={world} className="planetary-site-art-fallback" />}
              {sites.map(site => (
                <button key={site.machineId} type="button"
                  className={`planetary-site-map-pin${site.machineId === active.machineId ? ' active' : ''}`}
                  style={{ left: `${((site.longitude + 180) / 360) * 100}%`, top: `${((90 - site.latitude) / 180) * 100}%` }}
                  aria-label={`Locate ${machines.find(m => m.id === site.machineId)?.name ?? site.machineId}`}
                  onClick={() => setSelectedId(site.machineId)} />
              ))}
            </div>
          )}
          {image && (
            <div className="planetary-site-machine-plate">
              <img src={image} alt={`Exhibit illustration of ${machine.name}`} loading="lazy" />
              <span>{machine.name} · {active.arrivalYear}</span>
            </div>
          )}
          <div className="planetary-site-globe-caption">{webglFailed ? 'SELECT A MARKER' : 'DRAG THE GLOBE · SELECT A SITE MARKER'}</div>
        </div>
      </div>
      <div className="planetary-site-provenance">
        <span>{sourceLabel}</span>
        {mapLoaded && !mapFailed && source.sourceUrl && <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer">Map imagery source ↗</a>}
        <span className="planetary-site-accuracy">Surface locations are illustrative markers, not exact rover final positions. Globe relief and distances are not to scale.</span>
      </div>
    </section>
  );
};
