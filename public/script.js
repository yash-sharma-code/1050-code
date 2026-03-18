let userRole = null;
let currentAssets = {};

fetch('/check-auth')
  .then(res => res.json())
  .then(data => {
    if (!data.loggedIn) {
      window.location.href = "/login.html";
    } else {
      userRole = data.role;
      document.getElementById("roleDisplay").innerText = "Role: " + userRole;
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
      showAnalytics(data);
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
    div.title = "Last seen: " + asset.time;

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

/* ---------------- ANALYTICS ---------------- */
function showAnalytics(assets) {
  const analyticsDiv = document.getElementById("analytics");

  if (userRole !== "engineer") {
    analyticsDiv.innerHTML = "";
    return;
  }

  let total = Object.keys(assets).length;

  let zones = {};
  Object.values(assets).forEach(a => {
    zones[a.zone] = (zones[a.zone] || 0) + 1;
  });

  analyticsDiv.innerHTML = `
    <h3>Analytics</h3>
    <p>Total Assets: ${total}</p>
    <p>ICU: ${zones.ICU || 0}</p>
    <p>ER: ${zones.ER || 0}</p>
    <p>Storage: ${zones.Storage || 0}</p>
  `;
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
