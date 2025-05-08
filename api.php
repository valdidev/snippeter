<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir CORS para el frontend
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require 'db.php';

// Obtener el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Función para sanitizar entradas
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

switch ($method) {
    // LEER: Obtener todos los snippets o uno específico
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM snippets WHERE id = ?");
            $stmt->execute([$id]);
            $snippet = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($snippet ?: ['error' => 'Snippet no encontrado']);
        } else {
            $stmt = $pdo->query("SELECT * FROM snippets ORDER BY creado_en DESC");
            $snippets = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($snippets);
        }
        break;

    // CREAR: Agregar un nuevo snippet
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $titulo = sanitize($data['titulo'] ?? '');
        $codigo = sanitize($data['codigo'] ?? '');
        $lenguaje = sanitize($data['lenguaje'] ?? '');

        if (empty($titulo) || empty($codigo) || empty($lenguaje)) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos obligatorios']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO snippets (titulo, codigo, lenguaje) VALUES (?, ?, ?)");
        $stmt->execute([$titulo, $codigo, $lenguaje]);
        echo json_encode(['mensaje' => 'Snippet creado', 'id' => $pdo->lastInsertId()]);
        break;

    // ACTUALIZAR: Editar un snippet existente
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id'] ?? 0);
        $titulo = sanitize($data['titulo'] ?? '');
        $codigo = sanitize($data['codigo'] ?? '');
        $lenguaje = sanitize($data['lenguaje'] ?? '');

        if ($id <= 0 || empty($titulo) || empty($codigo) || empty($lenguaje)) {
            http_response_code(400);
            echo json_encode(['error' => 'Campos inválidos o faltantes']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE snippets SET titulo = ?, codigo = ?, lenguaje = ? WHERE id = ?");
        $stmt->execute([$titulo, $codigo, $lenguaje, $id]);
        echo json_encode(['mensaje' => 'Snippet actualizado']);
        break;

    // ELIMINAR: Borrar un snippet
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'ID inválido']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM snippets WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensaje' => 'Snippet eliminado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>