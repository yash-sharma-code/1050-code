fetch('/check-auth')
  .then(res => res.json())
  .then(data => {
    if (!data.loggedIn) {
      window.location.href = "/login.html";
    } else {
      startApp();
    }
  });

let currentAssets = {};

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

/* ---------------- COLORS ---------------- */
function getColor(name) {
  name = name.toLowerCase();

  if (name.includes("pump")) return "#007bff";
  if (name.includes("wheelchair")) return "#28a745";
  if (name.includes("ultrasound")) return "#ffc107";

  return "#6c757d";
}

/* ---------------- LOAD DATA ---------------- */
function loadData() {
  fetch('/data')
    .then(res => res.json())
    .then(data => {
      currentAssets = data;
      renderAssets(data);
    });
}

/* ---------------- RENDER ---------------- */
function renderAssets(assets) {
  const container = document.getElementById("map-assets");
  container.innerHTML = "";

  Object.values(assets).forEach(asset => {

    if (!zonePositions[asset.zone]) return;

    const div = document.createElement("div");
    div.className = "asset";

    div.innerText = asset.name;
    div.title = `Last seen: ${asset.time}`; // 🔥 hover info

    div.style.left = zonePositions[asset.zone].x + "%";
    div.style.top = zonePositions[asset.zone].y + "%";
    div.style.background = getColor(asset.name);

    container.appendChild(div);
  });
}

/* ---------------- SEARCH ---------------- */
function searchAsset() {
  const query = document.getElementById("search").value.toLowerCase();

  document.querySelectorAll(".asset").forEach(el => {
    if (el.innerText.toLowerCase().includes(query)) {
      el.style.border = "3px solid red";
    } else {
      el.style.border = "none";
    }
  });
}

/* ---------------- HISTORY ---------------- */
function loadHistory() {
  fetch('/history')
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("history");
      div.innerHTML = "";

      data.slice(0, 10).forEach(item => {
        div.innerHTML += `<p>${item.name} → ${item.zone}</p>`;
      });
    });
}

/* ---------------- LOGOUT ---------------- */
function logout() {
  fetch('/logout').then(() => {
    window.location.href = "/login.html";
  });
}
