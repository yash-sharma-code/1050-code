function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('/login', {   // ✅ IMPORTANT (NO localhost)
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "/index.html"; // ✅ redirect works on Render
    } else {
      alert("Invalid login");
    }
  });
}
