import {fetchKanjiData} from "../api/kanjiApi.js";
import {fetchUserData, updateUserData} from "../api/userApi.js";
import {bindAudioSymbols, playAudio} from "../utils/audio.js";

const kanji = document.getElementById("kanji").innerHTML;
const id = Number(document.getElementById("kanji-id").value);
let nextUnit;
let previousUnit;

function displayKanjiData(data) {
    document.getElementById('loading').classList.add("hidden");
    let examples = "";
    for(let ex of data.examples.slice(0,3)) {
        examples += `<div>
                      <span class="audio-symbol" data-audio="${ex.audio}">🔊</span>
                      ${ex.japanese}<br>${ex.meaning}
                    </div>`;
    }
    document.getElementById('kanji-audio').dataset.audio = "http://localhost:8080/" + data.audioPath;
    document.getElementById('examples').innerHTML = examples;
    document.getElementById('meaning').innerText = data.meaning;
    document.getElementById('readings').innerHTML = `Onyomi : ${data.onyomi.katakana} (${data.onyomi.romaji})<br>Kunyomi : ${data.kunyomi.hiragana} (${data.kunyomi.romaji})`;
    document.getElementById('mn-hint').innerText = data.mnHint;
    document.getElementById('radicals').innerHTML = `${data.radicalDetails.character} (${data.radicalDetails.hiragana}) : ${data.radicalDetails.meaning}<br> strokes : ${data.radicalDetails.strokes}<br><img src="${data.radicalDetails.image}" alt="radical image" width="50" height="50">`;
    document.getElementById('kanji-video').querySelector('source').src = data.videoUrl;
    document.getElementById('kanji-video').load();

    bindAudioSymbols(); // enables playing audio when clicking on any audio-symbol inside the current DOM

    let nextBtn = document.getElementById('next');
    let previousBtn = document.getElementById('previous');
    let link;

    if(previousUnit.kanji != "null") {
        previousBtn.classList.remove("hidden");
        if(previousUnit.isTest !== 0) {
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
    if(nextUnit.kanji == "null") {
        link = `/learn/grades/${data.grade}/tests/final`;
        nextBtn.innerText = "FINAL TEST";
        nextBtn.classList.add("test");
    } else {
        if(nextUnit.isTest !== 0) {
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
    const user = await fetchUserData();

    const isNewKanji =
        user.learningStats.currentGrade === data.grade &&
        user.learningStats.gradeProgress === id + Math.trunc(id / 10);

    if (isNewKanji) {
        user.learningStats.xp += 5;
        user.learningStats.totalLearnedKanji += 1;
        user.learningStats.gradeProgress++;
        console.log(user);
        await updateUserData(user);
    }
}

fetchKanjiData(kanji).then((data) =>
{
    nextUnit = data.nextUnit
    previousUnit = data.previousUnit
    displayKanjiData(data.kanjiData)
}
);
