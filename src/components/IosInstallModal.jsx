import React, { useState } from 'react';

export default function IosInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownloadProfile = () => {
    setDownloadTriggered(true);
    // Direct trigger for Apple WebClip configuration profile
    const link = document.createElement('a');
    link.href = '/paynex.mobileconfig';
    link.setAttribute('download', 'PAYNEX_iOS_App.mobileconfig');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Backup navigation for Safari/Chrome on iOS
    setTimeout(() => {
      window.location.href = '/paynex.mobileconfig';
    }, 400);
  };

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
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
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
          maxWidth: '470px',
          background: 'linear-gradient(155deg, #121528 0%, #060710 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '26px',
          padding: '26px 22px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.15)',
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
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              borderRadius: '18px',
              border: '2px solid #fbbf24',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
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
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '11px',
              color: '#34d399',
              fontWeight: 800,
              marginBottom: '8px',
            }}
          >
            <span>🍏</span>
            <span>Direct iOS Web App Download</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 6px', color: '#fff' }}>
            Download PAYNEX for iPhone
          </h3>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Download the official iOS Web App profile below and install in 10 seconds.
          </p>
        </div>

        {/* MAIN ACTION: 1-Click Direct Download Button */}
        <div style={{ marginBottom: '18px' }}>
          <button
            onClick={handleDownloadProfile}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 18px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '15px',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span style={{ fontSize: '22px' }}>📥</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Direct 1-Click Download
              </div>
              <div>Download iOS Profile (.mobileconfig)</div>
            </div>
          </button>
        </div>

        {/* 2 Easy Steps to Install After Download */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Install Guide (After Downloading):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                When iPhone prompts <span style={{ color: '#38bdf8', fontWeight: 700 }}>"Download configuration profile?"</span>, tap <strong style={{ color: '#10b981' }}>"Allow"</strong>.
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid #fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                Open iPhone <strong style={{ color: '#fbbf24' }}>Settings ⚙️</strong> ➔ Tap <strong style={{ color: '#38bdf8' }}>"Profile Downloaded"</strong> (at the top) ➔ Tap <strong style={{ color: '#10b981' }}>"Install"</strong>!
              </div>
            </div>
          </div>
        </div>

        {/* Alternative: Safari Add to Home Screen */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px dashed rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            🧭 Or in Safari: Tap <strong style={{ color: '#38bdf8' }}>Share (⬆️)</strong> ➔ <strong style={{ color: '#10b981' }}>Add to Home Screen</strong>
          </div>
          <button
            onClick={handleCopyLink}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '5px 10px',
              color: '#fff',
              fontSize: '10.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            📋 Copy URL
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '11px',
            color: '#cbd5e1',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Got It, Close ✓
        </button>
      </div>
    </div>
  );
}
