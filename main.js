// Variables globales
const VexOS = {
    currentScreen: 'boot',
    bootDuration: 15000, // 15 segundos
    activeApp: null,
    appStack: [],
    wallpapers: {
        boot: null,
        lock: null,
        home: null
    }
};

// Inicializar sistema
document.addEventListener('DOMContentLoaded', () => {
    console.log('Vex XS iniciando...');
    loadWallpapers();
    initializeSystem();
});

// Cargar wallpapers guardados
function loadWallpapers() {
    const lockWallpaper = localStorage.getItem('lockWallpaper');
    const homeWallpaper = localStorage.getItem('homeWallpaper');
    const bootWallpaper = localStorage.getItem('bootWallpaper');
    
    if (lockWallpaper) {
        VexOS.wallpapers.lock = lockWallpaper;
        document.getElementById('lockWallpaper').style.backgroundImage = `url(${lockWallpaper})`;
    }
    
    if (homeWallpaper) {
        VexOS.wallpapers.home = homeWallpaper;
        document.getElementById('homeWallpaper').style.backgroundImage = `url(${homeWallpaper})`;
    }
    
    if (bootWallpaper) {
        VexOS.wallpapers.boot = bootWallpaper;
        const bootScreen = document.getElementById('bootScreen');
        if (bootScreen) {
            bootScreen.style.backgroundImage = `url(${bootWallpaper})`;
            bootScreen.style.backgroundSize = 'cover';
            bootScreen.style.backgroundPosition = 'center';
        }
    }
}

// Guardar wallpaper
function saveWallpaper(type, imageData) {
    localStorage.setItem(`${type}Wallpaper`, imageData);
    VexOS.wallpapers[type] = imageData;
}

// Inicializar sistema
function initializeSystem() {
    // Mostrar pant