async function fetchKanjiList() {
    try {
        const grade = document.getElementById("grade").innerHTML;
        console.log(grade);
        const response = await fetch(`/api/kanji?grade=${grade}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching kanji list :", error);
        window.location.href = "/error";
    }
}

function displayAllKanji(kanjiList, user) {
    document.getElementById('loading').classList.add("hidden");
    console.log(user);
    const grade = Number(document.getElementById("grade").innerHTML);
    const progressBar = document.getElementById("progress-bar");
    const content = document.getElementById("grade-content");
    let kanjiUnit = 0;
    let totalUnits = 0;
    let kanjiLink;
    let status = "locked";
    let progress = user.learningStats.gradeProgress;
    let currentGrade = user.learningStats.currentGrade;
    // Display Kanji elements
    while (kanjiUnit < kanjiList.length) {
        if(grade < currentGrade) {
            status = "unlocked";
            kanjiLink = `href = "/learn/grades/${grade}/kanji?id=${kanjiUnit}&kanji=${kanjiList[kanjiUnit]}"`;
        } else if (currentGrade === grade) {
            if (totalUnits <= progress) {
                status = "unlocked";
                kanjiLink = `href = "/learn/grades/${grade}/kanji?id=${kanjiUnit}&kanji=${kanjiList[kanjiUnit]}"`;
                if (totalUnits === progress)
                    status += " current";
            } else {
                status = "locked";
                kanjiLink = "";
            }
        }
        content.insertAdjacentHTML('beforeend', `<span class="kanji ${status}" title="${status}"><a ${kanjiLink}>${kanjiList[kanjiUnit]}</a></span>`);
        kanjiUnit++;
        totalUnits++
        if (kanjiUnit % 10 === 0) {
            totalUnits++;
            if(status !== "locked")
                kanjiLink = `href = "/learn/grades/${grade}/tests/${Math.trunc(kanjiUnit/10)}"`;
            content.insertAdjacentHTML('beforeend', `<span class="test ${status}"><a ${kanjiLink}>test</a></span>`);
        }
    }
    content.insertAdjacentHTML('beforeend', `<span class="final-test ${status}">final test</span>`);
    let progressRate = progress/totalUnits*100;
    progressBar.setAttribute("aria-valuenow", progressRate);
    progressBar.setAttribute("style", `width: ${progressRate}%;`);
    progressBar.innerText = `${progressRate} %`;

}
fetchKanjiList().then((list) => fetchUserData().then((user) => displayAllKanji(list, user)));
