const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express(); // 🔥 THIS WAS MISSING

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store latest scan
let latestScan = {
  name: "No data",
  zone: "None",
  reader: "None",
  time: "-"
};

// Store history
let history = [];

/* -------- RECEIVE SCAN -------- */
app.post('/scan', (req, res) => {
  const { name, zone, reader } = req.body;

  const time = new Date().toLocaleTimeString();

  latestScan = { name, zone, reader, time };

  history.unshift(latestScan);

  console.log("SCAN:", latestScan);

  res.json({ success: true });
});

/* -------- GET CURRENT -------- */
app.get('/data', (req, res) => {
  res.json(latestScan);
});

/* -------- GET HISTORY -------- */
app.get('/history', (req, res) => {
  res.json(history);
});

/* -------- AI ENDPOINT -------- */
app.post('/ask-ai', async (req, res) => {
  const question = req.body.question;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2:3b',
      prompt: `You are a hospital asset assistant.\n\nCurrent asset:\n${JSON.stringify(latestScan)}\n\nQuestion: ${question}`,
      stream: false
    });

    res.json({ answer: response.data.response });

  } catch (err) {
    res.json({ answer: "AI not running yet" });
  }
});

/* -------- START SERVER -------- */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
