/* main.js - runtime for VEX XS Ultimate Plus 5.0 */
import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

const apps = [
  { id: 'galeria', label: 'Galería', icon: 'galeria.png' },
  { id: 'camara', label: 'Cámara', icon: 'camara.png' },
  { id: 'configuracion', label: 'Configuración', icon: 'configuracion.png' },
  { id: 'notas', label: 'Notas', icon: 'notas.png' },
  { id: 'navegador', label: 'Navegador', icon: 'navegador.png' }
];

function initBootVideoHandlers() {
  const startBtn = document.getElementById('startBtn');
  const startScreen = document.getElementById('startScreen');
  const bootScreen = document.getElementById('bootScreen');
  const video = document.getElementById('bootVideo');
  startBtn.addEventListener('click', async () => {
    startScreen.classList.add('hidden');
    bootScreen.classList.remove('hidden');
    try {
      video.muted = false;
      await video.play();
    } catch (err) {
      document.body.addEventListener('click', () => video.play(), { once: true });
    }
    const onEnded = () => { video.removeEventListener('ended', onEnded); showLockScreen(); };
    video.addEventListener('ended', onEnded);
  });
}

function initThreeBoot() {
  const canvas = document.querySelector('#bootScreen canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(10, 10, 10);
  scene.add(light);
  const geo = new THREE.IcosahedronGeometry(10, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0x1de9b6, metalness: 0.2, roughness: 0.4, emissive: 0x00221a });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  function loop() { mesh.rotation.x += 0.006; mesh.rotation.y += 0.009; renderer.render(scene, camera); requestAnimationFrame(loop); }
  loop();
}

function showLockScreen() {
  const boot = document.getElementById('bootScreen');
  const lock = document.getElementById('lock');
  boot.classList.add('hidden');
  lock.classList.remove('hidden');
  if (window.gsap) gsap.fromTo(lock, { opacity: 0 }, { opacity: 1, duration: 0.35 });
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const t = new Date();
  const hh = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dd = t.toLocaleDateString();
  const elTime = document.getElementById('time');
  const elDate = document.getElementById('date');
  if (elTime) elTime.textContent = hh;
  if (elDate) elDate.textContent = dd;
}

function buildHome() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  apps.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'app';
    btn.setAttribute('data-app', a.id);
    btn.innerHTML = `<img src="${a.icon}" alt="${a.label}"><span>${a.label}</span>`;
    btn.addEventListener('click', () => openApp(a.id));
    grid.appendChild(btn);
  });
  const fav = document.getElementById('favbar');
  fav.innerHTML = apps.slice(0, 4).map(a => `<img src="${a.icon}" alt="${a.label}" title="${a.label}" style="width:44px;height:44px;border-radius:50%">`).join('');
}

function openApp(id) {
  const appWindow = document.getElementById('appWindow');
  const def = apps.find(x => x.id === id);
  appWindow.innerHTML = `<div class="appContent"><h2>${def.label}</h2><p>Demo de ${def.label}</p><div style="margin-top:14px"><button id="closeApp">Cerrar</button></div></div>`;
  appWindow.classList.remove('hidden');
  if (window.gsap) gsap.fromTo(appWindow, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  document.getElementById('closeApp').addEventListener('click', () => {
    if (window.gsap) gsap.to(appWindow, { y: 30, opacity: 0, duration: 0.35, onComplete: () => appWindow.classList.add('hidden') });
  });
}

function setupLockSwipe() {
  const lock = document.getElementById('lock');
  lock.addEventListener('click', () => {
    lock.classList.add('hidden');
    const home = document.getElementById('home');
    home.classList.remove('hidden');
    buildHome();
  });
}

window.addEventListener('load', () => { initBootVideoHandlers(); initThreeBoot(); setupLockSwipe(); buildHome(); });
