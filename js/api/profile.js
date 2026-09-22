// ==============================
// PROFILE → GET /users/{id}
// ==============================

async function getUserProfile(userId) {
    // ← put the real connection to MyDatabase here
    // const res = await authFetch("/users/" + userId);
    // return await res.json();

    return {
        username: getCurrentUser(),
        email: getCurrentEmail() || "unknown@email.com",
        bestScore: 70,
        history: [
            { score: 70, date: "2026-09-18" },
            { score: 50, date: "2026-09-17" },
            { score: 30, date: "2026-09-16" }
        ]
    };
}