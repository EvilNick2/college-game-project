<?php
session_start(); // Start the session to authenticate user credentials
require_once 'config.php'; // Include the configuration file for database credentials

// Establish a connection to the MySQL database with the credentials from config.php
$con = mysqli_connect(DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	// Exit if there is a connection error
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

// Check if both username and password are provided in the POST request
if ( !isset($_POST['username'], $_POST['password']) ) {
	exit('Please fill both the username and password fields!');
}

// Prepare an SQL statement to prevent SQL injection
if ($stmt = $con->prepare('SELECT id, password FROM users WHERE username = ?')) {
	$stmt->bind_param('s', $_POST['username']); // Bind the username parameter
	$stmt->execute(); // Execute the statement
	$stmt->store_result(); // Store the result to check if the user exists

	if ($stmt->num_rows > 0) {
		// If the user exists, bind the result to variables
		$stmt->bind_result($id, $password);
		$stmt->fetch();
		// Verify the provided password with the hashed password in the database
		if (password_verify($_POST['password'], $password)) {
			// If the password is correct, regenerate the session ID and set session variables
			session_regenerate_id();
			$_SESSION['loggedin'] = TRUE;
			$_SESSION['name'] = $_POST['username'];
			$_SESSION['id'] = $id;
			// Redirect to the main menu
			header('Location: ../html/mainMenu.html');
		} else {
			// Return error 1 if the user does not exist
			header('Location: ../index.php?error=1');
		}
	} else {
		// Return error 1 if the users password is incorrect
		header('Location: ../index.php?error=1');
	}
	$stmt->close(); // Close the statement
}
?>