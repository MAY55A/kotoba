import {fetchKanjiData} from "../api/kanjiApi.js";
import {displayKanjiData} from "../render/displayKanji.js";


const kanji = document.getElementById("kanji").textContent;
fetchKanjiData(kanji).then(async (data) => {
        displayKanjiData(data.kanjiData);
    }
);
