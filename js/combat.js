$(document).ready(function () {
	// Define the audio files that are used
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

	// Attach event listerners to allow buttons to work
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

	// Player's initial stats and inventory
	var player = {
		health: 100,
		initialHealth: 100,
		ammo: 5,
		initialAmmo: 5,
		inventory: [],
		travelHistory: []
	};

	// Weapon: Small Dagger
	var dagger = {
		name: "Small Dagger",
		stats: 10,
		damageType: "slash"
	};

	// Weapon: Revolver
	var pistol = {
		name: "Revolver",
		stats: 20,
		damageType: "piercing",
		ammoCost: 1,
		owned: false
	};

	// Item: Ammo Loader
	var ammoLoader = {
		name: "Ammo Loader",
		stats: 5,
		owned: 2
	};

	// Item: Bandage
	var bandage = {
		name: "Bandage",
		stats: 25,
		owned: 2
	};

	// Enemy: Bandit
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
	};

	// Enemy: Sheriff
	var sheriff = {
		name: "Sheriff",
		greeting:
			"A sheriff approaches. 'Hey cowpoke, I heard you was breaking the law!'",
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
	};

	// Player's equipped weapon and damage variables
	let playerEquipped = dagger;
	let playerDamage;
	// Enemies move and damage values
	let enemyMove;
	let enemyDamage;
	let hasAttacked = true;	// Flag to check if the player has attacked

	// Function to read the player's data from the database
	function fetchPlayerStats(callback) {
		$.ajax({
			url: '../php/fetchPlayerStats.php',
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

	// Function to save the player's data to the database
	function savePlayerStats() {
		$.ajax({
			url: '../php/savePlayerStats.php',
			method: 'POST',
			data: {
				health: player.health,
				ammo: player.ammo,
				inventory: player.inventory
			},
			success: function (response) {
				console.log('Player stats saved successfully:', response);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error('Error saving player stats:', textStatus, errorThrown);
			}
		});
	}

	// Function to check the passed enemy data from the explore URL redirect
	function getQueryParams() {
		const params = {};
		window.location.search.substring(1).split("&").forEach(param => {
			const [key, value] = param.split("=");
			params[key] = decodeURIComponent(value);
		});
		return params;
	}

	// Function to print text to the output box
	function textPrint(input) {
		$(".output")
			.append("<p class='text-center'>" + input + "</p>");
		var textOutputDiv = document.querySelector(".textOutput");
		textOutputDiv.scrollTop = textOutputDiv.scrollHeight;
		$("#commandline").val("");
	}

	// Function to check if the game is over and redirect the player to correct pages
	function gameOverCheck(playerHealth, enemyHealth) {
		if (playerHealth <= 0) {
			textPrint("You lose. Taking you back to the main menu...");
			savePlayerStats();
			setTimeout(() => {
				window.location.href = "mainMenu.html";
			}, 2000);
			return true;
		} else if (enemyHealth <= 0) {
			textPrint("You've defeated the " + enemy.name + ". Taking you back to exploration...");
			savePlayerStats();
			setTimeout(() => {
				window.location.href = "explore.php";
			}, 2000);
			return true;
		}
		return false;
	}

	// Calculate the damage that a move will do within a range
	function calcDamage(max, min) {
		damage = Math.random() * (max - min) + min;
		return Math.floor(damage)
	}

	// Calculate what move an enemy is going to use
	function calcEnemyMove(name) {
		var movesNum = name.moveNum;
		return Math.floor(calcDamage(movesNum + 1, 1)) - 1;
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

	// Check the damage type and apply extra damage if applicable
	function checkDamageType(damageTypeAttacking, enemyDamageType) {
		if (damageTypeAttacking.damageType === enemyDamageType.vulnerability[0]) {
			return enemyDamageType.vulnerability[1];
		}
	}

	// Function to update the players inventory when an item is used
	function updateInventory(itemName, quantity) {
		for (let i = 0; i < player.inventory.length; i++) {
			if (player.inventory[i][0] === itemName) {
				player.inventory[i][1] = quantity;
				break;
			}
		}
	}

	// Function to get the quantity of an item from the player's inventory
	function getInventoryItemQuantity(itemName) {
		for (let i = 0; i < player.inventory.length; i++) {
			if (player.inventory[i][0] === itemName) {
				return player.inventory[i][1];
			}
		}
		return 0; // Return 0 if the item is not found in the inventory
	}

	// Function to handle the enemies turn
	function enemyTurn() {
		if (gameOverCheck(player.health, enemy.health) == false) {
			enemyMove = calcEnemyMove(enemy);
			enemyDamage = calcDamage(enemy.moves[enemyMove][1], 1);
			player.health = player.health - enemyDamage;
			textPrint(
				enemy.name +
				" attacks you with " +
				enemy.moves[enemyMove][0] +
				" for " +
				enemyDamage +
				"!"
			);
			calcHealthBar("playerHealth", player.health, player.initialHealth);
			hasAttacked = true;
		} else { }
	}

	// Function to use the dagger item
	function useDagger() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (
			// Check if the game has ended and if the player has not attacked
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true
		) {
			playerDamage = calcDamage(playerEquipped.stats, 1);
			enemy.health = enemy.health - playerDamage;
			textPrint(
				"You attack " +
				enemy.name +
				" with your " +
				playerEquipped.name +
				" for " +
				playerDamage
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

	// Function to use the revolver weapon
	function usePistol() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (player.ammo <= 0) {
			textPrint("You do not have enough bullets")
		} else if (
			// Check if the game has ended and if the player has not attacked
			gameOverCheck(player.health, enemy.health) === false &&
			hasAttacked === true
		) {
			playerDamage = calcDamage(pistol.stats, 10);
			enemy.health = enemy.health - playerDamage;
			player.ammo = player.ammo - pistol.ammoCost;
			textPrint(
				"You shoot your revolver at " + enemy.name + " for " + playerDamage
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

	// Function to handle the reloading of the revolver
	function reloadRevolver() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (player.ammo != 0) {
			return textPrint("You aren't out of ammo yet!");	// Stop the player from reloading until they're out of ammo
		}
		if (ammoLoader.owned > 0) {
			player.ammo = player.ammo + ammoLoader.stats;
			ammoLoader.owned = ammoLoader.owned - 1;
			updateInventory("ammoLoader", ammoLoader.owned)
			textPrint("You reloaded your Revolver.");
			calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);
			reload.play();
			setTimeout(enemyTurn, 2000);
			hasAttacked = false;
		} else {
			textPrint("You don't have anymore spare ammo.")
		}
	}

	// Function to handle the player using a bandage
	function useBandage() {
		if (hasAttacked === false) {
			return textPrint("You are still recovering from your attack.");
		}
		if (bandage.owned > 0) {
			player.health = player.health + bandage.stats;
			bandage.owned = bandage.owned - 1;
			updateInventory("bandage", bandage.owned)
			textPrint("You used a bandage. Your wounds stop bleeding");
			useHealing.play();
			if (player.health > 100) {
				player.health = 100
			}
			calcHealthBar("playerHealth", player.health, player.initialHealth);
			setTimeout(enemyTurn, 1000);
			hasAttacked = false;
		} else {
			textPrint("You don't have any bandages.");
		}
	}

	// Function to start the combat with the specified enemy
	function combat(enemyFighting) {
		document.querySelector(".output").innerHTML = "";
		enemy = enemyFighting;
		textPrint("Welcome to combat! The red bar on the left is the health of your character. The blue bar is your current ammo loaded. The red bar on the right of the screen is your enemies health. ")
		textPrint(enemy.greeting);

		calcHealthBar("playerHealth", player.health, player.initialHealth);
		calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);

		// // Set the enemy image based on enemy type
		const enemyImage = document.getElementById("enemyImage");
		if (enemy.name === "Bandit") {
			enemyImage.src = "../imgs/bandit.png"; // Update with the correct path to the bandit image
		} else if (enemy.name === "Sheriff") {
			enemyImage.src = "../imgs/sheriff.png"; // Update with the correct path to the sheriff image
		}

		// Check if the enemy has the attack first flag
		if (enemy.attackFirst == true) {
			enemyTurn();
		}
		// Update the enemies health and update their health bar
		document.getElementById("enemyHealth").style.height = enemy.health + "px";
		calcHealthBar("enemyHealth", enemy.health, enemy.initialHealth);
	}

	// Function call to get the players stats from the database
	fetchPlayerStats((data) => {
		// Update the players stats with the values gotten form the database
		player.health = data.stats.health;
		player.ammo = data.stats.ammo;
		player.inventory = data.inventory.map(item => [item.item_name, item.quantity]);

		// Update the bar displays with the newly set values from the database
		calcHealthBar("playerHealth", player.health, player.initialHealth);
		calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);

		// Update the items owned with the item counts updated from the database
		ammoLoader.owned = getInventoryItemQuantity("ammoLoader");
		bandage.owned = getInventoryItemQuantity("bandage");

        

		// Get the encountered enemy from the URL and start the combat
		const params = getQueryParams();
		if (params.enemy) {
			let enemy;
			if (params.enemy === "bandit") {
				enemy = bandit;
			} else if (params.enemy === "sheriff") {
				enemy = sheriff;
			}
			if (enemy) {
				combat(enemy);
			}
		}
	});
});