export function initSnippetList(listId, apiUrl, notifications) {
    const snippetList = document.getElementById(listId);

    async function fetchSnippets() {
        try {
            const response = await fetch(apiUrl);
            const snippets = await response.json();
            snippetList.innerHTML = '';
            if (!snippets || snippets.length === 0) {
                snippetList.innerHTML = '<p>No hay snippets registrados.</p>';
                return;
            }
            snippets.forEach(snippet => {
                if (!snippet || !snippet.id || !snippet.titulo || !snippet.codigo || !snippet.lenguaje) {
                    return; // Evitar renderizar snippets inválidos
                }
                const card = document.createElement('div');
                card.className = 'snippet-card';
                const usuarios = snippet.usuarios && snippet.usuarios.length > 0 
                    ? snippet.usuarios.map(id => {
                        // Mapear IDs a nombres (requiere cargar usuarios)
                        return `<span class="user-tag">${id}</span>`; // Simplificado, idealmente mapear a nombres
                    }).join(', ')
                    : 'Ninguno';
                card.innerHTML = `
                    <h3>${snippet.titulo}</h3>
                    <p><strong>Lenguaje:</strong> ${snippet.lenguaje}</p>
                    <p><strong>Usuarios asignados:</strong> ${usuarios}</p>
                    <pre>${snippet.codigo}</pre>
                    <p class="text-muted">Creado: ${new Date(snippet.creado_en).toLocaleString()}</p>
                    <div class="btn-group">
                        <button class="btn btn-warning" onclick="window.editSnippet(${snippet.id})">Editar</button>
                        <button class="btn btn-danger" onclick="window.showDeleteModal(${snippet.id})">Eliminar</button>
                    </div>
                `;
                snippetList.appendChild(card);
            });
        } catch (error) {
            notifications.showNotification('Error al cargar los snippets', 'error');
            snippetList.innerHTML = '<p>Error al cargar los snippets.</p>';
        }
    }

    return { fetchSnippets };
}