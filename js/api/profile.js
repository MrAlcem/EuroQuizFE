// ==============================
// PROFILE → GET /user/profile
// ==============================
//
// Returns { username, email, best_score, total_score, level, history: [
//   { id, score, correct_answers, lives_remaining, xp_earned, daily, date }
// ] }.

async function getUserProfile() {
    var res = await authFetch(API_BASE + "/user/profile", { method: "GET" });
    var data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to load profile");
    }

    return data;
}

// GET /results/{id} → the result plus its per-question answer log, for
// reviewing what was answered on a past (or just-finished) quiz.
async function getResultDetails(resultId) {
    var res = await authFetch(API_BASE + "/results/" + resultId, { method: "GET" });
    var data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to load result");
    }

    return data;
}
