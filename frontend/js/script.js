const API_BASE_URL = 'http://localhost:8066';

// Variables globales
let productos = [];
let categorias = [];
let usuarios = [];

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar permisos según el rol
    const user = obtenerSesion();
    if (user && user.role === 'USER') {
        document.body.classList.add('user-role');
    }
    
    cargarCategorias();
    cargarProductos();
    mostrarSeccion('inicio');
});

// ========== NAVEGACIÓN ==========
function mostrarSeccion(seccion) {
    document.querySelectorAll('.contenido-seccion, .hero').forEach(sec => {
        sec.style.display = 'none';
    });

    if (seccion === 'inicio') {
        document.getElementById('inicio').style.display = 'block';
    } else {
        document.getElementById(seccion).style.display = 'block';
        
        if (seccion === 'productos') {
            cargarProductos();
        } else if (seccion === 'categorias') {
            cargarCategorias();
            mostrarCategorias();
        } else if (seccion === 'usuarios') {
            cargarUsuarios();
        }
    }
}

// ========== PRODUCTOS ==========
async function cargarProductos() {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/list`);
        productos = await response.json();
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productosLista').innerHTML = 
            '<p class="loading">Error al cargar productos. Verifica que el backend esté corriendo.</p>';
    }
}

function mostrarProductos(filtroCategoria = '') {
    const lista = document.getElementById('productosLista');
    const user = obtenerSesion();
    const isAdmin = user && user.role === 'ADMIN';
    
    let productosFiltrados = productos;
    if (filtroCategoria) {
        productosFiltrados = productos.filter(p => 
            p.category && p.category.id == filtroCategoria
        );
    }

    if (productosFiltrados.length === 0) {
        lista.innerHTML = '<p class="loading">No hay productos disponibles</p>';
        return;
    }

    lista.innerHTML = productosFiltrados.map(producto => `
        <div class="producto-card">
            <h3>${producto.name}</h3>
            <p>${producto.description || 'Sin descripción'}</p>
            <div class="producto-precio">${producto.price}</div>
            <div class="producto-stock">Stock: ${producto.stock} unidades</div>
            <div class="producto-categoria">
                ${producto.category ? producto.category.name : 'Sin categoría'}
            </div>
            ${isAdmin ? `
                <div class="producto-acciones">
                    <button class="btn-edit" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn-delete" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filtrarProductos() {
    const filtro = document.getElementById('filtroCategoria').value;
    mostrarProductos(filtro);
}

function abrirModalProducto(id = null) {
    const user = obtenerSesion();
    if (!user || user.role !== 'ADMIN') {
        alert('No tienes permisos para realizar esta acción');
        return;
    }
    
    const modal = document.getElementById('modalProducto');
    const titulo = document.getElementById('tituloModalProducto');
    
    cargarCategoriasEnSelect();
    
    if (id) {
        titulo.textContent = 'Editar Producto';
        const producto = productos.find(p => p.id === id);
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoNombre').value = producto.name;
        document.getElementById('productoDescripcion').value = producto.description || '';
        document.getElementById('productoPrecio').value = producto.price;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoCategoria').value = producto.category ? producto.category.id : '';
    } else {
        titulo.textContent = 'Nuevo Producto';
        document.getElementById('formProducto').reset();
        document.getElementById('productoId').value = '';
    }
    
    modal.classList.add('active');
}

function cerrarModalProducto() {
    document.getElementById('modalProducto').classList.remove('active');
}

async function guardarProducto(event) {
    event.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const categoriaId = document.getElementById('productoCategoria').value;
    
    const producto = {
        name: document.getElementById('productoNombre').value,
        description: document.getElementById('productoDescripcion').value,
        price: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        category: {
            id: parseInt(categoriaId)
        }
    };

    try {
        let response;
        if (id) {
            producto.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/productos/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/productos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        }

        if (response.ok) {
            alert(id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
            cerrarModalProducto();
            cargarProductos();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function editarProducto(id) {
    abrirModalProducto(id);
}

async function eliminarProducto(id) {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto eliminado exitosamente');
            await cargarProductos(); // Esperar a que se recarguen los productos
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// ========== CATEGORÍAS ==========
async function cargarCategorias() {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias/list`);
        categorias = await response.json();
        
        const filtro = document.getElementById('filtroCategoria');
        filtro.innerHTML = '<option value="">Todas las categorías</option>' +
            categorias.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

function mostrarCategorias() {
    const lista = document.getElementById('categoriasLista');
    const user = obtenerSesion();
    const isAdmin = user && user.role === 'ADMIN';
    
    if (categorias.length === 0) {
        lista.innerHTML = '<p class="loading">No hay categorías disponibles</p>';
        return;
    }

    lista.innerHTML = categorias.map(categoria => `
        <div class="categoria-card">
            <h3>${categoria.name}</h3>
            ${isAdmin ? `
                <div class="categoria-acciones">
                    <button class="btn-edit" onclick="editarCategoria(${categoria.id})">Editar</button>
                    <button class="btn-delete" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function cargarCategoriasEnSelect() {
    const select = document.getElementById('productoCategoria');
    select.innerHTML = '<option value="">Seleccione una categoría</option>' +
        categorias.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function abrirModalCategoria(id = null) {
    const user = obtenerSesion();
    if (!user || user.role !== 'ADMIN') {
        alert('No tienes permisos para realizar esta acción');
        return;
    }
    
    const modal = document.getElementById('modalCategoria');
    const titulo = document.getElementById('tituloModalCategoria');
    
    if (id) {
        titulo.textContent = 'Editar Categoría';
        const categoria = categorias.find(c => c.id === id);
        document.getElementById('categoriaId').value = categoria.id;
        document.getElementById('categoriaNombre').value = categoria.name;
    } else {
        titulo.textContent = 'Nueva Categoría';
        document.getElementById('formCategoria').reset();
        document.getElementById('categoriaId').value = '';
    }
    
    modal.classList.add('active');
}

function cerrarModalCategoria() {
    document.getElementById('modalCategoria').classList.remove('active');
}

async function guardarCategoria(event) {
    event.preventDefault();
    
    const id = document.getElementById('categoriaId').value;
    const categoria = {
        name: document.getElementById('categoriaNombre').value
    };

    try {
        let response;
        if (id) {
            categoria.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/categorias/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoria)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/categorias/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoria)
            });
        }

        if (response.ok) {
            alert(id ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente');
            cerrarModalCategoria();
            cargarCategorias();
            mostrarCategorias();
        } else {
            alert('Error al guardar la categoría');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function editarCategoria(id) {
    abrirModalCategoria(id);
}

async function eliminarCategoria(id) {
    if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Categoría eliminada exitosamente');
            await cargarCategorias(); // Esperar a que se recarguen las categorías
            mostrarCategorias();
        } else {
            alert('Error al eliminar la categoría');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// ========== USUARIOS ==========
async function cargarUsuarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/all`);
        usuarios = await response.json();
        mostrarUsuarios();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('usuariosLista').innerHTML = 
            '<p class="loading">Error al cargar usuarios</p>';
    }
}

function mostrarUsuarios() {
    const lista = document.getElementById('usuariosLista');
    
    if (usuarios.length === 0) {
        lista.innerHTML = '<p class="loading">No hay usuarios disponibles</p>';
        return;
    }

    lista.innerHTML = usuarios.map(usuario => `
        <div class="usuario-card">
            <h3>${usuario.name}</h3>
            <div class="usuario-info">📧 ${usuario.email}</div>
            <div class="usuario-info">📱 ${usuario.phone || 'Sin teléfono'}</div>
            <div class="usuario-info">📍 ${usuario.address || 'Sin dirección'}</div>
            <span class="usuario-role">${usuario.role}</span>
            <div class="usuario-acciones">
                <button class="btn-edit" onclick="editarUsuario(${usuario.id})">Editar</button>
                <button class="btn-delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function abrirModalUsuario(id = null) {
    const modal = document.getElementById('modalUsuario');
    const titulo = document.getElementById('tituloModalUsuario');
    
    if (id) {
        titulo.textContent = 'Editar Usuario';
        const usuario = usuarios.find(u => u.id === id);
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('usuarioNombre').value = usuario.name;
        document.getElementById('usuarioEmail').value = usuario.email;
        document.getElementById('usuarioPassword').value = '';
        document.getElementById('usuarioPassword').required = false;
        document.getElementById('usuarioPhone').value = usuario.phone || '';
        document.getElementById('usuarioAddress').value = usuario.address || '';
        document.getElementById('usuarioRole').value = usuario.role;
    } else {
        titulo.textContent = 'Nuevo Usuario';
        document.getElementById('formUsuario').reset();
        document.getElementById('usuarioId').value = '';
        document.getElementById('usuarioPassword').required = true;
    }
    
    modal.classList.add('active');
}

function cerrarModalUsuario() {
    document.getElementById('modalUsuario').classList.remove('active');
}

async function guardarUsuario(event) {
    event.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const usuario = {
        name: document.getElementById('usuarioNombre').value,
        email: document.getElementById('usuarioEmail').value,
        password: document.getElementById('usuarioPassword').value,
        phone: document.getElementById('usuarioPhone').value,
        address: document.getElementById('usuarioAddress').value,
        role: document.getElementById('usuarioRole').value
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_BASE_URL}/api/users/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/api/users/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
        }

        if (response.ok) {
            alert(id ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
            cerrarModalUsuario();
            cargarUsuarios();
        } else {
            alert('Error al guardar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function editarUsuario(id) {
    abrirModalUsuario(id);
}

async function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/delete/${id}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 204) {
            alert('Usuario eliminado exitosamente');
            await cargarUsuarios(); // Esperar a que se recarguen los usuarios
        } else {
            alert('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}