import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, ShieldCheck, Skull } from 'lucide-react';

export default function Simulation({ isAttack, onToggleAttack }) {
  const [countdown, setCountdown] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [threatData, setThreatData] = useState([]);
  const elapsedRef = useRef(null);

  // ✅ KEEP ONLY ONE API FUNCTION (fixed)
  const simulateAttackAPI = async () => {
    try {
      const res = await fetch("http://localhost:5000/simulate-attack");
      const data = await res.json();

      console.log("🔥 Threat Detected:", data);

      // keep latest 5 threats
      setThreatData(prev => [data, ...prev].slice(0, 5));
    } catch (err) {
      console.error("Simulation error:", err);
    }
  };

  const handleToggle = useCallback(() => {
    if (!isAttack) {
      setCountdown(3);
    } else {
      onToggleAttack(false);
      setElapsed(0);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    }
  }, [isAttack, onToggleAttack]);

  // Countdown logic (UNCHANGED FLOW)
  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      setCountdown(null);
      onToggleAttack(true);

      // 🔥 INITIAL THREAT SIMULATION (your original idea)
      simulateAttackAPI();

      elapsedRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);

      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onToggleAttack]);

  useEffect(() => {
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, []);

  const formatTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="glass-panel p-4">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={isAttack ? {
            color: ['#ff2d55', '#ff6b35', '#ff2d55'],
          } : { color: '#8b5cf6' }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {isAttack ? <Skull size={16} /> : <ShieldAlert size={16} />}
        </motion.div>

        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          letterSpacing: 2,
          color: isAttack ? '#ff2d55' : '#8b5cf6',
        }}>
          {isAttack ? 'ATTACK IN PROGRESS' : 'SIMULATION CONTROL'}
        </span>
      </div>

      {/* Countdown */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div className="text-center py-4">
            <motion.div
              key={countdown}
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: '#ff2d55',
              }}
            >
              {countdown}
            </motion.div>

            <span style={{ fontSize: 10, color: '#ff6b35' }}>
              INITIATING ATTACK SEQUENCE...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      {countdown === null && (
        <motion.button
          onClick={handleToggle}
          className={`w-full py-3 px-6 rounded-lg font-bold ${
            isAttack ? 'cyber-button' : 'cyber-button cyber-button-danger'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isAttack ? (
              <>
                <ShieldCheck size={16} />
                <span>TERMINATE SIMULATION</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>INITIATE ATTACK SIMULATION</span>
              </>
            )}
          </div>
        </motion.button>
      )}

      {/* 🔥 YOUR ORIGINAL THREAT DISPLAY (FIXED ONLY VARIABLE) */}
     {threatData && threatData.length > 0 && (
  <div className="mt-4 p-2 rounded-lg bg-black/30 text-white text-xs space-y-1">

    <p>⚠️ Threat Type: {threatData[0]?.threatType}</p>
    <p>Risk: {threatData[0]?.risk}</p>
    <p>Action: {threatData[0]?.action}</p>
    <p>Confidence: {threatData[0]?.confidence}</p>
    <p>Country: {threatData[0]?.country}</p>
    <p>IP: {threatData[0]?.ip}</p>
    <p>URL: {threatData[0]?.url}</p>
    <p>Reason: {threatData[0]?.reason}</p>

  </div>
)}

    </div>
  );
}