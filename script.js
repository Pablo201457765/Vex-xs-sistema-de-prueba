/* script.js - Ultimate Plus Beta 4 (heavy, functional) */
const SETTINGS_KEY='vexs_beta4';
let SETTINGS = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
if(typeof SETTINGS.vibration === 'undefined') SETTINGS.vibration = true;
if(typeof SETTINGS.iconStyle === 'undefined') SETTINGS.iconStyle = 'circle';
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function tick(){ document.querySelectorAll('#lockClock,#lockTime,#homeTime').forEach(el=>{ if(el) el.textContent = now(); }); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();
(function(){ const h=new Date().getHours(); if(h>=7 && h<19) document.body.classList.remove('light'); else document.body.classList.add('light'); })();
const APPS = [{'id': 'app1', 'name': 'Aplicación 1', 'icon': 'telefono.png'}, {'id': 'app2', 'name': 'Aplicación 2', 'icon': 'telefono.png'}, {'id': 'app3', 'name': 'Aplicación 3', 'icon': 'galeria.png'}, {'id': 'app4', 'name': 'Aplicación 4', 'icon': 'telefono.png'}, {'id': 'app5', 'name': 'Aplicación 5', 'icon': 'notas.png'}, {'id': 'app6', 'name': 'Aplicación 6', 'icon': 'galeria.png'}, {'id': 'app7', 'name': 'Aplicación 7', 'icon': 'telefono.png'}, {'id': 'app8', 'name': 'Aplicación 8', 'icon': 'telefono.png'}, {'id': 'app9', 'name': 'Aplicación 9', 'icon': 'galeria.png'}, {'id': 'app10', 'name': 'Aplicación 10', 'icon': 'notas.png'}, {'id': 'app11', 'name': 'Aplicación 11', 'icon': 'telefono.png'}, {'id': 'app12', 'name': 'Aplicación 12', 'icon': 'galeria.png'}, {'id': 'app13', 'name': 'Aplicación 13', 'icon': 'telefono.png'}, {'id': 'app14', 'name': 'Aplicación 14', 'icon': 'telefono.png'}, {'id': 'app15', 'name': 'Aplicación 15', 'icon': 'notas.png'}, {'id': 'app16', 'name': 'Aplicación 16', 'icon': 'telefono.png'}, {'id': 'app17', 'name': 'Aplicación 17', 'icon': 'telefono.png'}, {'id': 'app18', 'name': 'Aplicación 18', 'icon': 'galeria.png'}, {'id': 'app19', 'name': 'Aplicación 19', 'icon': 'telefono.png'}, {'id': 'app20', 'name': 'Aplicación 20', 'icon': 'notas.png'}, {'id': 'app21', 'name': 'Aplicación 21', 'icon': 'galeria.png'}, {'id': 'app22', 'name': 'Aplicación 22', 'icon': 'telefono.png'}, {'id': 'app23', 'name': 'Aplicación 23', 'icon': 'telefono.png'}, {'id': 'app24', 'name': 'Aplicación 24', 'icon': 'galeria.png'}, {'id': 'app25', 'name': 'Aplicación 25', 'icon': 'notas.png'}, {'id': 'app26', 'name': 'Aplicación 26', 'icon': 'telefono.png'}, {'id': 'app27', 'name': 'Aplicación 27', 'icon': 'galeria.png'}, {'id': 'app28', 'name': 'Aplicación 28', 'icon': 'telefono.png'}, {'id': 'app29', 'name': 'Aplicación 29', 'icon': 'telefono.png'}, {'id': 'app30', 'name': 'Aplicación 30', 'icon': 'notas.png'}, {'id': 'app31', 'name': 'Aplicación 31', 'icon': 'telefono.png'}, {'id': 'app32', 'name': 'Aplicación 32', 'icon': 'telefono.png'}, {'id': 'app33', 'name': 'Aplicación 33', 'icon': 'galeria.png'}, {'id': 'app34', 'name': 'Aplicación 34', 'icon': 'telefono.png'}, {'id': 'app35', 'name': 'Aplicación 35', 'icon': 'notas.png'}, {'id': 'app36', 'name': 'Aplicación 36', 'icon': 'galeria.png'}, {'id': 'app37', 'name': 'Aplicación 37', 'icon': 'telefono.png'}, {'id': 'app38', 'name': 'Aplicación 38', 'icon': 'telefono.png'}, {'id': 'app39', 'name': 'Aplicación 39', 'icon': 'galeria.png'}, {'id': 'app40', 'name': 'Aplicación 40', 'icon': 'notas.png'}, {'id': 'app41', 'name': 'Aplicación 41', 'icon': 'telefono.png'}, {'id': 'app42', 'name': 'Aplicación 42', 'icon': 'galeria.png'}, {'id': 'app43', 'name': 'Aplicación 43', 'icon': 'telefono.png'}, {'id': 'app44', 'name': 'Aplicación 44', 'icon': 'telefono.png'}, {'id': 'app45', 'name': 'Aplicación 45', 'icon': 'notas.png'}, {'id': 'app46', 'name': 'Aplicación 46', 'icon': 'telefono.png'}, {'id': 'app47', 'name': 'Aplicación 47', 'icon': 'telefono.png'}, {'id': 'app48', 'name': 'Aplicación 48', 'icon': 'galeria.png'}, {'id': 'app49', 'name': 'Aplicación 49', 'icon': 'telefono.png'}, {'id': 'app50', 'name': 'Aplicación 50', 'icon': 'notas.png'}, {'id': 'app51', 'name': 'Aplicación 51', 'icon': 'galeria.png'}, {'id': 'app52', 'name': 'Aplicación 52', 'icon': 'telefono.png'}, {'id': 'app53', 'name': 'Aplicación 53', 'icon': 'telefono.png'}, {'id': 'app54', 'name': 'Aplicación 54', 'icon': 'galeria.png'}, {'id': 'app55', 'name': 'Aplicación 55', 'icon': 'notas.png'}, {'id': 'app56', 'name': 'Aplicación 56', 'icon': 'telefono.png'}, {'id': 'app57', 'name': 'Aplicación 57', 'icon': 'galeria.png'}, {'id': 'app58', 'name': 'Aplicación 58', 'icon': 'telefono.png'}, {'id': 'app59', 'name': 'Aplicación 59', 'icon': 'telefono.png'}, {'id': 'app60', 'name': 'Aplicación 60', 'icon': 'notas.png'}, {'id': 'app61', 'name': 'Aplicación 61', 'icon': 'telefono.png'}, {'id': 'app62', 'name': 'Aplicación 62', 'icon': 'telefono.png'}, {'id': 'app63', 'name': 'Aplicación 63', 'icon': 'galeria.png'}, {'id': 'app64', 'name': 'Aplicación 64', 'icon': 'telefono.png'}, {'id': 'app65', 'name': 'Aplicación 65', 'icon': 'notas.png'}, {'id': 'app66', 'name': 'Aplicación 66', 'icon': 'galeria.png'}, {'id': 'app67', 'name': 'Aplicación 67', 'icon': 'telefono.png'}, {'id': 'app68', 'name': 'Aplicación 68', 'icon': 'telefono.png'}, {'id': 'app69', 'name': 'Aplicación 69', 'icon': 'galeria.png'}, {'id': 'app70', 'name': 'Aplicación 70', 'icon': 'notas.png'}, {'id': 'app71', 'name': 'Aplicación 71', 'icon': 'telefono.png'}, {'id': 'app72', 'name': 'Aplicación 72', 'icon': 'galeria.png'}, {'id': 'app73', 'name': 'Aplicación 73', 'icon': 'telefono.png'}, {'id': 'app74', 'name': 'Aplicación 74', 'icon': 'telefono.png'}, {'id': 'app75', 'name': 'Aplicación 75', 'icon': 'notas.png'}, {'id': 'app76', 'name': 'Aplicación 76', 'icon': 'telefono.png'}, {'id': 'app77', 'name': 'Aplicación 77', 'icon': 'telefono.png'}, {'id': 'app78', 'name': 'Aplicación 78', 'icon': 'galeria.png'}, {'id': 'app79', 'name': 'Aplicación 79', 'icon': 'telefono.png'}, {'id': 'app80', 'name': 'Aplicación 80', 'icon': 'notas.png'}, {'id': 'app81', 'name': 'Aplicación 81', 'icon': 'galeria.png'}, {'id': 'app82', 'name': 'Aplicación 82', 'icon': 'telefono.png'}, {'id': 'app83', 'name': 'Aplicación 83', 'icon': 'telefono.png'}, {'id': 'app84', 'name': 'Aplicación 84', 'icon': 'galeria.png'}, {'id': 'app85', 'name': 'Aplicación 85', 'icon': 'notas.png'}, {'id': 'app86', 'name': 'Aplicación 86', 'icon': 'telefono.png'}, {'id': 'app87', 'name': 'Aplicación 87', 'icon': 'galeria.png'}, {'id': 'app88', 'name': 'Aplicación 88', 'icon': 'telefono.png'}, {'id': 'app89', 'name': 'Aplicación 89', 'icon': 'telefono.png'}, {'id': 'app90', 'name': 'Aplicación 90', 'icon': 'notas.png'}, {'id': 'app91', 'name': 'Aplicación 91', 'icon': 'telefono.png'}, {'id': 'app92', 'name': 'Aplicación 92', 'icon': 'telefono.png'}, {'id': 'app93', 'name': 'Aplicación 93', 'icon': 'galeria.png'}, {'id': 'app94', 'name': 'Aplicación 94', 'icon': 'telefono.png'}, {'id': 'app95', 'name': 'Aplicación 95', 'icon': 'notas.png'}, {'id': 'app96', 'name': 'Aplicación 96', 'icon': 'galeria.png'}, {'id': 'app97', 'name': 'Aplicación 97', 'icon': 'telefono.png'}, {'id': 'app98', 'name': 'Aplicación 98', 'icon': 'telefono.png'}, {'id': 'app99', 'name': 'Aplicación 99', 'icon': 'galeria.png'}, {'id': 'app100', 'name': 'Aplicación 100', 'icon': 'notas.png'}, {'id': 'app101', 'name': 'Aplicación 101', 'icon': 'telefono.png'}, {'id': 'app102', 'name': 'Aplicación 102', 'icon': 'galeria.png'}, {'id': 'app103', 'name': 'Aplicación 103', 'icon': 'telefono.png'}, {'id': 'app104', 'name': 'Aplicación 104', 'icon': 'telefono.png'}, {'id': 'app105', 'name': 'Aplicación 105', 'icon': 'notas.png'}, {'id': 'app106', 'name': 'Aplicación 106', 'icon': 'telefono.png'}, {'id': 'app107', 'name': 'Aplicación 107', 'icon': 'telefono.png'}, {'id': 'app108', 'name': 'Aplicación 108', 'icon': 'galeria.png'}, {'id': 'app109', 'name': 'Aplicación 109', 'icon': 'telefono.png'}, {'id': 'app110', 'name': 'Aplicación 110', 'icon': 'notas.png'}, {'id': 'app111', 'name': 'Aplicación 111', 'icon': 'galeria.png'}, {'id': 'app112', 'name': 'Aplicación 112', 'icon': 'telefono.png'}, {'id': 'app113', 'name': 'Aplicación 113', 'icon': 'telefono.png'}, {'id': 'app114', 'name': 'Aplicación 114', 'icon': 'galeria.png'}, {'id': 'app115', 'name': 'Aplicación 115', 'icon': 'notas.png'}, {'id': 'app116', 'name': 'Aplicación 116', 'icon': 'telefono.png'}, {'id': 'app117', 'name': 'Aplicación 117', 'icon': 'galeria.png'}, {'id': 'app118', 'name': 'Aplicación 118', 'icon': 'telefono.png'}, {'id': 'app119', 'name': 'Aplicación 119', 'icon': 'telefono.png'}, {'id': 'app120', 'name': 'Aplicación 120', 'icon': 'notas.png'}];

function renderApps(){
  const row = document.getElementById('appsRow');
  row.innerHTML='';
  APPS.forEach(a=>{
    const b = document.createElement('button');
    b.className = 'app-tile';
    b.dataset.app = a.id;
    b.innerHTML = `<img src="${a.icon}" class="app-icon" alt="${a.name}"><span>${a.name}</span>`;
    row.appendChild(b);
  });
  applyIconStyle();
}
renderApps();


function applyIconStyle(){
  document.querySelectorAll('.app-icon, .dock-icon').forEach(img=>{
    if(SETTINGS.iconStyle === 'circle') img.style.borderRadius = '50%';
    else if(SETTINGS.iconStyle === 'rounded') img.style.borderRadius = '14px';
    else img.style.borderRadius = '6px';
    img.style.width = '72px'; img.style.height = '72px'; img.style.objectFit = 'contain';
  });
}
applyIconStyle();


const BOOT_MAX_MS = 8000;
function bootSequence(){
  const bootName = document.getElementById('bootName');
  const bootDots = document.getElementById('bootDots');
  try{
    setTimeout(()=> bootName.classList.remove('hidden'), 1800);
    setTimeout(()=>{ bootDots.classList.remove('hidden'); bootDots.querySelectorAll('span').forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*280)); }, 2200);
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
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(()=> bootSequence(), 150); });


