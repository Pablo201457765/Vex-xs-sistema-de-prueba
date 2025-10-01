function updateClock() {
    const now = new Date();
    document.getElementById("time").innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function unlock() {
    const pass = document.getElementById("password").value;
    const status = document.getElementById("status");
    if(pass === "1234"){
        status.innerText = "✅ Dispositivo desbloqueado";
        status.style.color = "lightgreen";
    } else {
        status.innerText = "❌ Clave incorrecta";
        status.style.color = "red";
    }
}