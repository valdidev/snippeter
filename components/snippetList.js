import { fetchUsers } from './userManager.js';

export function initSnippetList(listId, apiUrl, notifications) {
    const snippetList = document.getElementById(listId);

    async function fetchSnippets() {
        try {
            const response = await fetch(apiUrl);
            const snippets = await response.json();
            const users = await fetchUsers(apiUrl, notifications);
            const userMap = users.reduce((map, user) => {
                map[user.id] = user.username;
                return map;
            }, {});

            console.log('Snippets recibidos:', snippets);
            console.log('Mapa de usuarios:', userMap);

            snippetList.innerHTML = '';
            if (!snippets || snippets.length === 0) {
                snippetList.innerHTML = '<p>No hay snippets registrados.</p>';
                return;
            }

            snippets.forEach(snippet => {
                if (!snippet || !snippet.id || !snippet.titulo || !snippet.codigo || !snippet.lenguaje) {
                    console.warn('Snippet inválido:', snippet);
                    return;
                }

                const usuarios = snippet.usuarios && Array.isArray(snippet.usuarios) && snippet.usuarios.length > 0
                    ? snippet.usuarios.map(id => `<span class="user-tag">${userMap[id] || id}</span>`).join(', ')
                    : 'Ninguno';
                const numUsuarios = snippet.usuarios && Array.isArray(snippet.usuarios) ? snippet.usuarios.length : 0;

                console.log(`Snippet ${snippet.id}: ${numUsuarios} usuarios asignados`, snippet.usuarios);

                const card = document.createElement('div');
                card.className = 'snippet-card';
                card.innerHTML = `
                    <h3>${snippet.titulo}</h3>
                    <p><strong>Lenguaje:</strong> ${snippet.lenguaje}</p>
                    <p><strong>Usuarios asignados (${numUsuarios}):</strong> ${usuarios}</p>
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
            console.error('Error al cargar snippets:', error);
            notifications.showNotification('Error al cargar los snippets', 'error');
            snippetList.innerHTML = '<p>Error al cargar los snippets.</p>';
        }
    }

    return { fetchSnippets };
}