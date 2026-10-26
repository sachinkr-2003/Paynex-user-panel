import React, { useState, useEffect } from 'react';
import { Trophy, ArrowDownToLine } from 'lucide-react';

const INITIAL_EVENTS = [
  { id: 1, user: 'Aryan99**', type: 'WIN', text: 'Won ₹14,250 on BTC/USDT (60s)', time: 'Just now', color: '#10b981' },
  { id: 2, user: 'Karan_X**', type: 'PAYOUT', text: 'Withdrew ₹25,000 via Instant UPI', time: '1m ago', color: '#38bdf8' },
  { id: 3, user: 'CryptoGuru**', type: 'WIN', text: 'Won $420 USDT on SOL/USDT', time: '2m ago', color: '#10b981' },
  { id: 4, user: 'Pooja_R**', type: 'WIN', text: 'Won ₹8,550 on ETH/USDT (30s)', time: '3m ago', color: '#10b981' },
  { id: 5, user: 'WhaleTrader**', type: 'PAYOUT', text: 'Withdrew 1,200 USDT (TRC-20)', time: '4m ago', color: '#fbbf24' },
];

const NEW_NAMES = ['Aman**', 'Rohan**', 'Deepak**', 'Ananya**', 'Sanjay**', 'Neha**', 'Aditya**', 'Suresh**'];
const NEW_ASSETS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT'];

const LivePayoutFeed = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const name = NEW_NAMES[Math.floor(Math.random() * NEW_NAMES.length)];
      const asset = NEW_ASSETS[Math.floor(Math.random() * NEW_ASSETS.length)];
      const amount = (Math.floor(Math.random() * 20) + 2) * 500;
      const isWin = Math.random() > 0.3;

      const newEvent = {
        id: Date.now(),
        user: name,
        type: isWin ? 'WIN' : 'PAYOUT',
        text: isWin ? `Won ₹${amount.toLocaleString('en-IN')} on ${asset} (30s)` : `Withdrew ₹${amount.toLocaleString('en-IN')} via UPI`,
        time: 'Just now',
        color: isWin ? '#10b981' : '#38bdf8',
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        maxWidth: '1360px',
        margin: '0 auto clamp(30px, 5vw, 60px)',
        padding: '0 clamp(10px, 3vw, 24px)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div
        className="cyber-card"
        style={{
          borderRadius: '18px',
          padding: 'clamp(12px, 2.5vw, 16px) clamp(12px, 3vw, 20px)',
          background: 'rgba(9, 12, 30, 0.85)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
              animation: 'neonBlink 1.4s infinite',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24', letterSpacing: '1px' }}>
            LIVE ACTIVITY & PAYOUTS
          </span>
        </div>

        {/* Horizontal Scrolling or Live Switch Events */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px',
            flex: 1,
            minWidth: '220px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {events.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                padding: '6px 14px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {item.type === 'WIN' ? (
                  <Trophy size={14} color="#10b981" />
                ) : (
                  <ArrowDownToLine size={14} color="#38bdf8" />
                )}
              </span>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>{item.user}:</span>
              <span style={{ color: item.color, fontWeight: 800 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivePayoutFeed;
