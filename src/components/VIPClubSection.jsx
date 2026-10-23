import { useState } from 'react';

const TIERS = [
  {
    name: 'Bronze Trader',
    level: 'VIP 1',
    badge: '🥉',
    color: '#cd7f32',
    req: '₹10,000 Volume',
    payout: 'Up to 90%',
    rakeback: '2.5% Daily',
    benefits: ['Standard Withdrawal (10 min)', 'Live Chat Support', 'Basic AI Signals'],
  },
  {
    name: 'Silver Elite',
    level: 'VIP 2',
    badge: '🥈',
    color: '#c0c0c0',
    req: '₹50,000 Volume',
    payout: 'Up to 92%',
    rakeback: '5.0% Weekly',
    benefits: ['Priority Instant Withdrawals', 'VIP Community Access', 'Exclusive Weekly Tournaments'],
  },
  {
    name: 'Gold Master',
    level: 'VIP 3',
    badge: '🥇',
    color: '#f59e0b',
    req: '₹2,50,000 Volume',
    payout: 'Up to 95%',
    rakeback: '10.0% Weekly',
    popular: true,
    benefits: ['Dedicated VIP Relationship Mgr', 'Sub-Second Settlement', 'Custom Higher Bet Limits', '10% Weekly Rakeback'],
  },
  {
    name: 'Diamond Whale',
    level: 'VIP 4',
    badge: '💎',
    color: '#06b6d4',
    req: '₹10,00,000+ Volume',
    payout: 'Up to 98%',
    rakeback: '18.0% Monthly',
    benefits: ['98% Peak Contract Payouts', 'Unlimited Zero-Fee Cashouts', 'Luxury Gifts & VIP Trips', 'Private Telegram Desk'],
  },
];

const VIPClubSection = ({ onOpenAuth }) => {
  return (
    <section
      id="vip"
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
          EXCLUSIVE REWARDS PROGRAM
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
          Level Up with <span className="gradient-text-gold">PAYNEX VIP Club</span>
        </h2>
        <p style={{ fontSize: 'clamp(13px, 2.8vw, 15px)', color: '#94a3b8', maxWidth: '580px', margin: '0 auto' }}>
          Trade, accumulate volume, and unlock industry-leading rakebacks, personal managers, and boosted contract multipliers.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px',
        }}
      >
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="cyber-card"
            style={{
              padding: '28px 22px',
              borderRadius: '24px',
              border: tier.popular ? '1.5px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.22)',
              background: tier.popular
                ? 'linear-gradient(160deg, rgba(38, 28, 8, 0.9) 0%, rgba(10, 13, 31, 0.95) 100%)'
                : 'rgba(10, 13, 31, 0.75)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: tier.popular ? '0 0 35px rgba(245, 158, 11, 0.25)' : 'none',
            }}
          >
            {tier.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '18px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  letterSpacing: '1px',
                }}
              >
                MOST POPULAR
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '28px' }}>{tier.badge}</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {tier.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: tier.color, fontWeight: 700 }}>
                    {tier.level}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  padding: '12px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>Volume Requirement</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{tier.req}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>Max Payout</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>{tier.payout}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                  <span>Rakeback / Cashback</span>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>{tier.rakeback}</span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {tier.benefits.map((b) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                    <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenAuth && onOpenAuth('signup')}
              className={tier.popular ? 'btn-cyber-primary' : 'btn-cyber-outline'}
              style={{ width: '100%', fontSize: '13px', padding: '10px 0' }}
            >
              Unlock VIP Tier ➔
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VIPClubSection;
