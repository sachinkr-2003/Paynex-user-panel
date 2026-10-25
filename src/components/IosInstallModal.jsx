import React from 'react';

export default function IosInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin);
    alert('Link copied! Open Safari on your iPhone and paste this URL.');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(150deg, #131422, #0a0b12)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          color: '#fff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#94a3b8',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 12px',
              borderRadius: '16px',
              border: '2px solid #fbbf24',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
            }}
          >
            <img
              src="/paynex-logo.jpg"
              alt="PAYNEX Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '11px',
              color: '#38bdf8',
              fontWeight: 800,
              marginBottom: '6px',
            }}
          >
            <span>🍎</span>
            <span>Apple iOS • Standalone Web App</span>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 900, margin: '4px 0 6px', color: '#fff' }}>
            Install PAYNEX on iPhone & iPad
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            No App Store required! Run full-screen with native 120Hz smooth charts, fast touch execution & zero lag.
          </p>
        </div>

        {/* 3 Step Visual Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* Step 1 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              🧭
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                Step 1: Open in Safari
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Open this website in Apple's official <strong>Safari browser</strong>.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              ⬆️
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                Step 2: Tap Share Button
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Tap the <strong style={{ color: '#38bdf8' }}>Share icon (⬆️)</strong> at the bottom center of your screen.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              ➕
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                Step 3: "Add to Home Screen"
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Scroll down and select <strong style={{ color: '#10b981' }}>"Add to Home Screen"</strong>, then tap <strong>Add</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '12px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            📋 Copy Safari Link
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              color: '#000',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
            }}
          >
            Understood! ✓
          </button>
        </div>
      </div>
    </div>
  );
}
