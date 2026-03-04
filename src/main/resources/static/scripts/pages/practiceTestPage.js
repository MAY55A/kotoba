import {fetchPracticeTest} from "../api/testApi.js";
import {displayTest} from "../render/displayTest.js";

const type = document.getElementById("type").value;
const questionsCount = Number(document.getElementById("questions-count").value);
const grade = (type === "grade") ? document.getElementById("grade").value : null;

function onShowResult(learningStats, result, testResultElem) {

    result.content = `
            <h2>Practice Completed ! </h2>
            <p>XP earned: <span>${result.stats.totalPoints}</span></p>
            <p>Correct answers: <span>${result.stats.correctAnswers}</span></p>
            <p>Errors: <span>${result.stats.errors}</span></p>
            <img src="/images/happyCat.jpeg" alt="happy cat"><br>
            <a href="/practice">Close</a>
       `;

}

fetchPracticeTest(type, questionsCount, grade).then((testData) => {
    displayTest(testData, onShowResult, grade);
});