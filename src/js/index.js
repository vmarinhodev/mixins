import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import * as descView from "./views/descView";
import {
  elements,
  renderLoader,
  clearLoader,
  renderHome,
  clearUI,
} from "./views/base";

require("../css/main.scss");
require("typeface-muli");
require("typeface-playfair-display");

/** Global state of the app
 * - Search Object
 * - current cocktail object
 * - Shopping List Object
 * - Liked cocktails
 * - Git user Updated
 */
const state = {};

// SEARCH CONTROLLER
const controlSearch = async (type, page) => {
  if (type === 'new') {
    // 1- get query from view
    const query = searchView.getInput();
    if (query) {
      // 2. New search object and add to state
      state.search = new Search(query);
      // 3. Prepare UI for results
      searchView.clearInput();
      clearUI();
      renderLoader();

      try {
        // 4. Search for cocktails
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        //console.log(`- index.js - clearLoader -`)
        searchView.renderResults(state.search);
        //console.log('- index.js - renderResults -');
      } catch (error) {
        clearLoader();
        console.log(error);
      }
    }
  } else if (type === 'used') {
    //Prepare UI for results
    searchView.clearInput();
    clearUI();
    renderLoader();

    try {
      //Search for recipes of specific page from previous query
      await state.search.getResults(page);
      //Render recipes to page
      clearLoader();
      searchView.renderResults(state.search);
    } catch (error) {
      clearLoader();
      console.log(error);
    }
  }
};

// RECIPE CONTROLLER

const controlRecipe = async (id, fromMenu = false) => {
  if (id) {
    // Create new recipe object
    state.recipe = new Recipe(id);
    // Prepare UI for changes
    clearUI();
    renderLoader();
    try {
      // Get recipe data
      await state.recipe.getRecipe();
      await state.recipe.parseIngredientAmounts();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      descView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id),
        fromMenu
      );
    } catch (err) {
      console.log(err);
      alert("Error processing recipe. ooops");
    }
  }
};

// LIST CONTROLLER
const controlList = () => {
  //Create New List if not existent yet
  if (!state.list) state.list = new List();

  //Add each ingredient to the List and UI
  state.recipe.ingredientAmounts.forEach((el) => {
    const item = state.list.additem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// LIKES CONTROLLER
state.likes = new Likes();

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // User has NOT liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.alcoholic,
      state.recipe.thumb
    );
    // Toggle the likes button
    likesView.toggleLikeBtn(true);
    // Add like to UI list
    likesView.renderLikes(newLike);
  } else {
    //User HAS liked current recipe
    // Remove like form state
    state.likes.deleteLike(currentID);
    // Toggle the likes button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumbLikes());
};

// ------ EVENT LISTENERS ------

// On page load

window.addEventListener("load", () => {
  renderHome();

  // Create likes objects on page load
  state.likes = new Likes();
  // Restore likes
  state.likes.readStorage();
  // Toggle like button
  likesView.toggleLikeMenu(state.likes.getNumbLikes());
  // Render exhisting Likes
  state.likes.likes.forEach((like) => likesView.renderLikes(like));
});

// Event listener for logo
elements.logo.addEventListener("click", (e) => {
  if (e.target.matches(".logo, .logo *")) {
    searchView.clearInput();
    clearUI();
    renderHome();
  }
});

// Event listener for form submited for search
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch("new");
});

// Event listeners on the container that are placed by js

// Event listener on the likes menu
elements.likesMenu.addEventListener("click", (e) => {
  const panel = e.target.closest(".liked__item__panel");
  if (panel) {
    const recipeID = panel.dataset.id;
    // Call recipe control
    controlRecipe(recipeID, true);
  }
});

//Handling recipe button clicks
elements.mainContainer.addEventListener("click", e => {
  const button = e.target.closest(".button__pagination");
  const result = e.target.closest(".result");
  const back = e.target.matches(".details__go-back");
  const like = e.target.matches(
    ".details__actions-favourite, .details__actions-favourite *"
  );

  if (button) {
    const page = parseInt(button.dataset.page, 9);
    controlSearch("used", page);
  }

  if (back) {
    controlSearch("used", state.search.page);
  }

  if (result) {
    const resultID = result.dataset.id;
    controlRecipe(resultID);
  }

  if (like) {
    controlLike();
  }

  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      descView.updateServingsIngredients(state.recipe);
    }
  }

  if (e.target.matches(".btn-increase, .btn-increase *")) {
    //Increase button is clicked
    state.recipe.updateServings("inc");
    descView.updateServingsIngredients(state.recipe);
  }

  if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping List
    controlList();
  }
});
