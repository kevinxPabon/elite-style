/**
 * ============================================
 * SCRIPT DE AUTENTICACIÓN
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    setupForms();
    checkUserStatus();
});

/**
 * Configurar formularios
 */
function setupForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

/**
 * Manejar login
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await EliteStyleAPI.login(email, password);
    
    if (response.success) {
        saveLocalStorage('user', response.data);
        showNotification('¡Bienvenido a Élite Style!', 'success');
        setTimeout(() => {
            window.location.href = response.data.rol_id === 1 ? 'admin-panel.html' : 'user-panel.html';
        }, 1500);
    } else {
        showNotification(response.message || 'Error al iniciar sesión', 'danger');
    }
}

/**
 * Manejar registro
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showNotification('La contraseña debe tener mínimo 6 caracteres', 'warning');
        return;
    }
    
    const response = await EliteStyleAPI.register({
        nombre,
        apellido,
        email,
        password
    });
    
    if (response.success) {
        showNotification('¡Cuenta creada exitosamente! Iniciando sesión...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        showNotification(response.message || 'Error al crear la cuenta', 'danger');
    }
}

/**
 * Verificar estado del usuario
 */
function checkUserStatus() {
    const user = getLocalStorage('user');
    
    // Si está en login/register y ya está logueado, redirigir
    const currentPage = window.location.pathname;
    
    if (user && (currentPage.includes('login') || currentPage.includes('register'))) {
        window.location.href = user.rol_id === 1 ? 'admin-panel.html' : 'user-panel.html';
    }
}