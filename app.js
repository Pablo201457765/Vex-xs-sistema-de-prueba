(function(){
  const boot = document.getElementById('boot');
  const bootTrans = document.getElementById('boot-transition');
  const lock = document.getElementById('lock');
  const home = document.getElementById('home');
  const appWindow = document.getElementById('appWindow');
  const appContent = document.getElementById('appContent');
  const lockTime = document.getElementById('lockTime');
  const lockDate = document.getElementById('lockDate');
  const homeClock = document.getElementById('homeClock');

  function nowStr(){const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
  function dateStr(){return new Date().toLocaleDateString('es-ES',{weekday:'long',day:'2-digit',month:'long'});}
  function tick(){ if(lockTime) lockTime.textContent = nowStr(); if(lockDate) lockDate.textContent = dateStr(); if(homeClock) homeClock.textContent = nowStr(); }
  setInterval(tick,1000); tick();

  setTimeout(()=>{
    boot.classList.add('hidden');
    bootTrans.classList.remove('hidden'); bootTrans.style.opacity='1';
    setTimeout(()=>{ bootTrans.style.opacity='0'; bootTrans.classList.add('hidden'); lock.classList.remove('hidden'); }, 800);
  }, 30000);

  let startY=0;
  lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy>50){ lock.classList.add('hidden'); home.classList.remove('hidden'); } }, {passive:true});

  document.addEventListener('click', e=>{
    const btn = e.target.closest('.app');
    if(!btn) return;
    const app = btn.dataset.app;
    openApp(app);
  });

  function openApp(name){
    if(localStorage.getItem('vxs_haptics') !== '0' && navigator.vibrate) navigator.vibrate(18);
    if(localStorage.getItem('vxs_click') !== '0'){ try{ /* small built-in sound can be added */ }catch(e){} }
    appContent.innerHTML = renderApp(name);
    appWindow.classList.remove('hidden');
    setTimeout(()=> appWindow.classList.add('active'), 10);
    if(name === 'settings') bindSettings();
  }

  let appStartY = 0;
  appWindow.addEventListener('touchstart', e=> appStartY = e.touches[0].clientY, {passive:true});
  appWindow.addEventListener('touchend', e=>{ const dy = appStartY - e.changedTouches[0].clientY; if(dy>50){ closeApp(); } }, {passive:true});

  function closeApp(){ appWindow.classList.remove('active'); setTimeout(()=> appWindow.classList.add('hidden'), 300); }

  function renderApp(name){
    switch(name){
      case 'settings': return settingsHTML();
      case 'phone': return '<h2>Teléfono</h2><p>Marcador próximamente…</p>';
      case 'gallery': return '<h2>Galería</h2><p>Imágenes de ejemplo…</p>';
      case 'notes': return '<h2>Notas</h2><p>Bloc de notas…</p>';
      case 'messages': return '<h2>Mensajes</h2><p>Bandeja de mensajes…</p>';
      case 'browser': return '<h2>Navegador</h2><p>Vista web próximamente…</p>';
      default: return '<h2>'+name+'</h2>';
    }
  }

  function settingsHTML(){
    return `
      <h2>Configuración</h2>
      <div class="card"><h3>Fondo de pantalla</h3>
        <input type="file" id="wallpaperInput" accept="image/*">
        <p class="note">Se guarda automáticamente (localStorage).</p></div>
      <div class="card"><h3>Velocidad de animaciones</h3>
        <select id="animSpeed"><option value="0.5">0.5x</option><option value="1" selected>1x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></div>
      <div class="card"><h3>Sonido y vibración</h3>
        <label><input type="checkbox" id="haptics" checked> Vibración</label><br/>
        <label><input type="checkbox" id="clickSound" checked> Sonido al tocar</label></div>
      <div class="card"><h3>Información</h3><ul><li>Modelo: VXS DevKit</li><li>Versión: 0.5 Beta</li><li>Batería: 79%</li></ul></div>
    `;
  }

  function bindSettings(){
    const input = document.getElementById('wallpaperInput');
    if(input) input.addEventListener('change', e=>{
      const f = e.target.files[0];
      if(!f) return;
      const r = new FileReader();
      r.onload = ev=>{
        document.getElementById('home').style.backgroundImage = `url(${ev.target.result})`;
        document.getElementById('home').style.backgroundSize = 'cover';
        document.getElementById('home').style.backgroundPosition = 'center';
        localStorage.setItem('vxs_wallpaper', ev.target.result);
      };
      r.readAsDataURL(f);
    });

    const speed = document.getElementById('animSpeed');
    if(speed){
      speed.value = localStorage.getItem('vxs_speed') || '1';
      speed.addEventListener('change', e=>{
        document.documentElement.style.setProperty('--speed', e.target.value);
        localStorage.setItem('vxs_speed', e.target.value);
      });
    }

    const hapt = document.getElementById('haptics');
    const click = document.getElementById('clickSound');
    if(hapt){ hapt.checked = localStorage.getItem('vxs_haptics') !== '0'; hapt.addEventListener('change', e=> localStorage.setItem('vxs_haptics', e.target.checked ? '1' : '0')); }
    if(click){ click.checked = localStorage.getItem('vxs_click') !== '0'; click.addEventListener('change', e=> localStorage.setItem('vxs_click', e.target.checked ? '1' : '0')); }
  }

  window.addEventListener('load', ()=>{
    const w = localStorage.getItem('vxs_wallpaper');
    if(w) { document.getElementById('home').style.backgroundImage = `url(${w})`; document.getElementById('home').style.backgroundSize='cover'; }
    const sp = localStorage.getItem('vxs_speed');
    if(sp) document.documentElement.style.setProperty('--speed', sp);
  });

})();
