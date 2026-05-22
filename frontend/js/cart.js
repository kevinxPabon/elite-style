/**
 * ============================================
 * SCRIPT DE CARRITO
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    setupEventListeners();
    checkUserStatus();
});

/**
 * Mostrar carrito
 */
function displayCart() {
    const cart = getLocalStorage('cart') || [];
    const cartList = document.getElementById('cart-list');
    
    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <a href="products.html" class="btn btn-primary">Continuar Comprando</a>
            </div>
        `;
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    
    cartList.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="item-image">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Precio: ${formatPrice(item.price)}</p>
            </div>
            <div class="item-quantity">
                <button onclick="updateQuantity(${index}, -1)" class="qty-btn">-</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantityDirect(${index}, this.value)">
                <button onclick="updateQuantity(${index}, 1)" class="qty-btn">+</button>
            </div>
            <div class="item-price">
                ${formatPrice(item.price * item.quantity)}
            </div>
            <button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateSummary();
}

/**
 * Actualizar cantidad
 */
function updateQuantity(index, change) {
    let cart = getLocalStorage('cart') || [];
    cart[index].quantity += change;
    
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    
    saveLocalStorage('cart', cart);
    displayCart();
}

/**
 * Actualizar cantidad directa
 */
function updateQuantityDirect(index, quantity) {
    let cart = getLocalStorage('cart') || [];
    cart[index].quantity = parseInt(quantity) || 1;
    
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    
    saveLocalStorage('cart', cart);
    displayCart();
}

/**
 * Eliminar del carrito
 */
function removeFromCart(index) {
    let cart = getLocalStorage('cart') || [];
    cart.splice(index, 1);
    saveLocalStorage('cart', cart);
    displayCart();
    showNotification('Producto eliminado del carrito', 'info');
}

/**
 * Actualizar resumen
 */
function updateSummary() {
    const cart = getLocalStorage('cart') || [];
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = subtotal > 500000 ? 0 : 15000;
    const taxes = subtotal * 0.19;
    const total = subtotal + shipping + taxes;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('taxes').textContent = formatPrice(taxes);
    document.getElementById('total').textContent = formatPrice(total);
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const user = getLocalStorage('user');
            if (!user) {
                showNotification('Debes iniciar sesión para continuar', 'warning');
                window.location.href = 'login.html';
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }
}

/**
 * Verificar estado del usuario
 */
function checkUserStatus() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    const user = getLocalStorage('user');
    
    if (user) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <span>Hola, ${user.nombre}</span>
                <a href="${user.rol_id === 1 ? 'admin-panel.html' : 'user-panel.html'}">Mi Panel</a>
                <a href="#" onclick="logout()">Cerrar</a>
            </div>
        `;
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