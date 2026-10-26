import { useState, useEffect } from 'react';
import AssetIcon from './AssetIcon';

const INITIAL_COINS = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 68420.5, change: 3.84, icon: 'btc', color: '#f59e0b', sparkline: [40, 45, 42, 48, 52, 49, 58, 62] },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 3524.8, change: 2.15, icon: 'eth', color: '#2563eb', sparkline: [30, 32, 28, 35, 42, 40, 48, 51] },
  { symbol: 'SOL/USDT', name: 'Solana', price: 184.6, change: 7.92, icon: 'sol', color: '#06b6d4', sparkline: [20, 25, 22, 34, 39, 45, 52, 60] },
  { symbol: 'BNB/USDT', name: 'Binance', price: 592.1, change: 1.45, icon: 'bnb', color: '#eab308', sparkline: [45, 46, 44, 48, 49, 51, 52, 54] },
  { symbol: 'XRP/USDT', name: 'Ripple', price: 0.5892, change: 4.62, icon: 'xrp', color: '#38bdf8', sparkline: [12, 14, 13, 17, 18, 16, 21, 24] },
  { symbol: 'DOGE/USDT', name: 'Dogecoin', price: 0.1472, change: -1.25, icon: 'doge', color: '#fb923c', sparkline: [30, 28, 29, 27, 26, 28, 25, 24] },
  { symbol: 'PEPE/USDT', name: 'Pepe', price: 0.00000984, change: 12.8, icon: 'pepe', color: '#10b981', sparkline: [10, 15, 12, 22, 28, 35, 42, 55] },
  { symbol: 'NEAR/USDT', name: 'Near Protocol', price: 5.42, change: 5.14, icon: 'near', color: '#0284c7', sparkline: [18, 20, 19, 23, 24, 28, 31, 35] },
];

const CryptoTickerMarquee = ({ onSelectAsset }) => {
  const [coins, setCoins] = useState(INITIAL_COINS);

  // Micro-fluctuations simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) =>
        prev.map((c) => {
          const delta = (Math.random() - 0.48) * (c.price * 0.0015);
          const newPrice = Math.max(0.000001, c.price + delta);
          const flash = delta >= 0 ? 'bull' : 'bear';
          return {
            ...c,
            price: newPrice,
            flash,
          };
        })
      );
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 40,
        background: 'linear-gradient(90deg, #04050e 0%, #090d24 50%, #04050e 100%)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.18)',
        overflow: 'hidden',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Live Badge */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 5,
          background: 'linear-gradient(90deg, #05060e 82%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
        className="px-2 sm:px-4 sm:pl-6"
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 10px #10b981',
            animation: 'neonBlink 1.5s infinite',
          }}
        />
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 800,
            color: '#fbbf24',
            letterSpacing: '0.8px',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="hidden sm:inline">LIVE 24H TICKER</span>
          <span className="sm:hidden">LIVE</span>
        </span>
      </div>

      {/* Marquee Track */}
      <div className="marquee-track pl-[75px] sm:pl-[170px]">
        {[...coins, ...coins].map((coin, index) => {
          const isPositive = coin.change >= 0;
          return (
            <div
              key={`${coin.symbol}-${index}`}
              onClick={() => onSelectAsset && onSelectAsset(coin.symbol)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 24px',
                borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: coin.color,
                  fontWeight: 800,
                  boxShadow: `0 0 10px ${coin.color}40`,
                }}
              >
                <AssetIcon symbol={coin.symbol} iconName={coin.icon} size={13} color={coin.color} />
              </div>

              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>{coin.symbol}</span>

              <span
                className="font-mono"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: coin.flash === 'bull' ? '#10b981' : coin.flash === 'bear' ? '#ef4444' : '#fff',
                  transition: 'color 0.4s',
                }}
              >
                ${coin.price > 1 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(6)}
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isPositive ? '#10b981' : '#ef4444',
                  background: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {isPositive ? '+' : ''}{coin.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoTickerMarquee;
