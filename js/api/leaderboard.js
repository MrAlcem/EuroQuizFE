// ==============================
// LEADERBOARD → GET /leaderboard
// ==============================
//
// Returns { data: [{ rank, name, score, level }], you: { rank, name, score, level } }.

async function getLeaderboard() {
    var res = await authFetch(API_BASE + "/leaderboard", { method: "GET" });
    var data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to load leaderboard");
    }

    return data;
}
