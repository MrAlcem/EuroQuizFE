// ==============================
// QUIZ → API
// ==============================
//
// The backend runs a stateful quiz session: fetchQuizSession() opens (or,
// for the daily challenge, resumes) a session and returns its first batch
// of data; answerQuizQuestion() scores one question at a time and returns
// either the next question or the final result.

// GET /quiz/start or /quiz/daily → { data, session_id, timer_seconds, gamification, ... }
// `category`/`country` only apply to a standard (non-daily) quiz; the
// backend rejects a category that isn't unlocked for the player's level.
async function fetchQuizSession(daily, category, country) {
    var url = API_BASE + (daily ? "/quiz/daily" : "/quiz/start");

    if (!daily) {
        var params = new URLSearchParams();
        if (category) params.set("category", category);
        if (country) params.set("country", country);
        var query = params.toString();
        if (query) url += "?" + query;
    }

    var res = await authFetch(url, { method: "GET" });
    var data = await res.json();
    if (!res.ok) {
        var firstError = data.errors && Object.values(data.errors)[0];
        throw new Error((firstError && firstError[0]) || data.message || "Failed to start quiz");
    }
    return data;
}

// POST /quiz/sessions/{id}/answer with { chosen_option } (string A-D, or
// null for "time ran out before choosing"). Returns
// { correct, correct_option, timed_out, lives_remaining, next_question, finished, result }.
async function answerQuizQuestion(sessionId, chosenOption) {
    var res = await authFetch(API_BASE + "/quiz/sessions/" + sessionId + "/answer", {
        method: "POST",
        body: JSON.stringify({ chosen_option: chosenOption })
    });
    var data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to submit answer");
    return data;
}
