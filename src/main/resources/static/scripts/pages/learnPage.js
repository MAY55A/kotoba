import {fetchUserData} from "../api/userApi.js";
import {loadAuthNav} from "../ui/authNav.js";
import {loadStats} from "../render/displayStats.js";
import {loadAchievements} from "../render/displayAchievements.js";

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

fetchUserData().then((user) => {
    loadAuthNav(user);
    loadGrades(user);
    loadStats(user.learningStats);
    loadAchievements(user.learningStats);
})