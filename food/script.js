'use strict';

// #region Variables
let searchString = '';// string added to search url, created by user
let basicReturnedFood;// single food item from results that matches search
let advancedReturnedFood;// item returned after basic search for nutrition info
let recipes = [];// stores all recipes
let savedSearchItems = [];// save searches to avoid searching same things repeatedly
let currentRecipe;// holds currently selected recipe

// ingredient object
function Ingredient (name) {
	this.name = name;
};
// recipe object
function Recipe (name) {
	this.name = name;
	this.ingredients = [];
	this.totalCalories = function () {
		let totalCalories = 0;
		for (var i = 0; i < this.ingredients.length; i++) {
			// console.log(recipe.ingredients[i].food_name + recipe.ingredients[i].nf_calories);
			totalCalories += this.ingredients[i].nf_calories;
		}
		return this.name + ': ' + totalCalories + ' calories';
	};
};

// main food item container
let mainPanel = document.getElementsByClassName('itemContainer')[0];
// smaller food item details container
let detailsPanelL = document.getElementsByClassName('itemDetailsPanel')[0];
let detailsPanelR = document.getElementsByClassName('itemDetailsPanel')[1];
// picture of current searched item
let foodImageDiv = document.getElementsByClassName('itemImage')[0];
// search box text input
let searchInput = document.getElementById('searchInput');
// search submit button
let searchButton = document.getElementById('searchButton');
// save to recipe button
let addButton = document.getElementById('saveButton');
// get the h1 to display food name
let foodTitle = document.getElementById('itemTitle');
// and serving size
let serving = document.getElementsByClassName('itemDetails')[0];
//and amount
let amount = document.getElementsByClassName('itemDetails')[1];
// and calories
let calories = document.getElementsByClassName('itemDetails')[2];
// and cholesterol
let cholesterol = document.getElementsByClassName('itemDetails')[3];
// and fiber
let fiber = document.getElementsByClassName('itemDetails')[4];
// and protein
let protein = document.getElementsByClassName('itemDetails')[5];
// and saturated fat
let satFat = document.getElementsByClassName('itemDetails')[6];
// and total fat
let totFat = document.getElementsByClassName('itemDetails')[7];
// and carbs
let carbs = document.getElementsByClassName('itemDetails')[8];
// and sodium
let sodium = document.getElementsByClassName('itemDetails')[9];
// overlay for failed search
let searchFail = document.getElementsByClassName('searchFail')[0];
// new recipe button
let newRecipeButton = document.getElementById('newRecipe');
// recipe bar div
let recipeBar = document.getElementsByClassName('recipeBar')[0];
// screen overlay to alert when saved
let saveOverlay = document.getElementsByClassName('saved')[0];
// button to open menu
let openRecipeBookButton = document.getElementById('recipeBookButton');
// panel with recipes list
let recipeBookPanel = document.getElementsByClassName('recipeBookPanel')[0];
// display of currently selected recipe
let currentRecipeName = document.getElementById('currentRecipe');
// info panel for specific recipe
let recipeInfoPanel = document.getElementsByClassName('recipeContainer')[0];

let recipeTitle = document.getElementById('recipeTitle');

let recipeCalories = document.getElementsByClassName('recipeDetails')[0];
let recipeCholesterol = document.getElementsByClassName('recipeDetails')[1];
let recipeFiber = document.getElementsByClassName('recipeDetails')[2];
let recipeProtein = document.getElementsByClassName('recipeDetails')[3];
let recipeSatFat = document.getElementsByClassName('recipeDetails')[4];
let recipeTotFat = document.getElementsByClassName('recipeDetails')[5];
let recipeCarbs = document.getElementsByClassName('recipeDetails')[6];
let recipeSodium = document.getElementsByClassName('recipeDetails')[7];

// #endregion

