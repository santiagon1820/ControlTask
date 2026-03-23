// notifications.js
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type); // 'success' o 'error'
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove(); // Elimina la notificación después de 3 segundos
    }, 3000);
}

// layout side bar.js
const layoutHTML = `
    <header class="main-header">
        <div class="header-content">
            <h1>ControlTask - Admin</h1>
            <a href="./login/login.html" class="btn btn-primary">Cerrar Sesión</a>
        </div>
    </header>

    <aside class="sidebar">
        <nav>
            <ul>
                <li><a href="./adminpanel.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="./empresas.html"><i class="fas fa-building"></i> Empresas</a></li>
                <li><a href="./users.html"><i class="fas fa-users"></i> Usuarios</a></li>
                <li><a href="./conf.html"><i class="fas fa-cogs"></i> Configuración</a></li>
            </ul>
        </nav>
    </aside>
`;

function injectLayout() {
    document.body.insertAdjacentHTML('afterbegin', layoutHTML);
}

// Inyectar el layout cuando la página esté lista
window.onload = injectLayout;

// layout.js

function setUserPermissions() {
    const userRole = localStorage.getItem('role'); // 'admin' o 'user'

    if (userRole === 'user') {
        // Si es usuario, ocultar o deshabilitar opciones
        const deleteButtons = document.querySelectorAll('.btn-danger');
        deleteButtons.forEach(button => button.style.display = 'none'); // Ocultar eliminar

        // Opcional: deshabilitar el sidebar de configuración o cualquier otra opción
        document.querySelector('a[href="./conf.html"]').style.display = 'none';
    }
}

window.onload = function() {
    injectLayout();  // Inyectar el layout (sidebar, header)
    setUserPermissions();  // Establecer permisos según el tipo de usuario
};