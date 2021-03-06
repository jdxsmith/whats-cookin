window.addEventListener('load', loadPage);

let user;
let pantry;
let potentialRecipes = [];
let allRecipes = document.querySelector('.all-recipes');
let searchBar = document.querySelector('.search-bar');
let recipeCardPage = document.querySelector('.recipe-card-page');
let dailyRecipe = document.querySelector('.daily-recipe');
let pantryStock = document.querySelector('.pantry');
let pantryButton = document.querySelector('.pantry-button');
let homeButton = document.querySelector('.home-button')
let favoritesButton = document.querySelector('.favorites-button');
let recipesToCookButton = document.querySelector('.recipes-to-cook-button');
let usersButton = document.querySelector('.users-button');
let searchButton = document.querySelector('.search-button');

allRecipes.addEventListener('click', toggleFavoriteIcon);
allRecipes.addEventListener('click', toggleToCookIcon);
allRecipes.addEventListener('click', displayRecipeCard);
allRecipes.addEventListener('click', removeRecipe);
allRecipes.addEventListener('click', resetSearch);
recipeCardPage.addEventListener('click', checkPantryStock);
homeButton.addEventListener('click', displayHomePage);
favoritesButton.addEventListener('click', displayFavorites);
recipesToCookButton.addEventListener('click', displayRecipesToCook);
pantryButton.addEventListener('click', displayUserPantry);
usersButton.addEventListener('click', loadUser);
searchButton.addEventListener('click', getFormValue);

function loadPage() {
  loadUser();
  loadRecipes();
  loadRecipeOfTheDay();
}

function loadUser() {
  let header = document.querySelector('h1');
  let randomIndex = Math.floor(Math.random() * 49);
  user = new User(usersData[randomIndex].name, usersData[randomIndex].id, usersData[randomIndex].pantry);
  header.innerText = `What's Cookin', ${user.name}`;
}

function loadRecipes() {
  recipeData.map(recipe => {
    let eachRecipe = new Recipe(recipe.id, recipe.image, recipe.ingredients, recipe.instructions, recipe.name, recipe.tags);
    potentialRecipes.push(eachRecipe);
  })
  displayAllRecipes();
}

function loadRecipeOfTheDay() {
  let randomIndex = Math.floor(Math.random() * 50);
  let randomRecipe = `<img src="${potentialRecipes[randomIndex].image}" class="daily-recipe-image">
  <p class="recipe-of-day"><span class="recipe-title">Recipe of the Day | </span> ${potentialRecipes[randomIndex].name}</p>`
  dailyRecipe.insertAdjacentHTML('afterbegin', randomRecipe);
}

function displayAllRecipes() {
  allRecipes.innerHTML = `<h3 class="title">All Recipes</h3>`;
  potentialRecipes.forEach(recipe => {
    if (user.favoriteRecipes.includes(recipe)) {
      let recipeCard = `
        <article class="recipe-card">
          <div class="view-recipe">
            <img src=${recipe.image} class="recipe-image ${recipe.id}">
          </div>
          <h4 class="recipe-name">${recipe.name}</h4>
          <div class="recipe-card-buttons">
            <img src="./assets/red-heart-icon.jpg" class="red-heart-button ${recipe.id}">
            <img src="./assets/unselected-chef-hat.svg" class="to-cook-button ${recipe.id}"><br>
          </div>
        </article>`
    allRecipes.insertAdjacentHTML('beforeend', recipeCard);
    } else if (user.recipesToCook.includes(recipe)) {
      let recipeCard = `
        <article class="recipe-card">
          <div class="view-recipe">
            <img src=${recipe.image} class="recipe-image ${recipe.id}">
          </div>
          <h4 class="recipe-name">${recipe.name}</h4>
          <div class="recipe-card-buttons">
            <img src="./assets/heart-regular.svg" class="heart-button ${recipe.id}">
            <img src="./assets/selected-chef-hat.svg" class="to-cook-button ${recipe.id}"><br>
          </div>
        </article>`
      allRecipes.insertAdjacentHTML('beforeend', recipeCard);
    } else {
      let recipeCard = `
        <article class="recipe-card">
          <div class="view-recipe">
            <img src=${recipe.image} class="recipe-image ${recipe.id}">
            </div>
            <h4 class="recipe-name">${recipe.name}</h4>
            <div class="recipe-card-buttons">
            <img src="./assets/heart-regular.svg" class="heart-button ${recipe.id}">
            <img src="./assets/unselected-chef-hat.svg" class="to-cook-button ${recipe.id}"><br>
          </div>
        </article>`
      allRecipes.insertAdjacentHTML('beforeend', recipeCard);
    }
  })
}

