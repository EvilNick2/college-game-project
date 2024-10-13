<?php
require_once 'config.php';

$conn = new mysqli(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user = $_POST['username'];
$pass = password_hash($_POST['password'], PASSWORD_DEFAULT);
$email = $_POST['email'];

$sql = "INSERT INTO users (username, password, email) VALUES ('$user', '$pass', '$email')";

if ($conn->query($sql) === TRUE) {
    echo "Registration successful";

    $user_id = $conn->insert_id;

    $default_items = [
        ['item_name' => 'Dagger', 'quantity' => 1],
        ['item_name' => 'Sword', 'quantity' => 1],
        ['item_name' => 'Revolver', 'quantity' => 1],
				['item_name' => 'Bandage', 'quantity' => 2],
				['item_name' => 'Ammo Loader', 'quantity' => 2]
    ];

    foreach ($default_items as $item) {
        $item_name = $item['item_name'];
        $quantity = $item['quantity'];
        $sql = "INSERT INTO inventory (user_id, item_name, quantity) VALUES ('$user_id', '$item_name', '$quantity')";
        if ($conn->query($sql) !== TRUE) {
            echo "Error inserting default item: " . $conn->error;
        }
    }

    $default_health = 100;
    $sql = "INSERT INTO health (user_id, health_points) VALUES ('$user_id', '$default_health')";
    if ($conn->query($sql) !== TRUE) {
        echo "Error inserting default health: " . $conn->error;
    }

    $default_ammo = 5;
    $sql = "INSERT INTO ammo (user_id, quantity) VALUES ('$user_id', '$default_ammo')";
    if ($conn->query($sql) !== TRUE) {
        echo "Error inserting default ammo: " . $conn->error;
    }

		header("Location: ../index.html");

} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>