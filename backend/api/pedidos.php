<?php
/**
 * ============================================
 * API DE PEDIDOS
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
            handleCreateOrder();
            break;
        
        case 'get':
            handleGetOrder();
            break;
        
        case 'user':
            handleGetUserOrders();
            break;
        
        case 'update':
            handleUpdateOrder();
            break;
        
        default:
            handleGetAllOrders();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

/**
 * Crear pedido
 */
function handleCreateOrder() {
    global $db;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['usuario_id']) || empty($data['items'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        return;
    }
    
    // Generar número de pedido
    $numero_pedido = 'PED-' . date('YmdHis') . rand(100, 999);
    
    // Insertar pedido
    $order_id = $db->insert('pedidos', [
        'usuario_id' => $data['usuario_id'],
        'numero_pedido' => $numero_pedido,
        'nombre_cliente' => $data['nombre_cliente'],
        'email_cliente' => $data['email_cliente'],
        'telefono_cliente' => $data['telefono_cliente'],
        'direccion_entrega' => $data['direccion_entrega'],
        'ciudad' => $data['ciudad'],
        'codigo_postal' => $data['codigo_postal'] ?? '',
        'tipo_entrega' => $data['tipo_entrega'] ?? 'domicilio',
        'subtotal' => $data['subtotal'],
        'costo_envio' => $data['costo_envio'] ?? 0,
        'impuestos' => $data['impuestos'] ?? 0,
        'total' => $data['total'],
        'estado' => 'pendiente',
        'notas' => $data['notas'] ?? ''
    ]);
    
    if (!$order_id) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear el pedido']);
        return;
    }
    
    // Insertar items del pedido
    foreach ($data['items'] as $item) {
        $db->insert('orden_items', [
            'pedido_id' => $order_id,
            'producto_id' => $item['id'],
            'cantidad' => $item['quantity'],
            'precio_unitario' => $item['price'],
            'subtotal' => $item['price'] * $item['quantity']
        ]);
        
        // Actualizar stock del producto
        $db->execute(
            'UPDATE productos SET stock = stock - ? WHERE id = ?',
            [$item['quantity'], $item['id']]
        );
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Pedido creado exitosamente',
        'data' => ['numero_pedido' => $numero_pedido, 'id' => $order_id]
    ]);
}

/**
 * Obtener pedido específico
 */
function handleGetOrder() {
    global $db;
    $id = intval($_GET['id'] ?? 0);
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $order = $db->fetchOne('SELECT * FROM pedidos WHERE id = ?', [$id]);
    
    if ($order) {
        $items = $db->fetchAll('SELECT * FROM orden_items WHERE pedido_id = ?', [$id]);
        $order['items'] = $items;
        echo json_encode(['success' => true, 'data' => $order]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Pedido no encontrado']);
    }
}

/**
 * Obtener pedidos del usuario
 */
function handleGetUserOrders() {
    global $db;
    $user_id = intval($_GET['user_id'] ?? $_SESSION['user']['id'] ?? 0);
    
    if (!$user_id) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autenticado']);
        return;
    }
    
    $orders = $db->fetchAll(
        'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC',
        [$user_id]
    );
    
    echo json_encode(['success' => true, 'data' => $orders]);
}

/**
 * Actualizar estado del pedido
 */
function handleUpdateOrder() {
    global $db;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id']) || empty($data['estado'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        return;
    }
    
    $db->update('pedidos', ['estado' => $data['estado']], 'id = ?', [$data['id']]);
    
    echo json_encode(['success' => true, 'message' => 'Pedido actualizado']);
}

/**
 * Obtener todos los pedidos
 */
function handleGetAllOrders() {
    global $db;
    
    $orders = $db->fetchAll('SELECT * FROM pedidos ORDER BY fecha_pedido DESC');
    
    echo json_encode(['success' => true, 'data' => $orders]);
}
