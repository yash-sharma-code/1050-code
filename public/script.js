const role = localStorage.getItem("role");

if (!role) {
  window.location.href = "/login.html";
}

document.getElementById("roleDisplay").innerText = "Role: " + role;

const map = document.getElementById("map");

/* ---------------- ZONES ---------------- */

const positions = {
  ICU: { x: 70, y: 20 },
  ER: { x: 20, y: 30 },
  Storage: { x: 70, y: 70 }
};

/* ---------------- COLORS ---------------- */

function getColor(name) {
  const n = name.toLowerCase();

  if (n.includes("pump")) return "blue";
  if (n.includes("vent")) return "red";
  if (n.includes("monitor")) return "green";
  return "gray";
}

function getStatusColor(status) {
  return status === "In Use" ? "orange" : "lime";
}

/* ---------------- LOAD ASSETS ---------------- */

async function loadAssets() {
  const res = await fetch('/assets');
  const data = await res.json();

  map.innerHTML = "";

  const zoneGroups = {};

  data.forEach(asset => {
    if (!zoneGroups[asset.zone]) zoneGroups[asset.zone] = [];
    zoneGroups[asset.zone].push(asset);
  });

  Object.keys(zoneGroups).forEach(zone => {
    const assets = zoneGroups[zone];

    assets.forEach((asset, index) => {

      const base = positions[zone];

      const offsetX = (index % 3) * 5 - 5;
      const offsetY = Math.floor(index / 3) * 5;

      const div = document.createElement("div");

      div.style.left = (base.x + offsetX) + "%";
      div.style.top = (base.y + offsetY) + "%";

      const color = getColor(asset.name);
      const statusColor = getStatusColor(asset.status);

      if (role === "nurse") {
        div.innerHTML = `
          <div style="background:${color};color:white;padding:6px;border-radius:6px;">
            ${asset.name}<br>
            <span style="color:${statusColor};font-size:11px;">
              ● ${asset.status}
            </span>
          </div>
        `;
      }

      if (role === "engineer" || role === "admin") {
        div.innerHTML = `
          <div style="background:${color};color:white;padding:6px;border-radius:6px;">
            ${asset.name}<br>
            ${asset.zone}<br>
            ${asset.time}<br>
            <span style="color:${statusColor};font-size:11px;">
              ● ${asset.status}
            </span>
          </div>
        `;
      }

      map.appendChild(div);
    });
  });

  if (role !== "nurse") {
    showChart(data);
  }
}

/* ---------------- CHART ---------------- */

let chartInstance = null;

function showChart(data) {
  const counts = {};

  data.forEach(a => {
    counts[a.name] = (counts[a.name] || 0) + 1;
  });

  const ctx = document.getElementById("chart");

  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Assets by Type',
        data: Object.values(counts)
      }]
    }
  });
}

/* ---------------- HISTORY ---------------- */

async function loadHistory() {
  if (role !== "admin") return;

  document.getElementById("adminPanel").style.display = "block";

  const res = await fetch('/history');
  const data = await res.json();

  const div = document.getElementById("history");

  div.innerHTML = "<h3>Recent Activity</h3>";

  data.slice(-10).forEach(item => {
    div.innerHTML += `<p>${item.name} → ${item.zone} (${item.time})</p>`;
  });
}

/* ---------------- RESET ---------------- */

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
    el.style.border = el.innerText.toLowerCase().includes(query)
      ? "3px solid yellow"
      : "none";
  });
}

/* ---------------- LOGOUT ---------------- */

function logout() {
  localStorage.removeItem("role");
  window.location.href = "/login.html";
}

/* ---------------- REFRESH (1 SECOND) ---------------- */

setInterval(() => {
  loadAssets();
  loadHistory();
}, 1000);

loadAssets();
loadHistory();
