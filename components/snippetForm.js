import { fetchUsers } from './userManager.js';

export function initSnippetForm(modalId, formId, apiUrl, notifications, fetchSnippets) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById('snippetSubmitBtn');
    const cancelBtn = document.getElementById('snippetCancelBtn');
    const formTitle = document.getElementById('snippetFormTitle');
    const openModalBtn = document.getElementById('openSnippetModalBtn');
    const usuariosSelect = document.getElementById('usuarios');

    if (!form || !modal || !usuariosSelect) {
        console.error('Elementos del formulario no encontrados:', { form, modal, usuariosSelect });
        notifications.showNotification('Error: Elementos del formulario no encontrados', 'error');
        return;
    }

    // Cargar lista de usuarios en el select
    async function loadUsers() {
        try {
            console.log('Iniciando carga de usuarios...');
            const users = await fetchUsers(apiUrl, notifications);
            console.log('Usuarios recibidos en loadUsers:', users);

            usuariosSelect.innerHTML = '';
            if (!users || users.length === 0) {
                console.log('No se encontraron usuarios');
                usuariosSelect.innerHTML = '<option value="" disabled>No hay usuarios disponibles</option>';
            } else {
                console.log('Renderizando', users.length, 'usuarios');
                users.forEach(user => {
                    if (user.id && user.username) {
                        const option = document.createElement('option');
                        option.value = user.id;
                        option.textContent = user.username;
                        usuariosSelect.appendChild(option);
                    } else {
                        console.warn('Usuario inválido:', user);
                    }
                });
                if (usuariosSelect.options.length === 0) {
                    console.log('Ningún usuario válido para renderizar');
                    usuariosSelect.innerHTML = '<option value="" disabled>No hay usuarios válidos</option>';
                }
            }
        } catch (error) {
            console.error('Error en loadUsers:', error);
            notifications.showNotification('Error al cargar los usuarios', 'error');
            usuariosSelect.innerHTML = '<option value="" disabled>Error al cargar usuarios</option>';
        }
    }

    // Abrir modal para crear nuevo snippet
    openModalBtn.addEventListener('click', () => {
        console.log('Abriendo modal y cargando usuarios');
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
        const usuarios = Array.from(usuariosSelect.selectedOptions)
            .map(option => parseInt(option.value))
            .filter(id => !isNaN(id)); // Filtrar valores no válidos

        console.log('Enviando formulario con usuarios:', usuarios);

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
            console.error('Error al enviar formulario:', error);
            notifications.showNotification('Error de red', 'error');
        }
    });

    // Botón Cancelar (cerrar modal)
    cancelBtn.addEventListener('click', () => {
        console.log('Cerrando modal');
        modal.classList.remove('show');
    });

    // Editar snippet
    async function editSnippet(id) {
        try {
            console.log('Editando snippet con ID:', id);
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
            if (snippet.usuarios && Array.isArray(snippet.usuarios)) {
                console.log('Usuarios asignados al snippet:', snippet.usuarios);
                Array.from(usuariosSelect.options).forEach(option => {
                    option.selected = snippet.usuarios.includes(parseInt(option.value));
                });
            } else {
                console.log('No hay usuarios asignados al snippet');
            }
            
            modal.classList.add('show');
        } catch (error) {
            console.error('Error al cargar snippet:', error);
            notifications.showNotification('Error al cargar el snippet', 'error');
        }
    }

    // Reiniciar formulario
    function resetForm() {
        console.log('Reiniciando formulario');
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