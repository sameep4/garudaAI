const attacks = [
  {
    type: "SQL Injection",
    payload: "' OR 1=1 --",
    severity: "High"
  },
  {
    type: "Brute Force",
    attempts: 15,
    severity: "Medium"
  },
  {
    type: "Phishing",
    url: "http://fake-login.com",
    severity: "High"
  },
  {
    type: "Malware Upload",
    file: "virus.exe",
    severity: "High"
  },
  {
    type: "Normal Traffic",
    severity: "Low"
  }
];

function generateAttack() {
  return attacks[Math.floor(Math.random() * attacks.length)];
}

module.exports = { generateAttack };