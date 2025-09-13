
/* Ultimate 6.7 core JS */
const REQUIRED_ICONS = ['configuracion.png','camara.png','galeria.png','notas.png','navegador.png'];
const APPS = [
  {id:'configuracion', name:'Configuración', icon:'configuracion.png'},
  {id:'camara', name:'Cámara', icon:'camara.png'},
  {id:'galeria', name:'Galería', icon:'galeria.png'},
  {id:'notas', name:'Notas', icon:'notas.png'},
  {id:'navegador', name:'Navegador', icon:'navegador.png'}
];

// settings stored
const SETTINGS_KEY = 'vex_ultimate_6_7';
let SETTINGS = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
if(!SETTINGS.iconSize) SETTINGS.iconSize = 64; if(!SETTINGS.iconShape) SETTINGS.iconShape='circle';

// Utility: toast
let toastTimer=null;
function showToast(msg, t=15000){
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.display='block';
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.style.display='none', t);
}

// check required icons (attempt to load)
function checkRequiredIcons(){
  REQUIRED_ICONS.forEach(name => {
    const img = new Image();
    img.onload = ()=>{/* ok */};
    img.onerror = ()=> showToast(`⚠️ Falta ${name} en la raíz`,15000);
    img.src = name + '?v=1'; // cache-bust
  });
}

