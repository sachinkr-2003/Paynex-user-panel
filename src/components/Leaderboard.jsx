import { useState, useEffect } from 'react';

const LEADERBOARD_DATA = {
  today: [
    { rank: 1, user: 'CryptoKaran_99', profit: '₹1,85,400', winRate: '95.8%', trades: 48, asset: 'BTC/USDT', streak: '14 Wins 🔥', badge: '🥇 CHAMPION' },
    { rank: 2, user: 'Priya_Alpha', profit: '₹1,42,800', winRate: '93.2%', trades: 39, asset: 'ETH/USDT', streak: '9 Wins 🔥', badge: '🥈 PRO' },
    { rank: 3, user: 'Vikram_TradeX', profit: '₹1,18,500', winRate: '91.7%', trades: 34, asset: 'SOL/USDT', streak: '7 Wins 🔥', badge: '🥉 ELITE' },
    { rank: 4, user: 'Rahul_Whale', profit: '₹84,200', winRate: '89.5%', trades: 28, asset: 'BTC/USDT', streak: '5 Wins 🔥', badge: 'MASTER' },
    { rank: 5, user: 'Sneha_Crypto', profit: '₹67,900', winRate: '88.0%', trades: 25, asset: 'BNB/USDT', streak: '6 Wins 🔥', badge: 'MASTER' },
    { rank: 6, user: 'Aditya_Bull', profit: '₹52,400', winRate: '86.4%', trades: 22, asset: 'ETH/USDT', streak: '4 Wins', badge: 'EXPERT' },
  ],
  week: [
    { rank: 1, user: 'WhaleKing_IN', profit: '₹8,92,000', winRate: '96.2%', trades: 210, asset: 'BTC/USDT', streak: '22 Wins 🔥', badge: '🥇 CHAMPION' },
    { rank: 2, user: 'CryptoKaran_99', profit: '₹6,45,200', winRate: '94.5%', trades: 175, asset: 'ETH/USDT', streak: '18 Wins 🔥', badge: '🥈 PRO' },
    { rank: 3, user: 'Mumbai_TraderX', profit: '₹5,18,000', winRate: '92.9%', trades: 142, asset: 'SOL/USDT', streak: '11 Wins 🔥', badge: '🥉 ELITE' },
    { rank: 4, user: 'Priya_Alpha', profit: '₹4,12,600', winRate: '91.8%', trades: 120, asset: 'BTC/USDT', streak: '9 Wins 🔥', badge: 'MASTER' },
    { rank: 5, user: 'Rohit_Scalper', profit: '₹3,28,400', winRate: '89.2%', trades: 98, asset: 'SOL/USDT', streak: '8 Wins', badge: 'MASTER' },
    { rank: 6, user: 'Ananya_Pro', profit: '₹2,75,900', winRate: '88.1%', trades: 86, asset: 'BTC/USDT', streak: '5 Wins', badge: 'EXPERT' },
  ],
  allTime: [
    { rank: 1, user: 'AlphaWhale_Global', profit: '₹34,80,000', winRate: '97.1%', trades: 940, asset: 'BTC/USDT', streak: '31 Wins 🔥', badge: '🥇 LEGEND' },
    { rank: 2, user: 'WhaleKing_IN', profit: '₹26,50,000', winRate: '95.6%', trades: 780, asset: 'BTC/USDT', streak: '24 Wins 🔥', badge: '🥈 TITAN' },
    { rank: 3, user: 'CryptoKaran_99', profit: '₹19,25,000', winRate: '94.2%', trades: 610, asset: 'ETH/USDT', streak: '19 Wins 🔥', badge: '🥉 MASTER' },
    { rank: 4, user: 'Delhi_CryptoLord', profit: '₹14,90,000', winRate: '93.0%', trades: 490, asset: 'SOL/USDT', streak: '15 Wins 🔥', badge: 'MASTER' },
    { rank: 5, user: 'Mumbai_TraderX', profit: '₹11,40,000', winRate: '91.8%', trades: 410, asset: 'BTC/USDT', streak: '12 Wins', badge: 'EXPERT' },
    { rank: 6, user: 'Priya_Alpha', profit: '₹9,85,000', winRate: '90.5%', trades: 360, asset: 'ETH/USDT', streak: '10 Wins', badge: 'EXPERT' },
  ],
};

const INITIAL_LIVE_PULSES = [
  { id: 1, user: 'Vikram_99**', asset: 'BTC/USDT', contract: '60s CALL', stake: '₹2,500', profit: '+₹4,875', payout: 'Instant UPI', time: 'Just now', isWin: true },
  { id: 2, user: 'Ananya_Pro**', asset: 'ETH/USDT', contract: '30s PUT', stake: '₹5,000', profit: '+₹9,600', payout: 'USDT (TRC-20)', time: '4s ago', isWin: true },
  { id: 3, user: 'Rohan_K**', asset: 'SOL/USDT', contract: '30s CALL', stake: '₹1,000', profit: '+₹1,900', payout: 'Instant UPI', time: '9s ago', isWin: true },
  { id: 4, user: 'Deepak_X**', asset: 'BTC/USDT', contract: '60s PUT', stake: '₹10,000', profit: '+₹19,500', payout: 'Direct IMPS', time: '14s ago', isWin: true },
  { id: 5, user: 'Kavita_M**', asset: 'ETH/USDT', contract: '30s CALL', stake: '₹3,000', profit: '+₹5,760', payout: 'Instant UPI', time: '21s ago', isWin: true },
];

