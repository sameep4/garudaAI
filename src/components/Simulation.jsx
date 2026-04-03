import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, ShieldCheck, Skull } from 'lucide-react';

/**
 * Simulation — Attack Simulation control panel
 * Cinematic activation with alert flashes and status transitions
 */
export default function Simulation({ isAttack, onToggleAttack }) {
  const [countdown, setCountdown] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(null);

  const handleToggle = useCallback(() => {
    if (!isAttack) {
      // Start countdown before attack
      setCountdown(3);
    } else {
      onToggleAttack(false);
      setElapsed(0);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    }
  }, [isAttack, onToggleAttack]);

  // Countdown logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      onToggleAttack(true);
      // Start elapsed timer
      elapsedRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onToggleAttack]);

  // Cleanup elapsed timer
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
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            letterSpacing: 2,
            color: isAttack ? '#ff2d55' : '#8b5cf6',
          }}
        >
          {isAttack ? 'ATTACK IN PROGRESS' : 'SIMULATION CONTROL'}
        </span>
      </div>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="text-center py-4"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 48,
                fontWeight: 900,
                color: '#ff2d55',
                textShadow: '0 0 40px rgba(255, 45, 85, 0.5), 0 0 80px rgba(255, 45, 85, 0.2)',
              }}
            >
              {countdown}
            </motion.div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ff6b35' }}>
              INITIATING ATTACK SEQUENCE...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      {countdown === null && (
        <motion.button
          onClick={handleToggle}
          className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${isAttack ? 'cyber-button' : 'cyber-button-danger cyber-button'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={isAttack ? {} : {
            boxShadow: [
              '0 0 15px rgba(255, 45, 85, 0.15)',
              '0 0 30px rgba(255, 45, 85, 0.25)',
              '0 0 15px rgba(255, 45, 85, 0.15)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            letterSpacing: 3,
          }}
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

      {/* Attack mode stats */}
      <AnimatePresence>
        {isAttack && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {/* Status */}
            <motion.div
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                background: 'rgba(255, 45, 85, 0.08)',
                border: '1px solid rgba(255, 45, 85, 0.2)',
              }}
              animate={{
                borderColor: ['rgba(255,45,85,0.2)', 'rgba(255,45,85,0.5)', 'rgba(255,45,85,0.2)'],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#ff2d55' }}
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ff2d55' }}>
                  SYSTEM STATUS: UNDER ATTACK
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ff6b35' }}>
                {formatTime(elapsed)}
              </span>
            </motion.div>

            {/* Alert levels */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'DEFCON', value: '1', color: '#ff2d55' },
                { label: 'VECTORS', value: 'MULTI', color: '#ff6b35' },
                { label: 'SHIELDS', value: 'MAX', color: '#ffd000' },
              ].map(item => (
                <div
                  key={item.label}
                  className="text-center p-2 rounded-lg"
                  style={{
                    background: `${item.color}08`,
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: item.color }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: `${item.color}80`, letterSpacing: 1 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
