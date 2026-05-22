<?php
/**
 * ============================================
 * CONFIGURACIÓN GENERAL - ÉLITE STYLE
 * ============================================
 */

// Prevenir acceso directo
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    http_response_code(403);
    die('Acceso denegado');
}

// ============================================
// INFORMACIÓN DE LA APLICACIÓN
// ============================================
define('APP_NAME', 'Élite Style');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/elite-style');
define('FRONTEND_URL', APP_URL . '/frontend');
define('BACKEND_URL', APP_URL . '/backend');

// ============================================
// CONFIGURACIÓN BASE DE DATOS
// ============================================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'elite_style');
define('DB_CHARSET', 'utf8mb4');

// ============================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================
define('HASH_ALGORITHM', 'bcrypt');
define('SESSION_LIFETIME', 3600); // 1 hora
define('SESSION_NAME', 'elite_style_session');
define('CSRF_TOKEN_LENGTH', 32);

// ============================================
// RUTAS DE DIRECTORIOS
// ============================================
define('ROOT_PATH', dirname(dirname(__DIR__)));
define('FRONTEND_PATH', ROOT_PATH . '/frontend');
define('BACKEND_PATH', ROOT_PATH . '/backend');
define('UPLOADS_PATH', BACKEND_PATH . '/uploads');
define('UPLOADS_PRODUCTS_PATH', UPLOADS_PATH . '/productos');
define('UPLOADS_PROFILES_PATH', UPLOADS_PATH . '/perfiles');
define('UPLOADS_CATEGORIES_PATH', UPLOADS_PATH . '/categorias');

// ============================================
// CONFIGURACIÓN DE ARCHIVOS
// ============================================
define('ALLOWED_IMAGE_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('MAX_FILE_SIZE', 5242880); // 5MB en bytes
define('IMAGE_MAX_WIDTH', 1920);
define('IMAGE_MAX_HEIGHT', 1920);
define('PRODUCT_IMAGE_WIDTH', 800);
define('PRODUCT_IMAGE_HEIGHT', 800);

// ============================================
// CONFIGURACIÓN DE PAGINACIÓN
// ============================================
define('ITEMS_PER_PAGE', 12);
define('ADMIN_ITEMS_PER_PAGE', 20);

// ============================================
// CONFIGURACIÓN DE CORREO (Opcional)
// ============================================
define('MAIL_FROM', 'noreply@elitestyle.com');
define('MAIL_FROM_NAME', 'Élite Style');
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');
define('SMTP_PASS', '');

// ============================================
// CONFIGURACIÓN DE MONEDA
// ============================================
define('CURRENCY_CODE', 'COP');
define('CURRENCY_SYMBOL', '$');
define('CURRENCY_POSITION', 'before'); // before o after

// ============================================
// CONFIGURACIÓN DE IMPUESTOS Y ENVÍOS
// ============================================
define('TAX_RATE', 0.19); // 19% IVA Colombia
define('SHIPPING_COST', 15000); // Costo de envío por defecto
define('FREE_SHIPPING_AMOUNT', 500000); // Envío gratis sobre este monto

// ============================================
// CONFIGURACIÓN DE ROLES Y PERMISOS
// ============================================
define('ROLE_ADMIN', 1);
define('ROLE_USER', 2);

$ROLES = [
    'admin' => 1,
    'usuario' => 2
];

// ============================================
// CONFIGURACIÓN DE IDIOMA
// ============================================
define('DEFAULT_LANGUAGE', 'es');
define('DEFAULT_TIMEZONE', 'America/Bogota');
date_default_timezone_set(DEFAULT_TIMEZONE);

// ============================================
// CONFIGURACIÓN DE ERRORES
// ============================================
define('SHOW_ERRORS', true);
define('LOG_ERRORS', true);
define('ERROR_LOG_PATH', ROOT_PATH . '/logs/error.log');

if (SHOW_ERRORS) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
}

// ============================================
// CONFIGURACIÓN DE SESIÓN
// ============================================
ini_set('session.name', SESSION_NAME);
ini_set('session.gc_maxlifetime', SESSION_LIFETIME);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 0); // Cambiar a 1 en HTTPS
ini_set('session.cookie_samesite', 'Lax');

// Iniciar sesión si no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ============================================
// FUNCIONES AUXILIARES DE CONFIGURACIÓN
// ============================================

/**
 * Obtener URL completa de un recurso
 */
function getAssetUrl($path) {
    return FRONTEND_URL . '/' . ltrim($path, '/');
}

/**
 * Obtener ruta de archivo
 */
function getFilePath($path) {
    return ROOT_PATH . '/' . ltrim($path, '/');
}

/**
 * Obtener usuario actual (si está logueado)
 */
function getCurrentUser() {
    return $_SESSION['user'] ?? null;
}

/**
 * Verificar si usuario está autenticado
 */
function isLoggedIn() {
    return isset($_SESSION['user']) && !empty($_SESSION['user']);
}

/**
 * Verificar si usuario es admin
 */
function isAdmin() {
    return isLoggedIn() && $_SESSION['user']['rol_id'] == ROLE_ADMIN;
}

/**
 * Obtener token CSRF
 */
function getCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(CSRF_TOKEN_LENGTH));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verificar token CSRF
 */
function verifyCsrfToken($token) {
    return hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

// Crear carpetas necesarias si no existen
$directories = [
    UPLOADS_PATH,
    UPLOADS_PRODUCTS_PATH,
    UPLOADS_PROFILES_PATH,
    UPLOADS_CATEGORIES_PATH,
    ROOT_PATH . '/logs'
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}
