import React, { useState } from 'react';
import { ShieldCheck, Zap, Landmark, Trophy, FileCheck, Check } from 'lucide-react';

const WARRANTY_PILLARS = [
  {
    icon: <ShieldCheck size={26} color="#fbbf24" />,
    title: '8-Year Capital Protection Warranty',
    subtitle: '100% Principal Protection Guarantee',
    desc: 'Every rupee and USDT deposited is fully safeguarded in cold-storage multi-signature escrow vaults. Over 8 continuous years (2018 - 2026) with zero capital loss for any trader.',
    badge: '100% PRINCIPAL SAFE',
    color: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  {
    icon: <Zap size={26} color="#10b981" />,
    title: 'Instant Settlement Guarantee',
    subtitle: 'Sub-30s Automated Payout SLA',
    desc: 'Automated high-speed withdrawal rails directly to UPI (PhonePe, Google Pay, Paytm) and on-chain USDT/BTC. Guaranteed fast settlement with 0% platform withdrawal fee.',
    badge: '0% DEFAULT RECORD',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  {
    icon: <Landmark size={26} color="#06b6d4" />,
    title: '1:1 Proof-of-Reserves Solvency',
    subtitle: '100% Fully Backed Capital Reserve',
    desc: 'All trader balances are 100% backed 1:1 and segregated from operational company capital. Audited cold storage reserves guarantee absolute solvency at all times.',
    badge: '1:1 BACKED RESERVES',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
  {
    icon: <Trophy size={26} color="#a855f7" />,
    title: '8+ Years Unbroken Track Record',
    subtitle: 'Operational Since 2018',
    desc: 'Established in 2018, PAYNEX has successfully facilitated millions of prediction contracts and paid out over ₹2.5 Crore+ in winnings with unbroken 99.98% platform reliability.',
    badge: 'ESTD. 2018 (8+ YRS)',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.35)',
  },
];

const TRUST_STATS = [
  { value: '8+ Years', label: 'Continuous Legacy', sub: 'Estd. 2018' },
  { value: '100%', label: 'Capital Protection', sub: 'Principal Solvency' },
  { value: '50,000+', label: 'Protected Traders', sub: 'Zero Defaults' },
  { value: '0.4s', label: 'Payout Engine Speed', sub: 'Instant Bank IMPS' },
];

const CapitalWarrantySection = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section
      id="warranty"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(60px, 9vw, 110px) clamp(14px, 3.5vw, 28px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Background Ambience */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75%',
          height: '500px',
          background: 'radial-gradient(ellipse 65% 50% at 50% 40%, rgba(245, 158, 11, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 80%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: -1,
        }}
      />

      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: '16px',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}><ShieldCheck size={14} color="#fbbf24" /></span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#fbbf24',
              letterSpacing: '1.8px',
              textTransform: 'uppercase',
            }}
          >
            ESTD. 2018 • 8-YEAR CAPITAL PROTECTION WARRANTY
          </span>
        </div>

        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.9rem, 4.2vw, 3.4rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.18,
            letterSpacing: '-0.5px',
            marginBottom: '16px',
          }}
        >
          8 Years of Unbroken Trust.{' '}
          <span className="gradient-text-gold">100% Capital Assurance.</span>
        </h2>

        <p
          style={{
            fontSize: 'clamp(13.5px, 2.6vw, 16px)',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}
        >
          Operational without interruption since <strong style={{ color: '#fff' }}>2018</strong>. Every trader on PAYNEX is backed by an institutional <strong style={{ color: '#fbbf24' }}>8-Year Capital Protection Warranty</strong> — ensuring 100% principal safety, verified 1:1 reserve solvency, and guaranteed instant payouts.
        </p>
      </div>

      {/* Certificate / Assurance Badge Showcase Banner */}
      <div
        className="cyber-card"
        style={{
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 36px)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 14, 30, 0.95) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.15)',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Gold Foil Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #10b981, #06b6d4, #f59e0b)',
            backgroundSize: '200% auto',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            alignItems: 'center',
          }}
        >
          {/* Certificate Left Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1.5px solid rgba(245, 158, 11, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                  flexShrink: 0,
                }}
              >
                <FileCheck size={24} color="#fbbf24" />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#fbbf24',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  OFFICIAL INSTITUTIONAL COVENANT
                </span>
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(18px, 3.2vw, 22px)',
                    fontWeight: 900,
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  Certificate of 8-Year Capital Assurance
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
              This warranty certifies that since <strong style={{ color: '#fbbf24' }}>January 2018</strong>, PAYNEX CRYPTO has maintained a flawless, zero-default financial record. All user staking balances, deposit margins, and prediction gains are insured under our 1:1 Segregated Reserve Solvency Protocol.
            </p>

            {/* Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px' }}>
              {[
                'Estd. 2018 (8+ Years Active)',
                '100% Principal Protection',
                'Instant Bank UPI IMPS Payouts',
                'Cold Storage Multi-Sig Escrow',
              ].map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} color="#10b981" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Right Column: Gold Solvency Stamp Seal Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(5, 6, 14, 0.65)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '24px 20px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Medallion Seal */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.05) 70%)',
                border: '2px dashed #fbbf24',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.35)',
                marginBottom: '14px',
              }}
            >
              <ShieldCheck size={28} color="#fbbf24" />
              <span style={{ fontSize: '8.5px', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.8px' }}>
                8 YEARS
              </span>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff', letterSpacing: '0.5px', marginBottom: '4px' }}>
              OFFICIAL TRUST & SOLVENCY SEAL
            </div>
            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700, marginBottom: '10px' }}>
              VERIFIED ACTIVE • 2018 – 2026
            </div>

            <p style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.45, margin: 0, maxWidth: '280px' }}>
              Protected under PAYNEX Capital Solvency Agreement v8.2 with continuous automated audit verification.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        style={{ width: '100%', marginBottom: '40px' }}
      >
        {WARRANTY_PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="cyber-card"
            style={{
              borderRadius: '20px',
              padding: '26px 22px',
              background: 'rgba(10, 14, 30, 0.75)',
              border: `1px solid ${pillar.glow}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              {/* Pillar Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${pillar.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: `0 0 20px ${pillar.glow}`,
                  }}
                >
                  {pillar.icon}
                </div>

                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 900,
                    color: pillar.color,
                    background: `${pillar.color}15`,
                    border: `1px solid ${pillar.color}40`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.8px',
                  }}
                >
                  {pillar.badge}
                </span>
              </div>

              <h4
                className="font-display"
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '6px',
                  letterSpacing: '0.2px',
                }}
              >
                {pillar.title}
              </h4>

              <div
                style={{
                  fontSize: '11px',
                  color: pillar.color,
                  fontWeight: 700,
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                {pillar.subtitle}
              </div>

              <p style={{ fontSize: '12.8px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {pillar.desc}
              </p>
            </div>

            <div
              style={{
                marginTop: '18px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#cbd5e1',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#10b981' }}>●</span> Guaranteed by PAYNEX
            </div>
          </div>
        ))}
      </div>

      {/* Trust Stats Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          gap: '16px',
          padding: '24px clamp(12px, 3vw, 32px)',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.7) 0%, rgba(10, 14, 30, 0.9) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '18px',
          alignItems: 'center',
        }}
      >
        {TRUST_STATS.map((stat, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center',
              borderRight: idx < TRUST_STATS.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              padding: '8px 12px',
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 'clamp(22px, 3vw, 28px)',
                fontWeight: 900,
                color: '#fbbf24',
                marginBottom: '2px',
                textShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CapitalWarrantySection;
