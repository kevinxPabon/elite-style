/**
 * ============================================
 * API - ÉLITE STYLE
 * Funciones para comunicarse con el backend
 * ============================================
 */

const API_URL = 'http://localhost/elite-style/backend/api';
const BACKEND_URL = 'http://localhost/elite-style/backend';

class EliteStyleAPI {
    /**
     * Realizar petición GET
     */
    static async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error en GET:', error);
            return { success: false, message: 'Error en la solicitud' };
        }
    }

    /**
     * Realizar petición POST
     */
    static async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error en POST:', error);
            return { success: false, message: 'Error en la solicitud' };
        }
    }

    /**
     * Realizar petición PUT
     */
    static async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error en PUT:', error);
            return { success: false, message: 'Error en la solicitud' };
        }
    }

    /**
     * Realizar petición DELETE
     */
    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error en DELETE:', error);
            return { success: false, message: 'Error en la solicitud' };
        }
    }

    /**
     * Obtener todos los productos
     */
    static async getProductos() {
        return this.get('productos.php');
    }

    /**
     * Obtener un producto específico
     */
    static async getProducto(id) {
        return this.get(`productos.php?id=${id}`);
    }

    /**
     * Obtener categorías
     */
    static async getCategorias() {
        return this.get('categorias.php');
    }

    /**
     * Registrar usuario
     */
    static async register(data) {
        return this.post('auth.php?action=register', data);
    }

    /**
     * Iniciar sesión
     */
    static async login(email, password) {
        return this.post('auth.php?action=login', { email, password });
    }

    /**
     * Cerrar sesión
     */
    static async logout() {
        return this.post('auth.php?action=logout');
    }

    /**
     * Obtener usuario actual
     */
    static async getCurrentUser() {
        return this.get('auth.php?action=current');
    }

    /**
     * Crear pedido
     */
    static async createPedido(data) {
        return this.post('pedidos.php?action=create', data);
    }

    /**
     * Obtener pedidos del usuario
     */
    static async getPedidos() {
        return this.get('pedidos.php?action=user');
    }

    /**
     * Obtener detalles del pedido
     */
    static async getPedido(id) {
        return this.get(`pedidos.php?action=get&id=${id}`);
    }

    /**
     * Crear reserva
     */
    static async createReserva(data) {
        return this.post('reservas.php?action=create', data);
    }

    /**
     * Obtener reservas del usuario
     */
    static async getReservas() {
        return this.get('reservas.php?action=user');
    }

    /**
     * Enviar contacto
     */
    static async enviarContacto(data) {
        return this.post('contacto.php', data);
    }

    /**
     * Obtener reseñas de un producto
     */
    static async getResenas(productoId) {
        return this.get(`resenas.php?producto_id=${productoId}`);
    }

    /**
     * Crear reseña
     */
    static async createResena(data) {
        return this.post('resenas.php', data);
    }
}

// Funciones de utilidad

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
    const modal = document.getElementById('notification-modal');
    const messageDiv = document.getElementById('notification-message');
    
    messageDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    modal.style.display = 'block';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

/**
 * Guardar en localStorage
 */
function saveLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
    }
}

/**
 * Obtener de localStorage
 */
function getLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error leyendo localStorage:', error);
        return null;
    }
}

/**
 * Eliminar de localStorage
 */
function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error eliminando de localStorage:', error);
    }
}

/**
 * Formatear precio
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Formatear fecha
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}