const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 🔥 SERVES FRONTEND

/* ---------------- LOGIN ---------------- */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

/* ---------------- DATA STORAGE ---------------- */
let latestScan = {
  name: "No asset",
  zone: "None",
  reader: "None",
  time: "-"
};

let history = [];

/* ---------------- RECEIVE SCAN ---------------- */
app.post('/scan', (req, res) => {
  const { name, zone, reader } = req.body;

  const time = new Date().toLocaleTimeString();

  latestScan = { name, zone, reader, time };

  history.unshift(latestScan);

  console.log("SCAN:", latestScan);

  res.json({ success: true });
});

/* ---------------- GET CURRENT ---------------- */
app.get('/data', (req, res) => {
  res.json(latestScan);
});

/* ---------------- GET HISTORY ---------------- */
app.get('/history', (req, res) => {
  res.json(history);
});

/* ---------------- AI ---------------- */
app.post('/ask-ai', async (req, res) => {
  res.json({ answer: "AI coming soon (works locally only)" });
});

/* ---------------- START ---------------- */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
