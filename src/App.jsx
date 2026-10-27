import { useState, useEffect } from 'react';
import './index.css';
import BackgroundCanvas from './components/BackgroundCanvas';
import CryptoTickerMarquee from './components/CryptoTickerMarquee';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LivePayoutFeed from './components/LivePayoutFeed';
import TradingSimulator3D from './components/TradingSimulator3D';
import Leaderboard from './components/Leaderboard';
import MarketsTable3D from './components/MarketsTable3D';
import CapitalWarrantySection from './components/CapitalWarrantySection';
import Features from './components/Features';
import VIPClubSection from './components/VIPClubSection';
import MobileApp from './components/MobileApp';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import VideoModal from './components/VideoModal';
import UserTradingPortal from './components/UserTradingPortal';
import ApkLoginScreen from './components/ApkLoginScreen';
import ApkRegisterScreen from './components/ApkRegisterScreen';
import LogoPreloader from './components/LogoPreloader';
import userApi from './services/api';
import { showUserConfirm, showUserToast } from './utils/swal';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('paynex_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [realBalance, setRealBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('paynex_real_bal');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [demoBalance, setDemoBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('paynex_demo_bal');
      return saved ? Number(saved) : 50000;
    } catch {
      return 50000;
    }
  });

  // View mode: 'website' (ALWAYS Default!), 'portal' (Trading Desk), 'app' (APK view)
  const [activeView, setActiveView] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'portal') return 'portal';
      if (urlParams.get('view') === 'app' || urlParams.get('view') === 'apk') return 'app';
    } catch {}
    return 'website'; // Website is ALWAYS the default open screen!
  });
  const [authScreen, setAuthScreen] = useState('login');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [depositModalOpen, setDepositModalOpen] = useState(() => {
    try {
      return (
        window.location.pathname.includes('/deposit') ||
        window.location.search.includes('modal=deposit')
      );
    } catch {
      return false;
    }
  });
  const [depositTargetCompany, setDepositTargetCompany] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenDepositForCompany = (company = null) => {
    setDepositTargetCompany(company);
    setDepositModalOpen(true);
  };

  const handleCloseDeposit = () => {
    setDepositModalOpen(false);
    setDepositTargetCompany(null);
    try {
      if (window.location.pathname.includes('/deposit')) {
        window.history.pushState(null, '', '/');
      }
    } catch (_) {}
  };

  useEffect(() => {
    localStorage.setItem('paynex_real_bal', realBalance);
  }, [realBalance]);

  useEffect(() => {
    localStorage.setItem('paynex_demo_bal', demoBalance);
  }, [demoBalance]);

  // Live profile & balance sync from MongoDB
  useEffect(() => {
    let isMounted = true;
    const syncLiveProfile = async () => {
      try {
        const token = localStorage.getItem('paynex_user_token') || localStorage.getItem('paynex_token');
        if (!token) return;
        const res = await userApi.getMe();
        if (!isMounted) return;
        if (res.success && res.user) {
          setCurrentUser(res.user);
          try {
            localStorage.setItem('paynex_user', JSON.stringify(res.user));
          } catch (_) {}
          if (typeof res.user.balance === 'number') {
            setRealBalance(res.user.balance);
            try {
              localStorage.setItem('paynex_real_bal', res.user.balance);
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Live profile sync notice:', err.message);
      }
    };
    syncLiveProfile();
    const interval = setInterval(syncLiveProfile, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleOpenAuth = (tab = 'login') => {
    setAuthScreen(tab);
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('paynex_user', JSON.stringify(userData));
    setAuthModalOpen(false);
    showUserToast(`Welcome back, ${userData?.name || 'Trader'}!`);
    setActiveView('portal'); // Direct dashboard on sign in!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    const confirmed = await showUserConfirm(
      'Sign Out of Trading Desk',
      'Are you sure you want to exit your trading session?',
      'YES, LOGOUT',
      'STAY LOGGED IN'
    );
    if (confirmed) {
      setCurrentUser(null);
      localStorage.removeItem('paynex_user');
      localStorage.removeItem('paynex_user_token');
      localStorage.removeItem('paynex_token');
      localStorage.removeItem('paynex_real_bal');
      setRealBalance(0);
      setActiveView('website'); // Direct website on logout!
      setAuthScreen('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showUserToast('Logged out successfully');
    }
  };

  const handleDeposit = (amt) => {
    setRealBalance((prev) => prev + Number(amt));
  };

  const handleWithdrawSuccess = (amt) => {
    setRealBalance((prev) => Math.max(0, prev - Number(amt)));
  };

  const handleScrollToArena = () => {
    if (activeView === 'portal') return;
    const el = document.getElementById('trading-arena');
    if (el) {
      const headerOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      if (window.location.hash !== '#trading-arena') {
        window.history.pushState(null, '', '#trading-arena');
      }
    }
  };

  // 1. Trading Portal View: Shown ONLY when explicitly opened via "Trade Desk" button
  if (activeView === 'portal' && currentUser) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: '#07070a', color: '#fff' }}>
        {isInitialLoading && (
          <LogoPreloader onComplete={() => setIsInitialLoading(false)} />
        )}
        <UserTradingPortal
          user={currentUser}
          realBalance={realBalance}
          setRealBalance={setRealBalance}
          onOpenDeposit={(company) => handleOpenDepositForCompany(company)}
          onOpenWithdraw={() => setWithdrawModalOpen(true)}
          onLogout={handleLogout}
          onBackToWebsite={() => {
            setActiveView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Global Deposit & Withdraw Modals */}
        <DepositModal
          isOpen={depositModalOpen}
          onClose={handleCloseDeposit}
          initialCompany={depositTargetCompany}
          onRechargeDemo={handleDeposit}
        />

        <WithdrawModal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          realBalance={realBalance}
          onWithdrawSuccess={handleWithdrawSuccess}
        />
      </div>
    );
  }

  // 2. APK Mobile View Preview (when explicitly requested)
  if (activeView === 'app') {
    if (authScreen === 'register') {
      return (
        <ApkRegisterScreen
          onRegisterSuccess={(userData) => {
            handleLoginSuccess(userData);
            setActiveView('website');
          }}
          onSwitchToLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <>
        <ApkLoginScreen
          onLoginSuccess={(userData) => {
            handleLoginSuccess(userData);
            setActiveView('website');
          }}
          onSwitchToRegister={() => setAuthScreen('register')}
          onSwitchToLanding={() => setActiveView('website')}
        />
        <DepositModal
          isOpen={depositModalOpen}
          onClose={handleCloseDeposit}
          initialCompany={depositTargetCompany}
          onRechargeDemo={handleDeposit}
        />
      </>
    );
  }

  // 3. DEFAULT: Public Website / Landing View (ALWAYS open by default on visit or refresh)
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050514', color: '#fff', overflowX: 'hidden' }}>
      {/* Brand Logo Preloader */}
      {isInitialLoading && (
        <LogoPreloader onComplete={() => setIsInitialLoading(false)} />
      )}

      {/* 3D Perspective Canvas Background */}
      <BackgroundCanvas />

      {/* Permanently Fixed Top Header: Live 24H Crypto Ticker (Top Bar) + Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <CryptoTickerMarquee onSelectAsset={handleScrollToArena} />
        <Navbar
          onOpenAuth={handleOpenAuth}
          onOpenDeposit={() => setDepositModalOpen(true)}
          demoBalance={demoBalance}
          realBalance={realBalance}
          currentUser={currentUser}
          onOpenTradingDesk={() => setActiveView('portal')}
          onLogout={handleLogout}
        />
      </header>

      {/* Main Page Content (Offset by Header Height: 120px for clean clearance) */}
      <main style={{ position: 'relative', zIndex: 10, paddingTop: '120px' }}>
        {/* 3D Hero Section */}
        <Hero
          onOpenAuth={handleOpenAuth}
          onOpenVideo={() => setVideoModalOpen(true)}
          onScrollToArena={handleScrollToArena}
          demoBalance={demoBalance}
          setDemoBalance={setDemoBalance}
        />

        {/* Live Social Proof / Win & Payout Ticker */}
        <LivePayoutFeed />

        {/* Real-Time Crypto Markets Table */}
        <MarketsTable3D onSelectAsset={handleScrollToArena} />

        {/* 3D Interactive Bet Trading Arena & Simulator */}
        <TradingSimulator3D
          demoBalance={demoBalance}
          setDemoBalance={setDemoBalance}
        />

        {/* Elite Trader Leaderboard & Live Real-Time Wins */}
        <Leaderboard onScrollToArena={handleScrollToArena} />

        {/* 8-Year Capital Protection Guarantee & Solvency Warranty Section */}
        <CapitalWarrantySection onOpenAuth={handleOpenAuth} />

        {/* 3D Tilt Feature Highlights */}
        <Features />

        {/* VIP Whale Club & Rewards */}
        <VIPClubSection onOpenAuth={handleOpenAuth} />

        {/* Mobile APK Showcase */}
        <MobileApp />

        {/* Frequently Asked Questions */}
        <FAQ />
      </main>

      {/* Institutional Exchange Footer */}
      <Footer />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
        onLoginSuccess={handleLoginSuccess}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false);
          setDepositTargetCompany(null);
        }}
        initialCompany={depositTargetCompany}
        onRechargeDemo={handleDeposit}
      />

      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        realBalance={realBalance}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
}

export default App;

