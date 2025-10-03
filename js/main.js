// main runtime for PrimeOS demo (vanilla JS)
// handles boot animation -> lock -> home transitions, gestures, and simple app open/close animations

(function(){
  const bootScreen = document.getElementById('boot-screen');
  const lockScreen = document.getElementById('lock-screen');
  const homeScreen = document.getElementById('home-screen');
  const appOverlay = document.getElementById('app-overlay');
  const appShell = document.getElementById('app-shell');
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  const grid = document.getElementById('grid');
  const favbar = document.getElementById('favbar');
  const appContent = document.getElementById('app-content');
  const appTitle = document.getElementById('app-title');
  const backBtn = document.getElementById('back-btn');
  const gestureBar = document.querySelector('.gesture-bar');

  const apps = [
    {id:'phone', name:'Teléfono', icon:'assets/icons/phone.png'},
    {id:'messages', name:'Mensajes', icon:'assets/icons/messages.png'},
    {id:'gallery', name:'Galería', icon:'assets/icons/gallery.png'},
    {id:'browser', name:'Navegador', icon:'assets/icons/browser.png'}
  ];

  function buildGrid(){
    grid.innerHTML='';
    apps.forEach(app=>{
      const el = document.createElement('button');
      el.className='app-card';
      el.dataset.app = app.id;
      el.innerHTML = '<img src="'+app.icon+'"><span>'+app.name+'</span>';
      el.addEventListener('click', onOpenApp);
      grid.appendChild(el);
    });
  }

  function onOpenApp(e){
    const btn = e.currentTarget;
    const appId = btn.dataset.app;
    const name = apps.find(a=>a.id===appId)?.name || appId;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    appOverlay.classList.remove('hidden');
    appShell.style.transformOrigin = ((cx/window.innerWidth)*100)+'% '+((cy/window.innerHeight)*100)+'%';
    appShell.style.transform = 'scale(.2)';
    appTitle.textContent = name;
    appContent.innerHTML = '<p>Cargando '+name+'...</p>';
    requestAnimationFrame(()=>{
      appShell.style.transition = 'transform 420ms cubic-bezier(.22,.9,.32,1)';
      appShell.style.transform = 'scale(1)';
      setTimeout(()=>{ appShell.style.transition = ''; },480);
    });
  }

  backBtn.addEventListener('click', closeApp);
  function closeApp(){
    appShell.style.transition = 'transform 360ms ease-in-out';
    appShell.style.transform = 'scale(.2)';
    setTimeout(()=>{ appOverlay.classList.add('hidden'); appShell.style.transition=''; },380);
  }

  function startBootSequence(){
    const BOOT_TIME = 4500;
    if(window.startWebGLBoot && typeof window.startWebGLBoot==='function'){
      try{ window.startWebGLBoot(document.getElementById('boot-canvas')); }catch(e){console.warn(e); }
    }
    setTimeout(()=>{
      bootScreen.classList.remove('visible');
      lockScreen.classList.add('visible');
      updateClock();
      attachLockGestures();
    }, BOOT_TIME);
  }

  function updateClock(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    timeEl.textContent = hh+':'+mm;
    dateEl.textContent = now.toLocaleDateString();
  }

  function attachLockGestures(){
    let startY = null;
    let moved = false;
    lockScreen.addEventListener('touchstart', e=>{ startY = e.touches[0].clientY; moved=false; });
    lockScreen.addEventListener('touchmove', e=>{ if(startY===null) return; const y = e.touches[0].clientY; const dy = startY - y; if(dy>10) moved=true; lockScreen.style.transform = 'translateY('+Math.min(-dy,0)+'px)'; });
    lockScreen.addEventListener('touchend', e=>{ if(moved){ lockScreen.classList.remove('visible'); homeScreen.classList.add('visible'); lockScreen.style.transform=''; } else { lockScreen.style.transform=''; } startY=null; moved=false; });
    lockScreen.addEventListener('mousedown', e=>{
      startY = e.clientY; moved=false;
      const onMove = (ev)=>{ if(startY!==null){ if(startY-ev.clientY>10) moved=true; lockScreen.style.transform='translateY('+Math.min(-(startY-ev.clientY),0)+'px)'; }};
      const onUp = ()=>{ document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); if(moved){ lockScreen.classList.remove('visible'); homeScreen.classList.add('visible'); } lockScreen.style.transform=''; startY=null; };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function init(){
    buildGrid();
    document.querySelectorAll('#favbar .app-btn').forEach(b=>{ b.addEventListener('click', ()=>{ const appId = b.dataset.app; const card = document.querySelector('.app-card[data-app="'+appId+'"]'); if(card) card.click(); }); });
    appOverlay.addEventListener('click', (e)=>{ if(e.target===appOverlay) closeApp(); });
    startBootSequence();
    setInterval(updateClock, 60*1000);
  }

  window.addEventListener('DOMContentLoaded', init);
})();