
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* USERS */

const users = {
  nurse: { password: "123", role: "nurse" },
  engineer: { password: "123", role: "engineer" },
  admin: { password: "123", role: "admin" }
};

/* LOGIN */

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    res.json({ success: true, role: users[username].role });
  } else {
    res.json({ success: false });
  }
});

/* DATA */

let assets = {};
let history = [];

/* SCAN */

app.post('/scan', (req, res) => {
  const { name, zone, reader } = req.body;

  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const status = Math.random() > 0.5 ? "Available" : "In Use";

  const asset = { name, zone, reader, time, status };

  assets[name] = asset;
  history.push(asset);

  console.log("SCAN:", name, "→", zone);

  res.sendStatus(200);
});

/* ROUTES */

app.get('/assets', (req, res) => {
  res.json(Object.values(assets));
});

app.get('/history', (req, res) => {
  res.json(history);
});

app.get('/reset', (req, res) => {
  assets = {};
  history = [];
  res.json({ success: true });
});

/* START */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
