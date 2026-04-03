import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { generateInitialChartData, generateChartDataPoint } from '../utils/simulation';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-panel px-3 py-2"
      style={{ border: '1px solid rgba(0, 212, 255, 0.2)' }}
    >
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#e0e0ff' }}>
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Charts — Live updating intelligence panels
 */
export default function Charts({ isAttack }) {
  const [data, setData] = useState(() => generateInitialChartData(25));
  const indexRef = useRef(25);

  // Live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current++;
      setData(prev => {
        const newPoint = generateChartDataPoint(indexRef.current, isAttack);
        const updated = [...prev, newPoint];
        if (updated.length > 30) updated.shift();
        return updated;
      });
    }, isAttack ? 400 : 1500);

    return () => clearInterval(interval);
  }, [isAttack]);

  // Stats
  const latest = data[data.length - 1] || {};
  const totalThreats = data.reduce((s, d) => s + d.threats, 0);
  const totalBlocked = data.reduce((s, d) => s + d.blocked, 0);
  const avgAnomalies = Math.round(data.reduce((s, d) => s + d.anomalies, 0) / data.length);

  return (
    <div className="glass-panel h-full flex flex-col" style={{ minHeight: 0 }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.08)' }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ color: isAttack ? '#ff2d55' : '#8b5cf6' }}
          >
            <BarChart3 size={14} />
          </motion.div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              letterSpacing: 2,
              color: isAttack ? '#ff2d55' : '#8b5cf6',
            }}
          >
            INTELLIGENCE
          </span>
        </div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <TrendingUp size={12} color={isAttack ? '#ff2d55' : '#00d4ff'} />
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        {[
          { label: 'THREATS', value: totalThreats, color: '#ff2d55' },
          { label: 'BLOCKED', value: totalBlocked, color: '#00ff88' },
          { label: 'ANOMALIES', value: avgAnomalies, color: '#ffd000' },
        ].map(stat => (
          <motion.div
            key={stat.label}
            className="text-center p-2 rounded-lg"
            style={{
              background: 'rgba(0, 10, 30, 0.4)',
              border: `1px solid ${stat.color}15`,
            }}
            animate={isAttack ? { borderColor: [`${stat.color}15`, `${stat.color}40`, `${stat.color}15`] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <motion.div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                color: stat.color,
                textShadow: `0 0 10px ${stat.color}40`,
                lineHeight: 1.2,
              }}
              key={stat.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {stat.value}
            </motion.div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(200,200,255,0.35)', letterSpacing: 1, marginTop: 2 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Threat Activity Chart */}
      <div className="flex-1 px-2 pb-2" style={{ minHeight: 120 }}>
        <div className="px-2 mb-1">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.3)', letterSpacing: 1 }}>
            THREAT ACTIVITY
          </span>
        </div>
        <ResponsiveContainer width="100%" height="45%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isAttack ? '#ff2d55' : '#00d4ff'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isAttack ? '#ff2d55' : '#00d4ff'} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="threats"
              name="Threats"
              stroke={isAttack ? '#ff2d55' : '#00d4ff'}
              strokeWidth={2}
              fill="url(#threatGrad)"
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              name="Blocked"
              stroke="#00ff88"
              strokeWidth={1.5}
              fill="url(#blockedGrad)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Anomaly Chart */}
        <div className="px-2 mb-1 mt-2">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.3)', letterSpacing: 1 }}>
            ANOMALY DETECTION
          </span>
        </div>
        <ResponsiveContainer width="100%" height="40%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="anomalies"
              name="Anomalies"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#anomalyGrad)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
