<?php
/**
 * ============================================
 * API DE RESERVAS
 * ============================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$db = Database::getInstance();
$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'create':
            handleCreateReservation();
            break;
        
        case 'get':
            handleGetReservation();
            break;
        
        case 'user':
            handleGetUserReservations();
            break;
        
        case 'update':
            handleUpdateReservation();
            break;
        
        default:
            handleGetAllReservations();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

/**
 * Crear reserva
 */
function handleCreateReservation() {
    global $db;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['usuario_id']) || empty($data['fecha_reserva']) || empty($data['hora_reserva'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        return;
    }
    
    // Generar número de reserva
    $numero_reserva = 'RES-' . date('YmdHis') . rand(100, 999);
    
    // Insertar reserva
    $res_id = $db->insert('reservas', [
        'usuario_id' => $data['usuario_id'],
        'numero_reserva' => $numero_reserva,
        'fecha_reserva' => $data['fecha_reserva'],
        'hora_reserva' => $data['hora_reserva'],
        'motivo' => $data['motivo'] ?? '',
        'numero_personas' => $data['numero_personas'] ?? 1,
        'notas' => $data['notas'] ?? '',
        'estado' => 'pendiente'
    ]);
    
    if ($res_id) {
        echo json_encode([
            'success' => true,
            'message' => 'Reserva creada exitosamente',
            'data' => ['numero_reserva' => $numero_reserva, 'id' => $res_id]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear la reserva']);
    }
}

/**
 * Obtener reserva específica
 */
function handleGetReservation() {
    global $db;
    $id = intval($_GET['id'] ?? 0);
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $reservation = $db->fetchOne('SELECT * FROM reservas WHERE id = ?', [$id]);
    
    if ($reservation) {
        echo json_encode(['success' => true, 'data' => $reservation]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Reserva no encontrada']);
    }
}

/**
 * Obtener reservas del usuario
 */
function handleGetUserReservations() {
    global $db;
    $user_id = intval($_GET['user_id'] ?? $_SESSION['user']['id'] ?? 0);
    
    if (!$user_id) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autenticado']);
        return;
    }
    
    $reservations = $db->fetchAll(
        'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY fecha_reserva DESC',
        [$user_id]
    );
    
    echo json_encode(['success' => true, 'data' => $reservations]);
}

/**
 * Actualizar reserva
 */
function handleUpdateReservation() {
    global $db;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $update_data = [];
    if (isset($data['estado'])) $update_data['estado'] = $data['estado'];
    if (isset($data['confirmada_por'])) $update_data['confirmada_por'] = $data['confirmada_por'];
    if (isset($data['razon_rechazo'])) $update_data['razon_rechazo'] = $data['razon_rechazo'];
    
    if (!empty($update_data)) {
        $db->update('reservas', $update_data, 'id = ?', [$data['id']]);
    }
    
    echo json_encode(['success' => true, 'message' => 'Reserva actualizada']);
}

/**
 * Obtener todas las reservas
 */
function handleGetAllReservations() {
    global $db;
    
    $reservations = $db->fetchAll('SELECT r.*, u.nombre, u.email FROM reservas r LEFT JOIN usuarios u ON r.usuario_id = u.id ORDER BY r.fecha_reserva DESC');
    
    echo json_encode(['success' => true, 'data' => $reservations]);
}
