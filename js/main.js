(function(){
const boot = document.getElementById('boot');
const lock = document.getElementById('lock');
const home = document.getElementById('home');
const appWindow = document.getElementById('appWindow');
const appContent = document.getElementById('appContent');
const appClose = document.getElementById('appClose');
const bootAudio = document.getElementById('bootAudio');
const SETTINGS_KEY='vxs_settings_v2'; let SETTINGS=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'); if(typeof SETTINGS.vibration==='undefined') SETTINGS.vibration=true; if(typeof SETTINGS.iconStyle==='undefined') SETTINGS.iconStyle='circle';
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }
function nowStr(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function tick(){ document.querySelectorAll('#lockTime,#homeHour').forEach(el=>{ if(el) el.textContent=nowStr(); }); const ld=document.getElementById('lockDate'); if(ld) ld.textContent=dateStr(); }
setInterval(tick,1000); tick();
// theme auto (simple)
(function(){ const h=new Date().getHours(); if(h>=7 && h<19) document.body.classList.remove('light'); else document.body.classList.add('light'); })();
// boot seq 20s
(function(){ setTimeout(()=> document.getElementById('bootTitle').classList.remove('hidden'),5000); setTimeout(()=>{ const dots=document.getElementById('bootDots'); dots.classList.remove('hidden'); dots.querySelectorAll('span').forEach((s,i)=> setTimeout(()=> s.style.opacity=1, i*450)); },6000); try{ bootAudio.currentTime=0; bootAudio.play().catch(()=>{}); }catch(e){} setTimeout(()=>{ boot.classList.add('hidden'); lock.classList.remove('hidden'); },20000); })();
// apply backgrounds
(function(){ const h=localStorage.getItem('vxs_wall_home'); const l=localStorage.getItem('vxs_wall_lock'); if(h){ home.classList.add('backgrounded'); home.style.backgroundImage='url('+h+')'; } if(l){ lock.classList.add('backgrounded'); lock.style.backgroundImage='url('+l+')'; } })();
// gestures unlock
let sy=0; lock.addEventListener('touchstart', e=>{ sy=e.touches[0].clientY; },{passive:true}); lock.addEventListener('touchend', e=>{ const dy=sy - e.changedTouches[0].clientY; if(dy>60){ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(40); lock.classList.add('hidden'); home.classList.remove('hidden'); } },{passive:true});
// open app
document.addEventListener('click', e=>{ const btn=e.target.closest('.app'); if(!btn) return; const name=btn.dataset.app; openApp(name); });
function openApp(name){ renderAppContent(name); appWindow.classList.remove('hidden'); appWindow.classList.add('app-open'); if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20); new Audio('assets/sounds/open.mp3').play().catch(()=>{}); setTimeout(()=> appWindow.classList.remove('app-open'),500); }
appClose.addEventListener('click', ()=>{ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20); new Audio('assets/sounds/close.mp3').play().catch(()=>{}); appWindow.classList.add('hidden'); appContent.innerHTML=''; });
function applyIconStyle(){ document.querySelectorAll('.app-icon').forEach(img=>{ if(SETTINGS.iconStyle==='circle') img.style.borderRadius='50%'; else if(SETTINGS.iconStyle==='rounded') img.style.borderRadius='14px'; else img.style.borderRadius='6px'; }); }
applyIconStyle();
window.VXS={SETTINGS,saveSettings,applyIconStyle,applySavedBackgrounds:function(){ const h=localStorage.getItem('vxs_wall_home'); const l=localStorage.getItem('vxs_wall_lock'); if(h){ home.classList.add('backgrounded'); home.style.backgroundImage='url('+h+')'; } if(l){ lock.classList.add('backgrounded'); lock.style.backgroundImage='url('+l+')'; } }, reboot:()=>location.reload() }; })();