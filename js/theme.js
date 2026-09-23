// ==============================
// THEME SYSTEM
// ==============================

const THEMES = ["blue", "violet", "red", "orange", "teal"];

function getTheme() {
    const checked = document.querySelector('input[name="theme-select"]:checked');
    if (checked && THEMES.includes(checked.value)) {
        return checked.value;
    }
    return localStorage.getItem("theme") || "blue";
}

function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = "blue";

    // Save preference
    localStorage.setItem("theme", theme);

    // Sync radio buttons
    document.querySelectorAll('input[name="theme-select"]').forEach(radio => {
        radio.checked = radio.value === theme;
    });
}

function setupTheme() {
    const theme = localStorage.getItem("theme") || "blue";
    applyTheme(theme);   // always apply what’s saved

    // then attach the radio listeners if they exist
    document.querySelectorAll('input[name="theme-select"]').forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.checked) applyTheme(radio.value);
        });
    });

    // Find every element that should be themed
    const themedElements = document.querySelectorAll(".themed");

    themedElements.forEach(el => {
        // Remove any previous apply-theme-* classes
        THEMES.forEach(t => el.classList.remove(`apply-theme-${t}`));

        // Add the new one
        el.classList.add(`apply-theme-${theme}`);
    });
}

