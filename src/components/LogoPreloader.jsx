import { useState, useEffect } from 'react';

const LogoPreloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Secure Core...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress increment from 0 to 100 over ~1.6s
    const startTime = Date.now();
    const duration = 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 25) {
        setStatusText('Connecting to Paynex High-Speed Node Cluster...');
      } else if (pct < 50) {
        setStatusText('Calibrating 6ms WebSocket Price Feeds...');
      } else if (pct < 75) {
        setStatusText('Loading 3D Derivatives & Stock Simulator...');
      } else if (pct < 95) {
        setStatusText('Verifying 256-Bit SSL & Cold Vault Liquidity...');
      } else {
        setStatusText('System Ready. Welcome Trader.');
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 450);
        }, 150);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'radial-gradient(ellipse at center, #090b16 0%, #030408 80%, #010204 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes orbitalSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitalSpinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes logoAuraPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes beamScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes shimmerGold {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Cyber Grid Subtle Ambient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(245, 158, 11, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.8,
          pointerEvents: 'none',
        }}
      />

      {/* Center 3D Logo Stage */}
      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        {/* Golden Glowing Pulsing Aura */}
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.2) 50%, transparent 70%)',
            filter: 'blur(28px)',
            animation: 'logoAuraPulse 2.8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Outer Orbital Ring 1 (Clockwise) */}
        <div
          style={{
            position: 'absolute',
            width: '170px',
            height: '170px',
            borderRadius: '50%',
            border: '2px dashed rgba(245, 158, 11, 0.45)',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
            animation: 'orbitalSpin 9s linear infinite',
          }}
        >
          {/* Energy Orb on Ring */}
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#fbbf24',
              boxShadow: '0 0 12px #fbbf24, 0 0 20px #f59e0b',
            }}
          />
        </div>

        {/* Inner Orbital Ring 2 (Counter-Clockwise Cyan/Gold) */}
        <div
          style={{
            position: 'absolute',
            width: '142px',
            height: '142px',
            borderRadius: '50%',
            border: '1.5px solid transparent',
            borderTopColor: '#38bdf8',
            borderBottomColor: '#fbbf24',
            animation: 'orbitalSpinReverse 5s linear infinite',
          }}
        />

        {/* Central Logo Box with Golden Bezel */}
        <div
          style={{
            position: 'relative',
            width: '94px',
            height: '94px',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #0e1224, #05070e)',
            border: '2px solid rgba(251, 191, 36, 0.85)',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), inset 0 0 15px rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <img
            src="/paynex-logo.jpg"
            alt="PAYNEX Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Sweeping Laser Scan Beam */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '24px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(251, 191, 36, 0.35) 50%, transparent 100%)',
              animation: 'beamScan 1.6s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Brand Typography */}
      <div style={{ textAlign: 'center', marginBottom: '24px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 900,
              letterSpacing: '3px',
              color: '#ffffff',
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            PAY<span style={{ color: '#fbbf24', textShadow: '0 0 16px rgba(245, 158, 11, 0.7)' }}>NEX</span>
          </h1>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 900,
              color: '#fbbf24',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              padding: '3px 8px',
              borderRadius: '6px',
              letterSpacing: '1.5px',
            }}
          >
            CRYPTO
          </span>
        </div>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#fbbf24',
            letterSpacing: '1px',
            margin: '0 0 4px',
            textTransform: 'uppercase',
          }}
        >
          Invest Today and Grow Tomorrow
        </p>
        <p
          style={{
            fontSize: '11px',
            color: '#64748b',
            letterSpacing: '0.5px',
            margin: 0,
          }}
        >
          Next-Gen 3D Prediction & Trading Network
        </p>
      </div>

      {/* Futuristic Progress Bar & Percent Counter */}
      <div style={{ width: 'min(340px, 86vw)', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '250px',
              }}
            >
              {statusText}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              fontWeight: 800,
              color: '#fbbf24',
              textShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
            }}
          >
            {progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #38bdf8 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.85)',
              transition: 'width 0.1s ease-out',
            }}
          />
        </div>
      </div>

      {/* Quick Skip Button (Subtle & Sleek) */}
      <button
        onClick={handleSkip}
        style={{
          marginTop: '28px',
          background: 'none',
          border: 'none',
          color: '#475569',
          fontSize: '11px',
          letterSpacing: '1px',
          cursor: 'pointer',
          padding: '6px 14px',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fbbf24';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#475569';
        }}
      >
        PRESS TO ENTER DESK ➔
      </button>
    </div>
  );
};

export default LogoPreloader;
