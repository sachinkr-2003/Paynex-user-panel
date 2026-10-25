import { useState, useRef, useEffect } from 'react';

const Footer = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Slightly slower, cinematic 3D motion
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch(() => {
            // Autoplay might be restricted; video will stay paused or canvas will show
          });
      }
    }
  }, []);

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#030408',
        borderTop: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 -20px 50px rgba(0, 0, 0, 0.85)',
        overflow: 'hidden',
        color: '#f8fafc',
      }}
    >
      {/* ============================================================== */}
      {/* 1. 3D ANIMATION VIDEO BACKGROUND & CYBER LIGHTING */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Real 3D Cubes / Blockchain Animation Video */}
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
            opacity: videoLoaded ? 0.38 : 0.22,
            transition: 'opacity 1.2s ease',
            filter: 'saturate(1.4) contrast(1.15) hue-rotate(5deg)',
          }}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/videos/footer-3d-bg.webm" type="video/webm" />
        </video>

        {/* Dynamic Multi-Stop Gradient Overlays (ensures 100% crystal clear legibility) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 50% 15%, rgba(15, 23, 42, 0.45) 0%, rgba(4, 5, 11, 0.88) 65%, #020306 100%),
              linear-gradient(180deg, rgba(3, 4, 8, 0.8) 0%, rgba(4, 5, 12, 0.65) 50%, #020306 100%)
            `,
          }}
        />

        {/* Ambient Top Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #fbbf24, #38bdf8, transparent)',
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.65)',
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* 2. FOOTER CONTENT CONTAINER */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1360px',
          margin: '0 auto',
          padding: 'clamp(40px, 6vw, 70px) clamp(16px, 4vw, 36px) 30px',
        }}
      >
        {/* Top Feature Banner: High-Yield Platform Snapshot */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(8, 10, 20, 0.85))',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(245, 158, 11, 0.28)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '48px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <h3
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: "'Space Grotesk', sans-serif",
                  margin: 0,
                }}
              >
                Experience Institutional 3D Trading &amp; Automated 5:00 AM Interest
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Direct Bank IMPS Withdrawals, 95% Real-Time Prediction Payouts &amp; Multi-Asset Staking.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fbbf24',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span>3D Engine: 6ms Latency</span>
            </div>

            <a
              href="#trading-arena"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                color: '#05070f',
                fontWeight: 800,
                fontSize: '12px',
                padding: '8px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                letterSpacing: '0.5px',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              TRADE NOW ➔
            </a>
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(28px, 4vw, 44px)',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand Info & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '2px solid rgba(245, 158, 11, 0.75)',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)',
                  flexShrink: 0,
                  background: '#090b16',
                }}
              >
                <img
                  src="/paynex-logo.jpg"
                  alt="PAYNEX Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '22px',
                      fontWeight: 900,
                      color: '#fff',
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: '1px',
                    }}
                  >
                    PAY<span style={{ color: '#fbbf24', textShadow: '0 0 12px rgba(245, 158, 11, 0.6)' }}>NEX</span>
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 900,
                      color: '#fbbf24',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      letterSpacing: '1px',
                    }}
                  >
                    CRYPTO
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#fbbf24', margin: '2px 0 0', fontWeight: 600 }}>
                  Invest Today and Grow Tomorrow
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '20px' }}>
              Premier 3D cryptocurrency &amp; stock prediction exchange offering ultra-low latency execution, daily 5:00 AM interest compounding, and verified direct Bank IMPS settlements.
            </p>

            {/* Live Operational Metrics */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Network Uptime</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>99.98% High Availability</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>24H Trading Volume</span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>₹184.92M+</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Settlement Cycle</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>Automated 5:00 AM IST</span>
              </div>
            </div>
          </div>

          {/* Column 2: Trading Products */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#fbbf24' }}>◆</span> TRADING PRODUCTS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
              <a
                href="#trading-arena"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <span>3D Bet Trading Simulator</span>
                <span style={{ fontSize: '9px', background: '#10b981', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: 800 }}>LIVE</span>
              </a>
              <a
                href="#markets"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Bitcoin (BTC) &amp; Ethereum (ETH) Options
              </a>
              <a
                href="#markets"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Nifty 50, Tata Motors &amp; Reliance Stock Desk
              </a>
              <a
                href="#vip"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                VIP Whale Club &amp; High-Yield Staking
              </a>
              <a
                href="#mobile-app"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Android APK App v1.2 (Direct Install)
              </a>
            </div>
          </div>

          {/* Column 3: Payment & Settlement Rails */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#38bdf8' }}>◆</span> SETTLEMENT RAILS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>Direct Bank Account Withdrawal (No UPI required)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>Automated NPCI Admin QR Payout Generation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>USDT Tether (TRC-20 &amp; BEP-20 Multi-Chain)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>100% Cold Storage Backing &amp; Solvency Audits</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <span>Instant Deposit Crediting (GPay, PhonePe, Paytm)</span>
              </div>
            </div>
          </div>

          {/* Column 4: Community & VIP Signals */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#ec4899' }}>◆</span> VIP COMMUNITY
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              Join 50,000+ verified active traders receiving daily market signals, technical forecasts, and whale insights.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              {[
                { name: 'Telegram VIP', color: '#229ED9' },
                { name: 'WhatsApp Desk', color: '#25D366' },
                { name: 'Twitter / X', color: '#1DA1F2' },
                { name: 'Discord Hub', color: '#5865F2' },
              ].map((item) => (
                <button
                  key={item.name}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
                    e.currentTarget.style.color = '#fbbf24';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                  {item.name}
                </button>
              ))}
            </div>

            {/* Simulated 256-Bit SSL Trust Seal */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: '#10b981',
                fontWeight: 600,
              }}
            >
              <span>🔒</span>
              <span>256-Bit Bank-Grade SSL &amp; End-to-End Encryption</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. RISK DISCLAIMER & COPYRIGHT COMPLIANCE */}
        {/* ============================================================== */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
            fontSize: '11px',
            color: '#64748b',
            lineHeight: 1.8,
            textAlign: 'center',
          }}
        >
          <p style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#94a3b8' }}>Regulatory &amp; Risk Disclosure:</strong> Financial derivatives, binary options, and digital asset trading involve substantial risk of capital loss. Past algorithmic performance or simulation metrics are not indicative of future returns. PAYNEX provides risk-free virtual demo environments for skill mastery. Automated 5:00 AM IST interest is subject to staking asset conditions.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', color: '#475569', fontSize: '11px' }}>
            <span>© 2026 PAYNEX CRYPTO EXCHANGE LTD. All rights reserved.</span>
            <span>•</span>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <span>•</span>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <span>•</span>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
