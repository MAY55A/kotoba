import {fetchFavourites} from "../api/userApi.js";
import {loadAuthNav} from "../ui/authNav.js";

const container = document.getElementById("kanji-container");
const list = document.getElementById("kanji-list");
const empty = document.getElementById("empty-state");
const loading = document.getElementById("loading");

function displayFavourites(kanjiList) {
    loading.classList.add("hidden");

    if (kanjiList.length > 0) {
        for (let kanji of kanjiList) {
            list.insertAdjacentHTML('beforeend',
                `<span class="kanji" title="${kanji}">
                    <a href="/favourites/${kanji}">${kanji}</a>
                  </span>`);
        }
        container.classList.remove("hidden");
    } else {
        empty.classList.remove("hidden");
    }
}


fetchFavourites().then((list) =>
    displayFavourites(list));
loadAuthNav();
