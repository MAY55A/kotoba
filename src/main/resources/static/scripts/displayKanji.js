const id = Number(document.getElementById("kanji-id").value);
let nextUnit;
let previousUnit;
async function fetchKanjiData() {
    try {
        const kanji = document.getElementById("kanji").innerHTML;
        const response = await fetch(`/api/kanji/${kanji}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json();
        let nextResponse = await fetch(`/api/kanji/next?kanji=${kanji}&grade=${result.grade}`);
        let previousResponse = await fetch(`/api/kanji/previous?kanji=${kanji}&grade=${result.grade}`);
        nextUnit = (await nextResponse.json());
        previousUnit = (await previousResponse.json());

        return result;
    } catch (error) {
        console.error("Error fetching kanji data :", error);
        window.location.href = "/error";
    }
}

function displayKanjiData(data) {
    document.getElementById('loading').classList.add("hidden");
        let examples = "";
    for(let ex of data.examples.slice(0,3)) {
        examples += `<div>
                      <span class="audio-symbol" onclick="playAudio('${ex.audio}')">🔊</span>
                      ${ex.japanese}<br>${ex.meaning}
                    </div>`;
    }
 document.getElementById('kanji-audio').onclick = function () {
            playAudio("http://localhost:8080/"+data.audioPath);
       };
document.getElementById('examples').innerHTML = examples;
    document.getElementById('meaning').innerText = data.meaning;
    document.getElementById('readings').innerHTML = `Onyomi : ${data.onyomi.katakana} (${data.onyomi.romaji})<br>Kunyomi : ${data.kunyomi.hiragana} (${data.kunyomi.romaji})`;
    document.getElementById('mn-hint').innerText = data.mnHint;
    document.getElementById('radicals').innerHTML = `${data.radicalDetails.character} (${data.radicalDetails.hiragana}) : ${data.radicalDetails.meaning}<br> strokes : ${data.radicalDetails.strokes}<br><img src="${data.radicalDetails.image}" alt="radical image" width="50" height="50">`;
    document.getElementById('kanji-video').querySelector('source').src = data.videoUrl;
    document.getElementById('kanji-video').load();

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
        previousBtn.addEventListener("click", function () {
            playAudio("/sounds/next.mp3");
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
        playAudio("/sounds/next.mp3");
        await addXP(data);
        window.location.href = link;
    });
}
function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
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
fetchKanjiData().then((kanji) => displayKanjiData(kanji));