// gestures - swipe up to unlock
(function(){
  const lock = document.getElementById('lock');
  let startY = 0;
  lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy > 60){ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(40); proceedToHome(); } }, {passive:true});
})();
function proceedToHome(){ const lock=document.getElementById('lock'); const home=document.getElementById('home'); lock.classList.add('hidden'); home.classList.remove('hidden'); }
document.addEventListener('click', e=>{ const btn = e.target.closest('.app-tile, .dock-btn'); if(!btn) return; const app = btn.dataset.app; if(!app) return; if(app==='configuracion'){ openConfig(); return; } openApp(app); });
function openApp(id){ const a = APPS.find(x=>x.id===id) || {name:id}; document.getElementById('appContent').innerHTML = `<div class='app-shell'><h2>${a.name}</h2><p>Contenido de ${a.name} (simulado, demo).</p></div>`; const win=document.getElementById('appWindow'); win.classList.remove('hidden'); win.classList.add('app-open'); if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20); setTimeout(()=> win.classList.remove('app-open'), 420); }
document.getElementById('appClose').addEventListener('click', ()=>{ const win=document.getElementById('appWindow'); win.classList.add('hidden'); document.getElementById('appContent').innerHTML = ''; });


function openConfig(){
  openApp('configuracion');
  const tpl = document.getElementById('configTpl').content.cloneNode(true);
  const appContent = document.getElementById('appContent');
  appContent.innerHTML='';
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
  document.getElementById('btnReboot').addEventListener('click', ()=>{ alert('Se reiniciará para aplicar'); setTimeout(()=> location.reload(), 600); });
}
function applyBackgrounds(){ const h = localStorage.getItem('vex_wall_home'); const l = localStorage.getItem('vex_wall_lock'); if(h) document.getElementById('home').style.backgroundImage = `url(${h})`; if(l) document.getElementById('lock').style.backgroundImage = `url(${l})`; }
applyBackgrounds();


