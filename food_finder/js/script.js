'use strict';

// hide logo{
function hideLogo () {
	// find logo
	let logo = document.getElementsByClassName('logo')[0];
	// style logo display to none
	logo.style.display = 'none';
}

// show logo
function showLogo () {
	// find logo
	let logo = document.getElementsByClassName('logo')[0];
	// style display to flex
	logo.style.display = 'flex';
}

// begins a basic search
function initiateSearch () {
	// refresh stored items into array
	savedSearchItems = JSON.parse(window.localStorage.getItem('savedSearchItems'));
	// input from user added to query and converted to lowercase
	let searchString = searchInput.value.toLowerCase();
	// don't bother searching if blank input
	if (searchString !== '') {
		// clear text box after searching
		searchInput.value = '';
		// hide open panels
		recipeInfoPanel.style.display = 'none';
		recipeBookPanel.style.display = 'none';
		// search through saved items first to avoid duplicate api calls
		for (let i = 0; i < savedSearchItems.length; i++) {
			// compare name of searched item to saved item
			if (searchString === savedSearchItems[i].food_name) {
				// set saved item to search return if it matched
				searchedItem = savedSearchItems[i];
				// use that item to populate info panel
				loadInfo(searchedItem);
				// exit function
				return;
			}
		}
		// if not found in saved items call basic search
		basicSearch(searchString);
	} else {
		// alert if user searched for blank input
		alert('Please enter a search item...');
	}
}

// does a broad search for food to get photo and ID to search for nutrition info
function basicSearch (string) {
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
				if (tempfood === string) {
					// set match to variable
					let basicReturnedFood = basicResults.common[i];
					// get more details on match
					advancedSearch(basicReturnedFood);
					// return when found, else overlay will pop up
					return;
				}
			}
			// if no food was found then set the fail overlay to visible
			searchFail.style.visibility = 'visible';
		}
	};
	// open request with string that adds user query
	xhttp.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=' + string, true);
	// necessary headers for nutritionix
	xhttp.setRequestHeader('x-app-id', '3e59bca3');
	xhttp.setRequestHeader('x-app-key', '3599573c496f4cbcade79edde4835391');
	xhttp.setRequestHeader('x-remote-user-id', '0');
	// send that request
	xhttp.send();
};

// does a search for nutrition info using name from basic search
function advancedSearch (item) {
	// create request to query database
	let xhttp = new XMLHttpRequest();
	// create function to check for return from database
	xhttp.onreadystatechange = function () {
		// if return is good...
		if (this.readyState === 4 && this.status === 200) {
			// parse JSON results into object...
			let advancedResponse = JSON.parse(this.response);
			// take the actual item we need out of the response object
			searchedItem = advancedResponse.foods[0];
			// add item to saved items array
			savedSearchItems.push(searchedItem);
			// save array
			save();
			// call loadinfo to populate page info
			loadInfo(searchedItem);
		}
	};
	// open request to nutrient api
	xhttp.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients', true);
	// necessary headers for nutritionix
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('x-app-id', '3e59bca3');
	xhttp.setRequestHeader('x-app-key', '3599573c496f4cbcade79edde4835391');
	xhttp.setRequestHeader('x-remote-user-id', '0');
	// send request with name of item from basic search
	xhttp.send('{"query":"' + item.food_name + '"}');
};

// saves recipes when edited/created
function save () {
	// save recipes[] into local storage
	window.localStorage.setItem('savedRecipes', JSON.stringify(recipes));
	// save search items [] into local storage
	window.localStorage.setItem('savedSearchItems', JSON.stringify(savedSearchItems));
}

// reload saved recipes
function load () {
	recipes = JSON.parse(window.localStorage.getItem('savedRecipes'));
}

// function to delete all recipes and items
function deleteStorage () {
	// remove saved recipes[] from local storage
	window.localStorage.removeItem('savedRecipes');
	// window.localStorage.setItem('savedRecipes', JSON.stringify(''));
	// remove saved items[] from local storage
	window.localStorage.removeItem('savedSearchItems');
	// window.localStorage.setItem('savedSearchItems', JSON.stringify(''));
}

// will turn off search failed overlay when clicked on
function toggleOverlay () {
	// if overlay is visible
	if (searchFail.style.visibility === 'visible') {
		// turn it off
		searchFail.style.visibility = 'hidden';
	}
}

// turns off save overlay
function toggleSaveOverlay () {
	// hide overlay
	saveOverlay.style.visibility = 'hidden';
}
