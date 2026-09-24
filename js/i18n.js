// ==============================
// INTERNATIONALIZATION (i18n)
// ==============================

var translations = {
    en: {
        darkMode: "Dark Mode", lightMode: "Light Mode",
        options: "Options", language: "Language", english: "English", croatian: "Croatian", swedish: "Swedish", dutch: "Dutch",
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
        correct: "Correct!", wrong: "Wrong!", quizHistory: "Quiz History", bestScore: "Best score:",
        failedProfile: "Failed to load profile", theme: "Theme color", dailyQuiz: "Daily Challenge",
        dailyQuizDescription: "One challenge per day · earn XP", category: "Any category",
        cat1: "Geography", cat2: "Nature", cat3: "History", cat4: "Culture", country: "Any country",
        ctry1: "Croatia", ctry2: "Netherlands", ctry3: "Sweden", time: "Time", historyDesc: "Click a quiz to review your answers.",
        adminPanel: "Admin Panel",
        dailyAlreadyPlayed: "You've already played today's Daily Challenge.", dailyResetsAt: "Next one unlocks at"
    },
    hr: {
        darkMode: "Tamni način", lightMode: "Svijetli način",
        options: "Postavke", language: "Jezik", english: "Engleski", croatian: "Hrvatski", swedish: "Švedski", dutch: "Nizozemski",
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
        correct: "Točno!", wrong: "Netočno!", quizHistory: "Povjest Kvizova", bestScore: "Najbolji rezultat:",
        failedProfile: "Profil nije moguće učitati", theme: "Boja teme", dailyQuiz: "Dnevni izazov",
        dailyQuizDescription: "Jedan izazov dnevno · zaradi XP", category: "Bilo koja kategorija",
        cat1: "Geografija", cat2: "Priroda", cat3: "Povijest", cat4: "Kultura", country: "Bilo koja zemlja",
        ctry1: "Hrvatska", ctry2: "Nizozemska", ctry3: "Švedska", time: "Vrijeme", historyDesc: "Kliknite na kviz da pregledate svoje odgovore.",
        adminPanel: "Administratorska ploča",
        dailyAlreadyPlayed: "Već ste odigrali današnji Dnevni izazov.", dailyResetsAt: "Sljedeći izazov dostupan je u"
    },
    nl: {
        darkMode: "Donkere modus", lightMode: "Lichte modus",
        options: "Opties", language: "Taal", english: "Engels", croatian: "Kroatisch", swedish: "Zweeds", dutch: "Nederlands",
        home: "Home", logout: "Uitloggen", signedInAs: "Ingelogd als",
        quizChallenge: "Quiz uitdaging", chooseWhat: "Kies wat je wilt doen",
        startQuiz: "Start quiz", quizDescription: "10 vragen · 3 levens · meerkeuze",
        leaderboard: "Ranglijst", leaderboardDescription: "Bekijk de topspelers op score",
        myProfile: "Mijn profiel", profileDescription: "Persoonlijke score en quizgeschiedenis",
        question: "Vraag", submitAnswer: "Antwoord versturen", nextQuestion: "Volgende vraag",
        seeResults: "Bekijk resultaten", quizFinished: "Quiz afgerond",
        correctAnswers: "Goede antwoorden:", remainingLives: "Resterende levens:",
        totalScore: "Totale score:", playAgain: "Opnieuw spelen",
        viewLeaderboard: "Bekijk ranglijst", backHome: "Terug naar home",
        topPlayers: "Topspelers op score", yourPosition: "Jouw positie",
        startQuizButton: "Start quiz", loading: "Laden...", noScores: "Nog geen scores",
        failedLeaderboard: "Ranglijst laden mislukt", you: "(jij)", noScoreYet: "Nog geen score",
        correct: "Goed!", wrong: "Fout!", quizHistory: "Quizgeschiedenis", bestScore: "Beste score:",
        failedProfile: "Profiel laden mislukt", theme: "Themakleur", dailyQuiz: "Dagelijkse uitdaging",
        dailyQuizDescription: "Eén uitdaging per dag · verdien XP", category: "Elke categorie",
        cat1: "Geografie", cat2: "Natuur", cat3: "Geschiedenis", cat4: "Cultuur", country: "Elk land",
        ctry1: "Kroatië", ctry2: "Nederland", ctry3: "Zweden", time: "Tijd", historyDesc: "Klik op een quiz om je antwoorden te bekijken.",
        adminPanel: "Beheerderspaneel",
        dailyAlreadyPlayed: "Je hebt de Dagelijkse uitdaging van vandaag al gespeeld.", dailyResetsAt: "Volgende uitdaging ontgrendelt om"
    },
    se: {
        darkMode: "Mörkt läge", lightMode: "Ljust läge",
        options: "Alternativ", language: "Språk", english: "Engelska", croatian: "Kroatiska", swedish: "Svenska", dutch: "Nederländska",
        home: "Hem", logout: "Logga ut", signedInAs: "Inloggad som",
        quizChallenge: "Quizutmaning", chooseWhat: "Välj vad du vill göra",
        startQuiz: "Starta quiz", quizDescription: "10 frågor · 3 liv · flerval",
        leaderboard: "Topplista", leaderboardDescription: "Se de bästa spelarna efter poäng",
        myProfile: "Min profil", profileDescription: "Personlig poäng och quizhistorik",
        question: "Fråga", submitAnswer: "Skicka svar", nextQuestion: "Nästa fråga",
        seeResults: "Se resultat", quizFinished: "Quiz avslutat",
        correctAnswers: "Rätta svar:", remainingLives: "Återstående liv:",
        totalScore: "Totalpoäng:", playAgain: "Spela igen",
        viewLeaderboard: "Visa topplista", backHome: "Tillbaka till startsidan",
        topPlayers: "Toppspelare efter poäng", yourPosition: "Din placering",
        startQuizButton: "Starta quiz", loading: "Laddar...", noScores: "Inga poäng ännu",
        failedLeaderboard: "Kunde inte ladda topplistan", you: "(du)", noScoreYet: "Ingen poäng ännu",
        correct: "Rätt!", wrong: "Fel!", quizHistory: "Quizhistorik", bestScore: "Bästa poäng:",
        failedProfile: "Kunde inte ladda profilen", theme: "Temafärg", dailyQuiz: "Daglig utmaning",
        dailyQuizDescription: "En utmaning per dag · tjäna XP", category: "Valfri kategori",
        cat1: "Geografi", cat2: "Natur", cat3: "Historia", cat4: "Kultur", country: "Valfritt land",
        ctry1: "Kroatien", ctry2: "Nederländerna", ctry3: "Sverige", time: "Tid", historyDesc: "Klicka på ett quiz för att granska dina svar.",
        adminPanel: "Adminpanel",
        dailyAlreadyPlayed: "Du har redan spelat dagens Dagliga utmaning.", dailyResetsAt: "Nästa utmaning låses upp"
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
    if (language !== "en" && language !== "hr" && language !== "nl" && language !== "se") language = "en";
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