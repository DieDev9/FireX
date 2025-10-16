const API_BASE_URL = 'http://localhost:8066';

// Manejar login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            // Guardar sesión
            guardarSesion(result.user);
            
            // Redirigir al dashboard
            window.location.href = 'index.html';
        } else {
            // Mostrar error
            errorMsg.textContent = result.message;
            errorMsg.classList.add('show');
            
            setTimeout(() => {
                errorMsg.classList.remove('show');
            }, 3000);
        }
    } catch (error) {
        console.error('Error:', error);
        errorMsg.textContent = 'Error de conexión con el servidor';
        errorMsg.classList.add('show');
    }
}

// Mostrar modal de registro
function mostrarRegistro() {
    document.getElementById('modalRegistro').classList.add('active');
}

// Cerrar modal de registro
function cerrarRegistro() {
    document.getElementById('modalRegistro').classList.remove('active');
}

// Manejar registro
async function handleRegistro(event) {
    event.preventDefault();

    const usuario = {
        name: document.getElementById('regNombre').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('regPhone').value,
        address: document.getElementById('regAddress').value,
        role: 'USER' // Por defecto los registros son usuarios normales
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert('Usuario registrado exitosamente. Ya puedes iniciar sesión.');
            cerrarRegistro();
            document.getElementById('formRegistro').reset();
        } else {
            alert('Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Funciones de auth.js inline para el login
function guardarSesion(user) {
    localStorage.setItem('firex_user', JSON.stringify(user));
}