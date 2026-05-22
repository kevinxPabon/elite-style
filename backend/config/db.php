<?php
/**
 * ============================================
 * CONEXIÓN A BASE DE DATOS
 * ============================================
 */

require_once __DIR__ . '/config.php';

class Database {
    private static $instance = null;
    private $connection;
    private $lastError = null;
    private $lastQuery = null;

    /**
     * Constructor privado para patrón Singleton
     */
    private function __construct() {
        $this->connect();
    }

    /**
     * Obtener instancia única de la conexión
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Conectar a la base de datos
     */
    private function connect() {
        try {
            $this->connection = new mysqli(
                DB_HOST,
                DB_USER,
                DB_PASS,
                DB_NAME
            );

            // Verificar conexión
            if ($this->connection->connect_error) {
                throw new Exception("Error de conexión: " . $this->connection->connect_error);
            }

            // Establecer charset
            $this->connection->set_charset(DB_CHARSET);

            // Log de éxito
            if (LOG_ERRORS) {
                error_log("[" . date('Y-m-d H:i:s') . "] Conexión a BD establecida correctamente");
            }

        } catch (Exception $e) {
            $this->lastError = $e->getMessage();
            if (LOG_ERRORS) {
                error_log("[" . date('Y-m-d H:i:s') . "] Error de conexión: " . $e->getMessage());
            }
            die("Error: No se pudo conectar a la base de datos");
        }
    }

    /**
     * Obtener conexión
     */
    public function getConnection() {
        return $this->connection;
    }

    /**
     * Preparar y ejecutar consulta
     */
    public function execute($query, $params = [], $types = null) {
        try {
            $this->lastQuery = $query;

            // Si hay parámetros, preparar statement
            if (!empty($params)) {
                $stmt = $this->connection->prepare($query);
                
                if (!$stmt) {
                    throw new Exception("Error al preparar: " . $this->connection->error);
                }

                // Bindear parámetros
                if (!empty($types)) {
                    $stmt->bind_param($types, ...$params);
                } else {
                    // Detectar tipos automáticamente
                    $types = $this->detectTypes($params);
                    $stmt->bind_param($types, ...$params);
                }

                // Ejecutar
                if (!$stmt->execute()) {
                    throw new Exception("Error al ejecutar: " . $stmt->error);
                }

                return $stmt;
            } else {
                // Ejecutar sin parámetros
                if (!$this->connection->query($query)) {
                    throw new Exception("Error en consulta: " . $this->connection->error);
                }
                return true;
            }

        } catch (Exception $e) {
            $this->lastError = $e->getMessage();
            if (LOG_ERRORS) {
                error_log("[" . date('Y-m-d H:i:s') . "] Error BD: " . $e->getMessage());
                error_log("Query: " . $query);
            }
            return false;
        }
    }

    /**
     * Obtener un registro
     */
    public function fetchOne($query, $params = []) {
        $stmt = $this->execute($query, $params);
        
        if (!$stmt) {
            return null;
        }

        if ($stmt === true) {
            return null;
        }

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        return $row;
    }

    /**
     * Obtener múltiples registros
     */
    public function fetchAll($query, $params = []) {
        $stmt = $this->execute($query, $params);
        
        if (!$stmt) {
            return [];
        }

        if ($stmt === true) {
            return [];
        }

        $result = $stmt->get_result();
        $rows = [];

        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }

        $stmt->close();

        return $rows;
    }

    /**
     * Insertar registro
     */
    public function insert($table, $data) {
        $fields = array_keys($data);
        $values = array_values($data);
        $placeholders = array_fill(0, count($data), '?');

        $query = "INSERT INTO {$table} (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";

        $stmt = $this->execute($query, $values);

        if ($stmt && $stmt !== true) {
            $stmt->close();
        }

        return $this->connection->insert_id ?? false;
    }

    /**
     * Actualizar registros
     */
    public function update($table, $data, $where = '', $params = []) {
        $sets = [];

        foreach (array_keys($data) as $field) {
            $sets[] = "{$field} = ?";
        }

        $values = array_merge(array_values($data), $params);
        $query = "UPDATE {$table} SET " . implode(', ', $sets);

        if (!empty($where)) {
            $query .= " WHERE {$where}";
        }

        $stmt = $this->execute($query, $values);

        if ($stmt && $stmt !== true) {
            $stmt->close();
        }

        return $this->connection->affected_rows;
    }

    /**
     * Eliminar registros
     */
    public function delete($table, $where = '', $params = []) {
        $query = "DELETE FROM {$table}";

        if (!empty($where)) {
            $query .= " WHERE {$where}";
        } else {
            throw new Exception("Operación DELETE sin cláusula WHERE no permitida");
        }

        $stmt = $this->execute($query, $params);

        if ($stmt && $stmt !== true) {
            $stmt->close();
        }

        return $this->connection->affected_rows;
    }

    /**
     * Contar registros
     */
    public function count($table, $where = '', $params = []) {
        $query = "SELECT COUNT(*) as total FROM {$table}";

        if (!empty($where)) {
            $query .= " WHERE {$where}";
        }

        $result = $this->fetchOne($query, $params);

        return $result['total'] ?? 0;
    }

    /**
     * Detectar tipos de parámetros
     */
    private function detectTypes($params) {
        $types = '';

        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } elseif (is_string($param)) {
                $types .= 's';
            } else {
                $types .= 's';
            }
        }

        return $types;
    }

    /**
     * Obtener último error
     */
    public function getLastError() {
        return $this->lastError;
    }

    /**
     * Obtener última consulta
     */
    public function getLastQuery() {
        return $this->lastQuery;
    }

    /**
     * Iniciar transacción
     */
    public function beginTransaction() {
        return $this->connection->begin_transaction();
    }

    /**
     * Confirmar transacción
     */
    public function commit() {
        return $this->connection->commit();
    }

    /**
     * Revertir transacción
     */
    public function rollback() {
        return $this->connection->rollback();
    }

    /**
     * Cerrar conexión
     */
    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }

    /**
     * Destructor
     */
    public function __destruct() {
        $this->close();
    }
}

// Crear instancia global para uso rápido
$db = Database::getInstance();
