
/* Ultimate 4.7 JS - corregido: dock funciona, notas/browser abren con mensaje "no funciona todavía". */
const REQUIRED_ICONS = ['configuracion.png','camara.png','galeria.png','notas.png','navegador.png','telefono.png','mensaje.png'];
const APPS = [
  {id:'configuracion', name:'Configuración', icon:'configuracion.png'},
  {id:'camara', name:'Cámara', icon:'camara.png'},
  {id:'galeria', name:'Galería', icon:'galeria.png'},
  {id:'notas', name:'Notas', icon:'notas.png'},
  {id:'navegador', name:'Navegador', icon:'navegador.png'}
];

const SETTINGS_KEY = 'vex_ultimate_4_7';
let SETTINGS = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
if(!SETTINGS.iconSize) SETTINGS.iconSize = 64; if(!SETTINGS.iconShape) SETTINGS.iconShape='circle';

// Toast helper
let toastTimer=null;
function showToast(msg, t=10000){
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.display='block';
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.style.display='none', t);
}

// check required icons in root and show clear name if missing
function checkRequiredIcons(){
  REQUIRED_ICONS.forEach(name => {
    const img = new Image();
    img.onload = ()=>{/* exists */};
    img.onerror = ()=> showToast(`⚠️ Falta ${name} en la raíz`,15000);
    img.src = name + '?v=1';
  });
}

