// Pantalla de Bloqueo (Lock Screen)

let lockTouchStartY = 0;
let lockTouchCurrentY = 0;

function showLockScreen() {
    const lockScreen = document.getElementById('lockScreen');
    
    if (!lockScreen) return;
    
    lockScreen.classList.add('active');
    VexOS.currentScreen = 'lock';
    
    console.log('Pantalla de bloqueo mostrada');
    
    // Inicializar gestos de desbloqueo
    initLockScreenGestures();
}

function initLockScreenGestures() {
    const lockScreen = document.getElementById('lockScreen');
    
    if (!lockScreen) return;
    
    // Touch events para desbloqueo
    lockScreen.addEventListener('touchstart', handleLockTouchStart, { passive: true });
    lockScreen.addEventListener('touchmove', handleLockTouchMove, { passive: false });
    lockScreen.addEventListener('touchend', handleLockTouchEnd, { passive: true });
    
    // Click para desbloqueo (computadora)
    lockScreen.addEventListener('click', (e) => {
        if (e.target.closest('.lock-unlock')) {
            unlockScreen();
        }
    });
}

function handleLockTouchStart(e) {
    lockTouchStartY = e.touches[0].clientY;
}

function handleLockTouchMove(e) {
    lockTouchCurrentY = e.touches[0].clientY;
    const deltaY = lockTouchStartY - lockTouchCurrentY;
    
    // Si desliza hacia arriba más de 50px
    if (deltaY > 50) {
        e.preventDefault();
    }
}

function handleLockTouchEnd(e) {
    const deltaY = lockTouchStartY - lockTouchCurrentY;
    
    // Si deslizó hacia arriba más de 100px, desbloquear
    if (deltaY > 100) {
        hapticFeedback('medium');
        unlockScreen();
    }
    
    lockTouchStartY = 0;
    lockTouchCurrentY = 0;
}

function unlockScreen() {
    const lockScreen = document.getElementById('lockScreen');
    
    if (!lockScreen) return;
    
    console.log('Desbloqueando...');
    
    // Animación de desbloqueo
    lockScreen.classList.add('unlocking', 'swipe-up');
    
    setTimeout(() => {
        lockScreen.classList.remove('active', 'unlocking', 'swipe-up');
        showHomeScreen();
    }, 500);
}

console.log('Vex XS - LockScreen.js cargado');