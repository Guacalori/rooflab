
const roofNames = [
    "Skillion and Lean-to",
    "Open Gable",
    "Box Gable",
    "Dormer",
    "Hip",
    "Hip and Valley",
    "Gambrel",
    "Mansard",
    "Butterfly",
    "Intersecting / Overlaid Hip",
    "Dutch Gable",
    "Hexagonal Gazebo",
    "Jerkinhead",
    "Flat",
    "Cross Hipped",
    "M shaped",
    "Saltbox",
    "Shed",
    "Combination",
    "Pyramid Hip"
];

// Associate each roof with its PNG.
const roofs = [];

roofNames.forEach((name, index) => {
    roofs.push({
        name: name,
        image: `images/${index + 1}.png`
    });
});

let questions = [];
let currentQuestion = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let missedRoofs = [];
let answered = false;

// Show only the selected screen.
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(element => {
        element.hidden = element.id !== screen;
    });
}

// Randomize an array.
function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// Start the quiz.
function startGame(total) {
    questions = shuffle(roofs).slice(0, total);
    currentQuestion = 0;
    score = 0;
    streak = 0;
    bestStreak = 0;
    missedRoofs = [];

    showScreen("quiz-screen");
    loadQuestion();
}

// Display a question.
function loadQuestion() {
    answered = false;

    const roof = questions[currentQuestion];

    document.getElementById("roof-image").src = roof.image;
    document.getElementById("score").textContent = score;

    document.getElementById("question-count").textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("streak").textContent =
        `${streak} Streak`;

    document.getElementById("progress-fill").style.width =
        `${(currentQuestion / questions.length) * 100}%`;

    document.getElementById("feedback").hidden = true;
    document.getElementById("next-btn").hidden = true;

    // Get three other names.
    const wrongAnswers = shuffle(
        roofNames.filter(name => name !== roof.name)
    ).slice(0, 3);

    const choices = shuffle([
        roof.name,
        ...wrongAnswers
    ]);

    const container = document.getElementById("options");
    container.innerHTML = "";

    // Generate the four answer buttons.
    choices.forEach((name, index) => {
        const button = document.createElement("button");

        button.className = "option-btn";

        const key = document.createElement("span");
        key.className = "option-key";
        key.textContent = index + 1;

        const label = document.createElement("span");
        label.textContent = name;

        button.append(key, label);

        button.onclick = () => checkAnswer(name, button);

        container.appendChild(button);
    });
}

// Check the player's answer.

function checkAnswer(selectedName, selectedButton) {
    if (answered) return;

    answered = true;

    const correctName = questions[currentQuestion].name;
    const roofDisplay = document.querySelector(".roof-display");

    // Remove previous border colors
    roofDisplay.classList.remove("correct", "wrong");

    if (selectedName === correctName) {
        score += 100;
        streak++;
        bestStreak = Math.max(bestStreak, streak);

        roofDisplay.classList.add("correct");
    } else {
        streak = 0;
        missedRoofs.push(correctName);

        roofDisplay.classList.add("wrong");
    }

    // Disable options and highlight the correct choice
    document.querySelectorAll(".option-btn").forEach(button => {
        button.disabled = true;

        const name = button.querySelector("span:last-child").textContent;

        if (name === correctName) {
            button.classList.add("correct");
        } else if (name === selectedName) {
            button.classList.add("wrong");
        }
    });

    document.getElementById("score").textContent = score;
    document.getElementById("streak").textContent = `${streak} Streak`;

    // Hide old feedback message
    document.getElementById("feedback").hidden = true;

    // Show next button
    const next = document.getElementById("next-btn");
    next.hidden = false;
    next.textContent = currentQuestion === questions.length - 1
        ? "View Results"
        : "Next Question";
}


// Move to the next question.
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Display results.
function showResults() {
    const correct = score / 100;
    const percent = Math.round(correct / questions.length * 100);

    document.getElementById("result-title").textContent =
        percent === 100 ? "Roof Master!" : "Quiz Complete!";

    document.getElementById("final-percent").textContent =
        `${percent}%`;

    document.getElementById("result-detail").textContent =
        `${correct} out of ${questions.length} correct.`;

    document.getElementById("correct-total").textContent = correct;
    document.getElementById("best-streak").textContent = bestStreak;

    const reviewArea = document.getElementById("review-area");
    const reviewList = document.getElementById("review-list");

    reviewList.innerHTML = "";
    reviewArea.hidden = missedRoofs.length === 0;

    missedRoofs.forEach(name => {
        const item = document.createElement("span");
        item.textContent = name;
        reviewList.appendChild(item);
    });

    document.getElementById("progress-fill").style.width = "100%";
    showScreen("result-screen");
}

// Study all 20 roofs.
function openStudy() {
    const grid = document.getElementById("study-grid");
    grid.innerHTML = "";

    roofs.forEach(roof => {
        const card = document.createElement("div");
        card.className = "study-card";

        const imageBox = document.createElement("div");
        imageBox.className = "study-image";

        const image = document.createElement("img");
        image.src = roof.image;
        image.alt = roof.name;

        const title = document.createElement("h3");
        title.textContent = roof.name;

        imageBox.appendChild(image);
        card.append(imageBox, title);
        grid.appendChild(card);
    });

    showScreen("study-screen");
}

// Buttons
document.querySelectorAll("[data-length]").forEach(button => {
    button.disabled = false;
    button.onclick = () => startGame(Number(button.dataset.length));
});

document.getElementById("study-open").disabled = false;
document.getElementById("study-open").onclick = openStudy;
document.getElementById("study-back").onclick =
    () => showScreen("home-screen");

document.getElementById("next-btn").onclick = nextQuestion;
document.getElementById("replay-btn").onclick =
    () => startGame(questions.length);

document.getElementById("result-home").onclick =
    () => showScreen("home-screen");

document.getElementById("image-status").textContent =
    "Choose a quiz mode to begin.";
