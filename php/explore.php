<?php
session_start(); // Start the session to manage user login state

// Check if the user is logged, if not redirect to the login page
if (!isset($_SESSION['loggedin'])) {
	header('Location: ../index.php');
	exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="../fonts/css/all.css">	<!-- Link to font awesome css file for icons -->
	<link rel="stylesheet" href="../css/profile.css" type="text/css">
	<link rel="stylesheet" href="../css/style.css" type="text/css">
	<!-- jQuery imports -->
	<script src="../js/src/jquery-1.11.0.min.js"></script>
	<script src="../js/src/jquery-migrate-1.2.1.min.js"></script>
	<link rel="stylesheet" href="../css/src/bootstrap.min.css">
	<script src="../js/src/bootstrap.min.js"></script>
	<link rel="icon" href="../favicon.png" type="image/png">
	<title>Explore</title>
</head>

<body>
	<!-- Navigation bar -->
	<nav class="navtop">
		<div>
			<h1>Exploration</h1>
			<!-- Link to profile page with user;s name from session storage -->
			<a href="profile.php"><i class="fa-solid fa-user-circle"></i>
				<?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?>
			</a>
			<a href="logout.php"><i class="fa-solid fa-sign-out-alt"></i>Logout</a>
		</div>
	</nav>
	<!-- Container for displaying text output, player and enemy stats -->
	<div class="textOutput">
		<div id="playerHealth"></div>
		<div id="playerAmmo"></div>
		<div class="output">
			<p class="text-center outputText">
			<p>
		</div>
	</div>
	<!-- Exploration menu with action buttons -->
	<div class="exploreMenu">
		<button type="button" class="exploreButton" id="explore">Explore</button>
	</div>
	<!-- Link to the explore JavaScript file -->
	<script src="../js/explore.js"></script>
</body>

</html>