<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vex XS - Beta</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Boot Screen -->
    <div id="boot" class="screen">
        <div class="boot-inner">
            <h1 class="logo">VEX-XS</h1>
            <p class="sub">iniciando…</p>
        </div>
    </div>

    <!-- Lock Screen -->
    <div id="lock" class="screen hidden">
        <div id="lockTime" class="bigtime">12:00</div>
        <div id="lockDate" class="date">lunes, 1 de enero</div>
        <div class="unlock-hint">Desliza hacia arriba para desbloquear</div>
        <div class="gesture-bar"></div>
    </div>

    <!-- Home Screen -->
    <div id="home" class="screen hidden">
        <div class="status-bar">
            <span id="homeTime">12:00</span>
            <div class="battery">
                <div class="battery-level"></div>
                <span>79%</span>
            </div>
        </div>

        <div class="main-apps">
            <button class="app-icon" data-app="phone">
                <div class="icon-wrapper">
                    <img src="phone.png" alt="Teléfono" class="app-img">
                </div>
                <span>Teléfono</span>
            </button>

            <button class="app-icon" data-app="gallery">
                <div class="icon-wrapper">
                    <img src="gallery.png" alt="Galería" class="app-img">
                </div>
                <span>Galería</span>
            </button>
        </div>

        <div class="dock">
            <button class="app-icon" data-app="settings">
                <div class="icon-wrapper">
                    <img src="config.png" alt="Configuración" class="app-img">
                </div>
            </button>

            <button class="app-icon" data-app="messages">
                <div class="icon-wrapper">
                    <img src="messages.png" alt="Mensajes" class="app-img">
                </div>
            </button>

            <button class="app-icon" data-app="browser">
                <div class="icon-wrapper">
                    <img src="browser.png" alt="Navegador" class="app-img">
                </div>
            </button>

            <button class="app-icon" data-app="notes">
                <div class="icon-wrapper">
                    <img src="notes.png" alt="Notas" class="app-img">
                </div>
            </button>
        </div>
    </div>

    <!-- App Window -->
    <div id="app-window" class="screen">
        <div class="app-header">
            <h2 id="app-title">Aplicación</h2>
            <button class="close-button">Cerrar</button>
        </div>
        <div class="app-content" id="app-content">
            <!-- Content will be loaded here -->
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html># Vex-xs-sistema-de-prueba
