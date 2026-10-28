import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Trophy, Zap, Lock } from 'lucide-react';

const Footer = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch(() => {});
      }
    }
  }, []);

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#04050b',
        borderTop: '1px solid rgba(245, 158, 11, 0.25)',
        boxShadow: '0 -15px 35px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        color: '#f8fafc',
      }}
    >
      {/* 3D Animation Video Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
            opacity: videoLoaded ? 0.32 : 0.2,
            transition: 'opacity 1s ease',
            filter: 'saturate(1.3) contrast(1.1)',
          }}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/videos/footer-3d-bg.webm" type="video/webm" />
        </video>

        {/* Dark Gradient Overlay for Maximum Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 50% 20%, rgba(10, 14, 28, 0.5) 0%, rgba(4, 5, 11, 0.9) 70%, #030408 100%),
              linear-gradient(180deg, rgba(4, 5, 11, 0.7) 0%, #030408 100%)
            `,
          }}
        />

        {/* Ambient Top Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #fbbf24, #38bdf8, transparent)',
            boxShadow: '0 0 12px rgba(251, 191, 36, 0.5)',
          }}
        />
      </div>

      {/* Footer Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(32px, 4vw, 44px) clamp(16px, 4vw, 32px) 20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Main Simple Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(20px, 3.5vw, 36px)',
            marginBottom: '28px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(245, 158, 11, 0.75)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
                  flexShrink: 0,
                  background: '#070913',
                }}
              >
                <img
                  src="/paynex-logo.jpg"
                  alt="PAYNEX Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#fff',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '1px',
                  }}
                >
                  PAY<span style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(245, 158, 11, 0.6)' }}>NEX</span>
                </span>
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                  }}
                >
                  CRYPTO
                </span>
                <p style={{ fontSize: '11px', color: '#fbbf24', margin: '2px 0 0', fontWeight: 600 }}>
                  Invest Today and Grow Tomorrow • Estd. 2018
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              Next-generation crypto &amp; stock prediction exchange with instant bank payouts and 5:00 AM daily staking interest.
            </p>

            {/* Simple Operational Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '11px',
                color: '#fbbf24',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span>All Systems Operational (6ms)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#94a3b8' }}>
              <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Home</a>
              <a href="#markets" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Live Markets</a>
              <a href="#trading-arena" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>3D Trading Arena</a>
              <a href="#leaderboard" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Leaderboard</a>
              <a href="#vip" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>VIP Rewards</a>
            </div>
          </div>

          {/* Trading & Staking */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Products
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#94a3b8' }}>
              <a href="#trading-arena" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Crypto Prediction Options</a>
              <a href="#markets" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Stock Market Contracts</a>
              <a href="#markets" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>5:00 AM Daily Staking</a>
              <a href="#mobile-app" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Android APK Download</a>
              <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>Help &amp; FAQ</a>
            </div>
          </div>

          {/* Community & Support */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Community
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>
              Connect with active traders on our official social channels.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Telegram', 'Twitter / X', 'Discord', 'YouTube'].map((platform) => (
                <button
                  key={platform}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.color = '#fbbf24';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional 8-Year Capital Protection Warranty & Solvency Box */}
        <div
          style={{
            borderTop: '1px solid rgba(245, 158, 11, 0.25)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 0',
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#fbbf24" style={{ flexShrink: 0 }} />
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                  }}
                >
                  PAYNEX 8-YEAR CAPITAL PROTECTION WARRANTY & SOLVENCY GUARANTEE
                </span>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                  Operational continuously since 2018. Backed by 100% segregated multi-signature cold vaults and instant settlement SLA.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { icon: Trophy, label: 'Estd. 2018 (8+ Yrs)' },
                { icon: ShieldCheck, label: '100% Principal Protected' },
                { icon: Zap, label: '30s Instant Settlement' },
                { icon: Lock, label: '1:1 Proof of Reserves' },
              ].map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <span
                    key={badge.label}
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#cbd5e1',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <IconComponent size={12} color="#fbbf24" />
                    <span>{badge.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Markets & Indian Trading Searches (SEO Indexing) */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '14px', marginBottom: '14px', fontSize: '11px', color: '#64748b', lineHeight: '1.8' }}>
          <span style={{ color: '#fbbf24', fontWeight: 700, marginRight: '6px' }}>POPULAR MARKETS &amp; SEARCHES:</span>
          <span>Tata Motors • Reliance Industries • Bajaj Finance • Infosys • State Bank of India • HDFC Bank • ICICI Bank • ITC • Zomato • Jio Financial • Bitcoin (BTC) • Ethereum (ETH) • Solana (SOL) • Instant UPI Deposit Trading Platform • 1-Click Stock Exit Refund • 5:00 AM Daily Yield Engine • Zero Brokerage Staking • PAYNEX Android APK &amp; iOS App</span>
        </div>

        {/* Simple Bottom Copyright Bar (No Regulatory Wall) */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <span>© 2018 - 2026 PAYNEX CRYPTO. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}>Privacy Policy</a>
            <span>•</span>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}>Terms of Service</a>
            <span>•</span>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
