import * as THREE from "three";

const machines = [
  {id:"surveyor-3",name:"Surveyor 3",place:"Moon",area:"moon",kind:"Robotic lander",year:"1967",summary:"A pioneering robotic lander that examined the lunar surface and returned close-up television images.",location:"Lunar landing site",detail:"Surveyor 3 landed in the Ocean of Storms. Apollo 12 astronauts later visited the spacecraft."},
  {id:"apollo-15-lrv",name:"Apollo 15 Lunar Roving Vehicle",place:"Moon",area:"moon",kind:"Crewed lunar rover",year:"1971",summary:"The battery-powered rover that extended the range of astronauts exploring the lunar surface.",location:"Lunar traverse",detail:"The rover carried astronauts David Scott and James Irwin across the Hadley–Apennine region."},
  {id:"sojourner",name:"Sojourner",place:"Mars",area:"mars",kind:"Robotic rover",year:"1997",summary:"The first successful Mars rover, demonstrating mobile robotic exploration on another planet.",location:"Mars landing site and traverse",detail:"Sojourner explored the Ares Vallis landing area as part of the Mars Pathfinder mission."},
  {id:"opportunity",name:"Opportunity",place:"Mars",area:"mars",kind:"Robotic rover",year:"2004",summary:"A long-lived Mars rover that studied rocks and evidence of ancient water.",location:"Rover final location",detail:"Opportunity explored Meridiani Planum and continued operating for more than fourteen years."},
  {id:"insight",name:"InSight",place:"Mars",area:"mars",kind:"Robotic lander",year:"2018",summary:"A stationary lander that studied the deep interior of Mars using seismic and heat-flow measurements.",location:"Lander site",detail:"InSight operated on Elysium Planitia and helped reveal the planet's internal structure."},
  {id:"pioneer-10",name:"Pioneer 10",place:"Deep Space",area:"deep-space",kind:"Space probe",year:"1972",summary:"The first spacecraft to make a close encounter with Jupiter and continue outward into deep space.",location:"Jupiter flyby encounter",detail:"Pioneer 10 flew past Jupiter in 1973. It did not land on the planet."}
];

const destinations = {
  moon:{title:"The Moon",eyebrow:"DESTINATION 01 / MOON",description:"A world explored by robotic pioneers and astronauts. Discover the machines that tested the lunar surface and helped people travel across it.",intro:"Explore the machines that helped humanity reach and travel across another world."},
  mars:{title:"Mars",eyebrow:"DESTINATION 02 / MARS",description:"A neighbouring planet explored by landers and rovers. Their observations have transformed our understanding of Martian geology, climate and history.",intro:"Meet the robotic explorers that studied the Red Planet."},
  "deep-space":{title:"Deep Space",eyebrow:"DESTINATION 03 / DEEP SPACE",description:"Beyond the familiar worlds, spacecraft carry instruments and messages into the vastness between the stars.",intro:"Follow a spacecraft whose journey took it beyond the planets."}
};

const entrance = document.querySelector("#entrance");
const museum = document.querySelector("#museum");
const solarView = document.querySelector("#solar-view");
const collectionView = document.querySelector("#collection-view");
const destinationView = document.querySelector("#destination-view");
let currentDestination = "moon";
let renderer, scene, camera, animationId, resizeObserver;
let selectedMesh = null;
const planetMeshes = new Map();

