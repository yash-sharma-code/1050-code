let userRole = null;
let currentAssets = {};

/* ---------------- AUTH CHECK ---------------- */

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

/* ---------------- START APP ---------------- */

function startApp() {
loadData();
loadHistory();

setInterval(() => {
loadData();
loadHistory();
}, 2000);
}

/* ---------------- ZONE POSITIONS ---------------- */

const zonePositions = {
ICU: { x: 75, y: 25 },
ER: { x: 30, y: 30 },
Storage: { x: 65, y: 70 }
};

/* ---------------- COLOR LOGIC ---------------- */

function getColor(name) {
name = name.toLowerCase();

if (name.includes("pump")) return "#007bff";
if (name.includes("wheelchair")) return "#28a745";
if (name.includes("ultrasound")) return "#ffc107";

return "#6c757d";
}

/* ---------------- LOAD ASSETS ---------------- */

function loadData() {
fetch('/assets') // 🔥 CORRECT ROUTE
.then(res => res.json())
.then(data => {
currentAssets = data;
renderAssets(data);
showAnalytics(data);
})
.catch(err => console.error("Error loading assets:", err));
}

/* ---------------- RENDER ASSETS ---------------- */

function renderAssets(assets) {
const container = document.getElementById("map-assets");
container.innerHTML = "";

assets.forEach(asset => {
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

/* ---------------- ANALYTICS (ENGINEER ONLY) ---------------- */

function showAnalytics(assets) {
const analyticsDiv = document.getElementById("analytics");

if (userRole !== "engineer") {
analyticsDiv.innerHTML = "";
return;
}

let total = assets.length;

let zones = {};
assets.forEach(a => {
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
div.innerHTML += `<p>${item.name} → ${item.zone} (${item.time})</p>`;
});
})
.catch(err => console.error("Error loading history:", err));
}

/* ---------------- LOGOUT ---------------- */

function logout() {
fetch('/logout')
.then(() => {
window.location.href = "/login.html";
});
}
