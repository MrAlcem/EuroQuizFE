document.addEventListener("DOMContentLoaded", () => {
    const $questionCard = document.getElementById("question-card");
    const $questionText = document.getElementById("question-text");
    const $options = document.getElementById("question-options");
    const $progress = document.getElementById("quiz-progress");
    const $nextBtn = document.getElementById("next-btn");
    const $result = document.getElementById("quiz-result");
    const $error = document.getElementById("quiz-error");

    let questions = [];
    let currentIndex = 0;
    const answers = new Map();

    startQuiz();

    async function startQuiz() {
        try {
            const { data } = await apiFetch("/api/quiz/start");
            questions = data;
            currentIndex = 0;
            answers.clear();
            renderQuestion();
        } catch (error) {
            showError(error.message);
        }
    }

    function renderQuestion() {
        const question = questions[currentIndex];

        $questionCard.hidden = false;
        $result.hidden = true;
        $progress.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
        $questionText.textContent = question.text;

        $options.innerHTML = "";
        Object.entries(question.options).forEach(([key, label]) => {
            const optionId = `option-${key}`;

            const wrapper = document.createElement("label");
            wrapper.className = "quiz-option";
            wrapper.setAttribute("for", optionId);

            const input = document.createElement("input");
            input.type = "radio";
            input.name = "question-option";
            input.id = optionId;
            input.value = key;
            input.checked = answers.get(question.id) === key;
            input.addEventListener("change", () => answers.set(question.id, key));

            wrapper.appendChild(input);
            wrapper.append(` ${key}. ${label}`);
            $options.appendChild(wrapper);
        });

        $nextBtn.textContent = currentIndex === questions.length - 1 ? "Submit quiz" : "Next question";
    }

    $nextBtn.addEventListener("click", () => {
        const question = questions[currentIndex];

        if (!answers.has(question.id)) {
            showError("Please select an answer before continuing.");
            return;
        }

        clearError();

        if (currentIndex < questions.length - 1) {
            currentIndex++;
            renderQuestion();
        } else {
            submitQuiz();
        }
    });

    async function submitQuiz() {
        const payload = {
            answers: Array.from(answers.entries()).map(([question_id, chosen_option]) => ({
                question_id,
                chosen_option,
            })),
        };

        try {
            const result = await apiFetch("/api/quiz/submit", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            $questionCard.hidden = true;
            $result.hidden = false;
            $result.innerHTML = `
                <h2>Quiz complete!</h2>
                <p>Score: ${result.score}</p>
                <p>Correct answers: ${result.correct_answers}</p>
                <p>Lives remaining: ${result.lives_remaining}</p>
            `;
        } catch (error) {
            showError(error.message);
        }
    }

    function showError(message) {
        $error.textContent = message;
        $error.hidden = false;
    }

    function clearError() {
        $error.hidden = true;
        $error.textContent = "";
    }
});
