// ============================================
// GARUDA AI — SIMULATION UTILITIES
// ============================================

const THREAT_TYPES = [
  'Phishing Campaign',
  'Ransomware Payload',
  'DDoS Flood',
  'SQL Injection Probe',
  'Zero-Day Exploit',
  'Credential Stuffing',
  'Man-in-the-Middle',
  'DNS Spoofing',
  'Brute Force Attack',
  'Trojan Horse Upload',
  'Cryptojacking Script',
  'Cross-Site Scripting',
  'API Abuse Detected',
  'Malware C2 Beacon',
  'Lateral Movement',
  'Data Exfiltration',
  'Supply Chain Attack',
  'Insider Threat Activity',
  'Botnet Communication',
  'Privilege Escalation',
];

const THREAT_SOURCES = [
  '185.220.101.x',
  '45.33.49.x',
  '192.99.71.x',
  '104.248.x.x',
  '23.129.64.x',
  '91.219.236.x',
  '171.25.193.x',
  '209.141.47.x',
  '198.98.56.x',
  '5.199.130.x',
  'darkweb-relay.onion',
  'proxy-east-02.tor',
  'c2-node-gamma.net',
  'botnet-cluster-7.ru',
  'anon-vpn-exit.nl',
];

const REGIONS = [
  'North America', 'Europe', 'East Asia', 'Southeast Asia',
  'Middle East', 'South America', 'Central Asia', 'Africa',
  'Oceania', 'Eastern Europe',
];

const MISINFO_PHRASES = [
  'BREAKING:', 'URGENT:', 'CONFIRMED:', 'LEAKED:', 'EXCLUSIVE:',
  'reportedly', 'sources say', 'unverified reports', 'allegedly',
  'anonymous insider', 'whistleblower claims', 'secret document',
  'coverup exposed', 'shocking revelation', 'they don\'t want you to know',
];

const EVIDENCE_SOURCES = [
  { name: 'Reuters Fact-Check', reliability: 'high', tag: 'verified' },
  { name: 'AP News Wire', reliability: 'high', tag: 'verified' },
  { name: 'Snopes', reliability: 'high', tag: 'fact-check' },
  { name: 'Anonymous Blog', reliability: 'low', tag: 'unverified' },
  { name: 'Social Media Post', reliability: 'low', tag: 'user-generated' },
  { name: 'PolitiFact', reliability: 'high', tag: 'fact-check' },
  { name: 'Unknown Forum', reliability: 'low', tag: 'unverified' },
  { name: 'Academic Journal', reliability: 'high', tag: 'peer-reviewed' },
  { name: 'State Media Outlet', reliability: 'medium', tag: 'bias-risk' },
  { name: 'Telegram Channel', reliability: 'low', tag: 'unverified' },
];

/**
 * Generate a random threat object
 */
export function generateThreat(forceHighSeverity = false) {
  const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
  const source = THREAT_SOURCES[Math.floor(Math.random() * THREAT_SOURCES.length)];
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

  let severity;
  if (forceHighSeverity) {
    severity = Math.random() > 0.3 ? 'critical' : 'high';
  } else {
    const roll = Math.random();
    if (roll < 0.15) severity = 'critical';
    else if (roll < 0.35) severity = 'high';
    else if (roll < 0.65) severity = 'medium';
    else severity = 'low';
  }

  const riskScore = severity === 'critical' ? 85 + Math.floor(Math.random() * 16) :
                    severity === 'high' ? 65 + Math.floor(Math.random() * 20) :
                    severity === 'medium' ? 35 + Math.floor(Math.random() * 30) :
                    5 + Math.floor(Math.random() * 30);

  return {
    id: crypto.randomUUID(),
    type,
    source,
    region,
    severity,
    riskScore,
    timestamp: new Date(),
    status: Math.random() > 0.7 ? 'active' : 'monitoring',
  };
}

/**
 * Generate batch threats for attack simulation
 */
export function simulateAttack() {
  const count = 4 + Math.floor(Math.random() * 6);
  return Array.from({ length: count }, () => generateThreat(true));
}

/**
 * Calculate risk score from text input
 */
