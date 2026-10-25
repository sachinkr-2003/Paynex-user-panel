import { useState } from 'react';
import userApi from '../services/api';
import { showUserSuccess, showUserError } from '../utils/swal';

const WithdrawModal = ({ isOpen, onClose, realBalance, onWithdrawSuccess }) => {
  const [method, setMethod] = useState('upi'); // 'upi' or 'bank'
  const [amount, setAmount] = useState(2000);
  const [upiId, setUpiId] = useState('sachin@okaxis');
  const [bankAccount, setBankAccount] = useState('918237461298');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [holderName, setHolderName] = useState('Sachin Kumar');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (numAmt <= 0) {
      showUserError('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (numAmt > realBalance) {
      showUserError(
        'Insufficient Balance',
        `Your Real Balance is <strong>₹${realBalance.toLocaleString('en-IN')}</strong>. Requested payout exceeds wallet funds.`
      );
      return;
    }

    if (!password || !password.trim()) {
      setPasswordError('Please enter your account login password to authorize withdrawal.');
      showUserError(
        'Password Required',
        'Bina login password ke withdrawal nahi kiya ja sakta. Kripya apna account login password enter karein.'
      );
      return;
    }

    setIsProcessing(true);
    setPasswordError('');
    try {
      const res = await userApi.submitWithdrawal({
        amount: numAmt,
        method: method.toUpperCase(),
        upiId: method === 'upi' ? upiId : '',
        accountNumber: method === 'bank' ? bankAccount : '',
        ifsc: method === 'bank' ? ifsc : '',
        accountHolder: holderName,
        password: password.trim(),
      });

      if (res && res.success === false) {
        setIsProcessing(false);
        setPasswordError(res.message || 'Incorrect password.');
        showUserError('Password Verification Failed', res.message || 'Incorrect login password.');
        return;
      }

      setIsProcessing(false);
      setSuccessMsg(true);
      if (onWithdrawSuccess) {
        onWithdrawSuccess(numAmt);
      }
      setTimeout(() => {
        setSuccessMsg(false);
        setPassword('');
        onClose();
        showUserSuccess(
          'Withdrawal Initiated',
          `₹${numAmt.toLocaleString('en-IN')} payout has been verified with password & queued for IMPS instant settlement.`
        );
      }, 1500);
    } catch (err) {
      setIsProcessing(false);
      const errMsg = err?.message || 'Incorrect password.';
      setPasswordError(errMsg);
      showUserError(
        'Password Verification Failed',
        errMsg.includes('Password') || errMsg.includes('password')
          ? errMsg
          : `Withdrawal authorization failed: ${errMsg}`
      );
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
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="cyber-card modal-responsive-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 30px) clamp(16px, 3.5vw, 26px)',
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
              Withdraw Funds • PAY<span style={{ color: '#fbbf24' }}>NEX</span>
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
              Available Balance: <strong style={{ color: '#10b981' }}>₹{realBalance.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        {/* Withdrawal Method Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '18px',
          }}
        >
          <button
            type="button"
            onClick={() => setMethod('upi')}
            style={{
              background: method === 'upi' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              border: 'none',
              color: method === 'upi' ? '#000' : '#fff',
              padding: '8px 0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ⚡ Instant UPI
          </button>
          <button
            type="button"
            onClick={() => setMethod('bank')}
            style={{
              background: method === 'bank' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              border: 'none',
              color: method === 'bank' ? '#000' : '#fff',
              padding: '8px 0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🏦 IMPS Bank Transfer
          </button>
        </div>

        <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Withdrawal Amount (₹)
            </label>
            <input
              type="number"
              required
              min="100"
              max={realBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
            {/* Quick Chips */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[100, 500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#fbbf24',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  ₹{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(realBalance)}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #fbbf24',
                  borderRadius: '6px',
                  color: '#fbbf24',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                Max
              </button>
            </div>
          </div>

          {method === 'upi' ? (
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Your UPI ID (VPA)
              </label>
              <input
                type="text"
                required
                placeholder="mobile@upi / username@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    required
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Account Login Password Authorization */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(0, 0, 0, 0.3))',
              border: passwordError ? '1.5px solid #ef4444' : '1.2px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '14px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔒</span>
                <span>Enter Withdrawal Password or Account Password (Required) *</span>
              </label>
            </div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: '#0a0b12',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '10px',
              }}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter withdrawal PIN or login password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 42px 12px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
            {passwordError ? (
              <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px', fontWeight: 700 }}>
                ⚠️ {passwordError}
              </div>
            ) : (
              <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '6px' }}>
                🛡️ Security Check: Jis password se aap apna account login karte hain, usi se verify hone ke baad hi payout transfer hoga.
              </div>
            )}
          </div>

          {successMsg ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
                color: '#34d399',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              ✓ Withdrawal Request of ₹{Number(amount).toLocaleString('en-IN')} Submitted! Funds will arrive within 15 minutes.
            </div>
          ) : (
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-cyber-primary"
              style={{ width: '100%', padding: '14px 0', fontSize: '15px', marginTop: '6px' }}
            >
              {isProcessing ? 'Processing Transaction...' : `Confirm Withdrawal of ₹${Number(amount).toLocaleString('en-IN')}`}
            </button>
          )}

          <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: 0 }}>
            🔒 Safe & Secure 256-bit IMPS / UPI processing with 0% fee.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
