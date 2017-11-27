'use strict';

// item returned from search for nutrition info
let searchedItem;
// holds currently selected recipes index in recipes[]
let currentRecipe;
// make empty array
let recipes = [];
// make another empty array
let savedSearchItems = [];

// check for save and fill array, or create blank JSON to start with
function savedRecipesCheck () {
	if (window.localStorage.getItem('savedRecipes')) {
		// load if found
		recipes = JSON.parse(window.localStorage.getItem('savedRecipes'));
	} else {
		// create blank storage to avoid errors if storage is cleared
		window.localStorage.setItem('savedRecipes', JSON.stringify(recipes));
		savedRecipesCheck();
	}
}
function savedItemsCheck () {
	if (window.localStorage.getItem('savedSearchItems')) {
		// load if found
		savedSearchItems = JSON.parse(window.localStorage.getItem('savedSearchItems'));
	} else {
		// create blank storage to avoid errors if storage is cleared
		window.localStorage.setItem('savedSearchItems', JSON.stringify(savedSearchItems));
		savedItemsCheck();
	}
}
savedRecipesCheck();
savedItemsCheck();

// ingredient object
function Ingredient (item, amount) {
	// name of ingredient
	this.item = item;
	// amount of item used in recipe
	this.amount = amount;
};

// recipe object
function Recipe (name) {
	// name of recipe
	this.name = name;
	// array of ingredients stored in recipe
	this.ingredients = [];
};

// search box text input
let searchInput = document.getElementById('searchInput');
// search submit button
let searchButton = document.getElementById('searchButton');

// main food item container
let mainPanel = document.getElementsByClassName('itemContainer')[0];
// smaller food item details container
let detailsPanelL = document.getElementsByClassName('itemDetailsPanel')[0];
let detailsPanelR = document.getElementsByClassName('itemDetailsPanel')[1];
// picture of current searched item
let foodImageDiv = document.getElementsByClassName('itemImage')[0];
// save to recipe button
let addButton = document.getElementById('saveButton');
// get the h1 to display food name
let foodTitle = document.getElementById('itemTitle');
// and serving size
let serving = document.getElementsByClassName('itemDetails')[0];
// and amount
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
// screen overlay to alert when saved
let saveOverlay = document.getElementsByClassName('saved')[0];

// new recipe button
let newRecipeButton = document.getElementById('newRecipe');
// button to open menu
let openRecipeBookButton = document.getElementById('recipeBookButton');
// panel with recipes list
let recipeBookPanel = document.getElementsByClassName('recipeBookPanel')[0];
// display of currently selected recipe
let currentRecipeName = document.getElementById('currentRecipe');

// info panel for specific recipe, basically same as food item
let recipeInfoPanel = document.getElementsByClassName('recipeContainer')[0];
let recipeIngredients = document.getElementsByClassName('recipeIngredientsPanel')[0];
let recipeTitle = document.getElementById('recipeTitle');
let recipeCalories = document.getElementsByClassName('recipeDetails')[0];
let recipeCholesterol = document.getElementsByClassName('recipeDetails')[1];
let recipeFiber = document.getElementsByClassName('recipeDetails')[2];
let recipeProtein = document.getElementsByClassName('recipeDetails')[3];
let recipeSatFat = document.getElementsByClassName('recipeDetails')[4];
let recipeTotFat = document.getElementsByClassName('recipeDetails')[5];
let recipeCarbs = document.getElementsByClassName('recipeDetails')[6];
let recipeSodium = document.getElementsByClassName('recipeDetails')[7];

// hides overlay when clicked, if visible
searchFail.addEventListener('click', toggleOverlay);
// call create recipe when button is clicked
newRecipeButton.addEventListener('click', createRecipe);
// click on search button
searchButton.addEventListener('click', initiateSearch);
// click on save to recipe button
addButton.addEventListener('click', addToIngredients);
// toggles recipe book when clicked
openRecipeBookButton.addEventListener('click', toggleRecipeBook);
// delete recipe
document.getElementById('deleteRecipe').addEventListener('click', deleteRecipe);
// edit name of recipe
document.getElementById('renameRecipe').addEventListener('click', renameRecipe);
// hide info panel
document.getElementById('hideRecipe').addEventListener('click', hideRecipe);
// press enter when typing in search box
searchInput.addEventListener('keypress', function (event) {
	// only key we care about is Enter
	if (event.key === 'Enter') {
		// call same function as clicking on search button
		initiateSearch();
	}
});
