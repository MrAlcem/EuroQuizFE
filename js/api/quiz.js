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

    async function fetchQuizSession(daily) {
        var res = await authFetch(API_BASE + (daily ? "/quiz/daily" : "/quiz/start"), { method: "GET" });
        if (!res.ok) throw new Error("Failed to start quiz");
        return await res.json();
    }

    async function answerQuizQuestion(sessionId, chosenOption) {
        var res = await authFetch(API_BASE + "/quiz/sessions/" + sessionId + "/answer", {
            method: "POST",
            body: JSON.stringify({ chosen_option: chosenOption })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to submit answer");
        return data;
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
