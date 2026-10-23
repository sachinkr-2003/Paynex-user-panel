import { useState } from 'react';
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
import VideoModal from './components/VideoModal';

function App() {
  const [demoBalance, setDemoBalance] = useState(50000);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleRechargeDemo = (amt) => {
    setDemoBalance((prev) => prev + amt);
  };

  const handleScrollToArena = () => {
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

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050514', color: '#fff', overflowX: 'hidden' }}>
      {/* 3D Perspective Canvas Background (Video-like atmosphere) */}
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
        onLoginSuccess={(user) => {
          alert(`Welcome, ${user.name}! Demo balance: ₹${demoBalance.toLocaleString('en-IN')}`);
        }}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onRechargeDemo={handleRechargeDemo}
      />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
}

export default App;
