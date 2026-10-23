import { useState, useEffect } from 'react';

const Navbar = ({ onOpenAuth, onOpenDeposit, demoBalance = 50000 }) => {
  const [active, setActive] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home', icon: '🏠' },
    { label: 'Markets', href: '#markets', icon: '📊' },
    { label: '3D Trade Arena', href: '#trading-arena', icon: '⚡' },
    { label: 'Leaderboard', href: '#leaderboard', icon: '🏆' },
    { label: 'VIP Tiers', href: '#vip', icon: '💎' },
  ];

  // Handle direct hash navigation, browser back/forward, and hash changes
  useEffect(() => {
    const scrollToHash = (hash, isInitial = false) => {
      if (!hash || hash === '#' || hash === '#home') {
        setActive('Home');
        if (!isInitial) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      const item = navItems.find((n) => n.href === hash);
      if (item) setActive(item.label);
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 110;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: isInitial ? 'auto' : 'smooth',
        });
      }
    };

    if (window.location.hash) {
      // Small timeout to allow DOM layout to stabilize on initial mount
      const timer = setTimeout(() => scrollToHash(window.location.hash, true), 120);
      return () => clearTimeout(timer);
    }

    const handleHashChange = () => {
      scrollToHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolled(scrollPos > 20);

      // Scroll Spy to highlight the active section automatically
      if (scrollPos < 280) {
        setActive('Home');
      } else {
        const sections = [
          { label: 'VIP Tiers', id: 'vip' },
          { label: 'Leaderboard', id: 'leaderboard' },
          { label: '3D Trade Arena', id: 'trading-arena' },
          { label: 'Markets', id: 'markets' },
        ];
        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200) {
              setActive(sec.label);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer if screen is resized to desktop width (>1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (label, href) => {
    setActive(label);
    setMobileMenuOpen(false);

    if (window.location.hash !== href) {
      window.history.pushState(null, '', href);
    }

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <nav
        style={{
          background: scrolled ? 'rgba(5, 6, 14, 0.96)' : 'rgba(5, 6, 14, 0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.22)',
          transition: 'background 0.3s, box-shadow 0.3s',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 158, 11, 0.12)' : 'none',
          position: 'relative',
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0 clamp(12px, 3vw, 24px)',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Brand Logo with Official PAYNEX Golden Bull */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('Home', '#home');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                overflow: 'hidden',
                border: '1.5px solid rgba(245, 158, 11, 0.65)',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
                flexShrink: 0,
                background: '#05060e',
              }}
            >
              <img
                src="/paynex-logo.jpg"
                alt="PAYNEX CRYPTO Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  className="font-display"
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(17px, 3.5vw, 21px)',
                    letterSpacing: '0.5px',
                    color: '#fff',
                  }}
                >
                  PAY<span style={{ color: '#fbbf24', textShadow: '0 0 12px rgba(245, 158, 11, 0.6)' }}>NEX</span>
                </span>
                <span
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    padding: '1.5px 5px',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                  }}
                >
                  CRYPTO
                </span>
              </div>
              <p
                className="hidden sm:block"
                style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.4px', margin: 0, fontWeight: 500 }}
              >
                Invest Today and Grow Tomorrow
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links (Visible on Desktop > 1024px, Hidden on Mobile via .nav-desktop-links) */}
          <div
            className="nav-desktop-links"
            style={{
              gap: 'clamp(10px, 2vw, 24px)',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.label, item.href);
                }}
                style={{
                  color: active === item.label ? '#fbbf24' : '#94a3b8',
                  fontSize: '13.5px',
                  fontWeight: active === item.label ? 800 : 500,
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '6px 2px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => {
                  if (active !== item.label) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {item.label}
                {active === item.label && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, #f59e0b, #3b82f6)',
                      boxShadow: '0 0 10px #fbbf24',
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Sign In Button */}
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="btn-cyber-outline hidden sm:inline-flex"
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              Sign In
            </button>

            {/* Download App CTA */}
            <button
              onClick={() => handleNavClick('Mobile App', '#mobile-app')}
              className="btn-cyber-primary"
              style={{
                padding: '7px 13px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>📲</span>
              <span>App</span>
            </button>

            {/* Mobile 3-Line Hamburger Menu Button (Visible ONLY on Mobile View <= 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-hamburger"
              aria-label="Toggle Mobile Navigation Menu"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: mobileMenuOpen ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: `1.5px solid ${mobileMenuOpen ? '#fbbf24' : 'rgba(245, 158, 11, 0.3)'}`,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '8px',
                boxShadow: mobileMenuOpen ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
              }}
            >
              {mobileMenuOpen ? (
                <span style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>✕</span>
              ) : (
                <>
                  <span style={{ width: '18px', height: '2px', background: '#fbbf24', borderRadius: '2px' }} />
                  <span style={{ width: '18px', height: '2px', background: '#fbbf24', borderRadius: '2px' }} />
                  <span style={{ width: '13px', height: '2px', background: '#38bdf8', alignSelf: 'flex-start', borderRadius: '2px' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sliding Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '110px', // below marquee + navbar
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(4, 5, 15, 0.96)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 18px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            overflowY: 'auto',
            animation: 'fadeInDown 0.25s ease-out',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Demo Balance Header in Drawer (Recharge removed) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '14px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Demo Trade Funds</div>
                <div className="font-mono" style={{ fontSize: '17px', fontWeight: 900, color: '#fbbf24' }}>
                  ₹{demoBalance.toLocaleString('en-IN')}
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}
              >
                ● Active Demo
              </span>
            </div>

            {/* Menu Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.label, item.href);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: active === item.label ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${active === item.label ? '#fbbf24' : 'rgba(255, 255, 255, 0.06)'}`,
                    color: active === item.label ? '#fbbf24' : '#fff',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Mobile Auth Actions (Create Account removed, full-width Sign In) */}
            <div style={{ marginBottom: '4px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth && onOpenAuth('login');
                }}
                className="btn-cyber-primary"
                style={{
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  textAlign: 'center',
                  width: '100%',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>🔐</span>
                <span>Sign In</span>
              </button>
            </div>

            {/* App Promotion Banner in Drawer */}
            <div
              onClick={() => handleNavClick('Mobile App', '#mobile-app')}
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>📱</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>PAYNEX Mobile APK</div>
                  <div style={{ fontSize: '10px', color: '#38bdf8' }}>Ultra-Low Latency 120Hz Trading</div>
                </div>
              </div>
              <span style={{ color: '#fbbf24', fontWeight: 900, fontSize: '16px' }}>➔</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
