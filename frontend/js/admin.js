/**
 * ============================================
 * SCRIPT DEL PANEL DE ADMINISTRADOR
 * ============================================
 */

let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    checkAdmin();
    loadDashboard();
    setupMenuListeners();
    loadAllData();
});

/**
 * Verificar que sea admin
 */
function checkAdmin() {
    const user = getLocalStorage('user');
    
    if (!user || user.rol_id !== 1) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.nombre;
}

/**
 * Configurar menu listeners
 */
function setupMenuListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        if (!item.classList.contains('logout-btn')) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                showSection(section);
            });
        }
    });
}

/**
 * Mostrar sección
 */
function showSection(section) {
    // Cambiar clase active
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    // Actualizar menu
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Actualizar título
    const titles = {
        dashboard: 'Dashboard',
        productos: 'Gestión de Productos',
        pedidos: 'Gestión de Pedidos',
        reservas: 'Gestión de Reservas',
        usuarios: 'Gestión de Usuarios',
        contactos: 'Mensajes de Contacto'
    };
    document.getElementById('section-title').textContent = titles[section];
    
    currentSection = section;
}

/**
 * Cargar dashboard
 */
async function loadDashboard() {
    // Aquí iría la lógica para cargar estadísticas
    // Por ahora usamos valores de ejemplo
    document.getElementById('total-orders').textContent = '0';
    document.getElementById('total-users').textContent = '0';
    document.getElementById('total-products').textContent = '0';
    document.getElementById('total-revenue').textContent = '$0';
}

/**
 * Cargar todos los datos
 */
async function loadAllData() {
    // Cargar productos
    loadProductsList();
    // Cargar pedidos
    loadOrdersList();
    // Cargar reservas
    loadReservationsList();
    // Cargar usuarios
    loadUsersList();
    // Cargar contactos
    loadContactsList();
}

/**
 * Cargar lista de productos
 */
async function loadProductsList() {
    const response = await EliteStyleAPI.getProductos();
    const tbody = document.getElementById('productos-tbody');
    
    if (response.success && response.data) {
        tbody.innerHTML = response.data.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${formatPrice(p.precio)}</td>
                <td>${p.stock}</td>
                <td><span class="badge badge-${p.estado}">${p.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${p.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }
}

/**
 * Cargar lista de pedidos
 */
async function loadOrdersList() {
    const tbody = document.getElementById('pedidos-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>';
    // Aquí iría la lógica para cargar pedidos desde la API
}

/**
 * Cargar lista de reservas
 */
async function loadReservationsList() {
    const tbody = document.getElementById('reservas-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>';
    // Aquí iría la lógica para cargar reservas desde la API
}

/**
 * Cargar lista de usuarios
 */
async function loadUsersList() {
    const tbody = document.getElementById('usuarios-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>';
    // Aquí iría la lógica para cargar usuarios desde la API
}

/**
 * Cargar lista de contactos
 */
async function loadContactsList() {
    const tbody = document.getElementById('contactos-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>';
    // Aquí iría la lógica para cargar contactos desde la API
}

/**
 * Editar producto
 */
function editProduct(productId) {
    console.log('Editar producto:', productId);
    // Mostrar modal y cargar datos
}

/**
 * Eliminar producto
 */
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        console.log('Eliminar producto:', productId);
        // Llamar a API para eliminar
    }
}

/**
 * Cerrar sesión
 */
function logout() {
    EliteStyleAPI.logout().then(() => {
        removeLocalStorage('user');
        window.location.href = '../index.html';
    });
}