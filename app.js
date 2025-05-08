import { initNotifications } from "./components/notifications.js";
import { initSnippetForm } from "./components/snippetForm.js";
import { initSnippetList } from "./components/snippetList.js";
import { initDeleteModal } from "./components/deleteModal.js";
import { initUserManager } from "./components/userManager.js";

const apiUrl = "api.php";

// Inicializar componentes según la vista activa
if (document.getElementById("snippetList")) {
    const notifications = initNotifications("notificationContainer");
    const snippetList = initSnippetList("snippetList", apiUrl, notifications);
    const snippetForm = initSnippetForm(
        "snippetFormModal",
        "snippetForm",
        apiUrl,
        notifications,
        snippetList.fetchSnippets
    );
    initDeleteModal(
        "deleteModal",
        apiUrl,
        notifications,
        snippetList.fetchSnippets
    );

    // Cargar snippets al iniciar
    snippetList.fetchSnippets();
} else if (document.getElementById("userList")) {
    const notifications = initNotifications("notificationContainer");
    const userManager = initUserManager(
        "userFormModal",
        "userForm",
        "userList",
        "userDeleteModal",
        apiUrl,
        notifications
    );

    // Cargar usuarios al iniciar
    userManager.fetchUsers();
}