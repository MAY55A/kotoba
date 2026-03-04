import {fetchGradeTest} from "../api/testApi.js";
import {displayTest} from "../render/displayTest.js";

const nbTest = document.getElementById("test").value;
const grade = document.getElementById("grade").value;

async function onShowResult(learningStats, result, testResultElem) {

    if (result.stats.totalPoints < result.stats.requiredScore) { // Test failed
        testResultElem.classList.add("failed");
        result.audio = "/sounds/lose.mp3";
        result.content = `
            <h2>Sorry ! You did not pass </h2>
            <p>Your score: <span>${result.stats.totalPoints}</span></p>
            <p>Minimum required score: <span>${result.stats.requiredScore}</span></p>
            <img src="/images/sadCat.jpeg" alt="sad cat"><br>
            <a href="/learn/grades/${grade}">Close</a>
        `;
    } else { // Test passed
        let isNewTest = learningStats.currentGrade == grade &&
            (nbTest == "final" || learningStats.gradeProgress == nbTest * 10);
        if (isNewTest) {
            learningStats.testsPassed++;
            learningStats.gradeProgress++;
            if (nbTest === "final" && grade != 6) { // if it's the final test of a grade (not the last grade)
                learningStats.currentGrade++;
                learningStats.gradeProgress = 0;
            }
        }

        testResultElem.classList.add("passed");
        let msg = "";
        if (isNewTest) {
            if (nbTest === "final")
                if (grade === "6")
                    msg = "Congratulations, You completed all the grades !";
                else
                    msg = "Congratulations, You unlocked the next grade !";
            else
                msg = "Now you can continue your learning path !";
        }
        result.content = `
            <h2>Great Job ! You passed this test </h2>
            <p>XP earned: <span>${result.stats.totalPoints}</span></p>
            <p>${msg}</p>
            <img src="/images/happyCat.jpeg" alt="happy cat"><br>
            <a href="/learn/grades/${grade}">Close</a>
        `;
    }
}

fetchGradeTest(nbTest, grade).then((testData) => {
    displayTest(testData, onShowResult, grade);
});