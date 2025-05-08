import { initNotifications } from './components/notifications.js';
import { initSnippetForm } from './components/snippetForm.js';
import { initSnippetList } from './components/snippetList.js';
import { initDeleteModal } from './components/deleteModal.js';

const apiUrl = 'api.php';

// Inicializar componentes si la vista de snippets está activa
if (document.getElementById('snippetList')) {
    const notifications = initNotifications('notificationContainer');
    const snippetList = initSnippetList('snippetList', apiUrl, notifications);
    const snippetForm = initSnippetForm('snippetForm', apiUrl, notifications, snippetList.fetchSnippets);
    initDeleteModal('deleteModal', apiUrl, notifications, snippetList.fetchSnippets);

    // Cargar snippets al iniciar
    snippetList.fetchSnippets();
}