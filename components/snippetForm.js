export function initSnippetForm(modalId, formId, apiUrl, notifications, fetchSnippets) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById('snippetSubmitBtn');
    const cancelBtn = document.getElementById('snippetCancelBtn');
    const formTitle = document.getElementById('snippetFormTitle');
    const openModalBtn = document.getElementById('openSnippetModalBtn');

    if (!form || !modal) return;

    // Abrir modal para crear nuevo snippet
    openModalBtn.addEventListener('click', () => {
        resetForm();
        modal.classList.add('show');
    });

    // Enviar formulario (Crear/Actualizar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('snippetId').value;
        const titulo = document.getElementById('titulo').value;
        const codigo = document.getElementById('codigo').value;
        const lenguaje = document.getElementById('lenguaje').value;

        const method = id ? 'PUT' : 'POST';
        const body = JSON.stringify({ id, titulo, codigo, lenguaje });

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
    }

    // Exponer editSnippet al ámbito global para los botones inline
    window.editSnippet = editSnippet;

    return { editSnippet };
}