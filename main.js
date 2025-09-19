/* main.js - Vex XS Ultimate Plus 5.2 (robust, vanilla JS) */
(function(){
  const $ = id => document.getElementById(id);
  function safeLog(...a){ try{ console.log(...a); }catch(e){} }
  function updateClock(){
    const t = new Date();
    const hh = t.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    const dd = t.toLocaleDateString();
    const elTime = $('time'), elDate = $('date');
    if (elTime) elTime.textContent = hh;
    if (elDate) elDate.textContent = dd;
  }
  function buildHome(){
    const grid = $('grid');
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
    const fav = $('favbar');
    fav.innerHTML = apps.slice(0,4).map(a=>`<img src="${a.icon}" title="${a.label}" style="width:48px;height:48px;border-radius:50%">`).join('');
  }
  function openApp(id,label){
    const appWindow = document.createElement('div');
    appWindow.className = 'appWindow';
    appWindow.innerHTML = `<div class="appContent"><h2>${label}</h2><p>Demo de ${label} — próximamente</p><div style="margin-top:12px"><button class="closeBtn">Cerrar</button></div></div>`;
    document.body.appendChild(appWindow);
    appWindow.querySelector('.closeBtn').addEventListener('click', ()=> appWindow.remove());
  }
  async function runWebGLBoot(canvasEl){
    try{
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
      function loop(){
        if(!running) return;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.014;
        renderer.render(scene,camera);
        requestAnimationFrame(loop);
      }
      loop();
      await new Promise(res => setTimeout(res, 7000));
      running = false;
      renderer.dispose && renderer.dispose();
    }catch(e){
      safeLog('WebGL fallback failed', e);
      await new Promise(res => setTimeout(res,2000));
    }
  }
  function showLockThenHome(){
    $('videoContainer')?.classList.add('hidden');
    $('webglContainer')?.classList.add('hidden');
    $('startScreen')?.classList.add('hidden');
    $('lockScreen')?.classList.remove('hidden');
    updateClock();
    setInterval(updateClock, 1000);
    setTimeout(()=>{
      $('lockScreen')?.classList.add('hidden');
      $('homeScreen')?.classList.remove('hidden');
      buildHome();
    }, 2500);
  }
  window.addEventListener('load', ()=>{
    const startBtn = $('startBtn');
    const bootVideo = $('bootVideo');
    const videoContainer = $('videoContainer');
    const webglContainer = $('webglContainer');
    if(!startBtn){
      document.body.innerHTML = '<div style="color:white;padding:20px;font-family:Arial">Error: interfaz no encontrada. Revisa index.html y main.js.</div>';
      return;
    }
    startBtn.addEventListener('click', async ()=>{
      startBtn.disabled = true;
      const candidates = ['arranque.mp4','boot.mp4'];
      let played = false;
      for(const src of candidates){
        try{
          bootVideo.src = src;
          bootVideo.muted = true;
          await bootVideo.play();
          videoContainer.classList.remove('hidden');
          bootVideo.onended = () => showLockThenHome();
          played = true;
          break;
        }catch(err){
          safeLog('video play error', src, err);
        }
      }
      if(!played){
        webglContainer.classList.remove('hidden');
        await runWebGLBoot($('bootCanvas'));
        showLockThenHome();
      }
    });
  });
})();