<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
	header('Location: index.html');
	exit;
}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Home Page</title>
		<link href="../css/profile.css" rel="stylesheet" type="text/css">
		<link rel="stylesheet" href="../fonts/css/all.css">
	</head>
	<body class="loggedin">
		<nav class="navtop">
			<div>
				<h1>Website Title</h1>
				<a href="profile.php"><i class="fas fa-user-circle"></i><?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?></a>
				<a href="logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a>
			</div>
		</nav>
		<div class="content">
			<h2>Home Page</h2>
			<p>Welcome back, <?=htmlspecialchars($_SESSION['name'], ENT_QUOTES)?>!</p>
		</div>
	</body>
</html>