function checkFileExists(path, cb){
  if(!path) return cb(false);
  const img = new Image(); let handled=false;
  img.onload = ()=>{ if(!handled){ handled=true; cb(true); } };
  img.onerror = ()=>{ if(!handled){ handled=true; cb(false); } };
  img.src = path;
  setTimeout(()=>{ if(!handled){ handled=true; cb(false); } }, 1200);
}
function verifyPlaceholders(){
  const required = ['telefono.png','galeria.png','mensajes.png','navegador.png','notas.png','config.png','bateria.png'];
  required.forEach(p=> checkFileExists(p, exists=>{ if(!exists){ const el=document.createElement('div'); el.className='error-box'; el.innerHTML = `⚠️ Falta <strong>${p}</strong>. Súbelo a la raíz para que el sistema lo detecte.`; document.body.appendChild(el); } } ));
}
document.addEventListener('DOMContentLoaded', ()=>{ verifyPlaceholders(); });

function helper_calc_0(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*0)%11; return s; }
function helper_calc_1(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*1)%11; return s; }
function helper_calc_2(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*2)%11; return s; }
function helper_calc_3(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*3)%11; return s; }
function helper_calc_4(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*4)%11; return s; }
function helper_calc_5(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*5)%11; return s; }
function helper_calc_6(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*6)%11; return s; }
function helper_calc_7(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*7)%11; return s; }
function helper_calc_8(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*8)%11; return s; }
function helper_calc_9(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*9)%11; return s; }
function helper_calc_10(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*10)%11; return s; }
function helper_calc_11(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*11)%11; return s; }
function helper_calc_12(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*12)%11; return s; }
function helper_calc_13(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*13)%11; return s; }
function helper_calc_14(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*14)%11; return s; }
function helper_calc_15(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*15)%11; return s; }
function helper_calc_16(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*16)%11; return s; }
function helper_calc_17(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*17)%11; return s; }
function helper_calc_18(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*18)%11; return s; }
function helper_calc_19(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*19)%11; return s; }
function helper_calc_20(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*20)%11; return s; }
function helper_calc_21(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*21)%11; return s; }
function helper_calc_22(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*22)%11; return s; }
function helper_calc_23(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*23)%11; return s; }
function helper_calc_24(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*24)%11; return s; }
function helper_calc_25(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*25)%11; return s; }
function helper_calc_26(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*26)%11; return s; }
function helper_calc_27(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*27)%11; return s; }
function helper_calc_28(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*28)%11; return s; }
function helper_calc_29(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*29)%11; return s; }
function helper_calc_30(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*30)%11; return s; }
function helper_calc_31(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*31)%11; return s; }
function helper_calc_32(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*32)%11; return s; }
function helper_calc_33(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*33)%11; return s; }
function helper_calc_34(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*34)%11; return s; }
function helper_calc_35(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*35)%11; return s; }
function helper_calc_36(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*36)%11; return s; }
function helper_calc_37(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*37)%11; return s; }
function helper_calc_38(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*38)%11; return s; }
function helper_calc_39(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*39)%11; return s; }
function helper_calc_40(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*40)%11; return s; }
function helper_calc_41(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*41)%11; return s; }
function helper_calc_42(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*42)%11; return s; }
function helper_calc_43(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*43)%11; return s; }
function helper_calc_44(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*44)%11; return s; }
function helper_calc_45(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*45)%11; return s; }
function helper_calc_46(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*46)%11; return s; }
function helper_calc_47(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*47)%11; return s; }
function helper_calc_48(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*48)%11; return s; }
function helper_calc_49(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*49)%11; return s; }
function helper_calc_50(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*50)%11; return s; }
function helper_calc_51(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*51)%11; return s; }
function helper_calc_52(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*52)%11; return s; }
function helper_calc_53(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*53)%11; return s; }
function helper_calc_54(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*54)%11; return s; }
function helper_calc_55(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*55)%11; return s; }
function helper_calc_56(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*56)%11; return s; }
function helper_calc_57(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*57)%11; return s; }
function helper_calc_58(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*58)%11; return s; }
function helper_calc_59(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*59)%11; return s; }
function helper_calc_60(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*60)%11; return s; }
function helper_calc_61(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*61)%11; return s; }
function helper_calc_62(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*62)%11; return s; }
function helper_calc_63(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*63)%11; return s; }
function helper_calc_64(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*64)%11; return s; }
function helper_calc_65(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*65)%11; return s; }
function helper_calc_66(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*66)%11; return s; }
function helper_calc_67(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*67)%11; return s; }
function helper_calc_68(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*68)%11; return s; }
function helper_calc_69(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*69)%11; return s; }
function helper_calc_70(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*70)%11; return s; }
function helper_calc_71(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*71)%11; return s; }
function helper_calc_72(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*72)%11; return s; }
function helper_calc_73(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*73)%11; return s; }
function helper_calc_74(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*74)%11; return s; }
function helper_calc_75(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*75)%11; return s; }
function helper_calc_76(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*76)%11; return s; }
function helper_calc_77(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*77)%11; return s; }
function helper_calc_78(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*78)%11; return s; }
function helper_calc_79(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*79)%11; return s; }
function helper_calc_80(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*80)%11; return s; }
function helper_calc_81(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*81)%11; return s; }
function helper_calc_82(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*82)%11; return s; }
function helper_calc_83(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*83)%11; return s; }
function helper_calc_84(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*84)%11; return s; }
function helper_calc_85(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*85)%11; return s; }
function helper_calc_86(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*86)%11; return s; }
function helper_calc_87(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*87)%11; return s; }
function helper_calc_88(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*88)%11; return s; }
function helper_calc_89(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*89)%11; return s; }
function helper_calc_90(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*90)%11; return s; }
function helper_calc_91(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*91)%11; return s; }
function helper_calc_92(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*92)%11; return s; }
function helper_calc_93(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*93)%11; return s; }
function helper_calc_94(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*94)%11; return s; }
function helper_calc_95(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*95)%11; return s; }
function helper_calc_96(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*96)%11; return s; }
function helper_calc_97(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*97)%11; return s; }
function helper_calc_98(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*98)%11; return s; }
function helper_calc_99(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*99)%11; return s; }
function helper_calc_100(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*100)%11; return s; }
function helper_calc_101(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*101)%11; return s; }
function helper_calc_102(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*102)%11; return s; }
function helper_calc_103(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*103)%11; return s; }
function helper_calc_104(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*104)%11; return s; }
function helper_calc_105(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*105)%11; return s; }
function helper_calc_106(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*106)%11; return s; }
function helper_calc_107(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*107)%11; return s; }
function helper_calc_108(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*108)%11; return s; }
function helper_calc_109(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*109)%11; return s; }
function helper_calc_110(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*110)%11; return s; }
function helper_calc_111(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*111)%11; return s; }
function helper_calc_112(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*112)%11; return s; }
function helper_calc_113(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*113)%11; return s; }
function helper_calc_114(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*114)%11; return s; }
function helper_calc_115(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*115)%11; return s; }
function helper_calc_116(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*116)%11; return s; }
function helper_calc_117(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*117)%11; return s; }
function helper_calc_118(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*118)%11; return s; }
function helper_calc_119(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*119)%11; return s; }
function helper_calc_120(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*120)%11; return s; }
function helper_calc_121(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*121)%11; return s; }
function helper_calc_122(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*122)%11; return s; }
function helper_calc_123(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*123)%11; return s; }
function helper_calc_124(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*124)%11; return s; }
function helper_calc_125(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*125)%11; return s; }
function helper_calc_126(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*126)%11; return s; }
function helper_calc_127(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*127)%11; return s; }
function helper_calc_128(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*128)%11; return s; }
function helper_calc_129(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*129)%11; return s; }
function helper_calc_130(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*130)%11; return s; }
function helper_calc_131(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*131)%11; return s; }
function helper_calc_132(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*132)%11; return s; }
function helper_calc_133(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*133)%11; return s; }
function helper_calc_134(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*134)%11; return s; }
function helper_calc_135(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*135)%11; return s; }
function helper_calc_136(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*136)%11; return s; }
function helper_calc_137(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*137)%11; return s; }
function helper_calc_138(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*138)%11; return s; }
function helper_calc_139(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*139)%11; return s; }
function helper_calc_140(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*140)%11; return s; }
function helper_calc_141(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*141)%11; return s; }
function helper_calc_142(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*142)%11; return s; }
function helper_calc_143(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*143)%11; return s; }
function helper_calc_144(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*144)%11; return s; }
function helper_calc_145(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*145)%11; return s; }
function helper_calc_146(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*146)%11; return s; }
function helper_calc_147(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*147)%11; return s; }
function helper_calc_148(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*148)%11; return s; }
function helper_calc_149(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*149)%11; return s; }
function helper_calc_150(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*150)%11; return s; }
function helper_calc_151(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*151)%11; return s; }
function helper_calc_152(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*152)%11; return s; }
function helper_calc_153(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*153)%11; return s; }
function helper_calc_154(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*154)%11; return s; }
function helper_calc_155(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*155)%11; return s; }
function helper_calc_156(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*156)%11; return s; }
function helper_calc_157(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*157)%11; return s; }
function helper_calc_158(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*158)%11; return s; }
function helper_calc_159(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*159)%11; return s; }
function helper_calc_160(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*160)%11; return s; }
function helper_calc_161(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*161)%11; return s; }
function helper_calc_162(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*162)%11; return s; }
function helper_calc_163(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*163)%11; return s; }
function helper_calc_164(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*164)%11; return s; }
function helper_calc_165(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*165)%11; return s; }
function helper_calc_166(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*166)%11; return s; }
function helper_calc_167(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*167)%11; return s; }
function helper_calc_168(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*168)%11; return s; }
function helper_calc_169(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*169)%11; return s; }
function helper_calc_170(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*170)%11; return s; }
function helper_calc_171(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*171)%11; return s; }
function helper_calc_172(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*172)%11; return s; }
function helper_calc_173(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*173)%11; return s; }
function helper_calc_174(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*174)%11; return s; }
function helper_calc_175(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*175)%11; return s; }
function helper_calc_176(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*176)%11; return s; }
function helper_calc_177(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*177)%11; return s; }
function helper_calc_178(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*178)%11; return s; }
function helper_calc_179(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*179)%11; return s; }
function helper_calc_180(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*180)%11; return s; }
function helper_calc_181(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*181)%11; return s; }
function helper_calc_182(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*182)%11; return s; }
function helper_calc_183(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*183)%11; return s; }
function helper_calc_184(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*184)%11; return s; }
function helper_calc_185(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*185)%11; return s; }
function helper_calc_186(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*186)%11; return s; }
function helper_calc_187(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*187)%11; return s; }
function helper_calc_188(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*188)%11; return s; }
function helper_calc_189(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*189)%11; return s; }
function helper_calc_190(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*190)%11; return s; }
function helper_calc_191(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*191)%11; return s; }
function helper_calc_192(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*192)%11; return s; }
function helper_calc_193(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*193)%11; return s; }
function helper_calc_194(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*194)%11; return s; }
function helper_calc_195(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*195)%11; return s; }
function helper_calc_196(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*196)%11; return s; }
function helper_calc_197(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*197)%11; return s; }
function helper_calc_198(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*198)%11; return s; }
function helper_calc_199(n){ let s=0; for(let k=0;k<Math.min(300,n);k++) s += (k*199)%11; return s; }