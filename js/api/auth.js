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