const NEW_PULSES = [
  { user: 'Sanjay_B**', asset: 'BTC/USDT', contract: '30s CALL', stake: '₹5,000', profit: '+₹9,750', payout: 'Instant UPI' },
  { user: 'Neha_Whale**', asset: 'SOL/USDT', contract: '60s PUT', stake: '₹8,000', profit: '+₹15,200', payout: 'USDT' },
  { user: 'Aman_Pro**', asset: 'ETH/USDT', contract: '30s CALL', stake: '₹2,500', profit: '+₹4,800', payout: 'PhonePe UPI' },
  { user: 'Rajesh_X**', asset: 'BTC/USDT', contract: '60s CALL', stake: '₹15,000', profit: '+₹29,250', payout: 'IMPS Bank' },
  { user: 'Kunal_Trade**', asset: 'SOL/USDT', contract: '30s PUT', stake: '₹4,000', profit: '+₹7,600', payout: 'GooglePay UPI' },
];

const Leaderboard = ({ onScrollToArena }) => {
  const [timeframe, setTimeframe] = useState('today');
  const [tab, setTab] = useState('leaderboard'); // 'leaderboard' | 'live'
  const [liveStream, setLiveStream] = useState(INITIAL_LIVE_PULSES);

  // Live real-time stream simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const template = NEW_PULSES[Math.floor(Math.random() * NEW_PULSES.length)];
      const newEntry = {
        id: Date.now(),
        user: template.user,
        asset: template.asset,
        contract: template.contract,
        stake: template.stake,
        profit: template.profit,
        payout: template.payout,
        time: 'Just now',
        isWin: true,
      };
      setLiveStream((prev) => [newEntry, ...prev.slice(0, 7)]);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  const data = LEADERBOARD_DATA[timeframe] || LEADERBOARD_DATA.today;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const getPodiumStyle = (rank) => {
    if (rank === 1) {
      return {
        border: '1.5px solid rgba(245, 158, 11, 0.7)',
        bg: 'linear-gradient(180deg, rgba(245, 158, 11, 0.16) 0%, rgba(10, 13, 30, 0.95) 100%)',
        glow: '0 0 35px rgba(245, 158, 11, 0.35)',
        badgeColor: '#fbbf24',
        crown: '👑',
        heightOffset: '0px',
      };
    }
    if (rank === 2) {
      return {
        border: '1px solid rgba(148, 163, 184, 0.55)',
        bg: 'linear-gradient(180deg, rgba(148, 163, 184, 0.12) 0%, rgba(10, 13, 30, 0.95) 100%)',
        glow: '0 0 25px rgba(148, 163, 184, 0.2)',
        badgeColor: '#e2e8f0',
        crown: '🥈',
        heightOffset: '14px',
      };
    }
    return {
      border: '1px solid rgba(217, 119, 6, 0.55)',
      bg: 'linear-gradient(180deg, rgba(217, 119, 6, 0.12) 0%, rgba(10, 13, 30, 0.95) 100%)',
      glow: '0 0 25px rgba(217, 119, 6, 0.2)',
      badgeColor: '#f59e0b',
      crown: '🥉',
      heightOffset: '24px',
    };
  };

  return (
    <section
      id="leaderboard"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(50px, 8vw, 80px) clamp(12px, 3vw, 24px)',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Header & Controls */}
      <div
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8"
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '9999px',
              padding: '5px 14px',
              marginBottom: '12px',
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
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#fbbf24',
                letterSpacing: '1.2px',
              }}
            >
              HALL OF FAME • PROVEN SETTLEMENTS
            </span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 10px',
            }}
          >
            Elite Trader <span className="gradient-text-gold">Leaderboard</span> & Live Wins
          </h2>
          <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0, maxWidth: '600px' }}>
            Real traders, verified payouts. Track the top-performing prediction whales and watch real-time contract settlements updated 24/7.
          </p>
        </div>

        {/* View Switcher & Timeframe Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          {/* Main Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setTab('leaderboard')}
              style={{
                background: tab === 'leaderboard' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'transparent',
                color: tab === 'leaderboard' ? '#000' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>🏆</span>
              <span>Top Traders</span>
            </button>
            <button
              onClick={() => setTab('live')}
              style={{
                background: tab === 'live' ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
                color: tab === 'live' ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }}
              />
              <span>Live Feed Stream</span>
            </button>
          </div>

          {/* Timeframe Chips (only if leaderboard view) */}
          {tab === 'leaderboard' && (
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'today', label: 'Today (24H)' },
                { id: 'week', label: 'This Week' },
                { id: 'allTime', label: 'All-Time Legends' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  style={{
                    background: timeframe === tf.id ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${timeframe === tf.id ? '#fbbf24' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: timeframe === tf.id ? '#fbbf24' : '#64748b',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: TOP TRADERS LEADERBOARD */}
      {tab === 'leaderboard' && (
        <>
          {/* Top 3 Champions Podium Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px',
              marginBottom: '30px',
              alignItems: 'flex-end',
            }}
          >
            {top3.map((trader) => {
              const pStyle = getPodiumStyle(trader.rank);
              return (
                <div
                  key={trader.user}
                  className="cyber-card"
                  style={{
                    borderRadius: '20px',
                    padding: '24px 20px',
                    background: pStyle.bg,
                    border: pStyle.border,
                    boxShadow: pStyle.glow,
                    position: 'relative',
                    overflow: 'hidden',
                    marginTop: pStyle.heightOffset,
                  }}
                >
                  {/* Top Badge Banner */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '26px',
                        lineHeight: 1,
                        filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))',
                      }}
                    >
                      {pStyle.crown}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 900,
                        letterSpacing: '1px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: pStyle.badgeColor,
                        border: `1px solid ${pStyle.badgeColor}40`,
                      }}
                    >
                      {trader.badge}
                    </span>
                  </div>

                  {/* Trader Username */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        border: '1.5px solid rgba(245, 158, 11, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 900,
                        color: '#fbbf24',
                      }}
                    >
                      #{trader.rank}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>
                        {trader.user}
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                        {trader.streak}
                      </div>
                    </div>
                  </div>

                  {/* Net Profit Display */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Total Net Profit Won</div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        color: '#10b981',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {trader.profit}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      fontSize: '11.5px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Win Ratio</span>
                      <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 800 }}>
                        {trader.winRate}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Top Asset</span>
                      <span style={{ color: '#fbbf24', fontWeight: 800 }}>
                        {trader.asset}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ranks 4-6 Table */}
          <div
            className="cyber-card"
            style={{
              borderRadius: '16px',
              background: 'rgba(9, 12, 30, 0.85)',
              padding: '16px 20px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '11.5px' }}>
                  <th style={{ padding: '10px 14px' }}>RANK</th>
                  <th style={{ padding: '10px 14px' }}>TRADER</th>
                  <th style={{ padding: '10px 14px' }}>FAVORITE ASSET</th>
                  <th style={{ padding: '10px 14px' }}>WIN RATIO</th>
                  <th style={{ padding: '10px 14px' }}>TOTAL TRADES</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>TOTAL PROFIT</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((trader) => (
                  <tr
                    key={trader.user}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 900, color: '#94a3b8' }}>
                      #{trader.rank}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{trader.user}</span>
                        <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>
                          {trader.streak}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#fbbf24', fontWeight: 700 }}>
                      {trader.asset}
                    </td>
                    <td className="font-mono" style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 800 }}>
                      {trader.winRate}
                    </td>
                    <td className="font-mono" style={{ padding: '12px 14px', color: '#94a3b8' }}>
                      {trader.trades}
                    </td>
                    <td className="font-mono" style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#10b981', fontSize: '15px' }}>
                      {trader.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW 2: REAL-TIME LIVE WINS FEED STREAM */}
      {tab === 'live' && (
        <div
          className="cyber-card"
          style={{
            borderRadius: '20px',
            background: 'rgba(9, 12, 30, 0.92)',
            padding: '24px',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 0 40px rgba(56, 189, 248, 0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                  animation: 'neonBlink 1s infinite',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                LIVE BLOCKCHAIN & UPI PAYOUT ENGINE
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Latency: <strong style={{ color: '#10b981' }}>6ms</strong> • Instant Settlements
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {liveStream.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.25s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}
                  >
                    🏆
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff' }}>
                      {item.user}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Settled via <strong style={{ color: '#38bdf8' }}>{item.payout}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#fbbf24',
                      background: 'rgba(245, 158, 11, 0.12)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {item.asset} ({item.contract})
                  </span>

                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>
                      {item.profit}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Stake: {item.stake} • {item.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call To Action Box */}
      <div
        style={{
          marginTop: '32px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.12) 0%, rgba(5, 6, 14, 0.6) 100%)',
          borderRadius: '18px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        <h4 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#fff' }}>
          Think you can out-trade the whales?
        </h4>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '480px' }}>
          Test your prediction skills in the 3D Arena with 95% payout multiplier and watch your name climb the official Hall of Fame.
        </p>
        <button
          onClick={onScrollToArena}
          className="btn-cyber-primary"
          style={{ padding: '12px 28px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>🚀</span>
          <span>Join Arena & Climb Leaderboard</span>
        </button>
      </div>
    </section>
  );
};

export default Leaderboard;
