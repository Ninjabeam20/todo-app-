const AUTH_API = "http://localhost:5000/api/auth";

// Toggle between signup and login forms
document.getElementById("toggleForm").addEventListener("click", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const formTitle = document.getElementById("formTitle");
    const toggler = document.getElementById("toggleForm");

    const signupVisible = !signupForm.classList.contains("d-none");
    signupForm.classList.toggle("d-none");
    loginForm.classList.toggle("d-none");
    formTitle.textContent = signupVisible ? "Login" : "Sign Up";
    toggler.textContent = signupVisible ? "Need an account? Sign Up" : "Already have an account? Login";
});

// Handle signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    if (!username || !password) return alert("Please enter username and password");
    await signupUser({ username, password });
});

// Handle login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!username || !password) return alert("Please enter username and password");
    await loginUser({ username, password });
});

async function signupUser(payload) {
    try {
        const res = await fetch(`${AUTH_API}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Signup failed");
        alert("Signup successful. You can now log in.");
        document.getElementById("toggleForm").click();
    } catch (err) {
        alert(err.message);
    }
}

async function loginUser(payload) {
    try {
        const res = await fetch(`${AUTH_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        if (data && data.id) {
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username || "");
        }
        window.location.href = "index.html";
    } catch (err) {
        alert(err.message);
    }
}

