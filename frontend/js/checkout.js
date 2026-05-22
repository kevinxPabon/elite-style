/**
 * ============================================
 * SCRIPT DE CHECKOUT
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    displayOrderSummary();
    setupCheckoutForm();
});

/**
 * Verificar autenticación
 */
function checkAuthentication() {
    const user = getLocalStorage('user');
    
    if (!user) {
        showNotification('Debes iniciar sesión para continuar', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        // Pre-llenar datos del usuario
        document.getElementById('nombre').value = user.nombre + ' ' + (user.apellido || '');
        document.getElementById('email').value = user.email;
        document.getElementById('telefono').value = user.telefono || '';
        document.getElementById('direccion').value = user.direccion || '';
        document.getElementById('ciudad').value = user.ciudad || '';
    }
}

/**
 * Mostrar resumen del pedido
 */
function displayOrderSummary() {
    const cart = getLocalStorage('cart') || [];
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let subtotal = 0;
    const itemsHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        `;
    }).join('');
    
    const shipping = subtotal > 500000 ? 0 : 15000;
    const taxes = subtotal * 0.19;
    const total = subtotal + shipping + taxes;
    
    document.getElementById('order-items').innerHTML = itemsHTML;
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('taxes').textContent = formatPrice(taxes);
    document.getElementById('total').textContent = formatPrice(total);
}

/**
 * Configurar formulario de checkout
 */
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }
}

/**
 * Manejar checkout
 */
async function handleCheckout(e) {
    e.preventDefault();
    
    const user = getLocalStorage('user');
    const cart = getLocalStorage('cart') || [];
    
    if (!user || cart.length === 0) {
        showNotification('Error: Datos incompletos', 'danger');
        return;
    }
    
    // Calcular totales
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = subtotal > 500000 ? 0 : 15000;
    const taxes = subtotal * 0.19;
    const total = subtotal + shipping + taxes;
    
    // Preparar datos del pedido
    const orderData = {
        usuario_id: user.id,
        nombre_cliente: document.getElementById('nombre').value,
        email_cliente: document.getElementById('email').value,
        telefono_cliente: document.getElementById('telefono').value,
        direccion_entrega: document.getElementById('direccion').value,
        ciudad: document.getElementById('ciudad').value,
        codigo_postal: document.getElementById('codigo-postal').value,
        tipo_entrega: document.getElementById('entrega').value,
        subtotal: subtotal,
        costo_envio: shipping,
        impuestos: taxes,
        total: total,
        items: cart,
        notas: document.getElementById('notas').value
    };
    
    // Crear pedido
    const response = await EliteStyleAPI.createPedido(orderData);
    
    if (response.success) {
        showNotification('¡Pedido creado exitosamente!', 'success');
        removeLocalStorage('cart');
        setTimeout(() => {
            window.location.href = 'user-panel.html';
        }, 1500);
    } else {
        showNotification(response.message || 'Error al crear el pedido', 'danger');
    }
}