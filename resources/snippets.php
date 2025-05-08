<?php
require_once 'utils/helpers.php';

function handleSnippets($method, $pdo)
{
    switch ($method) {
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
}
