$(document).ready(function () {
	// Attach event listeners to allow buttons to work
	function attachListeners() {
		document
			.getElementById("explore")
			.addEventListener("click", explore, false);
	}

	attachListeners();

	// Function to read the player's data from the database
	function fetchPlayerStats(callback) {
		$.ajax({
			url: '../php/fetchPlayerStats.php', // Adjust the path if necessary
			method: 'GET',
			dataType: 'json',
			success: function (data) {
				callback(data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error('Error fetching player stats:', textStatus, errorThrown);
			}
		});
	}

	// Function to print text to the output box
	function textPrint(input) {
		$(".output")
			.append("<p class='text-center'>" + input + "</p>");
		var textOutputDiv = document.querySelector(".textOutput");
		textOutputDiv.scrollTop = textOutputDiv.scrollHeight;
		$("#commandline").val("");
	}

	// Calculate and update the health bar display
	function calcHealthBar(name, health, initialHealth) {
		const healthBar = document.getElementById(name);
		if (health <= 0) {
			healthBar.style.height = 0;
		} else {
			healthBar.style.height = health * 2 + "px";
		}
		healthBar.title = `${health}/${initialHealth}`;
	}

	// Calculate and update the ammo bar display
	function calcAmmoBar(name, ammo, initialAmmo) {
		const ammoBar = document.getElementById(name);
		if (ammo <= 0) {
			ammoBar.style.height = 0;
		} else {
			ammoBar.style.height = ammo * 50 + "px";
		}
		ammoBar.title = `${ammo}/${initialAmmo}`;
	}

	// List of possible enemies for the combat redirect
	const enemies = [
		{ name: "bandit", weight: 70 }, // Bandit with a higher chance of encounter
		{ name: "sheriff", weight: 30 } // Sheriff with a lower chance of encounter
	];

	// Get a random enemy based on the weights
	function getRandomEnemy(enemies) {
		const totalWeight = enemies.reduce((sum, enemy) => sum + enemy.weight, 0);
		let random = Math.random() * totalWeight
		for (let enemy of enemies) {
			if (random < enemy.weight) {
				return enemy.name;
			}
			random -= enemy.weight;
		}
	}

	// Explore function triggered by the explore button
	function explore() {
		textPrint("You start exploring the area...");
		setTimeout(() => {
			if (Math.random() < 0.3) {
				const enemy = getRandomEnemy(enemies);
				textPrint("You encountered an enemy!");
				setTimeout(() => {
					window.location.href = `combat.php?enemy=${enemy}`
				}, 1000)
			} else {
				textPrint("You found nothing of interest.")
			}
		}, 1000);
	}

	// Function call to get the players stats from the database
	fetchPlayerStats(function (data) {
		const player = {
			health: data.stats.health,
			initialHealth: 100, // Maximum health of the player
			ammo: data.stats.ammo,
			initialAmmo: 5 // Maximum ammo of the player
		};

		// Update the health and ammo bars to correctly display the player's stats
		calcHealthBar("playerHealth", player.health, player.initialHealth);
		calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);
	});
});