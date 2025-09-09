(function(){
const boot = document.getElementById('boot');
const lock = document.getElementById('lock');
const home = document.getElementById('home');
const quick = document.getElementById('quick');
const appWindow = document.getElementById('appWindow');
const appContent = document.getElementById('appContent');
const appClose = document.getElementById('appClose');
const bootAudio = document.getElementById('bootAudio');

function nowStr(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function show(el){ el.classList.remove('hidden'); el.setAttribute('aria-hidden','false'); }
function hide(el){ el.classList.add('hidden'); el.setAttribute('aria-hidden','true'); }

function tick(){
  const t = nowStr();
  const ids = ['lockTime','homeTime','stat-time'];
  ids.forEach(id=>{ const e=document.getElementById(id); if(e) e.textContent = t; });
  const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr();
  ['stat-batt','homeBatt'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent='100%'; });
}
setInterval(tick,1000); tick();

// Boot: V then Vex XS then dots, total 20s
(function(){
  const title = document.getElementById('bootTitle');
  const dots = document.getElementById('bootDots');
  setTimeout(()=> title.classList.remove('hidden'), 5000);
  setTimeout(()=>{ dots.classList.remove('hidden'); const spans=dots.querySelectorAll('span'); spans.forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*600)); },6000);
  try{ bootAudio.currentTime=0; bootAudio.play().catch(()=>{}); }catch(e){}
  setTimeout(()=>{ hide(boot); show(lock); },20000);
})();

// Gestures: swipe up unlock (lock), left/right on home for app switch simulation, swipe down for quick
let startY=0, startX=0;
lock.addEventListener('touchstart', e=>{ startY = e.touches[0].clientY; startX = e.touches[0].clientX; }, {passive:true});
lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy>60) { hide(lock); show(home); } }, {passive:true});

let hX=0, hY=0;
home.addEventListener('touchstart', e=>{ hX = e.touches[0].clientX; hY = e.touches[0].clientY; }, {passive:true});
home.addEventListener('touchend', e=>{ const dx = e.changedTouches[0].clientX - hX; const dy = e.changedTouches[0].clientY - hY; if(Math.abs(dx)>80 && Math.abs(dx)>Math.abs(dy)){ if(dx>0) console.log('swiperight'); else console.log('swipeleft'); } if(dy>120) { /* ignore */ } }, {passive:true});

let topY=null;
document.addEventListener('touchstart', e=>{ topY = e.touches[0].clientY; }, {passive:true});
document.addEventListener('touchend', e=>{ if(topY!==null){ const dy = e.changedTouches[0].clientY - topY; if(dy>100) show(quick); topY=null; } }, {passive:true});
quick.addEventListener('click', e=>{ if(e.target===quick) hide(quick); });

// Open apps and animate center open
document.addEventListener('click', e=>{
  const btn = e.target.closest('.app') || e.target.closest('.dock-btn');
  if(!btn) return;
  const app = btn.dataset.app;
  openApp(app);
});

function openApp(name){
  renderApp(name);
  show(appWindow);
  appWindow.classList.add('app-open');
  setTimeout(()=> appWindow.classList.remove('app-open'), 500);
}

appClose.addEventListener('click', ()=>{ appWindow.classList.add('app-close-anim'); setTimeout(()=>{ hide(appWindow); appWindow.classList.remove('app-close-anim'); },300); });

function renderApp(name){
  const placeholders = ['notas','navegador','mensajes','telefono','galeria'];
  if(name==='configuracion'){
    appContent.innerHTML = '<h2>Configuración</h2><div><button id="btn-fondo">Cambiar fondo (Inicio/Bloqueo)</button></div><div><label>Navegación: <select id="navSel"><option value="gestures">Gestos</option></select></div><div><button id="aboutBtn">Sobre el teléfono</button></div>';
    bindConfig();
  } else if(placeholders.includes(name)){
    appContent.innerHTML = '<h2>'+name+'</h2><p>Próximamente...</p>';
  } else {
    appContent.innerHTML = '<h2>'+name+'</h2><p>Contenido</p>';
  }
}

function bindConfig(){
  const btn = document.getElementById('btn-fondo');
  if(btn) btn.addEventListener('click', ()=>{
    const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange = e=>{ const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ev=>{ const which = confirm('¿Aplicar a pantalla de inicio? (Aceptar = inicio, Cancelar = bloqueo)') ? 'home' : 'lock'; localStorage.setItem(which==='home'?'vxs_wall_home':'vxs_wall_lock', ev.target.result); applyBackgrounds(); alert('Fondo aplicado a '+which); }; r.readAsDataURL(f); }; inp.click();
  });
  const about = document.getElementById('aboutBtn');
  if(about) about.addEventListener('click', ()=>{ appContent.innerHTML = '<div style="text-align:center"><img src="sobre_telefono.png" style="width:120px;height:120px;border-radius:50%"><h3>Vex XS</h3><p>Versión: 1.200.50 Beta</p><p>@PQOD / @Vex xs oficial</p></div>'; });
}

function applyBackgrounds(){
  const homeWall = localStorage.getItem('vxs_wall_home');
  const lockWall = localStorage.getItem('vxs_wall_lock');
  if(homeWall){ home.classList.add('backgrounded'); home.style.backgroundImage = 'url('+homeWall+')'; }
  if(lockWall){ lock.classList.add('backgrounded'); lock.style.backgroundImage = 'url('+lockWall+')'; }
}

// Long press reboot 20s
let longTimer=null;
const longArea = document.getElementById('longPress');
longArea.addEventListener('touchstart', ()=>{ longTimer = setTimeout(()=> location.reload(), 20000); }, {passive:true});
longArea.addEventListener('touchend', ()=>{ if(longTimer) clearTimeout(longTimer); }, {passive:true});

window.addEventListener('load', ()=>{ applyBackgrounds(); try{ bootAudio.currentTime=0; bootAudio.play().catch(()=>{}); }catch(e){} }); })();