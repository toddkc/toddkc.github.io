'use strict';

// this script holds all recipe related code

// create new recipe when button clicked
function createRecipe() {
  // prompt for name input
  let recipeName = prompt('Name of recipe:');
  // validate input
  if (recipeName !== '' && recipeName != null) {
    // create new recipe with input name
    let newRecipe = new Recipe(recipeName);
    // add to stored recipes array
    recipes.push(newRecipe);
    // save recipes[]
    save();
    // reload array
    load();
    // set current recipe to match in array
    currentRecipe = recipes.length - 1;
    // call function to show icon in menu
    updateCurrentRecipe();
    // check what panels are currently active
    if (mainPanel.style.display === 'flex') {
      // reload food panel if active
      loadInfo(searchedItem);
    }
    // check what panels are currently active
    if (recipeBookPanel.style.display === 'flex') {
      // reload recipe book if active
      populateRecipeBook();
    }
  }
}

// update current recipe menu icon
function updateCurrentRecipe() {
  // check if there is a recipe loaded
  if (currentRecipe !== null) {
    // add icon class to show icon
    currentRecipeName.setAttribute('class', 'icon');
    // input name of recipe
    currentRecipeName.innerHTML = recipes[currentRecipe].name;
    // add listener for click
    currentRecipeName.addEventListener('click', currentIconClicked);
  } else {
    // set name to nothing
    currentRecipeName.innerHTML = '';
    // remove class to hide icon
    currentRecipeName.removeAttribute('class');
  }
}

// open info panel when clicked
function currentIconClicked() {
  // hide all menus
  mainPanel.style.display = 'none';
  recipeBookPanel.style.display = 'none';
  recipeInfoPanel.style.display = 'none';
  // reload info panel
  openRecipeInfo();
}

// sets recipe as currently selected
function loadRecipe() {
  // loop through saved recipes
  for (let i = 0; i < recipes.length; i++) {
    // when proper one is found...
    if (recipes[i].div === this) {
      // set current recipe to saved one
      currentRecipe = i;
      // call function to open info screen
      openRecipeInfo();
      // call function to update menu icon
      updateCurrentRecipe();
      // show add ingredient button
      addButton.style.visibility = 'visible';
    }
  }
}

