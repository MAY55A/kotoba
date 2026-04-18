export function loadStats(learningStats) {
    const xp = document.getElementById("xp");
    const totalKanji = document.getElementById("total-kanji");
    const totalKanjiBar = document.getElementById("total-kanji-bar");
    const accuracy = document.getElementById("accuracy");
    const accuracyBar = document.getElementById("accuracy-bar");

    const totalKanjiRate = Math.round(learningStats.totalLearnedKanji / 10);
    const accuracyRate = learningStats.testsPassed === 0 ? 0 : Math.round(learningStats.correctAnswers * 100 / (learningStats.errors + learningStats.correctAnswers));
    xp.innerText = `${learningStats.xp} points`;
    totalKanji.innerText = `${totalKanjiRate} %`;
    accuracy.innerText = `${accuracyRate} %`;
    totalKanjiBar.setAttribute("aria-valuenow", totalKanjiRate);
    totalKanjiBar.setAttribute("style", `width: ${totalKanjiRate}%;`);
    totalKanjiBar.innerText = `${totalKanjiRate} %`;
    accuracyBar.setAttribute("aria-valuenow", accuracyRate);
    accuracyBar.setAttribute("style", `width: ${accuracyRate}%;`);
}