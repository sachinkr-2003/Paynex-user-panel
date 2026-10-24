const reviews = [
  {
    name: 'Rahul Sharma',
    review: '"PAYNEX has made it so fast and easy to trade contracts. Sub-second execution and instant 30-sec UPI withdrawals!"',
    rating: 5,
    initials: 'RS',
    color: '#2563eb',
  },
  {
    name: 'Priya Singh',
    review: '"I love the clean dark UI and real-time live trading signals. Whenever I had a withdrawal query, support settled it in minutes."',
    rating: 5,
    initials: 'PS',
    color: '#38bdf8',
  },
  {
    name: 'Amit Varma',
    review: '"Best crypto trading platform with up to 98% VIP payouts. Invest Today and Grow Tomorrow is truly their standard."',
    rating: 5,
    initials: 'AV',
    color: '#f59e0b',
  },
];

const Stars = ({ count }) => (
  <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < count ? '#f59e0b' : '#374151', fontSize: '14px' }}>★</span>
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section style={{
      padding: '100px 48px',
      background: 'linear-gradient(180deg, #03040a 0%, #070919 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
            WHAT OUR TRADERS SAY
          </p>
          <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#fff' }}>
            Trusted by <span className="gradient-text-gold">Thousands</span>
          </h2>
        </div>

        {/* Review Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className="cyber-card"
              style={{
                borderRadius: '16px', padding: '28px',
                background: 'rgba(10, 13, 31, 0.75)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${r.color}, ${r.color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '14px', color: '#fff', flexShrink: 0,
                  boxShadow: `0 0 15px ${r.color}66`,
                }}>
                  {r.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{r.name}</div>
                </div>
              </div>

              <Stars count={r.rating} />

              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7 }}>{r.review}</p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 0 ? '24px' : '8px', height: '8px',
              borderRadius: '4px',
              background: i === 0 ? '#f59e0b' : 'rgba(245,158,11,0.25)',
              boxShadow: i === 0 ? '0 0 10px #f59e0b' : 'none',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
