-- ============================================
-- BASE DE DATOS: ÉLITE STYLE
-- Sistema de ecommerce premium
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS elite_style;
USE elite_style;

-- ============================================
-- TABLA: ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles
INSERT INTO roles (nombre, descripcion) VALUES 
('admin', 'Administrador del sistema'),
('usuario', 'Usuario cliente regular');

-- ============================================
-- TABLA: USUARIOS/CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    rol_id INT NOT NULL DEFAULT 2,
    foto_perfil VARCHAR(255),
    estado ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: CATEGORÍAS
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen VARCHAR(255),
    slug VARCHAR(100) NOT NULL UNIQUE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion, slug) VALUES 
('Camisetas', 'Camisetas y tops para hombre y mujer', 'camisetas'),
('Pantalones', 'Jeans, pantalones y shorts', 'pantalones'),
('Vestidos', 'Vestidos elegantes y casuales', 'vestidos'),
('Accesorios', 'Bolsas, cinturones, sombreros', 'accesorios'),
('Calzado', 'Zapatos, botas, tenis', 'calzado'),
('Abrigos', 'Chaquetas y abrigos', 'abrigos');

-- ============================================
-- TABLA: PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    precio_original DECIMAL(10, 2),
    descuento INT DEFAULT 0,
    categoria_id INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    imagen_alt VARCHAR(255),
    talla VARCHAR(50),
    color VARCHAR(50),
    material VARCHAR(100),
    estado ENUM('activo', 'inactivo', 'descontinuado') DEFAULT 'activo',
    destacado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_estado (estado),
    INDEX idx_destacado (destacado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: RESEÑAS/OPINIONES
-- ============================================
CREATE TABLE IF NOT EXISTS resenas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    numero_pedido VARCHAR(50) NOT NULL UNIQUE,
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL,
    direccion_entrega TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    tipo_entrega ENUM('domicilio', 'retiro_tienda') DEFAULT 'domicilio',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    costo_envio DECIMAL(10, 2) DEFAULT 0,
    impuestos DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    metodo_pago VARCHAR(50),
    notas TEXT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio TIMESTAMP NULL,
    fecha_entrega TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ITEMS DEL PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS orden_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    talla VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    INDEX idx_pedido (pedido_id),
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: RESERVAS/CITAS
-- ============================================
CREATE TABLE IF NOT EXISTS reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    numero_reserva VARCHAR(50) NOT NULL UNIQUE,
    fecha_reserva DATE NOT NULL,
    hora_reserva TIME NOT NULL,
    motivo VARCHAR(255),
    numero_personas INT DEFAULT 1,
    notas TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    confirmada_por INT,
    fecha_confirmacion TIMESTAMP NULL,
    razon_rechazo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (confirmada_por) REFERENCES usuarios(id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_reserva),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: CONTACTOS/MENSAJES
-- ============================================
CREATE TABLE IF NOT EXISTS contactos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    telefono VARCHAR(20),
    estado ENUM('no_leido', 'leido', 'respondido') DEFAULT 'no_leido',
    respuesta TEXT,
    fecha_respuesta TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: HISTORIAL DE CAMBIOS DE STOCK
-- ============================================
CREATE TABLE IF NOT EXISTS historial_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    cantidad_anterior INT,
    cantidad_nueva INT,
    tipo_cambio ENUM('compra', 'devolución', 'ajuste_manual', 'reabastecimiento') DEFAULT 'ajuste_manual',
    razon TEXT,
    usuario_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: HISTORIAL DE AUDITORÍA
-- ============================================
CREATE TABLE IF NOT EXISTS auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    registro_id INT,
    cambios_anteriores JSON,
    cambios_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ÍNDICES ADICIONALES
-- ============================================
CREATE INDEX idx_email ON usuarios(email);
CREATE INDEX idx_nombre_producto ON productos(nombre);
CREATE INDEX idx_numero_pedido ON pedidos(numero_pedido);
CREATE INDEX idx_numero_reserva ON reservas(numero_reserva);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Productos con información de categoría
CREATE OR REPLACE VIEW vw_productos_completos AS
SELECT 
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.descuento,
    p.stock,
    p.imagen,
    c.nombre as categoria,
    c.slug as categoria_slug,
    p.estado,
    p.destacado
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.estado = 'activo';

-- Vista: Estadísticas de ventas
CREATE OR REPLACE VIEW vw_estadisticas_ventas AS
SELECT 
    DATE(ped.fecha_pedido) as fecha,
    COUNT(DISTINCT ped.id) as total_pedidos,
    COUNT(DISTINCT ped.usuario_id) as total_clientes,
    SUM(ped.total) as monto_total,
    AVG(ped.total) as promedio_pedido
FROM pedidos ped
WHERE ped.estado != 'cancelado'
GROUP BY DATE(ped.fecha_pedido);

-- Vista: Productos más vendidos
CREATE OR REPLACE VIEW vw_productos_mas_vendidos AS
SELECT 
    p.id,
    p.nombre,
    p.imagen,
    COUNT(oi.id) as total_vendidos,
    SUM(oi.subtotal) as monto_total,
    AVG(r.calificacion) as calificacion_promedio
FROM productos p
LEFT JOIN orden_items oi ON p.id = oi.producto_id
LEFT JOIN pedidos ped ON oi.pedido_id = ped.id
LEFT JOIN resenas r ON p.id = r.producto_id AND r.estado = 'aprobada'
GROUP BY p.id
ORDER BY total_vendidos DESC;

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar usuario admin
INSERT INTO usuarios (nombre, apellido, email, contrasena, telefono, rol_id, estado) VALUES 
('Admin', 'Élite Style', 'admin@elitestyle.com', '$2y$10$92IXUNpkm1rq4cmsThdCeuK7DlH5ZqVay8IQRcWMvea4Ewanak5m', '1234567890', 1, 'activo');
-- Contraseña: admin123 (hash bcrypt)

-- Insertar usuario cliente de ejemplo
INSERT INTO usuarios (nombre, apellido, email, contrasena, telefono, direccion, ciudad, rol_id, estado) VALUES 
('Juan', 'Cliente', 'juan@email.com', '$2y$10$92IXUNpkm1rq4cmsThdCeuK7DlH5ZqVay8IQRcWMvea4Ewanak5m', '9876543210', 'Calle Principal 123', 'Bogotá', 2, 'activo');
-- Contraseña: admin123

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria_id, stock, imagen, estado, destacado) VALUES 
('Camiseta Élite Negra', 'Camiseta premium de algodón 100% con bordado Élite Style', 49.99, 1, 50, 'producto_1.jpg', 'activo', TRUE),
('Jeans Premium Azul', 'Jeans ajustado de mezclilla premium con detalles dorados', 89.99, 2, 35, 'producto_2.jpg', 'activo', TRUE),
('Vestido Elegante Negro', 'Vestido de noche elegante perfecto para ocasiones especiales', 199.99, 3, 15, 'producto_3.jpg', 'activo', TRUE),
('Bolsa de Cuero Dorada', 'Bolsa de mano de cuero genuino con detalles dorados', 129.99, 4, 20, 'producto_4.jpg', 'activo', FALSE),
('Tenis Deportivos', 'Tenis cómodos y elegantes para uso diario', 79.99, 5, 40, 'producto_5.jpg', 'activo', FALSE),
('Chaqueta de Cuero', 'Chaqueta clásica de cuero genuino para hombre y mujer', 249.99, 6, 18, 'producto_6.jpg', 'activo', TRUE);

-- ============================================
-- PRIVILEGIOS
-- ============================================

-- Crear usuario para la aplicación (opcional)
-- CREATE USER 'elite_user'@'localhost' IDENTIFIED BY 'elite_password_123';
-- GRANT ALL PRIVILEGES ON elite_style.* TO 'elite_user'@'localhost';
-- FLUSH PRIVILEGES;
