// Lógica de la pantalla de inicio

// Lista de aplicaciones
const apps = [
    { id: 'settings', name: 'Configuración', icon: '⚙️', functional: true },
    { id: 'camera', name: 'Cámara', icon: '📷', functional: true },
    { id: 'gallery', name: 'Galería', icon: '🖼️', functional: true },
    { id: 'notes', name: 'Notas', icon: '📝', functional: true },
    { id: 'browser', name: 'Navegador', icon: '🌐', functional: true },
    { id: 'phone', name: 'Teléfono', icon: '📞', functional: true },
    { id: 'messages', name: 'Mensajes', icon: '💬', functional: false },
    { id: 'contacts', name: 'Contactos', icon: '👤', functional: false },
    { id: 'clock', name: 'Reloj', icon: '🕐', functional: false },
    { id: 'calculator', name: 'Calculadora', icon: '🔢', functional: false },
    { id: 'files', name: 'Archivos', icon: '📁', functional: false },
    { id: 'music', name: 'Música', icon: '🎵', functional: false }
];

document.addEventListener('DOMContentLoaded', () => {
    generateAppsGrid();
    setupDockApps();
});

// Generar grid de aplicaciones
function generateAppsGrid() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
    // Las apps del dock no van en el grid
    const dockAppIds = ['camera', 'browser', 'notes', 'phone'];
    const gridApps = apps.filter(app => !dockAppIds.includes(app.id));
    
    appsGrid.innerHTML = '';
    
    gridApps.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'app-item';
        appElement.dataset.app = app.id;
        
        appElement.innerHTML = `
            <div class="app-icon">${app.icon}</div>
            <div class="app-name">${app.name}</div>
        `;
        
        appElement.addEventListener('click', (e) => {
            if (app.functional) {
                const rect = appElement.getBoundingClientRect();
                openApp(app.id, rect);
            }
        });
        
        appsGrid.appendChild(appElement);
    });
}

// Configurar apps del dock
function setupDockApps() {
    const dockApps = document.querySelectorAll('.dock-app');
    
    dockApps.forEach(dockApp => {
        dockApp.addEventListener('click', (e) => {
            const appId = dockApp.dataset.app;
            const rect = dockApp.getBoundingClientRect();
            openApp(appId, rect);
        });
    });
}

// Función para cambiar wallpaper de pantalla de inicio
function changeHomeWallpaper() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const imageData = event.target.result;
                saveWallpaper('home', imageData);
                
                const homeWallpaper = document.getElementById('homeWallpaper');
                if (homeWallpaper) {
                    homeWallpaper.style.backgroundImage = `url(${imageData})`;
                }
                
                console.log('Fondo de inicio actualizado');
            };
            
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}