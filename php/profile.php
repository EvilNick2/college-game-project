<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';

$con = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);
if (mysqli_connect_errno()) {
    exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

$stmt = $con->prepare('SELECT password, email FROM users WHERE id = ?');
$stmt->bind_param('i', $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($password, $email);
$stmt->fetch();
$stmt->close();

$inventory_stmt = $con->prepare('SELECT item_name, quantity FROM inventory WHERE user_id = ?');
$inventory_stmt->bind_param('i', $_SESSION['id']);
$inventory_stmt->execute();
$inventory_result = $inventory_stmt->get_result();
$inventory = $inventory_result->fetch_all(MYSQLI_ASSOC);
$inventory_stmt->close();

$health_stmt = $con->prepare('SELECT health_points FROM health WHERE user_id = ?');
$health_stmt->bind_param('i', $_SESSION['id']);
$health_stmt->execute();
$health_stmt->bind_result($health_points);
$health_stmt->fetch();
$health_stmt->close();

$health_stmt = $con->prepare('SELECT quantity FROM ammo WHERE user_id = ?');
$health_stmt->bind_param('i', $_SESSION['id']);
$health_stmt->execute();
$health_stmt->bind_result($ammo);
$health_stmt->fetch();
$health_stmt->close();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Profile Page</title>
    <link href="../css/profile.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="../fonts/css/all.css">
</head>
<body class="loggedin">
    <nav class="navtop">
        <div>
            <h1>Website Title</h1>
            <a href="profile.php"><i class="fas fa-user-circle"></i><?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?></a>
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a>
        </div>
    </nav>
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
            <h3>Inventory</h3>
            <table>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                </tr>
                <?php foreach ($inventory as $item): ?>
                <tr>
                    <td><?=htmlspecialchars($item['item_name'], ENT_QUOTES)?></td>
                    <td><?=htmlspecialchars($item['quantity'], ENT_QUOTES)?></td>
                </tr>
                <?php endforeach; ?>
            </table>
            <h3>Health</h3>
            <p><?=htmlspecialchars($health_points, ENT_QUOTES)?> HP</p>
            <h3>Ammo</h3>
						<p><?=htmlspecialchars($ammo, ENT_QUOTES)?> bullets</p>
        </div>
    </div>
</body>
</html>