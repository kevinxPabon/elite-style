# 🎀 Élite Style - Tienda Online Premium

Una aplicación web completa, moderna y profesional para la venta de ropa y accesorios con diseño premium oscuro con detalles dorados.

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript, Fetch API, LocalStorage
- **Backend**: PHP, Node.js, Express.js
- **Base de Datos**: MySQL
- **Diseño**: Responsive, Animaciones modernas, Font Awesome
- **Servidor**: XAMPP compatible

## 📁 Estructura del Proyecto

```
elite-style/
├── frontend/
│   ├── index.html              (Página principal)
│   ├── css/
│   │   ├── style.css           (Estilos principales)
│   │   ├── responsive.css      (Diseño responsive)
│   │   └── animations.css      (Animaciones)
│   ├── js/
│   │   ├── main.js             (Script principal)
│   │   ├── auth.js             (Autenticación)
│   │   ├── cart.js             (Carrito de compras)
│   │   ├── products.js         (Productos)
│   │   └── api.js              (Llamadas API)
│   ├── pages/
│   │   ├── products.html       (Catálogo)
│   │   ├── cart.html           (Carrito)
│   │   ├── login.html          (Iniciar sesión)
│   │   ├── register.html       (Registro)
│   │   ├── user-panel.html     (Panel de usuario)
│   │   ├── admin-panel.html    (Panel de administrador)
│   │   ├── reservas.html       (Sistema de reservas)
│   │   └── checkout.html       (Finalizar compra)
│   └── img/
│       └── (Imágenes del proyecto)
│
├── backend/
│   ├── config/
│   │   ├── config.php          (Configuración)
│   │   └── db.php              (Conexión BD)
│   ├── api/
│   │   ├── productos.php       (API Productos)
│   │   ├── usuarios.php        (API Usuarios)
│   │   ├── pedidos.php         (API Pedidos)
│   │   ├── reservas.php        (API Reservas)
│   │   └── auth.php            (API Autenticación)
│   ├── uploads/                (Carpeta de subida de imágenes)
│   └── index.php               (Rutas principales)
│
├── server/
│   ├── app.js                  (Servidor Express)
│   ├── package.json            (Dependencias Node.js)
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── uploads/
│
├── database/
│   ├── elite_style.sql         (Script SQL completo)
│   └── init.php                (Inicializar BD)
│
└── .htaccess                   (Configuración Apache)
```

## ⚙️ Instalación Rápida

1. Clonar repositorio
2. Copiar en `htdocs/` de XAMPP
3. Importar `database/elite_style.sql` en phpMyAdmin
4. Configurar `backend/config/config.php`
5. Acceder a: `http://localhost/elite-style/frontend/`

## ✨ Funcionalidades

✅ Sistema de usuarios (Registro, Login, Roles)
✅ Ecommerce completo (Catálogo, Carrito, Pedidos)
✅ Panel de Administrador (Estadísticas, CRUD Productos)
✅ Sistema de Reservas/Citas
✅ API REST completa
✅ Diseño responsive y animaciones
✅ LocalStorage para carrito
✅ Contraseñas cifradas
✅ Base de datos relacional

---

**Versión**: 1.0.0 | **Autor**: Kevin Pabon
