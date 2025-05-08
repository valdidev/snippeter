<!-- Contenedor para notificaciones -->
<div class="notification-container" id="notificationContainer"></div>

<!-- Botón para abrir el modal de creación -->
<button class="btn-add" id="openSnippetModalBtn">+</button>

<!-- Lista de snippets -->
<div id="snippetList"></div>

<!-- Modal para crear/editar snippets -->
<div class="modal" id="snippetFormModal">
    <div class="modal-content">
        <h2 id="snippetFormTitle">Agregar Snippet</h2>
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
                <button type="submit" class="btn btn-primary" id="snippetSubmitBtn">Guardar</button>
                <button type="button" class="btn btn-secondary" id="snippetCancelBtn">Cancelar</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal de confirmación para eliminación -->
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