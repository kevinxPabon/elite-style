<?php
/**
 * ============================================
 * API DE CONTACTO
 * ============================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$db = Database::getInstance();

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['nombre']) || empty($data['email']) || empty($data['asunto']) || empty($data['mensaje'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }
    
    // Validar email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email inválido']);
        exit;
    }
    
    // Insertar contacto
    $contact_id = $db->insert('contactos', [
        'nombre' => $data['nombre'],
        'email' => $data['email'],
        'asunto' => $data['asunto'],
        'mensaje' => $data['mensaje'],
        'telefono' => $data['telefono'] ?? '',
        'estado' => 'no_leido'
    ]);
    
    if ($contact_id) {
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.',
            'data' => ['id' => $contact_id]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al enviar el mensaje']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
