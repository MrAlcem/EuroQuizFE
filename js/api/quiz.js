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

    var params = new URLSearchParams();
    params.set("lang", getLanguage());
    if (!daily) {
        if (category) params.set("category", category);
        if (country) params.set("country", country);
    }
    url += "?" + params.toString();

    var res = await authFetch(url, { method: "GET" });
    var data = await res.json();
    if (!res.ok) {
        var firstError = data.errors && Object.values(data.errors)[0];
        throw new Error((firstError && firstError[0]) || data.message || "Failed to start quiz");
    }
    return data;
}

// The backend resets the daily challenge at UTC midnight (see
// QuizSessionService::dailyResetsAt). Used right after finishing today's
// challenge, when the answer response has no `resets_at` of its own; once
// the page reloads, /quiz/daily's `resets_at` is used instead.
function nextDailyResetIso() {
    var now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();
}

// GET /quiz/sessions/{id}/questions → { data }: the session's full question
// set re-translated into getLanguage(). Read-only — it doesn't touch the
// per-question timer — so it's safe to call whenever the player switches
// language mid-quiz, to re-translate the question(s) already on screen.
async function fetchSessionQuestions(sessionId) {
    var res = await authFetch(
        API_BASE + "/quiz/sessions/" + sessionId + "/questions?lang=" + getLanguage(),
        { method: "GET" }
    );
    var data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reload questions");
    return data;
}

// POST /quiz/sessions/{id}/answer with { chosen_option } (string A-D, or
// null for "time ran out before choosing"). Returns
// { correct, correct_option, timed_out, lives_remaining, next_question, finished, result }.
async function answerQuizQuestion(sessionId, chosenOption) {
    var res = await authFetch(API_BASE + "/quiz/sessions/" + sessionId + "/answer?lang=" + getLanguage(), {
        method: "POST",
        body: JSON.stringify({ chosen_option: chosenOption })
    });
    var data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to submit answer");
    return data;
}
