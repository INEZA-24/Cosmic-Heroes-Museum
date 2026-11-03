import * as THREE from "three";

const machines = [
  {id:"surveyor-3",name:"Surveyor 3",place:"Moon",area:"moon",kind:"Robotic lander",year:"1967",summary:"A pioneering robotic lander that examined the lunar surface and returned close-up television images.",location:"Ocean of Storms",detail:"Surveyor 3 landed in the Ocean of Storms. Apollo 12 astronauts later visited the spacecraft."},
  {id:"apollo-15-lrv",name:"Apollo 15 Lunar Roving Vehicle",place:"Moon",area:"moon",kind:"Crewed lunar rover",year:"1971",summary:"The battery-powered rover that extended the range of astronauts exploring the lunar surface.",location:"Hadley–Apennine region",detail:"The rover carried astronauts David Scott and James Irwin across the Hadley–Apennine region."},
  {id:"sojourner",name:"Sojourner",place:"Mars",area:"mars",kind:"Robotic rover",year:"1997",summary:"The first successful Mars rover, demonstrating mobile robotic exploration on another planet.",location:"Ares Vallis",detail:"Sojourner explored the Ares Vallis landing area as part of Mars Pathfinder."},
  {id:"opportunity",name:"Opportunity",place:"Mars",area:"mars",kind:"Robotic rover",year:"2004",summary:"A long-lived Mars rover that studied rocks and evidence of ancient water.",location:"Meridiani Planum",detail:"Opportunity explored Meridiani Planum and continued operating for more than fourteen years."},
  {id:"insight",name:"InSight",place:"Mars",area:"mars",kind:"Robotic lander",year:"2018",summary:"A stationary lander that studied the deep interior of Mars.",location:"Elysium Planitia",detail:"InSight helped reveal the planet's internal structure using seismic and heat-flow measurements."},
  {id:"pioneer-10",name:"Pioneer 10",place:"Deep Space",area:"deep-space",kind:"Space probe",year:"1972",summary:"The first spacecraft to make a close encounter with Jupiter and continue outward into deep space.",location:"Jupiter flyby",detail:"Pioneer 10 flew past Jupiter in 1973. It did not land on the planet."}
];
const destinationNames={moon:"The Moon",mars:"Mars","deep-space":"Deep Space"};
const $=s=>document.querySelector(s);
const entrance=$("#entrance"), museum=$("#museum");
let renderer,scene,camera,raf,resizeObserver,controls,selected=null;
const planets=new Map(), clock=new THREE.Clock();
let target=new THREE.Vector3(0,0,0), cameraGoal=null, focusGoal=null, pointerDown=null;
const textureLoader=new THREE.TextureLoader();
textureLoader.setCrossOrigin("anonymous");
textureLoader.setPath("https://www.solarsystemscope.com/textures/download/");
let textureTotal=0,textureLoaded=0,textureFailed=0;
function updateTextureStatus(){
 const el=$("#texture-status");if(!el)return;
 if(textureLoaded+textureFailed<textureTotal){el.textContent="LOADING PLANET SURFACES · "+(textureLoaded+textureFailed)+"/"+textureTotal;el.classList.remove("is-error");}
 else if(textureFailed){el.textContent="SURFACE MAPS · "+textureLoaded+" LOADED · "+textureFailed+" FAILED";el.classList.add("is-error");}
 else{el.textContent="PLANET SURFACE MAPS LOADED";el.classList.remove("is-error");}
}
const planetData=[
 {name:"Mercury",key:"mercury",radius:.38,distance:7.2,texture:"2k_mercury.jpg",color:0x9b9188,rotation:.0008},
 {name:"Venus",key:"venus",radius:.62,distance:10.1,texture:"2k_venus_surface.jpg",color:0xc99b62,rotation:.00035},
 {name:"Earth",key:"earth",radius:.66,distance:13.4,texture:"2k_earth_daymap.jpg",color:0x4e83b9,rotation:.0018,clouds:"2k_earth_clouds.jpg"},
 {name:"Mars",key:"mars",radius:.49,distance:17.2,texture:"2k_mars.jpg",color:0xb85e43,rotation:.0017},
 {name:"Jupiter",key:"jupiter",radius:1.48,distance:24.1,texture:"2k_jupiter.jpg",color:0xc59a72,rotation:.0032},
 {name:"Saturn",key:"saturn",radius:1.22,distance:31.4,texture:"2k_saturn.jpg",color:0xc9ad7d,rotation:.0027,rings:true},
 {name:"Uranus",key:"uranus",radius:.91,distance:38.6,texture:"2k_uranus.jpg",color:0x8fc9d0,rotation:.0021,rings:true},
 {name:"Neptune",key:"neptune",radius:.88,distance:45.2,texture:"2k_neptune.jpg",color:0x416fbd,rotation:.0022}
];
function enterMuseum(){
 entrance.classList.add("opening");
 setTimeout(()=>{entrance.classList.add("hidden");museum.classList.remove("hidden");if(!renderer)initUniverse();},650);
}
$("#enter-button").addEventListener("click",enterMuseum);
$("#skip-button").addEventListener("click",enterMuseum);
$("#replay-intro").addEventListener("click",()=>{museum.classList.add("hidden");entrance.classList.remove("hidden","opening");});
$("#brand-home").addEventListener("click",e=>{e.preventDefault();showCollection(false);resetCamera();});
$("#welcome-audio").addEventListener("click",e=>{
 const b=e.currentTarget;if(!("speechSynthesis"in window)){b.textContent="Narration unavailable";return;}
 if(speechSynthesis.speaking){speechSynthesis.cancel();b.textContent="▶ Play welcome narration";return;}
 const u=new SpeechSynthesisUtterance("Welcome to the Cosmic Heroes of Steel Museum. Explore our Solar System and discover the extraordinary machines that carried humanity's curiosity beyond Earth.");u.rate=.92;u.onend=()=>b.textContent="▶ Play welcome narration";speechSynthesis.speak(u);b.textContent="■ Stop narration";
});
function showCollection(open){activeDestination=open?"collection":activeDestination;$("#collection-view").classList.toggle("hidden",!open);$("#solar-view").classList.toggle("hidden",open);$("#destination-view").classList.add("hidden");$("#exhibition-view").classList.add("hidden");document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===(open?"collection":"solar")));if(!open)resize();}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>showCollection(b.dataset.view==="collection")));
$("#back-to-solar").addEventListener("click",()=>{showCollection(false);resetCamera();});
$("#collection-grid").innerHTML=machines.map((m,i)=>'<article class="machine-card"><span class="machine-index">MACHINE 0'+(i+1)+' · '+m.year+'</span><h3>'+m.name+'</h3><p>'+m.summary+'</p><span class="machine-type">'+m.place+' · '+m.kind+'</span><button class="exhibit-link" data-machine="'+m.id+'">Enter exhibition ↗</button></article>').join("");
function openDestination(id){
 activeDestination=id;
 $("#solar-view").classList.add("hidden");$("#collection-view").classList.add("hidden");$("#destination-view").classList.remove("hidden");
 $("#destination-eyebrow").textContent="MISSION REGION / "+destinationNames[id].toUpperCase();
 $("#destination-title").textContent=destinationNames[id];
 $("#destination-description").textContent=id==="moon"?"Explore the machines that helped humanity reach and travel across another world.":id==="mars"?"Meet the robotic explorers that studied the Red Planet.":"Follow a spacecraft whose journey carried it beyond the planets.";
 $("#mission-grid").innerHTML=machines.filter(m=>m.area===id).map((m,i)=>'<article class="mission-card"><span class="machine-index">EXHIBIT 0'+(i+1)+' · '+m.year+'</span><h3>'+m.name+'</h3><p>'+m.summary+'</p><span class="machine-type">'+m.kind+' · '+m.location+'</span><button class="exhibit-link" data-machine="'+m.id+'">Explore this machine ↗</button></article>').join("");
}

