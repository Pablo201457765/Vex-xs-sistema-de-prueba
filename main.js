(function(){
  var root = document.getElementById('webglRoot');
  var overlay = document.getElementById('bootOverlay');
  var fullName = document.getElementById('fullName');
  var dots = [document.getElementById('d1'),document.getElementById('d2'),document.getElementById('d3')];
  var lock = document.getElementById('lockScreen');
  var boot = document.getElementById('bootScreen');

  var webglInst = VXSWebGL.start(root);

  // animate dots sequentially
  var idx = 0;
  var dotTimer = setInterval(function(){
    dots.forEach(function(d,i){ d.style.background = '#333'; d.style.boxShadow = 'none'; });
    dots[idx].style.background = '#0ff';
    dots[idx].style.boxShadow = '0 0 12px #0ff';
    idx = (idx+1)%dots.length;
  },450);

  // after 5 seconds, expand and switch to lock screen
  setTimeout(function(){
    clearInterval(dotTimer);
    // flash and expand effect: scale overlay
    overlay.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    overlay.style.transform = 'scale(20)';
    overlay.style.opacity = '0';
    // stop webgl after a short delay
    setTimeout(function(){
      if(webglInst && webglInst.dispose) webglInst.dispose();
      boot.classList.add('hidden');
      lock.classList.remove('hidden');
      // reset overlay transform so next time it's normal (if any)
      overlay.style.transform='scale(1)';
      overlay.style.opacity='1';
    },700);
  },5000);

  document.getElementById('unlockBtn').addEventListener('click', function(){
    alert('Desbloqueado (demo)');
  });
})();