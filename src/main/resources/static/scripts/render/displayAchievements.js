import {ACHIEVEMENTS} from "../utils/maps.js";

function getAchievements(stats) {
    const achievements = [];

    for (const [, group] of Object.entries(ACHIEVEMENTS)) {
        for (const ach of group) {
            if (ach.condition(stats)) {
                achievements.push(ach);
            }
        }
    }

    return achievements;
}

export function loadAchievements(learningStats) {
    const achievementsElem = document.getElementById("achievements");
    achievementsElem.innerHTML = ""; // reset

    const achievements = getAchievements(learningStats);

    if (achievements.length === 0) {
        achievementsElem.innerHTML = `
            <div class="empty-achievements">
                <p>No achievements yet 🦊</p>
                <span>Start learning to unlock your first badge!</span>
            </div>
        `;
        return;
    }

    achievementsElem.classList.add("achievements-grid");

    for (const ach of achievements) {
        const achievement = document.createElement("div");
        achievement.className = "achievement-card";
        achievement.title = ach.desc;

        achievement.innerHTML = `
            <div class="badge-wrapper">
                <img src="/images/badges/${ach.id}.png" alt="${ach.id} badge">
            </div>
            <div class="achievement-info">
                <span class="title">${ach.title}</span>
                <span class="desc">${ach.desc}</span>
            </div>
        `;

        achievementsElem.appendChild(achievement);
    }
}