export function calculateRiskScore(input) {
  if (!input || !input.trim()) return { score: 0, level: 'none', explanation: '' };

  const text = input.toLowerCase();
  let score = 20 + Math.floor(Math.random() * 30);

  const dangerKeywords = ['malware', 'ransomware', 'exploit', 'attack', 'ddos', 'phishing', 'trojan', 'virus', 'hack', 'breach', 'vulnerability', 'zero-day', 'botnet', 'rootkit'];
  const mediumKeywords = ['suspicious', 'unknown', 'probe', 'scan', 'unauthorized', 'anomaly', 'unusual', 'warning'];
  const safeKeywords = ['update', 'patch', 'secure', 'firewall', 'encrypt', 'backup', 'monitor'];

  dangerKeywords.forEach(kw => { if (text.includes(kw)) score += 12; });
  mediumKeywords.forEach(kw => { if (text.includes(kw)) score += 6; });
  safeKeywords.forEach(kw => { if (text.includes(kw)) score -= 5; });

  score = Math.max(5, Math.min(100, score));

  const level = score >= 80 ? 'CRITICAL' :
                score >= 60 ? 'HIGH' :
                score >= 40 ? 'MEDIUM' : 'LOW';

  const explanations = {
    CRITICAL: `CRITICAL THREAT DETECTED. Analysis of "${input.slice(0, 40)}..." reveals multiple high-risk indicators. Immediate containment recommended. Cross-referencing with global threat database... Pattern matches known APT signatures. Recommend full network isolation and incident response team activation.`,
    HIGH: `HIGH SEVERITY ALERT. The input "${input.slice(0, 40)}..." shows elevated risk markers consistent with advanced persistent threats. Enhanced monitoring engaged. Correlating with recent attack patterns... Multiple threat vectors identified. Recommend escalation to SOC Level 2.`,
    MEDIUM: `MODERATE RISK IDENTIFIED. Scan of "${input.slice(0, 40)}..." reveals potential indicators of compromise. Automated defensive measures activated. Running deep packet inspection... Some anomalous patterns detected. Continued monitoring recommended.`,
    LOW: `LOW RISK ASSESSMENT. Analysis of "${input.slice(0, 40)}..." shows minimal threat indicators. Standard security protocols remain active. Continuous background scanning operational. No immediate action required.`,
  };

  return { score, level, explanation: explanations[level] };
}

/**
 * Generate an initial chart data set
 */
export function generateInitialChartData(points = 20) {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    threats: 10 + Math.floor(Math.random() * 30),
    blocked: 5 + Math.floor(Math.random() * 20),
    anomalies: Math.floor(Math.random() * 15),
  }));
}

/**
 * Add a new data point to chart data
 */
export function generateChartDataPoint(index, isAttack = false) {
  const multiplier = isAttack ? 3.5 : 1;
  return {
    time: index,
    threats: Math.floor((10 + Math.random() * 30) * multiplier),
    blocked: Math.floor((5 + Math.random() * 20) * multiplier),
    anomalies: Math.floor(Math.random() * 15 * multiplier),
  };
}

/**
 * Analyze text for misinformation indicators
 */
export function analyzeMisinformation(text) {
  if (!text || !text.trim()) return null;

  let credibilityScore = 70 + Math.floor(Math.random() * 20);
  const suspiciousPhrases = [];

  MISINFO_PHRASES.forEach(phrase => {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      suspiciousPhrases.push(phrase);
      credibilityScore -= 8;
    }
  });

  // Check for all-caps words
  const allCapsWords = text.match(/\b[A-Z]{3,}\b/g);
  if (allCapsWords && allCapsWords.length > 2) {
    credibilityScore -= 10;
    suspiciousPhrases.push('EXCESSIVE CAPITALIZATION');
  }

  // Check for excessive exclamation marks
  if ((text.match(/!/g) || []).length > 2) {
    credibilityScore -= 8;
    suspiciousPhrases.push('Excessive punctuation (!)');
  }

  credibilityScore = Math.max(5, Math.min(95, credibilityScore));

  const verdict = credibilityScore >= 70 ? 'LIKELY CREDIBLE' :
                  credibilityScore >= 40 ? 'SUSPICIOUS' : 'LIKELY MISINFORMATION';

  // Pick random evidence sources
  const numSources = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...EVIDENCE_SOURCES].sort(() => Math.random() - 0.5);
  const sources = shuffled.slice(0, numSources);

  return {
    credibilityScore,
    verdict,
    suspiciousPhrases,
    sources,
    analysisTime: (1.5 + Math.random() * 2).toFixed(1),
  };
}

/**
 * Get color by severity
 */
export function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return '#ff2d55';
    case 'high': return '#ff6b35';
    case 'medium': return '#ffd000';
    case 'low': return '#00ff88';
    default: return '#00d4ff';
  }
}

/**
 * Get color by risk level
 */
export function getRiskColor(level) {
  switch (level) {
    case 'CRITICAL': return '#ff2d55';
    case 'HIGH': return '#ff6b35';
    case 'MEDIUM': return '#ffd000';
    case 'LOW': return '#00ff88';
    default: return '#00d4ff';
  }
}
