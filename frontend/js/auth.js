// Manejo de sesión y autenticación

const AUTH_KEY = 'firex_user';

// Guardar usuario en localStorage
function guardarSesion(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Obtener usuario de la sesión
function obtenerSesion() {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

// Verificar si está autenticado
function estaAutenticado() {
    return obtenerSesion() !== null;
}

// Verificar rol
function esAdmin() {
    const user = obtenerSesion();
    return user && user.role === 'ADMIN';
}

// Verificar autenticación al cargar página
function verificarAutenticacion() {
    if (!estaAutenticado()) {
        window.location.href = 'login.html';
    }
}

// Mostrar/ocultar elementos según rol
function aplicarPermisos() {
    const user = obtenerSesion();
    
    if (!user) return;

    // Si es USER, ocultar sección de usuarios
    if (user.role === 'USER') {
        const navUsuarios = document.querySelector('a[onclick*="usuarios"]');
        if (navUsuarios) {
            navUsuarios.parentElement.style.display = 'none';
        }

        // Ocultar botones de editar/eliminar para usuarios normales
        const botonesAdmin = document.querySelectorAll('.btn-edit, .btn-delete');
        botonesAdmin.forEach(btn => {
            btn.style.display = 'none';
        });
    }

    // Mostrar nombre de usuario en header
    const userName = document.querySelector('.user-name');
    if (userName) {
        userName.textContent = user.name;
    }
}