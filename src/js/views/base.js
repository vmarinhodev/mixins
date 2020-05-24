export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__input'),
    mainContainer: document.querySelector('.container'),
    logo: document.querySelector('.logo'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.menu__favourite'),
    likesList: document.querySelector('.menu__favourite__panel')
};

export const elementStrings = {
    loader: 'loader'
};

// SPINNER
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    elements.mainContainer.insertAdjacentHTML('afterbegin', loader);
    //console.log(`- base.js - renderLoader -`)
};

export const clearLoader = () => {
    elements.mainContainer.innerHTML = '';
};

// Clear UI
export const clearUI = () => {
    elements.mainContainer.innerHTML = '';
  };

export const renderHome = () => {
    const markup = `
        <div class="container__home">
            <div class="container__home-left animated fadeInLeft">
                <img src="img/drinksdisplay.jpg" alt="Mixins" />
            </div>
            <div class="container__home-right animated fadeInRight">
                <h1 class="container__home-title">Cocktail Recipes</h1>
                <p class="container__home-text animated fadeInUp delay-1s">
                    Type a letter on the search bar
                </p>
                <p class="container__home-text animated fadeInUp delay-1s">
                    Press enter or the search icon
                </p>
                <p class="container__home-text animated fadeInUp delay-1s">
                    Enjoy!
                </p>
            </div>
        </div>
    `;
    elements.mainContainer.classList.remove('to-top');
    elements.mainContainer.insertAdjacentHTML('afterbegin', markup);
};