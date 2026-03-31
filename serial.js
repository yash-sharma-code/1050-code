const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

const PORT = process.env.SERIAL_PORT || 'COM3';
const SERVER = "https://rfid-tracker-4rrm.onrender.com/scan";

const port = new SerialPort({
path: PORT,
baudRate: 115200
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

let currentZone = "";
let currentAsset = "";

parser.on('data', async (line) => {
line = line.trim();
console.log("ESP32:", line);

if (line.startsWith("Zone:")) {
currentZone = line.replace("Zone:", "").trim();

if (currentZone.includes("ICU")) currentZone = "ICU";
else if (currentZone.includes("ER")) currentZone = "ER";
else if (currentZone.includes("Storage")) currentZone = "Storage";
}

if (line.startsWith("Asset:")) {
currentAsset = line.replace("Asset:", "").trim();
}

if (currentZone && currentAsset) {
try {
await axios.post(SERVER, {
name: currentAsset,
zone: currentZone,
reader: currentZone + "_READER"
});

console.log("✅ Sent:", currentAsset, "→", currentZone);
} catch (err) {
console.error("❌ Error sending:", err.message);
}

currentZone = "";
currentAsset = "";
}
});

port.on('open', () => {
console.log("✅ Serial connected on", PORT);
});

port.on('error', (err) => {
console.error("❌ Serial error:", err.message);
});
