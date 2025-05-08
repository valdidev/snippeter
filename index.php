<?php
$view = isset($_GET['view']) ? $_GET['view'] : 'snippets';
?>

<!DOCTYPE html>
<html lang="es">
<?php include 'partials/head.php'; ?>

<body>
    <?php include 'partials/header.php'; ?>

    <!-- Contenedor principal -->
    <div class="container">
        <?php
        if ($view === 'snippets') {
            include 'views/snippets.php';
        } elseif ($view === 'users') {
            include 'views/users.php';
        } else {
            include 'views/not-found.php';
        }
        ?>
    </div>

    <script type="module" src="app.js"></script>
</body>

</html>