let activeDestination="mars";
const exhibitionDetails={
 "surveyor-3":{subtitle:"THE LUNAR SURFACE SAMPLER",mission:"Surveyor 3 helped prove that a spacecraft could land softly on the Moon and investigate its soil before astronauts arrived.",legacy:"Its camera and surface sampler returned thousands of images and measurements. Two and a half years later, Apollo 12 astronauts visited the lander and brought selected parts back to Earth for study.",facts:[["6,326","television images"],["13","soil impact tests"],["2.5 years","on the lunar surface"]],timeline:[["17 APR 1967","Launched from Cape Canaveral"],["20 APR 1967","Soft-landed in Oceanus Procellarum"],["04 MAY 1967","Final communication"],["19 NOV 1969","Visited by Apollo 12 astronauts"]],accent:"moon"},
 "apollo-15-lrv":{subtitle:"THE FIRST CAR THAT DROVE ON THE MOON",mission:"The Lunar Roving Vehicle transformed Apollo 15 into a far-ranging field expedition, allowing astronauts to travel farther from their lunar module and carry more scientific equipment.",legacy:"Folded for launch and deployed on the Moon, the battery-powered rover carried astronauts across the Hadley–Apennine region. Its design influenced later concepts for surface mobility beyond Earth.",facts:[["3","Apollo missions used it"],["14.5 km/h","approx. top speed"],["210 kg","vehicle mass on Earth"]],timeline:[["26 JUL 1971","Apollo 15 launched"],["30 JUL 1971","First lunar drive"],["02 AUG 1971","Final Apollo 15 rover traverse"]],accent:"moon"},
 "sojourner":{subtitle:"THE LITTLE ROVER THAT OPENED A NEW ROAD",mission:"Sojourner was the first wheeled rover to operate on Mars. It tested a new way to explore another planet: a lander delivering a mobile robot that could inspect nearby rocks.",legacy:"Designed for a short technology demonstration, Sojourner operated for 83 days and helped establish the approach used by later Mars rovers.",facts:[["83 days","operated on Mars"],["10.6 kg","rover mass"],["1997","first Mars rover mission"]],timeline:[["04 DEC 1996","Mars Pathfinder launched"],["04 JUL 1997","Landed on Mars"],["27 SEP 1997","Final data transmission"]],accent:"mars"},
 "opportunity":{subtitle:"THE ROVER THAT KEPT GOING",mission:"Opportunity set out for a 90-sol mission to study the geology of Meridiani Planum and search for evidence of past water. It continued exploring for more than fourteen years.",legacy:"The rover examined rocks, craters and layered terrain, building a powerful case that ancient Mars had environments where liquid water once existed.",facts:[["14 years","active on Mars"],["45.16 km","total distance driven"],["5,111 sols","mission duration"]],timeline:[["07 JUL 2003","Launched from Earth"],["25 JAN 2004","Landed at Meridiani Planum"],["24 MAR 2015","Passed the marathon-distance mark"],["13 FEB 2019","Mission declared complete"]],accent:"mars"},
 "insight":{subtitle:"LISTENING TO THE HEART OF MARS",mission:"InSight was a stationary lander built to study the deep interior of Mars. Its seismometer detected marsquakes and helped scientists understand the planet's crust, mantle and core.",legacy:"By listening to seismic waves and measuring heat flow, InSight turned Mars into a natural laboratory for understanding how rocky planets form and evolve.",facts:[["1,300+","detected seismic events"],["2018","arrival on Mars"],["4 years","operated on Mars"]],timeline:[["05 MAY 2018","Launched from California"],["26 NOV 2018","Landed on Mars"],["2019","First marsquake detections announced"],["21 DEC 2022","Final communication"]],accent:"mars"},
 "pioneer-10":{subtitle:"THE PATHFINDER TO THE OUTER PLANETS",mission:"Pioneer 10 was the first spacecraft to travel through the asteroid belt and make a close encounter with Jupiter, returning observations from a region humanity had never explored up close.",legacy:"Its Jupiter encounter paved the way for later outer-planet missions. Pioneer 10 continued outward on an escape trajectory from the Solar System, carrying a plaque describing its creators.",facts:[["1972","launch year"],["1973","Jupiter flyby"],["11.8 km/s","approx. launch escape speed"]],timeline:[["02 MAR 1972","Launched from Cape Canaveral"],["15 JUL 1972","Entered the asteroid belt"],["04 DEC 1973","Closest approach to Jupiter"],["23 JAN 2003","Last signal received"]],accent:"deep"}
};
function openExhibition(id){
 const m=machines.find(item=>item.id===id),d=exhibitionDetails[id];if(!m||!d)return;
 $("#solar-view").classList.add("hidden");$("#collection-view").classList.add("hidden");$("#destination-view").classList.add("hidden");$("#exhibition-view").classList.remove("hidden");
 const index=machines.indexOf(m);
 $("#exhibition-content").innerHTML='<div class="exhibit-hero exhibit-'+d.accent+'"><div class="exhibit-orbit orbit-one"></div><div class="exhibit-orbit orbit-two"></div><div class="exhibit-hero-copy"><p class="eyebrow">MUSEUM EXHIBITION / '+m.year+'</p><p class="exhibit-kicker">'+d.subtitle+'</p><h1>'+m.name+'</h1><p class="exhibit-deck">'+m.summary+'</p><div class="exhibit-tags"><span>'+m.kind+'</span><span>'+m.place+'</span><span>'+m.location+'</span></div></div><div class="exhibit-art" aria-hidden="true"><div class="artifact-ring"></div><div class="artifact-core">'+(d.accent==="moon"?"☾":d.accent==="mars"?"◉":"✦")+'</div><span class="artifact-label">EXHIBIT 0'+(index+1)+'</span></div></div><div class="exhibit-body"><section class="exhibit-story"><p class="eyebrow">THE MISSION</p><h2>Built to go beyond.</h2><p>'+d.mission+'</p><p>'+m.detail+'</p><p>'+d.legacy+'</p></section><aside class="exhibit-facts"><p class="eyebrow">AT A GLANCE</p>'+d.facts.map(f=>'<div class="fact-row"><strong>'+f[0]+'</strong><span>'+f[1]+'</span></div>').join("")+'</aside></div><section class="exhibit-timeline"><p class="eyebrow">MISSION LOG</p><h2>A journey through time.</h2><div class="timeline-track">'+d.timeline.map((t,i)=>'<article class="timeline-entry"><span class="timeline-dot"></span><p>'+t[0]+'</p><h3>'+t[1]+'</h3></article>').join("")+'</div></section><div class="exhibit-navigation"><button class="back-link" id="previous-exhibit">← Previous exhibit</button><span>EXHIBIT '+(index+1)+' OF 6</span><button class="back-link" id="next-exhibit">Next exhibit →</button></div>';
 $("#back-to-destination").textContent="← Back to "+(destinationNames[activeDestination]||"collection");
 $("#previous-exhibit").addEventListener("click",()=>openExhibition(machines[(index+machines.length-1)%machines.length].id));
 $("#next-exhibit").addEventListener("click",()=>openExhibition(machines[(index+1)%machines.length].id));
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-machine]");if(b)openExhibition(b.dataset.machine);});
$("#back-to-destination").addEventListener("click",()=>{$("#exhibition-view").classList.add("hidden");if(activeDestination==="collection"){$("#collection-view").classList.remove("hidden");}else{$("#destination-view").classList.remove("hidden");}});

