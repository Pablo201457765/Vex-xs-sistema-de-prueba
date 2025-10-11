// Pantalla de Arranque (Boot Screen)

function showBootScreen() {
    const bootScreen = document.getElementById('bootScreen');
    
    if (!bootScreen) return;
    
    // Mostrar pantalla de arranque
    bootScreen.classList.add('active');
    
    console.log('Pantalla de arranque iniciada - 15 segundos');
    
    // Después de 15 segundos, pasar a pantalla de bloqueo
    setTimeout(() => {
        hideBootScreen();
    }, VexOS.bootDuration);
}

function hideBootScreen() {
    const bootScreen = document.getElementById('bootScreen');
    
    if (!bootScreen) return;
    
    console.log('Transición a pantalla de bloqueo');
    
    // Animación de salida
    bootScreen.classList.add('fade-out');
    
    // Esperar animación y mostrar lockscreen
    setTimeout(() => {
        bootScreen.classList.remove('active', 'fade-out');
        showLockScreen();
    }, 500);
}

// Permitir saltar el boot screen (desarrollo)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && VexOS.currentScreen === 'boot') {
        hideBootScreen();
    }
});

console.log('Vex XS - BootScreen.js cargado');