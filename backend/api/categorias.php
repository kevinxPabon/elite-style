<?php
/**
 * ============================================
 * API DE CATEGORÍAS
 * ============================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

try {
    $db = Database::getInstance();
    
    $categories = $db->fetchAll(
        'SELECT * FROM categorias WHERE estado = "activo" ORDER BY nombre'
    );
    
    echo json_encode(['success' => true, 'data' => $categories]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
