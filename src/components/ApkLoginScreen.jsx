import { useState } from 'react';
import userApi from '../services/api';
import { showUserToast, showUserSuccess, showUserError } from '../utils/swal';

export default function ApkLoginScreen({ onLoginSuccess, onSwitchToRegister, onSwitchToLanding }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanIdentifier = emailOrPhone.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      showUserError('Input Required', 'Please enter your email or mobile number.');
      return;
    }
    if (!cleanPassword) {
      showUserError('Password Required', 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      // Attempt backend API login
      const res = await userApi.login(cleanIdentifier, cleanPassword);
      if (res && res.success && res.user) {
        if (res.token) {
          localStorage.setItem('paynex_token', res.token);
          localStorage.setItem('paynex_user_token', res.token);
        }
        localStorage.setItem('paynex_user', JSON.stringify(res.user));
        if (typeof res.user.balance === 'number') {
          localStorage.setItem('paynex_real_bal', res.user.balance);
        }
        showUserToast(`Welcome back, ${res.user.name}!`);
        onLoginSuccess(res.user);
        return;
      } else {
        showUserError('Login Failed', res?.message || 'Invalid login credentials. Please try again.');
      }
    } catch (err) {
      showUserError('Login Error', err.message || 'Incorrect email/mobile or password. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showUserToast('Password reset link sent to your registered email.');
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Mini Brand Logo matching Flutter APK */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: '8px',
            background: '#101116',
          }}
        >
          <img
            src="/paynex-logo.jpg"
            alt="Paynex Logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{ display: 'none', color: '#FBBF24', fontSize: '28px', fontWeight: 900 }}>₿</span>
        </div>

        {/* PAYNEX Brand Typography */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.5px' }}>PAY</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#FBBF24', letterSpacing: '0.5px' }}>NEX</span>
        </div>

        {/* Headline & Subtitle */}
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            textAlign: 'center',
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#94A3B8',
            margin: '0 0 28px 0',
            textAlign: 'center',
          }}
        >
          Login to your account
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Email / Mobile Field */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
                transition: 'border-color 0.2s',
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
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Email / Mobile Number"
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

          {/* Password Field */}
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0F1015',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '12px',
                transition: 'border-color 0.2s',
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

          {/* Remember Me & Forgot Password Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: '#FBBF24',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: 'none',
                border: 'none',
                color: '#FBBF24',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button with Gold Gradient */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
              color: '#000000',
              fontSize: '15px',
              fontWeight: 800,
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
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
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div style={{ height: '24px' }} />

        {/* Sign Up Link */}

        {/* Sign Up Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Don't have an account?</span>
          <button
            type="button"
            onClick={onSwitchToRegister}
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
            Sign Up
          </button>
        </div>

        {/* Subtle Landing Page Switcher for Web */}
        {onSwitchToLanding && (
          <button
            type="button"
            onClick={onSwitchToLanding}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '6px',
            }}
          >
            🌐 View Public Web Showcase
          </button>
        )}
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
