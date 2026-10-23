import { useState } from 'react';

const FEATURE_LIST = [
  {
    icon: '⚡',
    title: 'Sub-10ms Match Engine',
    desc: 'Proprietary high-frequency trading architecture guarantees zero slippage and instantaneous bet fills.',
    badge: 'ULTRA FAST',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  {
    icon: '💳',
    title: 'Instant UPI & Crypto Rails',
    desc: 'Deposit seamlessly using PhonePe, Google Pay, Paytm, or deposit directly in USDT (TRC-20 & BEP-20) / BTC.',
    badge: 'HYBRID WALLET',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  {
    icon: '🛡️',
    title: 'Cold Storage & Proof of Reserve',
    desc: 'Bank-grade 256-bit SSL encryption paired with on-chain multi-sig wallets ensuring complete fund security.',
    badge: 'SECURE',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  {
    icon: '📊',
    title: 'AI Market Pulse & Indicators',
    desc: 'Integrated machine-learning sentiment oscillators and Bollinger bands for high-probability binary entries.',
    badge: 'SMART AI',
    glow: 'rgba(37, 99, 235, 0.4)',
  },
  {
    icon: '🚀',
    title: '95% Peak Profit Contracts',
    desc: 'Maximize your potential returns with market-leading contract payouts on 30s, 60s, and 5-minute options.',
    badge: 'HIGH YIELD',
    glow: 'rgba(245, 158, 11, 0.5)',
  },
  {
    icon: '💸',
    title: 'Auto-Settled Withdrawals',
    desc: 'Automated withdrawal engine disburses funds to your UPI or Crypto address within 30 seconds flat.',
    badge: 'NO DELAYS',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
];

const FeatureCard = ({ item }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (y / rect.height) * -12, y: (x / rect.width) * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cyber-card"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        borderRadius: '22px',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.2s ease-out, border-color 0.3s, box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: `0 0 25px ${item.glow}`,
          }}
        >
          {item.icon}
        </div>

        <span
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#fbbf24',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '3px 8px',
            borderRadius: '6px',
            letterSpacing: '1px',
          }}
        >
          {item.badge}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          className="font-display"
          style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '10px',
            letterSpacing: '0.3px',
          }}
        >
          {item.title}
        </h3>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.65 }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section
      id="features"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(50px, 8vw, 90px) clamp(12px, 3vw, 24px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#fbbf24',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          PAYNEX INFRASTRUCTURE • INVEST TODAY AND GROW TOMORROW
        </span>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.75rem, 3.8vw, 3rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '12px',
          }}
        >
          Engineered for <span className="gradient-text-gold">Ultimate Performance</span>
        </h2>
        <p style={{ fontSize: 'clamp(13px, 2.8vw, 15px)', color: '#94a3b8', maxWidth: '560px', margin: '0 auto' }}>
          Experience trading precision backed by next-generation financial technology and deep liquidity pools.
        </p>
      </div>

      {/* Exactly 3 cards per row on desktop (lg:grid-cols-3), 2 on tablet (md:grid-cols-2), 1 on mobile */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ width: '100%' }}
      >
        {FEATURE_LIST.map((feat) => (
          <FeatureCard key={feat.title} item={feat} />
        ))}
      </div>
    </section>
  );
};

export default Features;
