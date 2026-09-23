// ==============================
// LEADERBOARD
// ==============================

async function getLeaderboard() {
    // ← put the real connection to MyDatabase here
    // const res = await authFetch("/leaderboard");
    // return await res.json();

    return [
        { name: "Alex", score: 90 },
        { name: "Sam", score: 80 },
        { name: "Jordan", score: 60 },
        { name: "Taylor", score: 50 },
        { name: "Casey", score: 40 },
        { name: "Riley", score: 30 },
        { name: "Morgan", score: 20 },
        { name: "Avery", score: 10 }
    ];
}