// #region Event Listeners
// hide overlay when clicked, if visible
searchFail.addEventListener('click', toggleOverlay);
// call createrecipe when button is clicked
newRecipeButton.addEventListener('click', createRecipe);
// click on search button
searchButton.addEventListener('click', initiateSearch);
// click on save to recipe button
addButton.addEventListener('click', addToIngredients);
// press enter when typing in search box
searchInput.addEventListener('keypress', function (event) {
	if (event.key === 'Enter') { // only key we care about is Enter
		initiateSearch(); // call same function as clicking on search button
	}
});
// toggles recipe book when clicked
openRecipeBookButton.addEventListener('click', openRecipeBook);
// delete recipe
document.getElementById('deleteRecipe').addEventListener('click', deleteRecipe);
// edit name of recipe
document.getElementById('renameRecipe').addEventListener('click', renameRecipe);
// hide info panel
document.getElementById('hideRecipe').addEventListener('click', hideRecipe);
// #endregion

// #region Functions

// begins a basic search
function initiateSearch () {
	// input from user added to query and converted to lowercase
	searchString = searchInput.value.toLowerCase();
	if (searchString !== '') { // don't bother searching for a blank input
		searchInput.value = ''; // clear text box after searching
		basicSearch(); // call the function to do the search
		recipeInfoPanel.style.display = 'none';
		recipeBookPanel.style.display = 'none';
	}else{
		alert('Please enter a search item...');
	}
}

// shortcut to search from console
function food (input) {
	searchString = input.toLowerCase();
	basicSearch();
}

// recipe calorie counter
function getTotalCalories(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_calories;
	}
	return total;
}
function getTotalCholesterol(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_cholesterol;
	}
	return total;
}
function getTotalFiber(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_dietary_fiber;
	}
	return total;
}
function getTotalProtein(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_protein;
	}
	return total;
}
function getTotalSatFat(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_saturated_fat;
	}
	return total;
}
function getTotalTotFat(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_total_fat;
	}
	return total;
}
function getTotalCarbs(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_total_carbohydrate;
	}
	return total;
}
function getTotalSodium(recipe){
	let total = 0;
	for (let i = 0; i < recipe.ingredients.length; i++) {
		total += recipe.ingredients[i].nf_sodium;
	}
	return total;
}
// create new recipe when button clicked
function createRecipe(){
	let recipeName = prompt('Name of recipe:');
	if(recipeName != '' && recipeName != null){
		let newRecipe = new Recipe(recipeName);
		recipes.push(newRecipe);
		save();
		populateRecipeBook();
	}else{
		alert('Invalid Name...');
	}
}

// DEPRECATED
function refreshRecipeBar () {
	if (window.localStorage.getItem('savedRecipes')) {
		recipeBar.innerHTML = '<h4>Recipe Book</h4>';
		recipes = JSON.parse(window.localStorage.getItem('savedRecipes'));
		for (var i = 0; i < recipes.length; i++) {
			// create recipe div and add to bar
			let node = document.createElement('Div');
			node.setAttribute('class', 'recipe');
			node.addEventListener('click', loadRecipe);
			let textnode = document.createTextNode(recipes[i].name);
			node.appendChild(textnode);
			recipeBar.appendChild(node);
			recipes[i].div = node;
		}
	}
}

// saves recipes when edited/created
function save () {
	window.localStorage.setItem('savedRecipes', JSON.stringify(recipes));
}

// console function to delete all recipes
function deleteStorage () {
	window.localStorage.removeItem('savedRecipes');
	console.log('deleted saved recipes');
}

// adds current food item to recipe
function addToIngredients () {
	if (currentRecipe) {
		for (var i = 0; i < currentRecipe.ingredients.length; i++) {
			if (advancedReturnedFood===currentRecipe.ingredients[i]) {
				alert('already in recipe');
				return;
			}
		}
		// console.log(advancedReturnedFood);
		currentRecipe.ingredients.push(advancedReturnedFood.foods[0]);
		saveOverlay.style.visibility = 'visible';
		setTimeout(toggleSaveOverlay, 500);
		save();
	} else {
		alert('No recipe selected...');
	}
}

