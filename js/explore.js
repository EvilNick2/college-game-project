$(document).ready(function () {
	// Attach event listeners to allow buttons to work
	function attachListeners() {
		document
			.getElementById("explore")
			.addEventListener("click", explore, false);
	}

	attachListeners();

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
		{ name: "sherrif", weight: 30 } // Sherrif with a lower chance of encounter
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
					// Add player data to local storage for persistance over pages
					localStorage.setItem("playerHealth", player.health);
					localStorage.setItem("playerAmmo", player.ammo);
					window.location.href = `combat.html?enemy=${enemy}`
				}, 1000)
			} else {
				textPrint("You found nothing of interest.")
			}
		}, 1000);
	}

	// Retrieve player stats from local storage or set default values
	const playerHealth = localStorage.getItem("playerHealth");
	const playerAmmo = localStorage.getItem("playerAmmo");

	const player = {
		health: playerHealth !== null ? parseInt(playerHealth, 10) : 100,
		initialHealth: 100, // Maximum health of the player
		ammo: playerAmmo !== null ? parseInt(playerAmmo, 10) : 5,
		initialAmmo: 5 // Maximum ammo of the player
	}

	// If the player stats are found in local storage, update the player object
	if (playerHealth !== null && playerAmmo !== null) {
		player.health = parseInt(playerHealth, 10);
		player.ammo = parseInt(playerAmmo, 10);
		localStorage.removeItem("playerHealth");
		localStorage.removeItem("playerAmmo");
	}
	// Update the health and ammo bars to correctly display the players stats
	calcHealthBar("playerHealth", player.health, player.initialHealth);
	calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo)
})