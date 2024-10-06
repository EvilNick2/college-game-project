<h1 align="center">College Game Project User Guide and FAQ</h1>

<p align="center">
	<a href="#dart-user-guide">User Guide</a> &#xa0; | &#xa0; 
	<a href="#question-faq">FAQ</a> &#xa0; | &#xa0;
	<a href="#memo-license">License</a> &#xa0; | &#xa0;
	<a href="https://github.com/EvilNick2" target="_blank">Author</a>
</p>

## :dart: User Guide ##

## :question: FAQ ##

1. **What is the purpose of this project?**
   - This game is made for a college project. The game is set in western times and has combat elements as well as exploration and looting and takes insperation from games like the Red Dead Redemption series

2. **How do I start combat?**
   - To start combat, open [index.html](index.html) in your browser and clicking the play text on the poster once at the exploration page you will need to explore and will have a 30% chance to encounter an enemy. 

3. **What are the main features of the game?**
   - The combat system includes:
     - Attacking enemies with different weapons (e.g., dagger, revolver).
     - Reloading weapons.
     - Using items like bandages.
     - Managing health and ammo.
   - The exploration system includes:
     - Exploring the in game world.
     - Looting items to use in combat. (This still needs to be implemented)

4. **How do I attack an enemy?**
   - You can attack an enemy by clicking the "Use Dagger" or "Use Revolver" buttons in the combat menu.

5. **How do I reload my weapon?**
   - To reload your revolver, click the "Reload Revolver" button in the combat menu and is blocked until the user has run out of ammo.

6. **How do I use items during combat?**
   - You can use items like bandages by clicking the "Use Bandage" button in the combat menu. This action is managed by the [`useBandage`](js/combat.js) function.

7. **How do I check the health and ammo status?**
   - The health and ammo status are displayed as bars in the combat interface. You can also hover over the bars to see the current values. The functions [`calcHealthBar`](js/combat.js) and [`calcAmmoBar`](js/combat.js) update these bars based on the current values.

8. **What happens when the game is over?**
   - When the game is over, a message will be displayed indicating whether you won or lost. Depending on if you win or lose you will either be taken back to the exploration page or taken back to the main menu respectivly.

9. **How do I navigate back to the main menu?**
    - To navigate back to the main menu, open [index.html](index.html) in your browser. You can click on the "Go to Combat" area on the wanted poster to return to the combat screen.

10. **How do I report a bug or suggest a feature?**
    - You can report bugs or suggest features by opening an issue in the project's repository or contacting the project maintainers directly.

11. **What technologies are used in this project?**
    - This project uses HTML, CSS, JavaScript, and jQuery for the front-end development. The combat logic is primarily implemented in [js/combat.js](js/combat.js) and the exploration logic is primarily implemented in [js/explore.js](js/explore.js).

## :memo: License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.


Made with :heart: by <a href="https://github.com/EvilNick2" target="_blank">EvilNick2</a>

&#xa0;

<a href="#top">Back to top</a>