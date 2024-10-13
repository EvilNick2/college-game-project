<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
	header('Location: index.html');
	exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="../fonts/css/all.css">
	<link rel="stylesheet" href="../css/profile.css" type="text/css">
	<link rel="stylesheet" href="../css/style.css" type="text/css">
	<script src="../js/src/jquery-1.11.0.min.js"></script>
	<script src="../js/src/jquery-migrate-1.2.1.min.js"></script>
	<link rel="stylesheet" href="../css/src/bootstrap.min.css">
	<script src="../js/src/bootstrap.min.js"></script>
	<link rel="icon" href="../favicon.png" type="image/png">
	<title>Explore</title>
</head>

<body>
	<nav class="navtop">
		<div>
			<h1>Exploration</h1>
			<a href="profile.php"><i class="fa-solid fa-user-circle"></i>
				<?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?>
			</a>
			<a href="logout.php"><i class="fa-solid fa-sign-out-alt"></i>Logout</a>
		</div>
	</nav>
	<div class="textOutput">
		<div id="playerHealth"></div>
		<div id="playerAmmo"></div>
		<div class="output">
			<p class="text-center outputText">
			<p>
		</div>
	</div>
	<div class="exploreMenu">
		<button type="button" class="exploreButton" id="explore">Explore</button>
	</div>
	<script src="../js/explore.js"></script>
</body>

</html>