function enterMuseum() {
  entrance.classList.add("opening");
  window.setTimeout(() => {
    entrance.classList.add("hidden");
    museum.classList.remove("hidden");
    if (!renderer) initSolarSystem();
  }, 850);
}
document.querySelector("#enter-button").addEventListener("click", enterMuseum);
document.querySelector("#skip-button").addEventListener("click", enterMuseum);
document.querySelector("#replay-intro").addEventListener("click", () => {
  museum.classList.add("hidden");
  entrance.classList.remove("hidden","opening");
});
document.querySelector("#brand-home").addEventListener("click", event => {
  event.preventDefault();
  showView("solar");
});
document.querySelector("#welcome-audio").addEventListener("click", event => {
  const button = event.currentTarget;
  if (!("speechSynthesis" in window)) {
    button.textContent = "Narration unavailable — read the transcript below";
    return;
  }
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    button.textContent = "▶ Play welcome narration";
    button.setAttribute("aria-pressed","false");
  } else {
    const narration = new SpeechSynthesisUtterance("Welcome to the Cosmic Heroes of Steel Museum. Here, we celebrate the machines that carried humanity's curiosity beyond Earth. Some explored distant worlds, some uncovered secrets beneath alien skies, and some continued their journeys long after their final signals. Take a moment, open the curtains, and discover the stories behind these extraordinary machines.");
    narration.rate = 0.92;
    narration.onend = () => { button.textContent = "▶ Play welcome narration"; button.setAttribute("aria-pressed","false"); };
    speechSynthesis.speak(narration);
    button.textContent = "■ Stop narration";
    button.setAttribute("aria-pressed","true");
  }
});

function showView(name) {
  solarView.classList.toggle("hidden",name !== "solar");
  collectionView.classList.toggle("hidden",name !== "collection");
  destinationView.classList.add("hidden");
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active",button.dataset.view === name));
  if (name === "solar" && renderer) resizeRenderer();
}
document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click",() => showView(button.dataset.view)));
document.querySelector("#explore-destination").addEventListener("click",() => openDestination(currentDestination));
document.querySelector("#back-to-solar").addEventListener("click",() => showView("solar"));

function selectDestination(id) {
  currentDestination = id;
  document.querySelectorAll(".destination").forEach(button => button.classList.toggle("active",button.dataset.destination === id));
  const info = destinations[id];
  document.querySelector("#destination-detail").innerHTML = '<span class="detail-kicker">'+info.eyebrow+'</span><h3>'+info.title+'</h3><p>'+info.intro+'</p><button class="text-action" id="explore-destination">Explore destination <span>→</span></button>';
  document.querySelector("#explore-destination").addEventListener("click",() => openDestination(id));
  highlightPlanet(id);
}
document.querySelectorAll(".destination").forEach(button => button.addEventListener("click",() => selectDestination(button.dataset.destination)));

function openDestination(id) {
  currentDestination = id;
  solarView.classList.add("hidden");
  collectionView.classList.add("hidden");
  destinationView.classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach(button => button.classList.remove("active"));
  const info = destinations[id];
  document.querySelector("#destination-eyebrow").textContent = info.eyebrow;
  document.querySelector("#destination-title").textContent = info.title;
  document.querySelector("#destination-description").textContent = info.description;
  const records = machines.filter(machine => machine.area === id);
  document.querySelector("#mission-grid").innerHTML = records.map((machine,index) => '<article class="mission-card"><span class="machine-index">EXHIBIT 0'+(index+1)+' · '+machine.year+'</span><h3>'+machine.name+'</h3><p>'+machine.summary+'</p><span class="machine-type">'+machine.kind+' · '+machine.location+'</span></article>').join("");
}

document.querySelector("#collection-grid").innerHTML = machines.map((machine,index) => '<article class="machine-card"><span class="machine-index">MACHINE 0'+(index+1)+' · '+machine.year+'</span><h3>'+machine.name+'</h3><p>'+machine.summary+'</p><span class="machine-type">'+machine.place+' · '+machine.kind+'</span></article>').join("");