function imgFallback(el){
  el.src = placeholderSVG();
  showToast('⚠️ Icono faltante: ' + (el.getAttribute('alt') || 'icon'), 8000);
}
function placeholderSVG(){ return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect rx="20" width="100%" height="100%" fill="#222"/><text x="50%" y="55%" font-size="40" text-anchor="middle" fill="#ffcc00">!</text></svg>`); }

// time/date
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'short'}); }
function tick(){ document.querySelectorAll('#lockClock,#homeTime').forEach(el=>el && (el.textContent = now())); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();

// build home grid
function buildHome(){
  const row = document.getElementById('appsRow');
  row.innerHTML = '';
  APPS.forEach(a=>{
    const btn = document.createElement('button'); btn.className='app-tile';
    btn.innerHTML = `<img class="app-icon" src="${a.icon}" alt="${a.name}" onerror="imgFallback(this)"><div class="app-label">${a.name}</div>`;
    btn.addEventListener('click', ()=> openApp(a.id));
    row.appendChild(btn);
  });
  applyIconSettings();
}

// apply icon style
function applyIconSettings(){
  document.documentElement.style.setProperty('--icon-size', SETTINGS.iconSize + 'px');
  let radius='50%'; if(SETTINGS.iconShape==='square') radius='6px'; if(SETTINGS.iconShape==='round') radius='20%';
  document.documentElement.style.setProperty('--icon-radius', radius);
  if(SETTINGS.iconSize>120) showToast('⚠️ Tamaño muy grande — ajusta para evitar que se salgan las apps',4000);
}

// boot (15s)
function bootSeq(){
  setTimeout(()=>{
    document.getElementById('boot').classList.add('hidden');
    document.getElementById('lock').classList.remove('hidden');
    checkRequiredIcons();
  }, 15000);
}

// gestures
function enableGestures(){
  // lock unlock by swipe up
  const lock = document.getElementById('lock');
  let sy=0;
  lock.addEventListener('touchstart', e=> sy=e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy = sy - e.changedTouches[0].clientY; if(dy>60) goHome(); }, {passive:true});
  // gesture bar also unlocks
  const gbar = document.getElementById('gestureBar');
  gbar.addEventListener('touchstart', e=> sy=e.touches[0].clientY, {passive:true});
  gbar.addEventListener('touchend', e=>{ const dy = sy - e.changedTouches[0].clientY; if(dy>50) goHome(); }, {passive:true});
  // dock buttons
  document.querySelectorAll('.dock-btn').forEach(b=> b.addEventListener('click', ()=>{
    const id = b.getAttribute('data-app');
    if(id) openDockApp(id);
  }));
  // app window swipe up to close
  const appWin = document.getElementById('appWindow');
  let as=0;
  appWin.addEventListener('touchstart', e=> as=e.touches[0].clientY, {passive:true});
  appWin.addEventListener('touchend', e=>{ const dy = as - e.changedTouches[0].clientY; if(dy>60) closeApp(); }, {passive:true});
}

// go home with transition
function goHome(){
  document.getElementById('lock').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}

// open app router
function openApp(id){
  if(id==='configuracion') return openConfig();
  if(id==='camara') return openCamera();
  if(id==='galeria') return openGallery();
  if(id==='notas') return openNotes();
  if(id==='navegador') return openBrowser();
}

// Dock apps handler
function openDockApp(id){
  if(id==='telefono') return openPhone();
  if(id==='mensajes') return openMessages();
  if(id==='galeria') return openGallery();
  if(id==='navegador') return openBrowser();
}

// open/close app overlay
function showAppOverlay(contentHTML){
  const win = document.getElementById('appWindow');
  const content = document.getElementById('appContent');
  content.innerHTML = contentHTML;
  document.getElementById('home').classList.add('hidden');
  win.classList.remove('hidden');
  win.style.display='flex';
  win.setAttribute('aria-hidden','false');
}
function closeApp(){ const win=document.getElementById('appWindow'); win.classList.add('hidden'); win.style.display='none'; win.setAttribute('aria-hidden','true'); document.getElementById('home').classList.remove('hidden'); document.getElementById('appContent').innerHTML=''; }

// config app
function openConfig(){
  const tpl = document.getElementById('tpl-config').content.cloneNode(true);
  showAppOverlay('');
  const content = document.getElementById('appContent');
  content.appendChild(tpl);
  // attach options
  content.querySelectorAll('.opt').forEach(el=> el.addEventListener('click', ()=>{
    const key = el.getAttribute('data-key');
    if(key==='about') showSub('<h2>Sobre el teléfono</h2><p>Vex XS Ultimate 4.7</p>');
    if(key==='lang') showSub('<h2>Idiomas</h2><p>Español, Inglés, Portugués</p>');
    if(key==='wall') chooseWallpaper();
    if(key==='style') showStyle();
  }));
}
function showSub(html){ const content=document.getElementById('appContent'); content.innerHTML = `<div class="subpage" style="padding:12px">${html}<div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>`; }

// wallpaper
function chooseWallpaper(){
  const picker = document.getElementById('filePicker');
  picker.onchange = e=>{
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ev=>{
      const data = ev.target.result;
      const which = confirm('OK = Pantalla de inicio. Cancel = Pantalla de bloqueo.') ? 'home' : 'lock';
      if(which==='home') localStorage.setItem('vex_wall_home', data); else localStorage.setItem('vex_wall_lock', data);
      applyBackgrounds(); showSub('<h2>Fondo aplicado</h2><button onclick="closeApp()">Atrás</button>');
    }; r.readAsDataURL(f); picker.value='';
  };
  picker.click();
}
function applyBackgrounds(){ const h = localStorage.getItem('vex_wall_home'); const l = localStorage.getItem('vex_wall_lock'); if(h) document.getElementById('home').style.backgroundImage = `url(${h})`; if(l) document.getElementById('lock').style.backgroundImage = `url(${l})`; }

function showStyle(){
  const content=document.getElementById('appContent');
  content.innerHTML = `<div style="padding:12px"><h2>Altura y estilo</h2>
    <label>Tamaño (px): <input id="sizeRange" type="range" min="40" max="140" value="${SETTINGS.iconSize}"></label>
    <div style="height:8px"></div>
    <label>Forma: <select id="shapeSel"><option value="circle">Circular</option><option value="round">Redondeado</option><option value="square">Cuadrado</option></select></label>
    <div style="height:12px"></div>
    <button onclick="applyStyle()">Aplicar</button> <button onclick="closeApp()">Atrás</button></div>`;
  document.getElementById('shapeSel').value = SETTINGS.iconShape || 'circle';
  document.getElementById('sizeRange').addEventListener('input', e=>{ const v=parseInt(e.target.value,10); if(v>110) showToast('⚠️ Tamaño muy grande — el sistema ajustará el layout',3000); });
}
function applyStyle(){ const v=parseInt(document.getElementById('sizeRange').value,10); const s=document.getElementById('shapeSel').value; SETTINGS.iconSize=v; SETTINGS.iconShape=s; localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); applyIconSettings(); showSub('<h2>Estilo aplicado</h2><button onclick="closeApp()">Atrás</button>'); }

// camera
let camStream=null;
async function openCamera(){
  const content = `<div style="display:flex;flex-direction:column;height:100%"><video id="camVideo" autoplay playsinline style="flex:1;object-fit:cover;background:#000"></video><div style="display:flex;gap:12px;padding:12px;justify-content:center"><button id="switchCam">🔄</button><button id="take" style="background:red;color:#fff;padding:12px;border-radius:10px">📸 Tomar foto</button><button onclick="closeApp()">Cerrar</button></div></div>`;
  showAppOverlay(content);
  const vid = document.getElementById('camVideo');
  let facing='environment';
  async function start(){ try{ if(camStream) camStream.getTracks().forEach(t=>t.stop()); camStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:facing}}); vid.srcObject = camStream; }catch(e){ showSub('<h2>Error cámara</h2><p>No se pudo acceder a la cámara.</p><button onclick="closeApp()">Atrás</button>'); } }
  setTimeout(()=>{ // bind after render
    const switchBtn = document.getElementById('switchCam');
    if(switchBtn) switchBtn.addEventListener('click', ()=>{ facing = (facing==='environment'?'user':'environment'); vid.style.transform='rotateY(180deg)'; setTimeout(()=>vid.style.transform='',220); start(); });
    const takeBtn = document.getElementById('take');
    if(takeBtn) takeBtn.addEventListener('click', ()=>{ const canvas=document.createElement('canvas'); canvas.width=vid.videoWidth; canvas.height=vid.videoHeight; const ctx=canvas.getContext('2d'); ctx.drawImage(vid,0,0); const data = canvas.toDataURL('image/png'); let fotos = JSON.parse(localStorage.getItem('galeria')||'[]'); fotos.unshift(data); localStorage.setItem('galeria', JSON.stringify(fotos)); showToast('📷 Foto guardada en Galería',2000); });
    start();
  },150);
}

// gallery
function openGallery(){
  const content = `<div style="padding:12px"><h2>Galería</h2><div id="galWrap" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px"></div><div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>`;
  showAppOverlay(content);
  setTimeout(()=>{
    const wrap = document.getElementById('galWrap'); wrap.innerHTML='';
    const fotos = JSON.parse(localStorage.getItem('galeria')||'[]');
    if(fotos.length===0){ wrap.innerHTML='<p style="opacity:.8">Galería vacía. Usa Cámara o Configuración → Fondo de pantalla.</p>'; return; }
    fotos.forEach((d,i)=>{ const el=document.createElement('div'); el.style.width='120px'; el.style.height='160px'; el.style.overflow='hidden'; el.innerHTML=`<img src="${d}" style="width:100%;height:100%;object-fit:cover;cursor:pointer">`; el.firstChild.addEventListener('click', ()=>{ const apply = confirm('Aplicar a Inicio (OK) o Bloqueo (Cancelar)?'); if(apply){ localStorage.setItem('vex_wall_home', d); applyBackgrounds(); showToast('Fondo aplicado (Inicio)',2000); } else { localStorage.setItem('vex_wall_lock', d); applyBackgrounds(); showToast('Fondo aplicado (Bloqueo)',2000); } }); wrap.appendChild(el); });
  },80);
}

// notes - should open but show "no funciona todavía"
function openNotes(){
  const html = `<div style="padding:12px"><h2>Notas</h2><p>Esta aplicación <strong>aún no está implementada</strong>. Próximamente.</p><div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>`;
  showAppOverlay(html);
}

// browser - open and show "no funciona todavía"
function openBrowser(){
  const html = `<div style="padding:12px"><h2>Navegador</h2><p>El navegador aún no tiene proceso operativo. Funcionalidad completa en futuras versiones.</p><div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>`;
  showAppOverlay(html);
}

// phone & messages placeholders (dock)
function openPhone(){ showAppOverlay('<div style="padding:12px"><h2>Teléfono</h2><p>Función no implementada.</p><div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>'); }
function openMessages(){ showAppOverlay('<div style="padding:12px"><h2>Mensajes</h2><p>Función no implementada.</p><div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>'); }

document.addEventListener('DOMContentLoaded', ()=>{ applyBackgrounds(); buildHome(); enableGestures(); bootSeq(); document.getElementById('dock').style.display='flex'; checkRequiredIcons(); });
