<?php
session_start(); // Start the session to manage user login state

// Check if the user is logged in, if not redirect to the login page
if (!isset($_SESSION['loggedin'])) {
    header('Location: ../index.php');
    exit;
}

require_once 'config.php'; // Include the configuration file for database credentials

// Establish a connection to the MySQL database with the credentials from config.php
$con = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);
if (mysqli_connect_errno()) {
    exit('Failed to connect to MySQL: ' . mysqli_connect_error()); // Exit if there is a connection error
}

// Prepare an SQL statement to fetch the user's password and email
$stmt = $con->prepare('SELECT password, email FROM users WHERE id = ?');
$stmt->bind_param('i', $_SESSION['id']); // Bind the user ID parameter
$stmt->execute(); // Execute the statement
$stmt->bind_result($password, $email); // Bind the result to variables
$stmt->fetch(); // Fetch the result
$stmt->close(); // Close the statement

// Prepare an SQL statement to fetch the user's inventory
$inventory_stmt = $con->prepare('SELECT item_name, quantity FROM inventory WHERE user_id = ?');
$inventory_stmt->bind_param('i', $_SESSION['id']); // Bind the user ID parameter
$inventory_stmt->execute(); // Execute the statement
$inventory_result = $inventory_stmt->get_result(); // Get the result of the query
$inventory = $inventory_result->fetch_all(MYSQLI_ASSOC); // Fetch all results as an associative array
$inventory_stmt->close(); // Close the statement

// Prepare an SQL statement to fetch the user's health points
$health_stmt = $con->prepare('SELECT health_points FROM health WHERE user_id = ?');
$health_stmt->bind_param('i', $_SESSION['id']); // Bind the user ID parameter
$health_stmt->execute(); // Execute the statement
$health_stmt->bind_result($health_points); // Bind the result to a variable
$health_stmt->fetch(); // Fetch the result
$health_stmt->close(); // Close the statement

// Prepare an SQL statement to fetch the user's ammo
$health_stmt = $con->prepare('SELECT quantity FROM ammo WHERE user_id = ?');
$health_stmt->bind_param('i', $_SESSION['id']); // Bind the user ID parameter
$health_stmt->execute(); // Execute the statement
$health_stmt->bind_result($ammo); // Bind the result to a variable
$health_stmt->fetch(); // Fetch the result
$health_stmt->close(); // Close the statement
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Profile Page</title>
    <!-- Link to external stylesheets -->
    <link href="../css/profile.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="../fonts/css/all.css"> <!-- Link to font awesome css file for icons -->
</head>
<body class="loggedin">
    <!-- Navigation bar -->
    <nav class="navtop">
        <div>
            <h1>Profile</h1>
            <!-- Link to profile page with user's name -->
            <a href="profile.php"><i class="fas fa-user-circle"></i><?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?></a>
            <!-- Link to logout page -->
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a>
        </div>
    </nav>
    <!-- Main content area -->
    <div class="content">
        <h2>Profile Page</h2>
        <div>
            <p>Your account details are below:</p>
            <table>
                <tr>
                    <td>Username:</td>
                    <td><?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?></td>
                </tr>
                <tr>
                    <td>Password:</td>
                    <td><?=htmlspecialchars($password, ENT_QUOTES)?></td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td><?=htmlspecialchars($email, ENT_QUOTES)?></td>
                </tr>
            </table>
        </div>
        <div>
            <h2>Inventory</h2>
            <table>
                <?php foreach ($inventory as $item): ?>
                    <tr>
                        <td><?=htmlspecialchars($item['item_name'], ENT_QUOTES)?></td>
                        <td><?=htmlspecialchars($item['quantity'], ENT_QUOTES)?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>
        <div>
            <h2>Stats</h2>
            <p>Health: <?=htmlspecialchars($health_points, ENT_QUOTES)?></p>
            <p>Ammo: <?=htmlspecialchars($ammo, ENT_QUOTES)?> bullets</p>
        </div>
    </div>
</body>
</html>