<!-- Contenedor para notificaciones -->
<div class="notification-container" id="notificationContainer"></div>

<!-- Botón para abrir el modal de creación -->
<button class="btn-add" id="openUserModalBtn">+</button>

<!-- Lista de usuarios -->
<div id="userList"></div>

<!-- Modal para crear/editar usuarios -->
<div class="modal" id="userFormModal">
    <div class="modal-content">
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
                <button type="button" class="btn btn-secondary" id="userCancelBtn">Cancelar</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal de confirmación para eliminación -->
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