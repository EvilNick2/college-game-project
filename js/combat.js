$(document).ready(function () {
	var revolverShot = new Audio(
		"../audio/combat/revolverShot.wav"
	);

	var useHealing = new Audio(
		"../audio/combat/bandage.wav"
	);

	var stab = new Audio(
		"../audio/combat/stab.wav"
	);

	var reload = new Audio(
		"../audio/combat/reload.wav"
	);

	function attachListeners() {
		document
			.getElementById("useDagger")
			.addEventListener("click", useDagger, false);
		document
			.getElementById("useRevolver")
			.addEventListener("click", usePistol, false);
		document
			.getElementById("reloadRevolver")
			.addEventListener("click", reloadRevolver, false);
		document
			.getElementById("useBandage")
			.addEventListener("click", useBandage, false);
	}

	attachListeners();

	var player = {
		health: 100,
		initialHealth: 100,
		ammo: 5,
		initialAmmo: 5,
		inventory: [
			"dagger",
			"sword",
			["bandage", 2],
			["ammoLoader", 2]
		],
		travelHistory: []
	}

	var dagger = {
		name: "Small Dagger",
		stats: 10,
		damageType: "slash"
	}

	var pistol = {
		name: "Revolver",
		stats: 20,
		damageType: "piercing",
		ammoCost: 1,
		owned: false
	}

	var ammoLoader = {
		name: "Ammo Loader",
		stats: 5,
		owned: 2
	}

	var bandage = {
		name: "Bandage",
		stats: 25,
		owned: 2
	};

	var bandit = {
		name: "Bandit",
		greeting:
			"A bandit approaches. 'Howdy partner, drop all your weapons!'",
		health: 50,
		initialHealth: 50,
		attackFirst: true,
		moveNum: 2,
		moves: [
			["punch", 5],
			["slash", 8]
		],
		vulnerability: ["piercing", 5]
	}

	// Matthew + Corey
	var sherrif = {
		name: "Sherrif",
		greeting:
			"A sherrif approaches. 'Hey cowpoke, I heard you was breaking the law!'",
		health: 100,
		initialHealth: 100,
		ammo: 5,
		initialAmmo: 5,
		attackFirst: true,
		moveNum: 3,
		moves: [
			["revolver", 10],
			["slash", 8],
			["whip", 6]
		],
		vulnerability: ["slash", 4]
	}

	let playerEquipped = dagger;
	let playerDamage;
	let playerRealDamage;
	let enemyMove;
	let enemyDamage;
	let hasAttacked = true;

	// Function to check the passed enemy data from the explore URL redirect
	function getQueryParams() {
		const params = {};
		window.location.search.substring(1).split("&").forEach(param => {
			const [key, value] = param.split("=");
			params[key] = decodeURIComponent(value);
		});
		return params;
	}

	function textPrint(input) {
		$(".output")
			.append("<p class='text-center'>" + input + "</p>");
		var textOutputDiv = document.querySelector(".textOutput");
		textOutputDiv.scrollTop = textOutputDiv.scrollHeight;
		$("#commandline").val("");
	}

	function gameOverCheck(playerHealth, enemyHealth) {
		if (playerHealth <= 0) {
			textPrint("You lose. Taking you back to the main menu...");
			setTimeout(() => {
				localStorage.removeItem("playerHealth");
				localStorage.removeItem("playerAmmo");
				window.location.href = "../index.html";
			}, 2000);
			return true;
		} else if (enemyHealth <= 0) {
			textPrint("You've defeated the " + enemy.name + ". Taking you back to exploration...");
			localStorage.setItem("playerHealth", playerHealth);
			localStorage.setItem("playerAmmo", player.ammo);
			setTimeout(() => {
				window.location.href = "explore.html";
			}, 2000);
			return true;
		}
		return false;
	}

	function calcDamage(max, min) {
		return Math.random() * (max - min) + min;
	}

	function calcEnemyMove(name) {
		var movesNum = name.moveNum;
		return Math.floor(calcDamage(movesNum + 1, 1)) - 1;
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

	function checkDamageType(damageTypeAttacking, enemyDamageType) {
		if (damageTypeAttacking.damageType === enemyDamageType.vulnerability[0]) {
			return enemyDamageType.vulnerability[1];
		}
	}

	function enemyTurn() {
		if (gameOverCheck(player.health, enemy.health) == false) {
			enemyMove = calcEnemyMove(enemy);
			enemyDamage = calcDamage(enemy.moves[enemyMove][1], 1);
			var enemyRealDamage = Math.floor(enemyDamage);
			player.health = player.health - enemyRealDamage;
			textPrint(
				enemy.name +
				" attacks you with " +
				enemy.moves[enemyMove][0] +
				" for " +
				enemyRealDamage +
				"!"
			);
			calcHealthBar("playerHealth", player.health, player.initialHealth);
			hasAttacked = true;
		} else { }
	}

	function useDagger() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true
		) {
			playerDamage = calcDamage(playerEquipped.stats, 1);
			playerRealDamage = Math.floor(playerDamage);
			enemy.health = enemy.health - playerRealDamage;
			textPrint(
				"You attack " +
				enemy.name +
				" with your " +
				playerEquipped.name +
				" for " +
				playerRealDamage
			);
			if (checkDamageType(dagger, enemy) > 0) {
				textPrint(
					"Your slash does extra damage " + enemy.vulnerability[1] + " damage"
				);
				enemy.health = enemy.health - enemy.vulnerability[1];
			}
			calcHealthBar("enemyHealth", enemy.health, enemy.initialHealth);
			stab.play();
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else { }
	}

	function usePistol() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (player.ammo <= 0) {
			textPrint("You do not have enough bullets")
		} else if (
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true
		) {
			playerDamage = calcDamage(pistol.stats, 10);
			playerRealDamage = Math.floor(playerDamage);
			enemy.health = enemy.health - playerRealDamage;
			player.ammo = player.ammo - pistol.ammoCost;
			textPrint(
				"You shoot your revolver at " + enemy.name + " for " + playerRealDamage
			);
			if (checkDamageType(pistol, enemy) > 0) {
				textPrint(
					"Revolver does extra damage " + enemy.vulnerability[1] + " damage"
				);
				enemy.health = enemy.health - enemy.vulnerability[1];
			}
			revolverShot.play();
			calcHealthBar("enemyHealth", enemy.health, enemy.initialHealth);
			calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else { }
	}

	function reloadRevolver() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (player.ammo != 0) {
			return textPrint("You aren't out of ammo yet!");
		}
		if (ammoLoader.owned > 0) {
			player.ammo = player.ammo + ammoLoader.stats;
			ammoLoader.owned = ammoLoader.owned - 1;
			textPrint("You reloaded your Revolver.");
			calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);
			reload.play();
			setTimeout(enemyTurn, 2000);
			hasAttacked = false;
		} else {
			textPrint("You don't have anymore spare ammo.")
		}
	}

	function useBandage() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (bandage.owned > 0) {
			player.health = player.health + bandage.stats;
			bandage.owned = bandage.owned - 1;
			textPrint("You used a bandage. Your wounds stop bleeding");
			calcHealthBar("playerHealth", player.health, player.initialHealth);
			useHealing.play();
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			textPrint("You don't have any bandages.");
		}
	}

	function combat(enemyFighting) {
		document.querySelector(".output").innerHTML = "";
		enemy = enemyFighting;
		textPrint(enemy.greeting);

		player.health = localStorage.getItem("playerHealth") || 100;
		player.ammo = localStorage.getItem("playerAmmo") || 5;

		calcHealthBar("playerHealth", player.health, player.initialHealth);
		calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);

		if (enemy.attackFirst == true) {
			enemyTurn();
		}
		document.getElementById("enemyHealth").style.height = enemy.health + "px";
		calcHealthBar("enemyHealth", enemy.health, player.initialHealth);
	}

	const params = getQueryParams();
	if (params.enemy) {
		let enemy;
		if (params.enemy === "bandit") {
			enemy = bandit;
		} else if (params.enemy === "sherrif") {
			enemy = sherrif;
		}
		if (enemy) {
			combat(enemy);
		}
	}
});