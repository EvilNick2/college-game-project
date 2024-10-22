$(document).ready(function () {
	// Attach event listeners to allow buttons to work
	function attachListeners() {
		document
			.getElementById("explore")
			.addEventListener("click", explore, false);
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
		document.getElementById("explore").disabled = true; // Disable the button

		// Delay exploration result by 1 second
		setTimeout(() => {
			const randomValue = Math.random(); // Generate a random value between 0 and 1

			// 30% chance to encounter an enemy
			if (randomValue < 0.3) {
				const enemy = getRandomEnemy(enemies); // Get a random enemy based on weights
				textPrint("You encountered an enemy!");
				savePlayerStats(); // Save the players stats
				// Redirect to the combat page after 2 seconds
				setTimeout(() => {
					window.location.href = `combat.php?enemy=${enemy}`;
				}, 2000);

			// 20% chance to find a bandage 
			} else if (randomValue < 0.5) {
				textPrint("You found a bandage!");
				// Update the inventory to add one bandage
				updateInventory("bandage", getInventoryItemQuantity("bandage") + 1);

			// 10% chance to find an ammo loader
			} else if (randomValue < 0.6) {
				textPrint("You found an ammo loader!");
				// Update the inventory to add one ammo loader
				updateInventory("ammoLoader", getInventoryItemQuantity("ammoLoader") + 1);

			// 40% chance to find nothing
			} else {
				textPrint("You found nothing of interest.");
			}

			document.getElementById("explore").disabled = false; // Re-enable the button
		}, 1000);
	}

	// Function call to get the players stats from the database
	fetchPlayerStats(function (data) {
		// Update the players stats with the values gotten from the database
		player.health = data.stats.health;
		player.ammo = data.stats.ammo;
		player.inventory = data.inventory.map(item => [item.item_name, item.quantity]);

		// Update the health and ammo bars to correctly display the player's stats
		calcHealthBar("playerHealth", player.health, player.initialHealth);
		calcAmmoBar("playerAmmo", player.ammo, player.initialAmmo);

		textPrint("Welcome to Blood in Dust, You are a rugged outlaw on the western frontier, by the name of Clint. As you explore the west you will encounter lots of foes who are out to attack and rob you. Press the explore journey to start your journey across 1880's America!." )
		textPrint("Be careful out there cowboy...")
	});
});