<?php
require_once 'config.php'; // Include the configuration file for database credentials

// Establish a connection to the MySQL database with the credentials from config.php
$conn = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASS);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); // Exit if there is a connection error
}

// Create the database with name gotten from config.php if it doesn't already exist
$sql = "CREATE DATABASE IF NOT EXISTS " . DATABASE_NAME;
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully\n"; // Output success message
} else {
    echo "Error creating database: " . $conn->error; // Output error message
}

// Select the newly created or existing database
$conn->select_db(DATABASE_NAME);

// Create the users table if it does not already exist
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) UNIQUE
)";
if ($conn->query($sql) === TRUE) {
    echo "Table users created successfully\n"; // Output success message
} else {
    echo "Error creating users table: " . $conn->error; // Output error message
}

// Create the inventory table if it does not already exist
$sql = "CREATE TABLE IF NOT EXISTS inventory (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED,
    item_name VARCHAR(50) NOT NULL,
    quantity INT(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table inventory created successfully\n"; // Output success message
} else {
    echo "Error creating inventory table: " . $conn->error; // Output error message
}

// Create the health table if it does not already exist
$sql = "CREATE TABLE IF NOT EXISTS health (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED,
    health_points INT(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table health created successfully\n"; // Output success message
} else {
    echo "Error creating health table: " . $conn->error; // Output error message
}

// Create the ammo table if it does not already exist
$sql = "CREATE TABLE IF NOT EXISTS ammo (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED,
    quantity INT(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table ammo created successfully\n"; // Output success message
} else {
    echo "Error creating ammo table: " . $conn->error; // Output error message
}

// Close the database connection
$conn->close();
?>