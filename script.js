/* script.js - UltimatePlus Beta 4.2 Fixed */
const SETTINGS_KEY = 'vexs_beta4_2';
let SETTINGS = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
if(typeof SETTINGS.vibration === 'undefined') SETTINGS.vibration = true;
if(typeof SETTINGS.iconStyle === 'undefined') SETTINGS.iconStyle = 'circle';
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }

// Time & date
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function tick(){ document.querySelectorAll('#lockClock,#homeTime').forEach(el=>{ if(el) el.textContent = now(); }); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();

// Fixed 4 apps
const APPS = [
  {id:'telefono', name:'Teléfono', icon:'telefono.png'},
  {id:'mensajes', name:'Mensajes', icon:'mensajes.png'},
  {id:'galeria', name:'Galería', icon:'galeria.png'},
  {id:'navegador', name:'Navegador', icon:'navegador.png'}
];

// Boot -> lock robust
const BOOT_MAX_MS = 5000;
function bootSequence(){
  const bootName = document.getElementById('bootName');
  const bootDots = document.getElementById('bootDots');
  try{ setTimeout(()=> bootName.classList.remove('hidden'), 1200); setTimeout(()=>{ bootDots.classList.remove('hidden'); bootDots.querySelectorAll('span').forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*260)); },1600);}catch(e){console.log('boot ui',e);}
  setTimeout(()=> proceedToLock(), BOOT_MAX_MS);
}
function proceedToLock(){
  document.getElementById('boot').classList.add('hidden');
  document.getElementById('boot').setAttribute('aria-hidden','true');
  const lock = document.getElementById('lock');
  lock.classList.remove('hidden');
  lock.setAttribute('aria-hidden','false');
  // ensure home-gesture and dock visible
  document.getElementById('homeGesture').style.display = 'block';
  document.getElementById('dock').style.display = 'flex';
  tick();
}

// verify placeholders (non-blocking)
function checkFileExists(path, cb){ if(!path) return cb(false); const img=new Image(); let handled=false; img.onload=()=>{ if(!handled){handled=true;cb(true);} }; img.onerror=()=>{ if(!handled){handled=true;cb(false);} }; img.src=path; setTimeout(()=>{ if(!handled){handled=true;cb(false);} },900); }
function verifyPlaceholders(){ const required=['telefono.png','mensajes.png','galeria.png','navegador.png']; required.forEach(p=> checkFileExists(p, exists=>{ if(!exists){ const el=document.createElement('div'); el.className='error-box'; el.innerHTML=`⚠️ Falta <strong>${p}</strong>. Súbelo a la raíz.`; document.body.appendChild(el); } } )); }

// gestures: lock swipe-up to home; home-gesture visible and functional; app close swipe-down
function enableGestures(){
  // lock swipe up to unlock
  const lock = document.getElementById('lock');
  let startY=0;
  lock.addEventListener('touchstart', e=> startY=e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy=startY - e.changedTouches[0].clientY; if(dy>60){ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(40); goHome(); } }, {passive:true});

  // home-gesture: swipe up from bottom when on home -> small visual feedback
  const gesture = document.getElementById('homeGesture');
  let gStartY=0;
  gesture.addEventListener('touchstart', e=> gStartY = e.touches[0].clientY, {passive:true});
  gesture.addEventListener('touchend', e=>{ const dy = gStartY - e.changedTouches[0].clientY; if(dy>20){ gesture.style.transform='translateY(-6px)'; setTimeout(()=> gesture.style.transform='none',220); } }, {passive:true});

  // app overlay swipe down to close
  const appWindow = document.getElementById('appWindow');
  let aStartY=0;
  appWindow.addEventListener('touchstart', e=> aStartY = e.touches[0].clientY, {passive:true});
  appWindow.addEventListener('touchend', e=>{ const dy = aStartY - e.changedTouches[0].clientY; if(dy < -60){ closeApp(); } }, {passive:true});
}

// open & close apps: app must fill entire viewport and hide background content
function goHome(){ document.getElementById('lock').classList.add('hidden'); document.getElementById('home').classList.remove('hidden'); }
function openApp(id){
  const app = APPS.find(a=>a.id===id) || {name:id};
  const appContent = document.getElementById('appContent');
  appContent.innerHTML = `<div style="padding-top:24px"><h1>${app.name}</h1><p>Esta es la aplicación <strong>${app.name}</strong>. Abre en pantalla completa y oculta todo lo de fondo.</p><p>Prueba deslizar hacia abajo para cerrar.</p></div>`;
  const win = document.getElementById('appWindow');
  document.getElementById('home').classList.add('hidden'); // hide home behind
  win.classList.remove('hidden');
  win.style.display = 'flex';
  win.setAttribute('aria-hidden','false');
  // ensure gesture bar visible while in app
  document.getElementById('homeGesture').style.display = 'block';
  if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20);
  appContent.focus();
}
function closeApp(){
  const win = document.getElementById('appWindow');
  win.classList.add('hidden');
  win.style.display = 'none';
  document.getElementById('home').classList.remove('hidden');
  document.getElementById('appContent').innerHTML = '';
}

// hook dock buttons
function setupDock(){
  document.querySelectorAll('.dock-btn').forEach(b=> b.addEventListener('click', ()=>{ const id=b.dataset.app; openApp(id); }));
}

// init
document.addEventListener('DOMContentLoaded', ()=>{
  // hide gesture & dock during boot
  document.getElementById('homeGesture').style.display = 'none';
  document.getElementById('dock').style.display = 'none';
  verifyPlaceholders();
  enableGestures();
  setupDock();
  setTimeout(()=> bootSequence(), 200);
});
window.vexs = { openApp, closeApp, SETTINGS, saveSettings };