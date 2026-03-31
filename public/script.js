/* ---------------- AUTH ---------------- */

const role = localStorage.getItem("role");

if (!role) {
  window.location.href = "/login.html";
}

document.getElementById("roleDisplay").innerText = "Role: " + role;

/* ---------------- MAP SETUP ---------------- */

const map = document.getElementById("map");

const positions = {
  ICU: { x: 70, y: 20 },
  ER: { x: 20, y: 30 },
  Storage: { x: 70, y: 70 }
};

/* ---------------- COLOR SYSTEM ---------------- */

function getColor(name) {
  const lower = name.toLowerCase();

  if (lower.includes("pump")) return "blue";
  if (lower.includes("vent")) return "red";
  if (lower.includes("monitor")) return "green";

  return "gray";
}

/* ---------------- LOAD ASSETS (NO OVERLAP FIX) ---------------- */

async function loadAssets() {
  const res = await fetch('/assets');
  const data = await res.json();

  map.innerHTML = "";

  // 🔥 GROUP BY ZONE
  const zoneGroups = {};

  data.forEach(asset => {
    if (!zoneGroups[asset.zone]) {
      zoneGroups[asset.zone] = [];
    }
    zoneGroups[asset.zone].push(asset);
  });

  // 🔥 RENDER EACH ZONE
  Object.keys(zoneGroups).forEach(zone => {
    const assets = zoneGroups[zone];

    assets.forEach((asset, index) => {

      const base = positions[zone];

      // 🔥 OFFSET GRID (prevents overlap)
      const offsetX = (index % 3) * 5 - 5;
      const offsetY = Math.floor(index / 3) * 5;

      const div = document.createElement("div");

      div.style.left = (base.x + offsetX) + "%";
      div.style.top = (base.y + offsetY) + "%";

      const color = getColor(asset.name);

      /* ---------------- RBAC DISPLAY ---------------- */

      if (role === "nurse") {
        div.innerHTML = `
          <div style="background:${color};color:white;padding:5px;border-radius:5px;">
            ${asset.name}
          </div>
        `;
      }

      if (role === "engineer" || role === "admin") {
        div.innerHTML = `
          <div style="background:${color};color:white;padding:5px;border-radius:5px;">
            ${asset.name}<br>
            ${asset.zone}<br>
            ${asset.time}
          </div>
        `;
      }

      map.appendChild(div);
    });
  });

  /* ---------------- ANALYTICS ---------------- */

  if (role !== "nurse") {
    showChart(data);
  }
}

/* ---------------- CHART (ENGINEER + ADMIN) ---------------- */

let chartInstance = null;

function showChart(data) {
  const counts = {};

  data.forEach(a => {
    counts[a.zone] = (counts[a.zone] || 0) + 1;
  });

  const ctx = document.getElementById("chart");

  if (!ctx) return;

  // 🔥 DESTROY OLD CHART (prevents stacking bug)
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Assets per Zone',
        data: Object.values(counts)
      }]
    }
  });
}

/* ---------------- ADMIN HISTORY ---------------- */

async function loadHistory() {
  if (role !== "admin") return;

  document.getElementById("adminPanel").style.display = "block";

  const res = await fetch('/history');
  const data = await res.json();

  const div = document.getElementById("history");

  div.innerHTML = "<h3>Recent Activity</h3>";

  data.slice(-10).forEach(item => {
    div.innerHTML += `
      <p>${item.name} → ${item.zone} (${item.time})</p>
    `;
  });
}

/* ---------------- RESET SYSTEM ---------------- */

function resetSystem() {
  fetch('/reset').then(() => {
    alert("System reset");
    loadAssets();
    loadHistory();
  });
}

/* ---------------- SEARCH ---------------- */

function searchAsset() {
  const query = document.getElementById("search").value.toLowerCase();

  document.querySelectorAll("#map div").forEach(el => {
    if (el.innerText.toLowerCase().includes(query)) {
      el.style.border = "3px solid yellow";
    } else {
      el.style.border = "none";
    }
  });
}

/* ---------------- LOGOUT ---------------- */

function logout() {
  localStorage.removeItem("role");
  window.location.href = "/login.html";
}

/* ---------------- AUTO REFRESH ---------------- */

setInterval(() => {
  loadAssets();
  loadHistory();
}, 2000);

/* ---------------- INIT ---------------- */

loadAssets();
loadHistory();
