async function setupMfa() {
    var response = await authFetch(API_BASE + "/mfa/setup", {
        method: "POST",
        body: JSON.stringify({})
    });
    var data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to start MFA setup");
    return data;
}

async function verifyMfaSetup(code) {
    var response = await authFetch(API_BASE + "/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ code: code })
    });
    var data = await response.json();
    if (!response.ok) {
        var firstError = data.errors && Object.values(data.errors)[0];
        throw new Error((firstError && firstError[0]) || data.message || "Invalid MFA code");
    }
    return data;
}
