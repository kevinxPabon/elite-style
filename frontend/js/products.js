/**
 * ============================================
 * SCRIPT DE PRODUCTOS
 * ============================================
 */

let allProducts = [];
let currentFilters = {
    category: null,
    priceMin: 0,
    priceMax: 500000,
    sort: 'recent'
};

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
    updateCartCount();
    checkUserStatus();
});

/**
 * Cargar productos
 */
async function loadProducts() {
    const response = await EliteStyleAPI.getProductos();
    
    if (response.success && response.data) {
        allProducts = response.data;
        displayProducts(allProducts);
    }
}

/**
 * Mostrar productos
 */
function displayProducts(products) {
    const container = document.getElementById('products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center">No hay productos que coincidan con los filtros</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card hover-lift">
            <img src="${BACKEND_URL}/uploads/productos/${product.imagen}" 
                 alt="${product.nombre}" 
                 class="product-image" 
                 onerror="this.src='../img/placeholder.jpg'">
            <div class="product-info">
                <span class="product-category">${product.categoria}</span>
                <h4 class="product-name">${product.nombre}</h4>
                <p class="product-description">${product.descripcion.substring(0, 80)}...</p>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.precio)}</span>
                    ${product.descuento > 0 ? `<span class="discount-badge">-${product.descuento}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id}, '${product.nombre}', ${product.precio})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn btn-sm" onclick="viewProductDetail(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Configurar filtros
 */
async function setupFilters() {
    // Cargar categorías
    const response = await EliteStyleAPI.getCategorias();
    if (response.success && response.data) {
        const filterContainer = document.getElementById('categories-filter');
        filterContainer.innerHTML = response.data.map(cat => `
            <label>
                <input type="checkbox" value="${cat.id}" onchange="applyFilters()">
                ${cat.nombre}
            </label>
        `).join('');
    }
    
    // Event listeners para filtros
    document.getElementById('price-min').addEventListener('input', function() {
        currentFilters.priceMin = parseInt(this.value);
        document.getElementById('price-min-display').textContent = formatPrice(this.value);
        applyFilters();
    });
    
    document.getElementById('price-max').addEventListener('input', function() {
        currentFilters.priceMax = parseInt(this.value);
        document.getElementById('price-max-display').textContent = formatPrice(this.value);
        applyFilters();
    });
    
    document.getElementById('sort-by').addEventListener('change', function() {
        currentFilters.sort = this.value;
        applyFilters();
    });
    
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    let filtered = [...allProducts];
    
    // Filtro por categoría
    const selectedCategories = Array.from(document.querySelectorAll('#categories-filter input:checked'))
        .map(el => parseInt(el.value));
    
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.categoria_id));
    }
    
    // Filtro por precio
    filtered = filtered.filter(p => p.precio >= currentFilters.priceMin && p.precio <= currentFilters.priceMax);
    
    // Ordenamiento
    switch(currentFilters.sort) {
        case 'price-asc':
            filtered.sort((a, b) => a.precio - b.precio);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.precio - a.precio);
            break;
        case 'popular':
            filtered.sort((a, b) => b.stock - a.stock);
            break;
        default:
            filtered.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
    }
    
    displayProducts(filtered);
}

/**
 * Limpiar filtros
 */
function clearFilters() {
    document.querySelectorAll('#categories-filter input').forEach(el => el.checked = false);
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 500000;
    document.getElementById('sort-by').value = 'recent';
    currentFilters = { category: null, priceMin: 0, priceMax: 500000, sort: 'recent' };
    displayProducts(allProducts);
}

/**
 * Ver detalle del producto
 */
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

/**
 * Actualizar contador del carrito
 */
function updateCartCount() {
    const cart = getLocalStorage('cart') || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

/**
 * Verificar estado del usuario
 */
async function checkUserStatus() {
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
    } else {
        navAuth.innerHTML = `
            <a href="login.html">Iniciar Sesión</a> | <a href="register.html">Crear Cuenta</a>
        `;
    }
}

/**
 * Cerrar sesión
 */
function logout() {
    EliteStyleAPI.logout().then(() => {
        removeLocalStorage('user');
        window.location.href = 'products.html';
    });
}