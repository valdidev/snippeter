<!-- Header -->
<header class="header">
    <nav>
        <h1>Snippet Keeper</h1>
        <ul>
            <li><a href="?view=snippets" <?= $view === 'snippets' ? 'style="font-weight: bold;"' : '' ?>>Snippets</a></li>
            <li><a href="?view=users" <?= $view === 'users' ? 'style="font-weight: bold;"' : '' ?>>Usuarios</a></li>
        </ul>
    </nav>
</header>