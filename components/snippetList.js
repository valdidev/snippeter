export function initSnippetList(listId, apiUrl, notifications) {
  const snippetList = document.getElementById(listId);

  async function fetchSnippets() {
    try {
      const response = await fetch(apiUrl);
      const snippets = await response.json();
      snippetList.innerHTML = "";
      snippets.forEach((snippet) => {
        const card = document.createElement("div");
        card.className = "snippet-card";
        card.innerHTML = `
                    <h3>${snippet.titulo}</h3>
                    <p><strong>Lenguaje:</strong> ${snippet.lenguaje}</p>
                    <pre>${snippet.codigo}</pre>
                    <p class="text-muted">Creado: ${new Date(
                      snippet.creado_en
                    ).toLocaleString()}</p>
                    <div class="btn-group">
                        <button class="btn btn-warning" onclick="window.editSnippet(${
                          snippet.id
                        })">Editar</button>
                        <button class="btn btn-danger" onclick="window.showDeleteModal(${
                          snippet.id
                        })">Eliminar</button>
                    </div>
                `;
        snippetList.appendChild(card);
      });
    } catch (error) {
      notifications.showNotification("Error al cargar los snippets", "error");
    }
  }

  return { fetchSnippets };
}
