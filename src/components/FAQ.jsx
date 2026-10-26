import { useState } from 'react';

const FAQS = [
  {
    q: 'What is Crypto Bet Trading on PAYNEX?',
    a: 'Crypto Bet Trading allows you to forecast whether the price of an asset (like Bitcoin, Ethereum, or Solana) will rise (CALL) or fall (PUT) within a specific timeframe (e.g. 30 seconds or 60 seconds). If your prediction is correct when the contract expires, you earn an instant profit payout of up to 95%.',
  },
  {
    q: 'What is the PAYNEX 8-Year Capital Protection Warranty & Solvency Guarantee?',
    a: 'Operating continuously without default since 2018 (over 8+ years), PAYNEX provides an institutional 100% Capital Assurance Warranty. User deposits and staking balances are held in 1:1 backed cold-storage multi-signature escrow vaults. Our 8-year unbroken solvency record guarantees that your principal capital and payouts are 100% protected and instantly withdrawable 24/7 without default risk.',
  },
  {
    q: 'How fast are UPI & USDT Withdrawals processed?',
    a: 'PAYNEX features automated payment settlement rails. UPI disbursements directly to your PhonePe, Google Pay, or Paytm bank account are typically completed within 30 seconds. USDT (TRC-20 and BEP-20) withdrawals are confirmed on-chain in under 1 minute with 0 platform fees.',
  },
  {
    q: 'Can I practice with Demo Funds before risking real money?',
    a: 'Yes! Every new trader is automatically credited with ₹50,000 in free Demo Practice Credits. You can execute simulated Call and Put trades, test indicator strategies, and reset your balance anytime without risking real funds.',
  },
  {
    q: 'What is the minimum deposit and minimum trade size?',
    a: 'You can begin with as low as ₹200 for UPI deposits and as little as ₹100 per bet contract. This allows beginners to start comfortably and scale their volume over time.',
  },
  {
    q: 'How does PAYNEX guarantee fairness and zero manipulation?',
    a: 'PAYNEX aggregates direct price feeds from Binance, Bybit, and OKX via WebSocket API. All contract expiry prices are cryptographically verifiable and locked by immutable smart-order match engines.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section
      id="faq"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(50px, 8vw, 90px) clamp(12px, 3vw, 24px)',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
          FREQUENTLY ASKED QUESTIONS
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
          Everything You <span className="gradient-text-gold">Need to Know</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#94a3b8' }}>
          Clear answers about trading, contract payouts, deposit gateways, and account security.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="cyber-card"
              style={{
                borderRadius: '16px',
                padding: '20px 24px',
                cursor: 'pointer',
                border: isOpen ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isOpen ? 'rgba(18, 22, 45, 0.9)' : 'rgba(10, 13, 31, 0.7)',
                boxShadow: isOpen ? '0 0 20px rgba(245, 158, 11, 0.15)' : 'none',
                transition: 'all 0.25s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>
                  {item.q}
                </h4>
                <span
                  style={{
                    fontSize: '18px',
                    color: isOpen ? '#38bdf8' : '#94a3b8',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </div>

              {isOpen && (
                <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
