<!DOCTYPE html>
<html>
<head>
  <title>Hospital Asset Tracking</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

<h1>Hospital Asset Tracking</h1>

<button onclick="logout()">Logout</button>

<h2>Search</h2>
<input id="search" placeholder="Search asset">

<h2>Floor Map</h2>

<div class="map-container">
  <img src="floor.png" class="map">

  <!-- 🔴 MOVING DOT -->
  <div id="dot" class="dot"></div>
</div>

<h2>Current</h2>
<p id="data">Loading...</p>

<h2>History</h2>
<div id="history"></div>

<h2>Ask AI</h2>
<input id="question">
<button onclick="askAI()">Ask</button>
<p id="answer"></p>

<script src="script.js"></script>

</body>
</html>