function initUniverse(){
 const host=$("#solar-canvas");
 try{
  scene=new THREE.Scene();scene.background=new THREE.Color(0x030812);
  camera=new THREE.PerspectiveCamera(48,1,.1,260);camera.position.set(0,38,79);camera.lookAt(0,0,0);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  host.appendChild(renderer.domElement);resize();
  scene.add(new THREE.AmbientLight(0x8194b8,.28));
  const sunlight=new THREE.PointLight(0xffd5a0,260,220,1.45);scene.add(sunlight);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(2.9,64,48),new THREE.MeshBasicMaterial({color:0xffbd63}));scene.add(sun);
  const sunGlow=new THREE.Mesh(new THREE.SphereGeometry(3.45,48,32),new THREE.MeshBasicMaterial({color:0xff8c35,transparent:true,opacity:.12,side:THREE.BackSide}));scene.add(sunGlow);
  const corona=new THREE.Sprite(new THREE.SpriteMaterial({map:radialTexture("#fff0c0","#ff8b35"),color:0xffffff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));corona.scale.set(17,17,1);scene.add(corona);
  createStars();createNebulaDust();
  planetData.forEach((data,index)=>{
   const pivot=new THREE.Group();scene.add(pivot);
   const orbit=new THREE.Mesh(new THREE.RingGeometry(data.distance-.012,data.distance+.012,256),new THREE.MeshBasicMaterial({color:0x7b91a9,transparent:true,opacity:.16,side:THREE.DoubleSide}));orbit.rotation.x=-Math.PI/2;scene.add(orbit);
   const material=new THREE.MeshStandardMaterial({color:data.color,roughness:.92,metalness:0});
   const sphere=new THREE.Mesh(new THREE.SphereGeometry(data.radius,96,64),material);sphere.position.x=data.distance;sphere.userData.planet=data.key;pivot.add(sphere);
   const label=makeLabel(data.name);label.position.set(data.distance,data.radius+1.1,0);pivot.add(label);
   const item={...data,pivot,sphere,angle:index*.31,cloud:null};planets.set(data.key,item);
   if(data.rings)addRings(item);
   if(data.key==="earth")addAtmosphere(sphere,data.radius,0x70baff,.22);
   if(data.key==="venus")addAtmosphere(sphere,data.radius,0xe6ad72,.12);
   if(data.key==="uranus"||data.key==="neptune")addAtmosphere(sphere,data.radius,0x72bfe8,.12);
   loadPlanetTexture(item);
   if(data.clouds)loadClouds(item,data.clouds);
  });
  addMoon();addAsteroidBelt();addPluto();
  controls=makeControls(renderer.domElement);
  renderer.domElement.addEventListener("pointerdown",e=>{pointerDown={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener("pointerup",e=>{
   if(!pointerDown||Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>5){pointerDown=null;return;}
   pointerDown=null;const rect=renderer.domElement.getBoundingClientRect(),p=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(p,camera);
   const hit=ray.intersectObjects([...planets.values()].map(v=>v.sphere));if(hit.length)focusPlanet(hit[0].object.userData.planet);
  });
  $("#canvas-fallback").classList.add("hidden");
  animate();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else if(renderer&&!museum.classList.contains("hidden"))animate();});
 }catch(err){console.error("Universe renderer failed",err);$("#canvas-fallback").classList.remove("hidden");}
}
function loadPlanetTexture(item){
 textureTotal++;
 textureLoader.load(item.texture,tex=>{
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  tex.generateMipmaps=true;
  tex.minFilter=THREE.LinearMipmapLinearFilter;
  tex.magFilter=THREE.LinearFilter;
  item.sphere.material.map=tex;
  item.sphere.material.color.set(0xffffff);
  item.sphere.material.needsUpdate=true;
  textureLoaded++;
  updateTextureStatus();
 },undefined,error=>{
  textureFailed++;
  console.error("Failed to load surface map for "+item.name+": "+item.texture,error);
  updateTextureStatus();
 });
}
function loadClouds(item,file){
 textureTotal++;
 textureLoader.load(file,tex=>{
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  const cloud=new THREE.Mesh(new THREE.SphereGeometry(item.radius*1.018,96,64),new THREE.MeshStandardMaterial({map:tex,transparent:true,opacity:.48,depthWrite:false,roughness:1}));
  item.sphere.add(cloud);item.cloud=cloud;textureLoaded++;updateTextureStatus();
 },undefined,error=>{textureFailed++;console.error("Failed to load Earth cloud map:",file,error);updateTextureStatus();});
}
function addAtmosphere(mesh,radius,color,opacity){const shell=new THREE.Mesh(new THREE.SphereGeometry(radius*1.09,48,36),new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));mesh.add(shell);}
function addRings(item){
 const inner=item.key==="saturn"?item.radius*1.32:item.radius*1.35,outer=item.key==="saturn"?item.radius*2.25:item.radius*1.8;
 const ring=new THREE.Mesh(new THREE.RingGeometry(inner,outer,160),new THREE.MeshStandardMaterial({color:item.key==="saturn"?0xc8b18d:0x8daeb5,side:THREE.DoubleSide,transparent:true,opacity:item.key==="saturn"?.82:.34,roughness:1}));
 ring.rotation.x=Math.PI/2.35;item.sphere.add(ring);
}
function addMoon(){
 const earth=planets.get("earth");const moonPivot=new THREE.Group();earth.sphere.add(moonPivot);
 const moon=new THREE.Mesh(new THREE.SphereGeometry(.18,32,24),new THREE.MeshStandardMaterial({color:0xbab8b1,roughness:1}));moon.position.set(1.35,0,0);moonPivot.add(moon);
 textureLoader.load("2k_moon.jpg",t=>{t.colorSpace=THREE.SRGBColorSpace;moon.material.map=t;moon.material.needsUpdate=true;},undefined,error=>{console.error("Failed to load Moon texture:",error);});
 earth.moonPivot=moonPivot;
}
function addAsteroidBelt(){
 const count=2400,positions=new Float32Array(count*3),sizes=new Float32Array(count);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,r=19.5+Math.random()*2.2,y=(Math.random()-.5)*.65;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=y;positions[i*3+2]=Math.sin(a)*r;sizes[i]=.025+Math.random()*.045;}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(positions,3));g.setAttribute("size",new THREE.BufferAttribute(sizes,1));
 const points=new THREE.Points(g,new THREE.PointsMaterial({color:0xb3a18c,size:.065,transparent:true,opacity:.72,sizeAttenuation:true}));scene.add(points);
}
function addPluto(){const p=new THREE.Mesh(new THREE.SphereGeometry(.22,24,18),new THREE.MeshStandardMaterial({color:0xb69d8c,roughness:1}));p.position.set(-49,0,3);scene.add(p);const l=makeLabel("Pluto");l.position.set(-49,.7,3);scene.add(l);}
function createStars(){
 const count=6500,arr=new Float32Array(count*3);for(let i=0;i<count;i++){const radius=90+Math.random()*90,theta=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);arr[i*3]=radius*Math.sin(phi)*Math.cos(theta);arr[i*3+1]=radius*Math.cos(phi);arr[i*3+2]=radius*Math.sin(phi)*Math.sin(theta);}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(arr,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xd5e3ff,size:.42,transparent:true,opacity:.9,sizeAttenuation:true})));
}
function createNebulaDust(){
 const count=1100,arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*180;arr[i*3+1]=(Math.random()-.5)*85;arr[i*3+2]=-65-Math.random()*55;}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(arr,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x6475a8,size:.7,transparent:true,opacity:.2})));
}
function radialTexture(inner,outer){const c=document.createElement("canvas");c.width=c.height=128;const x=c.getContext("2d"),g=x.createRadialGradient(64,64,2,64,64,64);g.addColorStop(0,inner);g.addColorStop(.22,outer);g.addColorStop(1,"rgba(255,120,30,0)");x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function makeLabel(text){const c=document.createElement("canvas");c.width=512;c.height=128;const x=c.getContext("2d");x.font="600 34px Arial";x.fillStyle="#e8edf7";x.textAlign="center";x.shadowColor="#000";x.shadowBlur=12;x.fillText(text,256,72);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.set(4.5,1.1,1);return s;}
function makeControls(element){
 let drag=false,lastX=0,lastY=0,theta=0.28,phi=.95,radius=88;
 const update=()=>{phi=THREE.MathUtils.clamp(phi,.12,1.48);radius=THREE.MathUtils.clamp(radius,9,145);const t=target;camera.position.set(t.x+radius*Math.sin(phi)*Math.sin(theta),t.y+radius*Math.cos(phi),t.z+radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(t);};
 element.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;element.setPointerCapture(e.pointerId);});
 element.addEventListener("pointermove",e=>{if(!drag)return;theta-=(e.clientX-lastX)*.004;phi+=(e.clientY-lastY)*.004;lastX=e.clientX;lastY=e.clientY;update();});
 element.addEventListener("pointerup",()=>drag=false);element.addEventListener("pointercancel",()=>drag=false);
 element.addEventListener("wheel",e=>{radius*=Math.exp(e.deltaY*.001);update();},{passive:true});
 return {update,reset(){theta=.28;phi=.95;radius=88;target.set(0,0,0);update();},focus(key){const p=planets.get(key);if(!p)return;target.copy(p.sphere.getWorldPosition(new THREE.Vector3()));radius=Math.max(5,p.radius*7);update();}};
}
function focusPlanet(key){
 const p=planets.get(key);if(!p)return;selected=key;controls.focus(key);
 $("#planet-name").textContent=p.name;$("#planet-kind").textContent="SOLAR SYSTEM / PLANETARY PROFILE";
 $("#planet-copy").textContent=planetDescriptions[key];$("#planet-popover").classList.remove("hidden");
 $("#planet-missions").innerHTML=key==="earth"||key==="moon"||key==="mars"?'<button class="popover-action" data-dest="'+(key==="earth"?"moon":key)+'">Explore related museum missions ↗</button>':"";
 const action=$("#planet-missions button");if(action)action.addEventListener("click",()=>openDestination(action.dataset.dest));
}
const planetDescriptions={mercury:"The smallest planet, a cratered rocky world racing around the Sun.",venus:"A volcanic world wrapped in a dense atmosphere of carbon dioxide and clouds of sulfuric acid.",earth:"Our home world: oceans, continents, a dynamic atmosphere and the only known world with life.",mars:"A cold desert world with ancient river valleys, towering volcanoes and the explorers of our museum.",jupiter:"The largest planet, a gas giant with immense storms including the Great Red Spot.",saturn:"A gas giant surrounded by a spectacular system of icy rings.",uranus:"An ice giant that rotates on its side, with a faint ring system.",neptune:"A distant ice giant with powerful winds and a deep blue atmosphere."};
function resetCamera(){$("#planet-popover").classList.add("hidden");selected=null;controls?.reset();}
$("#reset-camera").addEventListener("click",resetCamera);
$("#close-popover").addEventListener("click",()=>$("#planet-popover").classList.add("hidden"));
function animate(){
 raf=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);
 planets.forEach(p=>{p.angle+=dt*(.035/(p.distance*.13));p.pivot.rotation.y=p.angle;p.sphere.rotation.y+=p.rotation*dt*60;if(p.cloud)p.cloud.rotation.y+=.0003*dt*60;if(p.moonPivot)p.moonPivot.rotation.y+=.003*dt*60;});
 if(cameraGoal){camera.position.lerp(cameraGoal,.06);if(camera.position.distanceTo(cameraGoal)<.08)cameraGoal=null;}
 controls?.update();renderer.render(scene,camera);
}
function resize(){if(!renderer||!camera)return;const host=$("#solar-canvas"),w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
window.addEventListener("beforeunload",()=>{cancelAnimationFrame(raf);resizeObserver?.disconnect();renderer?.dispose();});
