// ==============================
// PROFILE → GET /users/{id}
// ==============================

async function getUserProfile(userId) {
    try {
        const res = await authFetch(`/users/${userId}`);   // your authenticated fetch wrapper

        if (!res.ok) {
            throw new Error(`Failed to load profile: ${res.status}`);
        }

        return await res.json();   // → { username, email, bestScore, history: [...] }
    } catch (err) {
        console.error("getUserProfile error:", err);
        // fallback or re-throw depending on your UX needs
        throw err;
    }
}