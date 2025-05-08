<?php
$view = isset($_GET['view']) ? $_GET['view'] : 'snippets';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snippet Keeper</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav>
            <h1>Snippet Keeper</h1>
            <ul>
                <li><a href="?view=snippets" <?= $view === 'snippets' ? 'style="font-weight: bold;"' : '' ?>>Snippets</a></li>
                <li><a href="?view=users" <?= $view === 'users' ? 'style="font-weight: bold;"' : '' ?>>Usuarios</a></li>
            </ul>
        </nav>
    </header>

    <!-- Contenedor principal -->
    <div class="container">
        <?php if ($view === 'snippets'): ?>
            <!-- Contenedor para notificaciones -->
            <div class="notification-container" id="notificationContainer"></div>

            <!-- Formulario para crear/actualizar snippets -->
            <div class="form-card">
                <h2 id="formTitle">Agregar Snippet</h2>
                <form id="snippetForm">
                    <input type="hidden" id="snippetId">
                    <div class="form-group">
                        <label for="titulo">Título</label>
                        <input type="text" class="form-input" id="titulo" required>
                    </div>
                    <div class="form-group">
                        <label for="codigo">Código</label>
                        <textarea class="form-textarea" id="codigo" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="lenguaje">Lenguaje</label>
                        <select class="form-select" id="lenguaje" required>
                            <option value="php">PHP</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary" id="submitBtn">Guardar</button>
                        <button type="button" class="btn btn-secondary" id="cancelBtn" style="display:none;">Cancelar</button>
                    </div>
                </form>
            </div>

            <!-- Lista de snippets -->
            <div id="snippetList"></div>

            <!-- Modal de confirmación -->
            <div class="modal" id="deleteModal">
                <div class="modal-content">
                    <h2>Confirmar Eliminación</h2>
                    <p>¿Estás seguro de que quieres eliminar este snippet?</p>
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" id="cancelDeleteBtn">Cancelar</button>
                        <button class="btn btn-danger" id="confirmDeleteBtn">Confirmar</button>
                    </div>
                </div>
            </div>
        <?php elseif ($view === 'users'): ?>
            <!-- Contenedor para notificaciones -->
            <div class="notification-container" id="notificationContainer"></div>

            <!-- Formulario para crear/actualizar usuarios -->
            <div class="form-card">
                <h2 id="userFormTitle">Agregar Usuario</h2>
                <form id="userForm">
                    <input type="hidden" id="userId">
                    <div class="form-group">
                        <label for="username">Nombre de usuario</label>
                        <input type="text" class="form-input" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-input" id="email" required>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary" id="userSubmitBtn">Guardar</button>
                        <button type="button" class="btn btn-secondary" id="userCancelBtn" style="display:none;">Cancelar</button>
                    </div>
                </form>
            </div>

            <!-- Lista de usuarios -->
            <div id="userList"></div>

            <!-- Modal de confirmación -->
            <div class="modal" id="userDeleteModal">
                <div class="modal-content">
                    <h2>Confirmar Eliminación</h2>
                    <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" id="userCancelDeleteBtn">Cancelar</button>
                        <button class="btn btn-danger" id="userConfirmDeleteBtn">Confirmar</button>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <h2>Vista no encontrada</h2>
            <p>Selecciona una opción del menú.</p>
        <?php endif; ?>
    </div>

    <script type="module" src="app.js"></script>
</body>
</html>