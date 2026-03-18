const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* ---------------- USERS ---------------- */
const users = {
  nurse: { password: "1234", role: "nurse" },
  engineer: { password: "1234", role: "engineer" }
};

let currentRole = null;

/* ---------------- LOGIN ---------------- */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    currentRole = users[username].role;

    res.json({
      success: true,
      role: currentRole
    });
  } else {
    res.json({ success: false });
  }
});

app.get('/check-auth', (req, res) => {
  res.json({
    loggedIn: currentRole !== null,
    role: currentRole
  });
});

app.get('/logout', (req, res) => {
  currentRole = null;
  res.json({ success: true });
});

/* ---------------- DATA ---------------- */
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
