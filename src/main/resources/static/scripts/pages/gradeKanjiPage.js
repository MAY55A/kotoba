import {playAudio} from "../utils/audio.js";
import {fetchLearningStats, updateUserData} from "../api/userApi.js";
import {fetchKanjiData} from "../api/kanjiApi.js";
import {displayKanjiData} from "../render/displayKanji.js";


const kanji = document.getElementById("kanji").textContent;
const id = Number(document.getElementById("kanji-id").value);
let nextBtn = document.getElementById('next');
let previousBtn = document.getElementById('previous');

let nextUnit;
let previousUnit;
let link;

async function displayButtons(data) {
    console.log("data: ", data);
    if (previousUnit.kanji != "null") {
        previousBtn.classList.remove("hidden");
        if (previousUnit.isTest !== 0) {
            link = `/learn/grades/${data.grade}/tests/${previousUnit.isTest}`;
            previousBtn.innerText = "TEST";
            nextBtn.classList.add("test");
        } else {
            link = `/learn/grades/${data.grade}/${previousUnit.kanji}`;
        }
        previousBtn.addEventListener("click", async function () {
            await playAudio("/sounds/next.mp3");
            window.location.href = link;
        });
    }
    if (nextUnit.kanji == "null") {
        link = `/learn/grades/${data.grade}/tests/final`;
        nextBtn.innerText = "FINAL TEST";
        nextBtn.classList.add("test");
    } else {
        if (nextUnit.isTest !== 0) {
            link = `/learn/grades/${data.grade}/tests/${nextUnit.isTest}`;
            nextBtn.innerText = "TEST";
            nextBtn.classList.add("test");
        } else {
            link = `/learn/grades/${data.grade}/kanji?kanji=${nextUnit.kanji}&id=${id + 1}`;
        }
    }
    nextBtn.addEventListener("click", async function () {
        await Promise.all([
            playAudio("/sounds/next.mp3"),
            addXP(data)
        ]);
        window.location.href = link;
    });
}

async function addXP(data) {
    const learningStats = await fetchLearningStats();

    const isNewKanji =
        learningStats.currentGrade === data.grade &&
        learningStats.gradeProgress === id + Math.trunc(id / 10);

    if (isNewKanji) {
        learningStats.xp += 5;
        learningStats.totalLearnedKanji += 1;
        learningStats.gradeProgress++;

        await updateUserData({"learningStats": learningStats});
    }
}

fetchKanjiData(kanji).then(async (data) => {
        nextUnit = data.nextUnit;
        previousUnit = data.previousUnit;
        displayKanjiData(data.kanjiData);
        displayButtons(data.kanjiData);
    }
);