function displayRecipeCard(event) {
  if (event.target.classList.contains('recipe-image')) {
    dailyRecipe.classList.add('hidden');
    potentialRecipes.forEach(recipe => {
    let id = recipe.id;
    recipe.getIngredients(recipe);
      if(event.target.classList.contains(id)) {
        searchBar.classList.add('hidden');
        allRecipes.classList.add('hidden');
        let recipeInfo = `
          <div class="recipe-card-page">
            <img src='${recipe.image}' class="recipe-info-image">
          <div class="recipe-card-name">${recipe.name}</div>
          <div class="recipe-information">
          <div class="recipe-ingredients"><b>Ingredients:</b> <ul>
            ${recipe.ingredients.map(ingredient => {return ` ${ingredient.quantity.amount} ${ingredient.quantity.unit} ${ingredient.name}`+ "<br />"}).join('')}</ul>
          <div class="recipe-cost"><b>Cost:</b> $${recipe.ingredients.reduce((totalCost, currentIngredient) => {return totalCost += currentIngredient.cost}, 0).toFixed(2)}</div>
          </div>
          <div class="recipe-instructions"><b>Instructions:</b> <ul> ${recipe.instructions.map(instruction => {return `${instruction.number}: ${instruction.instruction}`+ "<br />"+ "<br />"}).join('')}</ul></div>
          </div>
          <button class="check-stock-button pink-button not-clicked ${recipe.id}">Check Pantry Stock</button>
          <section class="missing-ingredients"></section>
          </div>`
          recipeCardPage.insertAdjacentHTML('afterbegin', recipeInfo);
      }
    })
  }
}

function displayFavorites() {
  pantryStock.innerHTML = '';
  recipeCardPage.innerHTML = '';
  allRecipes.classList.remove('hidden');
  searchBar.classList.remove('hidden');
  dailyRecipe.classList.add('hidden');
  favoritesButton.classList.add('inactive');
  pantryButton.classList.remove('inactive');
  recipesToCookButton.classList.remove('inactive');
  allRecipes.innerHTML = `<h3 class="title">Favorite Recipes</h3>`;
  if (user.favoriteRecipes.length > 0) {
    user.favoriteRecipes.forEach(recipe => {
    let recipeCard = `
      <article class="recipe-card">
        <div class="view-recipe">
          <img src=${recipe.image} class="recipe-image ${recipe.id}">
        </div>
        <h4 class="recipe-name">${recipe.name}</h4>
        <button class="remove-favorite pink-button" id="${recipe.id}">REMOVE</button>
      </article>`
  allRecipes.insertAdjacentHTML('beforeend', recipeCard);
})
  } else {
    allRecipes.insertAdjacentHTML('beforeend', `<p class="no-recipe-message">No favorite recipes to display at this time! Click on the  <img src="./assets/heart-regular.svg" class="to-cook-button2">  icon to add a recipe!</p>`);
  }
}

function displayRecipesToCook() {
  pantryStock.innerHTML = '';
  recipeCardPage.innerHTML = '';
  searchBar.classList.remove('hidden');
  allRecipes.classList.remove('hidden');
  dailyRecipe.classList.add('hidden');
  recipesToCookButton.classList.add('inactive');
  favoritesButton.classList.remove('inactive');
  pantryButton.classList.remove('inactive');
  allRecipes.innerHTML = `<h3 class="title">Recipes To Cook</h3>`;
  if (user.recipesToCook.length > 0) {
    user.recipesToCook.forEach(recipe => {
      let recipeCard = `
        <article class="recipe-card">
          <div class="view-recipe">
            <img src=${recipe.image} class="recipe-image ${recipe.id}">
          </div>
          <h4 class="recipe-name">${recipe.name}</h4>
          <button class="remove-to-cook pink-button" id="${recipe.id}">REMOVE</button>
        </article>`
    allRecipes.insertAdjacentHTML('beforeend', recipeCard);
    })
  } else {
      allRecipes.insertAdjacentHTML('beforeend', `<p class="no-recipe-message">No recipes selected to cook at this time! Click on the  <img src="./assets/unselected-chef-hat.svg" class="to-cook-button2">  icon to add a recipe!</p>`);
    }
}

