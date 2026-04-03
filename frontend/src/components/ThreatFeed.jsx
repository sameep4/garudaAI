import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Activity, Wifi } from 'lucide-react';
import { getSeverityColor } from '../utils/simulation';

const SEVERITY_ICONS = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: Activity,
  low: Shield,
};

/**
 * ThreatFeed — Live auto-scrolling threat stream panel
 */
export default function ThreatFeed({ threats, isAttack }) {
  const scrollRef = useRef(null);

  // Auto-scroll to top on new threats
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [threats.length]);

  return (
    <div className="glass-panel h-full flex flex-col" style={{ minHeight: 0 }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.08)' }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              color: isAttack ? '#ff2d55' : '#00d4ff',
              textShadow: isAttack
                ? '0 0 10px rgba(255,45,85,0.5)'
                : '0 0 10px rgba(0,212,255,0.5)',
            }}
          >
            <Wifi size={14} />
          </motion.div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              letterSpacing: 2,
              color: isAttack ? '#ff2d55' : '#00d4ff',
            }}
          >
            LIVE THREAT STREAM
          </span>
        </div>
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isAttack ? '#ff2d55' : '#00ff88',
              boxShadow: `0 0 6px ${isAttack ? 'rgba(255,45,85,0.6)' : 'rgba(0,255,136,0.6)'}`,
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.4)' }}>
            LIVE
          </span>
        </motion.div>
      </div>

      {/* Threat list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
        style={{ minHeight: 0 }}
      >
        <AnimatePresence initial={false}>
          {threats.map((threat, index) => {
            const Icon = SEVERITY_ICONS[threat.severity] || Shield;
            const color = getSeverityColor(threat.severity);

            return (
              <motion.div
                key={threat.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="rounded-lg p-3 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(10,15,40,0.7), rgba(10,15,40,0.4))`,
                  border: `1px solid ${color}20`,
                }}
              >
                {/* Left glow bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />

                <div className="flex items-start gap-2 pl-2">
                  {/* Pulsing icon */}
                  <motion.div
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ color, marginTop: 2, flexShrink: 0 }}
                  >
                    <Icon size={14} />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#e0e0ff',
                        }}
                        className="truncate"
                      >
                        {threat.type}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-nowrap"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          background: `${color}15`,
                          color: color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {threat.riskScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'rgba(200,200,255,0.4)',
                        }}
                      >
                        {threat.source}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'rgba(200,200,255,0.25)',
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'rgba(200,200,255,0.35)',
                        }}
                        className="truncate"
                      >
                        {threat.region}
                      </span>
                    </div>

                    {/* Risk bar */}
                    <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${color}, ${color}80)`,
                          boxShadow: `0 0 6px ${color}40`,
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${threat.riskScore}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Shimmer on entry */}
                {index === 0 && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                      background: `linear-gradient(135deg, ${color}10, transparent)`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {threats.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,200,255,0.3)' }}>
              Awaiting threat data...
            </p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: '1px solid rgba(0, 212, 255, 0.06)' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.3)' }}>
          {threats.length} THREATS TRACKED
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.25)' }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
