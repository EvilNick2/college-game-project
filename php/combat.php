<?php
session_start(); // Start the session to manage user login state

// Check if the user is logged in, if not redirect to the login page
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
	<title>Combat</title>
</head>

<body>
	<!-- Navigation bar -->
	<nav class="navtop">
		<div>
			<h1>Combat</h1>
			<!-- Link to profile page with user's name from session storage -->
			<a href="profile.php"><i class="fa-solid fa-user-circle"></i>
				<?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?>
			</a>
			<a href="logout.php"><i class="fa-solid fa-sign-out-alt"></i>Logout</a>
		</div>
	</nav>
	<!-- Empty image to be set depending on enemy fighting -->
	<img id="enemyImage" src="" alt="Enemy Image" />
	<!-- Container for displaying text output, player and enemy stats -->
	<div class="textOutput">
		<div id="playerHealth"></div>
		<div id="playerAmmo"></div>
		<div id="enemyHealth"></div>
		<div class="output">
			<p class="text-center outputText">
			<p>
		</div>
	</div>
	<!-- Combat menu with action buttons -->
	<div class="combatMenu">
		<button type="button" class="combatButton" id="useDagger">Use Dagger</button>
		<button type="button" class="combatButton" id="useRevolver">Use Revolver</button>
		<button type="button" class="combatButton" id="reloadRevolver">Reload Revolver</button>
		<button type="button" class="combatButton" id="useBandage">Use Bandage</button>
	</div>
	<!-- Link to the combat JavaScript file -->
	<script src="../js/combat.js"></script>
</body>

</html>