// opens info menu for selected recipe
function openRecipeInfo() {
  //needs to get current recipe

  // hide logo
  hideLogo();
  // hide food info
  mainPanel.style.display = 'none';
  // hide recipe book
  recipeBookPanel.style.display = 'none';
  // show info panel
  recipeInfoPanel.style.display = 'flex';
  // update inner html and call nutrition functions
  recipeTitle.innerHTML = recipes[currentRecipe].name;
  recipeCalories.innerHTML = 'Calories: ' + +getTotalCalories(recipes[currentRecipe]).toFixed(2);
  recipeCholesterol.innerHTML = 'Cholesterol(mg): ' + +getTotalCholesterol(recipes[currentRecipe]).toFixed(2);
  recipeFiber.innerHTML = 'Fiber(g): ' + +getTotalFiber(recipes[currentRecipe]).toFixed(2);
  recipeProtein.innerHTML = 'Protein(g): ' + +getTotalProtein(recipes[currentRecipe]).toFixed(2);
  recipeSatFat.innerHTML = 'Saturated Fat(g): ' + +getTotalSatFat(recipes[currentRecipe]).toFixed(2);
  recipeTotFat.innerHTML = 'Total Fat(g): ' + +getTotalTotFat(recipes[currentRecipe]).toFixed(2);
  recipeCarbs.innerHTML = 'Carbs(g): ' + +getTotalCarbs(recipes[currentRecipe]).toFixed(2);
  recipeSodium.innerHTML = 'Sodium(mg): ' + +getTotalSodium(recipes[currentRecipe]).toFixed(2);
  // clear ingredients before updating
  recipeIngredients.innerHTML = '';
  // loop through each ingredient in recipe
  for (let i = 0; i < recipes[currentRecipe].ingredients.length; i++) {
    // store ingredient as temp variable
    let currIng = recipes[currentRecipe].ingredients[i].item;
    // store saved amount of ingredient
    let currAm = recipes[currentRecipe].ingredients[i].amount;
    // create main div
    let node = document.createElement('Div');
    // set class on main div
    node.setAttribute('class', 'ingredient');
    // create div for image
    let image = document.createElement('Div');
    // set class on div
    image.setAttribute('class', 'ingredientImage');
    // set div to ingredient for event listener
    recipes[currentRecipe].ingredients[i].div = image;
    // add event listener to div
    image.addEventListener('click', loadIngredient);
    // set src on div for pic url
    image.setAttribute('style',
      'background-image: url(' + currIng.photo.thumb + ');');
    // create div for serving size of ingredient
    let amount = document.createElement('Div');
    // set class on div
    amount.setAttribute('class', 'ingredientAmount');
    // create textnode to store amount text
    let amountText = document.createTextNode(
      currIng.serving_qty + ' ' + currIng.serving_unit);
    // create div for selector
    let multiplier = document.createElement('Div');
    // add class to div
    multiplier.setAttribute('class', 'amountContainer');
    // html to create dropdown
    multiplier.innerHTML =
      '<label for="amount">: Servings: </label>\
			<select class="amountDropdown" name="amount">\
			<option value="0.25">0.25x</option>\
			<option value="0.50">0.50x</option>\
			<option value="0.75">0.75x</option>\
			<option value="1.00">1.00x</option>\
			<option value="1.25">1.25x</option>\
			<option value="1.50">1.50x</option>\
			<option value="1.75">1.75x</option>\
			<option value="2.00">2.00x</option>\
			<option value="2.25">2.25x</option>\
			<option value="2.50">2.50x</option>\
			<option value="2.75">2.75x</option>\
			<option value="3.00">3.00x</option>\
			</select>';
    // save drop to variable
    let select = multiplier.getElementsByTagName('select')[0];
    // save all options to variable
    let amountArray = multiplier.getElementsByTagName('option');
    // loop through options to find current amount multiplier
    for (let i = 0; i < amountArray.length; i++) {
      // check stored amount against each dropdown value
      if (currAm === amountArray[i].getAttribute('value')) {
        // when found add the selected attr to set correct amount
        amountArray[i].setAttribute('selected', 'selected');
      }
    }
    // assign dropdown to ingredient to track change
    recipes[currentRecipe].ingredients[i].selector = select;
    // add event listener to dropdown
    select.addEventListener('change', changeAmount);
    // add text to div
    amount.appendChild(amountText);
    // add image div to main div
    node.appendChild(image);
    // add amount div to main div
    node.appendChild(amount);
    // add multiplier div to main div
    node.appendChild(multiplier);
    // add main div to document
    recipeIngredients.appendChild(node);
  }
}

// called when recipe ingredient multiplier is changed
function changeAmount() {
  // loop through each ingredient
  for (let i = 0; i < recipes[currentRecipe].ingredients.length; i++) {
    // find the ingredient that matches the changed selector
    if (recipes[currentRecipe].ingredients[i].selector === this) {
      // update the amount value in current recipe
      recipes[currentRecipe].ingredients[i].amount = this.value;
      // call save funtion to save changes
      save();
      // refresh recipe screen to show changes
      openRecipeInfo();
      // exit function
      return;
    }
  }
  // mainly for debug
  alert('Change amount not working!');
}

// changes recipe name in recipes array
function renameRecipe() {
  // prompt for new name
  let newName = prompt('What would you like to call this recipe?');
  // set new name on current recipe
  recipes[currentRecipe].name = newName;
  // save recipes[]
  save();
  // refresh to update name
  openRecipeInfo();
  // refresh to update menu bar icon
  updateCurrentRecipe();
}

