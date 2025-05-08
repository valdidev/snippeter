<?php
require_once 'config/headers.php';
require_once 'db.php';
require_once 'resources/snippets.php';
require_once 'resources/users.php';

// Obtener el método y el recurso
$method = $_SERVER['REQUEST_METHOD'];
$resource = isset($_GET['resource']) ? $_GET['resource'] : 'snippets';

switch ($resource) {
    case 'snippets':
        handleSnippets($method, $pdo);
        break;

    case 'users':
        handleUsers($method, $pdo);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Recurso no encontrado']);
        break;
}
?>