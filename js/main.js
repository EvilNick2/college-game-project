$(document).ready(function () {
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
			"",
		health: 100,
		attackFirst: true,
		moveNum: 2,
		moves: [
			["punch", 5],
			["slash", 8]
		],
		vulnerability: ["piercing", 5]
	}

	var sherrif = {}

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
		document.getElementById(name).style.height = health * 2 + "px";
	}

	function calcAmmoBar(name, ammo) {
		document.getElementById(name).style.height = ammo * 50 + "px";
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
			calcHealthBar("enemyHealth", enemy.health);
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
		if (
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true &&
			player.ammo >= 1
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
			calcHealthBar("enemyHealth", enemy.health);
			calcAmmoBar("playerAmmo", player.ammo);
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			combatPrint("You do not have enough bullets");
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
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			combatPrint("You don't have any bandages.");
		}
	}

	function combatSelect() {
		if (enemy == bandit) {
			combat(player, bandit);
			player.health = 100;
			player.ammo = 5;
		} else {
			combat(player, sherrif);
			player.health = 100;
			player.ammo = 5;
		}
	}

	function combat(player, enemyFighting) {
		enemy = enemyFighting;
		combatPrint(enemy.greeting);
		if (enemy.attackFirst == true) {
			enemyTurn();
		}
		document.getElementById("enemyHealth").style.height = enemy.health + "px";
	}

	combat(player, bandit);
	calcHealthBar("playerHealth", player.health)
	calcHealthBar("enemyHealth", enemy.health)
	calcAmmoBar("playerAmmo", player.ammo)
});