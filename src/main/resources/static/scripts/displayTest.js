const grade = document.getElementById("grade").value;
const nbtest = document.getElementById("test").value;
const progressBar = document.getElementById("progress-bar");
const text = document.getElementById('text');
const word = document.getElementById('word');
const result = document.getElementById('question-result');
const nextBtn = document.getElementById('next');
const input = document.createElement("input");
input.placeholder = "Enter your answer here";
input.addEventListener("change", () => {
    nextBtn.disabled = input.value.length === 0;
})
nextBtn.disabled = true;
let test;
let current = 0;
let question;
let totalPoints = 0;
let errors = 0;
let correctAnswers = 0;
let selected;
let isNewTest;
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
        displayQuestion();
    }
});
async function fetchTest() {
    try {
        let response;
        if (test === "final")
            response = await fetch(`/api/quizzes/final-test?grade=${grade}`);
        else
            response = await fetch(`/api/quizzes/unit-test?grade=${grade}&test=${nbtest}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json();
        console.log(result);
        document.getElementById('loading').classList.add("hidden");
        playAudio("/sounds/start.mp3");
        return result;
    } catch (error) {
        console.error("Error fetching test :", error);
        window.location.href = "/error";
    }
}

function displayQuestion() {
    if(current === test.questions.length)
        showTestResult();
    else {
        question = test.questions[current];
        const oldSection = document.getElementsByTagName("section")[0];
        const newSection = document.createElement("section");

        text.innerText = question.text;
        result.innerHTML = "";
        if (question.type === "SHOW_AUDIO")
            word.innerHTML = `<span class="audio-symbol" onClick="playAudio('http://localhost:8080/${question.audio}')">🔊</span>`;
        else if (question.type === "SHOW_KANJI" && question.audio !== null)
            word.innerHTML = `<span class="audio-symbol" onClick="playAudio('http://localhost:8080/${question.audio}')">🔊</span>${question.word}`;
        else
            word.innerHTML = question.word;
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

function showTestResult() {
    let testResult = document.getElementById('test-result');
    let testResultModal = document.getElementById('test-result-modal');
    let resultContent;
    if(totalPoints < test.requiredScore) {
        testResult.classList.add("failed");
        playAudio("/sounds/lose.mp3");
        resultContent  = `
            <h2>Sorry ! You did not pass </h2>
            <p>Your score: <span>${totalPoints}</span></p>
            <p>Minimum required score: <span>${test.requiredScore}</span></p>
            <img src="/images/sadCat.jpeg" alt="sad cat"><br>
            <a href="/learn/grades/${grade}">Close</a>
        `;
    } else {
        fetchUserData().then((user) => {
            user.learningStats.xp += totalPoints;
            user.learningStats.errors += errors;
            user.learningStats.correctAnswers += correctAnswers;
            isNewTest = user.learningStats.currentGrade == grade && user.learningStats.gradeProgress == nbtest*10;
            if(isNewTest) {
                user.learningStats.testsPassed++;
                user.learningStats.gradeProgress++;
            }
            if(test === "final" && grade != 6) {
                user.learningStats.currentGrade++;
                user.learningStats.gradeProgress = 0;
            }
            console.log(user);
            updateUserData(user);
        });
        testResult.classList.add("passed");
        playAudio("/sounds/win.wav");
        let msg = "";
        if(isNewTest) {
            if (test === "final")
                if (grade === "6")
                    msg = "Congratulations, You completed all the grades !";
                else
                    msg = "Congratulations, You unlocked the next grade !";
            else
                msg = "Now you can continue your learning path !";
        }
        resultContent  = `
            <h2>Great Job ! You passed this test </h2>
            <p>XP earned: <span>${totalPoints}</span></p>
            <p>${msg}</p>
            <img src="/images/happyCat.jpeg" alt="happy cat"><br>
            <a href="/learn/grades/${grade}">Close</a>
        `;
    }
    testResult.innerHTML = resultContent;
    testResultModal.classList.remove("hidden");
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

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

function updateProgressBar() {
    let progressRate = current/test.questions.length*100;
    progressBar.setAttribute("aria-valuenow", progressRate);
    progressBar.setAttribute("style", `width: ${progressRate}%;`);

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
    window.location.href = `/learn/grades/${grade}`;
}

fetchTest().then((testData) => {
    test = testData;
    displayQuestion(0);
});
