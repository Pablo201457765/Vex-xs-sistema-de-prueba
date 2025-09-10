(function(){
const boot = document.getElementById('boot');
const lock = document.getElementById('lock');
const home = document.getElementById('home');
const appWindow = document.getElementById('appWindow');
const appContent = document.getElementById('appContent');
const appClose = document.getElementById('appClose');
const bootAudio = document.getElementById('bootAudio');
const SETTINGS_KEY='vexs_plus_v3'; let SETTINGS=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'); if(typeof SETTINGS.vibration==='undefined') SETTINGS.vibration=true; if(typeof SETTINGS.iconStyle==='undefined') SETTINGS.iconStyle='circle'; function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function tick(){ document.querySelectorAll('#lockClock,#lockTime,#homeTime').forEach(el=>{ if(el) el.textContent = now(); }); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();
// theme auto
(function(){ const h=new Date().getHours(); if(h>=7 && h<19) document.body.classList.remove('light'); else document.body.classList.add('light'); })();
// sample apps
const APPS=[{id:'telefono',name:'Teléfono',icon:'icono_telefono.png'},{id:'galeria',name:'Galería',icon:'icono_galeria.png'},{id:'notas',name:'Notas',icon:'icono_notas.png'},{id:'mensajes',name:'Mensajes',icon:'icono_mensajes.png'},{id:'navegador',name:'Navegador',icon:'icono_navegador.png'},{id:'configuracion',name:'Configuración',icon:'icono_config.png'}];
function renderApps(){ const row=document.getElementById('appsRow'); row.innerHTML=''; APPS.forEach(a=>{ const b=document.createElement('button'); b.className='app-tile'; b.dataset.app=a.id; b.innerHTML=`<img src="${a.icon}" class="app-icon" alt="${a.name}"><span>${a.name}</span>`; row.appendChild(b); }); applyIconStyle(); }
renderApps();
function applyIconStyle(){ document.querySelectorAll('.app-icon, .dock-icon').forEach(img=>{ if(SETTINGS.iconStyle==='circle') img.style.borderRadius='50%'; else if(SETTINGS.iconStyle==='rounded') img.style.borderRadius='14px'; else img.style.borderRadius='6px'; img.style.width='72px'; img.style.height='72px'; img.style.objectFit='contain'; }); }
// boot
(function bootSeq(){ setTimeout(()=> document.getElementById('bootName').classList.remove('hidden'),4000); setTimeout(()=>{ const d=document.getElementById('bootDots'); d.classList.remove('hidden'); d.querySelectorAll('span').forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*400)); },5000); try{ bootAudio.currentTime=0; bootAudio.play().catch(()=>{}); }catch(e){} setTimeout(()=>{ boot.classList.add('hidden'); lock.classList.remove('hidden'); },16000); })();
// gestures unlock
let startY=0; lock.addEventListener('touchstart', e=> startY=e.touches[0].clientY, {passive:true}); lock.addEventListener('touchend', e=>{ const dy=startY - e.changedTouches[0].clientY; if(dy>60){ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(40); lock.classList.add('hidden'); home.classList.remove('hidden'); } }, {passive:true});
// open app
document.addEventListener('click', e=>{ const btn=e.target.closest('.app-tile, .dock-btn'); if(!btn) return; const app=btn.dataset.app; openApp(app); });
function openApp(id){ const app=APPS.find(a=>a.id===id)||{name:id}; document.getElementById('appContent').innerHTML=`<div class="app-shell"><h2>${app.name}</h2><p>Contenido de ${app.name} (simulado).</p></div>`; appWindow.classList.remove('hidden'); appWindow.classList.add('app-open'); if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20); new Audio('open_click.mp3').play().catch(()=>{}); setTimeout(()=> appWindow.classList.remove('app-open'),420); }
document.getElementById('appClose').addEventListener('click', ()=>{ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20); new Audio('close_click.mp3').play().catch(()=>{}); appWindow.classList.add('hidden'); document.getElementById('appContent').innerHTML=''; });
function openConfig(){ openApp('configuracion'); const tpl=document.getElementById('configTpl').content.cloneNode(true); document.getElementById('appContent').innerHTML=''; document.getElementById('appContent').appendChild(tpl); const vib=document.getElementById('vibToggle'); vib.checked=SETTINGS.vibration; vib.addEventListener('change', ()=>{ SETTINGS.vibration=vib.checked; saveSettings(); }); const sel=document.getElementById('iconStyle'); sel.value=SETTINGS.iconStyle||'circle'; sel.addEventListener('change', ()=>{ SETTINGS.iconStyle=sel.value; saveSettings(); applyIconStyle(); }); document.getElementById('btnChangeBg').addEventListener('click', ()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ const which=confirm('Aplicar a inicio? Aceptar=inicio, Cancelar=bloqueo')?'home':'lock'; localStorage.setItem(which==='home'?'vex_wall_home':'vex_wall_lock', ev.target.result); applyBackgrounds(); alert('Fondo aplicado a '+which); }; r.readAsDataURL(f); }; inp.click(); }); document.getElementById('btnReboot').addEventListener('click', ()=>{ alert('Se reiniciará'); setTimeout(()=> location.reload(),600); }); }
// file check
function checkFileExists(path, cb){ if(path.endsWith('.mp3')){ const a=new Audio(); a.src=path; a.addEventListener('error', ()=>cb(false)); a.addEventListener('canplay', ()=>cb(true)); try{ a.load(); }catch(e){ cb(false); } } else { const img=new Image(); img.onload=()=>cb(true); img.onerror=()=>cb(false); img.src=path; } }
function verifyPlaceholders(){ const required=['icono_telefono.png','icono_galeria.png','icono_mensajes.png','icono_navegador.png','icono_notas.png','arranque.mp3']; required.forEach(p=>{ checkFileExists(p, exists=>{ if(!exists){ const el=document.createElement('div'); el.className='error-box'; el.innerHTML=`⚠️ Falta <strong>${p}</strong>. Reemplázalo o súbelo. <a href='https://discord.gg/TU-LINK' target='_blank' rel='noopener'>Reportar</a>`; document.body.appendChild(el); } }); }); }
function applyBackgrounds(){ const h=localStorage.getItem('vex_wall_home'); const l=localStorage.getItem('vex_wall_lock'); if(h) home.style.backgroundImage=`url(${h})`; if(l) lock.style.backgroundImage=`url(${l})`; }
document.addEventListener('DOMContentLoaded', ()=>{ verifyPlaceholders(); applyIconStyle(); document.querySelectorAll('.dock-btn').forEach(b=> b.addEventListener('click', ()=> openApp(b.dataset.app))); const confBtn=document.querySelector('.app-tile[data-app="configuracion"]'); if(confBtn) confBtn.addEventListener('click', openConfig); });
