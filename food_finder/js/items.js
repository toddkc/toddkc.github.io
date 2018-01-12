'use strict';

// this script holds all search item related code

// setup info pane for food item, arg is object from advanced search
function loadInfo(item) {
  // hide logo to show returned food item
  hideLogo();
  // hide recipe panel
  recipeInfoPanel.style.display = 'none';
  // show display
  mainPanel.style.display = 'flex';
  // pull image url and send to function
  loadFoodImage(item.photo.thumb);
  // update all html items to show proper nutrition info
  foodTitle.innerHTML = item.food_name;
  serving.innerHTML = 'Serving Size: ';
  amount.innerHTML = item.serving_qty + ' ' + item.serving_unit;
  calories.innerHTML = 'Calories: ' + item.nf_calories;
  cholesterol.innerHTML = 'Cholesterol(mg): ' + item.nf_cholesterol;
  fiber.innerHTML = 'Fiber(g): ' + item.nf_dietary_fiber;
  protein.innerHTML = 'Protein(g): ' + item.nf_protein;
  satFat.innerHTML = 'Saturated Fat(g): ' + item.nf_saturated_fat;
  totFat.innerHTML = 'Total Fat(g): ' + item.nf_total_fat;
  carbs.innerHTML = 'Carbs(g): ' + item.nf_total_carbohydrate;
  sodium.innerHTML = 'Sodium(mg): ' + item.nf_sodium;
  // show panels
  detailsPanelL.style.display = 'flex';
  detailsPanelR.style.display = 'flex';
  // check for current recipe
  if (currentRecipe !== null && currentRecipe !== undefined) {
    // bool to decide to show add button, default to true/yes
    let show = true;
    // loop through each ingredient
    for (let i = 0; i < recipes[currentRecipe].ingredients.length; i++) {
      // if ingredient is same as item
      if (item.food_name === recipes[currentRecipe].ingredients[i].item.food_name) {
        // set show to false
        show = false;
      }
    }
    // set add button visibility based on show value
    if (show) {
      addButton.style.visibility = 'visible';
    } else {
      addButton.style.visibility = 'hidden';
    }
  }
}

// loads image from returned search object
function loadFoodImage(url) {
  // set background image url to url from search item
  foodImageDiv.style.backgroundImage = 'url(' + url + ')';
}

// adds current food item to recipe
function addToIngredients() {
  // check that there is a recipe selected
  if (currentRecipe !== null) {
    // loop through each ingredient in current recipe to check for duplicates
    for (let i = 0; i < recipes[currentRecipe].ingredients.length; i++) {
      // if duplicate found...
      if (searchedItem.food_name === recipes[currentRecipe].ingredients[i].item.food_name) {
        // alert user
        alert('Already in recipe');
        // and exit function
        return;
      }
    }
    // if not a duplicate the add item to recipe in saved recipes[] as new ingredient object
    recipes[currentRecipe].ingredients.push(new Ingredient(searchedItem, '1.00'));
    // show overlay for user feedback
    saveOverlay.style.visibility = 'visible';
    // set timer to disable overlay
    setTimeout(toggleSaveOverlay, 500);
    // save recipes to update with new ingredient
    save();
  } else {
    // alert user if no recipe is selected to add to
    alert('No recipe selected...');
  }
}

// loads ingredient info
function loadIngredient() {
  // hide recipe panel
  recipeInfoPanel.style.display = 'none';
  // loop through saved ingredients
  for (let i = 0; i < recipes[currentRecipe].ingredients.length; i++) {
    // check if clicked div matches ingredients event listener div
    if (recipes[currentRecipe].ingredients[i].div === this) {
      // if so load info of item
      loadInfo(recipes[currentRecipe].ingredients[i].item);
    }
  }
}