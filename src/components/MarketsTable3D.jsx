import { useState } from 'react';

const MARKETS_DATA = [
  { rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 68420.5, change: 3.84, high: 69200, low: 67100, volume: '28.4B', category: 'layer1', icon: '₿', color: '#f59e0b' },
  { rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3524.8, change: 2.15, high: 3590, low: 3460, volume: '14.2B', category: 'layer1', icon: 'Ξ', color: '#2563eb' },
  { rank: 3, name: 'Solana', symbol: 'SOL', price: 184.6, change: 7.92, high: 188.5, low: 172.0, volume: '6.8B', category: 'layer1', icon: '◎', color: '#06b6d4' },
  { rank: 4, name: 'Binance Coin', symbol: 'BNB', price: 592.1, change: 1.45, high: 598.0, low: 585.0, volume: '1.9B', category: 'layer1', icon: '🟡', color: '#eab308' },
  { rank: 5, name: 'Ripple', symbol: 'XRP', price: 0.5892, change: 4.62, high: 0.605, low: 0.562, volume: '2.1B', category: 'defi', icon: '✕', color: '#38bdf8' },
  { rank: 6, name: 'Dogecoin', symbol: 'DOGE', price: 0.1472, change: -1.25, high: 0.155, low: 0.142, volume: '1.4B', category: 'meme', icon: 'Ð', color: '#fb923c' },
  { rank: 7, name: 'Pepe', symbol: 'PEPE', price: 0.00000984, change: 14.8, high: 0.0000105, low: 0.0000084, volume: '980M', category: 'meme', icon: '🐸', color: '#10b981' },
  { rank: 8, name: 'Near Protocol', symbol: 'NEAR', price: 5.42, change: 5.14, high: 5.65, low: 5.15, volume: '620M', category: 'layer1', icon: 'Ⓝ', color: '#0284c7' },
  { rank: 9, name: 'Avalanche', symbol: 'AVAX', price: 32.4, change: 3.12, high: 33.8, low: 31.2, volume: '490M', category: 'layer1', icon: '🔺', color: '#ef4444' },
];

const MiniSparkline = ({ isPositive }) => (
  <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
    <path
      d={isPositive ? "M0,18 Q20,16 40,8 T80,3" : "M0,4 Q20,8 40,16 T80,21"}
      stroke={isPositive ? '#10b981' : '#ef4444'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MarketsTable3D = ({ onSelectAsset }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = MARKETS_DATA.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'gainers') return item.change > 4;
    return item.category === activeTab;
  });

  return (
    <section
      id="markets"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: 'clamp(50px, 8vw, 80px) clamp(12px, 3vw, 24px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8"
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#fbbf24',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            REAL-TIME CRYPTO FEEDS • PAYNEX
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)',
              fontWeight: 900,
              color: '#fff',
            }}
          >
            Popular <span className="gradient-text-gold">Crypto Assets</span>
          </h2>
        </div>

        {/* Tab Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '4px',
          }}
        >
          {[
            { id: 'all', label: 'All Coins' },
            { id: 'gainers', label: 'Top Gainers 🔥' },
            { id: 'layer1', label: 'Layer-1 ⚡' },
            { id: 'meme', label: 'Memes 🐸' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
                color: activeTab === tab.id ? '#120a00' : '#94a3b8',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Cyber Glass Table */}
      <div
        className="cyber-card"
        style={{
          borderRadius: '20px',
          overflowX: 'auto',
          background: 'rgba(9, 12, 30, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                background: 'rgba(245, 158, 11, 0.06)',
              }}
            >
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>#</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>ASSET</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>PRICE</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>24H CHANGE</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }} className="hidden sm:table-cell">24H HIGH / LOW</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }} className="hidden md:table-cell">24H VOLUME</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700 }} className="hidden lg:table-cell">TREND</th>
              <th style={{ padding: '16px 20px', fontSize: '12px', color: '#fbbf24', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((coin) => {
              const isPositive = coin.change >= 0;
              return (
                <tr
                  key={coin.symbol}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 20px', fontSize: '12px', color: '#64748b' }}>{coin.rank}</td>

                  {/* Asset Icon & Name */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: coin.color,
                          fontWeight: 900,
                          fontSize: '14px',
                          boxShadow: `0 0 10px ${coin.color}35`,
                        }}
                      >
                        {coin.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{coin.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{coin.symbol}</div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '16px 20px' }}>
                    <div className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                      ${coin.price > 1 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : coin.price.toFixed(8)}
                    </div>
                  </td>

                  {/* 24h Change */}
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isPositive ? '#10b981' : '#ef4444',
                        background: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                      }}
                    >
                      {isPositive ? '+' : ''}{coin.change}%
                    </span>
                  </td>

                  {/* High/Low */}
                  <td style={{ padding: '16px 20px' }} className="hidden sm:table-cell">
                    <div className="font-mono" style={{ fontSize: '12px', color: '#94a3b8' }}>
                      ${coin.high} / ${coin.low}
                    </div>
                  </td>

                  {/* Volume */}
                  <td style={{ padding: '16px 20px' }} className="hidden md:table-cell">
                    <div className="font-mono" style={{ fontSize: '12px', color: '#cbd5e1' }}>
                      ${coin.volume}
                    </div>
                  </td>

                  {/* Sparkline Trend */}
                  <td style={{ padding: '16px 20px' }} className="hidden lg:table-cell">
                    <MiniSparkline isPositive={isPositive} />
                  </td>

                  {/* Action */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (onSelectAsset) onSelectAsset(`${coin.symbol}/USDT`);
                        const el = document.getElementById('trading-arena');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-cyber-primary"
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        borderRadius: '8px',
                      }}
                    >
                      Trade ➔
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MarketsTable3D;
