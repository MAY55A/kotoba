import {fetchRandomKanji, searchKanji} from "../api/kanjiApi.js";
import {loadNavBar} from "../ui/navbar.js";
import {fetchUserData} from "../api/userApi.js";

export async function search() {
    const word = document.getElementById("search-input").value.trim();
    if (!word) return;

    let searchOutput = document.querySelector(".search-output");
    if (!searchOutput) {
        const searchBar = document.getElementById("search-bar");
        searchOutput = document.createElement("div");
        searchOutput.classList.add("search-output", "word");
        searchBar.insertAdjacentElement('afterend', searchOutput);
    }

    searchOutput.innerText = "Searching...";
    let result = await searchKanji(word)
    searchOutput.innerText = result
        ? result.kanji.character
        : "No result found";
}

export async function getRandom() {
    const word = document.getElementById("random-word");
    const meaning = document.getElementById("word-meaning");
    const pronunciation = document.getElementById("word-pronunciation");

    let result = await fetchRandomKanji();
    if(result) {
        word.innerHTML = result.word;
        meaning.innerText = result.meaning;
        pronunciation.innerHTML = `${result.furigana}<br>${result.romaji}`;
    }
}

fetchUserData().then((user) => {
    loadNavBar(user).then(()=> getRandom());
});
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search-btn").addEventListener("click", search);
});