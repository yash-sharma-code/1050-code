function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("LOGIN CLICKED"); // 👈 IMPORTANT

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
      localStorage.setItem("loggedIn", "true");
      window.location.href = "/index.html";
    } else {
      alert("Wrong login");
    }
  })
  .catch(err => {
    console.error("ERROR:", err);
  });
}
