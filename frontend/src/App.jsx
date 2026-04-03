import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Eye, Radio } from 'lucide-react';

import ParticleBackground from './components/ParticleBackground';
import AICore from './components/AICore';
import Scanner from './components/Scanner';
import ThreatFeed from './components/ThreatFeed';
import Charts from './components/Charts';
import Simulation from './components/Simulation';
import MisinformationAnalyzer from './components/MisinformationAnalyzer';
import { generateThreat, simulateAttack } from './utils/simulation';

export default function App() {
  const [threats, setThreats] = useState([]);
  const [isAttack, setIsAttack] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ACTIVE SCANNING');
  const [showMisinfo, setShowMisinfo] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootText, setBootText] = useState([]);

  const attackIntervalRef = useRef(null);

  // Boot sequence
  useEffect(() => {
    const lines = [
      '> GARUDA AI v4.2.1 — INITIALIZING...',
      '> Loading neural threat engine...',
      '> Connecting to global SIGINT network...',
      '> Calibrating quantum pattern matcher...',
      '> Activating deep packet inspection...',
      '> Threat intelligence feeds: ONLINE',
      '> Anomaly detection: ARMED',
      '> System status: OPERATIONAL',
      '> ═══════════════════════════════════',
      '> GARUDA AI — COMMAND CENTER ACTIVE',
    ];

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < lines.length) {
        const line = lines[idx];
        setBootText(prev => [...prev, line]);
        idx++;
      } else {
        clearInterval(timer);
        setTimeout(() => setBootComplete(true), 600);
      }
    }, 180);

    return () => clearInterval(timer);
  }, []);

  // Normal threat generation
  useEffect(() => {
    if (!bootComplete) return;

    const initial = Array.from({ length: 5 }, () => generateThreat());
    setThreats(initial);

    const interval = setInterval(() => {
      if (!isAttack) {
        setThreats(prev => {
          const updated = [generateThreat(), ...prev];
          return updated.slice(0, 50);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bootComplete, isAttack]);

  // Attack mode
  useEffect(() => {
    if (isAttack) {
      setSystemStatus('\u26A0 UNDER ATTACK');
      attackIntervalRef.current = setInterval(() => {
        const batch = simulateAttack();
        setThreats(prev => [...batch, ...prev].slice(0, 80));
      }, 800);
    } else {
      setSystemStatus('ACTIVE SCANNING');
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
        attackIntervalRef.current = null;
      }
    }

    return () => {
      if (attackIntervalRef.current) clearInterval(attackIntervalRef.current);
    };
  }, [isAttack]);

  const handleToggleAttack = useCallback((val) => {
    setIsAttack(val);
  }, []);

  const handleScanStart = useCallback(() => {
    setIsScanning(true);
    setSystemStatus('DEEP SCAN ACTIVE');
  }, []);

  const handleScanComplete = useCallback(() => {
    setIsScanning(false);
    if (!isAttack) {
      setSystemStatus('ACTIVE SCANNING');
    }
  }, [isAttack]);

  // ---- BOOT SEQUENCE SCREEN ----
  if (!bootComplete) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: '#050510' }}
      >
        <div className="max-w-lg w-full px-8">
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 8,
                background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GARUDA AI
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(0,212,255,0.4)', marginTop: 4, letterSpacing: 3 }}>
              THREAT INTELLIGENCE SYSTEM
            </div>
          </motion.div>

          {/* Terminal lines */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(0, 10, 20, 0.8)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
              minHeight: 240,
            }}
          >
            {bootText.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: line.includes('ACTIVE') || line.includes('OPERATIONAL')
                    ? '#00ff88'
                    : line.includes('\u2550')
                    ? 'rgba(0,212,255,0.3)'
                    : 'rgba(0, 212, 255, 0.7)',
                  marginBottom: 4,
                }}
              >
                {line}
              </motion.div>
            ))}
            {bootText.length < 10 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ color: '#00d4ff', fontFamily: 'var(--font-mono)' }}
              >
                {'\u2588'}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN COMMAND CENTER ----
  return (
    <div className={`w-full h-full relative overflow-hidden ${isAttack ? 'attack-mode' : ''}`} style={{ background: '#050510' }}>
      {/* Background layers */}
      <ParticleBackground isAttack={isAttack} />
      <div className="cyber-grid" />
      <div className="scanline-overlay" />

      {/* Attack flash overlay */}
      {isAttack && <div className="attack-flash-overlay" />}

      {/* Main layout */}
      <motion.div
        className="relative z-10 w-full h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.08)' }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ color: isAttack ? '#ff2d55' : '#00d4ff' }}
            >
              <Shield size={20} />
            </motion.div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 4,
                  background: isAttack
                    ? 'linear-gradient(135deg, #ff2d55, #ff6b35)'
                    : 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.5s ease',
                }}
              >
                GARUDA AI
              </div>
            </div>
          </div>

          {/* Center status */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                background: isAttack ? '#ff2d55' : '#00ff88',
                boxShadow: `0 0 8px ${isAttack ? 'rgba(255,45,85,0.6)' : 'rgba(0,255,136,0.6)'}`,
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: isAttack ? '#ff2d55' : 'rgba(200,200,255,0.6)',
                letterSpacing: 2,
              }}
            >
              {systemStatus}
            </span>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMisinfo(!showMisinfo)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: showMisinfo ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                border: `1px solid ${showMisinfo ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.1)'}`,
                color: '#00d4ff',
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              <Eye size={12} />
              <span>MISINFO</span>
            </button>

            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Radio size={14} color="rgba(0,212,255,0.4)" />
              </motion.div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.3)' }}>
                v4.2.1
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 flex min-h-0 p-3 gap-3">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-3" style={{ width: 280, flexShrink: 0 }}>
            <div className="flex-1 min-h-0">
              <Charts isAttack={isAttack} />
            </div>
            <Simulation isAttack={isAttack} onToggleAttack={handleToggleAttack} />
          </div>

          {/* CENTER */}
          <div className="flex-1 flex flex-col items-center justify-start gap-4 min-h-0 overflow-y-auto px-4 py-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <AICore isScanning={isScanning} isAttack={isAttack} systemStatus={systemStatus} />
            </motion.div>

            <motion.div
              className="w-full max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Scanner
                onScanStart={handleScanStart}
                onScanComplete={handleScanComplete}
                isAttack={isAttack}
              />
            </motion.div>

            <AnimatePresence>
              {showMisinfo && (
                <motion.div
                  className="w-full max-w-md"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <MisinformationAnalyzer isAttack={isAttack} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <ThreatFeed threats={threats} isAttack={isAttack} />
          </div>
        </div>

        {/* Bottom bar */}
        <footer
          className="flex items-center justify-between px-6 py-2"
          style={{ borderTop: '1px solid rgba(0, 212, 255, 0.06)' }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Activity size={10} color="rgba(0,255,136,0.5)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.3)' }}>
                UPLINK STABLE
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.2)' }}>
              {'\u2022'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.25)' }}>
              NEURAL NET: 99.7% EFFICIENCY
            </span>
          </div>
          <div className="flex items-center gap-4">
            <motion.span
              style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.25)' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              QUANTUM ENCRYPTION: ACTIVE
            </motion.span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.2)' }}>
              GARUDA AI {'\u00A9'} 2026
            </span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
