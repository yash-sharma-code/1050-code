async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Login attempt:", username);

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

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
      // Save role locally (RBAC control)
      localStorage.setItem("role", data.role);

      console.log("Login success, role:", data.role);

      // Redirect to dashboard
      window.location.href = "/index.html";

    } else {
      alert("Invalid username or password");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Server error. Try again.");
  }
}
