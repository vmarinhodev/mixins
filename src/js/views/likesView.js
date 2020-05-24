import { elements } from "./base";
import { limitDrinkTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
  const button = document.querySelector(".icon__favourite");
  if (isLiked) {
    button.classList.remove('heart-outline', 'heart');
    button.classList.add('heart')
  } else if (!isLiked) {
    button.classList.remove('heart-outline', 'heart');
    button.classList.add('heart-outline')
  }
};

export const renderLikes = like => {
  if (like) {
    const markup = `
      <div class="liked__item__panel liked__item__favourite" data-id="${like.id}">
          <div class="liked__item__panel__div">
              <img
                src="${like.thumb}"
                alt="${like.title}"
                class="liked__item__panel__img"/>
              <h2 class="liked__item__panel__title">${limitDrinkTitle(like.title)}</h2>
          </div>
      </div>
    `;
    elements.likesList.insertAdjacentHTML("afterbegin", markup);
  }
};

export const deleteLike = id => {
  if (id) {
    const like = document.querySelector(`.liked__item__favourite[data-id="${id}"]`);
    if (like) {
      like.parentElement.removeChild(like)
    }
  }
};

export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
  elements.likesMenu.style.opacity = numLikes > 0 ? '1' : '0';
};