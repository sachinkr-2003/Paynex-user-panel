import { useState } from 'react';

const FAQS = [
  {
    q: 'What is PAYNEX Trading & Staking Exchange?',
    a: 'PAYNEX is a next-generation high-speed stock and cryptocurrency trading platform in India. Users can trade and stake on over 50+ leading Indian equities (like Tata Motors, Reliance, Bajaj Finance, Infosys) and global cryptocurrencies (Bitcoin, Ethereum, Solana) starting from just ₹100 with automated daily yields and instant payouts.',
  },
  {
    q: 'How do I download the official PAYNEX Android APK and iOS Web App?',
    a: 'You can download the official PAYNEX Android APK directly from our website by clicking "Android APK (54MB)" in the header or Mobile App section. For iPhone users, tap "Download for iPhone" to install the official iOS Web App profile or tap Safari Share (⎋) → "Add to Home Screen" to install it instantly in 5 seconds.',
  },
  {
    q: 'How do I deposit funds using PhonePe, Google Pay, Paytm, or UPI QR?',
    a: 'Depositing on PAYNEX is 100% seamless and instant. Tap "Deposit" or "Add Cash", choose your preferred amount (from ₹100), and tap PhonePe, GPay, or Paytm for 1-click automatic app payment, or scan the official dynamic UPI QR code. Submit your 12-digit UTR reference number, and your available balance will be credited promptly.',
  },
  {
    q: 'Can I exit an active stock contract and refund my capital anytime?',
    a: 'Yes! PAYNEX features a transparent 1-Click "Exit & Refund" mechanism. If you decide to cancel or exit an active stock or crypto contract before maturity, 100% of your invested principal capital is instantly refunded directly back into your Available Balance.',
  },
  {
    q: 'How fast are bank withdrawals processed to Indian Bank Accounts?',
    a: 'Withdrawals are processed 24/7 via automated IMPS and NEFT direct bank settlement rails. Simply enter your Bank Account Number and IFSC Code in the Withdraw tab. Once approved, funds are typically credited to your bank account (SBI, HDFC, ICICI, PNB, Paytm Payments Bank, etc.) within 5 to 15 minutes.',
  },
  {
    q: 'What is the 5:00 AM Daily Yield Engine and how are profits credited?',
    a: 'All active stock and crypto staking contracts participate in our institutional yield matching protocol. Every day at 5:00 AM IST, your guaranteed daily return (ranging from +2% to +12% based on asset Tier) is automatically calculated and credited directly to your platform earnings.',
  },
  {
    q: 'Which Indian stocks and global crypto assets are tradable on PAYNEX?',
    a: 'PAYNEX supports 50+ top NSE/BSE blue-chip equities including Tata Motors, Reliance Industries, Bajaj Finance, Infosys, TCS, HDFC Bank, ICICI Bank, State Bank of India, ITC, L&T, Zomato, and Jio Financial, alongside top cryptos like BTC/USDT, ETH/USDT, SOL/USDT, and commodities like Gold and Silver.',
  },
  {
    q: 'Is my invested capital secure with PAYNEX?',
    a: 'Yes. Operating continuously with an institutional solvency guarantee, all user deposits and staking pools are held in 1:1 backed secure treasury vaults. Contract rules, payout multipliers, and settlements are transparent and verifiable with zero hidden charges.',
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
          Clear answers about UPI deposits, 1-click stock exits, 5:00 AM daily yield engine, and instant bank withdrawals.
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
