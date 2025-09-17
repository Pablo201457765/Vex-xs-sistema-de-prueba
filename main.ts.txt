/*
 main.ts - VEX XS Ultimate Plus 5.0 (source)
 - boot flow: start screen -> boot video (user click) -> lock screen -> home
 - includes Three.js boot progressive enhancement and GSAP hooks
*/

declare const gsap: any;
declare const THREE: any;

type AppDef = { id: string; label: string; icon: string };

const apps: AppDef[] = [
  { id: 'galeria', label: 'Galería', icon: 'galeria.png' },
  { id: 'camara', label: 'Cámara', icon: 'camara.png' },
  { id: 'configuracion', label: 'Configuración', icon: 'configuracion.png' },
  { id: 'notas', label: 'Notas', icon: 'notas.png' },
  { id: 'navegador', label: 'Navegador', icon: 'navegador.png' }
];

export function initBootVideoHandlers() {
  const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
  const startScreen = document.getElementById('startScreen') as HTMLElement;
  const bootScreen = document.getElementById('bootScreen') as HTMLElement;
  const video = document.getElementById('bootVideo') as HTMLVideoElement;

  startBtn.addEventListener('click', async () => {
    startScreen.classList.add('hidden');
    bootScreen.classList.remove('hidden');
    try {
      video.muted = false;
      await video.play();
    } catch (err) {
      document.body.addEventListener('click', () => video.play(), { once: true });
    }
    const onEnded = () => {
      video.removeEventListener('ended', onEnded);
      showLockScreen();
    };
    video.addEventListener('ended', onEnded);
  });
}

export function initThreeBoot() {
  const canvas = document.querySelector('#bootScreen canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const renderer = new (window as any).THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new (window as any).THREE.Scene();
  const camera = new (window as any).THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;
  const light = new (window as any).THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(10, 10, 10);
  scene.add(light);
  const geo = new (window as any).THREE.IcosahedronGeometry(10, 1);
  const mat = new (window as any).THREE.MeshStandardMaterial({ color: 0x1de9b6, metalness: 0.2, roughness: 0.4, emissive: 0x00221a });
  const mesh = new (window as any).THREE.Mesh(geo, mat);
  scene.add(mesh);
  function loop() {
    mesh.rotation.x += 0.006;
    mesh.rotation.y += 0.009;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
}

export function showLockScreen() {
  const boot = document.getElementById('bootScreen')!;
  const lock = document.getElementById('lock')!;
  boot.classList.add('hidden');
  lock.classList.remove('hidden');
  if ((window as any).gsap) {
    (window as any).gsap.fromTo(lock, { opacity: 0 }, { opacity: 1, duration: 0.35 });
  }
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

export function buildHome() {
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  apps.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'app';
    btn.setAttribute('data-app', a.id);
    btn.innerHTML = `<img src="${a.icon}" alt="${a.label}"><span>${a.label}</span>`;
    btn.addEventListener('click', () => openApp(a.id));
    grid.appendChild(btn);
  });
  const fav = document.getElementById('favbar')!;
  fav.innerHTML = apps.slice(0,4).map(a => `<img src="${a.icon}" alt="${a.label}" title="${a.label}" style="width:44px;height:44px;border-radius:50%">`).join('');
}

export function openApp(id: string) {
  const appWindow = document.getElementById('appWindow')!;
  const def = apps.find(x => x.id === id)!;
  appWindow.innerHTML = `<div class="appContent"><h2>${def.label}</h2><p>Demo de ${def.label}</p><div style="margin-top:14px"><button id="closeApp">Cerrar</button></div></div>`;
  appWindow.classList.remove('hidden');
  if ((window as any).gsap) (window as any).gsap.fromTo(appWindow, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  const close = document.getElementById('closeApp')!;
  close.addEventListener('click', () => {
    if ((window as any).gsap) (window as any).gsap.to(appWindow, { y: 30, opacity: 0, duration: 0.35, onComplete: () => appWindow.classList.add('hidden') });
  });
}

export function setupLockSwipe() {
  const lock = document.getElementById('lock')!;
  lock.addEventListener('click', () => {
    lock.classList.add('hidden');
    const home = document.getElementById('home')!;
    home.classList.remove('hidden');
    buildHome();
  });
}

export function initAll() {
  initBootVideoHandlers();
  initThreeBoot();
  setupLockSwipe();
  buildHome();
}

window.addEventListener('load', () => {});
