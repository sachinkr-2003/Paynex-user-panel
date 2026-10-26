import { useState, useEffect } from 'react';

const VideoModal = ({ isOpen, onClose }) => {
  const [activeScene, setActiveScene] = useState(0);

  const scenes = [
    {
      title: 'Phase 1: Sub-Second 3D Matching Engine',
      subtitle: 'Decentralized liquidity aggregation with real-time WebSocket feeds.',
      highlight: '0.008s Execution Latency',
      badge: 'SPEED TEST',
      color: '#06b6d4',
    },
    {
      title: 'Phase 2: 95% Binary Contract Settlement',
      subtitle: 'Predict market directions on BTC, ETH, and SOL with 30s & 60s contracts.',
      highlight: 'Up to 95.0% Profit Returns',
      badge: 'YIELD PROTOCOL',
      color: '#10b981',
    },
    {
      title: 'Phase 3: Dual Fiat & USDT Multi-Sig Rails',
      subtitle: 'Instant Indian UPI deposits & withdrawals combined with global TRC-20 security.',
      highlight: '0-Fee Automated Disbursals',
      badge: 'SECURITY AUDITED',
      color: '#f59e0b',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % scenes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen, scenes.length]);

  if (!isOpen) return null;

  const current = scenes[activeScene];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(2, 3, 14, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(10px, 3vw, 24px)',
      }}
      onClick={onClose}
    >
      <div
        className="cyber-card"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          background: 'radial-gradient(ellipse at center, #0e122b 0%, #05060e 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 60px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px clamp(14px, 3vw, 24px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(5, 5, 20, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
              PAYNEX 3D CINEMATIC PREVIEW ● 4K 60FPS
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Video Screen Simulator */}
        <div
          style={{
            position: 'relative',
            minHeight: '260px',
            height: 'clamp(260px, 45vh, 340px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(14px, 3.5vw, 28px)',
            background: 'linear-gradient(135deg, rgba(12, 14, 45, 0.95), rgba(6, 7, 24, 0.95))',
          }}
        >
          {/* Animated 3D Scanning Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #2563eb, #fbbf24, transparent)',
              boxShadow: '0 0 15px #fbbf24',
              animation: 'cyberScan 3s linear infinite',
              pointerEvents: 'none',
            }}
          />

          {/* Scene Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: current.color,
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${current.color}`,
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              {current.badge}
            </span>

            <span className="font-mono" style={{ fontSize: '12px', color: '#64748b' }}>
              SCENE {activeScene + 1} / 3
            </span>
          </div>

          {/* Center Graphic */}
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              className="font-mono"
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: current.color,
                marginBottom: '10px',
                textShadow: `0 0 25px ${current.color}`,
              }}
            >
              {current.highlight}
            </div>

            <h3 className="font-display" style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
              {current.title}
            </h3>

            <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
              {current.subtitle}
            </p>
          </div>

          {/* Progress Timeline Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {scenes.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveScene(idx)}
                style={{
                  height: '4px',
                  borderRadius: '2px',
                  background: idx === activeScene ? 'linear-gradient(90deg, #f59e0b, #2563eb)' : 'rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(5, 5, 20, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Ready to test live market predictions?
          </span>

          <button
            onClick={onClose}
            className="btn-cyber-primary"
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Enter 3D Arena ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
