function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("Trying login...");

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Server response:", data);

    if (data.success === true) {
      localStorage.setItem("loggedIn", "true");

      console.log("Login success → redirecting");

      window.location.href = "/index.html";
    } else {
      alert("Wrong username or password");
    }
  })
  .catch(err => {
    console.error("LOGIN ERROR:", err);
    alert("Login failed (check console)");
  });
}
