/**
 * ============================================
 * SCRIPT PRINCIPAL - ÉLITE STYLE
 * ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Inicializar aplicación
 */
function initializeApp() {
    loadCategories();
    loadFeaturedProducts();
    updateCart();
    setupEventListeners();
    checkUserStatus();
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Menu toggle en móvil
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navbarMenu.classList.remove('active');
        });
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Modal close button
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('notification-modal').style.display = 'none';
        });
    }
}

/**
 * Cargar categorías
 */
async function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const response = await EliteStyleAPI.getCategorias();
    
    if (response.success && response.data) {
        container.innerHTML = response.data.map(category => `
            <a href="pages/products.html?categoria=${category.id}" class="category-card hover-lift">
                <i class="fas fa-shopping-bag"></i>
                <h3>${category.nombre}</h3>
                <p>${category.descripcion}</p>
            </a>
        `).join('');
    }
}

/**
 * Cargar productos destacados
 */
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const response = await EliteStyleAPI.getProductos();
    
    if (response.success && response.data) {
        const featured = response.data.filter(p => p.destacado).slice(0, 6);
        container.innerHTML = featured.map(product => `
            <div class="product-card hover-lift">
                <img src="${BACKEND_URL}/uploads/productos/${product.imagen}" 
                     alt="${product.nombre}" 
                     class="product-image" 
                     onerror="this.src='../img/placeholder.jpg'">
                <div class="product-info">
                    <span class="product-category">${product.categoria}</span>
                    <h4 class="product-name">${product.nombre}</h4>
                    <p class="product-description">${product.descripcion.substring(0, 100)}...</p>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.precio)}</span>
                        ${product.descuento > 0 ? `<span class="discount-badge">-${product.descuento}%</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id}, '${product.nombre}', ${product.precio})">
                            <i class="fas fa-shopping-cart"></i> Añadir
                        </button>
                        <button class="btn btn-sm" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Manejar formulario de contacto
 */
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    const response = await EliteStyleAPI.enviarContacto(data);
    
    if (response.success) {
        showNotification('Mensaje enviado correctamente', 'success');
        this.reset();
    } else {
        showNotification('Error al enviar el mensaje', 'danger');
    }
}

/**
 * Añadir producto al carrito
 */
function addToCart(productId, productName, productPrice) {
    let cart = getLocalStorage('cart') || [];
    
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    saveLocalStorage('cart', cart);
    updateCart();
    showNotification(`${productName} añadido al carrito`, 'success');
}

/**
 * Actualizar carrito
 */
function updateCart() {
    const cart = getLocalStorage('cart') || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = cart.length > 0 ? cart.length : '0';
    }
}

/**
 * Ver producto
 */
function viewProduct(productId) {
    window.location.href = `pages/product-detail.html?id=${productId}`;
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
                <span>Bienvenido, ${user.nombre}</span>
                <a href="${user.rol_id === 1 ? 'pages/admin-panel.html' : 'pages/user-panel.html'}">Mi Panel</a>
                <a href="#" onclick="logout()">Cerrar Sesión</a>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <a href="pages/login.html">Iniciar Sesión</a>
            <span>|</span>
            <a href="pages/register.html">Crear Cuenta</a>
        `;
    }
}

/**
 * Cerrar sesión
 */
function logout() {
    EliteStyleAPI.logout().then(() => {
        removeLocalStorage('user');
        removeLocalStorage('token');
        window.location.href = 'index.html';
    });
}

// Cargar estilos dinámicos
window.addEventListener('load', function() {
    // Observar elementos para animaciones al scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .category-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
});