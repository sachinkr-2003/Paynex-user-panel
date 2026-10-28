import React, { useState } from 'react';
import { X, Apple, Download, Settings, Compass, Share, Copy } from 'lucide-react';

export default function IosInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownloadProfile = () => {
    setDownloadTriggered(true);
    // Direct trigger for Apple WebClip configuration profile on iOS Safari
    window.location.href = '/paynex.mobileconfig';
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
          <X size={16} />
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
            <Apple size={14} color="#34d399" />
            <span>Direct iOS Web App Download</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 6px', color: '#fff' }}>
            Download PAYNEX for iPhone
          </h3>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Download the official iOS Web App profile below and install in 10 seconds.
          </p>
        </div>

        {/* METHOD 1 (RECOMMENDED): Native Safari 1-Tap Add to Home Screen */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#34d399', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              ⚡ Method 1: Instant Safari Add (No Settings Needed)
            </div>
            <div style={{ background: '#10b981', color: '#000', fontSize: '9px', fontWeight: 900, padding: '2px 7px', borderRadius: '4px' }}>
              RECOMMENDED
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '8px' }}>
            1. Safari ke bilkul neeche <strong>Share <Share size={12} style={{ display: 'inline', verticalAlign: 'middle', color: '#38bdf8' }} /></strong> button (Square with Arrow) dabayein.<br />
            2. Thoda neeche scroll karke <strong style={{ color: '#10b981' }}>"Add to Home Screen" (+)</strong> par tap karein.<br />
            3. Upar right corner me <strong style={{ color: '#fbbf24' }}>"Add"</strong> dabayein. Done!
          </div>
          <button
            onClick={handleCopyLink}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#38bdf8',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Copy size={12} />
            <span>Copy Website URL to open in Safari</span>
          </button>
        </div>

        {/* METHOD 2: 1-Click Profile Download (.mobileconfig) */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
            📲 Method 2: iOS Profile (.mobileconfig)
          </div>
          <button
            onClick={handleDownloadProfile}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '14px',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Download size={18} color="#fff" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '9px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Download & Install WebClip
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
            borderRadius: '14px',
            padding: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Profile Download ke baad Kaise Install Karein:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ fontSize: '11.5px', color: '#e2e8f0', lineHeight: 1.4 }}>
                Jab Safari me <strong style={{ color: '#10b981' }}>"Profile Downloaded"</strong> popup aaye, to <strong style={{ color: '#38bdf8' }}>"Close"</strong> dabayein.
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid #fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ fontSize: '11.5px', color: '#e2e8f0', lineHeight: 1.4 }}>
                iPhone ki <strong style={{ color: '#fbbf24' }}>Settings <Settings size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /></strong> app kholein → Sabse upar <strong style={{ color: '#38bdf8' }}>"Profile Downloaded"</strong> par tap karein → Top-right me <strong style={{ color: '#10b981' }}>"Install"</strong> dabayein!
              </div>
            </div>
          </div>
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
          Got It, Close
        </button>
      </div>
    </div>
  );
}
