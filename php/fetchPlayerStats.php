<?php
require_once 'config.php'; // Include the configuration file for database credentials

// Establish a connection to the MySQL database with the credentials from config.php
$conn = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); // Exit if there is a connection error
}

session_start(); // Start the session to manage user login state

// Check if the user is logged in, if not return an error message
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    $conn->close(); // Close the database connection
    exit;
}

$user_id = $_SESSION['id']; // Use the id from the session

// SQL query to join health and ammo tables based on user_id
$sql = "
    SELECT h.health_points AS health, a.quantity AS ammo
    FROM health h
    JOIN ammo a ON h.user_id = a.user_id
    WHERE h.user_id = ?
";

// Prepare and execute the statement
$stmt = $conn->prepare($sql); 
$stmt->bind_param("i", $user_id); // Bind the user_id parameter
$stmt->execute(); // Execute the statement
$result = $stmt->get_result(); // Get the result of the query

$response = []; // Initialize the response array

if ($result->num_rows > 0) {
    // IF there are results, fetch the data
    $row = $result->fetch_assoc();
    $response['stats'] = $row; // Add the stats to the response
} else {
    $response['stats'] = []; // If no results, return an empty stats array
}

$stmt->close(); // Close the statement

// SQL query to fetch inventory based on user_id
$sql = "
    SELECT item_name, quantity
    FROM inventory
    WHERE user_id = ?
";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id); // Bind the user_id parameter
$stmt->execute(); // Execute the statement
$result = $stmt->get_result(); // Get the result of the query

$inventory = []; // INitialize the inventory array

if ($result->num_rows > 0) {
    // If there are result, fetch the data
    while ($row = $result->fetch_assoc()) {
        $inventory[] = $row; // Add each inventory item to the array
    }
}

$response['inventory'] = $inventory; // Add the inventory to the response

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection

echo json_encode($response); // Return the response as JSON
?>