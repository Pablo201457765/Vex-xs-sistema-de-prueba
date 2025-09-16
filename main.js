/* main.js - runtime (ES module) */
import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

const apps = [
  {id:'galeria', label:'Galería', icon:'galeria.png'},
  {id:'camara', label:'Cámara', icon:'camara.png'},
  {id:'configuracion', label:'Configuración', icon:'configuracion.png'},
  {id:'notas', label:'Notas', icon:'notas.png'},
  {id:'navegador', label:'Navegador', icon:'navegador.png'}
];

function initBoot() {
  const canvas = document.getElementById('bootCanvas');
  if(!canvas) return;
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(10,10,10);
  scene.add(light);

  const geo = new THREE.IcosahedronGeometry(10,1);
  const mat = new THREE.MeshStandardMaterial({color:0x1de9b6, metalness:0.2, roughness:0.4, emissive:0x00221a});
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  function resize(){ renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', resize);

  let t = 0;
  function loop() { t += 0.01; mesh.rotation.x = t*0.6; mesh.rotation.y = t*0.9; renderer.render(scene, camera); requestAnimationFrame(loop); }
  loop();

  const v = document.getElementById('bootV');
  const name = document.getElementById('bootName');
  const dots = document.querySelectorAll('#bootDots span');
  if(window.gsap) {
    gsap.fromTo(v, {scale:0.2, opacity:0}, {scale:1, opacity:1, duration:0.8, ease:'back.out(2)'});
    gsap.to(name, {opacity:1, duration:0.6, delay:0.8});
    dots.forEach((d,i)=> gsap.fromTo(d,{y:-6, opacity:0},{y:0, opacity:1, duration:0.45, delay:1 + i*0.25, ease:'power1.inOut', repeat:3, yoyo:true}));
  }

  setTimeout(()=>{ document.getElementById('boot').classList.add('hidden'); document.getElementById('lock').classList.remove('hidden'); }, 3000);
}

function buildHome() {
  const grid = document.getElementById('grid');
  apps.forEach(a=>{
    const btn = document.createElement('button');
    btn.className = 'app';
    btn.setAttribute('data-app', a.id);
    btn.innerHTML = `<img src="${a.icon}" alt="${a.label}"><span>${a.label}</span>`;
    btn.addEventListener('click', ()=> openApp(a.id));
    grid.appendChild(btn);
  });
  const favbar = document.getElementById('favbar');
  favbar.innerHTML = apps.slice(0,4).map(a=>`<img src="${a.icon}" alt="${a.label}" title="${a.label}" style="width:44px;height:44px;border-radius:50%">`).join('');
}

function openApp(id){
  const appWindow = document.getElementById('appWindow');
  const def = apps.find(x=>x.id===id);
  appWindow.innerHTML = `<div class="appContent"><h2>${def.label}</h2><p>Contenido demo de ${def.label}.</p><div style="margin-top:14px"><button id="closeApp">Cerrar</button></div></div>`;
  appWindow.classList.remove('hidden');
  if(window.gsap) gsap.fromTo(appWindow, {y:30, opacity:0}, {y:0, opacity:1, duration:0.45, ease:'power3.out'});
  const close = document.getElementById('closeApp');
  close.addEventListener('click', ()=>{ if(window.gsap) gsap.to(appWindow, {y:30, opacity:0, duration:0.3, ease:'power3.in', onComplete: ()=> appWindow.classList.add('hidden')}); });
}

function setupLockAndGestures(){
  const lock = document.getElementById('lock');
  lock.addEventListener('click', ()=>{
    if(window.gsap) gsap.to(lock, {opacity:0, duration:0.28, onComplete: ()=>{ lock.classList.add('hidden'); document.getElementById('home').classList.remove('hidden'); buildHome(); }});
  });
}

window.addEventListener('load', ()=>{ initBoot(); setupLockAndGestures(); buildHome(); });
