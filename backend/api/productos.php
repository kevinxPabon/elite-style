<?php
/**
 * ============================================
 * API DE PRODUCTOS
 * ============================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

try {
    $db = Database::getInstance();
    
    if (isset($_GET['id'])) {
        // Obtener un producto específico
        $id = intval($_GET['id']);
        $product = $db->fetchOne(
            'SELECT p.*, c.nombre as categoria FROM productos p 
             LEFT JOIN categorias c ON p.categoria_id = c.id 
             WHERE p.id = ? AND p.estado = "activo"',
            [$id]
        );
        
        if ($product) {
            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Producto no encontrado']);
        }
    } else {
        // Obtener todos los productos
        $products = $db->fetchAll(
            'SELECT p.*, c.nombre as categoria FROM productos p 
             LEFT JOIN categorias c ON p.categoria_id = c.id 
             WHERE p.estado = "activo" 
             ORDER BY p.destacado DESC, p.fecha_creacion DESC'
        );
        
        echo json_encode(['success' => true, 'data' => $products]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
