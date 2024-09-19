// script.js
const joystick = document.querySelector('.joystick');
const container = document.querySelector('.joystick-container');
const outputX = document.getElementById('x-val');
const outputY = document.getElementById('y-val');

let isDragging = false;
let centerX, centerY, maxDistance;

function initJoystick() {
    const containerRect = container.getBoundingClientRect();
    centerX = containerRect.width / 2;
    centerY = containerRect.height / 2;
    maxDistance = containerRect.width / 2 - joystick.offsetWidth / 2;
}

function updateJoystickPosition(x, y) {
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // Limitiere die Bewegungsdistanz des Joysticks
    if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        x = centerX + maxDistance * Math.cos(angle);
        y = centerY + maxDistance * Math.sin(angle);
    }

    // vermutliche Fehler ------------------------ fehler gefunden 
    joystick.style.left = `${x+2*centerX}px`;
    joystick.style.top = `${y+2*centerY}px`;

    // Normiere die X- und Y-Werte auf einen Bereich von -1 bis 1
    const normX = (x - centerX) / maxDistance;
    const normY = (y - centerY) / maxDistance;

    outputX.textContent = normX.toFixed(2);
    outputY.textContent = (-normY).toFixed(2); // -Y, weil Bildschirmkoordinaten andersherum sind
}

function onMouseMove(event) {
    if (!isDragging) return;

    const containerRect = container.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    updateJoystickPosition(mouseX, mouseY);
}

function onTouchMove(event) {
    if (!isDragging) return;

    const containerRect = container.getBoundingClientRect();
    const touch = event.touches[0];
    const touchX = touch.clientX - containerRect.left;
    const touchY = touch.clientY - containerRect.top;

    updateJoystickPosition(touchX, touchY);
}

joystick.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.addEventListener('mousemove', onMouseMove);
});

joystick.addEventListener('touchstart', (e) => {
    isDragging = true;
    document.addEventListener('touchmove', onTouchMove);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);

    // Zurück zur Mitte
    joystick.style.left = '50%';
    joystick.style.top = '50%';
    outputX.textContent = '0';
    outputY.textContent = '0';
});

document.addEventListener('touchend', () => {
    isDragging = false;
    document.removeEventListener('touchmove', onTouchMove);

    // Zurück zur Mitte
    joystick.style.left = '50%';
    joystick.style.top = '50%';
    outputX.textContent = '0';
    outputY.textContent = '0';
});

// Initialisiere den Joystick beim Laden der Seite
window.addEventListener('load', initJoystick);
