const role = localStorage.getItem("role");

if (!role) {
  window.location.href = "/login.html";
}

document.getElementById("roleDisplay").innerText = "Role: " + role;

const map = document.getElementById("map");

const positions = {
  ICU: { x: 70, y: 20 },
  ER: { x: 20, y: 30 },
  Storage: { x: 70, y: 70 }
};

/* 🔥 COLOR SYSTEM */
function getColor(name) {
  if (name.toLowerCase().includes("pump")) return "blue";
  if (name.toLowerCase().includes("vent")) return "red";
  return "green";
}

/* LOAD ASSETS */
async function loadAssets() {
  const res = await fetch('/assets');
  const data = await res.json();

  map.innerHTML = "";

  data.forEach(asset => {
    const div = document.createElement("div");

    div.style.left = positions[asset.zone].x + "%";
    div.style.top = positions[asset.zone].y + "%";

    const color = getColor(asset.name);

    if (role === "nurse") {
      div.innerHTML = `<div style="background:${color};color:white;padding:5px;border-radius:5px;">
        ${asset.name}
      </div>`;
    }

    if (role === "engineer" || role === "admin") {
      div.innerHTML = `<div style="background:${color};color:white;padding:5px;border-radius:5px;">
        ${asset.name}<br>${asset.zone}<br>${asset.time}
      </div>`;
    }

    map.appendChild(div);
  });

  if (role !== "nurse") {
    showChart(data);
  }
}

/* 🔥 CHART */
function showChart(data) {
  const counts = {};

  data.forEach(a => {
    counts[a.zone] = (counts[a.zone] || 0) + 1;
  });

  const ctx = document.getElementById("chart");

  new Chart(ctx, {
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

/* ADMIN HISTORY */
async function loadHistory() {
  if (role !== "admin") return;

  document.getElementById("adminPanel").style.display = "block";

  const res = await fetch('/history');
  const data = await res.json();

  const div = document.getElementById("history");
  div.innerHTML = "";

  data.slice(-10).forEach(item => {
    div.innerHTML += `<p>${item.name} → ${item.zone}</p>`;
  });
}

/* RESET */
function resetSystem() {
  fetch('/reset').then(() => location.reload());
}

/* SEARCH */
function searchAsset() {
  const query = document.getElementById("search").value.toLowerCase();

  document.querySelectorAll("#map div").forEach(el => {
    el.style.border = el.innerText.toLowerCase().includes(query)
      ? "3px solid yellow"
      : "none";
  });
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("role");
  window.location.href = "/login.html";
}

/* REFRESH */
setInterval(() => {
  loadAssets();
  loadHistory();
}, 2000);

loadAssets();
loadHistory();
