/* main.js - Vex XS Ultimate Plus 5.1 runtime */
/* Flow:
   - Wait for user click on start button
   - Try to play arranque.mp4 or boot.mp4 (in that order)
   - If video fails (not found or blocked), run WebGL fallback animation (~8s)
   - After video/fallback -> show lock screen -> then home
*/

async function init() {
  const startBtn = document.getElementById('startBtn');
  const startScreen = document.getElementById('startScreen');
  const videoContainer = document.getElementById('videoContainer');
  const webglContainer = document.getElementById('webglContainer');
  const bootVideo = document.getElementById('bootVideo');
  const lockScreen = document.getElementById('lockScreen');
  const homeScreen = document.getElementById('homeScreen');
  const appWindow = document.getElementById('appWindow');

  function showLock() {
    videoContainer.classList.add('hidden');
    webglContainer.classList.add('hidden');
    startScreen.classList.add('hidden');
    lockScreen.classList.remove('hidden');
    updateClock();
    setInterval(updateClock, 1000);
    setTimeout(()=>{
      lockScreen.classList.add('hidden');
      homeScreen.classList.remove('hidden');
      buildHome();
    }, 3000);
  }

  startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    // Try video candidates: arranque.mp4 then boot.mp4
    const candidates = ['arranque.mp4','boot.mp4'];
    let played = false;
    for (const src of candidates) {
      try {
        bootVideo.src = src;
        // ensure muted false only after user interaction is allowed by browser
        bootVideo.muted = false;
        await bootVideo.play();
        videoContainer.classList.remove('hidden');
        bootVideo.onended = () => { showLock(); };
        played = true;
        break;
      } catch (err) {
        console.warn('Video play error for', src, err);
      }
    }
    if (!played) {
      // fallback: run WebGL animation for ~8s
      webglContainer.classList.remove('hidden');
      await runWebGLBoot(document.getElementById('bootCanvas'));
      showLock();
    }
  });
}

function updateClock() {
  const t = new Date();
  const hh = t.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
  const dd = t.toLocaleDateString();
  const elTime = document.getElementById('time');
  const elDate = document.getElementById('date');
  if (elTime) elTime.textContent = hh;
  if (elDate) elDate.textContent = dd;
}

function buildHome() {
  const grid = document.getElementById('grid');
  const apps = [
    { id:'telefono', label:'Teléfono', icon:'telefono.png' },
    { id:'mensajes', label:'Mensajes', icon:'mensajes.png' },
    { id:'galeria', label:'Galería', icon:'galeria.png' },
    { id:'navegador', label:'Navegador', icon:'navegador.png' }
  ];
  grid.innerHTML = '';
  apps.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'app';
    btn.setAttribute('data-app', a.id);
    btn.innerHTML = `<img src="${a.icon}" alt="${a.label}"><span>${a.label}</span>`;
    btn.addEventListener('click', ()=> openApp(a.id, a.label));
    grid.appendChild(btn);
  });
  const fav = document.getElementById('favbar');
  fav.innerHTML = apps.slice(0,4).map(a=>`<img src="${a.icon}" title="${a.label}" style="width:48px;height:48px;border-radius:50%">`).join('');
}

function openApp(id,label) {
  const appWindow = document.getElementById('appWindow');
  appWindow.innerHTML = `<div class="appContent"><h2>${label}</h2><p>Demo de ${label}</p><p>Próximamente...</p><div style="margin-top:12px"><button id="closeApp">Cerrar</button></div></div>`;
  appWindow.classList.remove('hidden');
  const close = document.getElementById('closeApp');
  close.addEventListener('click', ()=> appWindow.classList.add('hidden'));
}

// WebGL fallback using dynamic import of Three.js module
async function runWebGLBoot(canvasEl) {
  try {
    const module = await import('https://unpkg.com/three@0.150.1/build/three.module.js');
    const THREE = module;
    const canvas = canvasEl;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(5,5,5);
    scene.add(light);
    const geo = new THREE.IcosahedronGeometry(8,1);
    const mat = new THREE.MeshStandardMaterial({ color:0x1de9b6, metalness:0.2, roughness:0.4, emissive:0x001a12 });
    const mesh = new THREE.Mesh(geo,mat);
    scene.add(mesh);
    let running = true;
    function loop() {
      if (!running) return;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.014;
      renderer.render(scene,camera);
      requestAnimationFrame(loop);
    }
    loop();
    await new Promise(res => setTimeout(res, 8000));
    running = false;
    renderer.dispose && renderer.dispose();
  } catch (err) {
    console.warn('WebGL fallback failed', err);
    await new Promise(res => setTimeout(res, 2000));
  }
}

window.addEventListener('load', init);
