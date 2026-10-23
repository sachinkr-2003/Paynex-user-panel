import { useState } from 'react';

const DepositModal = ({ isOpen, onClose, onRechargeDemo }) => {
  const [method, setMethod] = useState('upi'); // 'upi' or 'crypto'
  const [amount, setAmount] = useState(2000);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const cryptoAddress = 'TYs98nLpQmZ4xR2vK7wT3aBcE1xZ94Rt';

  const handleCopy = () => {
    navigator.clipboard?.writeText(cryptoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (onRechargeDemo) onRechargeDemo(Number(amount));
      onClose();
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(3, 4, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="cyber-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '26px',
          padding: '30px 26px',
          background: 'linear-gradient(150deg, rgba(14, 18, 44, 0.96) 0%, rgba(5, 7, 20, 0.98) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(245, 158, 11, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
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
              alt="PAYNEX Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>
              Deposit Funds • PAY<span style={{ color: '#fbbf24' }}>NEX</span>
            </h3>
            <p style={{ fontSize: '12px', color: '#fbbf24', margin: '2px 0 0', fontWeight: 600 }}>
              Invest Today and Grow Tomorrow
            </p>
          </div>
        </div>

        {/* Method Toggle: UPI vs Crypto */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => setMethod('upi')}
            style={{
              background: method === 'upi' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '9px 0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🇮🇳 Instant UPI (INR)
          </button>
          <button
            onClick={() => setMethod('crypto')}
            style={{
              background: method === 'crypto' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              color: method === 'crypto' ? '#120a00' : '#fff',
              border: 'none',
              padding: '9px 0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: method === 'crypto' ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
            }}
          >
            ₮ USDT / Crypto
          </button>
        </div>

        {method === 'upi' ? (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Deposit Amount (INR)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    style={{
                      background: amount === amt ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${amount === amt ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: '#fff',
                      padding: '8px 0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Mockup */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  background: '#fff',
                  borderRadius: '12px',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                }}
              >
                {/* SVG QR Code Simulation */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="#000">
                  <rect x="0" y="0" width="30" height="30" fill="#000" />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" fill="#000" />
                  <rect x="70" y="0" width="30" height="30" fill="#000" />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" fill="#000" />
                  <rect x="0" y="70" width="30" height="30" fill="#000" />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" fill="#000" />
                  <rect x="40" y="10" width="10" height="20" fill="#000" />
                  <rect x="40" y="40" width="20" height="20" fill="#000" />
                  <rect x="70" y="70" width="20" height="10" fill="#000" />
                  <rect x="80" y="50" width="10" height="20" fill="#000" />
                  <rect x="20" y="40" width="10" height="20" fill="#000" />
                </svg>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                Scan with PhonePe / GPay / Paytm for instant credit
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                Deposit USDT (TRC-20 Network):
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '12px',
                  color: '#38bdf8',
                  wordBreak: 'break-all',
                  marginBottom: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                {cryptoAddress}
              </div>
              <button
                onClick={handleCopy}
                className="btn-cyber-outline"
                style={{ width: '100%', padding: '8px 0', fontSize: '12px' }}
              >
                {copied ? '✓ Address Copied!' : 'Copy TRC-20 Wallet Address'}
              </button>
            </div>
          </div>
        )}

        {success ? (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              color: '#34d399',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            ✓ ₹{amount.toLocaleString('en-IN')} Credited to Account!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleSimulatePayment}
              className="btn-cyber-bull"
              style={{ width: '100%', padding: '12px 0', fontSize: '14px' }}
            >
              Simulate Instant Deposit (₹{amount})
            </button>
            <button
              onClick={() => {
                if (onRechargeDemo) onRechargeDemo(50000);
                onClose();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#fbbf24',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                padding: '6px',
              }}
            >
              + Recharge Free Demo Account with ₹50,000
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositModal;
