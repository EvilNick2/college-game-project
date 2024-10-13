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
	<title>Combat</title>
</head>

<body>
	<nav class="navtop">
		<div>
			<h1>Combat</h1>
			<a href="profile.php"><i class="fa-solid fa-user-circle"></i>
				<?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?>
			</a>
			<a href="logout.php"><i class="fa-solid fa-sign-out-alt"></i>Logout</a>
		</div>
	</nav>
	<img id="enemyImage" src="" alt="Enemy Image" />
	<div class="textOutput">
		<div id="playerHealth"></div>
		<div id="playerAmmo"></div>
		<div id="enemyHealth"></div>
		<div class="output">
			<p class="text-center outputText">
			<p>
		</div>
	</div>
	<div class="combatMenu">
		<button type="button" class="combatButton" id="useDagger">Use Dagger</button>
		<button type="button" class="combatButton" id="useRevolver">Use Revolver</button>
		<button type="button" class="combatButton" id="reloadRevolver">Reload Revolver</button>
		<button type="button" class="combatButton" id="useBandage">Use Bandage</button>
	</div>
	<script src="../js/combat.js"></script>
</body>

</html>