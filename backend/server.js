const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const { generateAttack } = require("./threatEngine");
const { detectThreat } = require("./detector");

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ FIXED SCAN (SAFE VERSION)
app.post("/scan", (req, res) => {
  try {
    const url = req.body?.url;   // 🔥 FIXED SAFETY CHECK

    const response = {
      url: url || "unknown",
      ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      country: ["India", "USA", "China", "Russia"][Math.floor(Math.random()*4)],
      threatType: ["Phishing", "XSS", "SQL Injection", "Safe"][Math.floor(Math.random()*4)],
      risk: ["Low", "Medium", "High"][Math.floor(Math.random()*3)],
      confidence: `${Math.floor(Math.random()*40) + 60}%`,
      action: ["Allowed", "Blocked"][Math.floor(Math.random()*2)],
      reason: "Simulated analysis result"
    };

    res.json(response);

  } catch (err) {
    console.error("SCAN ERROR:", err);
    res.status(500).json({ error: "Scan failed" });
  }
});

app.get("/simulate-attack", (req, res) => {
  const response = {
    threatType: "Phishing",
    risk: "Medium",
    action: "Allowed",
    confidence: "61%",
    country: "China",
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    reason: "Simulated analysis result",
    url: "google.com"
  };

  res.json(response);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});