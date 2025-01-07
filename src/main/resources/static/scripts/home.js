async function search() {
    const searchOutput = document.createElement("div");
    searchOutput.classList.add("search-output", "word");
    const searchBar = document.getElementById("search-bar");
    const word = document.getElementById("search-input").value.trim();
    if (!word) {
        return;
    }
    try {
       const response = await fetch(`/api/kanji/search?query=${word}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json();

        searchOutput.innerText = result[0].kanji.character;
    } catch (error) {
        searchOutput.innerText = "No result found";
    } finally {
        const existingOutput = document.querySelector(".search-output");
        if (existingOutput) existingOutput.remove();
        searchBar.insertAdjacentElement('afterend', searchOutput);
    }
}

async function getRandom() {
    const word = document.getElementById("random-word");
    const meaning = document.getElementById("word-meaning");
    const pronunciation = document.getElementById("word-pronunciation");
    try {
        const response = await fetch(`/api/kanji/random`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json();
        word.innerHTML = result.word;
        meaning.innerText = result.meaning;
        pronunciation.innerHTML = `${result.furigana}<br>${result.romaji}`;
    } catch (error) {
        console.log(error);
    }
}