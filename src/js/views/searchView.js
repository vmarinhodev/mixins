import { elements } from './base';
// Internal Functions for the Search View

export const getInput = () => elements.searchInput.value;


export const clearInput = () => {
    elements.searchInput.value = "";
}

export const limitDrinkTitle = (strDrink, limit = 17) => {
    const newTitle = [];
    if (strDrink.length > limit) {
        strDrink.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return strDrink;
};

const createButton = (page, type) => `
  <button class="button button__pagination details__go-${type} animated fadeIn" data-page=${type === "next" ? page + 1 : page - 1 }>
    <ion-icon class="icon" name="arrow-${type === "next" ? "forward" : "back"}-circle-outline"></ion-icon>Page ${type === "next" ? page + 1 : page - 1}
  </button>
`;


//Function to render buttons to the page
const renderPagination = (page, numResults, resPerPage) => {
    
    
    // Determine how many pages the results need
    const pages = Math.ceil(numResults / resPerPage);
    
    
    let button;
     if (page === 1 && pages > 1) {
         button = createButton(page, "next");
     } else if (page < pages) {
         button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
         `;
     } else if (page === pages && pages > 1) {
         button = createButton(page, "prev");
     }
     if (button) {
         document
            .querySelector(".results__pagination")
            .insertAdjacentHTML("afterbegin", button);
     }
};

// Render single recipe element
const renderRecipe = (drink) => {
    const resultsContainer = document.querySelector(".container__results");
    const img =
        drink.strDrinkThumb === "N/A"
        ? `<div class="result__img">
                <h1 class="result__name__noimg">${drink.strDrink}</h1>
                <div class="emoji">No Image<span>💩</span></div>
            </div>`
        : `<img class="result__img" src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>`;
    const markup = `

        <div class="result animated fadeIn" data-id="${drink.idDrink}">
            <img class="result__img" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <div class="result__details">
                <h2 class="result__name">${drink.strDrink}</h2>
            </div>
        </div>
    `;
    resultsContainer.insertAdjacentHTML("beforeend", markup);
    
};



//Render recipes search results onpage from array
//Call the renderRecipe for each element on array

export const renderResults = (search, resPerPage = 9) => {
    const start = (search.page - 1) * resPerPage;
    const end = search.page * resPerPage;
    // Render results of current page
    if (search.result === "False") {
        console.log("false")
    } else {
    const markup = `
    <div class="container__search">
    <h1 class="results animated fadeIn faster"> Search results for "${search.query}" </h1>
        <div class="container__results"></div>
        <div class="results__pagination"></div>
    </div>
    `;
    elements.mainContainer.insertAdjacentHTML('afterbegin', markup);
    elements.mainContainer.classList.add('to-top');
    search.result.slice(start, end).forEach(renderRecipe);
    renderPagination(search.page, search.result.length, resPerPage);
    }

    
};