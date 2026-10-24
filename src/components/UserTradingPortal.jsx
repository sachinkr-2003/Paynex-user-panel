import { useState, useEffect, useRef } from 'react';
import userApi from '../services/api';
import { showUserSuccess, showUserWarning, showUserError } from '../utils/swal';
import { FIFTY_STOCKS_MAP, getCompanyQrUrl, enrichStockWithPayment } from '../data/stocksData';


const DEFAULT_ASSETS = FIFTY_STOCKS_MAP;

const TIMEFRAMES = [
  { label: '15s Flash', seconds: 15 },
  { label: '30s Turbo', seconds: 30 },
  { label: '60s Standard', seconds: 60 },
  { label: '2m Pro', seconds: 120 },
];

const BET_PRESETS = [500, 1000, 2500, 5000, 10000];
const ADMIN_RETURN_TIERS = [15, 20, 25, 30, 40, 50, 75, 100];

const UserTradingPortal = ({
  user,
  realBalance,
  setRealBalance,
  onOpenDeposit,
  onOpenWithdraw,
  onLogout,
}) => {
  // Navigation Tabs: 'game' (3D Trade Arena), 'home' (APK Screen 5), 'market', 'wallet', 'profile'
  const [currentTab, setCurrentTab] = useState('game');
  const [assetsMap, setAssetsMap] = useState(DEFAULT_ASSETS);
  const ASSETS = assetsMap;
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[1]);
  const [betAmount, setBetAmount] = useState(5000); // Default 5000 as requested by user
  const [currentPrice, setCurrentPrice] = useState(DEFAULT_ASSETS['BTC/USDT'].basePrice);
  const [priceHistory, setPriceHistory] = useState([]);
  const [activeTrade, setActiveTrade] = useState(null);
  const [tradeResult, setTradeResult] = useState(null);
  const [candleType, setCandleType] = useState('line'); // 'line' or 'candle'
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [marketSearch, setMarketSearch] = useState('');
  const [marketFilter, setMarketFilter] = useState('All');

  // Admin-Defined Profit Percentage (Platform Default fallback)
  const [adminProfitPercent, setAdminProfitPercent] = useState(() => {
    try {
      const saved = localStorage.getItem('paynex_admin_percent');
      return saved ? Number(saved) : 30; // Default 30%
    } catch {
      return 30;
    }
  });

  // Dynamic asset-specific return rate (e.g. Tata Motors 40%, BTC 30%, Reliance 22%)
  const currentAsset = assetsMap[selectedAsset] || DEFAULT_ASSETS[selectedAsset] || DEFAULT_ASSETS['BTC/USDT'];
  const currentAssetRate = currentAsset?.returnPercent ?? adminProfitPercent;

  // Fetch live assets and interest rates from backend
  useEffect(() => {
    let isMounted = true;
    const fetchLiveAssets = async () => {
      try {
        const res = await userApi.getAssets();
        if (res && res.success && Array.isArray(res.assets) && res.assets.length > 0) {
          const map = {};
          res.assets.forEach((a) => {
            const key = a.symbol || a.id;
            const cleanSym = (a.symbol || a.id || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '');
            map[key] = {
              id: a.id,
              name: a.name,
              symbol: a.symbol,
              category: a.category || 'Stock',
              basePrice: Number(a.basePrice) || 1000,
              step: Number(a.step) || Math.max(1, (Number(a.basePrice) * 0.001)),
              icon: a.icon || '📈',
              color: a.color || '#38bdf8',
              returnPercent: Number(a.returnPercent) || 30,
              payout: 90,
              minStake: a.minStake,
              maxStake: a.maxStake,
              isEnabled: a.isEnabled,
              upiId: a.upiId || `${cleanSym}.paynex@icici`,
              payeeName: a.payeeName || `${a.name} Trading Desk`,
              qrCode: a.qrCode || '',
            };
          });
          if (isMounted) {
            setAssetsMap((prev) => ({ ...prev, ...map }));
          }
        }
      } catch (err) {
        console.warn('Assets sync notice:', err.message);
      }
    };
    fetchLiveAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Settings & Profile Subpages State
  const [activeSettingModal, setActiveSettingModal] = useState(null);
  const [profileName, setProfileName] = useState(() => (user?.name && user.name.toLowerCase() !== 'admin') ? user.name : 'Skraj0451');
  const [profileEmail, setProfileEmail] = useState(() => (user?.email && !user.email.toLowerCase().includes('admin')) ? user.email : 'skraj0451@gmail.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileDob, setProfileDob] = useState('14/08/1998');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [smsOtpEnabled, setSmsOtpEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [bankAccount, setBankAccount] = useState({
    bankName: 'HDFC Bank',
    holderName: 'Sachin Kumar',
    accountNumber: '458912349012',
    ifsc: 'HDFC0001234',
    upiId: 'skraj0451@okhdfcbank',
  });
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: 'HDFC Bank',
    holderName: 'Sachin Kumar',
    accountNumber: '458912349012',
    ifsc: 'HDFC0001234',
    upiId: 'skraj0451@okhdfcbank',
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [showAdminConfig, setShowAdminConfig] = useState(false);

  const [tradeHistory, setTradeHistory] = useState([]);


  const [walletHistory, setWalletHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadWalletData = async () => {
      try {
        const res = await userApi.getWalletHistory();
        if (isMounted && res.success) {
          const combined = [
            ...(res.deposits || []).map((d) => ({
              title: `Deposit (${d.method})`,
              date: d.time || (d.createdAt ? new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'),
              amount: `+ ₹${Number(d.amount).toLocaleString('en-IN')}`,
              status: d.status,
              color: d.status === 'Approved' ? '#10b981' : d.status === 'Pending' ? '#fbbf24' : '#ef4444',
            })),
            ...(res.withdrawals || []).map((w) => ({
              title: `Withdrawal (${w.method})`,
              date: w.time || (w.createdAt ? new Date(w.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'),
              amount: `- ₹${Number(w.amount).toLocaleString('en-IN')}`,
              status: w.status,
              color: w.status === 'Released' ? '#10b981' : w.status === 'Pending' ? '#fbbf24' : '#ef4444',
            })),
          ];
          if (combined.length > 0) {
            setWalletHistory(combined);
          }
        }
      } catch (e) {
        console.warn('Wallet history sync fallback:', e.message);
      }
    };
    loadWalletData();
  }, [currentTab]);

  const canvasRef = useRef(null);
  const currentBalance = realBalance;

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartHeight = windowWidth < 640 ? 190 : windowWidth < 992 ? 260 : 320;

  // Live Multiplayer Room Stakers & Pool State ("Koun Kitna Lagaye Hai")
  const [liveTradersCount, setLiveTradersCount] = useState(1348);
  const [roomTraders, setRoomTraders] = useState([
    { id: 'rt_1', name: 'Rahul Sharma', avatar: '👨‍💼', amount: 2500, adminPercent: 30, profit: 750, payout: 3250, time: '2s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_2', name: 'Vikram Patel', avatar: '🧑‍💻', amount: 5000, adminPercent: 30, profit: 1500, payout: 6500, time: '5s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_3', name: 'Pooja Verma', avatar: '👩‍💼', amount: 1000, adminPercent: 30, profit: 300, payout: 1300, time: '8s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_4', name: 'Aman Gupta', avatar: '🧔', amount: 3000, adminPercent: 30, profit: 900, payout: 3900, time: '12s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_5', name: 'Sneha Roy', avatar: '👩‍🦰', amount: 1500, adminPercent: 30, profit: 450, payout: 1950, time: '17s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_6', name: 'Karan Malhotra', avatar: '👨‍🦱', amount: 5000, adminPercent: 30, profit: 1500, payout: 6500, time: '21s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_7', name: 'Deepak Joshi', avatar: '👨', amount: 2000, adminPercent: 30, profit: 600, payout: 2600, time: '26s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_8', name: 'Ananya Deshmukh', avatar: '👩', amount: 1000, adminPercent: 30, profit: 300, payout: 1300, time: '30s ago', isUser: false, asset: 'BTC/USDT' },
    { id: 'rt_9', name: 'Rohan Mehra', avatar: '🧑', amount: 4000, adminPercent: 30, profit: 1200, payout: 5200, time: '34s ago', isUser: false, asset: 'BTC/USDT' },
  ]);

  // Periodic incoming stakes from other simulated users in this pool
  useEffect(() => {
    const SAMPLE_NAMES = [
      { name: 'Arjun Mehta', avatar: '👨‍🦱' },
      { name: 'Rohan Kapoor', avatar: '🧑‍💻' },
      { name: 'Priya Nair', avatar: '👩‍💼' },
      { name: 'Mohit Chawla', avatar: '🧔' },
      { name: 'Divya Singhania', avatar: '👩' },
      { name: 'Sanjay Aggarwal', avatar: '👨‍💼' },
      { name: 'Neha Bansal', avatar: '👩‍🦰' },
      { name: 'Rajesh Rao', avatar: '👨' },
      { name: 'Kavita Iyer', avatar: '👩‍🦱' },
      { name: 'Aditya Sen', avatar: '🧑' },
    ];
    const AMOUNTS = [500, 1000, 1500, 2000, 2500, 3000, 5000, 7500, 10000];

    const timer = setInterval(() => {
      const randomUser = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      const randomAmount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
      const simProfit = Math.round((randomAmount * currentAssetRate) / 100);
      const simPayout = randomAmount + simProfit;

      const newBet = {
        id: `t_${Date.now()}_${Math.random()}`,
        name: randomUser.name,
        avatar: randomUser.avatar,
        amount: randomAmount,
        adminPercent: currentAssetRate,
        profit: simProfit,
        payout: simPayout,
        time: 'Just now',
        isUser: false,
        asset: selectedAsset,
      };

      setRoomTraders((prev) => [newBet, ...prev.slice(0, 19)]);
      setLiveTradersCount((prev) => prev + (Math.random() > 0.48 ? 1 : -1));
    }, 3500);

    return () => clearInterval(timer);
  }, [selectedAsset, currentAssetRate]);

  // Calculate Live Staking Pool Totals
  const filteredRoomTraders = roomTraders.filter((t) => !t.asset || t.asset === selectedAsset);
  const roomStakeTotal = filteredRoomTraders.reduce((sum, t) => sum + t.amount, 0);
  const basePoolStake = 1450000;
  const totalRoundPool = basePoolStake + roomStakeTotal;
  const totalMaturityPayout = Math.round(totalRoundPool * (1 + currentAssetRate / 100));

  // Initialize Price History
  useEffect(() => {
    const asset = ASSETS[selectedAsset] || DEFAULT_ASSETS[selectedAsset] || DEFAULT_ASSETS['BTC/USDT'];
    let price = asset.basePrice;
    const history = [];
    for (let i = 0; i < 40; i++) {
      const open = price;
      const change = (Math.random() - 0.49) * asset.step * 6;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * asset.step * 2.5;
      const low = Math.min(open, close) - Math.random() * asset.step * 2.5;
      price = close;
      history.push({ open, close, high, low, time: i });
    }
    setPriceHistory(history);
    setCurrentPrice(price);
  }, [selectedAsset, assetsMap]);

  // Real-Time Price Engine Ticking
  useEffect(() => {
    const asset = ASSETS[selectedAsset] || DEFAULT_ASSETS[selectedAsset] || DEFAULT_ASSETS['BTC/USDT'];
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.485) * asset.step * 3.5;
      setCurrentPrice((prev) => {
        const nextPrice = Number((prev + delta).toFixed(2));
        setPriceHistory((hist) => {
          if (hist.length === 0) return hist;
          const updated = [...hist];
          const last = { ...updated[updated.length - 1] };
          last.close = nextPrice;
          last.high = Math.max(last.high, nextPrice);
          last.low = Math.min(last.low, nextPrice);
          updated[updated.length - 1] = last;

          if (Math.random() > 0.65 && updated.length < 50) {
            updated.push({
              open: nextPrice,
              close: nextPrice,
              high: nextPrice,
              low: nextPrice,
              time: updated.length,
            });
            if (updated.length > 45) updated.shift();
          }
          return updated;
        });
        return nextPrice;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Active Staking Growth Countdown Timer
  useEffect(() => {
    if (!activeTrade) return;

    const timer = setInterval(() => {
      setActiveTrade((prev) => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          clearInterval(timer);

          // Payout is the exact admin percentage return
          const payout = prev.payout;
          const profit = prev.profit;

          setRealBalance((b) => b + payout);

          if (prev.roundId) {
            userApi.settleStake(prev.roundId).catch((e) => console.warn('Stake settle fallback:', e.message));
          }

          const resultObj = {
            id: prev.roundId || `stake_${Date.now()}`,
            isWin: true,
            profit,
            payout,
            amount: prev.amount,
            adminPercent: prev.adminPercent,
            asset: prev.asset,
            time: 'Just now',
          };

          setTradeResult(resultObj);
          setTradeHistory((hist) => [resultObj, ...hist]);

          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTrade, setRealBalance]);

  // Canvas Drawing Engine: Accelerated Staking Yield Trajectory
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = chartHeight);

    // Dark cyber backdrop
    ctx.fillStyle = '#060714';
    ctx.fillRect(0, 0, width, height);

    // Glowing grid lines
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 35; y < height; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 60; x < width; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const baselineY = height - 55;
    const targetY = 55;

    // Baseline (Initial Stake)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.beginPath();
    ctx.moveTo(20, baselineY);
    ctx.lineTo(width - 20, baselineY);
    ctx.stroke();

    // Target Line (Admin Return Rate)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.beginPath();
    ctx.moveTo(20, targetY);
    ctx.lineTo(width - 20, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Baseline Badge
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(20, baselineY - 14, 155, 22);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`Base Stake: ₹${betAmount.toLocaleString('en-IN')}`, 26, baselineY + 1);

    // Target Badge
    const calcProfit = Math.round((betAmount * currentAssetRate) / 100);
    const calcPayout = betAmount + calcProfit;
    const badgeW = 205;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
    ctx.fillRect(width - badgeW - 20, targetY - 16, badgeW, 24);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(width - badgeW - 20, targetY - 16, badgeW, 24);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11.5px monospace';
    ctx.fillText(`Target Return (+${currentAssetRate}%): ₹${calcPayout.toLocaleString('en-IN')}`, width - badgeW - 12, targetY);

    // Yield Curve
    const curveStartX = 30;
    const curveEndX = width - 40;
    const totalCurveWidth = curveEndX - curveStartX;

    // Draw base yield curve trajectory
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = curveStartX + t * totalCurveWidth;
      const sigmoid = 1 / (1 + Math.exp(-6 * (t - 0.45)));
      const normSigmoid = (sigmoid - 0.067) / (0.964 - 0.067);
      const y = baselineY - normSigmoid * (baselineY - targetY);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // If active contract, draw filled progress portion & glowing orb
    if (activeTrade) {
      const progress = Math.max(0, Math.min(1, (activeTrade.timeTotal - activeTrade.timeLeft) / activeTrade.timeTotal));
      const currentX = curveStartX + progress * totalCurveWidth;

      // Area gradient
      ctx.beginPath();
      ctx.moveTo(curveStartX, baselineY);
      const steps = Math.max(1, Math.round(progress * 60));
      for (let i = 0; i <= steps; i++) {
        const t = (i / 60) * (steps / 60 <= 0 ? 0 : 1);
        const curT = (i / steps) * progress;
        const x = curveStartX + curT * totalCurveWidth;
        const sigmoid = 1 / (1 + Math.exp(-6 * (curT - 0.45)));
        const normSigmoid = (sigmoid - 0.067) / (0.964 - 0.067);
        const y = baselineY - normSigmoid * (baselineY - targetY);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(currentX, baselineY);
      ctx.closePath();

      const fillGrad = ctx.createLinearGradient(0, targetY, 0, baselineY);
      fillGrad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      fillGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
      fillGrad.addColorStop(1, 'rgba(245, 158, 11, 0.02)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Active glowing curve
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const curT = (i / steps) * progress;
        const x = curveStartX + curT * totalCurveWidth;
        const sigmoid = 1 / (1 + Math.exp(-6 * (curT - 0.45)));
        const normSigmoid = (sigmoid - 0.067) / (0.964 - 0.067);
        const y = baselineY - normSigmoid * (baselineY - targetY);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Current Point Calculation
      const curSigmoid = 1 / (1 + Math.exp(-6 * (progress - 0.45)));
      const curNormSigmoid = (curSigmoid - 0.067) / (0.964 - 0.067);
      const currentY = baselineY - curNormSigmoid * (baselineY - targetY);

      // Glowing Orb
      ctx.beginPath();
      ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Current Value Tooltip
      const currentVal = Math.round(activeTrade.amount + activeTrade.profit * progress);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(Math.max(10, currentX - 55), Math.max(10, currentY - 34), 110, 22);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`₹${currentVal.toLocaleString('en-IN')}`, Math.max(65, currentX), Math.max(26, currentY - 19));
      ctx.textAlign = 'left';
    } else {
      // Idle indicator dot
      const pulseX = curveStartX + 0.65 * totalCurveWidth;
      const pulseSig = 1 / (1 + Math.exp(-6 * (0.65 - 0.45)));
      const pulseNorm = (pulseSig - 0.067) / (0.964 - 0.067);
      const pulseY = baselineY - pulseNorm * (baselineY - targetY);

      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [chartHeight, betAmount, currentAssetRate, activeTrade, windowWidth]);

  const handleStakeGrowth = async () => {
    if (realBalance < betAmount) {
      showUserWarning('Insufficient Balance', 'Please top up your wallet using Deposit to continue staking.');
      return;
    }
    if (activeTrade) {
      showUserWarning('Active Plan in Progress', 'A growth plan is already active! Please wait for it to mature.');
      return;
    }

    const profit = Math.round((betAmount * currentAssetRate) / 100);
    const payout = betAmount + profit;

    setRealBalance((b) => b - betAmount);
    setTradeResult(null);

    let serverRoundId = null;
    try {
      const res = await userApi.placeStake(betAmount, selectedAsset);
      if (res && res.round) {
        serverRoundId = res.round.id || res.round._id;
      }
    } catch (err) {
      console.warn('Live API stake call fallback (offline mode):', err.message);
    }

    setActiveTrade({
      roundId: serverRoundId,
      asset: selectedAsset,
      amount: betAmount,
      adminPercent: currentAssetRate,
      profit,
      payout,
      timeTotal: selectedTimeframe.seconds,
      timeLeft: selectedTimeframe.seconds,
    });

    // Add user's real stake into the live room participants feed
    const userStakeEntry = {
      id: serverRoundId || `user_stake_${Date.now()}`,
      name: `${user?.name || 'Sachin'} (You)`,
      avatar: '⭐',
      amount: betAmount,
      adminPercent: currentAssetRate,
      profit,
      payout,
      time: 'Just now',
      isUser: true,
      asset: selectedAsset,
    };
    setRoomTraders((prev) => [userStakeEntry, ...prev.slice(0, 19)]);
    setLiveTradersCount((c) => c + 1);
  };

  // Dedicated Stock Purchase & QR Payment Modal State
  const [purchaseModalAsset, setPurchaseModalAsset] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(5000);
  const [purchaseMode, setPurchaseMode] = useState('qr'); // 'qr' or 'wallet'
  const [purchaseUtr, setPurchaseUtr] = useState('');
  const [purchaseCopied, setPurchaseCopied] = useState(false);
  const [isSubmittingPurchase, setIsSubmittingPurchase] = useState(false);

  const handleOpenPurchaseModal = (targetAsset = null, preferredMode = 'qr') => {
    const assetToBuy = targetAsset || currentAsset || DEFAULT_ASSETS[selectedAsset];
    setPurchaseModalAsset(assetToBuy);
    setPurchaseAmount(betAmount || 5000);
    setPurchaseMode(preferredMode);
    setPurchaseUtr('');
  };

  const handleConfirmPurchase = async (e) => {
    e?.preventDefault();
    if (!purchaseModalAsset) return;

    if (activeTrade) {
      showUserWarning('Active Plan in Progress', 'A growth plan is already active! Please wait for it to mature.');
      return;
    }

    const buyAmt = Number(purchaseAmount);
    if (!buyAmt || buyAmt < 100) {
      showUserWarning('Invalid Amount', 'Minimum investment amount is ₹100.');
      return;
    }

    const assetRate = purchaseModalAsset.returnPercent ?? currentAssetRate;
    const profit = Math.round((buyAmt * assetRate) / 100);
    const payout = buyAmt + profit;
    const cleanSym = (purchaseModalAsset.symbol || purchaseModalAsset.id || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetUpi = purchaseModalAsset.upiId || `${cleanSym}.paynex@icici`;

    if (purchaseMode === 'wallet') {
      if (realBalance < buyAmt) {
        showUserWarning(
          'Insufficient Wallet Balance',
          `Your wallet has ₹${realBalance.toLocaleString('en-IN')}. Please switch to "Pay via ${purchaseModalAsset.name} QR" or top up your wallet.`
        );
        return;
      }
      setRealBalance((b) => b - buyAmt);
    } else {
      // QR Payment mode
      const finalUtr = purchaseUtr.trim() || `UTR${Date.now().toString().slice(-9)}`;
      setIsSubmittingPurchase(true);
      try {
        await userApi.submitDeposit(buyAmt, 'Stock QR', finalUtr, '', {
          companyId: purchaseModalAsset.id || purchaseModalAsset.symbol,
          companyName: purchaseModalAsset.name,
          companyUpi: targetUpi,
        });
      } catch (err) {
        console.warn('Purchase deposit sync fallback:', err.message);
      } finally {
        setIsSubmittingPurchase(false);
      }
    }

    // Set active growth plan on this asset
    setSelectedAsset(purchaseModalAsset.symbol || purchaseModalAsset.id);
    let serverRoundId = null;
    try {
      const res = await userApi.placeStake(buyAmt, purchaseModalAsset.symbol || purchaseModalAsset.id);
      if (res && res.round) {
        serverRoundId = res.round.id || res.round._id;
      }
    } catch (err) {
      console.warn('Live API stake call fallback:', err.message);
    }

    setActiveTrade({
      roundId: serverRoundId,
      asset: purchaseModalAsset.symbol || purchaseModalAsset.id,
      amount: buyAmt,
      adminPercent: assetRate,
      profit,
      payout,
      timeTotal: selectedTimeframe.seconds,
      timeLeft: selectedTimeframe.seconds,
    });

    const userStakeEntry = {
      id: serverRoundId || `user_stake_${Date.now()}`,
      name: `${user?.name || 'Sachin'} (You)`,
      avatar: '⭐',
      amount: buyAmt,
      adminPercent: assetRate,
      profit,
      payout,
      time: 'Just now',
      isUser: true,
      asset: purchaseModalAsset.symbol || purchaseModalAsset.id,
    };
    setRoomTraders((prev) => [userStakeEntry, ...prev.slice(0, 19)]);
    setLiveTradersCount((c) => c + 1);

    const purchasedAssetName = purchaseModalAsset.name;
    setPurchaseModalAsset(null);

    showUserSuccess(
      '🎉 Stock Purchase & Stake Activated!',
      `Successfully purchased <strong>${purchasedAssetName}</strong> (${purchaseMode === 'qr' ? 'via Company QR' : 'from Wallet'}). Growth plan active with <strong>+${assetRate}% Guaranteed Profit</strong>!`
    );
  };


  const assetInfo = ASSETS[selectedAsset] || DEFAULT_ASSETS[selectedAsset] || DEFAULT_ASSETS['BTC/USDT'];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07070a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* 1. TOP HEADER (MATCHING APK SCREEN 5) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 60,
          background: 'rgba(10, 11, 16, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '10px clamp(10px, 2.5vw, 18px)',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div className="portal-header-row">
          {/* User Profile Header (Left) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 'clamp(36px, 9vw, 42px)',
                height: 'clamp(36px, 9vw, 42px)',
                borderRadius: '50%',
                border: '2px solid #fbbf24',
                boxShadow: '0 0 14px rgba(251, 191, 36, 0.4)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src="/sachin_avatar.jpg"
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: 'clamp(14px, 3.8vw, 16px)', fontWeight: 800, color: '#fff' }}>
                  Hello, {user?.name && user.name.toLowerCase() !== 'admin' ? user.name : 'Skraj0451'}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    background: '#fbbf24',
                    color: '#000',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                >
                  VIP 1
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Welcome back!</p>
            </div>
          </div>

          {/* Clean Real Wallet Balance Badge */}
          <div
            className="portal-balance-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1.2px solid rgba(16, 185, 129, 0.45)',
              borderRadius: '14px',
              padding: '7px 16px',
              gap: '8px',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Balance:</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
              ₹{realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Header Actions (Right) */}
          <div className="portal-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenDeposit}
              className="btn-cyber-primary"
              style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
            >
              + Deposit
            </button>
            <button
              onClick={onOpenWithdraw}
              className="btn-cyber-outline"
              style={{ padding: '7px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Withdraw
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                borderRadius: '10px',
                padding: '7px 10px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <main
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(10px, 2.5vw, 18px)',
          paddingBottom: '100px',
          boxSizing: 'border-box',
        }}
      >
        {/* ======================================================== */}
        {/* TAB 1: 3D TRADING GAME ARENA (DEFAULT & CORE GAME)       */}
        {/* ======================================================== */}
        {currentTab === 'game' && (
          <div>
            {/* Asset Selector Ribbon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '10px',
                marginBottom: '14px',
              }}
            >
              {Object.entries(ASSETS).map(([symbol, item]) => {
                const isSel = selectedAsset === symbol;
                return (
                  <button
                    key={symbol}
                    onClick={() => setSelectedAsset(symbol)}
                    style={{
                      background: isSel
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(37, 99, 235, 0.18))'
                        : 'rgba(20, 21, 27, 0.9)',
                      border: isSel ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: isSel ? '0 0 16px rgba(245, 158, 11, 0.35)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '14px',
                        color: '#fff',
                      }}
                    >
                      {item.icon}
                    </span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{item.name || symbol}</div>
                      <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>
                        Fixed +{item.returnPercent ?? currentAssetRate}% Return
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Multiplayer Pool & Admin Yield HUD */}
            <div
              className="cyber-card"
              style={{
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '16px',
                background: 'linear-gradient(150deg, rgba(16, 18, 30, 0.98), rgba(9, 11, 18, 0.98))',
                border: '1.2px solid rgba(245, 158, 11, 0.35)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.65)',
              }}
            >
              {/* HUD Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 10px #10b981',
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                    LIVE STAKING POOL • {selectedAsset}
                  </span>
                  <span
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    👥 {liveTradersCount.toLocaleString('en-IN')} Active Investors
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total Staked:</span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
                    ₹{totalRoundPool.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Pool Growth & Payout Banner */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  padding: '9px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '76%',
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.14), rgba(16, 185, 129, 0.22))',
                    borderRadius: '11px',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      color: '#fbbf24',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    ⚡ Fixed Return
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#34d399' }}>
                    +{currentAssetRate}% Guaranteed
                  </span>
                </div>

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600 }}>
                    Total Pool Payout:
                  </span>
                  <span
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 900,
                      color: '#34d399',
                      fontFamily: 'monospace',
                    }}
                  >
                    ₹{totalMaturityPayout.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Trading Desk: Chart Card + Bet Control Card */}
            <div className="trading-grid-wrap">
              {/* Chart Card */}
              <div
                className="cyber-card"
                style={{
                  borderRadius: '20px',
                  padding: '18px',
                  background: 'linear-gradient(150deg, rgba(14, 15, 24, 0.96), rgba(8, 9, 14, 0.98))',
                  border: '1.2px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                {/* Chart Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{selectedAsset}</span>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
                      ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.16)',
                        color: '#10b981',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      ⚡ LIVE GROWTH
                    </span>
                    <button
                      onClick={() => handleOpenPurchaseModal(assetInfo, 'qr')}
                      style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.25))',
                        border: '1.2px solid #10b981',
                        color: '#34d399',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
                      }}
                      title={`Open dedicated QR code to pay & invest in ${assetInfo.name || selectedAsset}`}
                    >
                      <span>📱</span>
                      <span>{assetInfo.name ? assetInfo.name.split(' ')[0] : 'Stock'} QR Pay</span>
                    </button>
                  </div>


                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        color: '#fbbf24',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      🔥 +{currentAssetRate}% Guaranteed
                    </span>
                  </div>
                </div>

                {/* Canvas Area */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: `${chartHeight}px`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                  {/* Active Staking Live HUD */}
                  {activeTrade && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        maxWidth: 'calc(100% - 20px)',
                        background: 'rgba(5, 7, 20, 0.94)',
                        border: '1.5px solid #10b981',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#10b981',
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        ⚡
                      </div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          Staked: ₹{activeTrade.amount.toLocaleString('en-IN')} • Return Rate: +{activeTrade.adminPercent}%
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 800 }}>
                          Maturity Return: <span style={{ color: '#34d399' }}>₹{activeTrade.payout.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 900,
                          color: '#fbbf24',
                          fontFamily: 'monospace',
                          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingLeft: '8px',
                          flexShrink: 0,
                        }}
                      >
                        {activeTrade.timeLeft}s
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bet Controls Card */}
              <div
                className="cyber-card"
                style={{
                  borderRadius: '20px',
                  padding: '14px 16px',
                  background: 'linear-gradient(150deg, rgba(14, 15, 25, 0.96), rgba(8, 9, 15, 0.98))',
                  border: '1.2px solid rgba(245, 158, 11, 0.35)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚡ Fixed Growth Staking
                  </h3>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    +{currentAssetRate}% Guaranteed
                  </span>
                </div>

                {/* Staking Duration */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    STAKING DURATION
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf.label}
                        onClick={() => setSelectedTimeframe(tf)}
                        style={{
                          background: selectedTimeframe.label === tf.label ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${selectedTimeframe.label === tf.label ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                          color: selectedTimeframe.label === tf.label ? '#fbbf24' : '#cbd5e1',
                          padding: '6px 2px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stake Amount */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>STAKE (₹)</label>
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>
                      Available: ₹{realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 800,
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />

                  {/* Preset Chips */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {BET_PRESETS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBetAmount(amt)}
                        style={{
                          background: betAmount === amt ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${betAmount === amt ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '6px',
                          color: betAmount === amt ? '#fbbf24' : '#cbd5e1',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '3px 7px',
                          cursor: 'pointer',
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return Breakdown Box */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(245, 158, 11, 0.08))',
                    border: '1.2px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Amount Staked:</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>₹{betAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Growth Rate:</span>
                    <span style={{ color: '#fbbf24', fontWeight: 800 }}>+{currentAssetRate}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                    <span>Estimated Net Profit:</span>
                    <span style={{ color: '#10b981', fontWeight: 800 }}>
                      +₹{Math.round((betAmount * currentAssetRate) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      fontWeight: 900,
                      color: '#fff',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '6px',
                    }}
                  >
                    <span>Total Maturity Return:</span>
                    <span style={{ color: '#34d399', fontSize: '16px', fontFamily: 'monospace' }}>
                      ₹{Math.round(betAmount + (betAmount * currentAssetRate) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Single Powerful CTA Button */}
                <button
                  disabled={!!activeTrade}
                  onClick={() => {
                    if (realBalance >= betAmount) {
                      handleStakeGrowth();
                    } else {
                      handleOpenPurchaseModal(assetInfo, 'qr');
                    }
                  }}
                  style={{
                    width: '100%',
                    background: activeTrade
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'linear-gradient(135deg, #f59e0b, #10b981)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    color: activeTrade ? '#94a3b8' : '#000',
                    cursor: activeTrade ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: activeTrade ? 'none' : '0 8px 25px rgba(245, 158, 11, 0.45)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontSize: '14.5px', fontWeight: 900 }}>
                    {activeTrade
                      ? `⏳ Plan Active • Maturity in ${activeTrade.timeLeft}s`
                      : `⚡ Stake ₹${betAmount.toLocaleString('en-IN')} & Earn ₹${Math.round(betAmount + (betAmount * currentAssetRate) / 100).toLocaleString('en-IN')}`}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.9, marginTop: '2px' }}>
                    {activeTrade
                      ? `Accruing +${activeTrade.adminPercent || currentAssetRate}% Profit...`
                      : `Guaranteed +${currentAssetRate}% Return on Maturity`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenPurchaseModal(assetInfo, 'qr')}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.2))',
                    border: '1.2px solid #fbbf24',
                    color: '#fbbf24',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  title={`Scan company QR and pay directly for ${assetInfo.name}`}
                >
                  <span>📱</span>
                  <span>Pay via {assetInfo.name || selectedAsset} QR Code</span>
                </button>
              </div>
            </div>

            {/* Live Participants / Stakes Feed & User's History */}
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: windowWidth < 992 ? '1fr' : '1fr 1fr', gap: '16px', alignItems: 'start' }}>
              {/* Card 1: Live Room Stakes (Who Bet How Much) */}
              <div
                className="cyber-card"
                style={{
                  borderRadius: '18px',
                  padding: '16px',
                  background: 'linear-gradient(150deg, rgba(14, 15, 25, 0.96), rgba(8, 9, 15, 0.98))',
                  border: '1.2px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      👥 Live Room Stakes
                    </h4>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Who staked how much & Live returns
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.16)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    ● Real-Time
                  </span>
                </div>

                {/* Traders List */}
                <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }} className="custom-scroll">
                  {filteredRoomTraders.map((trader) => (
                    <div
                      key={trader.id}
                      style={{
                        background: trader.isUser
                          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(37, 99, 235, 0.18))'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: trader.isUser
                          ? '1.5px solid #fbbf24'
                          : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: trader.isUser ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{trader.avatar}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: trader.isUser ? '#fbbf24' : '#fff' }}>
                              {trader.name}
                            </span>
                            {trader.isUser && (
                              <span style={{ fontSize: '9px', fontWeight: 900, background: '#fbbf24', color: '#000', padding: '1px 5px', borderRadius: '4px' }}>
                                YOU
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                            {trader.time} • Staked in {selectedAsset}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Staked:</span>
                          <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                            ₹{trader.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                          +{trader.adminPercent || adminProfitPercent}% = ₹{(trader.payout || Math.round(trader.amount * (1 + adminProfitPercent / 100))).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Your Recent Staking History */}
              <div
                className="cyber-card"
                style={{
                  borderRadius: '18px',
                  padding: '16px',
                  background: 'linear-gradient(150deg, rgba(14, 15, 25, 0.96), rgba(8, 9, 15, 0.98))',
                  border: '1.2px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0 }}>
                      📜 Your Staking History
                    </h4>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Settled Fixed Growth Plans
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: 'rgba(245, 158, 11, 0.16)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    100% Credited
                  </span>
                </div>

                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxHeight: '340px' }} className="custom-scroll">
                  <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '8px 6px' }}>Asset</th>
                        <th style={{ padding: '8px 6px' }}>Staked</th>
                        <th style={{ padding: '8px 6px' }}>Return %</th>
                        <th style={{ padding: '8px 6px' }}>Profit Earned</th>
                        <th style={{ padding: '8px 6px' }}>Total Payout</th>
                        <th style={{ padding: '8px 6px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ padding: '24px 8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                            No stakings placed yet. Start a growth plan above to see your history!
                          </td>
                        </tr>
                      ) : (
                        tradeHistory.map((item, idx) => (

                        <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '8px 6px', fontWeight: 700 }}>{item.asset}</td>
                          <td style={{ padding: '8px 6px', fontWeight: 600 }}>₹{item.amount.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 6px', color: '#fbbf24', fontWeight: 800 }}>+{item.adminPercent || adminProfitPercent}%</td>
                          <td style={{ padding: '8px 6px', fontWeight: 800, color: '#34d399' }}>
                            +₹{item.profit.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '8px 6px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                            ₹{item.payout.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '8px 6px' }}>
                            <span
                              style={{
                                background: '#10b981',
                                color: '#000',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '9.5px',
                                fontWeight: 900,
                              }}
                            >
                              CREDITED
                            </span>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DASHBOARD (MATCHING SCREEN 5 OF THE APK)           */}
        {/* ======================================================== */}
        {currentTab === 'home' && (
          <div>
            {/* Balance Card matching Screen 5 */}
            <div
              style={{
                position: 'relative',
                borderRadius: '22px',
                padding: '22px',
                background: 'linear-gradient(150deg, #161726, #10111a)',
                border: '1.2px solid rgba(245, 158, 11, 0.4)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
                overflow: 'hidden',
                marginBottom: '20px',
              }}
            >
              {/* Radial Glow in Top Right */}
              <div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Total Balance</span>
                <span
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
                >
                  {balanceVisible ? '👁️' : '🔒'}
                </span>
              </div>

              <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                {balanceVisible ? `₹ ${realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ ••••••••'}
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.16)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '3px 10px', borderRadius: '16px', marginBottom: '22px' }}>
                <span style={{ color: '#10b981', fontSize: '12px' }}>▲ +12.45% (24h)</span>
              </div>

              {/* 3 Buttons in a Row: Deposit (Gold), Withdraw (Dark Outline), Trade (Gold) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(6px, 2vw, 12px)' }}>
                <button
                  onClick={onOpenDeposit}
                  className="btn-cyber-primary"
                  style={{ padding: 'clamp(8px, 2vw, 12px) 2px', fontSize: 'clamp(12px, 3.2vw, 14px)', fontWeight: 800, borderRadius: '12px' }}
                >
                  Deposit
                </button>
                <button
                  onClick={onOpenWithdraw}
                  style={{
                    background: '#1a1b28',
                    border: '1.2px solid #fbbf24',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: 'clamp(12px, 3.2vw, 14px)',
                    fontWeight: 700,
                    padding: 'clamp(8px, 2vw, 12px) 2px',
                    cursor: 'pointer',
                  }}
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setCurrentTab('game')}
                  className="btn-cyber-primary"
                  style={{ padding: 'clamp(8px, 2vw, 12px) 2px', fontSize: 'clamp(12px, 3.2vw, 14px)', fontWeight: 800, borderRadius: '12px' }}
                >
                  Trade
                </button>
              </div>
            </div>

            {/* Quick Actions (Invest, Referral, Support, More) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px, 1.8vw, 10px)', marginBottom: '24px' }}>
              {[
                { title: 'Invest', icon: '📈', action: () => setCurrentTab('plans') },
                { title: 'Referral', icon: '🎁', action: () => setCurrentTab('profile') },
                { title: 'Support', icon: '🎧', action: () => alert('Support ticket system: 24/7 Live Desk active!') },
                { title: 'Trade Game', icon: '⚡', action: () => setCurrentTab('game') },
              ].map((item) => (
                <div
                  key={item.title}
                  onClick={item.action}
                  style={{
                    background: '#14151f',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '16px',
                    padding: 'clamp(10px, 2.5vw, 16px) 4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{ fontSize: 'clamp(10.5px, 2.5vw, 12px)', fontWeight: 600, color: '#cbd5e1', whiteSpace: 'nowrap' }}>{item.title}</div>
                </div>
              ))}
            </div>

            {/* Market Overview Section matching Screen 5 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Market Overview</span>
                <span
                  onClick={() => setCurrentTab('market')}
                  style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', cursor: 'pointer' }}
                >
                  View All →
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Bitcoin', symbol: 'BTC', price: '₹ 55,24,321', change: '+2.56%', color: '#f7931a', icon: '₿' },
                  { name: 'Ethereum', symbol: 'ETH', price: '₹ 2,48,762', change: '+1.83%', color: '#627eea', icon: 'Ξ' },
                  { name: 'Solana', symbol: 'SOL', price: '₹ 12,450', change: '+3.21%', color: '#9945ff', icon: '◎' },
                  { name: 'BNB', symbol: 'BNB', price: '₹ 37,820', change: '+1.12%', color: '#f3ba2f', icon: '🔶' },
                ].map((c) => (
                  <div
                    key={c.symbol}
                    onClick={() => {
                      setSelectedAsset(`${c.symbol}/USDT`);
                      setCurrentTab('game');
                    }}
                    style={{
                      background: '#14151f',
                      border: '1px solid rgba(245, 158, 11, 0.22)',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: c.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 900,
                          color: '#fff',
                        }}
                      >
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.symbol}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                        {c.price}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: 'rgba(16, 185, 129, 0.16)',
                          color: '#10b981',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {c.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MARKETS (MATCHING SCREEN 6 OF THE APK)            */}
        {/* ======================================================== */}
        {currentTab === 'market' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
                Stocks & Crypto Markets Live
              </h3>
              <input
                type="text"
                placeholder="Search stocks, crypto or commodity (e.g. Tata Motors, Reliance, Apple, BTC)..."
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: '#14151f',
                  border: '1.2px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['All', 'Stock', 'Crypto', 'Commodity'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setMarketFilter(flt)}
                  style={{
                    background: marketFilter === flt ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    color: marketFilter === flt ? '#000' : '#fff',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {flt === 'Stock' ? '📈 Indian Stocks' : flt === 'Crypto' ? '🪙 Crypto' : flt === 'Commodity' ? '🏆 Commodity' : '🌐 All Assets'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(ASSETS)
                .filter(([sym, data]) => {
                  if (marketFilter !== 'All') {
                    const cat = data.category || (sym.includes('/') ? 'Crypto' : 'Stock');
                    if (cat.toLowerCase() !== marketFilter.toLowerCase()) return false;
                  }
                  if (marketSearch) {
                    const q = marketSearch.toLowerCase();
                    return (
                      sym.toLowerCase().includes(q) ||
                      (data.name && data.name.toLowerCase().includes(q)) ||
                      (data.category && data.category.toLowerCase().includes(q))
                    );
                  }
                  return true;
                })
                .map(([sym, coin]) => (
                  <div
                    key={sym}
                    onClick={() => {
                      setSelectedAsset(sym);
                      setCurrentTab('game');
                    }}
                    style={{
                      background: '#14151f',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: coin.color || '#38bdf8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 900,
                          color: '#fff',
                        }}
                      >
                        {coin.icon || '📈'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800 }}>{coin.name}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: '#94a3b8',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {coin.category || 'Stock'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{coin.symbol || sym}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'monospace' }}>
                        ₹{Number(coin.basePrice || 1000).toLocaleString('en-IN')}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          background: 'rgba(16, 185, 129, 0.16)',
                          color: '#10b981',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        +{coin.returnPercent ?? currentAssetRate}% Guaranteed
                      </span>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPurchaseModal(coin, 'qr');
                          }}
                          style={{
                            padding: '4px 8px',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.2))',
                            border: '1px solid #10b981',
                            color: '#34d399',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                          title={`Scan & Pay via ${coin.name} QR Code`}
                        >
                          <span>📱</span>
                          <span>Pay QR</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPurchaseModal(coin, 'wallet');
                          }}
                          style={{
                            padding: '4px 8px',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            background: 'rgba(251, 191, 36, 0.2)',
                            border: '1px solid #fbbf24',
                            color: '#fbbf24',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                          title={`Buy & Stake ${coin.name}`}
                        >
                          <span>⚡</span>
                          <span>Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: WALLET & TRANSACTIONS (MATCHING SCREEN 10)        */}
        {/* ======================================================== */}
        {currentTab === 'wallet' && (
          <div>
            <div
              style={{
                borderRadius: '22px',
                padding: '24px',
                background: 'linear-gradient(150deg, #161726, #10111a)',
                border: '1.2px solid rgba(245, 158, 11, 0.4)',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Total Wallet Balance</div>
              <div style={{ fontSize: 'clamp(28px, 7vw, 36px)', fontWeight: 900, color: '#fff', marginBottom: '18px' }}>
                ₹ {realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(8px, 2vw, 12px)' }}>
                <button onClick={onOpenDeposit} className="btn-cyber-primary" style={{ padding: 'clamp(10px, 2.5vw, 12px) 4px', fontSize: 'clamp(12px, 3.2vw, 14px)', borderRadius: '12px' }}>
                  + Deposit Funds
                </button>
                <button
                  onClick={onOpenWithdraw}
                  style={{
                    background: '#1a1b28',
                    border: '1.2px solid #fbbf24',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: 'clamp(12px, 3.2vw, 14px)',
                    fontWeight: 700,
                    padding: 'clamp(10px, 2.5vw, 12px) 4px',
                    cursor: 'pointer',
                  }}
                >
                  Withdraw to Bank
                </button>
              </div>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>
              Transaction History {walletHistory.length > 0 && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>(Live Atlas Sync)</span>}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(walletHistory.length > 0
                ? walletHistory
                : [
                    { title: 'Deposit (UPI)', date: '12 Oct 2025 10:24 AM', amount: '+ ₹10,000', status: 'Completed', color: '#10b981' },
                    { title: 'Trading Profit (BTC/USDT)', date: '10 Oct 2025 03:45 PM', amount: '+ ₹950', status: 'Completed', color: '#10b981' },
                    { title: 'Referral Bonus', date: '08 Oct 2025 11:20 AM', amount: '+ ₹500', status: 'Completed', color: '#fbbf24' },
                    { title: 'Withdrawal to Bank', date: '05 Oct 2025 09:15 AM', amount: '- ₹2,000', status: 'Completed', color: '#ef4444' },
                  ]
              ).map((tx, i) => (
                <div
                  key={i}
                  style={{
                    background: '#14151f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{tx.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{tx.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: tx.color }}>{tx.amount}</div>
                    <span
                      style={{
                        fontSize: '10px',
                        color: tx.color,
                        background: `${tx.color}22`,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PROFILE & SETTINGS (MATCHING SCREEN 12)           */}
        {/* ======================================================== */}
        {currentTab === 'profile' && (
          <div>
            <div
              style={{
                borderRadius: '20px',
                padding: '20px',
                background: '#14151f',
                border: '1.2px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px solid #fbbf24',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img src="/sachin_avatar.jpg" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>
                    {user?.name && user.name.toLowerCase() !== 'admin' ? user.name : 'Skraj0451'}
                  </span>
                  <span style={{ fontSize: '10px', background: '#fbbf24', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                    VIP 1
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {user?.email && !user.email.toLowerCase().includes('admin') ? user.email : 'skraj0451@gmail.com'}
                </div>
              </div>
            </div>

            {/* Referral Card */}
            <div
              style={{
                borderRadius: '16px',
                padding: '18px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(37, 99, 235, 0.1))',
                border: '1px dashed #fbbf24',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
                🎁 Your Referral Code: PAYNEX12345
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 10px' }}>
                Earn ₹500 directly into your Real Wallet for every invited friend!
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('https://paynex.com/ref/PAYNEX12345');
                  alert('Referral link copied to clipboard!');
                }}
                className="btn-cyber-primary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Copy Referral Link
              </button>
            </div>

            {/* Menu List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'personal', title: 'Personal Information', icon: '👤', badge: null },
                { id: 'kyc', title: 'KYC Verification', icon: '🪪', badge: 'Under Review' },
                { id: 'security', title: 'Security & 2FA Settings', icon: '🔒', badge: 'Active' },
                { id: 'bank', title: 'Bank Account & UPI Details', icon: '🏦', badge: 'Verified' },
                { id: 'statement', title: 'Account Statement & Ledger', icon: '📜', badge: 'Records' },
                { id: 'support', title: 'Help & 24/7 Support', icon: '🎧', badge: '24x7 Live' },
              ].map((m) => (
                <div
                  key={m.title}
                  onClick={() => setActiveSettingModal(m.id)}
                  style={{
                    background: '#14151f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{m.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{m.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {m.badge && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: m.id === 'kyc' ? '#fbbf24' : '#10b981',
                          background: m.id === 'kyc' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 800,
                        }}
                      >
                        {m.badge}
                      </span>
                    )}
                    <span style={{ color: '#64748b', fontSize: '16px' }}>›</span>
                  </div>
                </div>
              ))}

              <button
                onClick={onLogout}
                style={{
                  marginTop: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Log Out of Account
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SETTINGS SUBPAGES / MODALS                               */}
        {/* ======================================================== */}
        {activeSettingModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              background: 'rgba(3, 4, 15, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setActiveSettingModal(null)}
          >
            <div
              className="cyber-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '520px',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '20px',
                padding: '22px',
                background: 'linear-gradient(150deg, rgba(16, 18, 30, 0.98), rgba(9, 11, 20, 0.98))',
                border: '1.4px solid rgba(245, 158, 11, 0.35)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75)',
                position: 'relative',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>
                    {activeSettingModal === 'personal' && '👤'}
                    {activeSettingModal === 'kyc' && '🪪'}
                    {activeSettingModal === 'security' && '🔒'}
                    {activeSettingModal === 'bank' && '🏦'}
                    {activeSettingModal === 'statement' && '📜'}
                    {activeSettingModal === 'support' && '🎧'}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', margin: 0 }}>
                    {activeSettingModal === 'personal' && 'Personal Information'}
                    {activeSettingModal === 'kyc' && 'KYC Identity Verification'}
                    {activeSettingModal === 'security' && 'Security & 2FA Settings'}
                    {activeSettingModal === 'bank' && 'Bank Account & UPI Details'}
                    {activeSettingModal === 'statement' && 'Account Statement & Ledger'}
                    {activeSettingModal === 'support' && 'Help & 24/7 Priority Support'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSettingModal(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* 1. PERSONAL INFORMATION MODAL */}
              {activeSettingModal === 'personal' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '2px solid #fbbf24',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img src="/sachin_avatar.jpg" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{profileName}</div>
                      <span style={{ fontSize: '10px', background: '#fbbf24', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                        VIP 1 TRADER
                      </span>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Member Since: Jan 2026</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Display Name / Username
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            color: '#fff',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '11px', color: '#10b981', fontWeight: 800 }}>
                          Verified ✅
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            color: '#fff',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Date of Birth
                        </label>
                        <input
                          type="text"
                          value={profileDob}
                          onChange={(e) => setProfileDob(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            color: '#fff',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Country / Region</div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>India 🇮🇳 (INR ₹)</div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Account UID</div>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#fbbf24', marginTop: '2px', fontFamily: 'monospace' }}>PAYNEX-884920</div>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          await userApi.updateProfile({ name: profileName, phone: profilePhone });
                          showUserSuccess('Profile Saved', 'Your profile details have been synchronized with MongoDB Atlas.');
                        } catch (err) {
                          showUserError('Update Error', err.message);
                        }
                        setActiveSettingModal(null);
                      }}
                      className="btn-cyber-primary"
                      style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* 2. KYC VERIFICATION MODAL */}
              {activeSettingModal === 'kyc' && (
                <div>
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1.2px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>⏳</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>
                          KYC Verification: In Progress
                        </div>
                        <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
                          Your documents are under review by our compliance team. Expected completion: 2-4 hours.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Step Timeline */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', padding: '0 8px' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontWeight: 900, fontSize: '12px' }}>
                        ✓
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#fff', fontWeight: 700 }}>ID Submitted</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fbbf24', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontWeight: 900, fontSize: '12px' }}>
                        ⏳
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: 800 }}>Audit Review</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontWeight: 900, fontSize: '12px' }}>
                        3
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Full Verified</div>
                    </div>
                  </div>

                  {/* Document Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>🪪</span>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Aadhaar Card (Front & Back)</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Number: •••• •••• 6789</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        Uploaded ✅
                      </span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>📄</span>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>PAN Card</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Number: ABCDE1234F</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        Reviewing ⏳
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast('KYC update request submitted to compliance!');
                      setActiveSettingModal(null);
                    }}
                    className="btn-cyber-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    📤 Re-upload / Update ID Documents
                  </button>
                  <p style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center', margin: '10px 0 0' }}>
                    🔒 256-Bit SSL Encrypted. Documents are stored compliant with Government PMLA rules.
                  </p>
                </div>
              )}

              {/* 3. SECURITY & 2FA SETTINGS MODAL */}
              {activeSettingModal === 'security' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Two-Factor Auth (Google Authenticator)</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Prompts 6-digit OTP code on new logins</div>
                      </div>
                      <button
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          showToast(`2FA Authentication ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}`);
                        }}
                        style={{
                          background: twoFactorEnabled ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          color: twoFactorEnabled ? '#000' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {twoFactorEnabled ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>SMS OTP Verification</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Withdrawal authorization via SMS to +91 98765 43210</div>
                      </div>
                      <button
                        onClick={() => {
                          setSmsOtpEnabled(!smsOtpEnabled);
                          showToast(`SMS OTP ${!smsOtpEnabled ? 'Enabled' : 'Disabled'}`);
                        }}
                        style={{
                          background: smsOtpEnabled ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          color: smsOtpEnabled ? '#000' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {smsOtpEnabled ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Biometric & Fingerprint Lock</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Instant device unlock for quick trade access</div>
                      </div>
                      <button
                        onClick={() => {
                          setBiometricEnabled(!biometricEnabled);
                          showToast(`Biometric Lock ${!biometricEnabled ? 'Enabled' : 'Disabled'}`);
                        }}
                        style={{
                          background: biometricEnabled ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          color: biometricEnabled ? '#000' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {biometricEnabled ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {/* Change Password Form */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', marginBottom: '10px' }}>
                      🔑 Change Account Password
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={passForm.current}
                        onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                        style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                      <input
                        type="password"
                        placeholder="New Password (min 8 characters)"
                        value={passForm.newPass}
                        onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                        style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passForm.confirm}
                        onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                        style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={async () => {
                          if (!passForm.newPass || passForm.newPass !== passForm.confirm) {
                            showUserWarning('Password Mismatch', 'New passwords do not match or field is empty.');
                            return;
                          }
                          try {
                            await userApi.updateProfile({ password: passForm.newPass });
                            showUserSuccess('Password Changed', 'Your account password has been updated on MongoDB Atlas.');
                            setPassForm({ current: '', newPass: '', confirm: '' });
                          } catch (err) {
                            showUserError('Password Error', err.message);
                          }
                        }}
                        className="btn-cyber-outline"
                        style={{ padding: '9px', fontSize: '12px', fontWeight: 800, marginTop: '4px', cursor: 'pointer' }}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. BANK ACCOUNT & UPI DETAILS MODAL */}
              {activeSettingModal === 'bank' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {/* Saved Bank Card */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(16, 185, 129, 0.15))',
                        border: '1.2px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '14px',
                        padding: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>🏦 {bankAccount.bankName}</span>
                        <span style={{ fontSize: '10px', background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                          VERIFIED PRIMARY
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>A/C Holder: <strong style={{ color: '#fff' }}>{bankAccount.holderName}</strong></div>
                      <div style={{ fontSize: '13px', color: '#fff', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '1px', margin: '4px 0' }}>
                        •••• •••• •••• {bankAccount.accountNumber.slice(-4)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>IFSC Code: <strong style={{ color: '#38bdf8' }}>{bankAccount.ifsc}</strong></div>
                    </div>

                    {/* Saved UPI Card */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.15))',
                        border: '1.2px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Linked UPI ID</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace', marginTop: '2px' }}>
                          {bankAccount.upiId}
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                        INSTANT PAYOUTS ✅
                      </span>
                    </div>
                  </div>

                  {/* Edit / Add Bank Details */}
                  {!isEditingBank ? (
                    <button
                      onClick={() => setIsEditingBank(true)}
                      className="btn-cyber-outline"
                      style={{ width: '100%', padding: '11px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ✏️ Edit or Change Bank / UPI Details
                    </button>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#fbbf24', marginBottom: '8px' }}>
                        Update Bank / UPI Details
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Bank Name (e.g. HDFC, SBI, ICICI)"
                          value={bankForm.bankName}
                          onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                          style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                        <input
                          type="text"
                          placeholder="Account Holder Full Name"
                          value={bankForm.holderName}
                          onChange={(e) => setBankForm({ ...bankForm, holderName: e.target.value })}
                          style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                        <input
                          type="text"
                          placeholder="Bank Account Number"
                          value={bankForm.accountNumber}
                          onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                          style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                        <input
                          type="text"
                          placeholder="IFSC Code (e.g. HDFC0001234)"
                          value={bankForm.ifsc}
                          onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                          style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                        <input
                          type="text"
                          placeholder="UPI ID (e.g. name@upi)"
                          value={bankForm.upiId}
                          onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                          style={{ width: '100%', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <button
                            onClick={async () => {
                              try {
                                await userApi.updateProfile({ bankDetails: bankForm });
                                setBankAccount({ ...bankForm });
                                setIsEditingBank(false);
                                showUserSuccess('Bank Details Saved', 'Payout account details recorded on MongoDB Atlas.');
                              } catch (err) {
                                showUserError('Save Error', err.message);
                              }
                            }}
                            className="btn-cyber-primary"
                            style={{ flex: 1, padding: '9px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Save Bank Details
                          </button>
                          <button
                            onClick={() => setIsEditingBank(false)}
                            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', padding: '9px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. ACCOUNT STATEMENT & LEDGER MODAL */}
              {activeSettingModal === 'statement' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Recent Ledger Transactions</span>
                    <button
                      onClick={() => showToast('Statement PDF generated! Check downloads.')}
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        color: '#fbbf24',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      📥 Download PDF
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }} className="custom-scroll">
                    {[
                      { id: 'tx_st_1', type: 'Deposit', amount: '+₹10,000', time: 'Today, 02:15 PM', status: 'Success', mode: 'UPI' },
                      { id: 'tx_st_2', type: 'Staking Return (+30%)', amount: '+₹6,500', time: 'Today, 11:40 AM', status: 'Credited', mode: 'BTC/USDT' },
                      { id: 'tx_st_3', type: 'Withdrawal', amount: '-₹5,000', time: 'Yesterday, 06:10 PM', status: 'Completed', mode: 'IMPS' },
                      { id: 'tx_st_4', type: 'Staking Return (+30%)', amount: '+₹3,250', time: 'Yesterday, 02:30 PM', status: 'Credited', mode: 'ETH/USDT' },
                      { id: 'tx_st_5', type: 'Deposit', amount: '+₹15,000', time: '22 Oct, 10:15 AM', status: 'Success', mode: 'NetBanking' },
                    ].map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>{tx.type}</div>
                          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{tx.time} • {tx.mode}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', fontWeight: 900, color: tx.amount.startsWith('+') ? '#10b981' : '#f87171', fontFamily: 'monospace' }}>
                            {tx.amount}
                          </div>
                          <span style={{ fontSize: '9.5px', color: '#10b981', fontWeight: 700 }}>{tx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. HELP & 24/7 PRIORITY SUPPORT MODAL */}
              {activeSettingModal === 'support' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <button
                      onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                      style={{
                        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.15))',
                        border: '1px solid rgba(37, 211, 102, 0.4)',
                        borderRadius: '12px',
                        padding: '12px 10px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>💬</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#25d366' }}>WhatsApp Care</div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Direct chat with Agent</div>
                    </button>

                    <button
                      onClick={() => window.open('https://t.me/paynex_official', '_blank')}
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 158, 217, 0.2), rgba(0, 136, 204, 0.15))',
                        border: '1px solid rgba(34, 158, 217, 0.4)',
                        borderRadius: '12px',
                        padding: '12px 10px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>✈️</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>Telegram Official</div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1' }}>24x7 Community channel</div>
                    </button>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '16px' }}>📞</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Toll-Free Helpline:</span>
                      <strong style={{ color: '#fbbf24', fontSize: '13px', fontFamily: 'monospace' }}>1800 234 5678</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>✉️</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Official Email:</span>
                      <strong style={{ color: '#38bdf8', fontSize: '12px' }}>support@paynex.com</strong>
                    </div>
                  </div>

                  {/* FAQs List */}
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', marginBottom: '8px' }}>
                    ❓ Frequently Asked Questions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { q: 'How fast are withdrawals processed?', a: 'Withdrawals are processed instantly through IMPS/UPI rails within 2 to 15 minutes.' },
                      { q: 'How is the fixed 30% return credited?', a: 'Upon maturity of your active round duration (e.g. 30s or 60s), your stake plus 30% profit is directly added to your real balance.' },
                      { q: 'Is my account identity & bank data safe?', a: 'Yes, all sensitive credentials and banking info are encrypted with 256-bit bank-grade SSL.' },
                    ].map((faq, i) => (
                      <div
                        key={i}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, color: '#fff' }}>
                          <span>{faq.q}</span>
                          <span style={{ color: '#fbbf24' }}>{openFaq === i ? '▲' : '▼'}</span>
                        </div>
                        {openFaq === i && (
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 200,
              background: '#10b981',
              color: '#000',
              padding: '10px 20px',
              borderRadius: '24px',
              fontWeight: 800,
              fontSize: '13px',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span> {toastMessage}
          </div>
        )}

        {/* Profit Settlement Modal */}
        {tradeResult && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(3, 4, 15, 0.88)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              className="cyber-card"
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: '24px',
                padding: '26px',
                textAlign: 'center',
                background: 'linear-gradient(150deg, rgba(14, 20, 36, 0.98), rgba(7, 10, 20, 0.98))',
                border: '1.8px solid #10b981',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
                }}
              >
                💎
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
                🎉 PLAN MATURED SUCCESSFULLY!
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
                Your {tradeResult.asset} staking plan has matured with +{tradeResult.adminPercent}% return!
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px', padding: '14px', marginBottom: '18px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Invested Stake:</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>₹{tradeResult.amount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Return Rate:</span>
                  <span style={{ color: '#fbbf24', fontWeight: 800 }}>+{tradeResult.adminPercent}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Profit Earned:</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>+₹{tradeResult.profit.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 900, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
                  <span style={{ color: '#fff' }}>Credited to Wallet:</span>
                  <span style={{ color: '#34d399', fontSize: '18px', fontFamily: 'monospace' }}>
                    +₹{tradeResult.payout.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setTradeResult(null)}
                className="btn-cyber-primary"
                style={{ width: '100%', padding: '14px 0', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}
              >
                Claim & Continue Staking
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM NAVIGATION BAR (MATCHING APK 5-TAB BAR) */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          background: 'rgba(10, 11, 16, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '6px clamp(4px, 2vw, 12px)',
          paddingBottom: 'max(6px, env(safe-area-inset-bottom, 6px))',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {[
            { id: 'game', label: 'Trade Game', icon: '⚡' },
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'market', label: 'Market', icon: '📊' },
            { id: 'wallet', label: 'Wallet', icon: '💳' },
            { id: 'profile', label: 'Profile', icon: '👤' },
          ].map((tab) => {
            const isSel = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isSel ? '#fbbf24' : '#64748b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  cursor: 'pointer',
                  padding: '4px clamp(2px, 1.5vw, 8px)',
                  transition: 'color 0.2s',
                  flex: 1,
                  maxWidth: '90px',
                }}
              >
                <span style={{ fontSize: 'clamp(18px, 4.5vw, 22px)' }}>{tab.icon}</span>
                <span
                  style={{
                    fontSize: 'clamp(9.5px, 2.4vw, 11px)',
                    fontWeight: isSel ? 800 : 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 6. DEDICATED STOCK PURCHASE & QR PAYMENT MODAL           */}
      {/* ======================================================== */}
      {purchaseModalAsset && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(5, 7, 16, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setPurchaseModalAsset(null)}
        >
          <div
            className="cyber-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              maxHeight: '94vh',
              overflowY: 'auto',
              borderRadius: '20px',
              padding: '20px 22px',
              background: 'linear-gradient(150deg, #121422, #0b0c16)',
              border: '1.5px solid #fbbf24',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(251, 191, 36, 0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: purchaseModalAsset.color || '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 900,
                  }}
                >
                  {purchaseModalAsset.icon || '📈'}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Purchase {purchaseModalAsset.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Symbol: <strong style={{ color: '#fbbf24' }}>{purchaseModalAsset.symbol || purchaseModalAsset.id}</strong> • Rate: <strong style={{ color: '#10b981' }}>+{purchaseModalAsset.returnPercent ?? currentAssetRate}% Guaranteed</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPurchaseModalAsset(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94a3b8',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Investment Amount Input & Chips */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>INVESTMENT AMOUNT (₹)</label>
                <span style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 700 }}>
                  Wallet Balance: ₹{realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <input
                type="number"
                min="100"
                step="100"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid rgba(251, 191, 36, 0.5)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 900,
                  outline: 'none',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
                {[500, 1000, 2500, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPurchaseAmount(amt)}
                    style={{
                      background: purchaseAmount === amt ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${purchaseAmount === amt ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '6px',
                      color: purchaseAmount === amt ? '#000' : '#cbd5e1',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Profit & Maturity Breakdown Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(245, 158, 11, 0.12))',
                border: '1.2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8', marginBottom: '3px' }}>
                <span>Guaranteed Profit ({purchaseModalAsset.returnPercent ?? currentAssetRate}%):</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>
                  +₹{Math.round((Number(purchaseAmount || 0) * (purchaseModalAsset.returnPercent ?? currentAssetRate)) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 900, color: '#fff', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '5px', marginTop: '3px' }}>
                <span>Total Maturity Return:</span>
                <span style={{ color: '#34d399', fontFamily: 'monospace' }}>
                  ₹{Math.round(Number(purchaseAmount || 0) + (Number(purchaseAmount || 0) * (purchaseModalAsset.returnPercent ?? currentAssetRate)) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                CHOOSE PAYMENT METHOD FOR THIS STOCK:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPurchaseMode('qr')}
                  style={{
                    padding: '9px 6px',
                    borderRadius: '10px',
                    border: `1.5px solid ${purchaseMode === 'qr' ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                    background: purchaseMode === 'qr' ? 'rgba(251, 191, 36, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                    color: purchaseMode === 'qr' ? '#fbbf24' : '#94a3b8',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <span>📱</span>
                  <span>{purchaseModalAsset.name.split(' ')[0]} QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseMode('wallet')}
                  style={{
                    padding: '9px 6px',
                    borderRadius: '10px',
                    border: `1.5px solid ${purchaseMode === 'wallet' ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                    background: purchaseMode === 'wallet' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                    color: purchaseMode === 'wallet' ? '#10b981' : '#94a3b8',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <span>💰</span>
                  <span>Wallet Balance</span>
                </button>
              </div>
            </div>

            {/* PAYMENT MODE A: COMPANY QR CODE */}
            {purchaseMode === 'qr' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* QR Code Container */}
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '12px',
                    textAlign: 'center',
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.3)',
                    maxWidth: '180px',
                    margin: '0 auto',
                  }}
                >
                  <img
                    src={getCompanyQrUrl(purchaseModalAsset)}
                    alt={`${purchaseModalAsset.name} Payment QR`}
                    style={{ width: '150px', height: '150px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#000', marginTop: '6px' }}>
                    Scan with PhonePe / GPay / Paytm
                  </div>
                </div>

                {/* Company UPI Details Card */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{purchaseModalAsset.name} Official UPI ID</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace', marginTop: '2px' }}>
                        {purchaseModalAsset.upiId || `${(purchaseModalAsset.symbol || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '')}.paynex@icici`}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                        Payee: {purchaseModalAsset.payeeName || `${purchaseModalAsset.name} Trading Desk`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetUpi = purchaseModalAsset.upiId || `${(purchaseModalAsset.symbol || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '')}.paynex@icici`;
                        navigator.clipboard?.writeText(targetUpi);
                        setPurchaseCopied(true);
                        setTimeout(() => setPurchaseCopied(false), 2000);
                      }}
                      style={{
                        background: '#fbbf24',
                        border: 'none',
                        color: '#000',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {purchaseCopied ? '✓ Copied!' : 'Copy UPI'}
                    </button>
                  </div>
                </div>

                {/* 12-Digit UTR Input */}
                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Enter 12-Digit UTR / Transaction Reference ID *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="e.g. 423985123490 (from PhonePe / GPay receipt)"
                      value={purchaseUtr}
                      onChange={(e) => setPurchaseUtr(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1.2px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        color: '#fff',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPurchaseUtr(`UTR${Date.now().toString().slice(-9)}`)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#fbbf24',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>

                {/* Confirm QR Purchase Button */}
                <button
                  type="button"
                  disabled={isSubmittingPurchase}
                  onClick={handleConfirmPurchase}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #10b981)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    color: '#000',
                    fontSize: '13.5px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)',
                    marginTop: '4px',
                  }}
                >
                  {isSubmittingPurchase
                    ? '⏳ Submitting Payment...'
                    : `⚡ Confirm Payment & Start ${purchaseModalAsset.name} Stake`}
                </button>
              </div>
            )}

            {/* PAYMENT MODE B: WALLET BALANCE */}
            {purchaseMode === 'wallet' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1.2px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '12px',
                    padding: '14px',
                  }}
                >
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '4px' }}>Current Wallet Balance:</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                    ₹ {realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  {realBalance < Number(purchaseAmount || 0) && (
                    <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px', fontWeight: 700 }}>
                      ⚠️ Insufficient balance. Please switch to "Pay via {purchaseModalAsset.name} QR Code" above.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={realBalance < Number(purchaseAmount || 0)}
                  onClick={handleConfirmPurchase}
                  style={{
                    background: realBalance < Number(purchaseAmount || 0) ? '#475569' : 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '13.5px',
                    fontWeight: 900,
                    cursor: realBalance < Number(purchaseAmount || 0) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
                  }}
                >
                  ⚡ Pay ₹{Number(purchaseAmount || 0).toLocaleString('en-IN')} from Wallet & Start Stake
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTradingPortal;
