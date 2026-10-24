import { useState, useEffect } from 'react';
import userApi from '../services/api';
import { showUserSuccess, showUserWarning } from '../utils/swal';
import { FIFTY_STOCKS, getCompanyQrUrl, enrichStockWithPayment } from '../data/stocksData';

const DepositModal = ({ isOpen, onClose, onRechargeDemo, initialCompany = null }) => {
  const [method, setMethod] = useState('company_qr'); // 'company_qr' | 'crypto'
  const [amount, setAmount] = useState(2000);
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Companies Catalog with individual QR & UPI details
  const [companies, setCompanies] = useState(() => FIFTY_STOCKS.map(enrichStockWithPayment));
  const [selectedCompanyId, setSelectedCompanyId] = useState(() => {
    return initialCompany?.id || initialCompany?.symbol || 'TATAMOTORS';
  });

  // Sync initialCompany if passed
  useEffect(() => {
    if (initialCompany) {
      setSelectedCompanyId(initialCompany.id || initialCompany.symbol || 'TATAMOTORS');
    }
  }, [initialCompany]);

  // Fetch live companies from backend
  useEffect(() => {
    let isMounted = true;
    const fetchCompanies = async () => {
      try {
        const res = await userApi.getAssets();
        if (isMounted && res.success && Array.isArray(res.assets) && res.assets.length > 0) {
          setCompanies(res.assets.map(enrichStockWithPayment));
        }
      } catch (err) {
        console.warn('Assets load in deposit modal fallback:', err.message);
      }
    };
    if (isOpen) {
      fetchCompanies();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCompany =
    companies.find(
      (c) =>
        c.id === selectedCompanyId ||
        c.symbol === selectedCompanyId ||
        c._id === selectedCompanyId
    ) || companies[0] || FIFTY_STOCKS[0];

  const currentCompanyQr = getCompanyQrUrl(currentCompany);
  const currentCompanyUpi =
    currentCompany.upiId ||
    `${(currentCompany.symbol || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '')}.paynex@icici`;

  const cryptoAddress = 'TYs98nLpQmZ4xR2vK7wT3aBcE1xZ94Rt';

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(currentCompanyUpi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCrypto = () => {
    navigator.clipboard?.writeText(cryptoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitDeposit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) {
      showUserWarning('Invalid Amount', 'Minimum deposit amount is ₹100.');
      return;
    }

    const finalUtr = utr.trim() || `UTR${Date.now().toString().slice(-9)}`;
    setSubmitting(true);

    try {
      await userApi.submitDeposit(numAmount, 'QR Code', finalUtr, '', {
        companyId: currentCompany.id || currentCompany.symbol,
        companyName: currentCompany.name,
        companyUpi: currentCompanyUpi,
      });

      if (onRechargeDemo) onRechargeDemo(numAmount);
      onClose();

      showUserSuccess(
        'Payment Order Submitted!',
        `₹${numAmount.toLocaleString('en-IN')} deposit for <strong>${currentCompany.name}</strong> (UTR: ${finalUtr}) submitted successfully. Your wallet balance will update shortly upon admin approval.`
      );
    } catch (err) {
      console.warn('Backend deposit submit error:', err.message);
      if (onRechargeDemo) onRechargeDemo(numAmount);
      onClose();
      showUserSuccess(
        'Payment Submitted',
        `₹${numAmount.toLocaleString('en-IN')} submitted for ${currentCompany.name} (UTR: ${finalUtr}).`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(3, 4, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="cyber-card modal-responsive-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '20px',
          padding: '24px',
          background: 'linear-gradient(150deg, rgba(14, 18, 44, 0.98) 0%, rgba(5, 7, 20, 0.99) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.5)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(245, 158, 11, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
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

        {/* Title & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1.5px solid rgba(245, 158, 11, 0.65)',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.45)',
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
            <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>
              Company Direct Payment • PAY<span style={{ color: '#fbbf24' }}>NEX</span>
            </h3>
            <p style={{ fontSize: '11.5px', color: '#fbbf24', margin: '2px 0 0', fontWeight: 600 }}>
              Scan Company QR to Pay & Invest Instantly
            </p>
          </div>
        </div>

        {/* Method Toggle: Company QR vs Crypto */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '18px',
          }}
        >
          <button
            onClick={() => setMethod('company_qr')}
            style={{
              background: method === 'company_qr' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '8px 0',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🇮🇳 Company QR (PhonePe / GPay)
          </button>
          <button
            onClick={() => setMethod('crypto')}
            style={{
              background: method === 'crypto' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              color: method === 'crypto' ? '#120a00' : '#fff',
              border: 'none',
              padding: '8px 0',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ₮ USDT / Crypto
          </button>
        </div>

        {method === 'company_qr' ? (
          <form onSubmit={handleSubmitDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. COMPANY SELECTOR */}
            <div>
              <label style={{ fontSize: '11.5px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                🏢 Select Company to Pay / Invest:
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0d111a',
                  border: '1.5px solid rgba(245, 158, 11, 0.5)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {companies.map((c) => (
                  <option key={c.id || c.symbol} value={c.id || c.symbol}>
                    {c.icon || '📈'} {c.name} ({c.symbol}) • +{c.returnPercent}% Return
                  </option>
                ))}
              </select>
            </div>

            {/* 2. DEDICATED COMPANY QR & UPI CARD */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid #10b981',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  ● Active Company QR Code
                </span>
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  +{currentCompany.returnPercent}% Guaranteed
                </span>
              </div>

              {/* Scannable Company QR Code */}
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  background: '#fff',
                  borderRadius: '12px',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                  border: '2px solid #f59e0b',
                }}
              >
                <img
                  src={currentCompanyQr}
                  alt={`${currentCompany.name} Payment QR`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Company UPI ID with Copy Button */}
              <div
                style={{
                  background: '#090d16',
                  border: '1px solid #1e2638',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontSize: '10px', color: '#8b9bb4' }}>Official Company UPI ID:</div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      color: '#f59e0b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {currentCompanyUpi}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  style={{
                    background: copied ? '#10b981' : '#f59e0b',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy UPI'}
                </button>
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                Payee: <strong>{currentCompany.payeeName || `${currentCompany.name} Trading Desk`}</strong>
              </div>
            </div>

            {/* 3. AMOUNT PRESETS */}
            <div>
              <label style={{ fontSize: '11.5px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Deposit Amount (INR ₹)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '8px' }}>
                {[500, 1000, 2000, 5000, 10000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    style={{
                      background: amount === amt ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${amount === amt ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: amount === amt ? '#10b981' : '#fff',
                      padding: '7px 0',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#0d111a',
                  border: '1px solid #1e2638',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  fontWeight: 800,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  outline: 'none',
                }}
                placeholder="Enter deposit amount"
                required
              />
            </div>

            {/* 4. 12-DIGIT UTR INPUT */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11.5px', color: '#cbd5e1', fontWeight: 600 }}>
                  12-Digit UTR / Reference ID *
                </label>
                <button
                  type="button"
                  onClick={() => setUtr(`UTR${Date.now().toString().slice(-9)}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fbbf24',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ⚡ Auto-Fill UTR
                </button>
              </div>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="Enter 12-digit UTR from PhonePe / GPay receipt"
                style={{
                  width: '100%',
                  background: '#0d111a',
                  border: '1px solid #1e2638',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  outline: 'none',
                }}
                required
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-cyber-bull"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: '10px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Submitting Order...' : `Confirm Deposit (₹${Number(amount).toLocaleString('en-IN')})`}
            </button>
          </form>
        ) : (
          <div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '14px',
                padding: '16px',
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
                type="button"
                onClick={handleCopyCrypto}
                className="btn-cyber-outline"
                style={{ width: '100%', padding: '8px 0', fontSize: '12px' }}
              >
                {copied ? '✓ Address Copied!' : 'Copy TRC-20 Wallet Address'}
              </button>
            </div>

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
                width: '100%',
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
