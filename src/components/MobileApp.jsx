import React, { useState } from 'react';
import IosInstallModal from './IosInstallModal';

const MobileApp = () => {
  const [showIosModal, setShowIosModal] = useState(false);
  return (
    <section
      id="mobile-app"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(30px, 4.5vw, 55px) clamp(12px, 3vw, 24px)',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      <div
        className="cyber-card mobile-app-grid"
        style={{
          borderRadius: '24px',
          padding: 'clamp(20px, 3.5vw, 36px) clamp(16px, 3vw, 32px)',
          background: 'linear-gradient(135deg, rgba(14, 18, 38, 0.92) 0%, rgba(5, 6, 14, 0.98) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(245, 158, 11, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(24px, 4vw, 44px)',
          alignItems: 'center',
        }}
      >
        {/* Left: Compact 3D Phone App Screen Showcase */}
        <div style={{ display: 'flex', justifyContent: 'center', perspective: '1000px' }}>
          <div
            className="animate-float-smooth"
            style={{
              width: 'min(230px, 75vw)',
              height: '410px',
              borderRadius: '32px',
              background: 'linear-gradient(180deg, #0d1226 0%, #05060e 100%)',
              border: '2.5px solid rgba(245, 158, 11, 0.55)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.22), 0 0 25px rgba(37, 99, 235, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            {/* Notch */}
            <div
              style={{
                width: '74px',
                height: '11px',
                background: '#040510',
                borderRadius: '0 0 10px 10px',
                margin: '-12px auto 10px',
              }}
            />

            {/* App Screen Content */}
            <div>
              {/* App Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src="/paynex-logo.jpg" alt="PAYNEX" style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#fff' }}>PAY<span style={{ color: '#fbbf24' }}>NEX</span></span>
                </div>
                <span style={{ fontSize: '9px', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 5px', borderRadius: '4px', fontWeight: 700 }}>LIVE ●</span>
              </div>

              {/* Wallet Card inside Phone */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(37, 99, 235, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ fontSize: '9.5px', color: '#cbd5e1' }}>Real Balance (Bank / USDT)</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 900, color: '#fbbf24', margin: '3px 0 6px' }}>
                  ₹84,250.00
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '5px', padding: '3px 4px', fontSize: '8.5px', textAlign: 'center', color: '#38bdf8' }}>
                    +₹12,400 Today
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '5px', padding: '3px 4px', fontSize: '8.5px', textAlign: 'center', color: '#34d399' }}>
                    Win Rate 84%
                  </div>
                </div>
              </div>

              {/* Mini Phone Candlestick Chart */}
              <div
                style={{
                  background: 'rgba(5, 6, 22, 0.85)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', marginBottom: '4px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>BTC / USDT</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>$68,450.20</span>
                </div>
                {/* SVG waveform */}
                <svg width="100%" height="32" viewBox="0 0 200 32" fill="none">
                  <path d="M0,24 Q30,10 60,18 T120,8 T160,14 T200,4" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>

              {/* Quick Call / Put in App */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div style={{ background: '#10b981', borderRadius: '7px', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 800, color: '#fff' }}>
                  ▲ CALL (+95%)
                </div>
                <div style={{ background: '#ef4444', borderRadius: '7px', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 800, color: '#fff' }}>
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
                paddingTop: '6px',
                fontSize: '12px',
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
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            TRADE ANYTIME, ANYWHERE
          </span>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '12px',
            }}
          >
            Download <span className="gradient-text-crypto">PAYNEX Mobile APK</span>
          </h2>

          <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', maxWidth: '540px' }}>
            Experience 120Hz smooth candlestick charts, instant push notifications on winning bets, biometric login, and 1-tap fast withdrawals directly on your smartphone.
          </p>

          {/* Download Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/PAYNEX_Release_v1.0.apk';
                link.download = 'PAYNEX_Release_v1.0.apk';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '9px', opacity: 0.9 }}>Direct APK (55MB)</div>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>Android APK</div>
              </div>
            </button>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/paynex.mobileconfig';
                link.setAttribute('download', 'PAYNEX_iOS_App.mobileconfig');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setShowIosModal(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1.5px solid rgba(16, 185, 129, 0.45)',
                color: '#fff',
                padding: '9px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ fontSize: '20px' }}>🍏</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '9px', color: '#34d399', fontWeight: 800 }}>Direct Download</div>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>iOS Web App (Profile)</div>
              </div>
            </button>
          </div>

          {/* Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {[
              'Biometric Face/Touch ID',
              'Real-Time Price Alerts',
              'Instant Bank IMPS Payouts',
              'Sub-10ms Match Speed',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', fontWeight: 900, fontSize: '13px' }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <IosInstallModal isOpen={showIosModal} onClose={() => setShowIosModal(false)} />
    </section>
  );
};

export default MobileApp;
