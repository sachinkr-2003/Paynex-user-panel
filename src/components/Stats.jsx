const stats = [
  { icon: '😊', value: '50K+', label: 'Happy Users' },
  { icon: '💳', value: '₹2.5Cr+', label: 'Total Transactions' },
  { icon: '✅', value: '99.9%', label: 'Platform Uptime' },
];

const Stats = () => {
  return (
    <section style={{
      padding: '80px 48px',
      background: 'linear-gradient(135deg, #070919 0%, #05060e 50%, #0a0d24 100%)',
      position: 'relative',
    }}>
      {/* BG Glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', alignItems: 'center' }}>
          {/* Left text */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
              OUR IMPACT
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '16px' }}>
              Growing <span className="gradient-text-gold">Together</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>
              Join thousands of traders who are already building their financial future with PAYNEX.
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {stats.map(stat => (
              <div
                key={stat.label}
                className="cyber-card"
                style={{
                  borderRadius: '16px', padding: '28px 20px',
                  textAlign: 'center',
                  background: 'rgba(10, 13, 31, 0.75)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', margin: '0 auto 16px',
                }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#fbbf24', marginBottom: '6px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
