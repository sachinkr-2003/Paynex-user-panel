import { useState, useEffect, useRef } from 'react';

const ASSETS = {
  'BTC/USDT': {
    name: 'Bitcoin',
    basePrice: 68452.8,
    step: 5.4,
    change24h: '+3.84%',
    isPositive: true,
    high24h: '$69,240.00',
    low24h: '$67,810.00',
    vol24h: '$48.5M',
    payout: 95,
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeBorder: 'rgba(245, 158, 11, 0.4)',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    symbol: '₿',
  },
  'ETH/USDT': {
    name: 'Ethereum',
    basePrice: 3524.4,
    step: 0.85,
    change24h: '+5.12%',
    isPositive: true,
    high24h: '$3,580.00',
    low24h: '$3,410.00',
    vol24h: '$26.8M',
    payout: 92,
    color: '#2563eb',
    badgeBg: 'rgba(37, 99, 235, 0.15)',
    badgeBorder: 'rgba(37, 99, 235, 0.4)',
    accentGlow: 'rgba(37, 99, 235, 0.45)',
    symbol: 'Ξ',
  },
  'SOL/USDT': {
    name: 'Solana',
    basePrice: 185.3,
    step: 0.22,
    change24h: '+8.45%',
    isPositive: true,
    high24h: '$189.50',
    low24h: '$178.20',
    vol24h: '$14.2M',
    payout: 90,
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeBorder: 'rgba(6, 182, 212, 0.4)',
    accentGlow: 'rgba(6, 182, 212, 0.45)',
    symbol: '◎',
  },
};

const BET_AMOUNTS = [500, 1000, 2500, 5000];

const WINNERS = [
  { user: 'Rahul_99**', profit: '₹4,750', asset: 'BTC', time: '30s', color: '#10b981' },
  { user: 'Priya_K**', profit: '₹9,500', asset: 'ETH', time: '60s', color: '#38bdf8' },
  { user: 'Vikram_X**', profit: '₹25,000', asset: 'UPI Payout', time: 'Instant', color: '#fbbf24' },
  { user: 'Karan_Pro**', profit: '₹14,250', asset: 'SOL', time: '30s', color: '#38bdf8' },
  { user: 'Neha_Trade**', profit: '₹19,000', asset: 'BTC', time: '30s', color: '#10b981' },
];

