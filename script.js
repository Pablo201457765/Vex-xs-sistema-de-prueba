(function(){
const boot=document.getElementById('boot'), lock=document.getElementById('lock'), home=document.getElementById('home'), appWindow=document.getElementById('appWindow'), appContent=document.getElementById('appContent');
const bootAudio = document.getElementById('bootAudio');
const quick = document.getElementById('quick');
let bootFinished=false;

// clock
function nowStr(){const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function dateStr(){return new Date().toLocaleDateString();}
function tick(){ if(document.getElementById('time')) document.getElementById('time').textContent = nowStr(); }
setInterval(tick,1000); tick();

// Boot: play audio, show lock when audio ends
function startBoot(){
  try{ bootAudio.currentTime=0; bootAudio.play(); }catch(e){ console.log('Autoplay blocked, will proceed'); }
  // fallback: if audio metadata available, use duration
  let duration = bootAudio.duration && !isNaN(bootAudio.duration) ? bootAudio.duration : 5;
  // ensure at least 3s show
  duration = Math.max(3, duration);
  setTimeout(()=>{ boot.classList.add('hidden'); lock.classList.remove('hidden'); bootFinished=true; }, duration*1000);
}
startBoot();

// Unlock gesture swipe up
let startY=0;
lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY, {passive:true});
lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy>60){ lock.classList.add('hidden'); home.classList.remove('hidden'); } }, {passive:true});

// Quick settings: swipe down from top to toggle
let topStartY=0;
document.addEventListener('touchstart', e=>{ topStartY = e.touches[0].clientY; }, {passive:true});
document.addEventListener('touchmove', e=>{}, {passive:true});
document.addEventListener('touchend', e=>{ const dy = topStartY - e.changedTouches[0].clientY; if(dy< -80){ // swipe down
    quick.classList.remove('hidden'); quick.style.opacity=1;
  } }, {passive:true});

// Close quick on background tap
quick.addEventListener('click', e=>{ if(e.target===quick) quick.classList.add('hidden'); });

// Open apps
document.addEventListener('click', e=>{
  const btn = e.target.closest('.app');
  if(!btn) return;
  const app = btn.dataset.app;
  openApp(app);
});

function openApp(name){
  appContent.innerHTML = renderApp(name);
  appWindow.classList.remove('hidden');
  setTimeout(()=> appWindow.classList.add('active'), 10);
}

// Close app overlay swipe up
let appStartY=0;
appWindow.addEventListener('touchstart', e=> appStartY = e.touches[0].clientY, {passive:true});
appWindow.addEventListener('touchend', e=>{ const dy = appStartY - e.changedTouches[0].clientY; if(dy>50){ closeApp(); } }, {passive:true});
function closeApp(){ appWindow.classList.remove('active'); setTimeout(()=> appWindow.classList.add('hidden'), 300); }

function renderApp(name){
  switch(name){
    case 'settings': return settingsHTML();
    case 'phone': return '<h2>Teléfono</h2><p>Marcador simulado.</p>';
    case 'gallery': return '<h2>Galería</h2><p>Imágenes de ejemplo.</p>';
    case 'notes': return '<h2>Notas</h2><p>Bloc de notas.</p>';
    case 'messages': return '<h2>Mensajes</h2><p>Bandeja de mensajes.</p>';
    default: return '<h2>'+name+'</h2>';
  }
}

function settingsHTML(){
  return `
    <h2>Configuración</h2>
    <div><button id="changeBg">Cambiar fondo</button></div>
    <div><label>Vibración <input type="checkbox" id="vib" checked></label></div>
    <div><button id="setDate">Fecha y Hora</button></div>
    <div><label>Idioma <select id="lang"><option value="es">Español</option><option value="en">English</option></select></label></div>
    <div><label>Navegación <select id="nav"><option value="gestures">Gestos</option><option value="buttons">Botones</option></select></label></div>
    <div><button id="aboutBtn">Sobre el teléfono</button></div>
  `;
}

// bind settings handlers when opened
function bindSettingsButtons(){
  const changeBg = document.getElementById('changeBg');
  if(changeBg) changeBg.addEventListener('click', ()=>{ document.getElementById('home').style.backgroundImage = 'url(wallpaper1.jpg)'; });
  const aboutBtn = document.getElementById('aboutBtn');
  if(aboutBtn) aboutBtn.addEventListener('click', ()=>{
    appContent.innerHTML = `<h2>Sobre el teléfono</h2><div style="text-align:center"><img src="about_image.png" style="width:120px;height:120px;border-radius:50%"><p>VXS Beta 1.600.000<br/>@PQOD / @Vex xs oficial</p></div>`;
  });
}

// observe appWindow content changes to bind settings
const obs = new MutationObserver(()=>{ bindSettingsButtons(); });
obs.observe(appContent, {childList:true, subtree:true});

// Long press 20s to "power off" (simulate reload)
let pressTimer = null;
const longArea = document.getElementById('longPressArea');
longArea.addEventListener('touchstart', e=>{
  pressTimer = setTimeout(()=>{ // power off simulation
    // show boot screen again
    location.reload();
  }, 20000);
}, {passive:true});
longArea.addEventListener('touchend', e=>{ if(pressTimer) clearTimeout(pressTimer); }, {passive:true});

// Quick settings toggles and sliders
document.addEventListener('click', e=>{
  const qs = e.target.closest('.qs');
  if(!qs) return;
  const t = qs.dataset.toggle;
  if(t==='airplane'){ qs.classList.toggle('active'); }
  if(t==='wifi'){ qs.classList.toggle('active'); }
  if(t==='data'){ qs.classList.toggle('active'); }
  if(e.target.id==='powerBtn') location.reload();
});

})();