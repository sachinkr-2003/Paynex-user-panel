import { useState, useEffect } from 'react';
import { Zap, Trophy, X, ArrowRight, Clock } from 'lucide-react';
import GrowwLiveChart from './GrowwLiveChart';

const ASSETS = {
  'BTC/USDT': { name: 'Bitcoin', symbol: 'BTC/USDT', basePrice: 68420, icon: '₿', color: '#f59e0b', payout: 95 },
  'ETH/USDT': { name: 'Ethereum', symbol: 'ETH/USDT', basePrice: 3524, icon: 'Ξ', color: '#2563eb', payout: 92 },
  'SOL/USDT': { name: 'Solana', symbol: 'SOL/USDT', basePrice: 184.5, icon: '◎', color: '#06b6d4', payout: 90 },
  'RELIANCE': { name: 'Reliance Industries', symbol: 'RELIANCE', basePrice: 1295.0, icon: '🏢', color: '#10b981', payout: 90 },
  'TATAMOTORS': { name: 'Tata Motors', symbol: 'TATAMOTORS', basePrice: 404.0, icon: '🚗', color: '#38bdf8', payout: 88 },
  'TCS': { name: 'TCS', symbol: 'TCS', basePrice: 3850, icon: '💻', color: '#8b5cf6', payout: 88 },
  'INFY': { name: 'Infosys', symbol: 'INFY', basePrice: 1580, icon: '⚡', color: '#06b6d4', payout: 88 },
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
  const [activeTrade, setActiveTrade] = useState(null);
  const [tradeResult, setTradeResult] = useState(null);

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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#38bdf8" /> LIVE 3D TRADING SIMULATOR
          </span>
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

          {/* Contract Duration Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} color="#38bdf8" /> Expiry:
            </span>
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
          {/* Main Chart Viewport: White-Label Groww-Style Real Market Chart */}
          <div
            className="chart-viewport"
            style={{ position: 'relative', minWidth: 0, overflow: 'hidden' }}
          >
            <GrowwLiveChart
              symbol={selectedAsset}
              assetName={assetInfo.name || selectedAsset}
              basePrice={assetInfo.basePrice}
              height={330}
              onPriceUpdate={(p) => setCurrentPrice((prev) => (prev === p ? prev : p))}
              currencySymbol={selectedAsset.includes('USDT') ? '$' : '₹'}
            />

            {/* Active Contract Overlay Banner */}
            {activeTrade && (
              <div
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: '16px',
                  background: 'rgba(6, 7, 26, 0.92)',
                  backdropFilter: 'blur(10px)',
                  border: `1.5px solid ${activeTrade.direction === 'CALL' ? '#10b981' : '#ef4444'}`,
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: `0 0 24px ${activeTrade.direction === 'CALL' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)'}`,
                  zIndex: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Contract In Progress</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: activeTrade.direction === 'CALL' ? '#10b981' : '#ef4444' }}>
                    {activeTrade.direction} (₹{activeTrade.amount}) @ {selectedAsset.includes('USDT') ? '$' : '₹'}{activeTrade.entryPrice}
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
                    marginBottom: '16px',
                    boxShadow: `0 0 30px ${tradeResult.isWin ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
                  }}
                >
                  {tradeResult.isWin ? <Trophy size={28} color="#10b981" /> : <X size={28} color="#ef4444" />}
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
                  Entry: ${tradeResult.entryPrice} → Close: ${tradeResult.closePrice.toFixed(2)}
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
                  style={{ padding: '9px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Place Next Bet <ArrowRight size={14} />
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
              padding: 'clamp(14px, 3vw, 20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              minWidth: 0,
              boxSizing: 'border-box',
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

                {/* Investment Input */}
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontWeight: 800 }}>₹</span>
                  <input
                    type="number"
                    min="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                    placeholder="Enter bet amount"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(245, 158, 11, 0.45)',
                      borderRadius: '10px',
                      padding: '10px 12px 10px 28px',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 800,
                      outline: 'none',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                    }}
                  />
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