function initSolarSystem() {
  const container = document.querySelector("#solar-canvas");
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45,1,.1,180);
    camera.position.set(0,19,31);
    camera.lookAt(0,0,0);
    renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.6));
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff,1.5));
    const sunLight = new THREE.PointLight(0xffd6a0,95,100);
    scene.add(sunLight);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.65,40,32),new THREE.MeshBasicMaterial({color:0xffc36c}));
    scene.add(sun);
    const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(2.15,32,24),new THREE.MeshBasicMaterial({color:0xffa94d,transparent:true,opacity:.09}));
    scene.add(sunGlow);
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for(let i=0;i<700;i++){starPositions.push((Math.random()-.5)*90,(Math.random()-.5)*50,(Math.random()-.5)*75);}
    starGeometry.setAttribute("position",new THREE.Float32BufferAttribute(starPositions,3));
    scene.add(new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xb7c7d7,size:.075,transparent:true,opacity:.7})));
    const planetData = [
      {id:"moon",name:"Earth & Moon",x:7.2,r:.78,color:0x5485b4},
      {id:"mars",name:"Mars",x:11.2,r:.57,color:0xc66d4b},
      {id:"deep-space",name:"Deep Space",x:16.1,r:.5,color:0xc7a46c}
    ];
    planetData.forEach(data => {
      const orbit = new THREE.Mesh(new THREE.RingGeometry(data.x-.012,data.x+.012,120),new THREE.MeshBasicMaterial({color:0x72808b,side:THREE.DoubleSide,transparent:true,opacity:.24}));
      orbit.rotation.x = -Math.PI/2;
      scene.add(orbit);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.r,32,24),new THREE.MeshStandardMaterial({color:data.color,roughness:.9,metalness:.03}));
      mesh.position.set(data.x,0,0);
      mesh.userData.destination = data.id;
      scene.add(mesh);
      planetMeshes.set(data.id,mesh);
      const label = makeLabel(data.name);
      label.position.set(data.x, data.r+1.05, 0);
      scene.add(label);
    });
    const earthMoon = new THREE.Mesh(new THREE.SphereGeometry(.19,20,16),new THREE.MeshStandardMaterial({color:0xd8d3c6}));
    earthMoon.position.set(7.2,0,1.25);
    scene.add(earthMoon);
    const controls = makeOrbitControls(camera,renderer.domElement);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    renderer.domElement.addEventListener("pointerup",event => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
      pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(pointer,camera);
      const hit = raycaster.intersectObjects([...planetMeshes.values()]);
      if(hit.length) selectDestination(hit[0].object.userData.destination);
    });
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene,camera);
    };
    animate();
    resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);
    document.addEventListener("visibilitychange",() => {
      if(document.hidden){cancelAnimationFrame(animationId);}
      else if(renderer && !document.querySelector("#museum").classList.contains("hidden")) animate();
    });
  } catch(error) {
    console.warn("3D scene unavailable",error);
    document.querySelector("#canvas-fallback").classList.remove("hidden");
  }
}

function makeLabel(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 128;
  const context = canvas.getContext("2d");
  context.font = "500 38px Arial";
  context.fillStyle = "#e8e2d7";
  context.textAlign = "center";
  context.fillText(text,256,75);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
  sprite.scale.set(4.4,1.1,1);
  return sprite;
}

function makeOrbitControls(activeCamera,element) {
  let dragging=false,lastX=0,lastY=0,theta=0,phi=.95,radius=36;
  const updateCamera = () => {
    phi = Math.max(.25,Math.min(1.42,phi));
    radius = Math.max(20,Math.min(55,radius));
    activeCamera.position.set(radius*Math.sin(phi)*Math.sin(theta),radius*Math.cos(phi),radius*Math.sin(phi)*Math.cos(theta));
    activeCamera.lookAt(7,0,0);
  };
  element.addEventListener("pointerdown",event=>{dragging=true;lastX=event.clientX;lastY=event.clientY;element.setPointerCapture(event.pointerId);});
  element.addEventListener("pointermove",event=>{if(!dragging)return;theta-=(event.clientX-lastX)*.006;phi+=(event.clientY-lastY)*.005;lastX=event.clientX;lastY=event.clientY;updateCamera();});
  element.addEventListener("pointerup",()=>dragging=false);
  element.addEventListener("pointercancel",()=>dragging=false);
  element.addEventListener("wheel",event=>{radius+=event.deltaY*.018;updateCamera();},{passive:true});
  updateCamera();
  return {update(){}};
}
function resizeRenderer() {
  if(!renderer || !camera)return;
  const container = document.querySelector("#solar-canvas");
  const width=container.clientWidth,height=container.clientHeight;
  if(!width||!height)return;
  camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);
}
function highlightPlanet(id) {
  planetMeshes.forEach((mesh,key)=>mesh.scale.setScalar(key===id?1.18:1));
}
window.addEventListener("beforeunload",()=>{cancelAnimationFrame(animationId);resizeObserver?.disconnect();renderer?.dispose();});
