// ==============================
// SESSION HELPERS
// ==============================

function getCurrentUser() {
  return localStorage.getItem("username") || "Guest";
}

function getCurrentEmail() {
  return localStorage.getItem("email") || "";
}

function getCurrentUserId() {
  return localStorage.getItem("userId") || null;
}

function getCurrentRole() {
  return localStorage.getItem("role") || "";
}

function isAdmin() {
  return getCurrentRole() === "ROLE_Admin";
}

function requireAdmin() {
  if (!isLoggedIn()) {
    window.location.href = "Login.html";
    return;
  }
  if (!isAdmin()) {
    window.location.href = "Index.html";
  }
}

function getToken() {
  return localStorage.getItem("token") || null;
}

function isLoggedIn() {
  return Boolean(localStorage.getItem("token") || localStorage.getItem("username"));
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "Login.html";
  }
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "Index.html";
  }
}

function saveSession(data) {
  // data: { token, userId, username, email }
  if (data.token) localStorage.setItem("token", data.token);
  if (data.userId) localStorage.setItem("userId", String(data.userId));
  if (data.username) localStorage.setItem("username", data.username);
  if (data.email) localStorage.setItem("email", data.email);
  if (data.role) localStorage.setItem("role", data.role);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  window.location.href = "Login.html";
}

// Helper: fetch with JWT attached
async function authFetch(url, options) {
  options = options || {};
  options.headers = options.headers || {};
  options.headers["Content-Type"] = "application/json";

  var token = getToken();
  if (token) {
    options.headers["Authorization"] = "Bearer " + token;
  }

  return fetch(url, options);
}

// ==============================
// AUTH → MyDatabase / API
// ==============================

// Login with JWT
// Backend should return: { success, token, userId, username, email }
async function loginUser(username, password) {
  // ← put the real connection to MyDatabase here
  // const res = await fetch("/login", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ username, password })
  // });
  // return await res.json();

  if (!username || !password) {
    return { success: false, message: "Please fill in all fields" };
  }
  // Temporary fake response (pretend JWT)
  return {
    success: true,
    token: "fake-jwt-token",
    userId: "1",
    username: username,
    email: localStorage.getItem("email") || username + "@email.com",
    role: "ROLE_User"
  };
}

// Register = POST /users  (username, email, password)
// Backend should return: { success, token, userId, username, email }
async function registerUser(username, email, password) {
  // ← put the real connection to MyDatabase here
  // const res = await fetch("/users", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ username, email, password })
  // });
  // return await res.json();

  if (!username || !email || !password) {
    return { success: false, message: "Please fill in all fields" };
  }
  if (email.indexOf("@") === -1) {
    return { success: false, message: "Please enter a valid email" };
  }
  return {
    success: true,
    token: "fake-jwt-token",
    userId: "1",
    username: username,
    email: email,
    role: "ROLE_User"
  };
}

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

// ==============================
// SITE SETTINGS: DARK MODE + LANGUAGE
// ==============================

var translations = {
  en: {
    darkMode: "🌙 Dark Mode", lightMode: "☀️ Light Mode",
    options: "Options", language: "Language", english: "English", croatian: "Croatian",
    home: "Home", logout: "Logout", signedInAs: "Signed in as",
    quizChallenge: "Quiz Challenge", chooseWhat: "Choose what you want to do",
    startQuiz: "Start Quiz", quizDescription: "10 questions · 3 lives · multi-select",
    leaderboard: "Leaderboard", leaderboardDescription: "See top players by score",
    myProfile: "My Profile", profileDescription: "Personal score and quiz history",
    question: "Question", submitAnswer: "Submit Answer", nextQuestion: "Next Question",
    seeResults: "See Results", quizFinished: "Quiz Finished",
    correctAnswers: "Correct answers:", remainingLives: "Remaining lives:",
    totalScore: "Total score:", playAgain: "Play Again",
    viewLeaderboard: "View Leaderboard", backHome: "Back to Home",
    topPlayers: "Top players by score", yourPosition: "Your position",
    startQuizButton: "Start Quiz", loading: "Loading...", noScores: "No scores yet",
    failedLeaderboard: "Failed to load leaderboard", you: "(you)", noScoreYet: "No score yet",
    correct: "Correct!", wrong: "Wrong!"
  },
  hr: {
    darkMode: "🌙 Tamni način", lightMode: "☀️ Svijetli način",
    options: "Postavke", language: "Jezik", english: "Engleski", croatian: "Hrvatski",
    home: "Početna", logout: "Odjava", signedInAs: "Prijavljen kao",
    quizChallenge: "Kviz izazov", chooseWhat: "Odaberite što želite raditi",
    startQuiz: "Pokreni kviz", quizDescription: "10 pitanja · 3 života · višestruki odabir",
    leaderboard: "Ljestvica", leaderboardDescription: "Pogledajte najbolje rezultate",
    myProfile: "Moj profil", profileDescription: "Osobni rezultat i povijest kvizova",
    question: "Pitanje", submitAnswer: "Pošalji odgovor", nextQuestion: "Sljedeće pitanje",
    seeResults: "Rezultati", quizFinished: "Kviz je završen",
    correctAnswers: "Točni odgovori:", remainingLives: "Preostali životi:",
    totalScore: "Ukupni rezultat:", playAgain: "Igraj ponovno",
    viewLeaderboard: "Pogledaj ljestvicu", backHome: "Natrag na početnu",
    topPlayers: "Najbolji igrači prema rezultatu", yourPosition: "Vaša pozicija",
    startQuizButton: "Pokreni kviz", loading: "Učitavanje...", noScores: "Još nema rezultata",
    failedLeaderboard: "Ljestvicu nije moguće učitati", you: "(vi)", noScoreYet: "Još nema rezultata",
    correct: "Točno!", wrong: "Netočno!"
  }
};

function getLanguage() {
  return localStorage.getItem("language") || "en";
}

function t(key) {
  return (translations[getLanguage()] && translations[getLanguage()][key]) ||
    translations.en[key] || key;
}

function setLanguage(language) {
  if (language !== "en" && language !== "hr") language = "en";
  localStorage.setItem("language", language);
  applyLanguage();
}

function applyLanguage() {
  document.documentElement.lang = getLanguage();

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.textContent = t(element.getAttribute("data-i18n"));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
    element.placeholder = t(element.getAttribute("data-i18n-placeholder"));
  });

  var toggle = document.getElementById("dark-mode-toggle");
  if (toggle) {
    toggle.textContent = document.body.classList.contains("dark-mode")
      ? t("lightMode") : t("darkMode");
  }

  if (typeof updateQuizLanguage === "function") updateQuizLanguage();
}

function applyDarkMode() {
  var isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDark);

  var toggle = document.getElementById("dark-mode-toggle");
  if (toggle) toggle.textContent = isDark ? t("lightMode") : t("darkMode");
}

function setupDarkMode() {
  var toggle = document.getElementById("dark-mode-toggle");
  if (!toggle) return;

  applyDarkMode();

  if (toggle.dataset.darkModeReady === "true") return;
  toggle.dataset.darkModeReady = "true";

  toggle.addEventListener("click", function () {
    var isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", String(!isDark));
    applyDarkMode();
  });
}

function setupLanguage() {
  var select = document.getElementById("language-select");
  if (!select) return;

  select.value = getLanguage();

  if (select.dataset.languageReady === "true") return;
  select.dataset.languageReady = "true";

  select.addEventListener("change", function () {
    setLanguage(select.value);
  });
}

function setupSiteSettings() {
  applyDarkMode();
  applyLanguage();
  setupDarkMode();
  setupLanguage();
}
