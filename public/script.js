// ✅ CHECK LOGIN FROM SERVER (NO localStorage)
fetch('/check-auth')
  .then(res => res.json())
  .then(data => {
    if (!data.loggedIn) {
      window.location.href = "/login.html";
    } else {
      startApp();
    }
  });

function startApp() {
  loadData();
  loadHistory();

  setInterval(() => {
    loadData();
    loadHistory();
  }, 2000);
}

/* ---------------- ZONES ---------------- */
const zonePositions = {
  ICU: { x: 75, y: 25 },
  ER: { x: 30, y: 30 },
  Storage: { x: 65, y: 70 }
};

function loadData() {
  fetch('/data')
    .then(res => res.json())
    .then(data => {
      document.getElementById("data").innerText =
        `${data.name} in ${data.zone} (${data.time})`;

      moveDot(data.zone);
    });
}

function loadHistory() {
  fetch('/history')
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("history");
      div.innerHTML = "";

      data.forEach(item => {
        div.innerHTML += `<p>${item.name} → ${item.zone}</p>`;
      });
    });
}

function moveDot(zone) {
  const dot = document.getElementById("dot");

  if (zonePositions[zone]) {
    dot.style.left = zonePositions[zone].x + "%";
    dot.style.top = zonePositions[zone].y + "%";
  }
}

/* ---------------- LOGOUT ---------------- */
function logout() {
  fetch('/logout').then(() => {
    window.location.href = "/login.html";
  });
}
