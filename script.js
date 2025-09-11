
/* Ultimate Plus Beta 4.1 Arreglada - script.js */
const SETTINGS_KEY = 'vexs_beta4_1';
let SETTINGS = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
if(typeof SETTINGS.vibration === 'undefined') SETTINGS.vibration = true;
if(typeof SETTINGS.iconStyle === 'undefined') SETTINGS.iconStyle = 'circle';
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }

// Time
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function tick(){ document.querySelectorAll('#lockClock,#homeTime').forEach(el=>{ if(el) el.textContent = now(); }); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();

// Fixed apps (6)
const APPS = [
  {id:'telefono', name:'Teléfono', icon:'telefono.png'},
  {id:'mensajes', name:'Mensajes', icon:'mensajes.png'},
  {id:'galeria', name:'Galería', icon:'galeria.png'},
  {id:'notas', name:'Notas', icon:'notas.png'},
  {id:'navegador', name:'Navegador', icon:'navegador.png'},
  {id:'configuracion', name:'Configuración', icon:'configuracion.png'}
];

// Boot sequence robust (no audio). shorter for testing
const BOOT_MAX_MS = 6000;
function bootSequence(){
  const bootName = document.getElementById('bootName');
  const bootDots = document.getElementById('bootDots');
  try{
    setTimeout(()=> bootName.classList.remove('hidden'), 1400);
    setTimeout(()=>{ bootDots.classList.remove('hidden'); bootDots.querySelectorAll('span').forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*260)); }, 1800);
  }catch(e){ console.log('boot ui error', e); }
  setTimeout(()=> proceedToLock(), BOOT_MAX_MS);
}
function proceedToLock(){
  document.getElementById('boot').classList.add('hidden');
  document.getElementById('boot').setAttribute('aria-hidden','true');
  const lock = document.getElementById('lock');
  lock.classList.remove('hidden');
  lock.setAttribute('aria-hidden','false');
  tick();
}

// Verify placeholders (non-blocking)
function checkFileExists(path, cb){
  if(!path) return cb(false);
  const img = new Image(); let handled=false;
  img.onload = ()=>{ if(!handled){ handled=true; cb(true); } };
  img.onerror = ()=>{ if(!handled){ handled=true; cb(false); } };
  img.src = path;
  setTimeout(()=>{ if(!handled){ handled=true; cb(false); } }, 1000);
}
function verifyPlaceholders(){
  const required = ['telefono.png','mensajes.png','galeria.png','notas.png','navegador.png','configuracion.png'];
  required.forEach(p=> checkFileExists(p, exists=>{ if(!exists){ const el=document.createElement('div'); el.className='error-box'; el.innerHTML = `⚠️ Falta <strong>${p}</strong>. Súbelo a la raíz.`; document.body.appendChild(el); } } ));
}

// Gestures: unlock (swipe up) and app close (swipe down)
function enableGestures(){
  const lock = document.getElementById('lock');
  let startY = 0;
  lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy > 60){ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(40); proceedToHome(); } }, {passive:true});

  // app close gesture on overlay
  const appWindow = document.getElementById('appWindow');
  let aStartY = 0;
  appWindow.addEventListener('touchstart', e=> aStartY = e.touches[0].clientY, {passive:true});
  appWindow.addEventListener('touchend', e=>{ const dy = aStartY - e.changedTouches[0].clientY; if(dy < -60){ // swipe down to close
      closeAppWindow();
  } }, {passive:true});
}

// Open / close app
function proceedToHome(){
  const lock=document.getElementById('lock');
  const home=document.getElementById('home');
  lock.classList.add('hidden');
  home.classList.remove('hidden');
}
function openApp(id){
  const app = APPS.find(a=>a.id===id) || {name:id};
  const appContent = document.getElementById('appContent');
  appContent.innerHTML = `<div class='app-shell'><h2>${app.name}</h2><p>Contenido simulado de ${app.name}.</p></div>`;
  const win = document.getElementById('appWindow');
  win.classList.remove('hidden');
  win.classList.add('app-open-anim');
  win.setAttribute('aria-hidden','false');
  if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20);
  appContent.focus();
}
function closeAppWindow(){
  const win = document.getElementById('appWindow');
  win.classList.add('hidden');
  win.setAttribute('aria-hidden','true');
  document.getElementById('appContent').innerHTML = '';
}

// Hook favorites buttons and config
function setupFavs(){
  document.querySelectorAll('.fav-btn').forEach(b=> b.addEventListener('click', ()=>{
    const app = b.dataset.app;
    if(app === 'configuracion'){ openConfig(); return; }
    openApp(app);
  }));
}

// Config UI
function openConfig(){
  openApp('configuracion');
  const tpl = document.getElementById('configTpl').content.cloneNode(true);
  const appContent = document.getElementById('appContent');
  appContent.innerHTML = '';
  appContent.appendChild(tpl);
  const vib = document.getElementById('vibToggle');
  vib.checked = SETTINGS.vibration;
  vib.addEventListener('change', ()=>{ SETTINGS.vibration = vib.checked; saveSettings(); });
  const sel = document.getElementById('iconStyle');
  sel.value = SETTINGS.iconStyle || 'circle';
  sel.addEventListener('change', ()=>{ SETTINGS.iconStyle = sel.value; saveSettings(); applyIconStyle(); });
  document.getElementById('btnChangeBg').addEventListener('click', ()=>{
    const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange = e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload = ev=>{ const which = confirm('Aplicar a inicio? OK=inicio, Cancelar=bloqueo') ? 'home' : 'lock'; localStorage.setItem(which==='home'?'vex_wall_home':'vex_wall_lock', ev.target.result); applyBackgrounds(); alert('Fondo aplicado a '+which); }; r.readAsDataURL(f); };
    inp.click();
  });
  document.getElementById('btnReboot').addEventListener('click', ()=>{ alert('Se reiniciará'); setTimeout(()=> location.reload(), 600); });
}

// Icon style
function applyIconStyle(){
  document.querySelectorAll('.fav-icon').forEach(img=>{
    if(SETTINGS.iconStyle === 'circle') img.style.borderRadius = '50%';
    else if(SETTINGS.iconStyle === 'rounded') img.style.borderRadius = '12px';
    else img.style.borderRadius = '6px';
    img.style.width = '56px'; img.style.height = '56px'; img.style.objectFit = 'cover';
  });
}

// Backgrounds
function applyBackgrounds(){ const h = localStorage.getItem('vex_wall_home'); const l = localStorage.getItem('vex_wall_lock'); if(h) document.getElementById('home').style.backgroundImage = `url(${h})`; if(l) document.getElementById('lock').style.backgroundImage = `url(${l})`; }

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  verifyPlaceholders();
  applyIconStyle();
  setupFavs();
  enableGestures();
  applyBackgrounds();
  setTimeout(()=> bootSequence(), 200);
});
window.vexs = { openApp, closeAppWindow, SETTINGS, saveSettings };
