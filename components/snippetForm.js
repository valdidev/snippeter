export function initSnippetForm(formId, apiUrl, notifications, fetchSnippets) {
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');

    if (!form) return;

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
                resetForm();
                fetchSnippets();
            } else {
                notifications.showNotification(result.error || 'Error al guardar el snippet', 'error');
            }
        } catch (error) {
            notifications.showNotification('Error de red', 'error');
        }
    });

    cancelBtn.addEventListener('click', resetForm);

    async function editSnippet(id) {
        try {
            const response = await fetch(`${apiUrl}?id=${id}`);
            const snippet = await response.json();
            if (snippet.error) {
                notifications.showNotification(snippet.error, 'error');
                return;
            }
            document.getElementById('snippetId').value = snippet.id;
            document.getElementById('titulo').value = snippet.titulo;
            document.getElementById('codigo').value = snippet.codigo;
            document.getElementById('lenguaje').value = snippet.lenguaje;
            formTitle.textContent = 'Editar Snippet';
            submitBtn.textContent = 'Actualizar';
            cancelBtn.style.display = 'inline-block';
        } catch (error) {
            notifications.showNotification('Error al cargar el snippet', 'error');
        }
    }

    function resetForm() {
        form.reset();
        document.getElementById('snippetId').value = '';
        formTitle.textContent = 'Agregar Snippet';
        submitBtn.textContent = 'Guardar';
        cancelBtn.style.display = 'none';
    }

    return { editSnippet };
}