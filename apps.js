// Sistema de aplicaciones

// Abrir aplicación
function openApp(appId, iconRect) {
    const appContainer = document.getElementById('appContainer');
    
    // Crear ventana de app
    const appWindow = document.createElement('div');
    appWindow.className = 'app-window';
    appWindow.dataset.appId = appId;
    
    // Si hay posición del ícono, animar desde ahí
    if (iconRect) {
        appWindow.style.transformOrigin = `${iconRect.left + iconRect.width/2}px ${iconRect.top + iconRect.height/2}px`;
    }
    
    // Generar contenido según la app
    const content = generateAppContent(appId);
    appWindow.innerHTML = content;
    
    appContainer.appendChild(appWindow);
    
    // Forzar reflow para animación
    appWindow.offsetHeight;
    
    // Animar apertura
    appWindow.classList.add('opening');
    
    setTimeout(() => {
        appWindow.classList.remove('opening');
    }, 400);
    
    VexOS.activeApp = appId;
    VexOS.appStack.push(appWindow);
    
    // Setup eventos de la app
    setupAppEvents(appWindow, appId);
}

// Cerrar aplicación
function closeApp(appWindow, toIcon = false) {
    appWindow.classList.add('closing');
    
    setTimeout(() => {
        appWindow.remove();
        VexOS.appStack = VexOS.appStack.filter(app => app !== appWindow);
        VexOS.activeApp = VexOS.appStack.length > 0 ? 
            VexOS.appStack[VexOS.appStack.length - 1].dataset.appId : null;
    }, 350);
}

// Generar contenido de aplicación
function generateAppContent(appId) {
    const appTitles = {
        settings: 'Configuración',
        camera: 'Cámara',
        gallery: 'Galería',
        notes: 'Notas',
        browser: 'Navegador',
        phone: 'Teléfono'
    };
    
    let content = `
        <div class="app-header">
            <div class="app-back">←</div>
            <div class="app-title">${appTitles[appId] || 'App'}</div>
            <div class="app-menu">⋮</div>
        </div>
        <div class="app-content" id="app-content-${appId}">
    `;
    
    switch(appId) {
        case 'settings':
            content += generateSettingsContent();
            break;
        case 'camera':
            content += generateCameraContent();
            break;
        case 'gallery':
            content += generateGalleryContent();
            break;
        case 'notes':
            content += generateNotesContent();
            break;
        case 'browser':
            content += generateBrowserContent();
            break;
        case 'phone':
            content += generatePhoneContent();
            break;
        default:
            content += '<p>Aplicación en desarrollo</p>';
    }
    
    content += `
        </div>
        <div class="gesture-indicator">
            <div class="gesture-bar"></div>
        </div>
    `;
    
    return content;
}

// Contenido de Configuración
function generateSettingsContent() {
    return `
        <ul class="settings-list">
            <li class="settings-item" data-action="about">
                <div class="settings-icon">📱</div>
                <div class="settings-info">
                    <div class="settings-label">Sobre el teléfono</div>
                    <div class="settings-value">Vex XS v1.0</div>
                </div>
                <div class="settings-arrow">›</div>
            </li>
            <li class="settings-item" data-action="wallpapers">
                <div class="settings-icon">🖼️</div>
                <div class="settings-info">
                    <div class="settings-label">Fondos de bloqueo e inicio</div>
                    <div class="settings-value">Personalizar fondos</div>
                </div>
                <div class="settings-arrow">›</div>
            </li>
            <li class="settings-item" data-action="lockstyle">
                <div class="settings-icon">🔒</div>
                <div class="settings-info">
                    <div class="settings-label">Estilos de bloqueo</div>
                    <div class="settings-value">Personalizar</div>
                </div>
                <div class="settings-arrow">›</div>
            </li>
            <li class="settings-item" data-action="restart">
                <div class="settings-icon">🔄</div>
                <div class="settings-info">
                    <div class="settings-label">Reiniciar sistema</div>
                    <div class="settings-value">Volver a pantalla de arranque</div>
                </div>
                <div class="settings-arrow">›</div>
            </li>
        </ul>
    `;
}

