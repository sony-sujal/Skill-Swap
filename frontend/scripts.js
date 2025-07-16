
const API = "http://localhost:5000/api";
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
const token = localStorage.getItem("token");

// DOM Elements
const userProfile = document.getElementById('userProfile');
const authButtons = document.getElementById('authButtons');
const logoutBtn = document.getElementById('logoutBtn');
const usernameDisplay = document.getElementById('usernameDisplay');

// Update UI based on login state
function updateAuthUI() {
  if (currentUser) {
    authButtons?.classList.add("hidden");
    userProfile?.classList.remove("hidden");
    if (usernameDisplay) usernameDisplay.innerText = currentUser.name || currentUser.email;
  } else {
    authButtons?.classList.remove("hidden");
    userProfile?.classList.add("hidden");
  }
}

// Login function
async function handleLogin(email, password) {
  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      currentUser = data.user;
      updateAuthUI();
      window.location.href = "index.html";
    } else {
      alert(data.msg || "Login failed.");
    }
  } catch (err) {
    alert("Login error.");
  }
}

// Signup function
async function handleSignup(name, email, password) {
  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful! You can now log in.");
      window.location.href = "login.html";
    } else {
      alert(data.msg || "Signup failed.");
    }
  } catch (err) {
    alert("Signup error.");
  }
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  currentUser = null;
  updateAuthUI();
  window.location.href = "index.html";
}

// On load
window.onload = () => {
  updateAuthUI();
  if (logoutBtn) logoutBtn.onclick = logout;
};
