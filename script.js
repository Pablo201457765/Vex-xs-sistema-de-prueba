(function(){
// Core elements
const boot = document.getElementById('boot');
const lock = document.getElementById('lock');
const home = document.getElementById('home');
const quick = document.getElementById('quick');
const appWindow = document.getElementById('appWindow');
const appContent = document.getElementById('appContent');
const appClose = document.getElementById('appClose');
const bootAudio = document.getElementById('bootAudio');

// Helpers
function nowStr(){ const d=new Date(); return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ const d=new Date(); return d.toLocaleDateString(); }
function show(el){ el.classList.remove('hidden'); el.setAttribute('aria-hidden','false'); }
function hide(el){ el.classList.add('hidden'); el.setAttribute('aria-hidden','true'); }

// Status time
function tick(){
  const t = nowStr();
  document.querySelectorAll('#lockTime,#homeTime,#stat-time,#homeTime').forEach(el=>{ if(el) el.textContent = t; });
  document.querySelectorAll('#lockDate').forEach(el=>{ if(el) el.textContent = dateStr(); });
  document.querySelectorAll('#stat-batt,#homeBatt').forEach(el=>{ if(el) el.textContent = '100%'; });
}
setInterval(tick,1000); tick();

// Boot sequence: V (5s) -> Vex XS + dots -> total 20s then show lock
(function bootSeq(){
  const v = document.getElementById('bootV');
  const title = document.getElementById('bootTitle');
  const dots = document.getElementById('bootDots');
  // show V immediately (already visible)
  setTimeout(()=>{ title.classList.remove('hidden'); }, 5000); // show "Vex XS" after 5s
  setTimeout(()=>{ dots.classList.remove('hidden'); // animate dots one by one
    const spans = dots.querySelectorAll('span'); spans.forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*600)); }, 6000);
  // start audio (if available) and ensure at least 20s boot
  try{ bootAudio.currentTime = 0; bootAudio.play(); }catch(e){ console.log('autoplay blocked'); }
  setTimeout(()=>{ hide(boot); show(lock); }, 20000);
})();

// Unlock: swipe up gesture on lock
let startY = 0;
lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY, {passive:true});
lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy > 60){ hide(lock); show(home); } }, {passive:true});

// Quick settings: swipe down from top to open quick panel
let topStartY = null;
document.addEventListener('touchstart', e=>{ topStartY = e.touches[0].clientY; }, {passive:true});
document.addEventListener('touchend', e=>{ if(topStartY !== null){ const dy = e.changedTouches[0].clientY - topStartY; if(dy > 80){ show(quick); } topStartY = null; } }, {passive:true});
// close quick on background tap
quick.addEventListener('click', e=>{ if(e.target === quick) hide(quick); });

// Open apps
document.addEventListener('click', e=>{
  const btn = e.target.closest('.app') || e.target.closest('.dock-btn');
  if(!btn) return;
  const app = btn.dataset.app;
  openApp(app);
});

function openApp(name){
  // if app is one of placeholders, show "Próximamente"
  const placeholders = ['notas','navegador','mensajes','telefono','galeria'];
  if(placeholders.includes(name) && name !== 'configuracion'){
    appContent.innerHTML = `<h2>${name.charAt(0).toUpperCase()+name.slice(1)}</h2><p>Próximamente...</p>`;
  } else if(name === 'configuracion'){
    renderConfig();
  }
  show(appWindow);
  setTimeout(()=> appWindow.classList.add('visibleFade'), 10);
}

// Close app
appClose.addEventListener('click', ()=> closeApp());
function closeApp(){ appWindow.classList.remove('visibleFade'); setTimeout(()=> hide(appWindow), 300); }

// Long press to reboot (20s) on lock long-press area
let longTimer = null;
const longArea = document.getElementById('longPress');
longArea.addEventListener('touchstart', ()=> { longTimer = setTimeout(()=> location.reload(), 20000); }, {passive:true});
longArea.addEventListener('touchend', ()=> { if(longTimer) clearTimeout(longTimer); }, {passive:true});

// Quick toggles (simulated)
document.addEventListener('click', e=>{
  const qs = e.target.closest('.qs');
  if(!qs) return;
  qs.classList.toggle('active');
  if(qs.id === 'qs-power'){ location.reload(); }
});

// Configuration rendering and logic
function renderConfig(){
  appContent.innerHTML = `
    <h2>Configuración - Vex XS</h2>
    <div class="cfg"><button id="btn-fondo">Cambiar fondo (Inicio/Bloqueo)</button></div>
    <div class="cfg"><label>Navegación: <select id="navSel"><option value="gestures">Gestos</option><option value="buttons">Botones</option></select></label></div>
    <div class="cfg"><label>Idioma: <select id="langSel"></select></label></div>
    <div class="cfg"><button id="aboutBtn">Sobre el teléfono</button></div>
  `;
  bindConfig();
}

// Fill languages (basic list + common locales)
function populateLanguages(){
  const langs = ['es','en','pt','fr','de','zh','ja','ar','ru','hi','bn','pa','ur','sw','tl'];
  const sel = document.getElementById('langSel');
  if(!sel) return;
  langs.forEach(l=>{ const opt = document.createElement('option'); opt.value = l; opt.textContent = l; sel.appendChild(opt); });
}

// Bind config buttons
function bindConfig(){
  const btnF = document.getElementById('btn-fondo');
  if(btnF) btnF.addEventListener('click', ()=>{
    // open input file chooser and ask user whether set for home or lock
    const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange = e=>{
      const f = e.target.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = ev=>{
        const imgData = ev.target.result;
        const which = confirm('¿Aplicar a pantalla de inicio? (Aceptar = inicio, Cancelar = bloqueo)') ? 'home' : 'lock';
        localStorage.setItem(which === 'home' ? 'vxs_wall_home' : 'vxs_wall_lock', imgData);
        alert('Fondo aplicado a ' + which);
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  });
  const navSel = document.getElementById('navSel');
  if(navSel){
    const savedNav = localStorage.getItem('vxs_nav') || 'gestures';
    navSel.value = savedNav;
    navSel.addEventListener('change', ()=>{
      localStorage.setItem('vxs_nav', navSel.value);
      setTimeout(()=>{ alert('Se aplicará la navegación: ' + navSel.value + '. Reiniciando...'); setTimeout(()=>location.reload(),800); },200);
    });
  }
  populateLanguages();
  const aboutBtn = document.getElementById('aboutBtn');
  if(aboutBtn) aboutBtn.addEventListener('click', ()=> renderAbout());
}

// About page
function renderAbout(){
  const img = localStorage.getItem('vxs_about_img') || 'sobre_telefono.png';
  appContent.innerHTML = `<div style="text-align:center"><img src="${img}" style="width:120px;height:120px;border-radius:50%"><h3>Vex XS</h3><p>Versión: 1.200.50 Beta</p><p>@PQOD / @Vex xs oficial</p></div>`;
}

// On load: restore wallpaper and nav preference
window.addEventListener('load', ()=>{
  const homeWall = localStorage.getItem('vxs_wall_home');
  const lockWall = localStorage.getItem('vxs_wall_lock');
  if(homeWall) document.getElementById('home').style.backgroundImage = `url(${homeWall})`;
  if(lockWall) document.getElementById('lock').style.backgroundImage = `url(${lockWall})`;
  const nav = localStorage.getItem('vxs_nav') || 'gestures';
  // if buttons selected, you could show nav buttons - simulated here
  if(nav === 'buttons'){ console.log('Navigation: buttons (simulated)'); }
});})();