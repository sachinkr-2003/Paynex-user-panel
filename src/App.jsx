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
import userApi from './services/api';
import { showUserConfirm, showUserToast } from './utils/swal';

function App() {
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
      return saved ? Number(saved) : 25480.32;
    } catch {
      return 25480.32;
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

  // 'portal' for logged-in game desk, 'landing' for public showcase
  const [activeView, setActiveView] = useState(() => (currentUser ? 'portal' : 'landing'));
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

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
        const token = localStorage.getItem('paynex_user_token');
        if (!token) return;
        const res = await userApi.getMe();
        if (!isMounted) return;
        if (res.success && res.user) {
          setCurrentUser(res.user);
          if (typeof res.user.balance === 'number') {
            setRealBalance(res.user.balance);
          }
        }
      } catch (err) {
        console.warn('Live profile sync notice:', err.message);
      }
    };
    syncLiveProfile();
    const interval = setInterval(syncLiveProfile, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('paynex_user', JSON.stringify(userData));
    setActiveView('portal');
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
      setActiveView('landing');
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

  // When user is logged in, show ONLY the Game & App Portal (NO website sections)
  if (currentUser) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: '#07070a', color: '#fff' }}>
        <UserTradingPortal
          user={currentUser}
          realBalance={realBalance}
          setRealBalance={setRealBalance}
          onOpenDeposit={() => setDepositModalOpen(true)}
          onOpenWithdraw={() => setWithdrawModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Global Deposit & Withdraw Modals */}
        <DepositModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
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

  // Otherwise render full Public Website / Landing View
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050514', color: '#fff', overflowX: 'hidden' }}>
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
        onClose={() => setDepositModalOpen(false)}
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

