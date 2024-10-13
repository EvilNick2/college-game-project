<?php
require_once 'config.php';

$conn = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASS);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS " . DATABASE_NAME;
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . $conn->error;
}

$conn->select_db(DATABASE_NAME);

$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) UNIQUE
)";
if ($conn->query($sql) === TRUE) {
    echo "Table users created successfully\n";
} else {
    echo "Error creating users table: " . $conn->error;
}

$sql = "CREATE TABLE IF NOT EXISTS inventory (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED,
    item_name VARCHAR(50) NOT NULL,
    quantity INT(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table inventory created successfully\n";
} else {
    echo "Error creating inventory table: " . $conn->error;
}

$sql = "CREATE TABLE IF NOT EXISTS health (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED,
    health_points INT(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table health created successfully\n";
} else {
    echo "Error creating health table: " . $conn->error;
}

$sql = "CREATE TABLE IF NOT EXISTS ammo (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(6) UNSIGNED,
    quantity INT(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table ammo created successfully\n";
} else {
    echo "Error creating ammo table: " . $conn->error;
}

$conn->close();
?>