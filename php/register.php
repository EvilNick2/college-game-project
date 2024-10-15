<?php
require_once 'config.php'; // Include the configuration file for database credentials

session_start(); // Start the session to manage user login state

// Check if the user is logged in, if not redirect to the login page
$conn = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); // Exit if there is a connection error
}

// Retrieve user input from the post request
$user = $_POST['username'];
$pass = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash the password for security
$email = $_POST['email'];

// SQL query to insert the new user into the users table
$sql = "INSERT INTO users (username, password, email) VALUES ('$user', '$pass', '$email')";

// Execute the query and check if it was successful
if ($conn->query($sql) === TRUE) {
    echo "Registration successful"; // Output success message

    $user_id = $conn->insert_id; // Get the ID of the newly created user

    // Define default items to be added to the user's inventory
    $default_items = [
        ['item_name' => 'dagger', 'quantity' => 1],
        ['item_name' => 'sword', 'quantity' => 1],
        ['item_name' => 'revolver', 'quantity' => 1],
		['item_name' => 'bandage', 'quantity' => 2],
		['item_name' => 'ammoLoader', 'quantity' => 2]
    ];

    // Insert default items into the inventory table for the new user
    foreach ($default_items as $item) {
        $item_name = $item['item_name'];
        $quantity = $item['quantity'];
        $sql = "INSERT INTO inventory (user_id, item_name, quantity) VALUES ('$user_id', '$item_name', '$quantity')";
        if ($conn->query($sql) !== TRUE) {
            echo "Error inserting default item: " . $conn->error; // Output error message if insertion fails
        }
    }

    // Insert default health points into the health table for the new user
    $default_health = 100;
    $sql = "INSERT INTO health (user_id, health_points) VALUES ('$user_id', '$default_health')";
    if ($conn->query($sql) !== TRUE) {
        echo "Error inserting default health: " . $conn->error; // Output error message if insertion fails
    }

    // Insert default ammo quantity into the ammo table for the new user
    $default_ammo = 5;
    $sql = "INSERT INTO ammo (user_id, quantity) VALUES ('$user_id', '$default_ammo')";
    if ($conn->query($sql) !== TRUE) {
        echo "Error inserting default ammo: " . $conn->error; // Output error message if insertion fails
    }
    // Redirect to the login page after successful registration
	header("Location: ../index.php");

} else {
    // Output error message if user registration fails
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// CLose the database connection
$conn->close();
?>