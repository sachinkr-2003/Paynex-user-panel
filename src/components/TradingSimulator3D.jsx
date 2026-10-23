import { useState, useEffect, useRef } from 'react';

const ASSETS = {
  'BTC/USDT': { name: 'Bitcoin', basePrice: 68420, step: 4.5, icon: '₿', color: '#f59e0b', payout: 95 },
  'ETH/USDT': { name: 'Ethereum', basePrice: 3520, step: 0.65, icon: 'Ξ', color: '#2563eb', payout: 92 },
  'SOL/USDT': { name: 'Solana', basePrice: 184.5, step: 0.12, icon: '◎', color: '#06b6d4', payout: 90 },
};

const TIMEFRAMES = [
  { label: '30s Turbo', seconds: 30 },
  { label: '60s Pro', seconds: 60 },
  { label: '2m Swing', seconds: 120 },
  { label: '5m Trend', seconds: 300 },
];

const BET_PRESETS = [200, 500, 1000, 2500, 5000];

const TradingSimulator3D = ({ demoBalance, setDemoBalance }) => {
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[1]);
  const [betAmount, setBetAmount] = useState(1000);
  const [currentPrice, setCurrentPrice] = useState(ASSETS['BTC/USDT'].basePrice);
  const [priceHistory, setPriceHistory] = useState([]);
  const [activeTrade, setActiveTrade] = useState(null);
  const [tradeResult, setTradeResult] = useState(null);
  const [candleType, setCandleType] = useState('line'); // 'line' or 'candle'
  const canvasRef = useRef(null);

  // Initialize Price History
  useEffect(() => {
    const asset = ASSETS[selectedAsset];
    let price = asset.basePrice;
    const history = [];
    for (let i = 0; i < 40; i++) {
      const open = price;
      const change = (Math.random() - 0.49) * asset.step * 8;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * asset.step * 3;
      const low = Math.min(open, close) - Math.random() * asset.step * 3;
      price = close;
      history.push({ open, close, high, low, time: i });
    }
    setPriceHistory(history);
    setCurrentPrice(price);
  }, [selectedAsset]);

  // Real-Time Price Engine Ticking
  useEffect(() => {
    const asset = ASSETS[selectedAsset];
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.485) * asset.step * 4;
      setCurrentPrice((prev) => {
        const nextPrice = Number((prev + delta).toFixed(2));
        setPriceHistory((hist) => {
          if (hist.length === 0) return hist;
          const updated = [...hist];
          const last = { ...updated[updated.length - 1] };
          last.close = nextPrice;
          last.high = Math.max(last.high, nextPrice);
          last.low = Math.min(last.low, nextPrice);
          updated[updated.length - 1] = last;

          // Occasionally create new candle
          if (Math.random() > 0.65 && updated.length < 50) {
            updated.push({
              open: nextPrice,
              close: nextPrice,
              high: nextPrice,
              low: nextPrice,
              time: updated.length,
            });
            if (updated.length > 45) updated.shift();
          }
          return updated;
        });
        return nextPrice;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Active Trade Countdown Timer
  useEffect(() => {
    if (!activeTrade) return;

    const timer = setInterval(() => {
      setActiveTrade((prev) => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          // Resolve trade
          clearInterval(timer);
          const finalPrice = currentPrice;
          const isWin =
            (prev.direction === 'CALL' && finalPrice > prev.entryPrice) ||
            (prev.direction === 'PUT' && finalPrice < prev.entryPrice);

          const payout = isWin ? Math.round(prev.amount * (1 + prev.payoutRate / 100)) : 0;
          const profit = isWin ? payout - prev.amount : -prev.amount;

          if (isWin) {
            setDemoBalance((b) => b + payout);
          }

          setTradeResult({
            isWin,
            profit,
            payout,
            entryPrice: prev.entryPrice,
            closePrice: finalPrice,
            direction: prev.direction,
            asset: prev.asset,
          });

          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTrade, currentPrice, setDemoBalance]);

  // Canvas Drawing for High-Tech Lasers & Candlesticks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || priceHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = 360);

    // Clear
    ctx.fillStyle = '#05060e';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.1)';
    ctx.lineWidth = 1;
    for (let y = 40; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 60; x < width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Min & Max Price for scaling
    const prices = priceHistory.flatMap((c) => [c.low, c.high]);
    if (activeTrade) prices.push(activeTrade.entryPrice);
    const minP = Math.min(...prices) * 0.999;
    const maxP = Math.max(...prices) * 1.001;
    const range = maxP - minP || 1;

    const getY = (val) => height - ((val - minP) / range) * (height - 60) - 30;

    const candleWidth = (width - 100) / priceHistory.length;

    if (candleType === 'candle') {
      // Candlestick rendering
      priceHistory.forEach((c, idx) => {
        const x = idx * candleWidth + 20;
        const isGreen = c.close >= c.open;
        const color = isGreen ? '#10b981' : '#ef4444';

        // Wicks
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, getY(c.high));
        ctx.lineTo(x + candleWidth / 2, getY(c.low));
        ctx.stroke();

        // Body
        const top = Math.min(getY(c.open), getY(c.close));
        const bodyHeight = Math.max(3, Math.abs(getY(c.close) - getY(c.open)));
        ctx.fillStyle = color;
        ctx.fillRect(x + 2, top, candleWidth - 4, bodyHeight);
      });
    } else {
      // Area Laser Glow Line Chart
      ctx.beginPath();
      priceHistory.forEach((c, idx) => {
        const x = idx * candleWidth + 20;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Gradient Fill (Gold into Electric Blue)
      const lastX = (priceHistory.length - 1) * candleWidth + 20;
      ctx.lineTo(lastX, height);
      ctx.lineTo(20, height);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, 0, 0, height);
      areaGrad.addColorStop(0, 'rgba(245, 158, 11, 0.32)');
      areaGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.15)');
      areaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Top glowing stroke
      ctx.beginPath();
      priceHistory.forEach((c, idx) => {
        const x = idx * candleWidth + 20;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Active Strike Price Line (if bet is placed)
    if (activeTrade) {
      const strikeY = getY(activeTrade.entryPrice);
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = activeTrade.direction === 'CALL' ? '#10b981' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, strikeY);
      ctx.lineTo(width, strikeY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge on line
      ctx.fillStyle = activeTrade.direction === 'CALL' ? '#10b981' : '#ef4444';
      ctx.fillRect(width - 120, strikeY - 12, 110, 24);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`${activeTrade.direction} @ $${activeTrade.entryPrice}`, width - 114, strikeY + 4);
    }

    // Current Price Pulse Beacon
    const currentY = getY(currentPrice);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Right Price Tag
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(width - 90, currentY - 12, 85, 24);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.fillText(`$${currentPrice.toFixed(2)}`, width - 84, currentY + 4);

    // Glowing dot at the end
    const lastPointX = (priceHistory.length - 1) * candleWidth + 20;
    ctx.beginPath();
    ctx.arc(lastPointX, currentY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [priceHistory, currentPrice, activeTrade, candleType]);

  const handlePlaceBet = (direction) => {
    if (demoBalance < betAmount) {
      alert('Insufficient Demo Balance! Click Deposit to recharge free demo funds.');
      return;
    }
    if (activeTrade) {
      alert('A trade contract is already running! Please wait for it to settle.');
      return;
    }

    setDemoBalance((b) => b - betAmount);
    setTradeResult(null);

    const asset = ASSETS[selectedAsset];
    setActiveTrade({
      asset: selectedAsset,
      direction,
      entryPrice: currentPrice,
      amount: betAmount,
      payoutRate: asset.payout,
      timeTotal: selectedTimeframe.seconds,
      timeLeft: selectedTimeframe.seconds,
    });
  };

  const assetInfo = ASSETS[selectedAsset];

  return (
    <section
      id="trading-arena"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(50px, 8vw, 90px) clamp(12px, 3vw, 24px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '9999px',
            padding: '5px 14px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#38bdf8',
            letterSpacing: '1.5px',
            marginBottom: '12px',
          }}
        >
          <span>⚡ LIVE 3D TRADING SIMULATOR</span>
        </div>

        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '10px',
          }}
        >
          High-Velocity <span className="gradient-text-crypto">Binary Bet Arena</span>
        </h2>
        <p style={{ fontSize: 'clamp(13px, 2.8vw, 15px)', color: '#94a3b8', maxWidth: '620px', margin: '0 auto' }}>
          Test your strategy risk-free with ₹50,000 demo funds. Place rapid 30s/60s Call or Put contracts on live crypto feeds.
        </p>
      </div>

      {/* Main Trading Deck Grid */}
      <div
        className="cyber-card"
        style={{
          padding: 'clamp(14px, 3vw, 24px)',
          borderRadius: '24px',
          background: 'rgba(10, 13, 32, 0.92)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(245, 158, 11, 0.18)',
        }}
      >
        {/* Top Control Bar: Asset Selector & Chart Tools */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
          }}
        >
          {/* Asset Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.keys(ASSETS).map((key) => {
              const a = ASSETS[key];
              const isSelected = selectedAsset === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAsset(key)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isSelected ? '#fef08a' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isSelected ? '#120a00' : '#fff',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 0 18px rgba(245, 158, 11, 0.55)' : 'none',
                  }}
                >
                  <span style={{ color: a.color, fontSize: '15px' }}>{a.icon}</span>
                  <span>{key}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '2px 5px',
                      borderRadius: '4px',
                    }}
                  >
                    +{a.payout}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeframe & Chart Style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Chart type toggle */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '3px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <button
                onClick={() => setCandleType('line')}
                style={{
                  background: candleType === 'line' ? '#f59e0b' : 'transparent',
                  color: candleType === 'line' ? '#000' : '#fff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ⚡ Laser Line
              </button>
              <button
                onClick={() => setCandleType('candle')}
                style={{
                  background: candleType === 'candle' ? '#f59e0b' : 'transparent',
                  color: candleType === 'candle' ? '#000' : '#fff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                📊 Candlestick
              </button>
            </div>

            {/* Timeframe selector */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.label}
                  onClick={() => setSelectedTimeframe(tf)}
                  style={{
                    background: selectedTimeframe.label === tf.label ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                    border: selectedTimeframe.label === tf.label ? '1px solid #06b6d4' : 'none',
                    color: selectedTimeframe.label === tf.label ? '#38bdf8' : '#94a3b8',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Area: Canvas Chart + Real-Time Sidebar Controls */}
        <div className="trading-deck-grid">
          {/* Main Chart Canvas Viewport */}
          <div
            className="chart-viewport"
            style={{ minHeight: '360px', position: 'relative' }}
          >
            <canvas ref={canvasRef} style={{ width: '100%', height: '360px', display: 'block' }} />

            {/* Active Contract Overlay Banner */}
            {activeTrade && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(6, 7, 26, 0.88)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${activeTrade.direction === 'CALL' ? '#10b981' : '#ef4444'}`,
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: `0 0 20px ${activeTrade.direction === 'CALL' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  zIndex: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Contract In Progress</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: activeTrade.direction === 'CALL' ? '#10b981' : '#ef4444' }}>
                    {activeTrade.direction} (₹{activeTrade.amount}) @ ${activeTrade.entryPrice}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#fbbf24' }}>Time Remaining</div>
                  <div className="font-mono" style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                    {activeTrade.timeLeft}s
                  </div>
                </div>
              </div>
            )}

            {/* Trade Result Popup Banner */}
            {tradeResult && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(5, 5, 20, 0.88)',
                  backdropFilter: 'blur(14px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 20,
                  animation: 'floatSmooth 0.3s ease-out',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: tradeResult.isWin ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: `2px solid ${tradeResult.isWin ? '#10b981' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    marginBottom: '16px',
                    boxShadow: `0 0 30px ${tradeResult.isWin ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
                  }}
                >
                  {tradeResult.isWin ? '🏆' : '✕'}
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: tradeResult.isWin ? '#10b981' : '#ef4444',
                    marginBottom: '6px',
                  }}
                >
                  {tradeResult.isWin ? 'TRADE WON! +95% PROFIT' : 'TRADE CLOSED OUT OF MONEY'}
                </h3>

                <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '18px' }}>
                  Entry: ${tradeResult.entryPrice} ➔ Close: ${tradeResult.closePrice.toFixed(2)}
                </p>

                <div
                  className="font-mono"
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: tradeResult.isWin ? '#34d399' : '#f87171',
                    marginBottom: '20px',
                  }}
                >
                  {tradeResult.isWin ? `+₹${tradeResult.profit.toLocaleString('en-IN')}` : `-₹${Math.abs(tradeResult.profit).toLocaleString('en-IN')}`}
                </div>

                <button
                  onClick={() => setTradeResult(null)}
                  className="btn-cyber-primary"
                  style={{ padding: '9px 24px', fontSize: '13px' }}
                >
                  Place Next Bet ➔
                </button>
              </div>
            )}
          </div>

          {/* Right Action Panel: Investment, Payout & Big Call/Put Buttons */}
          <div
            style={{
              background: 'rgba(12, 16, 38, 0.75)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              {/* Asset Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Selected Pair</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{selectedAsset}</span>
              </div>

              {/* Investment Selector */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Bet Amount</span>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>
                    ₹{betAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Amount Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  {BET_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBetAmount(amt)}
                      style={{
                        background: betAmount === amt ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${betAmount === amt ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: betAmount === amt ? '#fff' : '#cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 0',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setBetAmount(10000)}
                    style={{
                      background: betAmount === 10000 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${betAmount === 10000 ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: '#fbbf24',
                      borderRadius: '8px',
                      padding: '6px 0',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ₹10K
                  </button>
                </div>
              </div>

              {/* Profit Calculation Box */}
              <div
                style={{
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '12px',
                  padding: '12px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>Profit Payout ({assetInfo.payout}%):</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>
                    +₹{Math.round(betAmount * (assetInfo.payout / 100)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                  <span>Total Return:</span>
                  <span className="font-mono" style={{ color: '#38bdf8' }}>
                    ₹{Math.round(betAmount * (1 + assetInfo.payout / 100)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Big Action Call & Put Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                disabled={Boolean(activeTrade)}
                onClick={() => handlePlaceBet('CALL')}
                className="btn-cyber-bull"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: activeTrade ? 0.5 : 1,
                  cursor: activeTrade ? 'not-allowed' : 'pointer',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>▲ CALL / HIGHER</div>
                  <div style={{ fontSize: '10px', opacity: 0.9 }}>Price rises above entry</div>
                </div>
                <span className="font-mono" style={{ fontSize: '16px', fontWeight: 900 }}>
                  +{assetInfo.payout}%
                </span>
              </button>

              <button
                disabled={Boolean(activeTrade)}
                onClick={() => handlePlaceBet('PUT')}
                className="btn-cyber-bear"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: activeTrade ? 0.5 : 1,
                  cursor: activeTrade ? 'not-allowed' : 'pointer',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>▼ PUT / LOWER</div>
                  <div style={{ fontSize: '10px', opacity: 0.9 }}>Price falls below entry</div>
                </div>
                <span className="font-mono" style={{ fontSize: '16px', fontWeight: 900 }}>
                  +{assetInfo.payout}%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingSimulator3D;
