// ==============================
// QUIZ → API
// ==============================

// GET /quiz/start → 10 questions, each with id, text and options {A,B,C,D}.
// The correct option is never sent to the client.
async function fetchQuizQuestions() {
    var res = await authFetch(API_BASE + "/quiz/start", { method: "GET" });

    if (!res.ok) {
        throw new Error("Failed to load questions");
    }

    var body = await res.json();
    return body.data;
}

// POST /quiz/submit with the full batch of { question_id, chosen_option }
// answers. Returns the server-computed { score, correct_answers, lives_remaining }.
async function submitQuizAnswers(answers) {
    var res = await authFetch(API_BASE + "/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers: answers })
    });

    if (!res.ok) {
        throw new Error("Failed to submit answers");
    }

    return await res.json();
}