// Contenido de Cámara
function generateCameraContent() {
    return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <video id="cameraPreview" autoplay playsinline style="width: 100%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"></video>
            <button class="action-button" id="captureBtn" style="margin-top: 20px;">📸 Capturar Foto</button>
            <canvas id="cameraCanvas" style="display: none;"></canvas>
            <img id="capturedImage" style="display: none; max-width: 100%; margin-top: 20px; border-radius: 12px;" />
        </div>
    `;
}

// Contenido de Galería
function generateGalleryContent() {
    return `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🖼️</div>
            <h3 style="margin-bottom: 15px;">Galería</h3>
            <p style="color: #888; margin-bottom: 30px;">Selecciona imágenes de tu dispositivo</p>
            <button class="action-button" id="selectImageBtn">Seleccionar Imagen</button>
            <input type="file" id="galleryInput" accept="image/*" style="display: none;">
            <div id="galleryPreview" style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px;"></div>
        </div>
    `;
}

// Contenido de Notas
function generateNotesContent() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column;">
            <textarea id="notesTextarea" 
                placeholder="Escribe tus notas aquí..." 
                style="flex: 1; border: none; padding: 20px; font-size: 1rem; font-family: inherit; resize: none; outline: none;"></textarea>
            <div style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; gap: 10px;">
                <button class="action-button" id="saveNoteBtn">💾 Guardar</button>
                <button class="action-button" id="clearNoteBtn" style="background: #e74c3c;">🗑️ Borrar</button>
            </div>
        </div>
    `;
}

