<?php
session_start(); // Start the session to manage user login state

// Check if the user is logged in, if not redirect to the login page
if (!isset($_SESSION['loggedin'])) {
    header('Location: ../index.php');
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Home Page</title>
    <!-- Link to external stylesheets -->
    <link href="../css/profile.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="../fonts/css/all.css">	<!-- Link to font awesome css file for icons -->
</head>
<body class="loggedin">
    <!-- Navigation bar -->
    <nav class="navtop">
        <div>
            <h1>Home</h1>
            <!-- Link to profile page with user's name -->
            <a href="profile.php"><i class="fas fa-user-circle"></i><?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?></a>
            <!-- Link to logout page -->
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a>
        </div>
    </nav>
    <!-- Main content area -->
    <div class="content">
        <h2>Home Page</h2>
        <!-- Welcome message with user's name -->
        <p>Welcome back, <?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?>!</p>
    </div>
</body>
</html>