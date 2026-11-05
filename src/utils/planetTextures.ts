import * as THREE from 'three';

/**
 * Procedural texture generator for high-realism solar system planets.
 * Completely self-contained, 0 external network requests, 0 CORS issues.
 */

// Helper to create a canvas texture with SRGB color space
function createTextureFromCanvas(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// Simple noise helper for canvas
function addNoise(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);
}

// 1. Sun Surface Texture
export function createSunTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Base radiant orange/gold
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#f97316');
  grad.addColorStop(0.3, '#fbbf24');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(0.7, '#fbbf24');
  grad.addColorStop(1, '#ea580c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Solar granules and convection cells
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 4 + 1;
    ctx.globalAlpha = Math.random() * 0.25 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Turbulent magnetic swirls
  ctx.lineWidth = 3;
  for (let i = 0; i < 180; i++) {
    ctx.strokeStyle = Math.random() > 0.4 ? '#ffedd5' : '#7c2d12';
    ctx.globalAlpha = Math.random() * 0.2 + 0.05;
    ctx.beginPath();
    let sx = Math.random() * w;
    let sy = Math.random() * h;
    ctx.moveTo(sx, sy);
    for (let s = 0; s < 5; s++) {
      sx += (Math.random() - 0.5) * 60;
      sy += (Math.random() - 0.5) * 30;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  // Sunspots
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 14; i++) {
    const spotX = Math.random() * w;
    const spotY = h * 0.35 + Math.random() * (h * 0.3); // Mid-latitudes
    const rad = Math.random() * 12 + 4;
    // Penumbra
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.arc(spotX, spotY, rad * 1.6, 0, Math.PI * 2);
    ctx.fill();
    // Umbra
    ctx.fillStyle = '#431407';
    ctx.beginPath();
    ctx.arc(spotX, spotY, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  return createTextureFromCanvas(canvas);
}

// 2. Mercury Texture (Rocky, heavily cratered, Caloris Basin)
export function createMercuryTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Dark dusty basalt grey with subtle brownish tones
  ctx.fillStyle = '#7a7672';
  ctx.fillRect(0, 0, w, h);

  // Albedo variations / highlands
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * w;
    const ry = Math.random() * h;
    const rad = Math.random() * 140 + 40;
    const g = ctx.createRadialGradient(rx, ry, 5, rx, ry, rad);
    g.addColorStop(0, Math.random() > 0.5 ? '#948f88' : '#575450');
    g.addColorStop(1, 'rgba(122, 118, 114, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters & Ejecta Rays
  for (let i = 0; i < 600; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const r = Math.random() * 9 + 1.5;

    // Rim
    ctx.fillStyle = '#bab4ab';
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Shadow
    ctx.fillStyle = '#3a3836';
    ctx.beginPath();
    ctx.arc(cx + r * 0.25, cy + r * 0.2, r * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Ejecta rays on prominent craters
    if (r > 6) {
      ctx.strokeStyle = '#d5cfc5';
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      for (let ray = 0; ray < 8; ray++) {
        const ang = Math.random() * Math.PI * 2;
        const len = r * (Math.random() * 6 + 3);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
        ctx.stroke();
      }
    }
  }

  // Caloris Basin
  const cbX = w * 0.4, cbY = h * 0.48, cbR = 60;
  const cbG = ctx.createRadialGradient(cbX, cbY, 10, cbX, cbY, cbR);
  cbG.addColorStop(0, '#5a544f');
  cbG.addColorStop(0.7, '#8f887f');
  cbG.addColorStop(1, 'rgba(122, 118, 114, 0)');
  ctx.fillStyle = cbG;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(cbX, cbY, cbR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 3. Venus Texture (Dense sulfuric acid atmospheric swirls)
export function createVenusTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Smooth warm ochre / cream base
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#d8aa72');
  grad.addColorStop(0.2, '#f0cf98');
  grad.addColorStop(0.5, '#deb079');
  grad.addColorStop(0.8, '#f3d6a6');
  grad.addColorStop(1, '#caa068');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Broad planetary wind bands
  for (let y = 0; y < h; y += 4) {
    const factor = Math.sin(y * 0.04) * 0.5 + 0.5;
    ctx.fillStyle = factor > 0.5 ? '#e9c18a' : '#c9965a';
    ctx.globalAlpha = 0.22;
    ctx.fillRect(0, y, w, 4);
  }

  // High-speed V-shaped cloud chevron patterns
  ctx.lineWidth = 8;
  for (let i = 0; i < 90; i++) {
    const yPos = Math.random() * h;
    ctx.strokeStyle = Math.random() > 0.5 ? '#fff2d6' : '#ad7a42';
    ctx.globalAlpha = 0.14;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.bezierCurveTo(
      w * 0.3, yPos + (yPos < h / 2 ? 30 : -30),
      w * 0.7, yPos + (yPos < h / 2 ? 20 : -20),
      w, yPos
    );
    ctx.stroke();
  }

  // Polar vortex streaks
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#b37c44';
  ctx.fillRect(0, 0, w, 35);
  ctx.fillRect(0, h - 35, w, 35);

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 4. Earth Day Map (Realistic continents, oceans, deserts, ice caps)
export function createEarthTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#0c2340');
  oceanGrad.addColorStop(0.5, '#0f386b');
  oceanGrad.addColorStop(1, '#0c2340');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // Continental landmasses helper
  function drawBlob(x: number, y: number, rx: number, ry: number, color: string, alpha = 0.95) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const green = '#2d5a27';
  const forest = '#1f431a';
  const desert = '#c2a15c';
  const mountain = '#8c7653';

  // North America
  drawBlob(w * 0.22, h * 0.32, 70, 48, green);
  drawBlob(w * 0.25, h * 0.25, 65, 35, forest);
  drawBlob(w * 0.18, h * 0.35, 30, 45, desert); // American West
  drawBlob(w * 0.22, h * 0.44, 18, 30, green); // Central America

  // South America
  drawBlob(w * 0.31, h * 0.65, 42, 72, forest); // Amazonia
  drawBlob(w * 0.29, h * 0.78, 22, 50, green); // Andes / Patagonia
  drawBlob(w * 0.33, h * 0.68, 25, 35, green); // Brazil

  // Eurasia
  drawBlob(w * 0.62, h * 0.3, 130, 52, forest); // Russia / Siberia
  drawBlob(w * 0.52, h * 0.32, 45, 35, green); // Europe
  drawBlob(w * 0.72, h * 0.38, 70, 45, green); // East Asia
  drawBlob(w * 0.65, h * 0.42, 38, 30, mountain); // Himalayas / Tibetan plateau
  drawBlob(w * 0.64, h * 0.48, 28, 32, green); // India

  // Africa
  drawBlob(w * 0.51, h * 0.45, 45, 25, desert); // Sahara
  drawBlob(w * 0.53, h * 0.58, 38, 48, forest); // Central Africa
  drawBlob(w * 0.54, h * 0.72, 30, 35, green); // Southern Africa

  // Middle East
  drawBlob(w * 0.58, h * 0.42, 28, 20, desert);

  // Australia & Indonesia
  drawBlob(w * 0.82, h * 0.7, 45, 32, desert);
  drawBlob(w * 0.85, h * 0.72, 35, 28, green); // Coastal Australia
  drawBlob(w * 0.78, h * 0.55, 32, 10, forest); // Indonesia

  // Polar Ice Caps
  // Arctic
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, w, 28);
  drawBlob(w * 0.36, 35, 45, 20, '#e0f2fe'); // Greenland

  // Antarctica
  ctx.fillRect(0, h - 35, w, 35);
  for (let i = 0; i < 8; i++) {
    drawBlob(Math.random() * w, h - 38, 60, 20, '#f0f9ff');
  }

  // Rough coastal texture
  addNoise(ctx, w, h, 20);

  return createTextureFromCanvas(canvas);
}

// 5. Earth Clouds Texture
export function createEarthCloudsTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, w, h);

  // Cyclonic storms & cloud bands
  for (let i = 0; i < 280; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const rx = Math.random() * 50 + 15;
    const ry = Math.random() * 20 + 6;
    const g = ctx.createRadialGradient(x, y, 2, x, y, rx);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    g.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.6);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Equatorial cloud band (ITCZ)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * w;
    const y = h * 0.5 + (Math.random() - 0.5) * 40;
    const g = ctx.createRadialGradient(x, y, 4, x, y, 60);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  return createTextureFromCanvas(canvas);
}

// 6. Moon Texture (Maria, Tycho crater, rugged regolith)
export function createMoonTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Light lunar highland base
  ctx.fillStyle = '#b0aba2';
  ctx.fillRect(0, 0, w, h);

  // Dark basaltic Lunar Maria (Sea of Tranquility, Ocean of Storms, etc.)
  const drawMare = (x: number, y: number, r: number) => {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, '#53504c');
    g.addColorStop(0.7, '#67635e');
    g.addColorStop(1, 'rgba(176, 171, 162, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // Nearside Maria clusters
  drawMare(w * 0.32, h * 0.42, 65); // Ocean of Storms (Surveyor 3 landing site!)
  drawMare(w * 0.45, h * 0.38, 48); // Mare Imbrium
  drawMare(w * 0.55, h * 0.44, 45); // Mare Serenitatis
  drawMare(w * 0.62, h * 0.48, 42); // Mare Tranquillitatis (Apollo 11)
  drawMare(w * 0.68, h * 0.52, 35); // Mare Crisium
  drawMare(w * 0.48, h * 0.62, 40); // Mare Nubium

  // Fine cratering across all longitudes
  for (let i = 0; i < 800; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const r = Math.random() * 7 + 1.2;

    ctx.fillStyle = '#dbd6cc';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2f2d2a';
    ctx.beginPath();
    ctx.arc(cx + r * 0.25, cy + r * 0.25, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tycho Crater with prominent white ray system
  const tyX = w * 0.48, tyY = h * 0.76;
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.2;
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2 + Math.random() * 0.2;
    const len = Math.random() * 120 + 60;
    ctx.beginPath();
    ctx.moveTo(tyX, tyY);
    ctx.lineTo(tyX + Math.cos(ang) * len, tyY + Math.sin(ang) * len);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tyX, tyY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 7. Mars Texture (Iron oxide red-orange, Syrtis Major, Valles Marineris, Polar Ice Caps)
export function createMarsTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Rich oxidized red-orange background
  const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
  baseGrad.addColorStop(0, '#a84c2f');
  baseGrad.addColorStop(0.5, '#c85e3a');
  baseGrad.addColorStop(1, '#9e4428');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  // Dark albedo basaltic terrain (Syrtis Major, Mare Tyrrhenum)
  const drawDarkFeature = (x: number, y: number, rx: number, ry: number, rot = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const g = ctx.createRadialGradient(0, 0, 5, 0, 0, rx);
    g.addColorStop(0, '#421f15');
    g.addColorStop(0.7, '#6b3223');
    g.addColorStop(1, 'rgba(200, 94, 58, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawDarkFeature(w * 0.58, h * 0.52, 60, 42, -0.2); // Syrtis Major
  drawDarkFeature(w * 0.48, h * 0.62, 85, 35, 0.1);  // Mare Erythraeum
  drawDarkFeature(w * 0.72, h * 0.58, 70, 32, -0.15); // Tyrrhenum
  drawDarkFeature(w * 0.22, h * 0.45, 55, 30, 0);     // Acidalia Planitia

  // Valles Marineris canyon grand rift
  ctx.strokeStyle = '#31140c';
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(w * 0.26, h * 0.54);
  ctx.bezierCurveTo(w * 0.32, h * 0.56, w * 0.38, h * 0.54, w * 0.44, h * 0.58);
  ctx.stroke();

  // Olympus Mons and Tharsis volcanic plateau
  ctx.fillStyle = '#de7a52';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(w * 0.18, h * 0.48, 22, 0, Math.PI * 2); // Olympus Mons
  ctx.fill();
  ctx.fillStyle = '#421a10';
  ctx.beginPath();
  ctx.arc(w * 0.18, h * 0.48, 6, 0, Math.PI * 2); // Caldera
  ctx.fill();

  // Brilliant Polar Ice Caps (Water/CO2 ice)
  // North Pole
  ctx.fillStyle = '#f8fafc';
  ctx.globalAlpha = 0.95;
  ctx.fillRect(0, 0, w, 24);
  // South Pole
  ctx.fillRect(0, h - 22, w, 22);

  // Surface texture
  addNoise(ctx, w, h, 18);

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 8. Jupiter Texture (Detailed belts, turbulence, Great Red Spot)
export function createJupiterTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Alternating gas zones (light) and belts (dark brown/orange)
  const colors = [
    '#5c4a3b', // Polar dark
    '#9e816a',
    '#d6c1a8', // North Polar Zone
    '#b47953', // North Temperate Belt
    '#ebd8c5', // North Tropical Zone
    '#a85c36', // North Equatorial Belt (deep reddish-brown)
    '#eddcc8', // Equatorial Zone
    '#9e502c', // South Equatorial Belt (rich caramel)
    '#eed9c4', // South Tropical Zone
    '#b0764e', // South Temperate Belt
    '#cbb39d',
    '#544437'  // South Polar dark
  ];

  const bandH = h / colors.length;
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(0, i * bandH, w, bandH + 2);
  }

  // Wavy turbulence along shear boundaries
  for (let b = 1; b < colors.length; b++) {
    const y = b * bandH;
    ctx.strokeStyle = colors[b % 2 === 0 ? b - 1 : b];
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < w; x += 15) {
      const dy = Math.sin(x * 0.05 + b) * 5 + (Math.random() - 0.5) * 3;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  // White ammonia oval storms
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * w;
    const y = Math.random() * (h * 0.6) + h * 0.2;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Great Red Spot (Anticyclonic storm, iconic giant storm)
  const grsX = w * 0.68;
  const grsY = h * 0.63; // Located in the South Tropical Zone / South Equatorial Belt
  const grsW = 54;
  const grsH = 28;

  // Outer turbulence cradle
  ctx.fillStyle = '#ecd8c4';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsW * 1.35, grsH * 1.35, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Red Spot body
  const grsG = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, grsW);
  grsG.addColorStop(0, '#c2410c'); // Deep crimson center
  grsG.addColorStop(0.6, '#ea580c'); // Bright brick red
  grsG.addColorStop(1, '#b45309');
  ctx.fillStyle = grsG;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsW, grsH, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Spiral swirl detail inside Red Spot
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(grsX, grsY, 12, 0, Math.PI * 1.3);
  ctx.stroke();

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 9. Saturn Texture (Pastel butterscotch banded atmosphere)
export function createSaturnTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const colors = [
    '#786e58', // North pole hexagon region
    '#baa37b',
    '#dfcb9b',
    '#eddcb0',
    '#f5e8c3', // Warm golden equatorial zone
    '#f8edd0',
    '#ebd8a8',
    '#dbbf88',
    '#bda26f',
    '#7a6f59'  // South pole
  ];

  const bandH = h / colors.length;
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(0, i * bandH, w, bandH + 2);
  }

  // Smooth delicate streaks
  for (let y = 0; y < h; y += 3) {
    ctx.fillStyle = Math.sin(y * 0.1) > 0 ? '#fdf6e2' : '#c8ad74';
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, y, w, 3);
  }

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// Saturn Rings Texture (Concentric rings with Cassini Division)
export function createSaturnRingTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = 1; // 1D radial ring map
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, 1);
  const d = imgData.data;

  // Map radius from inner (0) to outer (size)
  for (let x = 0; x < size; x++) {
    const u = x / size; // 0 = inner edge, 1 = outer edge
    let alpha = 0;
    let r = 210, g = 190, b = 150;

    if (u < 0.15) {
      // Inner C-ring: faint, semi-transparent
      alpha = u * 2.5 * 120;
      r = 170; g = 150; b = 120;
    } else if (u < 0.6) {
      // Dense B-Ring: brightest, opaque
      const sub = (Math.sin(u * 120) * 0.1 + 0.9);
      alpha = 240 * sub;
      r = 235; g = 215; b = 175;
    } else if (u < 0.68) {
      // Cassini Division: clear gap!
      alpha = 15;
    } else if (u < 0.94) {
      // A-Ring: medium brightness with Encke gap
      const encke = Math.abs(u - 0.85) < 0.02 ? 0.2 : 1.0;
      alpha = (180 + Math.sin(u * 90) * 20) * encke;
      r = 210; g = 195; b = 160;
    } else {
      // Outer dropoff
      alpha = Math.max(0, (1 - u) / 0.06 * 140);
    }

    const idx = x * 4;
    d[idx] = r;
    d[idx + 1] = g;
    d[idx + 2] = b;
    d[idx + 3] = Math.min(255, Math.max(0, Math.floor(alpha)));
  }

  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 10. Uranus Texture (Aquamarine cyan ice giant)
export function createUranusTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#589fa8');
  grad.addColorStop(0.3, '#7bcad4');
  grad.addColorStop(0.5, '#92dce4');
  grad.addColorStop(0.7, '#7bcad4');
  grad.addColorStop(1, '#5397a0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Soft subtle latitudinal methane banding
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = Math.sin(y * 0.04) > 0 ? '#b5eef4' : '#68abb4';
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, y, w, 4);
  }

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 11. Neptune Texture (Deep vivid royal azure with high-altitude methane clouds & Dark Spot)
export function createNeptuneTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1c3d7a');
  grad.addColorStop(0.3, '#2a5eb5');
  grad.addColorStop(0.5, '#3b74d6');
  grad.addColorStop(0.7, '#2456ac');
  grad.addColorStop(1, '#18346e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Atmospheric banding
  for (let y = 0; y < h; y += 5) {
    ctx.fillStyle = Math.sin(y * 0.08) > 0 ? '#4983e2' : '#1e438c';
    ctx.globalAlpha = 0.18;
    ctx.fillRect(0, y, w, 5);
  }

  // Great Dark Spot
  const dsX = w * 0.45, dsY = h * 0.42;
  const dsG = ctx.createRadialGradient(dsX, dsY, 4, dsX, dsY, 32);
  dsG.addColorStop(0, '#0f2452');
  dsG.addColorStop(0.7, '#1b3b7c');
  dsG.addColorStop(1, 'rgba(59, 116, 214, 0)');
  ctx.fillStyle = dsG;
  ctx.beginPath();
  ctx.ellipse(dsX, dsY, 34, 18, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Brilliant white methane cirrus cloud streaks
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 35; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * (h * 0.7) + h * 0.15;
    ctx.globalAlpha = Math.random() * 0.5 + 0.35;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.random() * 70 + 25, sy + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}

// 12. Pluto Texture (Nitrogen ice plains, Tombaugh Regio Heart, cratered tholin terrain)
export function createPlutoTexture(): THREE.CanvasTexture {
  const w = 1024, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Russet brown tholin base
  ctx.fillStyle = '#8b6754';
  ctx.fillRect(0, 0, w, h);

  // Cthulhu Macula dark equatorial belt
  ctx.fillStyle = '#42281a';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(w * 0.35, h * 0.55, 120, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tombaugh Regio (The iconic bright nitrogen ice Heart!)
  const heartX = w * 0.55, heartY = h * 0.5;
  ctx.fillStyle = '#f5ede4';
  ctx.globalAlpha = 0.95;
  // Left lobe (Sputnik Planitia)
  ctx.beginPath();
  ctx.ellipse(heartX - 25, heartY - 10, 42, 50, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Right lobe
  ctx.beginPath();
  ctx.ellipse(heartX + 22, heartY - 10, 36, 44, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Subtle craters
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 5 + 1;
    ctx.fillStyle = '#2d180e';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
  return createTextureFromCanvas(canvas);
}
