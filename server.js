const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* ---------------- LOGIN SYSTEM ---------------- */
let isLoggedIn = false;

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    isLoggedIn = true;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get('/check-auth', (req, res) => {
  res.json({ loggedIn: isLoggedIn });
});

app.get('/logout', (req, res) => {
  isLoggedIn = false;
  res.json({ success: true });
});

/* ---------------- ASSET STORAGE ---------------- */
let assets = {};
let history = [];

app.post('/scan', (req, res) => {
  const { name, zone, reader } = req.body;

  const time = new Date().toLocaleTimeString();

  assets[name] = { name, zone, reader, time };
  history.unshift({ name, zone, time });

  res.json({ success: true });
});

app.get('/data', (req, res) => res.json(assets));
app.get('/history', (req, res) => res.json(history));

/* ---------------- START ---------------- */
app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port", PORT);
});
