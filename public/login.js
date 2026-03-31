async function login() {
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

console.log("LOGIN CLICKED");

try {
const res = await fetch('/login', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ username, password })
});

const data = await res.json();

if (data.success) {
// Save role locally (no backend session issues)
localStorage.setItem("role", data.role);

// Redirect to dashboard
window.location.href = "/index.html";
} else {
alert("Invalid username or password");
}

} catch (err) {
console.error("Login error:", err);
alert("Server error");
}
}