// Contenido de Navegador
function generateBrowserContent() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column;">
            <div style="padding: 15px; border-bottom: 1px solid #e0e0e0; display: flex; gap: 10px;">
                <input type="url" id="browserUrl" 
                    placeholder="Ingresa una URL..." 
                    style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; outline: none;" />
                <button class="action-button" id="browserGoBtn">Ir</button>
            </div>
            <iframe id="browserFrame" style="flex: 1; border: none; width: 100%;"></iframe>
        </div>
    `;
}

// Contenido de Teléfono
function generatePhoneContent() {
    return `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">📞</div>
            <div id="phoneDisplay" style="font-size: 2rem; min-height: 60px; margin-bottom: 30px; font-weight: 300;"></div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 300px; width: 100%;">
                ${[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(num => `
                    <button class="phone-key" data-key="${num}" 
                        style="padding: 20px; font-size: 1.5rem; background: #f0f0f0; border: none; border-radius: 50%; cursor: pointer; transition: all 0.2s;">
                        ${num}
                    </button>
                `).join('')}
            </div>
            <button class="action-button" style="margin-top: 30px; background: #27ae60;">📞 Llamar</button>
        </div>
    `;
}

// Configurar eventos de la app
function setupAppEvents(appWindow, appId) {
    // Botón de volver
    const backBtn = appWindow.querySelector('.app-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => closeApp(appWindow, true));
    }
    
    // Eventos específicos por app
    switch(appId) {
        case 'settings':
            setupSettingsEvents(appWindow);
            break;
        case 'camera':
            setupCameraEvents(appWindow);
            break;
        case 'gallery':
            setupGalleryEvents(appWindow);
            break;
        case 'notes':
            setupNotesEvents(appWindow);
            break;
        case 'browser':
            setupBrowserEvents(appWindow);
            break;
        case 'phone':
            setupPhoneEvents(appWindow);
            break;
    }
}

// Eventos de Configuración
function setupSettingsEvents(appWindow) {
    const items = appWindow.querySelectorAll('.settings-item');
    
    items.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            
            switch(action) {
                case 'about':
                    alert('Vex XS v1.0\nSystemXS\nSistema Operativo Web');
                    break;
                case 'wallpapers':
                    openWallpaperSettings(appWindow);
                    break;
                case 'lockstyle':
                    alert('Estilos de bloqueo - Próximamente');
                    break;
                case 'restart':
                    if (confirm('¿Reiniciar el sistema?')) {
                        closeApp(appWindow);
                        restartSystem();
                    }
                    break;
            }
        });
    });
}

// Abrir configuración de wallpapers
function openWallpaperSettings(parentWindow) {
    const content = `
        <div class="app-header">
            <div class="app-back">←</div>
            <div class="app-title">Fondos de pantalla</div>
            <div class="app-menu"></div>
        </div>
        <div class="app-content">
            <ul class="settings-list">
                <li class="settings-item" data-wallpaper="lock">
                    <div class="settings-icon">🔒</div>
                    <div class="settings-info">
                        <div class="settings-label">Pantalla de bloqueo</div>
                        <div class="settings-value">Cambiar fondo</div>
                    </div>
                    <div class="settings-arrow">›</div>
                </li>
                <li class="settings-item" data-wallpaper="home">
                    <div class="settings-icon">🏠</div>
                    <div class="settings-info">
                        <div class="settings-label">Pantalla de inicio</div>
                        <div class="settings-value">Cambiar fondo</div>
                    </div>
                    <div class="settings-arrow">›</div>
                </li>
                <li class="settings-item" data-wallpaper="boot">
                    <div class="settings-icon">⚡</div>
                    <div class="settings-info">
                        <div class="settings-label">Pantalla de arranque</div>
                        <div class="settings-value">Cambiar fondo</div>
                    </div>
                    <div class="settings-arrow">›</div>
                </li>
            </ul>
        </div>
        <div class="gesture-indicator">
            <div class="gesture-bar"></div>
        </div>
    `;
    
    const appContainer = document.getElementById('appContainer');
    const subWindow = document.createElement('div');
    subWindow.className = 'app-window opening';
    subWindow.innerHTML = content;
    
    // Overlay para la ventana anterior
    parentWindow.style.filter = 'brightness(0.5)';
    parentWindow.style.pointerEvents = 'none';
    
    appContainer.appendChild(subWindow);
    
    // Botón volver
    const backBtn = subWindow.querySelector('.app-back');
    backBtn.addEventListener('click', () => {
        subWindow.classList.add('closing');
        parentWindow.style.filter = '';
        parentWindow.style.pointerEvents = '';
        
        setTimeout(() => {
            subWindow.remove();
        }, 350);
    });
    
    // Eventos de cambio de wallpaper
    const wallpaperItems = subWindow.querySelectorAll('[data-wallpaper]');
    wallpaperItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.wallpaper;
            
            if (type === 'lock') changeLockWallpaper();
            else if (type === 'home') changeHomeWallpaper();
            else if (type === 'boot') changeBootWallpaper();
        });
    });
}

// Eventos de Cámara
function setupCameraEvents(appWindow) {
    const video = appWindow.querySelector('#cameraPreview');
    const captureBtn = appWindow.querySelector('#captureBtn');
    const canvas = appWindow.querySelector('#cameraCanvas');
    const capturedImage = appWindow.querySelector('#capturedImage');
    
    // Acceder a la cámara
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            appWindow.querySelector('.app-content').innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">No se pudo acceder a la cámara</p>';
        });
    
    // Capturar foto
    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            
            const imageData = canvas.toDataURL('image/png');
            capturedImage.src = imageData;
            capturedImage.style.display = 'block';
            video.style.display = 'none';
            captureBtn.textContent = '🔄 Nueva Foto';
            
            captureBtn.onclick = () => {
                video.style.display = 'block';
                capturedImage.style.display = 'none';
                captureBtn.textContent = '📸 Capturar Foto';
                captureBtn