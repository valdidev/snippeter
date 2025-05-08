<?php
require_once 'utils/helpers.php';

function handleUsers($method, $pdo)
{
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
}