function displayUserPantry() {
  pantry = new Pantry(user.pantry);
  pantry.getPantryItems();
  searchBar.classList.add('hidden');
  allRecipes.classList.add('hidden');
  dailyRecipe.classList.add('hidden');
  recipeCardPage.innerHTML = '';
  recipesToCookButton.classList.remove('inactive');
  favoritesButton.classList.remove('inactive');
  if(!pantryButton.classList.contains('inactive')){
    pantryButton.classList.add('inactive');
    pantryStock.insertAdjacentHTML('afterbegin', `<img src="https://cdn.apartmenttherapy.info/image/upload/v1558687631/k/archive/8d007e7c8e504d69322e3f845fc1ed813f8305ec.png" class="pantry-image"><p class="pantry-stock">Current Pantry Stock</p>`)
    pantry.userPantry.forEach(ingredient => {
      var randomColor = Math.floor(Math.random()*16777215).toString(16);
      let pantryInfo = `<article class="pantry-card">
          <div class="pantry-box" style="background-color:#${randomColor};"></div>
          <div class="pantry-info">
            <div>Ingredient: ${ingredient.name}</div>
            <div>Amount: ${ingredient.amount}</div>
          </div>
        </article>`
      pantryStock.insertAdjacentHTML('beforeend', pantryInfo);
    })
  }
}

function displayHomePage() {
  searchBar.classList.remove('hidden');
  allRecipes.classList.remove('hidden');
  dailyRecipe.classList.remove('hidden');
  pantryButton.classList.remove('inactive');
  recipesToCookButton.classList.remove('hidden');
  favoritesButton.classList.remove('inactive');
  recipesToCookButton.classList.remove('inactive');
  recipeCardPage.innerHTML = '';
  pantryStock.innerHTML = '';
  displayAllRecipes();
}

function toggleFavoriteIcon(event) {
  if (event.target.classList.contains('heart-button')) {
    event.target.src = "./assets/red-heart-icon.jpg";
    event.target.classList.add('red-heart-button');
    event.target.classList.remove('heart-button');
    potentialRecipes.forEach(recipe => {
      let id = recipe.id;
      if(event.target.classList.contains(id)) {
        user.addToFavorites(recipe);
        }
    })
  } else if (event.target.classList.contains('red-heart-button')) {
    event.target.src = "./assets/heart-regular.svg";
    event.target.classList.add('heart-button');
    event.target.classList.remove('red-heart-button');
    potentialRecipes.forEach(recipe => {
      let id = recipe.id;
        if(event.target.classList.contains(id)) {
          user.removeFromFavorites(recipe);
        }
    })
  }
}

function toggleToCookIcon(event) {
  if (event.target.classList.contains('to-cook-button')) {
    event.target.src = "./assets/selected-chef-hat.svg";
    event.target.classList.add('gray-cook-button');
    event.target.classList.remove('to-cook-button');
    potentialRecipes.forEach(recipe => {
      let id = recipe.id;
      if(event.target.classList.contains(id)) {
          user.addToRecipesToCook(recipe);
      }
    })
  } else if (event.target.classList.contains('gray-cook-button')) {
    event.target.src = "./assets/unselected-chef-hat.svg";
    event.target.classList.add('to-cook-button');
    event.target.classList.remove('gray-cook-button');
    potentialRecipes.forEach(recipe => {
      let id = recipe.id;
      if(event.target.classList.contains(id)) {
        user.removeFromRecipesToCook(recipe);
      }
    })
  }
}

function checkPantryStock(event) {
  pantry = new Pantry(user.pantry);
    if (event.target.classList.contains('check-stock-button') && event.target.classList.contains('not-clicked')) {
      event.target.classList.remove('not-clicked');
      event.target.classList.add('inactive');
      potentialRecipes.forEach(recipe => {
        let id = recipe.id;
        let missingIngredients = document.querySelector('.missing-ingredients');
        if(event.target.classList.contains(id)) {
          pantry.checkStock(recipe);
          let missingIngredientsList = `
            <div><b>Missing Ingredients:<b><br> <ul> ${pantry.missingIngredients.map(ingredient => {return ` ${ingredient.quantity.amount} ${ingredient.quantity.unit} ${ingredient.name} ($${ingredient.cost})`})}</ul></div>`
          missingIngredients.insertAdjacentHTML('beforeend', missingIngredientsList);
        }
    })
  }
}

