let questions = [];
let currentIndex = 0;
let answered = false;
let score = 0;

fetch("questions_v1.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadQuestion();
  });

function loadQuestion() {
  answered = false;
  document.getElementById("next-btn").disabled = true;
  document.getElementById("explanation").classList.add("hidden");

  const q = questions[currentIndex];

  document.getElementById("progress").innerText =
    `Question ${currentIndex + 1} of ${questions.length}`;

  document.getElementById("question").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  for (let key in q.options) {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = `${key}. ${q.options[key]}`;
    div.onclick = () => selectAnswer(div, key);
    optionsDiv.appendChild(div);
  }
}

function selectAnswer(selectedDiv, selectedKey) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];

  // ✅ FORCE SCORE UPDATE
  if (selectedKey === String(q.correct_answer).trim()) {
    score = score + 1;
  }

  // 🔁 FORCE REFRESH SCORE DISPLAY
  const scoreDiv = document.getElementById("score");
  if (scoreDiv) {
    scoreDiv.innerText = "Score: " + score;
  }

  // 🎨 COLOR OPTIONS
  const options = document.querySelectorAll(".option");
  options.forEach(opt => {
    const key = opt.innerText.trim().charAt(0);

    if (key === String(q.correct_answer).trim()) {
      opt.classList.add("correct");
    }

    if (key === selectedKey && key !== String(q.correct_answer).trim()) {
      opt.classList.add("wrong");
    }
  });

  // 📘 SHOW EXPLANATION
  const explanationDiv = document.getElementById("explanation");
  explanationDiv.innerHTML =
    "<strong>Explanation:</strong><br>" + q.explanation;
  explanationDiv.classList.remove("hidden");

  document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    document.getElementById("quiz-box").innerHTML =
  `<h2>🎉 Quiz Completed</h2>
   <p><strong>Your Score:</strong> ${score} / ${questions.length}</p>`;
    return;
  }
  loadQuestion();
}
