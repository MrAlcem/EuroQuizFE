// ==============================
// QUIZ → MyDatabase
// ==============================

async function getQuestionsFromMyDatabase() {
    // ← put the real connection to MyDatabase here
    // const res = await authFetch("/questions?limit=10");
    // return await res.json();

    return [
        { text: "Which of these are programming languages? (Select all)", options: ["Python", "HTML", "JavaScript", "CSS"], correct: [0, 2] },
        { text: "Which planets are gas giants?", options: ["Earth", "Jupiter", "Mars", "Saturn"], correct: [1, 3] },
        { text: "Which are primary colors?", options: ["Red", "Green", "Blue", "Yellow"], correct: [0, 2] },
        { text: "Which animals are mammals?", options: ["Shark", "Dolphin", "Eagle", "Bat"], correct: [1, 3] },
        { text: "Which are fruits?", options: ["Carrot", "Apple", "Potato", "Banana"], correct: [1, 3] },
        { text: "Which countries are in Europe?", options: ["Brazil", "France", "Japan", "Germany"], correct: [1, 3] },
        { text: "Which are even numbers?", options: ["3", "4", "7", "8"], correct: [1, 3] },
        { text: "Which metals are precious?", options: ["Iron", "Gold", "Copper", "Silver"], correct: [1, 3] },
        { text: "Which are web browsers?", options: ["Chrome", "Word", "Firefox", "Excel"], correct: [0, 2] },
        { text: "Which are oceans?", options: ["Pacific", "Amazon", "Atlantic", "Nile"], correct: [0, 2] }
    ];
}

async function saveScoreToDatabase(username, score) {
    // ← put the real connection to MyDatabase here
    // await authFetch("/save-score", {
    //   method: "POST",
    //   body: JSON.stringify({ username, score })
    // });

    console.log("Saved to MyDatabase → " + username + ": " + score);
}