function getFormValue() {
  if (document.getElementById('search-recipes').elements['tag-button'].value && favoritesButton.classList.contains('inactive')) {
    let value = document.getElementById('search-recipes').elements['tag-button'].value;
    displaySearchResults(user.filterRecipeByTag, value, user.favoriteRecipes);
  } else if (document.getElementById('search-recipes').elements['form-search'].value && favoritesButton.classList.contains('inactive')) {
    let value = document.getElementById('search-recipes').elements['form-search'].value;
    displaySearchResults(user.searchRecipeByIngredient, value, user.favoriteRecipes);
  } else if (document.getElementById('search-recipes').elements['tag-button'].value && recipesToCookButton.classList.contains('inactive')) {
    let value = document.getElementById('search-recipes').elements['tag-button'].value;
    displaySearchResults(user.filterRecipeByTag, value, user.recipesToCook);
  } else if (document.getElementById('search-recipes').elements['form-search'].value && recipesToCookButton.classList.contains('inactive')) {
    let value = document.getElementById('search-recipes').elements['form-search'].value;
    displaySearchResults(user.searchRecipeByIngredient, value, user.recipesToCook);
  } else if (document.getElementById('search-recipes').elements['tag-button'].value) {
    let value = document.getElementById('search-recipes').elements['tag-button'].value;
    displaySearchResults(user.filterRecipeByTag, value, potentialRecipes);
  } else if (document.getElementById('search-recipes').elements['form-search'].value) {
    let value = document.getElementById('search-recipes').elements['form-search'].value;
    displaySearchResults(user.searchRecipeByIngredient, value, potentialRecipes);
  } else {
    alert('Make a selection or type an ingredient to search!');
  }
  clearFormValues();
}

function displaySearchResults(searchMethod, formValue, recipesArray) {
  event.preventDefault();
  allRecipes.innerHTML = '';
  allRecipes.innerHTML = `<h3 class="title">\'${formValue}\' Recipes<button class="reset-button pink-button">Reset Search</button></h3>`;
  let filteredRecipes = searchMethod(recipesArray, formValue);
    filteredRecipes.forEach(recipe => {
      let recipeCard = `
      <article class="recipe-card">
        <div class="view-recipe">
          <img src=${recipe.image} class="recipe-image ${recipe.id}">
        </div>
        <h4 class="recipe-name">${recipe.name}</h4>
        <div class="recipe-card-buttons">
          <img src="./assets/heart-regular.svg" class="heart-button ${recipe.id}">
          <img src="./assets/unselected-chef-hat.svg" class="to-cook-button ${recipe.id}">
          <br>
        </div>
      </article>`
      allRecipes.insertAdjacentHTML('beforeend', recipeCard);
    })
}

function clearFormValues() {
  let tagButtons = document.querySelectorAll('.tag-button');
  let searchInput = document.querySelector('.search-ingredient');
  tagButtons.forEach(button => {
    button.checked = false;
  })
  searchInput.value = '';
}

function removeRecipe(event) {
  if (event.target.classList.contains('remove-favorite')) {
    user.favoriteRecipes.forEach(recipe => {
      if (recipe.id == event.target.id) {
        let favoriteIndex = user.favoriteRecipes.indexOf(recipe);
        user.favoriteRecipes.splice(favoriteIndex, 1)
      }
    })
    displayFavorites();
  } else if (event.target.classList.contains('remove-to-cook')) {
    user.recipesToCook.forEach(recipe => {
      if (recipe.id == event.target.id) {
        let toCookIndex = user.recipesToCook.indexOf(recipe);
        user.recipesToCook.splice(toCookIndex, 1)
      }
    })
    displayRecipesToCook();
  }
}

function resetSearch() {
  if (event.target.classList.contains('reset-button') && favoritesButton.classList.contains('inactive')) {
    allRecipes.innerHTML = '';
    displayFavorites();
  } else if (event.target.classList.contains('reset-button') && recipesToCookButton.classList.contains('inactive')) {
    allRecipes.innerHTML = '';
    displayRecipesToCook();
  } else if (event.target.classList.contains('reset-button')) {
    allRecipes.innerHTML = '';
    displayAllRecipes();
  }
}