// does a broad search for food to get photo and ID
function basicSearch () {
	// create request to query database
	let xhttp = new XMLHttpRequest();
	// create function to check for return from database
	xhttp.onreadystatechange = function () {
		// if return is good...
		if (this.readyState === 4 && this.status === 200) {
			// parse JSON results into object...
			let basicResults = JSON.parse(this.response);
			// search through common results to match initial search name...
			for (let i = 0; i < basicResults.common.length; i++) {
				// convert test case to lowercase to avoid mismatch Apple and apple
				let tempfood = basicResults.common[i].food_name.toLowerCase();
				// if a match is found...
				if (tempfood === searchString) {
					// show panel
					// mainPanel.style.visibility = 'visible';
					mainPanel.style.display = 'flex';
					// set match to variable
					basicReturnedFood = basicResults.common[i];
					// pull image url and send to function
					loadFoodImage(basicReturnedFood.photo.thumb)
					//set title to item
					foodTitle.innerHTML = basicReturnedFood.food_name;
					// get more details on match
					advancedSearch();
					// return when found, else overlay will pop up
					return;
				}
			}
			searchFail.style.visibility = 'visible';
		}
	};
	// open request with string that adds user query
	xhttp.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=' + searchString, true);
	// necessary headers for nutritionix
	xhttp.setRequestHeader('x-app-id', '3e59bca3');
	xhttp.setRequestHeader('x-app-key', '3599573c496f4cbcade79edde4835391');
	xhttp.setRequestHeader('x-remote-user-id', '0');
	// send that request
	xhttp.send();
};

// does a search for food using name from basic search
function advancedSearch () {
	// create request to query database
  let xhttp = new XMLHttpRequest();
	// create function to check for return from database
	xhttp.onreadystatechange = function () {
		// if return is good...
		if (this.readyState === 4 && this.status === 200) {
			// parse JSON results into object...
			advancedReturnedFood = JSON.parse(this.response);
			// send object to loadinfo to populate page info
			loadInfo(advancedReturnedFood);
		}
	};
	xhttp.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients', true);
	// necessary headers for nutritionix
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('x-app-id', '3e59bca3');
	xhttp.setRequestHeader('x-app-key', '3599573c496f4cbcade79edde4835391');
	xhttp.setRequestHeader('x-remote-user-id', '0');
	// send that request
	xhttp.send('{"query":"' + basicReturnedFood.food_name + '"}');
};

// loads image from returned search object
function loadFoodImage (url) {
	foodImageDiv.style.backgroundImage = 'url(' + url + ')';
}

// setup info pane for food item, arg is object from advanced search
function loadInfo (item) {
	serving.innerHTML = 'Serving Size: ';
	amount.innerHTML = item.foods[0].serving_qty + ' ' + item.foods[0].serving_unit;
	calories.innerHTML = 'Calories: ' + item.foods[0].nf_calories;
	cholesterol.innerHTML = 'Cholesterol(mg): ' + item.foods[0].nf_cholesterol;
	fiber.innerHTML = 'Fiber(g): ' + item.foods[0].nf_dietary_fiber;
	protein.innerHTML = 'Protein(g): ' + item.foods[0].nf_protein;
	satFat.innerHTML = 'Saturated Fat(g): ' + item.foods[0].nf_saturated_fat;
	totFat.innerHTML = 'Total Fat(g): ' + item.foods[0].nf_total_fat;
	carbs.innerHTML = 'Carbs(g): ' + item.foods[0].nf_total_carbohydrate;
	sodium.innerHTML = 'Sodium(mg): ' + item.foods[0].nf_sodium;
	// detailsPanelL.style.visibility = 'visible';
	// detailsPanelR.style.visibility = 'visible';
	detailsPanelL.style.display = 'flex';
	detailsPanelR.style.display = 'flex';
	if(currentRecipe){
		addButton.style.visibility = 'visible';
	}
}

