import { useState } from 'react';

const AuthModal = ({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) => {
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onLoginSuccess) onLoginSuccess({ email: email || 'trader@paynex.io', name: 'Demo Trader' });
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(3, 4, 14, 0.88)',
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
          maxWidth: '440px',
          borderRadius: '26px',
          padding: '32px 28px',
          background: 'linear-gradient(150deg, rgba(14, 18, 44, 0.96) 0%, rgba(5, 7, 20, 0.98) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(245, 158, 11, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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

        {/* Brand Header with Official Logo */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              overflow: 'hidden',
              margin: '0 auto 12px',
              border: '1.5px solid rgba(245, 158, 11, 0.65)',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.5), 0 0 40px rgba(37, 99, 235, 0.3)',
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
            className="font-display"
            style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}
          >
            PAY<span style={{ color: '#fbbf24' }}>NEX</span> <span style={{ fontSize: '14px', color: '#fbbf24' }}>CRYPTO</span>
          </h3>
          <p style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 600, margin: '0 0 4px' }}>
            Invest Today and Grow Tomorrow
          </p>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Instant Access to ₹50,000 Demo Trading Funds
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '22px',
          }}
        >
          <button
            onClick={() => setTab('login')}
            style={{
              background: tab === 'login' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              border: 'none',
              color: tab === 'login' ? '#140c00' : '#fff',
              padding: '8px 0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: tab === 'login' ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            style={{
              background: tab === 'signup' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
              border: 'none',
              color: tab === 'signup' ? '#140c00' : '#fff',
              padding: '8px 0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: tab === 'signup' ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
            }}
          >
            Register Free
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
              Email or Mobile Number
            </label>
            <input
              type="text"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '11px', cursor: 'pointer' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {isSuccess ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
                color: '#34d399',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              ✓ Success! Logging into Trading Desk...
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="btn-cyber-primary"
              style={{ width: '100%', padding: '13px 0', fontSize: '15px', marginTop: '6px' }}
            >
              {isLoading ? 'Verifying...' : tab === 'login' ? 'Sign In to Trade' : 'Create Free Account'}
            </button>
          )}

          {/* Social Web3 1-Click login */}
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Or continue with Web3 & Social</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('google.user@gmail.com');
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="btn-cyber-outline"
                style={{ padding: '8px 0', fontSize: '12px' }}
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('telegram.trader');
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="btn-cyber-outline"
                style={{ padding: '8px 0', fontSize: '12px' }}
              >
                Telegram
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
