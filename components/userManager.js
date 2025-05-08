export async function fetchUsers(apiUrl, notifications) {
  try {
      console.log('Haciendo solicitud a:', `${apiUrl}?resource=users`);
      const response = await fetch(`${apiUrl}?resource=users`);
      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }
      const users = await response.json();
      if (!Array.isArray(users)) {
          throw new Error('La respuesta no es un array de usuarios');
      }
      console.log('Usuarios recibidos en fetchUsers:', users);
      return users;
  } catch (error) {
      console.error('Error al cargar usuarios:', error);
      notifications.showNotification(`Error al cargar los usuarios: ${error.message}`, "error");
      return [];
  }
}

export function initUserManager(
  modalId,
  formId,
  listId,
  deleteModalId,
  apiUrl,
  notifications
) {
  const modal = document.getElementById(modalId);
  const form = document.getElementById(formId);
  const userList = document.getElementById(listId);
  const deleteModal = document.getElementById(deleteModalId);
  const submitBtn = document.getElementById("userSubmitBtn");
  const cancelBtn = document.getElementById("userCancelBtn");
  const formTitle = document.getElementById("userFormTitle");
  const confirmDeleteBtn = document.getElementById("userConfirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("userCancelDeleteBtn");
  const openModalBtn = document.getElementById("openUserModalBtn");
  let deleteUserId = null;

  if (!form || !userList || !modal || !deleteModal) {
      console.error('Elementos requeridos no encontrados:', { form, userList, modal, deleteModal });
      notifications.showNotification('Error: Elementos de la vista de usuarios no encontrados', 'error');
      return;
  }

  // Función para renderizar usuarios
  async function renderUsers() {
      console.log('Iniciando renderizado de usuarios...');
      try {
          const users = await fetchUsers(apiUrl, notifications);
          console.log('Usuarios para renderizar:', users);

          userList.innerHTML = ''; // Limpiar la lista
          if (!users || users.length === 0) {
              console.log('No hay usuarios para mostrar');
              userList.innerHTML = '<p>No hay usuarios registrados.</p>';
              return;
          }

          users.forEach((user, index) => {
              if (!user || !user.id || !user.username || !user.email) {
                  console.warn(`Usuario inválido en la posición ${index}:`, user);
                  return;
              }
              console.log(`Renderizando usuario: ${user.username} (ID: ${user.id})`);
              const card = document.createElement('div');
              card.className = 'snippet-card';
              card.innerHTML = `
                  <h3>${user.username}</h3>
                  <p><strong>Email:</strong> ${user.email}</p>
                  <p class="text-muted">Creado: ${new Date(user.created_at).toLocaleString()}</p>
                  <div class="btn-group">
                      <button class="btn btn-warning" onclick="window.editUser(${user.id})">Editar</button>
                      <button class="btn btn-danger" onclick="window.showUserDeleteModal(${user.id})">Eliminar</button>
                  </div>
              `;
              userList.appendChild(card);
          });

          if (userList.children.length === 0) {
              console.log('Ningún usuario válido para renderizar');
              userList.innerHTML = '<p>No hay usuarios válidos para mostrar.</p>';
          }
      } catch (error) {
          console.error('Error al renderizar usuarios:', error);
          notifications.showNotification('Error al cargar los usuarios', 'error');
          userList.innerHTML = '<p>Error al cargar los usuarios.</p>';
      }
  }

  // Abrir modal para crear nuevo usuario
  openModalBtn.addEventListener('click', () => {
      resetForm();
      modal.classList.add('show');
  });

  // Enviar formulario (Crear/Actualizar)
  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('userId').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;

      console.log('Enviando formulario de usuario:', { id, username, email });

      const method = id ? 'PUT' : 'POST';
      const body = JSON.stringify({ id, username, email });

      try {
          const response = await fetch(`${apiUrl}?resource=users`, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body,
          });
          const result = await response.json();

          if (response.ok) {
              notifications.showNotification(
                  id ? 'Usuario actualizado' : 'Usuario guardado',
                  'info'
              );
              modal.classList.remove('show');
              renderUsers(); // Actualizar la lista después de guardar
          } else {
              notifications.showNotification(
                  result.error || 'Error al guardar el usuario',
                  'error'
              );
          }
      } catch (error) {
          console.error('Error al enviar formulario:', error);
          notifications.showNotification('Error de red', 'error');
      }
  });

  // Botón Cancelar (cerrar modal)
  cancelBtn.addEventListener('click', () => {
      modal.classList.remove('show');
  });

  // Editar usuario
  async function editUser(id) {
      try {
          console.log('Editando usuario con ID:', id);
          const response = await fetch(`${apiUrl}?resource=users&id=${id}`);
          const user = await response.json();
          if (user.error || !user.id) {
              notifications.showNotification(
                  user.error || 'Usuario no encontrado',
                  'error'
              );
              return;
          }
          document.getElementById('userId').value = user.id;
          document.getElementById('username').value = user.username;
          document.getElementById('email').value = user.email;
          formTitle.textContent = 'Editar Usuario';
          submitBtn.textContent = 'Actualizar';
          modal.classList.add('show');
      } catch (error) {
          console.error('Error al cargar usuario:', error);
          notifications.showNotification('Error al cargar el usuario', 'error');
      }
  }

  // Mostrar modal de eliminación
  function showUserDeleteModal(id) {
      deleteUserId = id;
      deleteModal.classList.add('show');
  }

  // Confirmar eliminación
  confirmDeleteBtn.addEventListener('click', async () => {
      if (deleteUserId) {
          try {
              console.log('Eliminando usuario con ID:', deleteUserId);
              const response = await fetch(
                  `${apiUrl}?resource=users&id=${deleteUserId}`,
                  { method: 'DELETE' }
              );
              const result = await response.json();
              if (response.ok) {
                  notifications.showNotification(result.mensaje, 'success');
                  renderUsers(); // Actualizar la lista después de eliminar
              } else {
                  notifications.showNotification(
                      result.error || 'Error al eliminar el usuario',
                      'error'
                  );
              }
          } catch (error) {
              console.error('Error al eliminar usuario:', error);
              notifications.showNotification('Error de red', 'error');
          }
      }
      deleteModal.classList.remove('show');
      deleteUserId = null;
  });

  // Cancelar eliminación
  cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.classList.remove('show');
      deleteUserId = null;
  });

  // Reiniciar formulario
  function resetForm() {
      form.reset();
      document.getElementById('userId').value = '';
      formTitle.textContent = 'Agregar Usuario';
      submitBtn.textContent = 'Guardar';
  }

  // Exponer funciones al ámbito global para los botones inline
  window.editUser = editUser;
  window.showUserDeleteModal = showUserDeleteModal;

  // Cargar usuarios al iniciar
  renderUsers();

  return { fetchUsers: () => fetchUsers(apiUrl, notifications) };
}