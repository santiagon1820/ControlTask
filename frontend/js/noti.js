//notificacion para errores del panel o de la api
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type); // type puede ser 'success' o 'error'
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Llamar la función para mostrar notificación
showNotification('Archivo subido exitosamente', 'success');