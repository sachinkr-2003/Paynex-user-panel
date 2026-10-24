const MobileApp = () => {
  return (
    <section
      id="mobile-app"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(50px, 8vw, 90px) clamp(12px, 3vw, 24px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      <div
        className="cyber-card mobile-app-grid"
        style={{
          borderRadius: '32px',
          padding: 'clamp(24px, 4vw, 50px) clamp(16px, 3vw, 36px)',
          background: 'linear-gradient(135deg, rgba(14, 18, 38, 0.9) 0%, rgba(5, 6, 14, 0.98) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 50px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Left: 3D Phone App Screen Showcase */}
        <div style={{ display: 'flex', justifyContent: 'center', perspective: '1000px' }}>
          <div
            className="animate-float-smooth"
            style={{
              width: 'min(260px, 80vw)',
              height: '520px',
              borderRadius: '40px',
              background: 'linear-gradient(180deg, #0d1226 0%, #05060e 100%)',
              border: '3px solid rgba(245, 158, 11, 0.55)',
              boxShadow: '0 0 45px rgba(245, 158, 11, 0.25), 0 0 30px rgba(37, 99, 235, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {/* Notch */}
            <div
              style={{
                width: '90px',
                height: '14px',
                background: '#040510',
                borderRadius: '0 0 12px 12px',
                margin: '-16px auto 14px',
              }}
            />

            {/* App Top Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src="/paynex-logo.jpg" alt="PAYNEX" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff' }}>PAY<span style={{ color: '#fbbf24' }}>NEX</span></span>
                </div>
                <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>LIVE ●</span>
              </div>

              {/* Wallet Card inside Phone */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(37, 99, 235, 0.25) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Real Balance (UPI / USDT)</div>
                <div className="font-mono" style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24', margin: '4px 0 10px' }}>
                  ₹84,250.00
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '4px 6px', fontSize: '9px', textAlign: 'center', color: '#38bdf8' }}>
                    +₹12,400 Today
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '4px 6px', fontSize: '9px', textAlign: 'center', color: '#34d399' }}>
                    Win Rate 84%
                  </div>
                </div>
              </div>

              {/* Mini Phone Candlestick Chart */}
              <div
                style={{
                  background: 'rgba(5, 6, 22, 0.8)',
                  borderRadius: '12px',
                  padding: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>BTC / USDT</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>$68,450.20</span>
                </div>
                {/* SVG waveform */}
                <svg width="100%" height="45" viewBox="0 0 200 45" fill="none">
                  <path d="M0,35 Q30,15 60,25 T120,10 T160,20 T200,5" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>

              {/* Quick Call / Put in App */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#10b981', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}>
                  ▲ CALL (+95%)
                </div>
                <div style={{ background: '#ef4444', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}>
                  ▼ PUT (+95%)
                </div>
              </div>
            </div>

            {/* Bottom App Nav */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '8px',
                fontSize: '14px',
              }}
            >
              <span>🏠</span>
              <span>📈</span>
              <span>💳</span>
              <span>👤</span>
            </div>
          </div>
        </div>

        {/* Right: Copy & Download App CTA */}
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            TRADE ANYTIME, ANYWHERE
          </span>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Download <span className="gradient-text-crypto">PAYNEX Mobile APK</span>
          </h2>

          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
            Experience 120Hz smooth candlestick charts, instant push notifications on winning bets, biometric login, and 1-tap UPI withdrawals directly on your Android & iOS smartphone.
          </p>

          {/* Download Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
            <button
              onClick={() => alert('PAYNEX Android APK Build v1.2 is downloading...')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)',
              }}
            >
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', opacity: 0.9 }}>Direct Download</div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>Android APK (v1.2)</div>
              </div>
            </button>

            <button
              onClick={() => alert('iOS PWA installation: Open Safari and tap "Add to Home Screen"!')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '24px' }}>🍎</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Install on iPhone</div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>iOS Web App</div>
              </div>
            </button>
          </div>

          {/* Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              'Biometric Face/Touch ID',
              'Real-Time Price Alerts',
              'Instant 30s UPI Payouts',
              'Sub-10ms Match Speed',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
