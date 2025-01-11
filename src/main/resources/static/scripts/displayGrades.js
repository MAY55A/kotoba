function loadGrades(userData) {
    const { currentGrade, gradeProgress } = userData.learningStats;
    // Update grade statuses dynamically
    document.querySelectorAll(".grade").forEach((gradeElement) => {
        const gradeNumber = parseInt(gradeElement.getAttribute("data-grade"));

        const statusElement = gradeElement.querySelector(".status");

        if (gradeNumber < currentGrade) {
            // Completed grades
            gradeElement.classList.add("completed");
            gradeElement.firstElementChild.setAttribute("href", `/learn/grade/${gradeNumber}`);
            statusElement.innerHTML = "&#10004; COMPLETED";
        } else if (gradeNumber === currentGrade) {
            const progressBarDiv = document.createElement("div");
            progressBarDiv.className = "progress";
            progressBarDiv.innerHTML = `
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                            role="progressbar"
                            aria-valuenow="${gradeProgress}"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style="width: ${gradeProgress}%">
                        </div>
                    `;
            statusElement.insertAdjacentElement("beforebegin", progressBarDiv);
            gradeElement.classList.add("in-progress");
            statusElement.innerHTML = `<a href="/learn/grades/${gradeNumber}">RESUME &#10140;</a>`;
        } else {
            // Locked grades
            statusElement.textContent = "LOCKED";
        }
    });
}

function loadStats(learningStats) {
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

function loadAchievements(learningStats) {
    const achievements = document.getElementById("achievements");

    if (learningStats.totalLearnedKanji >= 5) {
        const achievement = document.createElement("div");
        achievement.innerHTML = `
            <img src="/images/kanjicat1.png" alt="Quiz Master Badge" width="50">
            <span>First Step</span>
        `;
        achievements.appendChild(achievement);
    }

    if (learningStats.gradeProgress >= 10) {
        const achievement = document.createElement("div");
        achievement.innerHTML = `
            <img src="/images/girl2.png" alt="Grade Progress Badge" width="50" height="50">
            <span>Progress Expert</span>
        `;
        achievements.appendChild(achievement);
    }

    // Achievement 1: XP >= 100
    if (learningStats.xp >= 100) {
        const achievement = document.createElement("div");
        achievement.innerHTML = `
            <img src="/images/kanjicat1.png" alt="100 XP Badge" width="50" height="50">
            <span>100 XP Badge</span>
        `;
        achievements.appendChild(achievement);
    }

    // Achievement 2: Total learned kanji >= 50
    if (learningStats.totalLearnedKanji >= 50) {
        const achievement = document.createElement("div");
        achievement.innerHTML = `
            <img src="/images/girl3.png" alt="Kanji Master Badge" width="50" height="50">
            <span>Kanji Master</span>
        `;
        achievements.appendChild(achievement);
    }

    // Achievement 3: Tests passed >= 10
    if (learningStats.testsPassed >= 10) {
        const achievement = document.createElement("div");
        achievement.innerHTML = `
            <img src="/images/kanjicat1.png" alt="Test Champion Badge" width="50" height="50">
            <span>Test Champion</span>
        `;
        achievements.appendChild(achievement);
    }
    if (achievements.innerHTML == "") {
        achievements.innerHTML = "You do not have any achievements yet !";
    }
}