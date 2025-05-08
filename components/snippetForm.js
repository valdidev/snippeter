import { fetchUsers } from './userManager.js';

export function initSnippetForm(modalId, formId, apiUrl, notifications, fetchSnippets) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById('snippetSubmitBtn');
    const cancelBtn = document.getElementById('snippetCancelBtn');
    const formTitle = document.getElementById('snippetFormTitle');
    const openModalBtn = document.getElementById('openSnippetModalBtn');
    const usuariosSelect = document.getElementById('usuarios');

    if (!form || !modal || !usuariosSelect) return;

    // Cargar lista de usuarios en el select
    async function loadUsers() {
        try {
            const users = await fetchUsers(apiUrl, notifications);
            usuariosSelect.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                usuariosSelect.appendChild(option);
            });
        } catch (error) {
            notifications.showNotification('Error al cargar los usuarios', 'error');
        }
    }

    // Abrir modal para crear nuevo snippet
    openModalBtn.addEventListener('click', () => {
        resetForm();
        loadUsers();
        modal.classList.add('show');
    });

    // Enviar formulario (Crear/Actualizar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('snippetId').value;
        const titulo = document.getElementById('titulo').value;
        const codigo = document.getElementById('codigo').value;
        const lenguaje = document.getElementById('lenguaje').value;
        const usuarios = Array.from(usuariosSelect.selectedOptions).map(option => parseInt(option.value));

        const method = id ? 'PUT' : 'POST';
        const body = JSON.stringify({ id, titulo, codigo, lenguaje, usuarios });

        try {
            const response = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            });
            const result = await response.json();

            if (response.ok) {
                notifications.showNotification(id ? 'Snippet actualizado' : 'Snippet guardado', 'info');
                modal.classList.remove('show');
                fetchSnippets();
            } else {
                notifications.showNotification(result.error || 'Error al guardar el snippet', 'error');
            }
        } catch (error) {
            notifications.showNotification('Error de red', 'error');
        }
    });

    // Botón Cancelar (cerrar modal)
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Editar snippet
    async function editSnippet(id) {
        try {
            const response = await fetch(`${apiUrl}?id=${id}`);
            const snippet = await response.json();
            if (snippet.error || !snippet.id) {
                notifications.showNotification(snippet.error || 'Snippet no encontrado', 'error');
                return;
            }
            document.getElementById('snippetId').value = snippet.id;
            document.getElementById('titulo').value = snippet.titulo;
            document.getElementById('codigo').value = snippet.codigo;
            document.getElementById('lenguaje').value = snippet.lenguaje;
            formTitle.textContent = 'Editar Snippet';
            submitBtn.textContent = 'Actualizar';
            
            // Cargar usuarios y marcar los asignados
            await loadUsers();
            if (snippet.usuarios) {
                Array.from(usuariosSelect.options).forEach(option => {
                    option.selected = snippet.usuarios.includes(parseInt(option.value));
                });
            }
            
            modal.classList.add('show');
        } catch (error) {
            notifications.showNotification('Error al cargar el snippet', 'error');
        }
    }

    // Reiniciar formulario
    function resetForm() {
        form.reset();
        document.getElementById('snippetId').value = '';
        formTitle.textContent = 'Agregar Snippet';
        submitBtn.textContent = 'Guardar';
        usuariosSelect.innerHTML = '';
    }

    // Exponer editSnippet al ámbito global para los botones inline
    window.editSnippet = editSnippet;

    return { editSnippet };
}