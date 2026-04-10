import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, AlertTriangle } from 'lucide-react';
import { calculateRiskScore, getRiskColor } from '../utils/simulation';

/**
 * Scanner — Threat analysis input with animated results
 * Includes glitch effect, risk gauge, typewriter explanation
 */
export default function Scanner({ onScanStart, onScanComplete, isAttack }) {
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);
  const [gaugeAngle, setGaugeAngle] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (!result) return;
    setDisplayedText('');
    const text = result.explanation;
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 18);
    return () => clearInterval(timer);
  }, [result]);

  // Animate gauge
  useEffect(() => {
    if (!result) {
      setGaugeAngle(0);
      return;
    }
    const target = (result.score / 100) * 270;
    let current = 0;
    const step = () => {
      current += (target - current) * 0.08;
      if (Math.abs(target - current) < 0.5) {
        setGaugeAngle(target);
        return;
      }
      setGaugeAngle(current);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [result]);

 const handleSubmit = useCallback(async (e) => {
  e.preventDefault();
  if (!input.trim() || isScanning) return;

  setIsScanning(true);
  onScanStart();

  try {
    const response = await fetch("http://localhost:5000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: input }), // ✅ FIXED
    });

    const data = await response.json();

    console.log("🔍 Scan Result:", data);

    // 🔥 CONVERT BACKEND DATA → YOUR UI FORMAT
    const mappedResult = {
      score:
        data.risk === "High" ? 85 :
        data.risk === "Medium" ? 55 : 25,

      level: data.risk,

      explanation: `
Target: ${data.url}
IP Address: ${data.ip}
Location: ${data.country}

Threat Type: ${data.threatType}
Action Taken: ${data.action}

Reason: ${data.reason}
Confidence: ${data.confidence}
      `
    };

    setResult(mappedResult); // ✅ THIS SHOWS UI

  } catch (error) {
    console.error(error);
    alert("Backend error");
  }

  setIsScanning(false);
  onScanComplete();

}, [input, isScanning, onScanStart, onScanComplete]);
  
 

  const riskColor = result ? getRiskColor(result.level) : '#00d4ff';

  // SVG gauge path
  const gaugeRadius = 52;
  const gaugeCx = 60;
  const gaugeCy = 60;
  const startAngle = 135;
  const polarToCartesian = (angle) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: gaugeCx + gaugeRadius * Math.cos(rad),
      y: gaugeCy + gaugeRadius * Math.sin(rad),
    };
  };

  const describeArc = (endAngle) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(startAngle + endAngle);
    const largeArcFlag = endAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${gaugeRadius} ${gaugeRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <div className={`w-full max-w-md mx-auto ${glitchActive ? 'glitch-active' : ''}`}>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter threat signature to analyze..."
            className="cyber-input pr-12"
            disabled={isScanning}
            style={{
              borderColor: isAttack ? 'rgba(255, 45, 85, 0.3)' : undefined,
            }}
          />
          <button
            type="submit"
            disabled={isScanning}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all duration-300"
            style={{
              color: isScanning ? '#ffd000' : '#00d4ff',
              background: 'rgba(0, 212, 255, 0.05)',
            }}
          >
            {isScanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Shield size={18} />
              </motion.div>
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        {/* Scanning bar */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, #00d4ff, #8b5cf6, #00d4ff)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
      </form>

      {/* Scanning state */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-4"
          >
            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: '#00d4ff',
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ⟫ SCANNING THREAT SIGNATURE... ⟪
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-panel p-4"
          >
            {/* Gauge + Score */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative" style={{ width: 120, height: 120, flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {/* Background arc */}
                  <path
                    d={describeArc(270)}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Value arc */}
                  <motion.path
                    d={describeArc(gaugeAngle)}
                    fill="none"
                    stroke={riskColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 6px ${riskColor})`,
                    }}
                  />
                </svg>
                {/* Score text */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ paddingTop: 4 }}
                >
                  <motion.span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: riskColor,
                      textShadow: `0 0 15px ${riskColor}`,
                      lineHeight: 1,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {result.score}
                  </motion.span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(200,200,255,0.5)', marginTop: 2 }}>
                    RISK SCORE
                  </span>
                </div>
              </div>

              {/* Threat level */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(200,200,255,0.4)', marginBottom: 4 }}>
                    THREAT LEVEL
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      color: riskColor,
                      textShadow: `0 0 20px ${riskColor}`,
                      letterSpacing: 2,
                    }}
                  >
                    {result.level}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <AlertTriangle size={12} color={riskColor} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: riskColor }}>
                      {result.score >= 60 ? 'ACTION REQUIRED' : 'MONITORING'}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* AI Explanation with typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-3 rounded-lg"
              style={{
                background: 'rgba(0, 10, 30, 0.5)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(0,212,255,0.5)', marginBottom: 6, letterSpacing: 2 }}>
                ◈ GARUDA AI ANALYSIS
              </div>
              <p
                className={displayedText.length < result.explanation.length ? 'typewriter-cursor' : ''}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: 'rgba(200, 210, 255, 0.7)',
                }}
              >
                {displayedText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
