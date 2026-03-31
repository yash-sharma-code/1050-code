const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

/* ---------------- CONFIG ---------------- */

// 🔥 Cross-platform port (Mac or Windows)
const PORT = process.env.SERIAL_PORT || 'COM3';

const port = new SerialPort({
path: PORT,
baudRate: 115200
});

// 🔥 YOUR ACTUAL RENDER URL
const SERVER = "https://rfid-tracker-4rrm.onrender.com/scan";

/* ---------------- PARSER ---------------- */

const parser = port.pipe(new Readline({ delimiter: '\n' }));

let currentZone = "";
let currentAsset = "";

parser.on('data', async (line) => {

line = line.trim();
console.log("ESP32:", line);

// -------- ZONE --------
if (line.startsWith("Zone:")) {
currentZone = line.replace("Zone:", "").trim();

if (currentZone.includes("ICU")) currentZone = "ICU";
else if (currentZone.includes("ER")) currentZone = "ER";
else if (currentZone.includes("Storage")) currentZone = "Storage";
}

// -------- ASSET --------
if (line.startsWith("Asset:")) {
currentAsset = line.replace("Asset:", "").trim();
}

// -------- SEND --------
if (currentZone && currentAsset) {
try {
await axios.post(SERVER, {
name: currentAsset,
zone: currentZone,
reader: currentZone + "_READER"
});

console.log("✅ Sent:", currentAsset, "→", currentZone);

} catch (err) {
console.error("❌ Error:", err.message);
}

currentZone = "";
currentAsset = "";
}
});

/* ---------------- STATUS ---------------- */

port.on('open', () => {
console.log("✅ Serial connected on", PORT);
});

port.on('error', (err) => {
console.error("❌ Serial error:", err.message);
});
