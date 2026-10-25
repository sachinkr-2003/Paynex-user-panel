import { useState } from 'react';
import userApi from '../services/api';
import { showUserToast, showUserSuccess, showUserError } from '../utils/swal';

export default function ApkRegisterScreen({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      showUserError('Name Required', 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      showUserError('Email Required', 'Please enter your email address.');
      return;
    }
    if (!phone.trim()) {
      showUserError('Phone Required', 'Please enter your mobile number.');
      return;
    }
    if (!password.trim()) {
      showUserError('Password Required', 'Please enter a secure password.');
      return;
    }
    if (!agreedToTerms) {
      showUserError('Terms Agreement', 'Please agree to Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await userApi.register(name.trim(), email.trim(), phone.trim(), password.trim(), referralCode.trim());
      if (res && res.success && res.user) {
        if (res.token) {
          localStorage.setItem('paynex_token', res.token);
          localStorage.setItem('paynex_user_token', res.token);
        }
        localStorage.setItem('paynex_user', JSON.stringify(res.user));
        localStorage.setItem('paynex_real_bal', res.user.balance ?? 0);
        showUserToast(`Welcome to PAYNEX, ${res.user.name}!`);
        onRegisterSuccess(res.user);
        return;
      } else {
        showUserError('Registration Failed', res?.message || 'Could not complete registration. Please try again.');
      }
    } catch (err) {
      showUserError('Registration Notice', err.message || 'User already exists or network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#07070A',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        boxSizing: 'border-box',
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Back Navigation Arrow matching Flutter AppBar */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 0',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
            <span>Back to Login</span>
          </button>
        </div>

        {/* Headline & Subtitle */}
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
          }}
        >
          Create Your Account
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Join</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#FBBF24' }}>PAYNEX</span>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>today</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* 1. Full Name */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  paddingLeft: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  padding: '14px 14px 14px 12px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* 2. Email Address */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  paddingLeft: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  padding: '14px 14px 14px 12px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* 3. Mobile Number */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  paddingLeft: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  padding: '14px 14px 14px 12px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* 4. Password */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  paddingLeft: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  padding: '14px 44px 14px 12px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 5. Referral Code (Optional) */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  paddingLeft: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12"></polyline>
                  <rect x="2" y="7" width="20" height="5"></rect>
                  <line x1="12" y1="22" x2="12" y2="7"></line>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
              </div>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Referral Code (Optional)"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  padding: '14px 14px 14px 12px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '26px' }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              id="terms-checkbox"
              style={{
                accentColor: '#FBBF24',
                width: '18px',
                height: '18px',
                marginTop: '2px',
                cursor: 'pointer',
              }}
            />
            <label htmlFor="terms-checkbox" style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.4', cursor: 'pointer' }}>
              I agree to{' '}
              <span style={{ color: '#FBBF24', fontWeight: 700 }}>Terms & Conditions</span>
              {' '}and{' '}
              <span style={{ color: '#FBBF24', fontWeight: 700 }}>Privacy Policy</span>
            </label>
          </div>

          {/* Register Button with Gold Gradient */}
          <button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '14px',
              border: 'none',
              background: agreedToTerms ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' : '#475569',
              color: '#000000',
              fontSize: '15px',
              fontWeight: 800,
              cursor: isLoading || !agreedToTerms ? 'not-allowed' : 'pointer',
              boxShadow: agreedToTerms ? '0 4px 15px rgba(251, 191, 36, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2.5px solid #000',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Creating Account...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Footer Login Link */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Already have an account?</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#FBBF24',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            Login
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
