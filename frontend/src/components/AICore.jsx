import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * AICore — The central radar / hero element
 * A large glowing circular interface with rotating sweep, pulse rings,
 * and reactive intensification when scanning or under attack.
 */
export default function AICore({ isScanning, isAttack, systemStatus }) {
  const [pulseRings, setPulseRings] = useState([]);

  // Emit pulse rings periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRings(prev => {
        const now = Date.now();
        const filtered = prev.filter(r => now - r.id < 3000);
        return [...filtered, { id: now }];
      });
    }, isAttack ? 600 : isScanning ? 800 : 1500);

    return () => clearInterval(interval);
  }, [isScanning, isAttack]);

  const glowColor = isAttack ? 'rgba(255, 45, 85, 0.3)' : 'rgba(0, 212, 255, 0.25)';
  const ringColor = isAttack ? 'rgba(255, 45, 85, 0.4)' : 'rgba(0, 212, 255, 0.35)';
  const sweepSpeed = isAttack ? 1.5 : isScanning ? 2 : 4;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 340,
          height: 340,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          transition: 'all 0.5s ease',
        }}
      />

      {/* Concentric rings */}
      {[300, 240, 180, 120].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1px solid ${isAttack ? `rgba(255, 45, 85, ${0.15 + i * 0.05})` : `rgba(0, 212, 255, ${0.1 + i * 0.05})`}`,
            transition: 'border-color 0.5s ease',
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Cross-hairs */}
      <div className="absolute" style={{ width: 300, height: 300 }}>
        <div
          className="absolute top-1/2 left-0 w-full"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${isAttack ? 'rgba(255,45,85,0.15)' : 'rgba(0,212,255,0.12)'}, transparent)`,
          }}
        />
        <div
          className="absolute left-1/2 top-0 h-full"
          style={{
            width: 1,
            background: `linear-gradient(180deg, transparent, ${isAttack ? 'rgba(255,45,85,0.15)' : 'rgba(0,212,255,0.12)'}, transparent)`,
          }}
        />
      </div>

      {/* Radar sweep */}
      <motion.div
        className="absolute"
        style={{ width: 300, height: 300 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: sweepSpeed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50%',
            height: 2,
            transformOrigin: 'left center',
            background: `linear-gradient(90deg, ${isAttack ? 'rgba(255,45,85,0.8)' : 'rgba(0,212,255,0.8)'}, transparent)`,
            boxShadow: `0 0 10px ${isAttack ? 'rgba(255,45,85,0.4)' : 'rgba(0,212,255,0.4)'}`,
          }}
        />
        {/* Sweep trail */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, transparent 0deg, ${isAttack ? 'rgba(255,45,85,0.08)' : 'rgba(0,212,255,0.06)'} 30deg, transparent 60deg)`,
          }}
        />
      </motion.div>

      {/* Expanding pulse rings */}
      {pulseRings.map(ring => (
        <motion.div
          key={ring.id}
          className="absolute rounded-full"
          style={{
            border: `1.5px solid ${ringColor}`,
          }}
          initial={{ width: 80, height: 80, opacity: 0.6 }}
          animate={{ width: 350, height: 350, opacity: 0 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
      ))}

      {/* Center dot cluster */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          background: isAttack ? '#ff2d55' : '#00d4ff',
          boxShadow: `0 0 20px ${isAttack ? 'rgba(255,45,85,0.8)' : 'rgba(0,212,255,0.8)'}, 0 0 40px ${isAttack ? 'rgba(255,45,85,0.4)' : 'rgba(0,212,255,0.4)'}`,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Status label */}
      <motion.div
        className="absolute"
        style={{
          bottom: 10,
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: 3,
          color: isAttack ? '#ff2d55' : '#00d4ff',
          textShadow: `0 0 10px ${isAttack ? 'rgba(255,45,85,0.5)' : 'rgba(0,212,255,0.5)'}`,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {systemStatus}
      </motion.div>

      {/* Rotating outer dashed ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          border: `1px dashed ${isAttack ? 'rgba(255,45,85,0.2)' : 'rgba(0,212,255,0.15)'}`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
