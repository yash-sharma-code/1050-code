const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

/* ---------------- CONFIG ---------------- */

// 🔥 CHANGE THIS TO YOUR ESP32 PORT
const port = new SerialPort({
  path: 'COM3',   // ← CHANGE if needed (COM4, COM5, etc.)
  baudRate: 115200
});

// 🔥 CHANGE THIS TO YOUR RENDER BACKEND
const SERVER = "https://your-app.onrender.com/scan";

/* ---------------- SERIAL PARSER ---------------- */

const parser = port.pipe(new Readline({ delimiter: '\n' }));

/* ---------------- TEMP STORAGE ---------------- */

let currentZone = "";
let currentAsset = "";

/* ---------------- LISTEN TO ESP32 ---------------- */

parser.on('data', async (line) => {

  line = line.trim();

  console.log("ESP32:", line);

  /* -------- DETECT ZONE -------- */
  if (line.startsWith("Zone:")) {

    currentZone = line.replace("Zone:", "").trim();

    // 🔥 Normalize zone names to match dashboard
    if (currentZone.includes("ICU")) currentZone = "ICU";
    else if (currentZone.includes("ER")) currentZone = "ER";
    else if (currentZone.includes("Storage")) currentZone = "Storage";
  }

  /* -------- DETECT ASSET -------- */
  if (line.startsWith("Asset:")) {
    currentAsset = line.replace("Asset:", "").trim();
  }

  /* -------- SEND WHEN BOTH READY -------- */
  if (currentZone && currentAsset) {

    try {
      await axios.post(SERVER, {
        name: currentAsset,
        zone: currentZone,
        reader: currentZone + "_READER"
      });

      console.log("✅ Sent to server:", currentAsset, "→", currentZone);

    } catch (error) {
      console.error("❌ Error sending to server:", error.message);
    }

    // 🔄 Reset after sending
    currentZone = "";
    currentAsset = "";
  }

});

/* ---------------- ERROR HANDLING ---------------- */

port.on('open', () => {
  console.log("✅ Serial port opened");
});

port.on('error', (err) => {
  console.error("❌ Serial error:", err.message);
});
