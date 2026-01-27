export function loadStats(learningStats) {
    const xp = document.getElementById("xp");
    const totalKanji = document.getElementById("total-kanji");
    const totalKanjiBar = document.getElementById("total-kanji-bar");
    const errors = document.getElementById("errors");
    const errorsBar = document.getElementById("error-bar");

    const totalKanjiRate = Math.round(learningStats.totalLearnedKanji/10);
    const errorRate = learningStats.testsPassed === 0 ? 0 : Math.round(learningStats.errors*100/(learningStats.errors+learningStats.correctAnswers));
    xp.innerText = `${learningStats.xp} points`;
    totalKanji.innerText = `${totalKanjiRate} %`;
    errors.innerText = `${errorRate} %`;
    totalKanjiBar.setAttribute("aria-valuenow", totalKanjiRate);
    totalKanjiBar.setAttribute("style", `width: ${totalKanjiRate}%;`);
    totalKanjiBar.innerText = `${totalKanjiRate} %`;
    errorsBar.setAttribute("aria-valuenow", errorRate);
    errorsBar.setAttribute("style", `width: ${errorRate}%;`);
}