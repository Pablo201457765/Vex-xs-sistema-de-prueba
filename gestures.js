// Sistema de gestos para cerrar aplicaciones

let gestureStartY = 0;
let gestureCurrentY = 0;
let isGesturing = false;
let gestureStartTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    
    // Eventos táctiles
    appContainer.addEventListener('touchstart', handleGestureStart, { passive: false });
    appContainer.addEventListener('touchmove', handleGestureMove, { passive: false });
    appContainer.addEventListener('touchend', handleGestureEnd, { passive: false });
});

function handleGestureStart(e) {
    const appWindows = document.querySelectorAll('.app-window');
    if (appWindows.length === 0) return;
    
    const touch = e.touches[0];
    const windowHeight = window.innerHeight;
    
    // Solo iniciar gesto si toca en la parte inferior (últimos 100px)
    if (touch.clientY > windowHeight - 100) {
        gestureStartY = touch.clientY;
        gestureStartTime = Date.now();
        isGesturing = false;
    }
}

function handleGestureMove(e) {
    if (gestureStartY === 0) return;
    
    const touch = e.touches[0];
    gestureCurrentY = touch.clientY;
    const diff = gestureStartY - gestureCurrentY;
    
    // Si desliza hacia arriba más de 20px
    if (diff > 20) {
        isGesturing = true;
        e.preventDefault();
        
        // Efecto visual de arrastre
        const appWindows = document.querySelectorAll('.app-window');
        const activeWindow = appWindows[appWindows.length - 1];
        
        if (activeWindow && !activeWindow.classList.contains('closing')) {
            const translateY = Math.min(diff, window.innerHeight);
            const scale = Math.max(0.8, 1 - (diff / window.innerHeight) * 0.2);
            const opacity = Math.max(0.5, 1 - (diff / window.innerHeight) * 0.5);
            
            activeWindow.style.transform = `translateY(${-translateY}px) scale(${scale})`;
            activeWindow.style.opacity = opacity;
            activeWindow.style.borderRadius = `${Math.min(30, diff / 10)}px`;
        }
    }
}

function handleGestureEnd(e) {
    if (!isGesturing || gestureStartY === 0) {
        gestureStartY = 0;
        return;
    }
    
    const diff = gestureStartY - gestureCurrentY;
    const duration = Date.now() - gestureStartTime;
    const velocity = diff / duration; // px por ms
    
    const appWindows = document.querySelectorAll('.app-window');
    const activeWindow = appWindows[appWindows.length - 1];
    
    if (!activeWindow) {
        gestureStartY = 0;
        isGesturing = false;
        return;
    }
    
    // Si deslizó más de 150px o con velocidad alta, cerrar app
    if (diff > 150 || velocity > 0.5) {
        // Animación de cierre
        activeWindow.style.transition = 'all 0.3s cubic-bezier(0.36, 0, 0.66, -0.56)';
        activeWindow.style.transform = 'translateY(-100vh) scale(0.5)';
        activeWindow.style.opacity = '0';
        
        setTimeout(() => {
            closeApp(activeWindow, true);
            activeWindow.style.transform = '';
            activeWindow.style.opacity = '';
            activeWindow.style.borderRadius = '';
            activeWindow.style.transition = '';
        }, 300);
    } else {
        // Volver a posición original
        activeWindow.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        activeWindow.style.transform = '';
        activeWindow.style.opacity = '';
        activeWindow.style.borderRadius = '';
        
        setTimeout(() => {
            activeWindow.style.transition = '';
        }, 300);
    }
    
    gestureStartY = 0;
    gestureCurrentY = 0;
    isGesturing = false;
}

// Soporte para teclado (ESC para cerrar)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const appWindows = document.querySelectorAll('.app-window');
        if (appWindows.length > 0) {
            const activeWindow = appWindows[appWindows.length - 1];
            closeApp(activeWindow, true);
        }
    }
});