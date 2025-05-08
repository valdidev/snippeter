const API_URL = '/api/index.php';

// Función para cargar y mostrar snippets
async function loadSnippets() {
    const response = await fetch(`${API_URL}?resource=snippets`);
    const snippets = await response.json();
    const snippetsList = document.getElementById('snippets-list');
    snippetsList.innerHTML = '';
    snippets.forEach(snippet => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${snippet.titulo}</strong> (${snippet.lenguaje})<br>
            <pre>${snippet.codigo}</pre>
            <small>Creado: ${snippet.creado_en}</small>
        `;
        snippetsList.appendChild(div);
    });
}

// Función para cargar y mostrar usuarios
async function loadUsers() {
    const response = await fetch(`${API_URL}?resource=users`);
    const users = await response.json();
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${user.username}</strong><br>
            Email: ${user.email}<br>
            <small>Creado: ${user.created_at}</small>
        `;
        usersList.appendChild(div);
    });
}

// Manejar el formulario de snippets
document.getElementById('snippet-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('snippet-titulo').value;
    const codigo = document.getElementById('snippet-codigo').value;
    const lenguaje = document.getElementById('snippet-lenguaje').value;

    const response = await fetch(`${API_URL}?resource=snippets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, codigo, lenguaje })
    });

    const result = await response.json();
    alert(result.mensaje || result.error);
    if (response.ok) {
        document.getElementById('snippet-form').reset();
        loadSnippets();
    }
});

// Manejar el formulario de usuarios
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('user-username').value;
    const email = document.getElementById('user-email').value;

    const response = await fetch(`${API_URL}?resource=users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
    });

    const result = await response.json();
    alert(result.mensaje || result.error);
    if (response.ok) {
        document.getElementById('user-form').reset();
        loadUsers();
    }
});

// Cargar datos iniciales
loadSnippets();
loadUsers();