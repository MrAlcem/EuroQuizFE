const API_BASE_URL = "http://localhost:8000";

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie() {
    await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
    });
}

async function apiFetch(path, options = {}) {
    const method = (options.method || "GET").toUpperCase();

    if (method !== "GET" && method !== "HEAD") {
        await ensureCsrfCookie();
    }

    const headers = {
        Accept: "application/json",
        ...options.headers,
    };

    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    if (method !== "GET" && method !== "HEAD") {
        const token = getCookie("XSRF-TOKEN");
        if (token) {
            headers["X-XSRF-TOKEN"] = token;
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
    });

    if (response.status === 401) {
        window.location.href = "login.html";
        throw new Error("Not authenticated");
    }

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `Request to ${path} failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
