// ==============================
// AUTH → MyDatabase / API
// ==============================

// Login with JWT
// Backend should return: { success, token, userId, username, email, role }
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
// Backend should return: { success, token, userId, username, email, role }
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