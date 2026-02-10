import {fetchTest} from "../api/testApi.js";
import {fetchLearningStats, updateUserData} from "../api/userApi.js";
import {bindAudioSymbols, playAudio} from "../utils/audio.js";

const grade = document.getElementById("grade").value;
const nbTest = document.getElementById("test").value;
const loading = document.getElementById('loading');
const progressBar = document.getElementById("progress-bar");
const startLayout = document.getElementById("start");
const startBtn = document.getElementById("start-btn");
const text = document.getElementById('text');
const word = document.getElementById('word');
const result = document.getElementById('question-result');
const nextBtn = document.getElementById('next');
const input = document.createElement("input");

let test;
let current = 0;
let question;
let totalPoints = 0;
let errors = 0;
let correctAnswers = 0;
let selected;
let isNewTest;

// A flag to control when to prevent navigation (only prevent refreshing, other navigations will be controlled manually)
// Before and while fetching test data allow navigation (in case an error occurs and the user is redirected to /error)
let preventNavigation = false;

startBtn.addEventListener("click", () => {
    playAudio("/sounds/start.mp3");
    startLayout.classList.add("hidden");
    displayCurrentQuestion();
});
input.addEventListener("change", () => {
    nextBtn.disabled = input.value.length === 0;
});
nextBtn.addEventListener("click", () => {
    if (nextBtn.innerText === "check") {
        nextBtn.innerText = "continue";
        nextBtn.classList.remove("check");
        if(!question.options) {
            input.disabled = true;
            if (question.correctAnswer.split(", ").includes(input.value.trim().toLowerCase())) {
                totalPoints += question.points;
                correctAnswers++;
                showGoodResult(question.points);
            } else {
                errors++;
                showBadResult();
            }
        } else {
            if (selected.innerText === question.correctAnswer) {
                selected.classList.add("green");
                totalPoints += question.points;
                correctAnswers++;
                showGoodResult(question.points);
            } else {
                selected.classList.add("red");
                errors++;
                showBadResult();
            }
        }
    } else {
        playAudio("/sounds/next.mp3");
        nextBtn.innerText = "check";
        nextBtn.classList.add("check");
        nextBtn.disabled = true;
        current++;
        updateProgressBar();
        displayCurrentQuestion();
    }
});

input.placeholder = "Enter your answer here";
nextBtn.disabled = true;

function displayCurrentQuestion() {
    if(current === test.questions.length)
        showTestResult();
    else {
        question = test.questions[current];
        const oldSection = document.getElementsByTagName("section")[0];
        const newSection = document.createElement("section");

        text.innerText = question.text;
        result.innerHTML = "";
        if (question.type === "SHOW_AUDIO")
            word.innerHTML = `<span class="audio-symbol" data-audio="http://localhost:8080/${question.audio}">🔊</span>`;
        else if (question.type === "SHOW_KANJI" && question.audio !== null)
            word.innerHTML = `<span class="audio-symbol" data-audio="http://localhost:8080/${question.audio}">🔊</span>${question.word}`;
        else
            word.innerHTML = question.word;

        bindAudioSymbols() // enables playing audio when clicking on any audio-symbol inside the current DOM

        if (question.options) {
            selected = null;
            newSection.id = "options";
            for (let option of question.options) {
                const div = document.createElement("div");
                div.innerText = option;
                div.addEventListener("click", () => {
                    if (nextBtn.innerText === "check") {
                        if (selected !== null) {
                            selected.classList.remove("selected");
                        }
                        if (selected === div) {
                            selected = null;
                        } else {
                            div.classList.add("selected");
                            selected = div;
                            nextBtn.disabled = false;
                        }
                        playAudio("/sounds/pick.wav");
                    }
                });
                newSection.appendChild(div);
            }
            nextBtn.addEventListener("click", () => {

            });
        } else {
            newSection.id = "answer";
            input.value = "";
            input.disabled = false;
            newSection.appendChild(input);
        }
        oldSection.replaceWith(newSection);
    }
}

