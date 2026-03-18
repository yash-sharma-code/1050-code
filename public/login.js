function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("LOGIN CLICKED");

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log("RESPONSE:", data);

    if (data.success === true) {
      // ✅ store login state
      localStorage.setItem("loggedIn", "true");

      console.log("Saved login:", localStorage.getItem("loggedIn"));

      // ✅ small delay to ensure storage is saved
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 100);

    } else {
      alert("Wrong username or password");
    }
  })
  .catch(err => {
    console.error("LOGIN ERROR:", err);
    alert("Login failed");
  });
}
