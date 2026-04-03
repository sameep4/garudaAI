import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { analyzeMisinformation } from '../utils/simulation';

/**
 * MisinformationAnalyzer — Headline credibility analysis panel
 * Animated credibility meter, suspicious phrase highlighting, evidence sources
 */
export default function MisinformationAnalyzer({ isAttack }) {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [meterValue, setMeterValue] = useState(0);

  // Animate meter
  useEffect(() => {
    if (!result) {
      setMeterValue(0);
      return;
    }
    const target = result.credibilityScore;
    let current = 0;
    const step = () => {
      current += (target - current) * 0.06;
      if (Math.abs(target - current) < 0.5) {
        setMeterValue(target);
        return;
      }
      setMeterValue(Math.round(current));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [result]);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const analysis = analyzeMisinformation(input);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1800);
  };

  const getVerdictColor = (verdict) => {
    if (!verdict) return '#00d4ff';
    if (verdict.includes('CREDIBLE') && !verdict.includes('MIS')) return '#00ff88';
    if (verdict.includes('SUSPICIOUS')) return '#ffd000';
    return '#ff2d55';
  };

  const highlightText = (text, phrases) => {
    if (!phrases || phrases.length === 0) return text;
    let highlighted = text;
    phrases.forEach(phrase => {
      const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlighted = highlighted.replace(regex, `|||$1|||`);
    });
    return highlighted;
  };

  return (
    <div className="glass-panel p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ color: '#00d4ff' }}
        >
          <Globe size={16} />
        </motion.div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            letterSpacing: 2,
            color: '#00d4ff',
          }}
        >
          MISINFO ANALYZER
        </span>
      </div>

      {/* Input */}
      <form onSubmit={handleAnalyze} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste headline or caption to analyze..."
          className="cyber-input resize-none"
          rows={2}
          style={{ fontSize: 12 }}
        />
        <motion.button
          type="submit"
          disabled={isAnalyzing}
          className="cyber-button w-full mt-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{ fontSize: 10 }}
        >
          <div className="flex items-center justify-center gap-2">
            {isAnalyzing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Search size={14} />
              </motion.div>
            ) : (
              <Search size={14} />
            )}
            <span>{isAnalyzing ? 'ANALYZING...' : 'ANALYZE CREDIBILITY'}</span>
          </div>
        </motion.button>
      </form>

      {/* Scanning animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4"
          >
            <motion.div
              className="mx-auto mb-2 rounded-full"
              style={{
                width: 40,
                height: 40,
                border: '2px solid rgba(0, 212, 255, 0.3)',
                borderTop: '2px solid #00d4ff',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(0, 212, 255, 0.5)' }}>
              Cross-referencing databases...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {/* Credibility meter */}
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: 80, height: 80, flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="5"
                  />
                  <motion.circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke={getVerdictColor(result.verdict)}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${(meterValue / 100) * 213.6} 213.6`}
                    transform="rotate(-90 40 40)"
                    style={{ filter: `drop-shadow(0 0 4px ${getVerdictColor(result.verdict)})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 700,
                    color: getVerdictColor(result.verdict),
                  }}>
                    {meterValue}%
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.4)' }}>
                  VERDICT
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: getVerdictColor(result.verdict),
                  textShadow: `0 0 10px ${getVerdictColor(result.verdict)}40`,
                }}>
                  {result.verdict}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.3)', marginTop: 2 }}>
                  Analysis time: {result.analysisTime}s
                </div>
              </div>
            </div>

            {/* Suspicious phrases */}
            {result.suspiciousPhrases.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-lg"
                style={{
                  background: 'rgba(255, 208, 0, 0.04)',
                  border: '1px solid rgba(255, 208, 0, 0.1)',
                }}
              >
                <div className="flex items-center gap-1 mb-2">
                  <AlertTriangle size={10} color="#ffd000" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#ffd000', letterSpacing: 1 }}>
                    SUSPICIOUS PHRASES DETECTED
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.suspiciousPhrases.map((phrase, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        background: 'rgba(255, 208, 0, 0.1)',
                        color: '#ffd000',
                        border: '1px solid rgba(255, 208, 0, 0.2)',
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Evidence sources */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-1 mb-2">
                <ExternalLink size={10} color="rgba(200,200,255,0.4)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,200,255,0.4)', letterSpacing: 1 }}>
                  EVIDENCE SCAN
                </span>
              </div>
              <div className="space-y-1.5">
                {result.sources.map((source, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center justify-between p-2 rounded"
                    style={{
                      background: 'rgba(0, 10, 30, 0.4)',
                      border: '1px solid rgba(0, 212, 255, 0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {source.reliability === 'high' ? (
                        <CheckCircle size={10} color="#00ff88" />
                      ) : source.reliability === 'low' ? (
                        <XCircle size={10} color="#ff2d55" />
                      ) : (
                        <AlertTriangle size={10} color="#ffd000" />
                      )}
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#c0c0ff' }}>
                        {source.name}
                      </span>
                    </div>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        background: source.reliability === 'high'
                          ? 'rgba(0,255,136,0.1)'
                          : source.reliability === 'low'
                          ? 'rgba(255,45,85,0.1)'
                          : 'rgba(255,208,0,0.1)',
                        color: source.reliability === 'high' ? '#00ff88' : source.reliability === 'low' ? '#ff2d55' : '#ffd000',
                        border: `1px solid ${source.reliability === 'high' ? 'rgba(0,255,136,0.2)' : source.reliability === 'low' ? 'rgba(255,45,85,0.2)' : 'rgba(255,208,0,0.2)'}`,
                      }}
                    >
                      {source.tag}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
