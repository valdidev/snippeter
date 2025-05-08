export function initDeleteModal(modalId, apiUrl, notifications, fetchSnippets) {
  const deleteModal = document.getElementById(modalId);
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  let deleteSnippetId = null;

  function showDeleteModal(id) {
    deleteSnippetId = id;
    deleteModal.classList.add("show");
  }

  confirmDeleteBtn.addEventListener("click", async () => {
    if (deleteSnippetId) {
      try {
        const response = await fetch(`${apiUrl}?id=${deleteSnippetId}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (response.ok) {
          notifications.showNotification(result.mensaje, "success");
          fetchSnippets();
        } else {
          notifications.showNotification(
            result.error || "Error al eliminar el snippet",
            "error"
          );
        }
      } catch (error) {
        notifications.showNotification("Error de red", "error");
      }
    }
    deleteModal.classList.remove("show");
    deleteSnippetId = null;
  });

  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("show");
    deleteSnippetId = null;
  });

  // Exponer funciones al ámbito global para los botones inline
  window.showDeleteModal = showDeleteModal;
}