// deletes recipe
function deleteRecipe() {
  // prompt for confirmation
  if (confirm('Are you sure?')) {
    // hide add ingredient button
    addButton.style.visibility = 'hidden';
    // hide recipe panel
    recipeInfoPanel.style.display = 'none';
    // refresh array
    load();
    // remove recipe at currentRecipe
    recipes.splice(currentRecipe, 1);
    // save array
    save();
    // set current to null
    currentRecipe = null;
    // update menu icon
    updateCurrentRecipe();
    // check if there is a search to show
    if (searchedItem) {
      // show searched item
      mainPanel.style.display = 'flex';
    }
  }
}

// hides info panel
function hideRecipe() {
  // set display to none
  recipeInfoPanel.style.display = 'none';
  // check for searched item
  if (searchedItem) {
    // if searched item display item info
    loadInfo(searchedItem);
  } else {
    // else show logo
    showLogo();
  }
}

// toggles menu overlay on/off
function toggleRecipeBook() {
  // check display value of book
  if (recipeBookPanel.style.display !== 'flex') {
    // hide logo
    hideLogo();
    // hide recipe info
    recipeInfoPanel.style.display = 'none';
    // hide food info
    mainPanel.style.display = 'none';
    // display book
    recipeBookPanel.style.display = 'flex';
    // add recipes to book
    populateRecipeBook();
  } else {
    // if book already open hide it
    recipeBookPanel.style.display = 'none';
    // check for search item
    if (searchedItem) {
      // display item if search
      mainPanel.style.display = 'flex';
    } else {
      // display logo if not
      showLogo();
    }
  }
}

// adds all saved recipes to menu
function populateRecipeBook() {
  // set innerhtml to show if nothing is saved
  recipeBookPanel.innerHTML = 'Click the "New Recipe" button to create a recipe...';
  // get current list of recipes
  load();
  // if there are saved recipes
  if (recipes.length !== 0) {
    // reset innerhtml
    recipeBookPanel.innerHTML = '';
    // sort array to alphabatize, this is causing problems...
    // recipes.sort(function (a, b) {
    // 	let first = a.name.toLowerCase();
    // 	let second = b.name.toLowerCase();
    // 	if (first < second) {
    // 		return -1;
    // 	}
    // 	if (first > second) {
    // 		return 1;
    // 	}
    // 	return 0;
    // });
    // loop through each recipe
    for (let i = 0; i < recipes.length; i++) {
      // create recipe div
      let node = document.createElement('Div');
      // add class
      node.setAttribute('class', 'recipe');
      // add event listener to check for selection
      node.addEventListener('click', loadRecipe);
      // create name text
      let textnode = document.createTextNode(recipes[i].name);
      // add name to div
      node.appendChild(textnode);
      // add div to book panel
      recipeBookPanel.appendChild(node);
      // set this div to this recipe for click listener
      recipes[i].div = node;
    }
  }
}

// get info about recipes, this should be turned into one function...
function getTotalCalories(recipe) {
  // temp variable set to 0
  let total = 0;
  // loop through each ingredient
  for (let i = 0; i < recipe.ingredients.length; i++) {
    // add nutrient info to total for each ingredient, multiplied by amount in recipe
    total += (recipe.ingredients[i].item.nf_calories * recipe.ingredients[i].amount);
  }
  // return total after each ingredient has been added
  return total;
}

function getTotalCholesterol(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_cholesterol * recipe.ingredients[i].amount);
  }
  return total;
}

function getTotalFiber(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_dietary_fiber * recipe.ingredients[i].amount);
  }
  return total;
}

function getTotalProtein(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_protein * recipe.ingredients[i].amount);
  }
  return total;
}

function getTotalSatFat(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_saturated_fat * recipe.ingredients[i].amount);
  }
  return total;
}

function getTotalTotFat(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_total_fat * recipe.ingredients[i].amount);
  }
  return total;
}

function getTotalCarbs(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_total_carbohydrate * recipe.ingredients[i].amount);
  }
  return total;
}

function getTotalSodium(recipe) {
  let total = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    total += (recipe.ingredients[i].item.nf_sodium * recipe.ingredients[i].amount);
  }
  return total;
}