const Hero = ({ onOpenAuth, onOpenVideo, onScrollToArena, demoBalance = 50000, setDemoBalance }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shineX: 50, shineY: 50 });

  // Terminal state
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [currentPrice, setCurrentPrice] = useState(ASSETS['BTC/USDT'].basePrice);
  const [priceFlash, setPriceFlash] = useState(null); // 'up' | 'down' | null
  const [priceHistory, setPriceHistory] = useState([
    45, 52, 48, 62, 55, 68, 60, 72, 65, 54, 60, 52, 68, 62, 58, 64, 59, 67, 63, 56, 62, 58, 66, 60, 64
  ]);

  // Mini live trade state
  const [miniTrade, setMiniTrade] = useState(null);
  const [miniResult, setMiniResult] = useState(null);

  // Winner ticker index
  const [winnerIndex, setWinnerIndex] = useState(0);

  // Sync price when asset changes
  useEffect(() => {
    setCurrentPrice(ASSETS[selectedAsset].basePrice);
    setMiniTrade(null);
    setMiniResult(null);
  }, [selectedAsset]);

  // Real-Time Price Engine Ticking with Mean-Reverting Beautiful Wave
  useEffect(() => {
    const asset = ASSETS[selectedAsset];
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * asset.step * 2.2;
      setCurrentPrice((prev) => {
        const next = Number((prev + delta).toFixed(2));
        setPriceFlash(delta >= 0 ? 'up' : 'down');
        setTimeout(() => setPriceFlash(null), 450);

        // Update live chart wave points with mean reversion to keep curve centered & wavy
        setPriceHistory((hist) => {
          const lastVal = hist[hist.length - 1];
          const target = 52;
          const pull = (target - lastVal) * 0.12;
          const swing = (Math.random() - 0.48) * 11;
          const nextVal = Math.max(26, Math.min(78, lastVal + swing + pull));
          return [...hist.slice(1), nextVal];
        });

        return next;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Live Mini Trade Countdown
  useEffect(() => {
    if (!miniTrade) return;
    const timer = setInterval(() => {
      setMiniTrade((prev) => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          const finalPrice = currentPrice;
          const isWin =
            (prev.direction === 'CALL' && finalPrice >= prev.entryPrice) ||
            (prev.direction === 'PUT' && finalPrice <= prev.entryPrice);

          const payoutMultiplier = 1 + prev.payoutRate / 100;
          const payout = isWin ? Math.round(prev.amount * payoutMultiplier) : 0;
          const profit = isWin ? payout - prev.amount : -prev.amount;

          if (isWin && setDemoBalance) {
            setDemoBalance((b) => b + payout);
          }

          setMiniResult({
            isWin,
            profit,
            payout,
            direction: prev.direction,
            entryPrice: prev.entryPrice,
            closePrice: finalPrice,
          });

          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [miniTrade, currentPrice, setDemoBalance]);

  // Winner Ticker cycling
  useEffect(() => {
    const ticker = setInterval(() => {
      setWinnerIndex((prev) => (prev + 1) % WINNERS.length);
    }, 3200);
    return () => clearInterval(ticker);
  }, []);

  // 3D Tilt calculation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({
      x: rotateX,
      y: rotateY,
      shineX: (x / rect.width) * 100,
      shineY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, shineX: 50, shineY: 50 });
  };

  // Trigger quick interactive bet
  const handleQuickBet = (direction) => {
    if (miniTrade) return;
    if (demoBalance < selectedAmount) {
      alert('Demo balance insufficient! Use Deposit in navbar to recharge.');
      return;
    }

    if (setDemoBalance) {
      setDemoBalance((b) => b - selectedAmount);
    }
    setMiniResult(null);

    const asset = ASSETS[selectedAsset];
    setMiniTrade({
      direction,
      entryPrice: currentPrice,
      amount: selectedAmount,
      payoutRate: asset.payout,
      timeLeft: 8, // 8-second quick demo round
    });
  };

  const asset = ASSETS[selectedAsset];
  const currentWinner = WINNERS[winnerIndex];

  // SVG Chart path calculation
  const chartWidth = 380;
  const chartHeight = 85;
  const points = priceHistory.map((val, idx) => {
    const x = (idx / (priceHistory.length - 1)) * chartWidth;
    const y = chartHeight - (val / 100) * (chartHeight - 16) - 8;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
  const lastPoint = points[points.length - 1];

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(8px, 2vw, 16px) clamp(12px, 3vw, 24px) clamp(24px, 4vw, 40px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      <div
        className="hero-grid"
        style={{
          display: 'grid',
          gap: 'clamp(24px, 4vw, 40px)',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Left Column: Epic Copy & CTA */}
        <div style={{ transform: 'translateY(0)' }}>
          {/* Glowing Cyber Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              borderRadius: '9999px',
              padding: '5px 12px',
              marginBottom: '14px',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
              maxWidth: '100%',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#fbbf24',
                boxShadow: '0 0 8px #fbbf24',
                animation: 'neonBlink 1.2s infinite',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(9px, 2.4vw, 11px)',
                fontWeight: 800,
                color: '#fbbf24',
                letterSpacing: 'clamp(0.5px, 1.2vw, 1.5px)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              🛡️ 8+ YEARS OF PROVEN FINANCIAL TRUST (ESTD. 2018) • 100% CAPITAL ASSURANCE GUARANTEE
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(1.75rem, 5.2vw, 3.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              marginBottom: '14px',
            }}
          >
            Predict Crypto Moves.{' '}
            <span className="gradient-text-crypto">Trade in Seconds.</span>
            <br />
            Win Up to <span className="gradient-text-gold">95% Payout.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(13px, 2.8vw, 15px)',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '560px',
              marginBottom: '18px',
            }}
          >
            Step into the next era of high-frequency decentralized crypto predictions. Trade Bitcoin, Ethereum, and Solana with ultra-low latency charts, 30s/60s contracts, and instant UPI or USDT withdrawals. Invest Today and Grow Tomorrow.
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-6"
            style={{ maxWidth: '500px' }}
          >
            <button
              onClick={onScrollToArena}
              className="btn-cyber-primary w-full sm:w-auto"
              style={{
                padding: '12px 24px',
                fontSize: '14.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🚀</span>
              <span>Launch 3D Trade Arena</span>
            </button>

            <button
              onClick={() => onOpenVideo && onOpenVideo()}
              className="btn-cyber-outline w-full sm:w-auto"
              style={{
                padding: '11px 20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.2)',
                  border: '1px solid #06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  color: '#38bdf8',
                }}
              >
                ▶
              </div>
              <span>Watch 3D Demo Video</span>
            </button>
          </div>

          {/* 8-Year Capital Protection Warranty Trust Strip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 14px',
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '10px',
              marginBottom: '16px',
              maxWidth: '540px',
              boxShadow: '0 0 18px rgba(245, 158, 11, 0.12)',
            }}
          >
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <div style={{ fontSize: '11.5px', lineHeight: 1.4 }}>
              <span style={{ fontWeight: 800, color: '#fbbf24', letterSpacing: '0.4px' }}>
                8-YEAR CAPITAL PROTECTION WARRANTY
              </span>
              <span style={{ color: '#cbd5e1', marginLeft: '6px' }}>
                • 100% Principal Safety & Solvency Guaranteed Since 2018
              </span>
            </div>
          </div>

          {/* Metric Bar (4 Trust Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(6px, 1.8vw, 14px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '14px',
              maxWidth: '560px',
            }}
          >
            <div>
              <div
                className="font-mono"
                style={{ fontSize: 'clamp(15px, 3.8vw, 21px)', fontWeight: 900, color: '#fbbf24' }}
              >
                8+ Yrs
              </div>
              <div style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#94a3b8', fontWeight: 600 }}>
                Estd. 2018
              </div>
            </div>

            <div>
              <div
                className="font-mono"
                style={{ fontSize: 'clamp(15px, 3.8vw, 21px)', fontWeight: 900, color: '#fff' }}
              >
                $48.5M+
              </div>
              <div style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#94a3b8', fontWeight: 600 }}>
                24H Volume
              </div>
            </div>

            <div>
              <div
                className="font-mono"
                style={{ fontSize: 'clamp(15px, 3.8vw, 21px)', fontWeight: 900, color: '#10b981' }}
              >
                0.4s
              </div>
              <div style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#94a3b8', fontWeight: 600 }}>
                Instant Payout
              </div>
            </div>

            <div>
              <div
                className="font-mono"
                style={{ fontSize: 'clamp(15px, 3.8vw, 21px)', fontWeight: 900, color: '#38bdf8' }}
              >
                100%
              </div>
              <div style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#94a3b8', fontWeight: 600 }}>
                Capital Safe
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ultra-Premium 3D Holographic Trading Terminal & Authentic Orbit Tokens */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            perspective: '1200px',
            padding: '16px 14px',
          }}
        >
          {/* Floating 3D Embossed Bitcoin Gold Medallion (Top-Left Celestial Orbit) */}
          <div
            className="animate-float-smooth hidden sm:flex"
            style={{
              position: 'absolute',
              top: '0px',
              left: '-12px',
              zIndex: 40,
              width: '62px',
              height: '62px',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.65))',
              transform: 'rotateZ(-12deg)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="62" height="62" viewBox="0 0 48 48" fill="none">
              <defs>
                <radialGradient id="btcGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="85%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>
                <linearGradient id="btcRim" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="23" fill="url(#btcRim)" />
              <circle cx="24" cy="24" r="21" fill="url(#btcGrad)" stroke="#fef08a" strokeWidth="1" />
              <circle cx="24" cy="24" r="18.5" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 1.5" />
              <path
                d="M26.5 13.5V11M21.5 13.5V11M26.5 37V34.5M21.5 37V34.5M17.5 17H26C28.2 17 29.5 18.2 29.5 20C29.5 21.3 28.7 22.4 27.2 22.8C29 23.3 30 24.5 30 26.5C30 28.8 28.2 30.5 25.5 30.5H17.5V17ZM21.5 22H25C26 22 26.8 21.4 26.8 20.4C26.8 19.4 26 18.8 25 18.8H21.5V22ZM21.5 28.7H25.5C26.7 28.7 27.5 28 27.5 26.9C27.5 25.8 26.7 25.1 25.5 25.1H21.5V28.7Z"
                fill="#3b1700"
                stroke="#3b1700"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Floating 3D Ethereum Crystal Facet (Right Companion Orbit) */}
          <div
            className="animate-float-reverse hidden sm:flex"
            style={{
              position: 'absolute',
              top: '36px',
              right: '-8px',
              zIndex: 40,
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.4), rgba(10, 13, 30, 0.9))',
              border: '1.5px solid rgba(59, 130, 246, 0.65)',
              boxShadow: '0 0 30px rgba(37, 99, 235, 0.55), inset 0 1px 3px rgba(255, 255, 255, 0.35)',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transform: 'rotateZ(8deg)',
            }}
          >
            {/* Authentic 3D Multi-Faceted Ethereum Diamond with Electric Blue & Cyan Facets */}
            <svg width="22" height="34" viewBox="0 0 784 1277" fill="none">
              <path d="M392.07 0L383.5 29.11V874.74L392.07 883.29L784.13 651.54L392.07 0Z" fill="#60a5fa" fillOpacity="0.95" />
              <path d="M392.07 0L0 651.54L392.07 883.29V472.33V0Z" fill="#3b82f6" />
              <path d="M392.07 956.52L387.24 962.41V1272.77L392.07 1276.99L784.37 724.89L392.07 956.52Z" fill="#60a5fa" fillOpacity="0.9" />
              <path d="M392.07 1276.99V956.52L0 724.89L392.07 1276.99Z" fill="#2563eb" />
              <path d="M392.07 883.29L784.13 651.54L392.07 472.33V883.29Z" fill="#1d4ed8" />
              <path d="M0 651.54L392.07 883.29V472.33L0 651.54Z" fill="#1e40af" fillOpacity="0.75" />
            </svg>
          </div>

          {/* Main 3D High-Tech Terminal Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="holo-3d"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              width: '100%',
              maxWidth: '490px',
              background: 'linear-gradient(150deg, rgba(14, 18, 44, 0.95) 0%, rgba(5, 7, 20, 0.98) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.42)',
              borderRadius: '20px',
              padding: '14px clamp(10px, 3vw, 18px)',
              boxShadow: '0 25px 65px rgba(0, 0, 0, 0.8), 0 0 50px rgba(245, 158, 11, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Holographic interactive sheen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Tactical HUD Corner Accent Marks */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                fontSize: '11px',
                color: 'rgba(245, 158, 11, 0.6)',
                fontFamily: 'monospace',
                pointerEvents: 'none',
              }}
            >
              ┌
            </div>
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                fontSize: '11px',
                color: 'rgba(245, 158, 11, 0.6)',
                fontFamily: 'monospace',
                pointerEvents: 'none',
              }}
            >
              ┐
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                fontSize: '11px',
                color: 'rgba(245, 158, 11, 0.6)',
                fontFamily: 'monospace',
                pointerEvents: 'none',
              }}
            >
              └
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                fontSize: '11px',
                color: 'rgba(245, 158, 11, 0.6)',
                fontFamily: 'monospace',
                pointerEvents: 'none',
              }}
            >
              ┘
            </div>

            {/* Asset Switcher Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '3px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {Object.keys(ASSETS).map((key) => {
                const item = ASSETS[key];
                const isSelected = selectedAsset === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAsset(key)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '5px 6px',
                      borderRadius: '8px',
                      border: isSelected ? `1px solid ${item.badgeBorder}` : '1px solid transparent',
                      background: isSelected ? item.badgeBg : 'transparent',
                      color: isSelected ? '#fff' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 12px ${item.accentGlow}` : 'none',
                    }}
                  >
                    <span style={{ color: item.color, fontSize: '12px' }}>{item.symbol}</span>
                    <span>{key.split('/')[0]}</span>
                    <span
                      style={{
                        fontSize: '9.5px',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.18)',
                        padding: '1px 3px',
                        borderRadius: '4px',
                        fontWeight: 800,
                      }}
                    >
                      +{item.payout}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Terminal Live Price & Stats Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: asset.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '17px',
                    color: '#000',
                    boxShadow: `0 0 15px ${asset.accentGlow}`,
                    flexShrink: 0,
                  }}
                >
                  {asset.symbol}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 900, margin: 0, color: '#fff' }}>
                      {selectedAsset}
                    </h3>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#10b981',
                          boxShadow: '0 0 6px #10b981',
                          animation: 'neonBlink 1s infinite',
                        }}
                      />
                      LIVE FEED
                    </span>
                  </div>
                  <p style={{ fontSize: '10.5px', color: '#64748b', margin: '1px 0 0' }}>
                    Ultra-Fast Volatility Contract
                  </p>
                </div>
              </div>

              {/* Live Pulsing Price Tag */}
              <div style={{ textAlign: 'right' }}>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    color: priceFlash === 'up' ? '#34d399' : priceFlash === 'down' ? '#f87171' : '#fff',
                    transition: 'color 0.2s',
                    textShadow:
                      priceFlash === 'up'
                        ? '0 0 15px rgba(52, 211, 153, 0.8)'
                        : priceFlash === 'down'
                        ? '0 0 15px rgba(248, 113, 113, 0.8)'
                        : 'none',
                  }}
                >
                  ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <span>{asset.change24h} (24h)</span>
                  <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>• 8ms</span>
                </div>
              </div>
            </div>

            {/* Dynamic Laser Volatility Chart Viewport */}
            <div
              style={{
                position: 'relative',
                height: '118px',
                background: 'radial-gradient(ellipse at 50% 20%, #0d1228 0%, #040510 100%)',
                borderRadius: '14px',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                marginBottom: '10px',
                padding: '8px 10px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Chart Coordinates Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', zIndex: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>⚡ LASER VOLATILITY CURVE</span>
                  <span style={{ color: '#64748b' }}>| Real-Time Tick</span>
                </div>
                <span
                  style={{
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '1px 6px',
                    borderRadius: '5px',
                    fontWeight: 700,
                    fontSize: '10px',
                  }}
                >
                  {miniTrade ? `ROUND ENDS: ${miniTrade.timeLeft}s` : 'Expiry: 60s'}
                </span>
              </div>

              {/* Background Grid Lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                  pointerEvents: 'none',
                }}
              />

              {/* Dynamic SVG Wave Chart */}
              <svg
                width="100%"
                height="68"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                fill="none"
                style={{ overflow: 'visible', margin: 'auto 0' }}
              >
                <defs>
                  <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                  <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* Area under curve */}
                <path d={areaD} fill="url(#heroChartGrad)" />

                {/* Glowing Laser Spline */}
                <path
                  d={pathD}
                  stroke="#10b981"
                  strokeWidth="2.8"
                  filter="url(#laserGlow)"
                  strokeLinecap="round"
                />

                {/* Dotted Strike Price line if active mini trade */}
                {miniTrade && (
                  <line
                    x1="0"
                    y1={chartHeight / 2}
                    x2={chartWidth}
                    y2={chartHeight / 2}
                    stroke={miniTrade.direction === 'CALL' ? '#34d399' : '#f87171'}
                    strokeWidth="1.8"
                    strokeDasharray="5 3"
                  />
                )}

                {/* Active Current Price Beacon */}
                <circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill="#38bdf8" />
                <circle cx={lastPoint.x} cy={lastPoint.y} r="11" fill="#38bdf8" opacity="0.35" className="animate-ping" />
              </svg>

              {/* Active Trade Live Indicator Ribbon */}
              {miniTrade && (
                <div
                  style={{
                    position: 'absolute',
                    top: '32px',
                    left: '12px',
                    background: 'rgba(6, 7, 26, 0.92)',
                    border: `1px solid ${miniTrade.direction === 'CALL' ? '#10b981' : '#ef4444'}`,
                    borderRadius: '8px',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: `0 0 15px ${miniTrade.direction === 'CALL' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    zIndex: 10,
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 800, color: miniTrade.direction === 'CALL' ? '#34d399' : '#f87171' }}>
                    ● {miniTrade.direction} @ ${miniTrade.entryPrice}
                  </span>
                  <span className="font-mono" style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24' }}>
                    {miniTrade.timeLeft}s
                  </span>
                </div>
              )}

              {/* Floating Price Tag on Beacon */}
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(11, 13, 38, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)',
                  zIndex: 6,
                }}
              >
                ${currentPrice.toFixed(2)}
              </div>

              {/* Chart Footer Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', zIndex: 5 }}>
                <span style={{ color: '#a78bfa' }}>Contract Payout Multiplier:</span>
                <span style={{ color: '#fbbf24', fontWeight: 800 }}>
                  +{asset.payout}% (₹{Math.round(selectedAmount * (1 + asset.payout / 100)).toLocaleString('en-IN')} return)
                </span>
              </div>

              {/* Mini Trade Celebration Popup */}
              {miniResult && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 7, 26, 0.94)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 25,
                    padding: '8px',
                    animation: 'floatSmooth 0.3s ease-out',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px' }}>{miniResult.isWin ? '🏆' : '✕'}</span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        color: miniResult.isWin ? '#10b981' : '#ef4444',
                      }}
                    >
                      {miniResult.isWin ? 'DEMO TRADE WON!' : 'TRADE SETTLED OUT OF MONEY'}
                    </span>
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '17px',
                      fontWeight: 900,
                      color: miniResult.isWin ? '#34d399' : '#f87171',
                      marginBottom: '8px',
                    }}
                  >
                    {miniResult.isWin ? `+₹${miniResult.profit.toLocaleString('en-IN')} Profit` : `-₹${Math.abs(miniResult.profit).toLocaleString('en-IN')}`}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setMiniResult(null)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onScrollToArena}
                      className="btn-cyber-primary"
                      style={{ padding: '6px 16px', fontSize: '11px' }}
                    >
                      Enter Full Arena ➔
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bet Sizing Chips */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#94a3b8', marginBottom: '4px' }}>
                <span>Quick Stake Amount:</span>
                <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 800 }}>
                  ₹{selectedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {BET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    style={{
                      background: selectedAmount === amt ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${selectedAmount === amt ? '#fbbf24' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: selectedAmount === amt ? '#fbbf24' : '#94a3b8',
                      padding: '4px 0',
                      borderRadius: '7px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: selectedAmount === amt ? '0 0 10px rgba(245, 158, 11, 0.35)' : 'none',
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Action CALL and PUT Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button
                disabled={Boolean(miniTrade)}
                onClick={() => handleQuickBet('CALL')}
                className="btn-cyber-bull"
                style={{
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  opacity: miniTrade ? 0.6 : 1,
                  cursor: miniTrade ? 'not-allowed' : 'pointer',
                  borderRadius: '10px',
                }}
              >
                <span>▲</span>
                <span>CALL / UP (+{asset.payout}%)</span>
              </button>

              <button
                disabled={Boolean(miniTrade)}
                onClick={() => handleQuickBet('PUT')}
                className="btn-cyber-bear"
                style={{
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  opacity: miniTrade ? 0.6 : 1,
                  cursor: miniTrade ? 'not-allowed' : 'pointer',
                  borderRadius: '10px',
                }}
              >
                <span>▼</span>
                <span>PUT / DOWN (+{asset.payout}%)</span>
              </button>
            </div>

            {/* Real-Time Animated Social Proof Winner Ticker */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                minHeight: '28px',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#fbbf24' }}>🏆</span>
                <span style={{ color: '#cbd5e1' }}>User {currentWinner.user} won</span>
              </div>
              <span className="font-mono" style={{ color: currentWinner.color, fontWeight: 800 }}>
                +{currentWinner.profit} on {currentWinner.asset} ({currentWinner.time})
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