// img fallback for <img onerror>
function imgFallback(el){ el.src = placeholderWarning(); showToast('⚠️ Icono faltante: ' + (el.getAttribute('alt') || 'icon'), 10000); }
function placeholderWarning(){ return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect rx="14" width="100%" height="100%" fill="#444"/><text x="50%" y="55%" font-size="48" text-anchor="middle" fill="#ffcc00">!</text></svg>`); }

// Time & boot
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'short'}); }
function tick(){ document.querySelectorAll('#lockClock,#homeTime').forEach(el=>el && (el.textContent = now())); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();

// build home apps
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

// apply icon size/shape
function applyIconSettings(){
  document.documentElement.style.setProperty('--icon-size', SETTINGS.iconSize + 'px');
  let radius='50%'; if(SETTINGS.iconShape==='square') radius='6px'; if(SETTINGS.iconShape==='round') radius='20%';
  document.documentElement.style.setProperty('--icon-radius', radius);
  if(SETTINGS.iconSize>120) showToast('⚠️ Tamaño muy grande — ajusta para evitar que se salgan las apps',4000);
}

// boot sequence 15s -> lock
function bootSeq(){
  setTimeout(()=>{
    document.getElementById('boot').classList.add('hidden');
    document.getElementById('lock').classList.remove('hidden');
    checkRequiredIcons();
  }, 15000); // 15s
}

// gestures: lock swipe up -> home ; app swipe up -> close
function enableGestures(){
  // lock
  const lock = document.getElementById('lock');
  let sy=0;
  lock.addEventListener('touchstart', e=> sy=e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy = sy - e.changedTouches[0].clientY; if(dy>60) goHome(); }, {passive:true});
  // appWindow
  const appWin = document.getElementById('appWindow');
  let as=0;
  appWin.addEventListener('touchstart', e=> as=e.touches[0].clientY, {passive:true});
  appWin.addEventListener('touchend', e=>{ const dy = as - e.changedTouches[0].clientY; if(dy>60) closeApp(); }, {passive:true});
  // gesture bar (also unlock)
  const gbar = document.getElementById('gestureBar');
  gbar.addEventListener('touchstart', e=> sy=e.touches[0].clientY, {passive:true});
  gbar.addEventListener('touchend', e=>{ const dy = sy - e.changedTouches[0].clientY; if(dy>50) goHome(); }, {passive:true});
}

function goHome(){
  // transition: show home
  document.getElementById('lock').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}

// open/close app
function openApp(id){
  if(id==='configuracion') return openConfig();
  if(id==='camara') return openCamera();
  if(id==='galeria') return openGallery();
  if(id==='notas') return openNotes();
  if(id==='navegador') return openBrowser();
}
function closeApp(){ const win=document.getElementById('appWindow'); win.classList.add('hidden'); win.style.display='none'; document.getElementById('home').classList.remove('hidden'); document.getElementById('appContent').innerHTML=''; }

// Config app
function openConfig(){
  const tpl = document.getElementById('tpl-config').content.cloneNode(true);
  const content = document.getElementById('appContent'); content.innerHTML=''; content.appendChild(tpl);
  document.getElementById('home').classList.add('hidden'); const win=document.getElementById('appWindow'); win.classList.remove('hidden'); win.style.display='flex';
  // handlers
  content.querySelectorAll('.opt').forEach(el=> el.addEventListener('click', ()=>{
    const key = el.getAttribute('data-key');
    if(key==='about') showSub('<h2>Sobre el teléfono</h2><p>Vex XS Ultimate 6.7</p>');
    if(key==='lang') showSub('<h2>Idiomas</h2><p>Español, Inglés, Portugués</p>');
    if(key==='wall') chooseWallpaper();
    if(key==='style') showStyle();
  }));
}

function showSub(html){ const content=document.getElementById('appContent'); content.innerHTML = `<div class="subpage">${html}<div style="height:12px"></div><button onclick="closeApp()">Atrás</button></div>`; }

// Wallpaper picker using file input (opens device gallery)
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

// style page (height/shape)
function showStyle(){
  const content=document.getElementById('appContent');
  content.innerHTML = `<h2>Altura y estilo</h2>
    <label>Tamaño (px): <input id="sizeRange" type="range" min="40" max="140" value="${SETTINGS.iconSize}"></label>
    <div style="height:8px"></div>
    <label>Forma: <select id="shapeSel"><option value="circle">Circular</option><option value="round">Redondeado</option><option value="square">Cuadrado</option></select></label>
    <div style="height:12px"></div>
    <button onclick="applyStyle()">Aplicar</button> <button onclick="closeApp()">Atrás</button>`;
  document.getElementById('shapeSel').value = SETTINGS.iconShape || 'circle';
  document.getElementById('sizeRange').addEventListener('input', e=>{ const v=parseInt(e.target.value,10); if(v>110) showToast('⚠️ Tamaño muy grande — el sistema ajustará el layout',3000); });
}

function applyStyle(){ const v=parseInt(document.getElementById('sizeRange').value,10); const s=document.getElementById('shapeSel').value; SETTINGS.iconSize=v; SETTINGS.iconShape=s; localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); applyIconSettings(); showSub('<h2>Estilo aplicado</h2><button onclick="closeApp()">Atrás</button>'); }

// Camera app (uses getUserMedia)
let camStream=null;
async function openCamera(){
  const content=document.getElementById('appContent');
  content.innerHTML = `<div style="display:flex;flex-direction:column;height:100%"><video id="camVideo" autoplay playsinline style="flex:1;object-fit:cover;background:#000"></video><div style="display:flex;gap:12px;padding:12px;justify-content:center"><button id="switchCam">🔄</button><button id="take" style="background:red;color:#fff;padding:12px;border-radius:10px">📸 Tomar foto</button><button onclick="closeApp()">Cerrar</button></div></div>`;
  const win=document.getElementById('appWindow'); document.getElementById('home').classList.add('hidden'); win.classList.remove('hidden'); win.style.display='flex';
  const vid=document.getElementById('camVideo');
  let facing='environment';
  async function start(){ try{ if(camStream) camStream.getTracks().forEach(t=>t.stop()); camStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:facing}}); vid.srcObject = camStream; }catch(e){ showSub('<h2>Error cámara</h2><p>No se pudo acceder a la cámara.</p><button onclick="closeApp()">Atrás</button>'); } }
  document.getElementById('switchCam').addEventListener('click', ()=>{ facing = (facing==='environment'?'user':'environment'); vid.style.transform='rotateY(180deg)'; setTimeout(()=>vid.style.transform='',220); start(); });
  document.getElementById('take').addEventListener('click', ()=>{ const canvas=document.createElement('canvas'); canvas.width=vid.videoWidth; canvas.height=vid.videoHeight; const ctx=canvas.getContext('2d'); ctx.drawImage(vid,0,0); const data = canvas.toDataURL('image/png'); let fotos = JSON.parse(localStorage.getItem('galeria')||'[]'); fotos.unshift(data); localStorage.setItem('galeria', JSON.stringify(fotos)); showToast('📷 Foto guardada en Galería',2000); });
  start();
}

// Gallery app
function openGallery(){
  const content=document.getElementById('appContent');
  content.innerHTML = '<h2>Galería</h2><div id="galWrap" style="display:flex;flex-wrap:wrap;gap:8px"></div><div style="height:12px"></div><button onclick="closeApp()">Atrás</button>';
  const win=document.getElementById('appWindow'); document.getElementById('home').classList.add('hidden'); win.classList.remove('hidden'); win.style.display='flex';
  const wrap=document.getElementById('galWrap'); const fotos = JSON.parse(localStorage.getItem('galeria')||'[]');
  if(fotos.length===0){ wrap.innerHTML='<p style="opacity:.8">Galería vacía. Usa Cámara o sube desde Configuración → Fondo de pantalla.</p>'; return; }
  fotos.forEach((d,i)=>{ const el=document.createElement('div'); el.style.width='120px'; el.style.height='160px'; el.style.overflow='hidden'; el.innerHTML=`<img src="${d}" style="width:100%;height:100%;object-fit:cover;cursor:pointer">`; el.firstChild.addEventListener('click', ()=>{ const apply = confirm('Aplicar a Inicio (OK) o Bloqueo (Cancelar)?'); if(apply){ localStorage.setItem('vex_wall_home', d); applyBackgrounds(); showToast('Fondo aplicado (Inicio)',2000); } else { localStorage.setItem('vex_wall_lock', d); applyBackgrounds(); showToast('Fondo aplicado (Bloqueo)',2000); } }); wrap.appendChild(el); });
}

// Notes (simple)
function openNotes(){ const content=document.getElementById('appContent'); content.innerHTML = '<h2>Notas (demo)</h2><textarea id="noteTxt" style="width:100%;height:60vh"></textarea><div style="margin-top:8px"><button onclick="saveNote()">Guardar</button> <button onclick="closeApp()">Atrás</button></div>'; const notes = JSON.parse(localStorage.getItem('vex_notes')||'[]'); if(notes[0]) document.getElementById('noteTxt').value = notes[0]; }
function saveNote(){ const v=document.getElementById('noteTxt').value; localStorage.setItem('vex_notes', JSON.stringify([v])); showToast('Nota guardada',1500); }

function openBrowser(){ showSub('<h2>Navegador (demo)</h2><p>Funcionalidad completa en versiones futuras.</p><button onclick="closeApp()">Atrás</button>'); }

document.addEventListener('DOMContentLoaded', ()=>{ applyBackgrounds(); buildHome(); enableGestures(); bootSeq(); document.getElementById('dock').style.display='flex'; checkRequiredIcons(); });
