// ==============================
// DARK MODE
// ==============================

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