<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require 'db.php';

// Obtener el método y el recurso
$method = $_SERVER['REQUEST_METHOD'];
$resource = isset($_GET['resource']) ? $_GET['resource'] : 'snippets';

// Función para sanitizar entradas
function sanitize($data)
{
    return htmlspecialchars(strip_tags(trim($data)));
}

switch ($resource) {
    case 'snippets':
        switch ($method) {
            // LEER: Obtener todos los snippets o uno específico
            case 'GET':
                if (isset($_GET['id'])) {
                    $id = intval($_GET['id']);
                    $stmt = $pdo->prepare("sELECT * FROM snippets WHERE id = ?");
                    $stmt->execute([$id]);
                    $snippet = $stmt->fetch(PDO::FETCH_ASSOC);
                    echo json_encode($snippet ?: ['error' => 'Snippet no encontrado']);
                } else {
                    $stmt = $pdo->query("sELECT * FROM snippets ORDER BY creado_en DESC");
                    $snippets = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($snippets ?: []);
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

                $stmt = $pdo->prepare("iNSERT INTO snippets (titulo, codigo, lenguaje) VALUES (?, ?, ?)");
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

                $stmt = $pdo->prepare("uPDATE snippets sET titulo = ?, codigo = ?, lenguaje = ? WHERE id = ?");
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

                $stmt = $pdo->prepare("dELETE FROM snippets WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['mensaje' => 'Snippet eliminado']);
                break;

            default:
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                break;
        }
        break;

    case 'users':
        switch ($method) {
            // LEER: Obtener todos los usuarios o uno específico
            case 'GET':
                if (isset($_GET['id'])) {
                    $id = intval($_GET['id']);
                    $stmt = $pdo->prepare("sELECT * FROM users WHERE id = ?");
                    $stmt->execute([$id]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                    echo json_encode($user ?: ['error' => 'Usuario no encontrado']);
                } else {
                    $stmt = $pdo->query("sELECT * FROM users ORDER BY created_at DESC");
                    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($users ?: []);
                }
                break;

            // CREAR: Agregar un nuevo usuario
            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                $username = sanitize($data['username'] ?? '');
                $email = sanitize($data['email'] ?? '');

                if (empty($username) || empty($email)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Faltan campos obligatorios']);
                    exit;
                }

                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Email inválido']);
                    exit;
                }

                try {
                    $stmt = $pdo->prepare("iNSERT INTO users (username, email) VALUES (?, ?)");
                    $stmt->execute([$username, $email]);
                    echo json_encode(['mensaje' => 'Usuario creado', 'id' => $pdo->lastInsertId()]);
                } catch (PDOException $e) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Usuario o email ya existe']);
                }
                break;

            // ACTUALIZAR: Editar un usuario existente
            case 'PUT':
                $data = json_decode(file_get_contents('php://input'), true);
                $id = intval($data['id'] ?? 0);
                $username = sanitize($data['username'] ?? '');
                $email = sanitize($data['email'] ?? '');

                if ($id <= 0 || empty($username) || empty($email)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Campos inválidos o faltantes']);
                    exit;
                }

                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Email inválido']);
                    exit;
                }

                try {
                    $stmt = $pdo->prepare("uPDATE users sET username = ?, email = ? WHERE id = ?");
                    $stmt->execute([$username, $email, $id]);
                    echo json_encode(['mensaje' => 'Usuario actualizado']);
                } catch (PDOException $e) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Usuario o email ya existe']);
                }
                break;

            // ELIMINAR: Borrar un usuario
            case 'DELETE':
                $id = intval($_GET['id'] ?? 0);
                if ($id <= 0) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID inválido']);
                    exit;
                }

                $stmt = $pdo->prepare("dELETE FROM users WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['mensaje' => 'Usuario eliminado']);
                break;

            default:
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                break;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Recurso no encontrado']);
        break;
}
