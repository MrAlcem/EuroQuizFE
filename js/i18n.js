// ==============================
// INTERNATIONALIZATION (i18n)
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