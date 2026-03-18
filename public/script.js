// 🚫 REMOVE AUTO REDIRECT LOOP — only check after page loads

window.onload = () => {
  const loggedIn = localStorage.getItem("loggedIn");

  console.log("Login status:", loggedIn);

  if (loggedIn !== "true") {
    alert("Not logged in");
    window.location.href = "/login.html";
    return;
  }

  // Only load data AFTER login confirmed
  loadData();
  loadHistory();
};

/* ---------------- ZONE POSITIONS ---------------- */
const zonePositions = {
  ICU: { x: 75, y: 25 },
  ER: { x: 30, y: 30 },
  Storage: { x: 65, y: 70 }
};

/* ---------------- LOAD DATA ---------------- */
function loadData() {
  fetch('/data')
    .then(res => res.json())
    .then(data => {
      document.getElementById("data").innerText =
        `${data.name} in ${data.zone} (${data.time})`;

      moveDot(data.zone);
    });
}

/* ---------------- LOAD HISTORY ---------------- */
function loadHistory() {
  fetch('/history')
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("history");
      div.innerHTML = "";

      data.forEach(item => {
        div.innerHTML += `<p>${item.name} → ${item.zone} (${item.time})</p>`;
      });
    });
}

/* ---------------- MOVE DOT ---------------- */
function moveDot(zone) {
  const dot = document.getElementById("dot");

  if (zonePositions[zone]) {
    dot.style.left = zonePositions[zone].x + "%";
    dot.style.top = zonePositions[zone].y + "%";
  }
}

/* ---------------- AI ---------------- */
function askAI() {
  const question = document.getElementById("question").value;

  fetch('/ask-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("answer").innerText = data.answer;
  });
}

/* ---------------- LOGOUT ---------------- */
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "/login.html";
}

/* ---------------- AUTO UPDATE ---------------- */
setInterval(() => {
  loadData();
  loadHistory();
}, 2000);
