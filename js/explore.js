$(document).ready(function () {
	function attachListeners() {
		document
			.getElementById("explore")
			.addEventListener("click", explore, false);
	}

	attachListeners();


	function textPrint(input) {
		$(".output")
			.append("<p class='text-center'>" + input + "</p>");
		var textOutputDiv = document.querySelector(".textOutput");
		textOutputDiv.scrollTop = textOutputDiv.scrollHeight;
		$("#commandline").val("");
	}

	function calcHealthBar(name, health, initialHealth) {
		const healthBar = document.getElementById(name);
		if (health <= 0) {
			healthBar.style.height = 0;
		} else {
			healthBar.style.height = health * 2 + "px";
		}
		healthBar.title = `${health}/${initialHealth}`;
	}

	function calcAmmoBar(name, ammo, initialAmmo) {
		const ammoBar = document.getElementById(name);
		if (ammo <= 0) {
			ammoBar.style.height = 0;
		} else {
			ammoBar.style.height = ammo * 50 + "px";
		}
		ammoBar.title = `${ammo}/${initialAmmo}`;
	}

	const enemies = [
		{ name: "bandit", weight: 70 },
		{ name: "sherrif", weight: 30 }
	];

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

	function explore() {
		textPrint("You start exploring the area...");
		setTimeout(() => {
			if (Math.random() < 0.3) {
				const enemy = getRandomEnemy(enemies);
				textPrint("You encountered an enemy!");
				setTimeout(() => {
					localStorage.setItem("playerHealth", player.health);
					localStorage.setItem("playerAmmo", player.ammo);
					window.location.href = `combat.html?enemy=${enemy}`
				}, 1000)
			} else {
				textPrint("You found nothing of interest.")
			}
		}, 1000);
	}

	const playerHealth = localStorage.getItem("playerHealth");
	const playerAmmo = localStorage.getItem("playerAmmo")

	const player = {
		health: playerHealth !== null ? parseInt(playerHealth, 10) : 100,
		initialHealth: 100,
		ammo: playerAmmo !== null ? parseInt(playerAmmo, 10) : 5,
		initialAmmo: 5
	}

	if (playerHealth !== null && playerAmmo !== null) {
		player.health = parseInt(playerHealth, 10);
		player.ammo = parseInt(playerAmmo, 10);
		localStorage.removeItem("playerHealth");
		localStorage.removeItem("playerAmmo");
	}
	calcHealthBar("playerHealth", player.health, player.initialHealth);
	calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo)
})