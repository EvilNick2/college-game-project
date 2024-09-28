$(document).ready(function () {
	var revolverShot = new Audio(
		"audio/combat/revolverShot.wav"
	);

	var revolverShotAlt = new Audio(
		"audio/combat/revolverShotAlt.wav"
	)

	var useHealing = new Audio(
		"audio/combat/bandage.wav"
	);

	var stab = new Audio(
		"audio/combat/stab.wav"
	)

	var stabAlt = new Audio(
		"audio/combat/stabAlt.wav"
	)

	var reload = new Audio(
		"audio/combat/reload.wav"
	)

	var reloadAlt = new Audio(
		"audio/combat/reloadAlt.wav"
	)

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
		document
			.getElementById("fightSherrif")
			.addEventListener("click", combatSelect, false)
		document
			.getElementById("restart")
			.addEventListener("click", restart, false);
	}

	attachListeners();

	var player = {
		health: 100,
		ammo: 5,
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
		stats: 5,
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
		ammo: 1,
		attackFirst: true,
		moveNum: 3,
		moves: [
			["revolver", 5],
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
	let enemy;
	let hasAttacked = true;

	function combatPrint(input) {
		$(".combatOutput")
			.append("<p class='text-center'>" + input + "</p>");
		var combatOutputDiv = document.querySelector(".combat");
		combatOutputDiv.scrollTop = combatOutputDiv.scrollHeight;
		$("#commandline").val("");
	}

	function gameOverCheck(playerHealth, enemyHealth) {
		if (playerHealth <= 0) {
			combatPrint("You lose. Refresh to try again.");
			return true;
		} else if (enemyHealth <= 0) {
			combatPrint("You've defeated the " + enemy.name + ".");
			$("#restart").fadeIn(1000);
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

	function calcHealthBar(name, health) {
		if (health <= 0) {
			document.getElementById(name).style.height = 0;
		} else {
			document.getElementById(name).style.height = health * 2 + "px";
		}
	}

	function calcAmmoBar(name, ammo) {
		if (ammo <= 0) {
			document.getElementById(name).style.height = 0;
		} else {
			document.getElementById(name).style.height = ammo * 50 + "px";
		}
	}

	function checkDamageType(damageTypeAttacking, enemyDamageType) {
		if (damageTypeAttacking.damageType === enemyDamageType.vulnerability[0]) {
			return enemyDamageType.vulnerability[1];
		}
	}

	function inventorySearch(input) {
		for (var i = 0; i < player.inventory.length + 1; i++) {
			if (player.inventory[i] === input) {
				return true;
			} else {
				return false;
			}
		}
	}

	function enemyTurn() {
		if (
			gameOverCheck(player.health, enemy.health) == false
		) {
			enemyMove = calcEnemyMove(enemy);
			enemyDamage = calcDamage(enemy.moves[enemyMove][1], 1);
			var enemyRealDamage = Math.floor(enemyDamage);
			player.health = player.health - enemyRealDamage;
			combatPrint(
				enemy.name +
				" attacks you with " +
				enemy.moves[enemyMove][0] +
				" for " +
				enemyRealDamage +
				"!"
			);
			calcHealthBar("playerHealth", player.health);
			hasAttacked = true;
			for (var i = 0; i < player.inventory.length; i++) {
				var inventoryOption = player.inventory[i];
				var createOption = document.createElement("option");
				createOption.textContext = inventoryOption;
				createOption.value = inventoryOption;
				document.getElementById("inventory").appendChild(createOption);
			}
		} else {
			combatPrint("The game is over.")
		}
	}

	function useDagger() {
		if (hasAttacked === false) {
			return combatPrint("You are still recovering from your attack.");
		}
		if (
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true
		) {
			playerDamage = calcDamage(playerEquipped.stats, 1);
			playerRealDamage = Math.floor(playerDamage);
			enemy.health = enemy.health - playerRealDamage;
			combatPrint(
				"You attack " +
				enemy.name +
				" with your " +
				playerEquipped.name +
				" for " +
				playerRealDamage
			);
			if (checkDamageType(dagger, enemy) > 0) {
				combatPrint(
					"Your slash does extra damage " + enemy.vulnerability[1] + " damage"
				);
				enemy.health = enemy.health - enemy.vulnerability[1];
			}
			calcHealthBar("enemyHealth", enemy.health);
			if (Math.random() >= 0.06) {
				stab.play();
			} else {
				stabAlt.play();
			}
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			combatPrint("The game is over.");
		}
	}

	function usePistol() {
		if (hasAttacked === false) {
			return combatPrint("You are still recovering from your attack.");
		}
		if (player.ammo <= 0) {
			combatPrint("You do not have enough bullets")
		} else if (
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true
		) {
			playerDamage = calcDamage(pistol.stats, 1);
			playerRealDamage = Math.floor(playerDamage);
			enemy.health = enemy.health - playerRealDamage;
			player.ammo = player.ammo - pistol.ammoCost;
			combatPrint(
				"You shoot your revolver at " + enemy.name + " for " + playerRealDamage
			);
			if (checkDamageType(pistol, enemy) > 0) {
				combatPrint(
					"Revolver does extra damage " + enemy.vulnerability[1] + " damage"
				);
				enemy.health = enemy.health - enemy.vulnerability[1];
			}
			if (Math.random() >= 0.06) {
				revolverShot.play();
			} else {
				revolverShotAlt.play()
			}
			calcHealthBar("enemyHealth", enemy.health);
			calcAmmoBar("playerAmmo", player.ammo);
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			combatPrint("The game is over.")
		}
	}

	function reloadRevolver() {
		if (hasAttacked === false) {
			return combatPrint("You are still recovering from your attack.");
		}
		if (player.ammo != 0) {
			return combatPrint("You aren't out of ammo yet!");
		}
		if (ammoLoader.owned > 0) {
			player.ammo = player.ammo + ammoLoader.stats;
			ammoLoader.owned = ammoLoader.owned - 1;
			combatPrint("You reloaded your Revolver.");
			calcAmmoBar("playerAmmo", player.ammo);
			if (Math.random >= 0.06) {
				reload.play();
			} else {
				reloadAlt.play();
			}
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			combatPrint("You don't have anymore spare ammo.")
		}
	}

	function useBandage() {
		if (hasAttacked === false) {
			return combatPrint("You are still recovering from your attack.");
		}
		if (bandage.owned > 0) {
			player.health = player.health + bandage.stats;
			bandage.owned = bandage.owned - 1;
			combatPrint("You used a bandage. Your wounds stop bleeding");
			calcHealthBar("playerHealth", player.health);
			useHealing.play();
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			combatPrint("You don't have any bandages.");
		}
	}

	function combatSelect() {
		if (enemy == bandit) {
			combat(sherrif);
		} else {
			combat(bandit);
		}
	}

	function restart() {
		player.health = 100;
		player.ammo = 5;

		if (enemy && enemy.initialHealth) {
			enemy.health = enemy.initialHealth;
		}

		calcHealthBar("playerHealth", player.health);
		calcAmmoBar("playerAmmo", player.ammo);
		calcHealthBar("enemyHealth", enemy.health);

		document.getElementById("restart").style.display = "none";

		combat(enemy);
	}

	function combat(enemyFighting) {
		document.querySelector(".combatOutput").innerHTML = "";
		enemy = enemyFighting;
		combatPrint(enemy.greeting);

		player.health = 100;
		player.ammo = 5;
		calcHealthBar("playerHealth", player.health);
		calcAmmoBar("playerAmmo", player.ammo);

		if (enemy.attackFirst == true) {
			enemyTurn();
		}
		document.getElementById("enemyHealth").style.height = enemy.health + "px";
		calcHealthBar("enemyHealth", enemy.health);
	}

	combat(bandit);
});