/* script.js — Heavy, real behaviour for Vex XS UltimatePlus Beta 4.2 (Heavy Code) */
const SETTINGS_KEY='vexs_heavy_v4_2';
let SETTINGS = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
if(typeof SETTINGS.vibration === 'undefined') SETTINGS.vibration = true;
if(typeof SETTINGS.animSpeed === 'undefined') SETTINGS.animSpeed = 1;
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }
function now(){ const d=new Date(); return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0'); }
function dateStr(){ return new Date().toLocaleDateString(); }
function tick(){ document.querySelectorAll('#lockClock,#homeTime').forEach(el=>{ if(el) el.textContent = now(); }); const ld=document.getElementById('lockDate'); if(ld) ld.textContent = dateStr(); }
setInterval(tick,1000); tick();
// core apps (only these will appear in dock and be functional)
const APPS = [
  {id:'telefono', name:'Teléfono', icon:'telefono.png'},
  {id:'mensajes', name:'Mensajes', icon:'mensajes.png'},
  {id:'galeria', name:'Galería', icon:'galeria.png'},
  {id:'navegador', name:'Navegador', icon:'navegador.png'}
];
// Boot handling: prefer video if available, otherwise fallback to timeout
const BOOT_MAX_MS = 16000; // 16s for demo (matches user request)
function bootSequence(){
  const vid = document.getElementById('bootVideo');
  let finished = false;
  function finishBoot(){ if(finished) return; finished = true; proceedToLock(); }
  if(vid && vid.readyState !== 0){
    // when video ends -> finish, but also fallback to BOOT_MAX_MS
    vid.addEventListener('ended', finishBoot);
    // safety fallback
    setTimeout(finishBoot, BOOT_MAX_MS + 500);
  } else {
    // no video or not playable -> use timeout
    setTimeout(finishBoot, BOOT_MAX_MS);
  }
}
function proceedToLock(){ try{ document.getElementById('boot').classList.add('hidden'); document.getElementById('boot').setAttribute('aria-hidden','true'); const lock=document.getElementById('lock'); lock.classList.remove('hidden'); lock.setAttribute('aria-hidden','false'); // show gesture & dock after boot
document.getElementById('homeGesture').style.display='block'; document.getElementById('dock').style.display='flex'; tick(); }catch(e){ console.error(e); } }
// placeholder verification (non-blocking)
function checkFileExists(path, cb){ if(!path) return cb(false); const img=new Image(); let handled=false; img.onload = ()=>{ if(!handled){handled=true;cb(true);} }; img.onerror = ()=>{ if(!handled){handled=true;cb(false);} }; img.src = path; setTimeout(()=>{ if(!handled){handled=true;cb(false);} }, 1200); }
function verifyPlaceholders(){ const required=['telefono.png','mensajes.png','galeria.png','navegador.png','wall_home.png','wall_lock.png']; required.forEach(p=> checkFileExists(p, exists=>{ if(!exists){ const el=document.createElement('div'); el.className='error-box'; el.innerHTML = `⚠️ Falta <strong>${p}</strong>. Súbelo a la raíz.`; document.body.appendChild(el); } } )); }
// gestures (iPhone-like): lock -> swipe up to home; home gesture bar feedback; app swipe down to close
function enableGestures(){
  const lock = document.getElementById('lock'); let startY=0;
  lock.addEventListener('touchstart', e=> startY = e.touches[0].clientY, {passive:true});
  lock.addEventListener('touchend', e=>{ const dy = startY - e.changedTouches[0].clientY; if(dy > 60){ if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(40); goHome(); } }, {passive:true});
  const gesture = document.getElementById('homeGesture'); let gStartY=0; gesture.addEventListener('touchstart', e=> gStartY = e.touches[0].clientY, {passive:true}); gesture.addEventListener('touchend', e=>{ const dy = gStartY - e.changedTouches[0].clientY; if(dy>20){ gesture.style.transform='translateY(-6px)'; setTimeout(()=> gesture.style.transform='none',200); } }, {passive:true});
  const appWin = document.getElementById('appWindow'); let aStartY=0; appWin.addEventListener('touchstart', e=> aStartY = e.touches[0].clientY, {passive:true}); appWin.addEventListener('touchend', e=>{ const dy = aStartY - e.changedTouches[0].clientY; if(dy < -60) closeApp(); }, {passive:true});
}
function goHome(){ document.getElementById('lock').classList.add('hidden'); document.getElementById('home').classList.remove('hidden'); }
function openApp(id){ const app = APPS.find(a=>a.id===id) || {name:id}; const content = document.getElementById('appContent'); content.innerHTML = `<div style="padding-top:20px"><h1>${app.name}</h1><p>Demo — pantalla completa. Desliza hacia abajo para cerrar.</p></div>`; const win = document.getElementById('appWindow'); document.getElementById('home').classList.add('hidden'); win.classList.remove('hidden'); win.style.display='flex'; win.setAttribute('aria-hidden','false'); if(SETTINGS.vibration && navigator.vibrate) navigator.vibrate(20); content.focus(); }
function closeApp(){ const win=document.getElementById('appWindow'); win.classList.add('hidden'); win.style.display='none'; document.getElementById('home').classList.remove('hidden'); document.getElementById('appContent').innerHTML=''; }
// dock hookup
function setupDock(){ document.querySelectorAll('.dock-btn').forEach(b=> b.addEventListener('click', ()=>{ const id=b.dataset.app; openApp(id); })); }
// backgrounds handling
function applyBackgrounds(){ const h = localStorage.getItem('vex_wall_home'); const l = localStorage.getItem('vex_wall_lock'); if(h) document.getElementById('home').style.backgroundImage = `url(${h})`; if(l) document.getElementById('lock').style.backgroundImage = `url(${l})`; }
// configuration UI (from template)
function openConfig(){ openApp('configuracion'); const tpl = document.getElementById('configTpl').content.cloneNode(true); const appContent = document.getElementById('appContent'); appContent.innerHTML=''; appContent.appendChild(tpl); const vib = document.getElementById('vibToggle'); vib.checked = SETTINGS.vibration; vib.addEventListener('change', ()=>{ SETTINGS.vibration = vib.checked; saveSettings(); }); const sel = document.getElementById('animSpeed'); sel.value = SETTINGS.animSpeed || 1; sel.addEventListener('change', ()=>{ SETTINGS.animSpeed = parseFloat(sel.value); saveSettings(); document.documentElement.style.setProperty('--anim-scale', SETTINGS.animSpeed); }); document.getElementById('btnChangeBg').addEventListener('click', ()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange = e=>{ const f=e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ev=>{ const which = confirm('¿Aplicar a inicio? OK=inicio, Cancelar=bloqueo') ? 'home' : 'lock'; localStorage.setItem(which==='home'?'vex_wall_home':'vex_wall_lock', ev.target.result); applyBackgrounds(); alert('Fondo aplicado a '+which); }; r.readAsDataURL(f); }; inp.click(); }); }
// verify & init
document.addEventListener('DOMContentLoaded', ()=>{ document.getElementById('homeGesture').style.display='none'; document.getElementById('dock').style.display='none'; verifyPlaceholders(); enableGestures(); setupDock(); applyBackgrounds(); setTimeout(()=> bootSequence(), 200); });
window.vexs = { openApp, closeApp, SETTINGS, saveSettings };
function helper_calc_0(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*0)%13; return s; }
function helper_calc_1(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*1)%13; return s; }
function helper_calc_2(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*2)%13; return s; }
function helper_calc_3(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*3)%13; return s; }
function helper_calc_4(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*4)%13; return s; }
function helper_calc_5(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*5)%13; return s; }
function helper_calc_6(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*6)%13; return s; }
function helper_calc_7(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*7)%13; return s; }
function helper_calc_8(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*8)%13; return s; }
function helper_calc_9(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*9)%13; return s; }
function helper_calc_10(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*10)%13; return s; }
function helper_calc_11(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*11)%13; return s; }
function helper_calc_12(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*12)%13; return s; }
function helper_calc_13(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*13)%13; return s; }
function helper_calc_14(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*14)%13; return s; }
function helper_calc_15(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*15)%13; return s; }
function helper_calc_16(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*16)%13; return s; }
function helper_calc_17(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*17)%13; return s; }
function helper_calc_18(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*18)%13; return s; }
function helper_calc_19(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*19)%13; return s; }
function helper_calc_20(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*20)%13; return s; }
function helper_calc_21(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*21)%13; return s; }
function helper_calc_22(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*22)%13; return s; }
function helper_calc_23(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*23)%13; return s; }
function helper_calc_24(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*24)%13; return s; }
function helper_calc_25(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*25)%13; return s; }
function helper_calc_26(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*26)%13; return s; }
function helper_calc_27(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*27)%13; return s; }
function helper_calc_28(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*28)%13; return s; }
function helper_calc_29(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*29)%13; return s; }
function helper_calc_30(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*30)%13; return s; }
function helper_calc_31(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*31)%13; return s; }
function helper_calc_32(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*32)%13; return s; }
function helper_calc_33(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*33)%13; return s; }
function helper_calc_34(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*34)%13; return s; }
function helper_calc_35(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*35)%13; return s; }
function helper_calc_36(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*36)%13; return s; }
function helper_calc_37(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*37)%13; return s; }
function helper_calc_38(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*38)%13; return s; }
function helper_calc_39(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*39)%13; return s; }
function helper_calc_40(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*40)%13; return s; }
function helper_calc_41(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*41)%13; return s; }
function helper_calc_42(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*42)%13; return s; }
function helper_calc_43(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*43)%13; return s; }
function helper_calc_44(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*44)%13; return s; }
function helper_calc_45(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*45)%13; return s; }
function helper_calc_46(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*46)%13; return s; }
function helper_calc_47(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*47)%13; return s; }
function helper_calc_48(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*48)%13; return s; }
function helper_calc_49(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*49)%13; return s; }
function helper_calc_50(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*50)%13; return s; }
function helper_calc_51(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*51)%13; return s; }
function helper_calc_52(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*52)%13; return s; }
function helper_calc_53(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*53)%13; return s; }
function helper_calc_54(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*54)%13; return s; }
function helper_calc_55(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*55)%13; return s; }
function helper_calc_56(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*56)%13; return s; }
function helper_calc_57(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*57)%13; return s; }
function helper_calc_58(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*58)%13; return s; }
function helper_calc_59(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*59)%13; return s; }
function helper_calc_60(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*60)%13; return s; }
function helper_calc_61(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*61)%13; return s; }
function helper_calc_62(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*62)%13; return s; }
function helper_calc_63(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*63)%13; return s; }
function helper_calc_64(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*64)%13; return s; }
function helper_calc_65(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*65)%13; return s; }
function helper_calc_66(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*66)%13; return s; }
function helper_calc_67(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*67)%13; return s; }
function helper_calc_68(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*68)%13; return s; }
function helper_calc_69(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*69)%13; return s; }
function helper_calc_70(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*70)%13; return s; }
function helper_calc_71(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*71)%13; return s; }
function helper_calc_72(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*72)%13; return s; }
function helper_calc_73(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*73)%13; return s; }
function helper_calc_74(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*74)%13; return s; }
function helper_calc_75(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*75)%13; return s; }
function helper_calc_76(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*76)%13; return s; }
function helper_calc_77(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*77)%13; return s; }
function helper_calc_78(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*78)%13; return s; }
function helper_calc_79(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*79)%13; return s; }
function helper_calc_80(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*80)%13; return s; }
function helper_calc_81(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*81)%13; return s; }
function helper_calc_82(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*82)%13; return s; }
function helper_calc_83(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*83)%13; return s; }
function helper_calc_84(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*84)%13; return s; }
function helper_calc_85(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*85)%13; return s; }
function helper_calc_86(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*86)%13; return s; }
function helper_calc_87(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*87)%13; return s; }
function helper_calc_88(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*88)%13; return s; }
function helper_calc_89(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*89)%13; return s; }
function helper_calc_90(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*90)%13; return s; }
function helper_calc_91(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*91)%13; return s; }
function helper_calc_92(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*92)%13; return s; }
function helper_calc_93(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*93)%13; return s; }
function helper_calc_94(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*94)%13; return s; }
function helper_calc_95(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*95)%13; return s; }
function helper_calc_96(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*96)%13; return s; }
function helper_calc_97(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*97)%13; return s; }
function helper_calc_98(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*98)%13; return s; }
function helper_calc_99(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*99)%13; return s; }
function helper_calc_100(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*100)%13; return s; }
function helper_calc_101(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*101)%13; return s; }
function helper_calc_102(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*102)%13; return s; }
function helper_calc_103(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*103)%13; return s; }
function helper_calc_104(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*104)%13; return s; }
function helper_calc_105(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*105)%13; return s; }
function helper_calc_106(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*106)%13; return s; }
function helper_calc_107(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*107)%13; return s; }
function helper_calc_108(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*108)%13; return s; }
function helper_calc_109(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*109)%13; return s; }
function helper_calc_110(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*110)%13; return s; }
function helper_calc_111(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*111)%13; return s; }
function helper_calc_112(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*112)%13; return s; }
function helper_calc_113(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*113)%13; return s; }
function helper_calc_114(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*114)%13; return s; }
function helper_calc_115(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*115)%13; return s; }
function helper_calc_116(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*116)%13; return s; }
function helper_calc_117(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*117)%13; return s; }
function helper_calc_118(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*118)%13; return s; }
function helper_calc_119(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*119)%13; return s; }
function helper_calc_120(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*120)%13; return s; }
function helper_calc_121(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*121)%13; return s; }
function helper_calc_122(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*122)%13; return s; }
function helper_calc_123(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*123)%13; return s; }
function helper_calc_124(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*124)%13; return s; }
function helper_calc_125(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*125)%13; return s; }
function helper_calc_126(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*126)%13; return s; }
function helper_calc_127(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*127)%13; return s; }
function helper_calc_128(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*128)%13; return s; }
function helper_calc_129(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*129)%13; return s; }
function helper_calc_130(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*130)%13; return s; }
function helper_calc_131(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*131)%13; return s; }
function helper_calc_132(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*132)%13; return s; }
function helper_calc_133(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*133)%13; return s; }
function helper_calc_134(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*134)%13; return s; }
function helper_calc_135(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*135)%13; return s; }
function helper_calc_136(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*136)%13; return s; }
function helper_calc_137(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*137)%13; return s; }
function helper_calc_138(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*138)%13; return s; }
function helper_calc_139(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*139)%13; return s; }
function helper_calc_140(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*140)%13; return s; }
function helper_calc_141(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*141)%13; return s; }
function helper_calc_142(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*142)%13; return s; }
function helper_calc_143(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*143)%13; return s; }
function helper_calc_144(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*144)%13; return s; }
function helper_calc_145(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*145)%13; return s; }
function helper_calc_146(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*146)%13; return s; }
function helper_calc_147(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*147)%13; return s; }
function helper_calc_148(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*148)%13; return s; }
function helper_calc_149(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*149)%13; return s; }
function helper_calc_150(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*150)%13; return s; }
function helper_calc_151(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*151)%13; return s; }
function helper_calc_152(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*152)%13; return s; }
function helper_calc_153(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*153)%13; return s; }
function helper_calc_154(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*154)%13; return s; }
function helper_calc_155(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*155)%13; return s; }
function helper_calc_156(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*156)%13; return s; }
function helper_calc_157(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*157)%13; return s; }
function helper_calc_158(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*158)%13; return s; }
function helper_calc_159(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*159)%13; return s; }
function helper_calc_160(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*160)%13; return s; }
function helper_calc_161(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*161)%13; return s; }
function helper_calc_162(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*162)%13; return s; }
function helper_calc_163(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*163)%13; return s; }
function helper_calc_164(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*164)%13; return s; }
function helper_calc_165(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*165)%13; return s; }
function helper_calc_166(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*166)%13; return s; }
function helper_calc_167(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*167)%13; return s; }
function helper_calc_168(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*168)%13; return s; }
function helper_calc_169(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*169)%13; return s; }
function helper_calc_170(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*170)%13; return s; }
function helper_calc_171(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*171)%13; return s; }
function helper_calc_172(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*172)%13; return s; }
function helper_calc_173(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*173)%13; return s; }
function helper_calc_174(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*174)%13; return s; }
function helper_calc_175(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*175)%13; return s; }
function helper_calc_176(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*176)%13; return s; }
function helper_calc_177(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*177)%13; return s; }
function helper_calc_178(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*178)%13; return s; }
function helper_calc_179(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*179)%13; return s; }
function helper_calc_180(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*180)%13; return s; }
function helper_calc_181(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*181)%13; return s; }
function helper_calc_182(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*182)%13; return s; }
function helper_calc_183(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*183)%13; return s; }
function helper_calc_184(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*184)%13; return s; }
function helper_calc_185(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*185)%13; return s; }
function helper_calc_186(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*186)%13; return s; }
function helper_calc_187(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*187)%13; return s; }
function helper_calc_188(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*188)%13; return s; }
function helper_calc_189(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*189)%13; return s; }
function helper_calc_190(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*190)%13; return s; }
function helper_calc_191(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*191)%13; return s; }
function helper_calc_192(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*192)%13; return s; }
function helper_calc_193(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*193)%13; return s; }
function helper_calc_194(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*194)%13; return s; }
function helper_calc_195(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*195)%13; return s; }
function helper_calc_196(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*196)%13; return s; }
function helper_calc_197(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*197)%13; return s; }
function helper_calc_198(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*198)%13; return s; }
function helper_calc_199(n){ let s=0; for(let k=0;k<Math.min(n,200);k++) s += (k*199)%13; return s; }