const Footer = () => {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#04050b',
        borderTop: '1px solid rgba(245, 158, 11, 0.22)',
        padding: 'clamp(40px, 6vw, 70px) clamp(12px, 3vw, 24px) 30px',
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(24px, 4vw, 40px)',
            marginBottom: '40px',
          }}
        >
          {/* Brand Info with Official Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(245, 158, 11, 0.65)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
                  flexShrink: 0,
                  background: '#05060e',
                }}
              >
                <img
                  src="/paynex-logo.jpg"
                  alt="PAYNEX CRYPTO Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div>
                <span className="font-display" style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>
                  PAY<span style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}>NEX</span>
                </span>
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                  }}
                >
                  CRYPTO
                </span>
                <p style={{ fontSize: '10px', color: '#fbbf24', margin: '2px 0 0', fontWeight: 600 }}>
                  Invest Today and Grow Tomorrow
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '20px' }}>
              Next-generation 3D crypto prediction exchange offering sub-second contract execution, 95% profit rates, and automated instant UPI & USDT settlements.
            </p>

            {/* System Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '11px',
                color: '#fbbf24',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span>All Systems Operational ● 6ms High-Speed Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '18px', letterSpacing: '0.5px' }}>
              TRADING PRODUCTS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
              <a href="#trading-arena" style={{ color: 'inherit', textDecoration: 'none' }}>3D Bet Trading Arena</a>
              <a href="#markets" style={{ color: 'inherit', textDecoration: 'none' }}>Bitcoin & Ethereum Options</a>
              <a href="#markets" style={{ color: 'inherit', textDecoration: 'none' }}>Solana High-Yield Contracts</a>
              <a href="#vip" style={{ color: 'inherit', textDecoration: 'none' }}>VIP Whale Program</a>
              <a href="#mobile-app" style={{ color: 'inherit', textDecoration: 'none' }}>Android APK v1.2</a>
            </div>
          </div>

          {/* Gateways & Security */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '18px', letterSpacing: '0.5px' }}>
              PAYMENT RAILS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
              <span>Instant UPI (PhonePe, GPay, Paytm)</span>
              <span>USDT Tether (TRC-20 Network)</span>
              <span>USDT Tether (BEP-20 Network)</span>
              <span>Direct Bank IMPS Transfer</span>
              <span>Proof of Solvency Reserves</span>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '18px', letterSpacing: '0.5px' }}>
              COMMUNITY & SUPPORT
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              Join 50,000+ active traders in our official Telegram channel for daily market signals and analysis.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['Telegram', 'Twitter / X', 'Discord', 'YouTube'].map((net) => (
                <button
                  key={net}
                  className="btn-cyber-outline"
                  style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            fontSize: '11px',
            color: '#64748b',
            lineHeight: 1.7,
            textAlign: 'center',
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#94a3b8' }}>Risk Warning:</strong> Trading binary options and cryptocurrency derivatives carries financial risk. PAYNEX provides educational demo accounts for skill development. Invest Today and Grow Tomorrow.
          </p>
          <p>© 2026 PAYNEX CRYPTO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
