/* ---------------- AUTH ---------------- */

const role = localStorage.getItem("role");

if (!role) {
  window.location.href = "/login.html";
}

document.getElementById("roleDisplay").innerText = "Role: " + role;

/* ---------------- ZONES ---------------- */

const map = document.getElementById("map");

const positions = {
  ICU: { x: 70, y: 20 },
  ER: { x: 20, y: 30 },
  Storage: { x: 70, y: 70 }
};

/* ---------------- LOAD ASSETS ---------------- */

async function loadAssets() {
  const res = await fetch('/assets');
  const data = await res.json();

  map.innerHTML = "";

  data.forEach(asset => {

    const div = document.createElement("div");

    div.style.position = "absolute";
    div.style.left = positions[asset.zone].x + "%";
    div.style.top = positions[asset.zone].y + "%";
    div.style.transform = "translate(-50%, -50%)";

    // 🔥 ROLE DISPLAY
    if (role === "nurse") {
      div.innerHTML = `
        <div style="background:blue;color:white;padding:5px;border-radius:5px;">
          ${asset.name}
        </div>
      `;
    }

    if (role === "engineer") {
      div.innerHTML = `
        <div style="background:orange;color:white;padding:5px;border-radius:5px;">
          ${asset.name}<br>
          ${asset.zone}<br>
          ${asset.time}
        </div>
      `;
    }

    if (role === "admin") {
      div.innerHTML = `
        <div style="background:red;color:white;padding:5px;border-radius:5px;">
          ${asset.name}<br>
          ${asset.zone}<br>
          ${asset.time}
        </div>
      `;
    }

    map.appendChild(div);
  });

  showAnalytics(data);
}

/* ---------------- ANALYTICS ---------------- */

function showAnalytics(data) {
  const analyticsDiv = document.getElementById("analytics");

  if (role === "engineer" || role === "admin") {

    let total = data.length;

    let zones = {};
    data.forEach(a => {
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
}

/* ---------------- HISTORY (ADMIN ONLY) ---------------- */

async function loadHistory() {
  if (role !== "admin") return;

  document.getElementById("adminPanel").style.display = "block";

  const res = await fetch('/history');
  const data = await res.json();

  const div = document.getElementById("history");
  div.innerHTML = "<h3>History</h3>";

  data.slice(-10).forEach(item => {
    div.innerHTML += `<p>${item.name} → ${item.zone} (${item.time})</p>`;
  });
}

/* ---------------- RESET (ADMIN ONLY) ---------------- */

function resetSystem() {
  fetch('/reset')
    .then(() => {
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

loadAssets();
loadHistory();
