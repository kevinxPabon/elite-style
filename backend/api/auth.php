<?php
/**
 * ============================================
 * API DE AUTENTICACIÓN
 * ============================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'register':
            handleRegister();
            break;
        
        case 'login':
            handleLogin();
            break;
        
        case 'logout':
            handleLogout();
            break;
        
        case 'current':
            handleGetCurrent();
            break;
        
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

/**
 * Manejar registro
 */
function handleRegister() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    if (empty($data['email']) || empty($data['password']) || empty($data['nombre'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        return;
    }
    
    $db = Database::getInstance();
    
    // Verificar si el usuario ya existe
    $user = $db->fetchOne('SELECT id FROM usuarios WHERE email = ?', [$data['email']]);
    
    if ($user) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
        return;
    }
    
    // Encriptar contraseña
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
    // Insertar usuario
    $result = $db->insert('usuarios', [
        'nombre' => $data['nombre'],
        'apellido' => $data['apellido'] ?? '',
        'email' => $data['email'],
        'contrasena' => $hashedPassword,
        'rol_id' => 2 // Usuario normal
    ]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Registro exitoso', 'data' => ['id' => $result]]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al registrar']);
    }
}

/**
 * Manejar login
 */
function handleLogin() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email y contraseña requeridos']);
        return;
    }
    
    $db = Database::getInstance();
    
    // Buscar usuario
    $user = $db->fetchOne(
        'SELECT id, nombre, apellido, email, rol_id FROM usuarios WHERE email = ?',
        [$data['email']]
    );
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
        return;
    }
    
    // Verificar contraseña
    $storedPassword = $db->fetchOne(
        'SELECT contrasena FROM usuarios WHERE id = ?',
        [$user['id']]
    );
    
    if (!password_verify($data['password'], $storedPassword['contrasena'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
        return;
    }
    
    // Actualizar último login
    $db->update('usuarios', ['ultimo_login' => date('Y-m-d H:i:s')], 'id = ?', [$user['id']]);
    
    // Guardar en sesión
    $_SESSION['user'] = $user;
    
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'data' => $user
    ]);
}

/**
 * Manejar logout
 */
function handleLogout() {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
}

/**
 * Obtener usuario actual
 */
function handleGetCurrent() {
    if (isset($_SESSION['user'])) {
        echo json_encode([
            'success' => true,
            'data' => $_SESSION['user']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autenticado']);
    }
}
