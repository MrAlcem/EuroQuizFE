// ==============================
// API CONFIG
// ==============================

var API_BASE = "http://localhost:8000/api";

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
// AUTH → API
// ==============================

// Login against POST /auth/login.
// Returns { success, token, userId, username, email } on success, or
// { success: false, mfaRequired: true, challengeToken } when 2FA is enabled,
// or { success: false, message } on failure.
async function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, message: "Please fill in all fields" };
  }

  var res;
  try {
    res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });
  } catch (err) {
    return { success: false, message: "Could not reach the server" };
  }

  var data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || "Invalid credentials" };
  }

  if (data.mfa_required) {
    return { success: false, mfaRequired: true, challengeToken: data.challenge_token };
  }

  return {
    success: true,
    token: data.token,
    userId: String(data.user.id),
    username: data.user.name,
    email: data.user.email,
    role: "ROLE_User"
  };
}

// Complete login after an MFA challenge via POST /auth/mfa/verify.
async function verifyMfaCode(challengeToken, code) {
  var res;
  try {
    res = await fetch(API_BASE + "/auth/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_token: challengeToken, code: code })
    });
  } catch (err) {
    return { success: false, message: "Could not reach the server" };
  }

  var data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || "Invalid code" };
  }

  return {
    success: true,
    token: data.token,
    userId: String(data.user.id),
    username: data.user.name,
    email: data.user.email,
    role: "ROLE_User"
  };
}

// Register against POST /auth/register.
// Returns { success, token, userId, username, email } on success, or
// { success: false, message } on failure (e.g. duplicate email).
async function registerUser(name, email, password, passwordConfirmation) {
  if (!name || !email || !password) {
    return { success: false, message: "Please fill in all fields" };
  }
  if (email.indexOf("@") === -1) {
    return { success: false, message: "Please enter a valid email" };
  }

  var res;
  try {
    res = await fetch(API_BASE + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      })
    });
  } catch (err) {
    return { success: false, message: "Could not reach the server" };
  }

  var data = await res.json();

  if (!res.ok) {
    var firstError = data.errors && Object.values(data.errors)[0];
    return { success: false, message: (firstError && firstError[0]) || data.message || "Registration failed" };
  }

  return {
    success: true,
    token: data.token,
    userId: String(data.user.id),
    username: data.user.name,
    email: data.user.email,
    role: "ROLE_User"
  };
}

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
    startQuiz: "Start Quiz", quizDescription: "10 questions · 3 lives",
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
    startQuiz: "Pokreni kviz", quizDescription: "10 pitanja · 3 života",
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
