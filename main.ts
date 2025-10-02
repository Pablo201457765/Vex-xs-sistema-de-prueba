// TypeScript demo (mirrors main.js behaviour)
// Para compilar usar tsc si querés; aquí está de ejemplo.
declare var VXSWebGL: any;

const root = document.getElementById('webglRoot') as HTMLElement;
const overlay = document.getElementById('bootOverlay') as HTMLElement;
const dots = [document.getElementById('d1') as HTMLElement, document.getElementById('d2') as HTMLElement, document.getElementById('d3') as HTMLElement];
const lock = document.getElementById('lockScreen') as HTMLElement;
const boot = document.getElementById('bootScreen') as HTMLElement;

const webglInst = VXSWebGL.start(root);

let idx = 0;
const dotTimer = setInterval(()=>{
  dots.forEach(d=>{ d.style.background = '#333'; d.style.boxShadow = 'none'; });
  dots[idx].style.background = '#0ff';
  dots[idx].style.boxShadow = '0 0 12px #0ff';
  idx = (idx+1)%dots.length;
},450);

setTimeout(()=>{
  clearInterval(dotTimer);
  overlay.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  overlay.style.transform = 'scale(20)';
  overlay.style.opacity = '0';
  setTimeout(()=>{
    if(webglInst && webglInst.dispose) webglInst.dispose();
    boot.classList.add('hidden');
    lock.classList.remove('hidden');
    overlay.style.transform='scale(1)';
    overlay.style.opacity='1';
  },700);
},5000);

document.getElementById('unlockBtn')!.addEventListener('click', ()=>{ alert('Desbloqueado (demo)'); });