const role = localStorage.getItem("role");

if (!role) {
  window.location.href = "/login.html";
}

document.getElementById("roleDisplay").innerText = "Role: " + role;

const map = document.getElementById("map");

/* ---------------- COLORS ---------------- */

function getColor(name) {
  const n = name.toLowerCase();

  if (n.includes("pump")) return "blue";
  if (n.includes("vent")) return "red";
  if (n.includes("monitor")) return "green";

  return "gray";
}

/*  ADD THIS FUNCTION (ONLY NEW ADDITION) */

function formatName(name) {
  const n = name.toLowerCase();

  if (n.includes("bed")) return "Hospital Bed";

  return name;
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

      const base = {
        ICU: { x: 70, y: 20 },
        ER: { x: 20, y: 30 },
        Storage: { x: 70, y: 70 }
      }[zone];

      const offsetX = (index % 3) * 5 - 5;
      const offsetY = Math.floor(index / 3) * 5;

      const div = document.createElement("div");

      div.style.position = "absolute";
      div.style.left = (base.x + offsetX) + "%";
      div.style.top = (base.y + offsetY) + "%";

      const color = getColor(asset.name);
      const statusColor = getStatusColor(asset.status);

      if (role === "nurse") {
        div.innerHTML = `
          <div style="background:${color};color:white;padding:6px;border-radius:6px;">
            ${formatName(asset.name)}<br>
            <span style="color:${statusColor};font-size:11px;">
              ● ${asset.status}
            </span>
          </div>
        `;
      }

      if (role === "engineer" || role === "admin") {
        div.innerHTML = `
          <div style="background:${color};color:white;padding:6px;border-radius:6px;">
            ${formatName(asset.name)}<br>
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
}

/* ---------------- REFRESH ---------------- */

setInterval(() => {
  loadAssets();
}, 1000);

loadAssets();
