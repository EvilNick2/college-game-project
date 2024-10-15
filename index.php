<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Login</title>
    <link rel="stylesheet" href="fonts/css/all.css">
    <link href="css/profile.css" rel="stylesheet" type="text/css">
    <script>
				// Function to run the create_db.php script on page load
        window.onload = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "php/create_db.php", true);
            xhr.send();
        };
    </script>
</head>
<body>
    <div class="login">
        <h1>Login</h1>
        <form action="php/authenticate.php" method="post" autocomplete="off">
            <label for="username">
                <i class="fas fa-user"></i>
            </label>
            <input type="text" name="username" placeholder="Username" id="username" required>
            <label for="password">
                <i class="fas fa-lock"></i>
            </label>
            <input type="password" name="password" placeholder="Password" id="password" required>
						<!-- Display incorrect username and/or password if the authenticate.php returns error 1 -->
						<?php if (isset($_GET['error']) && $_GET['error'] == 1): ?>
								<p style="color: red; text-align: center;">Incorrect username and/or password!</p>
						<?php endif; ?>
            <input type="submit" value="Login">
        </form>
        <form action="html/register.html" method="get">
            <input type="submit" value="Register">
        </form>
    </div>
</body>
</html>