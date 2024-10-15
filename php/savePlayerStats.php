<?php
require_once 'config.php'; // Include the configuration file for database credentials

// Check if the user is logged in, if not redirect to the login page
$conn = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); // Exit if there is a connection error
}

session_start(); // Start the session to manage user login state

// Check if user is logged in, if not return an error message
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    $conn->close(); // Close the database connection
    exit;
}

$playerId = $_SESSION['id']; // Use the ID from the session
$health = $_POST['health']; // Get the health value from the POST request
$ammo = $_POST['ammo']; // Get the ammo value from the POST request
$inventory = $_POST['inventory']; // Get the inventory array from the POST request

// Update the player's health
$stmt = $conn->prepare("UPDATE health SET health_points = ? WHERE user_id = ?");
$stmt->bind_param("ii", $health, $playerId); // Bind the health and ID parameters
if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update health: ' . $stmt->error]);
    $stmt->close(); // Close the statement
    $conn->close(); // Close the database connection
    exit;
}
$stmt->close(); // Close the statement

// Update the player's ammo
$stmt = $conn->prepare("UPDATE ammo SET quantity = ? WHERE user_id = ?");
$stmt->bind_param("ii", $ammo, $playerId); // Bind the ammo and ID parameters
if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update ammo: ' . $stmt->error]);
    $stmt->close(); // Close the statement
    $conn->close(); // Close the database connection
    exit;
}
$stmt->close(); // Close the statement

// Update the player's inventory
foreach ($inventory as $item) {
    if (count($item) != 2) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid inventory item format']);
        $conn->close(); // Close the database connection
        exit;
    }
    $item_name = $item[0]; // Get the item name
    $quantity = $item[1]; // Get the item quantity

    // Check if the item already exists in the inventory
    $stmt = $conn->prepare("SELECT COUNT(*) FROM inventory WHERE user_id = ? AND item_name = ?");
    $stmt->bind_param("is", $playerId, $item_name); // Bind the user_id and item_name parameters
    $stmt->execute(); // Execute the statement
    $stmt->bind_result($count); // Bind the result to a variable
    $stmt->fetch(); // Fetch the result
    $stmt->close(); // Close the statement

    if ($count > 0) {
        // If the item exists, update its quantity
        $stmt = $conn->prepare("UPDATE inventory SET quantity = ? WHERE user_id = ? AND item_name = ?");
        $stmt->bind_param("iis", $quantity, $playerId, $item_name); // Bind the quantity, user_id, and item_name parameters
    } else {
        // If the item does not exist, insert it into the inventory
        $stmt = $conn->prepare("INSERT INTO inventory (user_id, item_name, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $playerId, $item_name, $quantity); // Bind the user_id, item_name, and quantity parameters
    }

    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update inventory: ' . $stmt->error]);
        $stmt->close(); // Close the statement
        $conn->close(); // Close the database connection
        exit;
    }
    $stmt->close(); // Close the statement
}

echo json_encode(['status' => 'success', 'message' => 'Player stats updated successfully']); // Return success message

$conn->close(); // Close the database connection
?>