// sets recipe as currently selected
function loadRecipe(){
	for (var i = 0; i < recipes.length; i++) {
		if(recipes[i].div === this){
			// document.getElementById('currentRecipeName').innerHTML = recipes[i].name;
			currentRecipe = recipes[i];
			currentRecipe.recipesIndex = i;
			openRecipeInfo();
			currentRecipeName.innerHTML = 'Current Recipe: ' + recipes[i].name;
			addButton.style.visibility = 'visible';
		}
	}
}

//opens info menu for selected recipe
function openRecipeInfo(){
	mainPanel.style.display = 'none';
	recipeBookPanel.style.display = 'none';
	recipeInfoPanel.style.display = 'flex';
	recipeTitle.innerHTML = currentRecipe.name;
	recipeCalories.innerHTML = 'Calories: ' + +getTotalCalories(currentRecipe).toFixed(2);
	recipeCholesterol.innerHTML = 'Cholesterol(mg): ' + +getTotalCholesterol(currentRecipe).toFixed(2);
	recipeFiber.innerHTML = 'Fiber(g): ' + +getTotalFiber(currentRecipe).toFixed(2);
	recipeProtein.innerHTML = 'Protein(g): ' + +getTotalProtein(currentRecipe).toFixed(2);
	recipeSatFat.innerHTML = 'Saturated Fat(g): ' + +getTotalSatFat(currentRecipe).toFixed(2);
	recipeTotFat.innerHTML = 'Total Fat(g): ' + +getTotalTotFat(currentRecipe).toFixed(2);
	recipeCarbs.innerHTML = 'Carbs(g): ' + +getTotalCarbs(currentRecipe).toFixed(2);
	recipeSodium.innerHTML = 'Sodium(mg): ' + +getTotalSodium(currentRecipe).toFixed(2);
}

// changes recipe name in recipes array
function renameRecipe(){
	let newName = prompt('What would you like to call this recipe?')
	currentRecipe.name = newName;
	recipes[currentRecipe.recipesIndex].name = newName;
	save();
}

// deletes recipe after confirmation
function deleteRecipe(){
	if(confirm('Are you sure?')){
		recipes.splice(currentRecipe.recipesIndex, 1);
		currentRecipeName.innerHTML = '';
		currentRecipe = null;
	}
	save();
	recipeInfoPanel.style.display = 'none';
	if(advancedReturnedFood){
		mainPanel.style.display = 'flex';
	}
}

// hides info panel
function hideRecipe(){
	recipeInfoPanel.style.display = 'none';
	if(advancedReturnedFood){
		mainPanel.style.display = 'flex';
	}
}

// toggles menu overlay on/off
function openRecipeBook () {
	if(recipeBookPanel.style.display !== 'flex') {
		recipeInfoPanel.style.display = 'none';
		mainPanel.style.display = 'none';
		recipeBookPanel.style.display = 'flex';
		populateRecipeBook();
	} else {
		recipeBookPanel.style.display = 'none';
		if(advancedReturnedFood){
			mainPanel.style.display = 'flex';
		}
	}
}

// adds all saved recipes to menu
function populateRecipeBook () {
	if (window.localStorage.getItem('savedRecipes')) {
		recipeBookPanel.innerHTML = '';
		recipes = JSON.parse(window.localStorage.getItem('savedRecipes'));
		for (var i = 0; i < recipes.length; i++) {
			// create recipe div and add to bar
			let node = document.createElement('Div');
			node.setAttribute('class', 'recipe');
			node.addEventListener('click', loadRecipe);
			let textnode = document.createTextNode(recipes[i].name);
			node.appendChild(textnode);
			recipeBookPanel.appendChild(node);
			recipes[i].div = node;
		}
	}

}

// will turn off search failed overlay when clicked on
function toggleOverlay () {
	if (searchFail.style.visibility === 'visible') {
		searchFail.style.visibility = 'hidden';
	}
}

// turns off save overlay
function toggleSaveOverlay () {
	saveOverlay.style.visibility = 'hidden';
}
// #endregion
