const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* ---------------- USERS (RBAC) ---------------- */

const users = {
  nurse: { password: "123", role: "nurse" },
  engineer: { password: "123", role: "engineer" },
  admin: { password: "123", role: "admin" }
};

/* ---------------- LOGIN ---------------- */

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    res.json({ success: true, role: users[username].role });
  } else {
    res.json({ success: false });
  }
});

/* ---------------- DATA STORAGE ---------------- */

let assets = {};
let history = [];

/* ---------------- RFID SCAN ENDPOINT ---------------- */

app.post('/scan', (req, res) => {
  const { name, zone, reader } = req.body;

  const time = new Date().toLocaleTimeString();

  // Store latest state
  assets[name] = { name, zone, reader, time };

  // Store history
  history.push({ name, zone, reader, time });

  console.log("SCAN:", name, "→", zone);

  res.sendStatus(200);
});

/* ---------------- GET CURRENT ASSETS ---------------- */

app.get('/assets', (req, res) => {
  res.json(Object.values(assets));
});

/* ---------------- GET HISTORY ---------------- */

app.get('/history', (req, res) => {
  res.json(history);
});

/* ---------------- RESET SYSTEM ---------------- */

app.get('/reset', (req, res) => {
  assets = {};
  history = [];
  console.log("System reset");
  res.json({ success: true });
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
