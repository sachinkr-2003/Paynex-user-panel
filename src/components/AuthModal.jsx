import { useState, useEffect } from 'react';
import userApi from '../services/api';
import { showUserToast, showUserError } from '../utils/swal';

const AuthModal = ({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) => {
  const [tab, setTab] = useState(initialTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state (Matching Flutter APK register_screen.dart)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showUserError('Input Required', 'Please enter your email or mobile number.');
      return;
    }
    if (!loginPassword.trim()) {
      showUserError('Password Required', 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await userApi.login(loginIdentifier.trim(), loginPassword.trim());
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        const userData = result?.user || {
          name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Trader',
          email: loginIdentifier,
          phone: '+91 98765 43210',
          balance: 0,
        };
        if (result?.token) {
          localStorage.setItem('paynex_token', result.token);
          localStorage.setItem('paynex_user_token', result.token);
        }
        localStorage.setItem('paynex_user', JSON.stringify(userData));
        localStorage.setItem('paynex_real_bal', userData.balance ?? 0);

        showUserToast(`Welcome back, ${userData.name}!`);
        if (onLoginSuccess) onLoginSuccess(userData);
        onClose();
      }, 600);
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      setIsLoading(false);
      showUserError('Login Failed', err.message || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();
    const cleanPassword = registerPassword.trim();

    if (!cleanName) {
      showUserError('Name Required', 'Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      showUserError('Email Required', 'Please enter your email address.');
      return;
    }
    if (!cleanMobile) {
      showUserError('Mobile Required', 'Please enter your mobile number.');
      return;
    }
    if (cleanPassword.length < 4) {
      showUserError('Password Length', 'Password must be at least 4 characters long.');
      return;
    }
    if (!agreedToTerms) {
      showUserError('Terms Required', 'Please agree to Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await userApi.register(
        cleanName,
        cleanEmail,
        cleanMobile,
        cleanPassword,
        referralCode.trim()
      );

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        const userData = result?.user || {
          name: cleanName,
          email: cleanEmail,
          phone: cleanMobile,
          balance: 0,
        };
        if (result?.token) {
          localStorage.setItem('paynex_token', result.token);
          localStorage.setItem('paynex_user_token', result.token);
        }
        localStorage.setItem('paynex_user', JSON.stringify(userData));
        localStorage.setItem('paynex_real_bal', 0);

        showUserToast(`Account created! Welcome to PAYNEX, ${cleanName}!`);
        if (onLoginSuccess) onLoginSuccess(userData);
        onClose();
      }, 600);
    } catch (err) {
      console.warn('Backend register error:', err.message);
      setIsLoading(false);
      showUserError('Registration Notice', err.message || 'Unable to register. Email may already be in use.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(3, 4, 12, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="cyber-card modal-responsive-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 30px) clamp(16px, 3.5vw, 26px)',
          background: 'linear-gradient(155deg, rgba(14, 18, 40, 0.98) 0%, rgba(5, 7, 18, 0.99) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          boxSizing: 'border-box',
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
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
        >
          ✕
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              overflow: 'hidden',
              margin: '0 auto 10px',
              border: '1.5px solid rgba(245, 158, 11, 0.75)',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)',
              background: '#05060e',
            }}
          >
            <img
              src="/paynex-logo.jpg"
              alt="PAYNEX Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 4px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            PAY<span style={{ color: '#fbbf24' }}>NEX</span> <span style={{ fontSize: '13px', color: '#fbbf24' }}>CRYPTO</span>
          </h3>
          <p style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 600, margin: '0 0 4px' }}>
            Invest Today and Grow Tomorrow
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            {tab === 'signup' ? 'Create Your Account & Start Trading' : 'Sign in to access your trading desk'}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Register Free) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setTab('login')}
            style={{
              background: tab === 'login' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              border: 'none',
              color: tab === 'login' ? '#140c00' : '#cbd5e1',
              padding: '9px 0',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: tab === 'login' ? '0 0 16px rgba(245, 158, 11, 0.45)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            style={{
              background: tab === 'signup' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              border: 'none',
              color: tab === 'signup' ? '#140c00' : '#cbd5e1',
              padding: '9px 0',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: tab === 'signup' ? '0 0 16px rgba(245, 158, 11, 0.45)' : 'none',
            }}
          >
            Register Free
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: REGISTER FREE FORM (SAME AS FLUTTER APK)                */}
        {/* ============================================================== */}
        {tab === 'signup' ? (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 1. Full Name */}
            <div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* 2. Email Address */}
            <div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* 3. Mobile Number */}
            <div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* 4. Password */}
            <div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    paddingRight: '14px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showRegisterPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 5. Referral Code (Optional) */}
            <div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <path d="M12 8v12" />
                    <path d="M19 12H5" />
                    <path d="m16 8-4-4-4 4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Referral Code (Optional)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* 6. Terms & Conditions Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <input
                type="checkbox"
                id="modalTermsCheckbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{
                  accentColor: '#fbbf24',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              />
              <label htmlFor="modalTermsCheckbox" style={{ fontSize: '11.5px', color: '#94a3b8', cursor: 'pointer' }}>
                I agree to{' '}
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>Terms &amp; Conditions</span> and{' '}
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            {isSuccess ? (
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
                  marginTop: '8px',
                }}
              >
                ✓ Account Created! Launching Desk...
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#140c00',
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading || !agreedToTerms ? 'not-allowed' : 'pointer',
                  opacity: isLoading || !agreedToTerms ? 0.7 : 1,
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
                  marginTop: '8px',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && agreedToTerms) e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            )}

            {/* Switch to Login */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12.5px', color: '#94a3b8' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fbbf24',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '12.5px',
                }}
              >
                Login
              </button>
            </div>
          </form>
        ) : (
          /* ============================================================== */
          /* TAB 2: SIGN IN FORM                                            */
          /* ============================================================== */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email or Mobile Number */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Email or Mobile Number
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  placeholder="name@example.com or 9876543210"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '11px', cursor: 'pointer' }}
                >
                  {showLoginPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            {isSuccess ? (
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
                  marginTop: '6px',
                }}
              >
                ✓ Success! Logging into Trading Desk...
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#140c00',
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
                  marginTop: '8px',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isLoading ? 'Verifying...' : 'Sign In to Trade'}
              </button>
            )}

            {/* Switch to Register */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12.5px', color: '#94a3b8' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fbbf24',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '12.5px',
                }}
              >
                Register Free
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
