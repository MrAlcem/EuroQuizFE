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
    return getCurrentRole() === "admin";
}

function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = "../screens/login.html";
        return;
    }
    if (!isAdmin()) {
        window.location.href = "../screens/Index.html";
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
        window.location.href = "../screens/login.html";
    }
}

function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = "../screens/Index.html";
    }
}

function saveSession(data) {
    // data: { token, userId, username, email, role }
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
    window.location.href = "../screens/Login.html";
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