import {loadAuthNav} from "../ui/authNav.js";

const options = document.getElementsByName("questionCount");

function goToTest() {
    let nbQuestions = Array.from(options).find(o => o.checked).value;
    window.location.href = `/quiz/start?questions=${nbQuestions}`;
}

document.getElementById("start-quiz").addEventListener("click", goToTest);

loadAuthNav();
