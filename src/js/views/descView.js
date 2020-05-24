import { elements } from "./base";
import { Fraction } from "fractional";


const formatCount = count => {
  if (count) {
      // count = 2.5 --> 5/2 --> 2 1/2
      // count = 0.5 --> 1/2
      const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10));

      if (!dec) return count;

      if (int === 0) {
          const fr = new Fraction(count);
          return `${fr.numerator}/${fr.denominator}`;
          
      } else {
          const fr = new Fraction(count - int);
          return `${int} ${fr.numerator}/${fr.denominator}`
      }
  }
  alert('Error processing formatCount function.');
  return '?';
  
};

const createIngredients = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient} 
        </div>
    </li>
`;


//Render single tail function
export const renderRecipe = (recipe, isLiked, fromMenu) => {
  console.log(recipe)
  if (recipe) {
    let markup;
    if (recipe.thumb === "N/A") {
      markup = `
        <div class="container__single">
          <div class="container__single__details animated fadeIn faster container__single__noimg">
            <h1 class="container__single__details-name">${recipe.title}</h1>
            <div class="container__single__details-details">
              <div class="details-time" title="Prep time">
                <i class="icon ion-ios-time"></i>${
                  recipe.time === "N/A" || !recipe.time
                    ? "Unavailable"
                    : recipe.time
                }
              </div>
              <div class="details-servings" title="Servings">
                <i class="icon ion-ios-person"></i>${
                  recipe.servings === "N/A" || !recipe.servings
                    ? "Unavailable"
                    : recipe.servings
                }
                <div class="recipe__info-buttons">
                  <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                  </button>
                  <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="container__single__details-directions">
              <h2 class="heading-2">How to mix it</h2>${
              recipe.instructions === 'N/A' || !recipe.instructions
                ? 'Unavailable'
                : recipe.instructions
            }</div>
            <div class="container__single__buttons">
              <a href="https://www.thecocktaildb.com/drink/${
                  recipe.drinkid
                }" target="_blank" title="${
                  recipe.alcoholic === 'N/A' || !recipe.alcoholic
                  ? recipe.title
                  : `${recipe.alcoholic}`
                }"
                class="button details__alcohol">
                  ALCOHOL ${
                    recipe.alcoholic === 'N/A' || !recipe.alcoholic
                    ? ''
                    : `<span class='alcohol__score'>${recipe.alcoholic}</span>`
                  }
              </a>
              <button class="button details__actions-likes">
                  <i class="icon icon__likes ${
                    isLiked ? 'ion-ios-heart' : 'ion-ios-heart-empty'
                  }"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      markup = `
        <div class="container__single">
          <div class="container__single__img animated fadeIn faster">
            <img
              src="${recipe.thumb}"
              alt="${recipe.title}"
            />
          </div>
          <div class="container__single__details animated fadeIn faster">
            <h1 class="container__single__details-name">${recipe.title}</h1>
              <div class="container__single__details-details">
                <div class="details-time" title="Prep time">
                  <ion-icon name="alarm-outline" class="icon"></ion-icon> ${
                    recipe.time === "N/A" || !recipe.time
                      ? "Unavailable"
                      : `${recipe.time} Seconds`
                  }
                </div>
                <div class="details-servings" title="Servings">
                  <ion-icon name="man-outline" class="icon"></ion-icon>
                  <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                  <span class="recipe__info-text">  servings </span>
                </div>
              </div>
            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredientAmounts
                      .map(el => createIngredients(el))
                      .join("")}
                </ul>
            </div>
            <div class="container__single__details-directions">
              <h1>How to prepare</h1>
                ${ recipe.instructions === 'N/A' || !recipe.instructions ? 'Unavailable' : recipe.instructions}
            </div>
            
            <div class="container__single__buttons">
              <span  title="${recipe.glass === 'N/A' || !recipe.glass? recipe.title: `${recipe.glass}`}"
                class="button details__alcohol">${recipe.glass === 'N/A' || !recipe.glass ? '' : `<span class='alcohol__score'>${recipe.glass}</span>`}
              </span>
              <button class="button details__actions-favourite">
                <ion-icon class="icon icon__favourite" name="${isLiked ? "heart" : "heart-outline"}"></ion-icon>
              </button>
            </div>
            ${
              fromMenu === true
                ? ""
                : `<button class="button details__go-back">
                <ion-icon class="icon" name="arrow-back-circle-outline"></ion-icon> BACK
                  </button>`
            }
          </div>
          
        </div>
      `;
    }
    elements.mainContainer.classList.remove('to-top');
    elements.mainContainer.insertAdjacentHTML('afterbegin', markup);
  }
};
export const updateServingsIngredients = recipe => {
  // Update servings
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings
  // Update ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el, i) => {
      el.textContent = formatCount(recipe.ingredientAmounts[i].count);
  });
};