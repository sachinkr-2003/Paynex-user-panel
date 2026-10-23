const STEPS = [
  {
    n: '01',
    title: 'Create Account & Claim ₹50K',
    desc: 'Sign up in 10 seconds. Claim ₹50,000 free demo practice funds instantly with no KYC required.',
    icon: '👤',
    color: '#2563eb',
  },
  {
    n: '02',
    title: 'Deposit via UPI or USDT',
    desc: 'Deposit instantly in INR via PhonePe/GPay or transfer USDT on TRC-20 with zero network fees.',
    icon: '💳',
    color: '#38bdf8',
  },
  {
    n: '03',
    title: 'Predict & Place Bet (Call/Put)',
    desc: 'Choose your asset (BTC, ETH, SOL), pick your expiry (30s or 60s), and forecast market direction.',
    icon: '📈',
    color: '#10b981',
  },
  {
    n: '04',
    title: 'Win Up to 95% & Instant Cashout',
    desc: 'Collect your high-yield payout and withdraw directly to your bank account or crypto address in 30s.',
    icon: '🏆',
    color: '#fbbf24',
  },
];

const HowItWorks = ({ onOpenAuth }) => {
  return (
    <section
      id="how-it-works"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '90px 24px',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#fbbf24',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          SEAMLESS 4-STEP ONBOARDING
        </span>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '12px',
          }}
        >
          How to Start <span className="gradient-text-gold">Winning Today</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
          From account setup to instant profits in under 2 minutes. Simple, transparent, and built for speed.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="cyber-card"
            style={{
              padding: '28px 22px',
              borderRadius: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(10, 12, 36, 0.75)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${s.color}60`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: `0 0 20px ${s.color}35`,
                  }}
                >
                  {s.icon}
                </div>

                <span
                  className="font-mono"
                  style={{
                    fontSize: '26px',
                    fontWeight: 900,
                    color: s.color,
                    opacity: 0.8,
                  }}
                >
                  {s.n}
                </span>
              </div>

              <h3
                className="font-display"
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '10px',
                }}
              >
                {s.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.65 }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
