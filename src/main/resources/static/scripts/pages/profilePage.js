import {fetchUserData} from "../api/userApi.js";
import {loadAuthNav} from "../ui/authNav.js";
import {loadStats} from "../render/displayStats.js";
import {loadAchievements} from "../render/displayAchievements.js";

function fillUserInfo(userData) {
    document.getElementById("profile-picture").src = userData.profilePicture;
    document.getElementById("username").textContent = userData.username;
    document.getElementById("description").textContent = userData.description ? userData.description : "Welcome to my profile !";
    document.getElementById("date-joined").textContent = new Date(userData.createdAt).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    document.getElementById("current-grade").textContent = `grade ${userData.learningStats.currentGrade}`;
}

document.getElementById("edit-btn").addEventListener("click", () => {
    window.location.href = "/account-settings";
});
fetchUserData().then((user) => {
    loadAuthNav(user);
    fillUserInfo(user);
    loadStats(user.learningStats);
    loadAchievements(user.learningStats);
})