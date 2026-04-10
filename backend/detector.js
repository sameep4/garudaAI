function detectThreat(attack) {
  let result = {
    detected: true,
    risk: "Low",
    action: "Allowed",
    reason: ""
  };

  switch (attack.type) {
    case "SQL Injection":
      result.risk = "High";
      result.action = "Blocked";
      result.reason = "Malicious SQL pattern detected";
      break;

    case "Brute Force":
      result.risk = "Medium";
      result.action = attack.attempts > 10 ? "Blocked" : "Monitored";
      result.reason = "Multiple login attempts detected";
      break;

    case "Phishing":
      result.risk = "High";
      result.action = "Blocked";
      result.reason = "Suspicious URL detected";
      break;

    case "Malware Upload":
      result.risk = "High";
      result.action = "Quarantined";
      result.reason = "Executable file flagged as malware";
      break;

    case "Normal Traffic":
      result.detected = false;
      result.risk = "Low";
      result.action = "Allowed";
      result.reason = "No threat detected";
      break;
  }

  return result;
}

module.exports = { detectThreat };