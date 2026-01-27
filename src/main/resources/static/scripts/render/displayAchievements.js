export function loadAchievements(learningStats) {
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