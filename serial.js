const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

// 🔥 CHANGE THIS
const port = new SerialPort({
  path: 'COM3',
  baudRate: 115200
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));


const SERVER = "https://your-app.onrender.com/scan";

parser.on('data', async (line) => {
  console.log("ESP32:", line);

  const [name, zone] = line.trim().split(",");

  if (!name || !zone) return;

  try {
    await axios.post(SERVER, {
      name,
      zone,
      reader: zone + "_READER"
    });

    console.log("Sent to Render ✅");
  } catch (err) {
    console.error("Error:", err.message);
  }
});