async function showTestResult() {
    let testResult = document.getElementById('test-result');
    let testResultModal = document.getElementById('test-result-modal');
    let resultContent;
    let audio;

    loading.getElementsByTagName("p")[0].textContent = "Loading results, please wait..."
    loading.classList.remove("hidden");

    let learningStats = await fetchLearningStats();
    learningStats.xp += totalPoints;
    learningStats.errors += errors;
    learningStats.correctAnswers += correctAnswers;


    if (totalPoints < test.requiredScore) { // Test failed
        testResult.classList.add("failed");
        audio = "/sounds/lose.mp3";
        resultContent = `
            <h2>Sorry ! You did not pass </h2>
            <p>Your score: <span>${totalPoints}</span></p>
            <p>Minimum required score: <span>${test.requiredScore}</span></p>
            <img src="/images/sadCat.jpeg" alt="sad cat"><br>
            <a href="/learn/grades/${grade}">Close</a>
        `;
    } else { // Test passed
        isNewTest = learningStats.currentGrade == grade &&
            (nbTest == "final" || learningStats.gradeProgress == nbTest * 10);
        if (isNewTest) {
            learningStats.testsPassed++;
            learningStats.gradeProgress++;
            if (nbTest === "final" && grade != 6) { // if it's the final test of a grade (not the last grade)
                learningStats.currentGrade++;
                learningStats.gradeProgress = 0;
            }
        }

        testResult.classList.add("passed");
        audio = "/sounds/win.wav";
        let msg = "";
        if (isNewTest) {
            if (test === "final")
                if (grade === "6")
                    msg = "Congratulations, You completed all the grades !";
                else
                    msg = "Congratulations, You unlocked the next grade !";
            else
                msg = "Now you can continue your learning path !";
        }
        resultContent = `
            <h2>Great Job ! You passed this test </h2>
            <p>XP earned: <span>${totalPoints}</span></p>
            <p>${msg}</p>
            <img src="/images/happyCat.jpeg" alt="happy cat"><br>
            <a href="/learn/grades/${grade}">Close</a>
        `;
    }

    await updateUserData({"learningStats": learningStats});
    playAudio(audio);
    loading.classList.add("hidden");
    testResult.innerHTML = resultContent;
    testResultModal.classList.remove("hidden");
    preventNavigation = false;
}

function showGoodResult(points) {
    playAudio("/sounds/correct.mp3");
    result.innerHTML = `<span class="correct">CORRECT !</span><br>
                <span id="xp">+ ${points} XP</span><br>
                <img src="/images/satisfiedCat.jpeg" alt="satisfied cat">`;
}

function showBadResult() {
    playAudio("/sounds/wrong.mp3");
    result.innerHTML = `<span class="wrong">INCORRECT !</span><br>
                        <img src="/images/annoyedCat.jpeg" alt="annoyed cat">`;
}

function updateProgressBar() {
    let progressRate = current/test.questions.length*100;
    progressBar.setAttribute("aria-valuenow", progressRate);
    progressBar.setAttribute("style", `width: ${progressRate}%;`);

}

function displayStartBtn() {
    loading.classList.add("hidden");
    startLayout.classList.remove("hidden");
}

function displayExitPopup(bool) {
    playAudio("/sounds/pop.mp3");
    let exitPopup = document.getElementById("confirmation-modal");
    if(bool)
        exitPopup.classList.remove("hidden");
    else
        exitPopup.classList.add("hidden");
}

function exitTest() {
    preventNavigation = false;
    window.location.href = `/learn/grades/${grade}`;
}

// Show popup dialog before refreshing or closing tab
window.addEventListener("beforeunload", (event) => {
    if (preventNavigation) {
        event.preventDefault();
        event.returnValue = "";
    }
});

document.getElementById("x").addEventListener("click", ()=>displayExitPopup(true));
document.getElementById("exit").addEventListener("click", exitTest);
document.getElementById("cancel").addEventListener("click", ()=>displayExitPopup(false));


fetchTest(nbTest, grade).then((testData) => {
    test = testData;

    // Now that the test data is fetched prevent navigation (redirecting to /error is not a problem anymore)
    preventNavigation = true;

    displayStartBtn();
});
