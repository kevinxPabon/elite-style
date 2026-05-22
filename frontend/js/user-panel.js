/**
 * ============================================
 * SCRIPT DEL PANEL DE USUARIO
 * ============================================
 */

let currentSection = 'perfil';

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadUserProfile();
    setupMenuListeners();
    setupProfileForm();
    setupReservationModal();
});

/**
 * Verificar autenticación
 */
function checkAuthentication() {
    const user = getLocalStorage('user');
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.nombre + ' ' + (user.apellido || '');
    document.getElementById('user-email').textContent = user.email;
}

/**
 * Cargar perfil del usuario
 */
function loadUserProfile() {
    const user = getLocalStorage('user');
    
    if (user) {
        document.getElementById('nombre').value = user.nombre || '';
        document.getElementById('apellido').value = user.apellido || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('telefono').value = user.telefono || '';
        document.getElementById('direccion').value = user.direccion || '';
        document.getElementById('ciudad').value = user.ciudad || '';
        document.getElementById('codigo_postal').value = user.codigo_postal || '';
    }
    
    // Cargar pedidos y reservas
    loadUserOrders();
    loadUserReservations();
}

/**
 * Configurar menu listeners
 */
function setupMenuListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        if (!item.classList.contains('logout')) {
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
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    currentSection = section;
}

/**
 * Configurar formulario de perfil
 */
function setupProfileForm() {
    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Aquí iría la lógica para actualizar el perfil
            showNotification('Perfil actualizado correctamente', 'success');
        });
    }
}

/**
 * Cargar pedidos del usuario
 */
async function loadUserOrders() {
    const user = getLocalStorage('user');
    const container = document.getElementById('pedidos-list');
    
    if (!user) return;
    
    // Aquí iría la lógica para cargar pedidos desde la API
    const response = await EliteStyleAPI.getPedidos();
    
    if (response.success && response.data && response.data.length > 0) {
        container.innerHTML = response.data.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Pedido #${order.numero_pedido}</h3>
                    <span class="status-badge status-${order.estado}">${order.estado}</span>
                </div>
                <div class="order-details">
                    <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                    <p><strong>Fecha:</strong> ${formatDate(order.fecha_pedido)}</p>
                    <p><strong>Estado:</strong> ${order.estado}</p>
                </div>
                <button class="btn btn-sm" onclick="viewOrder(${order.id})">Ver Detalles</button>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="empty-message">No tienes pedidos aún</p>';
    }
}

/**
 * Cargar reservas del usuario
 */
async function loadUserReservations() {
    const user = getLocalStorage('user');
    const container = document.getElementById('reservas-list');
    
    if (!user) return;
    
    const response = await EliteStyleAPI.getReservas();
    
    if (response.success && response.data && response.data.length > 0) {
        container.innerHTML = response.data.map(res => `
            <div class="reservation-card">
                <div class="reservation-header">
                    <h3>Reserva #${res.numero_reserva}</h3>
                    <span class="status-badge status-${res.estado}">${res.estado}</span>
                </div>
                <div class="reservation-details">
                    <p><strong>Fecha:</strong> ${res.fecha_reserva}</p>
                    <p><strong>Hora:</strong> ${res.hora_reserva}</p>
                    <p><strong>Motivo:</strong> ${res.motivo}</p>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="empty-message">No tienes reservas aún</p>';
    }
}

/**
 * Configurar modal de reserva
 */
function setupReservationModal() {
    const btn = document.getElementById('new-reservation-btn');
    const modal = document.getElementById('reservation-modal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('reservation-form');
    
    if (btn) {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleNewReservation);
    }
}

/**
 * Manejar nueva reserva
 */
async function handleNewReservation(e) {
    e.preventDefault();
    
    const user = getLocalStorage('user');
    
    const data = {
        usuario_id: user.id,
        fecha_reserva: document.querySelector('[name="fecha"]').value,
        hora_reserva: document.querySelector('[name="hora"]').value,
        motivo: document.querySelector('[name="motivo"]').value
    };
    
    const response = await EliteStyleAPI.createReserva(data);
    
    if (response.success) {
        showNotification('Reserva creada exitosamente', 'success');
        document.getElementById('reservation-modal').style.display = 'none';
        loadUserReservations();
    } else {
        showNotification(response.message || 'Error al crear la reserva', 'danger');
    }
}

/**
 * Ver detalles del pedido
 */
function viewOrder(orderId) {
    console.log('Ver orden:', orderId);
    // Mostrar detalles del pedido
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