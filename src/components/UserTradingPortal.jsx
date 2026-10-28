import { useState, useEffect, useRef } from 'react';
import userApi from '../services/api';
import { showUserSuccess, showUserWarning, showUserError } from '../utils/swal';
import { FIFTY_STOCKS_MAP, getCompanyQrUrl, enrichStockWithPayment, getCustomQrOverride, getStockGroup, getSavedGroupQrs, getSavedGroupInterestRates, DEFAULT_GROUP_INTEREST } from '../data/stocksData';
import AssetIcon from './AssetIcon';
import {
  Zap,
  Flame,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Crown,
  Sparkles,
  Clock,
  ArrowUpRight,
  User,
  CheckCircle2,
  Gift,
  Headphones,
  Lock,
  Key,
  FileText,
  Landmark,
  Wallet,
  Home,
  BarChart2,
  Check,
  X,
  Eye,
  EyeOff,
  Bot,
  Send,
  Mail,
  Phone,
  HelpCircle,
  Download,
  Upload,
  AlertTriangle,
  FolderOpen,
  Smartphone,
  CreditCard,
  ChevronRight,
  Edit3,
} from 'lucide-react';


const DEFAULT_ASSETS = FIFTY_STOCKS_MAP || {};

const FALLBACK_ASSET = {
  id: 'BTC/USDT',
  name: 'Bitcoin',
  symbol: 'BTC',
  category: 'Crypto',
  basePrice: 5524321,
  step: 240,
  icon: 'BTC',
  color: '#f7931a',
  returnPercent: 30,
  payout: 90,
  minStake: 500,
  maxStake: 2000000,
  isEnabled: true,
  upiId: '',
  payeeName: 'Bitcoin Trading Desk',
  qrCode: '',
};

const resolveAsset = (map, key) => {
  if (map && key && map[key]) return map[key];
  if (DEFAULT_ASSETS && key && DEFAULT_ASSETS[key]) return DEFAULT_ASSETS[key];
  if (map && map['BTC/USDT']) return map['BTC/USDT'];
  if (map && map['BTC']) return map['BTC'];
  if (DEFAULT_ASSETS && DEFAULT_ASSETS['BTC/USDT']) return DEFAULT_ASSETS['BTC/USDT'];
  if (DEFAULT_ASSETS && DEFAULT_ASSETS['BTC']) return DEFAULT_ASSETS['BTC'];
  const firstInMap = map ? Object.values(map)[0] : null;
  if (firstInMap) return firstInMap;
  const firstInDefault = DEFAULT_ASSETS ? Object.values(DEFAULT_ASSETS)[0] : null;
  if (firstInDefault) return firstInDefault;
  return FALLBACK_ASSET;
};

const getInitialInvestorsForAsset = (assetKey) => {
  const key = (assetKey || '').toUpperCase().replace('/USDT', '').replace('/INR', '');
  const map = {
    BTC: 24850,
    ETH: 27420,
    SOL: 22340,
    BNB: 23650,
    USDT: 21120,
    XRP: 21890,
    DOGE: 20620,
    TCS: 28430,
    INFY: 22940,
    HDFCBANK: 26810,
    HDFC: 26810,
    RELIANCE: 31450,
    TATAMOTORS: 23890,
    ICICIBANK: 25120,
    SBIN: 21980,
    BHARTIARTL: 21450,
    ITC: 26350,
    LICI: 20890,
  };
  if (map[key]) return map[key];
  let hash = 0;
  for (let i = 0; i < (assetKey || '').length; i++) hash = (hash << 5) - hash + assetKey.charCodeAt(i);
  return 20500 + (Math.abs(hash) % 14500); // Always > 20,000
};

const getInitialPoolForAsset = (assetKey) => {
  const key = (assetKey || '').toUpperCase().replace('/USDT', '').replace('/INR', '');
  const map = {
    BTC: 48520000,
    ETH: 37400000,
    SOL: 21850000,
    BNB: 24210000,
    USDT: 20540000,
    XRP: 21560000,
    DOGE: 20830000,
    TCS: 29540000,
    INFY: 24180000,
    HDFCBANK: 31850000,
    HDFC: 31850000,
    RELIANCE: 41260000,
    TATAMOTORS: 23670000,
    ICICIBANK: 25840000,
    SBIN: 22450000,
    BHARTIARTL: 23150000,
    ITC: 26350000,
    LICI: 20890000,
  };
  if (map[key]) return map[key];
  let hash = 0;
  for (let i = 0; i < (assetKey || '').length; i++) hash = (hash << 5) - hash + assetKey.charCodeAt(i);
  return 20000000 + ((Math.abs(hash) % 250) * 100000);
};

const generateSeedTradersForAsset = (assetKey, rate) => {
  const displayAsset = (assetKey || '').replace('/USDT', '').replace('/INR', '');
  const returnPct = Number(rate) || 12;
  const seedData = [
    { name: 'Neha Bansal', avatar: 'NB', amount: 48500, time: 'Just now' },
    { name: 'Divya Singhania', avatar: 'DS', amount: 45000, time: '3s ago' },
    { name: 'Arjun Mehta', avatar: 'AM', amount: 38000, time: '6s ago' },
    { name: 'Sanjay Aggarwal', avatar: 'SA', amount: 32000, time: '10s ago' },
    { name: 'Priya Nair', avatar: 'PN', amount: 28000, time: '14s ago' },
    { name: 'Rohan Kapoor', avatar: 'RK', amount: 25000, time: '19s ago' },
    { name: 'Vikram Patel', avatar: 'VP', amount: 22000, time: '24s ago' },
    { name: 'Sneha Roy', avatar: 'SR', amount: 18500, time: '29s ago' },
    { name: 'Rajesh Rao', avatar: 'RR', amount: 15000, time: '34s ago' },
    { name: 'Aman Gupta', avatar: 'AG', amount: 12000, time: '40s ago' },
    { name: 'Pooja Verma', avatar: 'PV', amount: 8500, time: '46s ago' },
    { name: 'Rahul Sharma', avatar: 'RS', amount: 5000, time: '52s ago' },
  ];

  return seedData.map((d, idx) => {
    const profit = Math.round((d.amount * returnPct) / 100);
    return {
      id: `seed_${assetKey}_${idx}`,
      name: d.name,
      avatar: d.avatar,
      amount: d.amount,
      adminPercent: returnPct,
      profit: profit,
      payout: d.amount + profit,
      time: d.time,
      isUser: false,
      asset: displayAsset,
    };
  });
};

const TIMEFRAMES = [
  { label: '15s Flash', seconds: 15 },
  { label: '30s Turbo', seconds: 30 },
  { label: '60s Standard', seconds: 60 },
  { label: '2m Pro', seconds: 120 },
];

const CHART_TIMEFRAMES = [
  { id: '1S', label: '1S', durationSec: 15, tickMs: 700, count: 40, desc: '1-Second Realtime' },
  { id: '1M', label: '1M', durationSec: 60, tickMs: 1200, count: 40, desc: '1-Minute Trend' },
  { id: '5M', label: '5M', durationSec: 300, tickMs: 1800, count: 40, desc: '5-Minute Intraday' },
  { id: '15M', label: '15M', durationSec: 900, tickMs: 2400, count: 40, desc: '15-Minute Session' },
  { id: '1H', label: '1H', durationSec: 3600, tickMs: 3000, count: 40, desc: '1-Hour Hourly' },
  { id: '1D', label: '1D', durationSec: 86400, tickMs: 4000, count: 30, desc: '1-Day Daily' },
];

const formatTimeLabel = (timestamp, tfId) => {
  const d = new Date(timestamp);
  if (tfId === '1S') {
    return d.toTimeString().split(' ')[0]; // HH:MM:SS
  }
  if (tfId === '1M' || tfId === '5M' || tfId === '15M') {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  if (tfId === '1H') {
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  }
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const BET_PRESETS = [1000, 2000, 5000, 10000, 25000, 50000];
const ADMIN_RETURN_TIERS = [2, 4, 6, 8, 10, 12];

const UserTradingPortal = ({
  user,
  realBalance,
  setRealBalance,
  onOpenDeposit,
  onOpenWithdraw,
  onLogout,
  onBackToWebsite,
}) => {
  // Navigation Tabs: 'home' (APK Screen 5), 'market', 'game' (3D Trade Arena), 'wallet', 'profile'
  const [currentTab, setCurrentTab] = useState('home');
  const [assetsMap, setAssetsMap] = useState(DEFAULT_ASSETS);
  const ASSETS = assetsMap;
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [chartTimeframe, setChartTimeframe] = useState('1S');
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[1]);
  const [betAmount, setBetAmount] = useState(1000); // Default ₹1000 min
  const [currentPrice, setCurrentPrice] = useState(() => {
    const initial = resolveAsset(DEFAULT_ASSETS, 'BTC/USDT');
    return initial?.basePrice ?? 5524321;
  });
  const [priceHistory, setPriceHistory] = useState([]);
  const [activeTrade, setActiveTrade] = useState(null);
  const [tradeResult, setTradeResult] = useState(null);
  const [candleType, setCandleType] = useState('line'); // 'line' or 'candle'
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [marketSearch, setMarketSearch] = useState('');
  const [marketFilter, setMarketFilter] = useState('All');

  // Admin-Defined Profit Percentage (Platform Default fallback clamped strictly 2% - 12%)
  const [adminProfitPercent, setAdminProfitPercent] = useState(() => {
    try {
      const saved = localStorage.getItem('paynex_admin_percent');
      return saved ? Math.min(12, Math.max(2, Number(saved))) : 5; // Default 5%
    } catch {
      return 5;
    }
  });

  // Dynamic asset-specific return rate
  const currentAsset = resolveAsset(assetsMap, selectedAsset);
  const rawAssetRate = currentAsset?.returnPercent ?? adminProfitPercent;
  const currentAssetRate = Number(rawAssetRate) || 12;

  // Auto-adjust bet amount when asset changes if below min limit
  useEffect(() => {
    const minReq = Math.max(1000, Number(currentAsset?.minStake) || 1000);
    setBetAmount((prev) => (prev < minReq ? minReq : prev));
  }, [selectedAsset, currentAsset]);

  // Auto-switch away from disabled asset if current asset gets disabled
  useEffect(() => {
    if (currentAsset && currentAsset.isEnabled === false) {
      const firstActive = Object.values(assetsMap).find((a) => a.isEnabled !== false);
      if (firstActive) {
        setSelectedAsset(firstActive.symbol || firstActive.id);
      }
    }
  }, [selectedAsset, currentAsset, assetsMap]);

  // Fetch live assets and interest rates from backend
  useEffect(() => {
    let isMounted = true;
    const fetchLiveAssets = async () => {
      try {
        const res = await userApi.getAssets();
        if (res && res.success && Array.isArray(res.assets) && res.assets.length > 0) {
          if (res.groupQrs && typeof res.groupQrs === 'object') {
            try {
              localStorage.setItem('paynex_group_qrs', JSON.stringify(res.groupQrs));
            } catch (_) {}
          }
          if (res.groupInterestRates && typeof res.groupInterestRates === 'object') {
            try {
              localStorage.setItem('paynex_group_interest_rates', JSON.stringify(res.groupInterestRates));
            } catch (_) {}
          }
          const map = {};
          const savedQrs = getSavedGroupQrs();
          const savedRates = getSavedGroupInterestRates();
          const masterEngineRate = Number(res.defaultGameProfitPercent) || 12;
          res.assets.forEach((a) => {
            const grp = getStockGroup(a);
            const groupQr = (res.groupQrs && res.groupQrs[grp]) || (savedQrs && savedQrs[grp]) || '';
            const custom = getCustomQrOverride(a);
            const groupRate = (res.groupInterestRates && res.groupInterestRates[grp] !== undefined && res.groupInterestRates[grp] !== null)
              ? Number(res.groupInterestRates[grp])
              : ((savedRates && savedRates[grp] !== undefined && savedRates[grp] !== null)
                ? Number(savedRates[grp])
                : null);
            const assetBackendRate = (a.returnPercent !== undefined && a.returnPercent !== null && Number(a.returnPercent) > 0)
              ? Number(a.returnPercent)
              : null;
            const customRate = (custom?.returnPercent !== undefined && custom?.returnPercent !== null)
              ? Number(custom.returnPercent)
              : null;

            // Admin Full Control: Group Rate > Individual DB Rate > Master Staking Engine Rate
            const rawRate = customRate ?? groupRate ?? assetBackendRate ?? masterEngineRate;
            const effectiveReturn = Math.min(12, Math.max(2, Number(rawRate)));
            const effectiveEnabled = custom?.isEnabled !== undefined ? Boolean(custom.isEnabled) : (a.isEnabled !== false);
            const effectiveQr = groupQr || a.qrCode || (custom?.qrCode !== undefined ? custom.qrCode : '');
            const enriched = {
              id: a.id,
              name: a.name,
              symbol: a.symbol,
              category: a.category || 'Stock',
              group: grp,
              basePrice: Number(a.basePrice) || 1000,
              step: Number(a.step) || Math.max(1, (Number(a.basePrice) * 0.001)),
              icon: a.icon || 'stock',
              color: a.color || '#38bdf8',
              returnPercent: effectiveReturn,
              payout: 90,
              minStake: Math.max(1000, Number(a.minStake) || 1000),
              maxStake: a.maxStake,
              isEnabled: effectiveEnabled,
              upiId: custom?.upiId || a.upiId || '',
              payeeName: custom?.payeeName || a.payeeName || `${a.name} Trading Desk`,
              qrCode: effectiveQr,
            };
            if (a.id) map[a.id] = enriched;
            if (a.symbol) map[a.symbol] = enriched;
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
    const interval = setInterval(fetchLiveAssets, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Live user profile & balance sync from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    const fetchLiveUser = async () => {
      try {
        const token = localStorage.getItem('paynex_user_token') || localStorage.getItem('paynex_token');
        if (!token) return;
        const res = await userApi.getMe();
        if (isMounted && res && res.success && res.user) {
          if (typeof res.user.balance === 'number') {
            setRealBalance(res.user.balance);
            try {
              localStorage.setItem('paynex_real_bal', res.user.balance);
            } catch (_) {}
          }
          if (res.user.name) setProfileName(res.user.name);
          if (res.user.email) setProfileEmail(res.user.email);
          if (res.user.phone) setProfilePhone(res.user.phone);
        }
      } catch (err) {
        console.warn('Portal user sync notice:', err.message);
      }
    };
    fetchLiveUser();
    const interval = setInterval(fetchLiveUser, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setRealBalance]);

  // Live platform engine profit rate sync from Setting main_config
  useEffect(() => {
    let isMounted = true;
    const fetchLiveRate = async () => {
      try {
        const res = await userApi.getStakingRate();
        if (isMounted && res && res.success && res.returnPercent) {
          const cleanRate = Math.min(12, Math.max(2, Number(res.returnPercent)));
          setAdminProfitPercent(cleanRate);
          try {
            localStorage.setItem('paynex_admin_percent', cleanRate);
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Staking rate sync notice:', err.message);
      }
    };
    fetchLiveRate();
    const interval = setInterval(fetchLiveRate, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Settings & Profile Subpages State
  const [activeSettingModal, setActiveSettingModal] = useState(null);
  const [profileName, setProfileName] = useState(() => user?.name || 'Trader');
  const [profileEmail, setProfileEmail] = useState(() => user?.email || 'trader@paynex.com');
  const [profilePhone, setProfilePhone] = useState(() => user?.phone || '+91 98765 43210');
  const [profileDob, setProfileDob] = useState('14/08/1998');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [smsOtpEnabled, setSmsOtpEnabled] = useState(true);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [passSubmitting, setPassSubmitting] = useState(false);

  const [hasWithdrawalPass, setHasWithdrawalPass] = useState(() => {
    return Boolean(user?.hasWithdrawalPassword) || Boolean(localStorage.getItem('paynex_has_withdrawal_pin'));
  });
  const [withdrawPassForm, setWithdrawPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showWithdrawPassCurrent, setShowWithdrawPassCurrent] = useState(false);
  const [showWithdrawPassNew, setShowWithdrawPassNew] = useState(false);
  const [withdrawPassSubmitting, setWithdrawPassSubmitting] = useState(false);
  const [bankAccount, setBankAccount] = useState(() => ({
    bankName: user?.bankDetails?.bankName || 'HDFC Bank',
    holderName: user?.bankDetails?.holderName || user?.name || 'Trader',
    accountNumber: user?.bankDetails?.accountNumber || '458912349012',
    ifsc: user?.bankDetails?.ifsc || 'HDFC0001234',
    upiId: user?.bankDetails?.upiId || (user?.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'trader@okhdfcbank'),
  }));
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState(() => ({
    bankName: user?.bankDetails?.bankName || 'HDFC Bank',
    holderName: user?.bankDetails?.holderName || user?.name || 'Trader',
    accountNumber: user?.bankDetails?.accountNumber || '458912349012',
    ifsc: user?.bankDetails?.ifsc || 'HDFC0001234',
    upiId: user?.bankDetails?.upiId || (user?.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'trader@okhdfcbank'),
  }));
  const [openFaq, setOpenFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [showAdminConfig, setShowAdminConfig] = useState(false);

  // Persistent User Contracts State (Tracks all contracts purchased/taken by user)
  const [userContracts, setUserContracts] = useState(() => {
    try {
      const token = localStorage.getItem('paynex_user_token') || localStorage.getItem('paynex_token');
      if (!token) return [];
      const saved = localStorage.getItem('paynex_user_contracts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // AI Live Support Chat State
  const [supportTab, setSupportTab] = useState('chat'); // 'chat' or 'help'
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Sync AI Chat when Support Modal is opened
  useEffect(() => {
    if (activeSettingModal === 'support') {
      let isMounted = true;
      const fetchChat = async () => {
        setChatLoading(true);
        try {
          const res = await userApi.getMyChat();
          if (isMounted && res?.success && res.chat) {
            setChatId(res.chat._id);
            if (Array.isArray(res.chat.messages) && res.chat.messages.length > 0) {
              setChatMessages(res.chat.messages);
            } else {
              setChatMessages([
                {
                  sender: 'ai',
                  text: `Namaste ${user?.name || 'Trader'}! PAYNEX 24/7 AI Desk online hai.\n\nAapko deposit, withdrawal, KYC, staking returns ya password reset me koi bhi sahayata chahiye toh yahan likhein!`,
                  createdAt: new Date().toISOString(),
                },
              ]);
            }
          }
        } catch {
          if (isMounted && chatMessages.length === 0) {
            setChatMessages([
              {
                sender: 'ai',
                text: `Namaste ${user?.name || 'Trader'}! PAYNEX 24/7 AI Desk online hai. Kripya apna prashna yahan likhiye.`,
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        } finally {
          if (isMounted) setChatLoading(false);
        }
      };
      fetchChat();
      return () => {
        isMounted = false;
      };
    }
  }, [activeSettingModal]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (activeSettingModal === 'support' && supportTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping, activeSettingModal, supportTab]);

  const handleSendChat = async (presetText) => {
    const text = (presetText || chatInput).trim();
    if (!text || isAiTyping) return;
    setChatInput('');

    // Optimistically push user message
    const optimisticMsg = {
      sender: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, optimisticMsg]);
    setIsAiTyping(true);

    try {
      const res = await userApi.sendChatMessage(text, chatId);
      if (res?.success) {
        if (res.chat?._id) setChatId(res.chat._id);
        if (res.aiReply) {
          setChatMessages((prev) => [
            ...prev,
            {
              sender: res.aiReply.sender || 'ai',
              text: res.aiReply.text,
              createdAt: res.aiReply.createdAt || new Date().toISOString(),
            },
          ]);
        }
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Aapka sandesh support team tak pahunch gaya hai. AI bot kripya kuch seconds me punah prayas karein.',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Network issue ki wajah se response aane me deri ho rahi hai. Kripya punah message bhej kar check karein.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const [contractFilter, setContractFilter] = useState('all'); // 'all', 'running', 'completed'
  const [walletViewTab, setWalletViewTab] = useState('transactions'); // 'transactions' or 'contracts'
  const [tradeHistory, setTradeHistory] = useState([]);

  // Auto-sync user contracts with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('paynex_user_contracts', JSON.stringify(userContracts));
    } catch {}
  }, [userContracts]);

  // Live contracts sync with backend
  useEffect(() => {
    let isMounted = true;
    const syncServerContracts = async () => {
      try {
        const token = localStorage.getItem('paynex_user_token') || localStorage.getItem('paynex_token');
        if (!token) return;
        const res = await userApi.getMyStakes();
        if (isMounted && res && res.success && Array.isArray(res.rounds)) {
          const mapped = res.rounds.map((r) => {
            const assetObj = resolveAsset(assetsMap, r.asset);
            const rate = r.returnPercent || 4;
            const amt = Number(r.stakedAmount || r.amount || 0);
            const daily = Number(r.dailyInterest || Math.round((amt * rate) / 100));
            const totalEarned = Number(r.totalInterestEarned || 0);
            const pft = totalEarned > 0 ? totalEarned : daily;
            return {
              id: r._id || r.id || `CT-${r.roundId || Date.now()}`,
              asset: r.asset,
              assetName: assetObj?.name || r.asset,
              symbol: assetObj?.symbol || r.asset,
              icon: assetObj?.icon || 'stock',
              color: assetObj?.color || '#fbbf24',
              category: assetObj?.category || 'Stock',
              amount: amt,
              rate,
              dailyInterest: daily,
              totalInterestEarned: totalEarned,
              profit: pft,
              payout: Number(r.payout || (amt + pft)),
              duration: '5:00 AM Daily',
              time: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : (r.time || 'Recent'),
              status: r.status === 'Active' ? 'Running' : 'Completed',
            };
          });
          setUserContracts(mapped);
          try {
            localStorage.setItem('paynex_user_contracts', JSON.stringify(mapped));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Server contracts sync notice:', err.message);
      }
    };
    syncServerContracts();
    const interval = setInterval(syncServerContracts, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [assetsMap]);

  // Dynamic Portfolio Calculations: Available Balance & Contract Amount
  const activeContractAmount = activeTrade
    ? Number(activeTrade.amount || 0)
    : userContracts
        .filter((c) => c.status === 'Running')
        .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  const totalPortfolioValue = Number(realBalance || 0) + activeContractAmount;
  const activeContractsList = userContracts.filter((c) => c.status === 'Running');
  const completedContractsList = userContracts.filter((c) => c.status === 'Completed');
  const totalInvestedInContracts = userContracts.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalProfitEarned = completedContractsList.reduce((sum, c) => sum + (Number(c.profit) || 0), 0);

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
    const interval = setInterval(loadWalletData, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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

  // Live Multiplayer Room Stakers & Pool State (Company-specific, investors > 20,000)
  const [companyInvestors, setCompanyInvestors] = useState(() => ({
    'BTC/USDT': 24850,
    'TCS': 28430,
    'INFY': 22940,
    'HDFCBANK': 26810,
    'RELIANCE': 31450,
  }));
  const [companyRoomTraders, setCompanyRoomTraders] = useState({});

  const currentInvestors = companyInvestors[selectedAsset] || getInitialInvestorsForAsset(selectedAsset);
  const activeRoomTraders = companyRoomTraders[selectedAsset] || generateSeedTradersForAsset(selectedAsset, currentAssetRate);

  // Periodic incoming stakes strictly under ₹50,000 for the selected company
  useEffect(() => {
    const SAMPLE_NAMES = [
      { name: 'Arjun Mehta', avatar: 'AM' },
      { name: 'Rohan Kapoor', avatar: 'RK' },
      { name: 'Priya Nair', avatar: 'PN' },
      { name: 'Mohit Chawla', avatar: 'MC' },
      { name: 'Divya Singhania', avatar: 'DS' },
      { name: 'Sanjay Aggarwal', avatar: 'SA' },
      { name: 'Neha Bansal', avatar: 'NB' },
      { name: 'Rajesh Rao', avatar: 'RR' },
      { name: 'Vikram Patel', avatar: 'VP' },
      { name: 'Sneha Roy', avatar: 'SR' },
      { name: 'Aman Gupta', avatar: 'AG' },
      { name: 'Karan Malhotra', avatar: 'KM' },
    ];
    // Stakes strictly under ₹50,000
    const AMOUNTS = [48500, 45000, 42000, 38000, 35000, 32000, 28000, 25000, 22000, 18500, 15000, 12000, 9500, 6000];

    const timer = setInterval(() => {
      const randomUser = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      const randomAmount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
      const simProfit = Math.round((randomAmount * currentAssetRate) / 100);
      const simPayout = randomAmount + simProfit;
      const displayAsset = (selectedAsset || '').replace('/USDT', '').replace('/INR', '');

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
        asset: displayAsset,
      };

      setCompanyRoomTraders((prev) => {
        const currentList = prev[selectedAsset] || generateSeedTradersForAsset(selectedAsset, currentAssetRate);
        return {
          ...prev,
          [selectedAsset]: [newBet, ...currentList.slice(0, 24)],
        };
      });

      setCompanyInvestors((prev) => {
        const cur = prev[selectedAsset] || getInitialInvestorsForAsset(selectedAsset);
        const delta = Math.random() > 0.48 ? 1 : -1;
        return {
          ...prev,
          [selectedAsset]: Math.max(20001, cur + delta),
        };
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [selectedAsset, currentAssetRate]);

  // Calculate Live Staking Pool Totals
  const roomStakeTotal = activeRoomTraders.reduce((sum, t) => sum + t.amount, 0);
  const basePoolStake = getInitialPoolForAsset(selectedAsset);
  const totalRoundPool = basePoolStake + roomStakeTotal;
  const totalMaturityPayout = Math.round(totalRoundPool * (1 + currentAssetRate / 100));

  // Initialize & Route Price History based on selected Asset and Chart Timeframe
  useEffect(() => {
    const asset = resolveAsset(ASSETS, selectedAsset);
    let price = Number(asset?.basePrice) || 5524321;
    const step = Number(asset?.step) || Math.max(1, price * 0.001);
    const tfConfig = CHART_TIMEFRAMES.find((t) => t.id === chartTimeframe) || CHART_TIMEFRAMES[0];
    const totalPoints = tfConfig.count;
    const now = Date.now();

    const stepMultipliers = { '1S': 2, '1M': 4, '5M': 7, '15M': 10, '1H': 15, '1D': 25 };
    const mult = stepMultipliers[chartTimeframe] || 4;

    const timeDeltas = {
      '1S': 1000,
      '1M': 60 * 1000,
      '5M': 5 * 60 * 1000,
      '15M': 15 * 60 * 1000,
      '1H': 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000,
    };
    const pointDeltaMs = timeDeltas[chartTimeframe] || 1000;

    const history = [];
    for (let i = 0; i < totalPoints; i++) {
      const pointTime = now - (totalPoints - 1 - i) * pointDeltaMs;
      const open = price;
      const change = (Math.random() - 0.49) * step * mult;
      const close = Math.max(price * 0.5, open + change);
      const high = Math.max(open, close) + Math.random() * step * (mult * 0.5);
      const low = Math.max(price * 0.4, Math.min(open, close) - Math.random() * step * (mult * 0.5));
      price = close;
      history.push({
        open,
        close,
        high,
        low,
        time: i,
        timestamp: pointTime,
        timeLabel: formatTimeLabel(pointTime, chartTimeframe),
      });
    }
    setPriceHistory(history);
    setCurrentPrice(price);
  }, [selectedAsset, assetsMap, chartTimeframe]);

  // Real-Time Price Engine Ticking (Timed by Chart Timeframe)
  useEffect(() => {
    const asset = resolveAsset(ASSETS, selectedAsset);
    const step = Number(asset?.step) || 240;
    const tfConfig = CHART_TIMEFRAMES.find((t) => t.id === chartTimeframe) || CHART_TIMEFRAMES[0];
    const stepMultipliers = { '1S': 2, '1M': 4, '5M': 7, '15M': 10, '1H': 15, '1D': 25 };
    const mult = stepMultipliers[chartTimeframe] || 3.5;

    const interval = setInterval(() => {
      const delta = (Math.random() - 0.485) * step * mult;
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
            const pointTime = Date.now();
            updated.push({
              open: nextPrice,
              close: nextPrice,
              high: nextPrice,
              low: nextPrice,
              time: updated.length,
              timestamp: pointTime,
              timeLabel: formatTimeLabel(pointTime, chartTimeframe),
            });
            if (updated.length > 45) updated.shift();
          }
          return updated;
        });
        return nextPrice;
      });
    }, tfConfig.tickMs);

    return () => clearInterval(interval);
  }, [selectedAsset, chartTimeframe]);

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
            id: prev.contractId || prev.roundId || `stake_${Date.now()}`,
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

          // Update userContracts status to Completed
          setUserContracts((contracts) =>
            contracts.map((c) =>
              (c.status === 'Running' || c.id === prev.contractId || c.id === prev.roundId)
                ? { ...c, status: 'Completed', time: 'Just now' }
                : c
            )
          );

          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTrade, setRealBalance]);

  // Canvas Drawing Engine: Live Interactive Market Chart with Bullish Glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const clientW = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
    const clientH = chartHeight || 300;

    canvas.width = clientW * dpr;
    canvas.height = clientH * dpr;
    canvas.style.width = `${clientW}px`;
    canvas.style.height = `${clientH}px`;
    ctx.scale(dpr, dpr);

    const width = clientW;
    const height = clientH;

    // 1. Luxury Dark Theme Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0d1a');
    bgGrad.addColorStop(1, '#05070e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Prepare Prices Array from priceHistory & currentPrice
    const rawPrices = priceHistory && priceHistory.length > 0
      ? priceHistory.map((p) => Number(p.close || p.open || currentPrice))
      : [currentPrice * 0.992, currentPrice * 0.996, currentPrice * 1.002, currentPrice];

    const prices = [...rawPrices, currentPrice];

    let minP = Math.min(...prices);
    let maxP = Math.max(...prices);
    if (minP === maxP) {
      minP = currentPrice * 0.99;
      maxP = currentPrice * 1.01;
    }
    const pad = (maxP - minP) * 0.15;
    minP = Math.max(0, minP - pad);
    maxP = maxP + pad;
    const pRange = maxP - minP || 1;

    const topPad = 25;
    const bottomPad = 25;
    const rightMargin = width < 480 ? 65 : 85;
    const chartW = width - rightMargin;
    const chartH = height - topPad - bottomPad;

    // 2. Subtle Grid Lines & Right Price Scale
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = topPad + (chartH / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(chartW, y);
      ctx.stroke();

      const priceVal = maxP - (pRange / gridSteps) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      const formatted = `₹${priceVal >= 100000 ? (priceVal / 100000).toFixed(2) + 'L' : priceVal.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
      ctx.fillText(formatted, width - 8, y + 3);
    }
    ctx.setLineDash([]);

    // Coordinate helpers
    const getX = (idx) => 15 + (idx / Math.max(1, prices.length - 1)) * (chartW - 20);
    const getY = (val) => topPad + chartH - ((val - minP) / pRange) * chartH;

    // 3. Glowing Emerald Gradient Fill under Price Curve
    ctx.beginPath();
    ctx.moveTo(getX(0), topPad + chartH);
    for (let i = 0; i < prices.length; i++) {
      const x = getX(i);
      const y = getY(prices[i]);
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(prices[i - 1]);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    }
    ctx.lineTo(getX(prices.length - 1), topPad + chartH);
    ctx.closePath();

    const areaGrad = ctx.createLinearGradient(0, topPad, 0, topPad + chartH);
    areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    areaGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
    areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // 4. Vibrant Neon Price Line
    ctx.beginPath();
    for (let i = 0; i < prices.length; i++) {
      const x = getX(i);
      const y = getY(prices[i]);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(prices[i - 1]);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 5. Current Live Price Point & Tracking Line
    const lastX = getX(prices.length - 1);
    const lastY = getY(currentPrice);

    // Dashed Horizontal Tracking Line
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(15, lastY);
    ctx.lineTo(chartW, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pulsing Outer Glow Ring
    ctx.beginPath();
    ctx.arc(lastX, lastY, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
    ctx.fill();

    // Core Glowing Price Dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Live Price Pill on Right Axis
    const badgeW = rightMargin - 10;
    const badgeH = 22;
    const badgeX = chartW + 4;
    const badgeY = Math.max(topPad - 2, Math.min(height - bottomPad - badgeH, lastY - badgeH / 2));

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4) : ctx.rect(badgeX, badgeY, badgeW, badgeH);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10.5px monospace';
    ctx.textAlign = 'center';
    const liveText = currentPrice >= 100000
      ? `₹${(currentPrice / 100000).toFixed(2)}L`
      : `₹${currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
    ctx.fillText(liveText, badgeX + badgeW / 2, badgeY + 15);

    // 6. X-Axis Time Labels along the bottom of the chart (Routed by Timeframe)
    const numTimeLabels = width < 480 ? 3 : 5;
    ctx.fillStyle = '#64748b';
    ctx.font = '9.5px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < numTimeLabels; i++) {
      const fraction = i / (numTimeLabels - 1);
      const x = 20 + fraction * (chartW - 40);
      const dataIdx = Math.min(
        priceHistory.length - 1,
        Math.floor(fraction * (priceHistory.length - 1))
      );
      const label = priceHistory[dataIdx]?.timeLabel;
      if (label) {
        ctx.fillText(label, x, height - 7);
      }
    }

    // 7. Active Staking Overlay Line (if contract is running)
    if (activeTrade) {
      const activeEntryY = Math.min(height - 40, Math.max(topPad + 10, lastY + 25));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(15, activeEntryY);
      ctx.lineTo(chartW, activeEntryY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Active Holding: ₹${activeTrade.amount.toLocaleString('en-IN')} (+${activeTrade.adminPercent}% in ${activeTrade.timeLeft}s)`, 20, activeEntryY - 5);
    }
  }, [chartHeight, currentPrice, priceHistory, activeTrade, windowWidth, chartTimeframe]);

  const handleStakeGrowth = async () => {
    const minRequired = Math.max(1000, Number(currentAsset?.minStake) || 1000);
    if (!betAmount || betAmount < minRequired) {
      showUserWarning('Minimum Investment Required', `Minimum investment amount is ₹${minRequired.toLocaleString('en-IN')}.`);
      return;
    }
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

    const contractId = serverRoundId || `CT-${Math.floor(10000 + Math.random() * 90000)}`;

    setActiveTrade({
      contractId,
      roundId: serverRoundId,
      asset: selectedAsset,
      amount: betAmount,
      adminPercent: currentAssetRate,
      profit,
      payout,
      timeTotal: selectedTimeframe.seconds,
      timeLeft: selectedTimeframe.seconds,
    });

    const newContract = {
      id: contractId,
      asset: selectedAsset,
      assetName: currentAsset?.name || selectedAsset,
      symbol: currentAsset?.symbol || selectedAsset,
      icon: currentAsset?.icon || 'stock',
      color: currentAsset?.color || '#fbbf24',
      category: currentAsset?.category || 'Asset',
      amount: betAmount,
      rate: currentAssetRate,
      profit,
      payout,
      duration: `${selectedTimeframe.seconds}s`,
      time: 'Just now',
      status: 'Running',
      createdAt: Date.now(),
    };
    setUserContracts((prevContracts) => [newContract, ...prevContracts]);

    // Add user's real stake into the live room participants feed
    const displayAsset = (selectedAsset || '').replace('/USDT', '').replace('/INR', '');
    const userStakeEntry = {
      id: serverRoundId || `user_stake_${Date.now()}`,
      name: `${user?.name || 'Sachin'} (You)`,
      avatar: 'TRD',
      amount: betAmount,
      adminPercent: currentAssetRate,
      profit,
      payout,
      time: 'Just now',
      isUser: true,
      asset: displayAsset,
    };
    setCompanyRoomTraders((prev) => {
      const currentList = prev[selectedAsset] || generateSeedTradersForAsset(selectedAsset, currentAssetRate);
      return {
        ...prev,
        [selectedAsset]: [userStakeEntry, ...currentList.slice(0, 24)],
      };
    });
    setCompanyInvestors((prev) => {
      const cur = prev[selectedAsset] || getInitialInvestorsForAsset(selectedAsset);
      return { ...prev, [selectedAsset]: cur + 1 };
    });
  };

  // Dedicated Stock Purchase & QR Payment Modal State
  const [purchaseModalAsset, setPurchaseModalAsset] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(5000);
  const [purchaseMode, setPurchaseMode] = useState('qr'); // 'qr' or 'wallet'
  const [purchaseUtr, setPurchaseUtr] = useState('');
  const [purchaseScreenshot, setPurchaseScreenshot] = useState('');
  const [purchaseScreenshotName, setPurchaseScreenshotName] = useState('');
  const [purchaseCopied, setPurchaseCopied] = useState(false);
  const [isSubmittingPurchase, setIsSubmittingPurchase] = useState(false);

  const handlePurchaseScreenshotUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showUserWarning('File Too Large', 'Please upload a screenshot smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPurchaseScreenshot(uploadEvent.target?.result || '');
      setPurchaseScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPurchaseModal = (targetAsset = null, preferredMode = null) => {
    const assetToBuy = targetAsset || currentAsset || resolveAsset(DEFAULT_ASSETS, selectedAsset);
    const minVal = Math.max(1000, Number(assetToBuy?.minStake) || 1000);
    setPurchaseModalAsset(assetToBuy);
    setPurchaseAmount(minVal);
    // If user has balance >= minVal, default to wallet for 1-click purchase! Otherwise QR
    const mode = preferredMode || (realBalance >= minVal ? 'wallet' : 'qr');
    setPurchaseMode(mode);
    setPurchaseUtr('');
    setPurchaseScreenshot('');
    setPurchaseScreenshotName('');
  };

  const handleConfirmPurchase = async (e) => {
    e?.preventDefault();
    if (!purchaseModalAsset) return;

    if (activeTrade) {
      showUserWarning('Active Plan in Progress', 'A growth plan is already active! Please wait for it to mature.');
      return;
    }

    const buyAmt = Number(purchaseAmount);
    const minRequired = Math.max(1000, Number(purchaseModalAsset.minStake) || 1000);
    if (!buyAmt || buyAmt < minRequired) {
      showUserWarning('Minimum Investment Required', `Minimum investment for ${purchaseModalAsset.name} is ₹${minRequired.toLocaleString('en-IN')}.`);
      return;
    }

    const assetRate = purchaseModalAsset.returnPercent ?? currentAssetRate;
    const profit = Math.round((buyAmt * assetRate) / 100);
    const payout = buyAmt + profit;
    const targetUpi = purchaseModalAsset.upiId || '';

    // ==========================================
    // MODE 1: REAL PAYMENT FROM WALLET (100% Instant Real Payment)
    // ==========================================
    if (purchaseMode === 'wallet') {
      if (realBalance < buyAmt) {
        showUserWarning(
          'Insufficient Wallet Balance',
          `Your wallet has ₹${realBalance.toLocaleString('en-IN')}. Please switch to "Pay via QR Code" or top up your wallet with real payment first.`
        );
        return;
      }

      setRealBalance((b) => b - buyAmt);

      // Set active growth plan on this asset with real funds
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

      const contractId = serverRoundId || `CT-${Math.floor(10000 + Math.random() * 90000)}`;

      setActiveTrade({
        contractId,
        roundId: serverRoundId,
        asset: purchaseModalAsset.symbol || purchaseModalAsset.id,
        amount: buyAmt,
        adminPercent: assetRate,
        profit,
        payout,
        timeTotal: selectedTimeframe.seconds,
        timeLeft: selectedTimeframe.seconds,
      });

      const newContract = {
        id: contractId,
        asset: purchaseModalAsset.symbol || purchaseModalAsset.id,
        assetName: purchaseModalAsset.name,
        symbol: purchaseModalAsset.symbol || purchaseModalAsset.id,
        icon: purchaseModalAsset.icon || 'stock',
        color: purchaseModalAsset.color || '#3b82f6',
        category: purchaseModalAsset.category || 'Stock',
        amount: buyAmt,
        rate: assetRate,
        profit,
        payout,
        duration: `${selectedTimeframe.seconds}s`,
        time: 'Just now',
        status: 'Running',
        createdAt: Date.now(),
      };
      setUserContracts((prevContracts) => [newContract, ...prevContracts]);

      const purchasedSymbol = purchaseModalAsset.symbol || purchaseModalAsset.id;
      const displaySymbol = (purchasedSymbol || '').replace('/USDT', '').replace('/INR', '');
      const userStakeEntry = {
        id: serverRoundId || `user_stake_${Date.now()}`,
        name: `${user?.name || 'Sachin'} (You)`,
        avatar: 'TRD',
        amount: buyAmt,
        adminPercent: assetRate,
        profit,
        payout,
        time: 'Just now',
        isUser: true,
        asset: displaySymbol,
      };
      setCompanyRoomTraders((prev) => {
        const currentList = prev[purchasedSymbol] || generateSeedTradersForAsset(purchasedSymbol, assetRate);
        return {
          ...prev,
          [purchasedSymbol]: [userStakeEntry, ...currentList.slice(0, 24)],
        };
      });
      setCompanyInvestors((prev) => {
        const cur = prev[purchasedSymbol] || getInitialInvestorsForAsset(purchasedSymbol);
        return { ...prev, [purchasedSymbol]: cur + 1 };
      });

      const purchasedAssetName = purchaseModalAsset.name;
      setPurchaseModalAsset(null);

      showUserSuccess(
        'Stock Purchase & Stake Activated!',
        `Real payment of <strong>₹${buyAmt.toLocaleString('en-IN')}</strong> confirmed from Wallet! Growth plan on <strong>${purchasedAssetName}</strong> active with <strong>+${assetRate}% Guaranteed Profit</strong>!`
      );
      return;
    }

    // ==========================================
    // MODE 2: QR PAYMENT MODE (STRICT REAL PAYMENT ONLY - NO FAKE CONTRACT ACTIVATION!)
    // ==========================================
    const cleanUtr = (purchaseUtr || '').trim().replace(/\D/g, ''); // Numeric only

    if (!cleanUtr || cleanUtr.length < 10 || cleanUtr.length > 16) {
      showUserWarning(
        'Real 12-Digit UTR Required',
        'Please complete payment on PhonePe / GPay / Paytm and enter the real 12-digit UTR reference number from your bank receipt.'
      );
      return;
    }

    // Check repeating fake patterns (e.g. 000000000000, 111111111111)
    if (/^(\d)\1{9,}$/.test(cleanUtr)) {
      showUserWarning(
        'Invalid UTR Number',
        'Repeated dummy numbers detected. Please enter your real 12-digit payment UTR.'
      );
      return;
    }

    setIsSubmittingPurchase(true);
    try {
      await userApi.submitDeposit(buyAmt, `Stock Purchase (${purchaseModalAsset.name})`, cleanUtr, purchaseScreenshot || '', {
        companyId: purchaseModalAsset.id || purchaseModalAsset.symbol,
        companyName: purchaseModalAsset.name,
        companyUpi: targetUpi,
        stockSymbol: purchaseModalAsset.symbol || purchaseModalAsset.id,
        intendedAction: 'stake',
        rate: assetRate,
      });

      const purchasedAssetName = purchaseModalAsset.name;
      setPurchaseModalAsset(null);
      setPurchaseUtr('');
      setPurchaseScreenshot('');
      setPurchaseScreenshotName('');

      showUserSuccess(
        'Real Payment Submitted for Verification!',
        `Payment request of <strong>₹${buyAmt.toLocaleString('en-IN')}</strong> (UTR: <code>${cleanUtr}</code>) submitted successfully.<br/><br/><strong>Security Note:</strong> Fake payments are strictly rejected. Once Admin verifies the real payment in bank account, your <strong>${purchasedAssetName}</strong> contract (+${assetRate}% profit) will activate automatically!`
      );
    } catch (err) {
      showUserError('Submission Failed', err.message || 'Could not submit deposit request. Please try again.');
    } finally {
      setIsSubmittingPurchase(false);
    }
  };


  // Render Rich Contracts History Section
  const renderContractsHistorySection = ({ title = 'My Contracts & Holdings History', subtitle = null }) => {
    const displayedContracts = userContracts.filter((c) => {
      if (contractFilter === 'running') return c.status === 'Running';
      if (contractFilter === 'completed') return c.status === 'Completed';
      return true;
    });

    return (
      <div
        style={{
          borderRadius: '22px',
          padding: 'clamp(14px, 2.5vw, 22px)',
          background: 'linear-gradient(150deg, rgba(20, 21, 35, 0.98), rgba(11, 12, 20, 0.98))',
          border: '1.2px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
          marginBottom: '24px',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#fbbf24" />
              <h3 style={{ fontSize: 'clamp(16px, 4vw, 19px)', fontWeight: 800, color: '#fff', margin: 0 }}>
                {title}
              </h3>
              <span
                style={{
                  background: 'rgba(251, 191, 36, 0.16)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  color: '#fbbf24',
                  fontSize: '11px',
                  fontWeight: 800,
                  borderRadius: '12px',
                  padding: '2px 8px',
                }}
              >
                {userContracts.length} Total
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              {subtitle || 'Real-time record of all contracts purchased, locked capital, guaranteed profit yields & payout status.'}
            </p>
          </div>

          {/* Quick Dual Balance Indicator within Contracts Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '10px',
                padding: '4px 10px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '10px', color: '#6ee7b7', fontWeight: 600 }}>Available Balance</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
                ₹{Number(realBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              style={{
                background: activeContractAmount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: activeContractAmount > 0 ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '4px 10px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '10px', color: '#fde68a', fontWeight: 600 }}>In Contract</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                ₹{activeContractAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stat Portfolio Performance Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            marginBottom: '16px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '10px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Total Contracts Taken</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{userContracts.length} Contracts</div>
          </div>
          <div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Active Working Capital</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fbbf24' }}>
              ₹{activeContractAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Total Contract Volume</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#93c5fd' }}>
              ₹{totalInvestedInContracts.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Total Profit Credited</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#34d399' }}>
              +₹{totalProfitEarned.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Contracts (${userContracts.length})` },
            { id: 'running', label: `Active / Running (${activeContractsList.length})` },
            { id: 'completed', label: `Completed (${completedContractsList.length})` },
          ].map((tab) => {
            const isSel = contractFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setContractFilter(tab.id)}
                style={{
                  background: isSel ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSel ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSel ? '#fbbf24' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: isSel ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contracts Cards List */}
        {displayedContracts.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '14px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><FolderOpen size={32} color="#64748b" /></div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
              No Contracts Found
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '360px', margin: '0 auto 14px auto' }}>
              {contractFilter === 'running'
                ? 'You do not have any active running contracts right now. Stake in any stock or crypto to start guaranteed growth!'
                : 'No contracts found in this view.'}
            </div>
            <button
              onClick={() => setCurrentTab('market')}
              className="btn-cyber-primary"
              style={{ padding: '8px 18px', fontSize: '12px', borderRadius: '10px', fontWeight: 800 }}
            >
              + Explore Market & Take Contract
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayedContracts.map((c, idx) => {
              const isRunning = c.status === 'Running';
              return (
                <div
                  key={c.id || idx}
                  style={{
                    background: isRunning
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(20, 21, 35, 0.95))'
                      : 'rgba(20, 21, 31, 0.85)',
                    border: isRunning ? '1.5px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    boxShadow: isRunning ? '0 4px 18px rgba(245, 158, 11, 0.2)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {/* Top line: Asset Info & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: `${c.color || '#fbbf24'}22`,
                          border: `1.5px solid ${c.color || '#fbbf24'}66`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                        }}
                      >
                        <AssetIcon symbol={c.symbol || c.name} iconName={c.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                            {c.assetName || c.asset}
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 800,
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: '#94a3b8',
                              padding: '1px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            {c.symbol || c.asset}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
                          <span>ID: #{c.id}</span>
                          <span>•</span>
                          <span>{c.time || 'Recent'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isRunning ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1.2px solid #fbbf24',
                            borderRadius: '20px',
                            padding: '3px 10px',
                          }}
                        >
                          <span className="live-pulse-dot" />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24' }}>
                            Active ({activeTrade ? `${activeTrade.timeLeft}s left` : `${c.duration || '30s'}`})
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'rgba(16, 185, 129, 0.18)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            borderRadius: '20px',
                            padding: '3px 10px',
                          }}
                        >
                          <Check size={11} color="#10b981" />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>
                            Completed & Credited
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Line: Investment, Rate, Profit, Payout Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '8px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Contract Amount</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                        ₹{Number(c.amount || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Return Rate</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>
                        +{c.rate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Profit Return</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
                        +₹{Number(c.profit || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Total Payout</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#60a5fa', fontFamily: 'monospace' }}>
                        ₹{Number(c.payout || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const assetInfo = resolveAsset(ASSETS, selectedAsset);

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
          <div className="portal-header-top">
            {/* User Profile Header (Left) */}
            <div className="portal-profile-wrap">
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
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: 'clamp(13px, 3.8vw, 16px)', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
                    Hello, {user?.name || 'Trader'}
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

            {/* Header Actions (Right) */}
            <div className="portal-header-actions">
              <button
                onClick={onOpenDeposit}
                className="btn-cyber-primary"
                style={{
                  padding: '7px clamp(9px, 2.2vw, 14px)',
                  fontSize: 'clamp(11px, 2.8vw, 12px)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + Deposit
              </button>
              <button
                onClick={onOpenWithdraw}
                className="btn-cyber-outline"
                style={{
                  padding: '7px clamp(8px, 2vw, 12px)',
                  fontSize: 'clamp(11px, 2.8vw, 12px)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
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
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Exit
              </button>
            </div>
          </div>

          {/* Dual Balance HUD: Available Balance + In Contract + Quick Action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
              background: 'linear-gradient(135deg, rgba(20, 21, 31, 0.95), rgba(10, 11, 18, 0.98))',
              border: '1.2px solid rgba(251, 191, 36, 0.28)',
              borderRadius: '16px',
              padding: '8px 12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Left stats: Available & In Contract */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Available Balance */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Available Balance ready to trade or withdraw"
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: 600 }}>Available:</span>
                <span style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                  ₹{Number(realBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* In Contract Amount */}
              <div
                style={{
                  background: activeContractAmount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: activeContractAmount > 0 ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Amount currently locked in active contracts"
              >
                <Zap size={12} color="#fbbf24" />
                <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>In Contract:</span>
                <span style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                  ₹{activeContractAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Right actions: Contracts Link + Add Funds */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setCurrentTab('contracts')}
                style={{
                  background: currentTab === 'contracts' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  border: currentTab === 'contracts' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: currentTab === 'contracts' ? '#fbbf24' : '#cbd5e1',
                  borderRadius: '8px',
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="View All My Contracts"
              >
                <FileText size={14} color="#38bdf8" />
                <span>Contracts ({userContracts.length})</span>
              </button>

              <button
                onClick={() => onOpenDeposit()}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  color: '#000',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.35)',
                }}
                title="Quick Add Funds"
              >
                + Add
              </button>
            </div>
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
          paddingBottom: 'clamp(90px, 12vh, 120px)',
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
              className="hide-scrollbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '8px',
                maxWidth: '780px',
                margin: '0 auto 12px auto',
                width: '100%',
              }}
            >
              {Object.entries(ASSETS)
                .filter(([_, item]) => item.isEnabled !== false)
                .map(([symbol, item]) => {
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
                      padding: '6px 12px',
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
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '13px',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      <AssetIcon symbol={item.symbol || symbol} iconName={item.icon} category={item.category} size={15} color="#fff" />
                    </span>
                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                      <div style={{ fontSize: 'clamp(11.5px, 3vw, 13px)', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {item.name || symbol}
                      </div>
                      <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        Fixed +{item.returnPercent ?? currentAssetRate}% Return
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Multiplayer Pool & Admin Yield HUD */}
            <div className="cyber-card live-staking-hud">
              {/* HUD Header */}
              <div className="hud-grid-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="live-pulse-dot" />
                  <span style={{ fontSize: 'clamp(12px, 3.2vw, 13.5px)', fontWeight: 800, color: '#fff' }}>
                    LIVE STAKING POOL • {selectedAsset}
                  </span>
                  <span
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={11} /> {currentInvestors.toLocaleString('en-IN')} Active
                    </span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600 }}>Total Staked:</span>
                  <span style={{ fontSize: 'clamp(13.5px, 3.5vw, 15px)', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
                    ₹{totalRoundPool.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Pool Growth & Payout Banner */}
              <div className="hud-banner-row">
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
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      color: '#fbbf24',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Zap size={11} /> Fixed Return
                    </span>
                  </span>
                  <span style={{ fontSize: 'clamp(11.5px, 3.2vw, 13px)', fontWeight: 900, color: '#34d399' }}>
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
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                    Pool Payout:
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(13px, 3.5vw, 14.5px)',
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

            {/* Trading Desk: Chart Card + Stock Investment Desk */}
            <div className="trading-grid-wrap">
              {/* Chart Card */}
              <div
                className="cyber-card"
                style={{
                  borderRadius: '20px',
                  padding: 'clamp(14px, 2.5vw, 18px)',
                  background: 'linear-gradient(150deg, rgba(14, 15, 24, 0.98), rgba(8, 9, 14, 0.99))',
                  border: '1.2px solid rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Chart Header */}
                <div style={{ marginBottom: '14px' }}>
                  {/* Top Row: Asset Symbol + Live Badge (Left) & QR Pay + Guaranteed Return (Right) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <span
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          background: assetInfo.color || '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '17px',
                          color: '#fff',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                      >
                        <AssetIcon symbol={assetInfo.symbol || selectedAsset} iconName={assetInfo.icon} category={assetInfo.category} size={18} color="#fff" />
                      </span>
                      <div>
                        <div style={{ fontSize: 'clamp(16px, 4.2vw, 19px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{assetInfo.name || selectedAsset}</span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 800,
                              background: 'rgba(16, 185, 129, 0.16)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              color: '#10b981',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              letterSpacing: '0.5px',
                            }}
                          >
                            ● LIVE
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                          {selectedAsset} • {assetInfo.category || 'Asset'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleOpenPurchaseModal(assetInfo, 'qr')}
                        style={{
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(16, 185, 129, 0.22))',
                          border: '1.2px solid #10b981',
                          color: '#34d399',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
                          transition: 'all 0.2s ease',
                        }}
                        title={`Scan QR code to pay & invest in ${assetInfo.name || selectedAsset}`}
                      >
                        <Smartphone size={14} color="#38bdf8" />
                        <span>QR Pay</span>
                      </button>
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          color: '#fbbf24',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Flame size={12} /> +{currentAssetRate}% Guaranteed
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Price Display & Key Stats */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: 'clamp(22px, 5.5vw, 27px)', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace', letterSpacing: '-0.5px' }}>
                        ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <TrendingUp size={12} /> +{currentAssetRate}% Fixed Return
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Min Buy: <strong style={{ color: '#fff' }}>₹{Math.max(1000, Number(assetInfo.minStake) || 1000).toLocaleString('en-IN')}</strong></span>
                      <span>•</span>
                      <span>Vol: <strong style={{ color: '#fff' }}>₹14.8M</strong></span>
                    </div>
                  </div>
                </div>

                {/* Live Canvas Interactive Area */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: `${chartHeight}px`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#070a14',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                  {/* Active Investment HUD Overlay */}
                  {activeTrade && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        maxWidth: 'calc(100% - 24px)',
                        background: 'rgba(5, 7, 20, 0.94)',
                        border: '1.5px solid #10b981',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: '#10b981',
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '17px',
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        <Zap size={14} color="#f59e0b" />
                      </div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          Invested: ₹{activeTrade.amount.toLocaleString('en-IN')} • Return Rate: +{activeTrade.adminPercent}%
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 800 }}>
                          Total Return: <span style={{ color: '#34d399' }}>₹{activeTrade.payout.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '17px',
                          fontWeight: 900,
                          color: '#fbbf24',
                          fontFamily: 'monospace',
                          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingLeft: '10px',
                          flexShrink: 0,
                        }}
                      >
                        {activeTrade.timeLeft}s
                      </div>
                    </div>
                  )}
                </div>

                {/* 24H Market Stats Strip under Chart */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {CHART_TIMEFRAMES.map((tf) => {
                      const isSel = chartTimeframe === tf.id;
                      return (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => {
                            setChartTimeframe(tf.id);
                            setSelectedTimeframe({ label: tf.label, seconds: tf.durationSec });
                          }}
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: isSel ? 'rgba(245, 158, 11, 0.28)' : 'rgba(255, 255, 255, 0.04)',
                            color: isSel ? '#fbbf24' : '#94a3b8',
                            border: isSel ? '1.2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isSel ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
                          }}
                          title={tf.desc}
                        >
                          {tf.label}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10.5px' }}>
                    <span style={{ color: '#94a3b8' }}>
                      24h High: <strong style={{ color: '#34d399' }}>₹{(currentPrice * 1.025).toLocaleString('en-IN', { maximumFractionDigits: 1 })}</strong>
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      24h Low: <strong style={{ color: '#ef4444' }}>₹{(currentPrice * 0.978).toLocaleString('en-IN', { maximumFractionDigits: 1 })}</strong>
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      Trend: <strong style={{ color: '#10b981' }}>▲ Bullish (+{currentAssetRate}%)</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy / Invest in Stock Card (Simple, Clean, Proper) */}
              <div
                className="cyber-card"
                style={{
                  borderRadius: '20px',
                  padding: '16px 18px',
                  background: 'linear-gradient(150deg, rgba(14, 16, 28, 0.96), rgba(8, 10, 18, 0.98))',
                  border: '1.2px solid rgba(245, 158, 11, 0.35)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} color="#120a00" /> Buy {assetInfo.name || selectedAsset}
                    </h3>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Fixed Guaranteed Return on Maturity
                    </div>
                  </div>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.16)',
                      border: '1.2px solid #10b981',
                      color: '#34d399',
                      padding: '3px 9px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    +{currentAssetRate}% Return
                  </span>
                </div>

                {/* Available Wallet Balance Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Available Wallet Balance:</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
                    ₹{realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Investment Amount Input */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700 }}>
                      INVESTMENT AMOUNT (₹)
                    </label>
                    <span style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: 700 }}>
                      Min Limit: ₹{Math.max(1000, Number(assetInfo.minStake) || 1000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#fbbf24',
                        fontSize: '17px',
                        fontWeight: 800,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      min={Math.max(1000, Number(assetInfo.minStake) || 1000)}
                      step="500"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(1000, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1.5px solid rgba(245, 158, 11, 0.45)',
                        borderRadius: '10px',
                        padding: '10px 12px 10px 28px',
                        color: '#fff',
                        fontSize: '17px',
                        fontWeight: 800,
                        outline: 'none',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>

                  {/* Quick Preset Chips */}
                  <div className="bet-presets-grid" style={{ marginTop: '8px' }}>
                    {(() => {
                      const minReq = Math.max(1000, Number(assetInfo.minStake) || 1000);
                      const dynamicPresets = [minReq, minReq * 2, minReq * 5, 10000, 25000, 50000];
                      return dynamicPresets.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setBetAmount(amt)}
                          style={{
                            background: betAmount === amt ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${betAmount === amt ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '6px',
                            color: betAmount === amt ? '#fbbf24' : '#cbd5e1',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '5px 4px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          ₹{amt.toLocaleString('en-IN')}
                        </button>
                      ));
                    })()}
                  </div>
                </div>

                {/* Return Calculation Box */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(245, 158, 11, 0.09))',
                    border: '1.2px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8', marginBottom: '5px' }}>
                    <span>Amount Invested:</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>₹{betAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8', marginBottom: '5px' }}>
                    <span>Guaranteed Return Rate:</span>
                    <span style={{ color: '#fbbf24', fontWeight: 800 }}>+{currentAssetRate}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8', marginBottom: '8px' }}>
                    <span>Estimated Net Profit:</span>
                    <span style={{ color: '#10b981', fontWeight: 800 }}>
                      +₹{Math.round((betAmount * currentAssetRate) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13.5px',
                      fontWeight: 900,
                      color: '#fff',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '8px',
                    }}
                  >
                    <span>Total Return on Maturity:</span>
                    <span style={{ color: '#34d399', fontSize: '18px', fontFamily: 'monospace', fontWeight: 900 }}>
                      ₹{Math.round(betAmount + (betAmount * currentAssetRate) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: 1-Click Wallet Buy OR Scan & Pay QR */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  <button
                    disabled={!!activeTrade}
                    onClick={() => {
                      if (realBalance >= betAmount) {
                        handleStakeGrowth();
                      } else {
                        handleOpenPurchaseModal(assetInfo, 'wallet');
                      }
                    }}
                    style={{
                      width: '100%',
                      background: activeTrade
                        ? 'rgba(255, 255, 255, 0.08)'
                        : realBalance >= betAmount
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      color: activeTrade ? '#94a3b8' : '#ffffff',
                      cursor: activeTrade ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: activeTrade ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.35)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <span style={{ fontSize: '14.5px', fontWeight: 900 }}>
                      {activeTrade
                        ? `⏳ Plan Active • Maturing in ${activeTrade.timeLeft}s`
                        : realBalance >= betAmount
                        ? `1-Click Buy via Wallet (₹${betAmount.toLocaleString('en-IN')})`
                        : `Buy via Wallet (₹${betAmount.toLocaleString('en-IN')})`}
                    </span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, opacity: 0.9, marginTop: '2px' }}>
                      {activeTrade
                        ? `Earning +${activeTrade.adminPercent || currentAssetRate}% Guaranteed Profit...`
                        : realBalance >= betAmount
                        ? `Maturity Return: ₹${Math.round(betAmount + (betAmount * currentAssetRate) / 100).toLocaleString('en-IN')}`
                        : `Wallet balance low (₹${realBalance.toLocaleString('en-IN')}) • Click to top up`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPurchaseModal(assetInfo, 'qr')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(16, 185, 129, 0.18))',
                      border: '1.2px solid #fbbf24',
                      color: '#fbbf24',
                      borderRadius: '12px',
                      padding: '11px 14px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
                      transition: 'all 0.2s ease',
                    }}
                    title={`Scan company QR and pay directly for ${assetInfo.name}`}
                  >
                    <Smartphone size={15} color="#38bdf8" />
                    <span>Scan & Pay via {assetInfo.name || selectedAsset} QR Code</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Participants / Stakes Feed & User's History */}
            <div className="live-feed-grid">
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
                      Live Room Stakes
                    </h4>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Top stakes under ₹50,000 & Live returns
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Activity size={10} /> Real-Time
                    </span>
                  </span>
                </div>

                {/* Traders List (Stakes < ₹50,000) */}
                <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }} className="custom-scroll">
                  {activeRoomTraders.slice(0, 10).map((trader) => (
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
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: trader.isUser
                              ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                              : 'linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.28))',
                            border: trader.isUser ? '1.5px solid #fbbf24' : '1px solid rgba(56, 189, 248, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '10.5px',
                            color: trader.isUser ? '#000' : '#38bdf8',
                            flexShrink: 0,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {trader.isUser ? 'YOU' : (trader.name || 'TR').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
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

              {/* Card 2: Your Staking & Contract History */}
              <div style={{ marginTop: '4px' }}>
                {renderContractsHistorySection({
                  title: 'Your Staking & Contract History',
                  subtitle: 'Complete record of contracts taken in the Trading Arena with live settlement tracking.',
                })}
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
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Total Portfolio Valuation</span>
                <span
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
                >
                  {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                </span>
              </div>

              <div style={{ fontSize: 'clamp(28px, 6vw, 34px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: '14px' }}>
                {balanceVisible ? `₹ ${totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ ••••••••'}
              </div>

              {/* Dual Balance Tiles: Available Balance vs In Contract */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                {/* Available Balance Box */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '14px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    <span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: 700 }}>Available Balance</span>
                  </div>
                  <div style={{ fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                    {balanceVisible ? `₹${Number(realBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ ••••••'}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>
                    Ready for Trade & Bank Withdrawal
                  </div>
                </div>

                {/* In Contract Amount Box */}
                <div
                  style={{
                    background: activeContractAmount > 0 ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                    border: activeContractAmount > 0 ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <Zap size={11} color="#fbbf24" />
                    <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>In Contract Amount</span>
                  </div>
                  <div style={{ fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
                    {balanceVisible ? `₹${activeContractAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ ••••••'}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>
                    {activeContractsList.length > 0 ? `${activeContractsList.length} Active Growth Plan` : 'No Active Running Contract'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '3px 10px', borderRadius: '16px', marginBottom: '20px' }}>
                <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>
                  {userContracts.length} Total Contracts Taken • +₹{totalProfitEarned.toLocaleString('en-IN')} Profit Credited
                </span>
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
                { title: 'Invest', icon: <TrendingUp size={22} color="#10b981" />, action: () => setCurrentTab('market') },
                { title: 'Referral', icon: <Gift size={22} color="#fbbf24" />, action: () => setCurrentTab('profile') },
                { title: 'Support', icon: <Headphones size={22} color="#38bdf8" />, action: () => setActiveSettingModal('support') },
                { title: 'Trade Game', icon: <Zap size={22} color="#f59e0b" />, action: () => setCurrentTab('game') },
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

            {/* Guaranteed Growth Plan Banner matching Flutter HomeDashboardScreen */}
            <div
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1E1B2E 0%, #14151F 100%)',
                borderRadius: '18px',
                border: '1.2px solid rgba(251, 191, 36, 0.4)',
                boxShadow: '0 4px 18px rgba(251, 191, 36, 0.14)',
                padding: '16px 18px',
                boxSizing: 'border-box',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      background: 'rgba(251, 191, 36, 0.2)',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Zap size={16} color="#fbbf24" />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                    Guaranteed Growth Plan
                  </span>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#10b981',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  +{adminProfitPercent}% Fixed Return
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Stake smart on leading stocks & cryptos with zero liquidation risk. Capital and yields are 100% secured by Paynex Treasury.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setCurrentTab('market')}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Explore Plans →
                </button>
                <button
                  onClick={() => setCurrentTab('game')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Quick Stake
                </button>
              </div>
            </div>

            {/* My Contracts & Holdings History Section (All Contracts taken by user) */}
            {renderContractsHistorySection({
              title: 'My Active & Matured Contracts',
              subtitle: 'Live tracker of all contracts purchased, locked amount, guaranteed profit and credit status.',
            })}

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
                  { key: 'BTC/USDT', defaultSymbol: 'BTC', defaultName: 'Bitcoin', defaultPrice: 5524321, color: '#f7931a', icon: '₿' },
                  { key: 'ETH/USDT', defaultSymbol: 'ETH', defaultName: 'Ethereum', defaultPrice: 248762, color: '#627eea', icon: 'Ξ' },
                  { key: 'SOL/USDT', defaultSymbol: 'SOL', defaultName: 'Solana', defaultPrice: 12450, color: '#9945ff', icon: '◎' },
                  { key: 'BNB/USDT', defaultSymbol: 'BNB', defaultName: 'BNB', defaultPrice: 37820, color: '#f3ba2f', icon: 'bnb' },
                ].map((item) => {
                  const asset = resolveAsset(assetsMap, item.key) || resolveAsset(assetsMap, item.defaultSymbol);
                  const rate = asset?.returnPercent ?? currentAssetRate;
                  const displayName = asset?.name || item.defaultName;
                  const displaySymbol = asset?.symbol || item.defaultSymbol;
                  const displayPrice = asset?.basePrice
                    ? `₹ ${Number(asset.basePrice).toLocaleString('en-IN')}`
                    : `₹ ${Number(item.defaultPrice).toLocaleString('en-IN')}`;

                  return (
                    <div
                      key={item.defaultSymbol}
                      onClick={() => {
                        setSelectedAsset(asset?.symbol ? (asset.symbol.includes('/') ? asset.symbol : `${asset.symbol}/USDT`) : item.key);
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
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 900,
                            color: '#fff',
                          }}
                        >
                          <AssetIcon symbol={item.defaultSymbol} iconName={item.icon} category="Crypto" size={18} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{displayName}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{displaySymbol}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                          {displayPrice}
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            background: 'rgba(16, 185, 129, 0.18)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            color: '#10b981',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            display: 'inline-block',
                          }}
                        >
                          +{rate}% Guaranteed
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  {flt === 'Stock' ? 'Indian Stocks' : flt === 'Crypto' ? 'Crypto' : flt === 'Commodity' ? 'Commodity' : 'All Assets'}
                </button>
              ))}
            </div>

            <div className="market-assets-grid">
              {Object.entries(ASSETS)
                .filter(([sym, data]) => {
                  if (data.isEnabled === false) return false;
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
                        <AssetIcon symbol={coin.symbol} iconName={coin.icon} category={coin.category} size={18} color="#fff" />
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
                          <Smartphone size={14} color="#38bdf8" />
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
                          <Zap size={12} color="#120a00" />
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
        {/* TAB 3B: DEDICATED CONTRACTS & HOLDINGS TAB              */}
        {/* ======================================================== */}
        {currentTab === 'contracts' && (
          <div>
            {renderContractsHistorySection({
              title: 'All Contracts & Holdings History',
              subtitle: 'Comprehensive record of all active running contracts and settled investment returns with instant payout status.',
            })}
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
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Total Portfolio Net Balance</div>
              <div style={{ fontSize: 'clamp(28px, 7vw, 36px)', fontWeight: 900, color: '#fff', marginBottom: '14px' }}>
                ₹ {totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              {/* Sub-grid of Available Balance & In Contract */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px', textAlign: 'left' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '12px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={11} /> Available Balance</div>
                  <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                    ₹{Number(realBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>Ready for Instant Withdrawal</div>
                </div>

                <div style={{ background: activeContractAmount > 0 ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.04)', border: activeContractAmount > 0 ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={11} /> In Contract Amount</div>
                  <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
                    ₹{activeContractAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>{activeContractsList.length} Active Plan Running</div>
                </div>
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

            {/* Wallet History View Switcher (Transactions vs Contracts) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <button
                onClick={() => setWalletViewTab('transactions')}
                style={{
                  background: walletViewTab === 'transactions' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: walletViewTab === 'transactions' ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: walletViewTab === 'transactions' ? '#fbbf24' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: walletViewTab === 'transactions' ? 800 : 600,
                  cursor: 'pointer',
                }}
              >
                Transactions ({walletHistory.length})
              </button>
              <button
                onClick={() => setWalletViewTab('contracts')}
                style={{
                  background: walletViewTab === 'contracts' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: walletViewTab === 'contracts' ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: walletViewTab === 'contracts' ? '#fbbf24' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: walletViewTab === 'contracts' ? 800 : 600,
                  cursor: 'pointer',
                }}
              >
                Contracts History ({userContracts.length})
              </button>
            </div>

            {walletViewTab === 'contracts' ? (
              renderContractsHistorySection({
                title: 'Contracts Taken History',
                subtitle: 'History of all stakes and stock investment contracts placed from your wallet.',
              })
            ) : (
              <div>
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
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1f1d13, #11131c)',
                    color: '#fbbf24',
                    fontSize: '22px',
                    fontWeight: 900,
                  }}
                >
                  {(user?.name || 'T')[0].toUpperCase()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>
                    {user?.name || 'Trader'}
                  </span>
                  <span style={{ fontSize: '10px', background: '#fbbf24', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                    VIP 1
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {user?.email || 'trader@paynex.com'}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24' }}>
                  Referral Code: <span style={{ fontFamily: 'monospace', letterSpacing: '1px', color: '#fff', background: 'rgba(251, 191, 36, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>{user?.uid || 'TRD-782910'}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                  5% 1st Deposit Bonus
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 10px', lineHeight: 1.5 }}>
                Share your code with friends! When they register & make their <strong>1st deposit</strong>, you instantly earn <strong style={{ color: '#fbbf24' }}>5%</strong> of their deposit amount directly to your wallet.
              </p>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '12px', fontSize: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#94a3b8' }}>Total Referred: </span>
                  <strong style={{ color: '#fff' }}>{user?.referralCount || 0} Traders</strong>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#94a3b8' }}>Earned Bonus: </span>
                  <strong style={{ color: '#10b981' }}>₹{Number(user?.referralEarnings || 0).toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/?ref=${encodeURIComponent(user?.uid || '')}`;
                  navigator.clipboard?.writeText(link);
                  alert(`Referral link copied to clipboard!\n${link}`);
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
                { id: 'personal', title: 'Personal Information', icon: User, badge: null },
                { id: 'withdrawalPassword', title: 'Withdrawal Password (Fund PIN)', icon: Lock, badge: (user?.hasWithdrawalPassword || hasWithdrawalPass) ? 'Active' : 'Set PIN' },
                { id: 'changePassword', title: 'Change Login Password', icon: Key, badge: 'Protected' },
                { id: 'kyc', title: 'KYC Verification', icon: ShieldCheck, badge: 'Under Review' },
                { id: 'security', title: 'Security & 2FA Settings', icon: Lock, badge: 'Active' },
                { id: 'bank', title: 'Bank Account & UPI Details', icon: Landmark, badge: 'Verified' },
                { id: 'statement', title: 'Account Statement & Ledger', icon: FileText, badge: 'Records' },
                { id: 'support', title: 'Help & 24/7 Support', icon: Headphones, badge: '24x7 Live' },
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
                    <span style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}><m.icon size={18} /></span>
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
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {activeSettingModal === 'personal' && <User size={20} color="#fbbf24" />}
                    {activeSettingModal === 'withdrawalPassword' && <Lock size={20} color="#fbbf24" />}
                    {activeSettingModal === 'changePassword' && <Key size={20} color="#fbbf24" />}
                    {activeSettingModal === 'kyc' && <ShieldCheck size={20} color="#fbbf24" />}
                    {activeSettingModal === 'security' && <Lock size={20} color="#fbbf24" />}
                    {activeSettingModal === 'bank' && <Landmark size={20} color="#fbbf24" />}
                    {activeSettingModal === 'statement' && <FileText size={20} color="#fbbf24" />}
                    {activeSettingModal === 'support' && <Headphones size={20} color="#fbbf24" />}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', margin: 0 }}>
                    {activeSettingModal === 'personal' && 'Personal Information'}
                    {activeSettingModal === 'withdrawalPassword' && 'Withdrawal Password (Fund PIN)'}
                    {activeSettingModal === 'changePassword' && 'Change Account Login Password'}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
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
                          Verified
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
                      Save Changes
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
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                        <Check size={14} color="#000" strokeWidth={3} />
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#fff', fontWeight: 700 }}>ID Submitted</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fbbf24', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                        <Clock size={14} color="#000" />
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
                        <ShieldCheck size={20} color="#38bdf8" />
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Aadhaar Card (Front & Back)</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Number: •••• •••• 6789</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        Uploaded
                      </span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="#38bdf8" />
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
                    Re-upload / Update ID Documents
                  </button>
                  <p style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center', margin: '10px 0 0' }}>
                    256-Bit SSL Encrypted. Documents are stored compliant with Government PMLA rules.
                  </p>
                </div>
              )}

              {/* 3. WITHDRAWAL PASSWORD / FUND PIN MODAL */}
              {activeSettingModal === 'withdrawalPassword' && (
                <div>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(16, 185, 129, 0.08))',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} color="#fbbf24" /> Fund Protection PIN
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: (user?.hasWithdrawalPassword || hasWithdrawalPass) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                          color: (user?.hasWithdrawalPassword || hasWithdrawalPass) ? '#10b981' : '#fbbf24',
                          border: `1px solid ${(user?.hasWithdrawalPassword || hasWithdrawalPass) ? '#10b981' : '#fbbf24'}`,
                        }}
                      >
                        {(user?.hasWithdrawalPassword || hasWithdrawalPass) ? '● ACTIVE (CONFIGURED)' : '○ NOT CONFIGURED'}
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      {(user?.hasWithdrawalPassword || hasWithdrawalPass)
                        ? 'Your withdrawal password is required whenever you request a payout. You can update your fund PIN below.'
                        : 'Create a secret 4 to 12 digit Fund Password / PIN. This PIN will be required every time you withdraw funds to keep your balance 100% secure.'}
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!withdrawPassForm.newPass || withdrawPassForm.newPass.length < 4) {
                        showUserWarning('PIN Too Short', 'Withdrawal password / PIN must be at least 4 digits or characters.');
                        return;
                      }
                      if (withdrawPassForm.newPass !== withdrawPassForm.confirm) {
                        showUserWarning('Mismatch', 'New withdrawal password and confirmation do not match.');
                        return;
                      }
                      setWithdrawPassSubmitting(true);
                      try {
                        await userApi.updateProfile({
                          withdrawalPassword: withdrawPassForm.newPass,
                          currentWithdrawalPassword: withdrawPassForm.current || undefined,
                        });
                        setHasWithdrawalPass(true);
                        localStorage.setItem('paynex_has_withdrawal_pin', 'true');
                        setWithdrawPassForm({ current: '', newPass: '', confirm: '' });
                        showUserSuccess('Withdrawal Password Saved!', 'Your fund withdrawal password has been successfully saved & encrypted.');
                        setActiveSettingModal(null);
                      } catch (err) {
                        showUserError('Update Failed', err.response?.data?.message || err.message || 'Failed to update withdrawal password.');
                      } finally {
                        setWithdrawPassSubmitting(false);
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    {(user?.hasWithdrawalPassword || hasWithdrawalPass) && (
                      <div>
                        <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                          Current Withdrawal Password / PIN
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showWithdrawPassCurrent ? 'text' : 'password'}
                            placeholder="Enter current PIN"
                            value={withdrawPassForm.current}
                            onChange={(e) => setWithdrawPassForm({ ...withdrawPassForm, current: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'rgba(0, 0, 0, 0.45)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '10px',
                              padding: '10px 42px 10px 12px',
                              color: '#fff',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowWithdrawPassCurrent(!showWithdrawPassCurrent)}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              fontSize: '14px',
                            }}
                          >
                            {showWithdrawPassCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                        {(user?.hasWithdrawalPassword || hasWithdrawalPass) ? 'New Withdrawal Password / PIN *' : 'Create Withdrawal Password / PIN *'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showWithdrawPassNew ? 'text' : 'password'}
                          required
                          placeholder="Enter 4 to 12 digits/characters"
                          value={withdrawPassForm.newPass}
                          onChange={(e) => setWithdrawPassForm({ ...withdrawPassForm, newPass: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.45)',
                            border: '1px solid rgba(251, 191, 36, 0.4)',
                            borderRadius: '10px',
                            padding: '10px 42px 10px 12px',
                            color: '#fff',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowWithdrawPassNew(!showWithdrawPassNew)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          {showWithdrawPassNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                        Confirm Withdrawal Password / PIN *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter new withdrawal PIN"
                        value={withdrawPassForm.confirm}
                        onChange={(e) => setWithdrawPassForm({ ...withdrawPassForm, confirm: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.45)',
                          border: withdrawPassForm.confirm && withdrawPassForm.newPass !== withdrawPassForm.confirm
                            ? '1px solid #ef4444'
                            : '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                      {withdrawPassForm.confirm && withdrawPassForm.newPass !== withdrawPassForm.confirm && (
                        <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>PIN does not match</div>
                      )}
                      {withdrawPassForm.confirm && withdrawPassForm.newPass === withdrawPassForm.confirm && (
                        <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> PIN matches perfectly</div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setActiveSettingModal(null)}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '11px',
                          color: '#94a3b8',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={withdrawPassSubmitting}
                        className="btn-cyber-primary"
                        style={{
                          flex: 2,
                          padding: '11px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          cursor: withdrawPassSubmitting ? 'not-allowed' : 'pointer',
                          opacity: withdrawPassSubmitting ? 0.7 : 1,
                        }}
                      >
                        {withdrawPassSubmitting ? 'Saving PIN...' : (user?.hasWithdrawalPassword || hasWithdrawalPass ? 'Update Withdrawal PIN' : 'Save Withdrawal PIN')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 4. CHANGE LOGIN PASSWORD MODAL */}
              {activeSettingModal === 'changePassword' && (
                <div>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#60a5fa', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={16} color="#fbbf24" /> Account Login Security
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      Change the password used to sign in to your PAYNEX trading account. Strong passwords should have at least 6 characters including letters and numbers.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!passForm.newPass || passForm.newPass.length < 6) {
                        showUserWarning('Password Too Short', 'New password must be at least 6 characters long.');
                        return;
                      }
                      if (passForm.newPass !== passForm.confirm) {
                        showUserWarning('Mismatch', 'New password and confirmation do not match.');
                        return;
                      }
                      setPassSubmitting(true);
                      try {
                        await userApi.updateProfile({
                          password: passForm.newPass,
                          currentPassword: passForm.current || undefined,
                        });
                        setPassForm({ current: '', newPass: '', confirm: '' });
                        showUserSuccess('Login Password Changed!', 'Your login password has been updated successfully. Please use this new password next time you sign in.');
                        setActiveSettingModal(null);
                      } catch (err) {
                        showUserError('Password Error', err.response?.data?.message || err.message || 'Failed to update login password.');
                      } finally {
                        setPassSubmitting(false);
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <div>
                      <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                        Current Login Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassCurrent ? 'text' : 'password'}
                          required
                          placeholder="Enter your current login password"
                          value={passForm.current}
                          onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.45)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            padding: '10px 42px 10px 12px',
                            color: '#fff',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassCurrent(!showPassCurrent)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          {showPassCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                        New Login Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassNew ? 'text' : 'password'}
                          required
                          placeholder="At least 6 characters"
                          value={passForm.newPass}
                          onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.45)',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            borderRadius: '10px',
                            padding: '10px 42px 10px 12px',
                            color: '#fff',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassNew(!showPassNew)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          {showPassNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                        Confirm New Login Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter new password"
                        value={passForm.confirm}
                        onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.45)',
                          border: passForm.confirm && passForm.newPass !== passForm.confirm
                            ? '1px solid #ef4444'
                            : '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                      {passForm.confirm && passForm.newPass !== passForm.confirm && (
                        <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>Passwords do not match</div>
                      )}
                      {passForm.confirm && passForm.newPass === passForm.confirm && (
                        <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Passwords match</div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setActiveSettingModal(null)}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '11px',
                          color: '#94a3b8',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={passSubmitting}
                        className="btn-cyber-primary"
                        style={{
                          flex: 2,
                          padding: '11px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          cursor: passSubmitting ? 'not-allowed' : 'pointer',
                          opacity: passSubmitting ? 0.7 : 1,
                        }}
                      >
                        {passSubmitting ? 'Updating Password...' : 'Save New Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 5. SECURITY & 2FA SETTINGS MODAL */}
              {activeSettingModal === 'security' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {/* Quick Access to Passwords */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div
                        onClick={() => setActiveSettingModal('withdrawalPassword')}
                        style={{
                          background: 'rgba(251, 191, 36, 0.08)',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                          borderRadius: '10px',
                          padding: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}><Lock size={18} color="#fbbf24" /></div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24' }}>Withdrawal PIN</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Create/change fund PIN</div>
                      </div>
                      <div
                        onClick={() => setActiveSettingModal('changePassword')}
                        style={{
                          background: 'rgba(59, 130, 246, 0.08)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '10px',
                          padding: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}><Key size={18} color="#fbbf24" /></div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#60a5fa' }}>Login Password</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Change account password</div>
                      </div>
                    </div>

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
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Landmark size={16} color="#fbbf24" /> {bankAccount.bankName}</span>
                        <span style={{ fontSize: '10px', background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>
                          VERIFIED PRIMARY
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>A/C Holder: <strong style={{ color: '#fff' }}>{bankAccount.holderName}</strong></div>
                      <div style={{ fontSize: '13px', color: '#fff', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '1px', margin: '4px 0' }}>
                        •••• •••• •••• {bankAccount.accountNumber.slice(-4)}
                      </div>
                    </div>
                  </div>

                  {/* Edit / Add Bank Details */}
                  {!isEditingBank ? (
                    <button
                      onClick={() => setIsEditingBank(true)}
                      className="btn-cyber-outline"
                      style={{ width: '100%', padding: '11px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Edit or Change Bank Account Details
                    </button>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#fbbf24', marginBottom: '8px' }}>
                        Update Bank Account (Account No & IFSC)
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
                      Download PDF
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }} className="custom-scroll">
                    {[
                      { id: 'tx_st_1', type: 'Deposit', amount: '+₹10,000', time: 'Today, 02:15 PM', status: 'Success', mode: 'UPI' },
                      { id: 'tx_st_2', type: 'Staking Return (+12%)', amount: '+₹6,500', time: 'Today, 11:40 AM', status: 'Credited', mode: 'BTC/USDT' },
                      { id: 'tx_st_3', type: 'Withdrawal', amount: '-₹5,000', time: 'Yesterday, 06:10 PM', status: 'Completed', mode: 'IMPS' },
                      { id: 'tx_st_4', type: 'Staking Return (+10%)', amount: '+₹3,250', time: 'Yesterday, 02:30 PM', status: 'Credited', mode: 'ETH/USDT' },
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
                  {/* Top Mode Selector Tabs */}
                  <div
                    style={{
                      display: 'flex',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '4px',
                      borderRadius: '12px',
                      marginBottom: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      gap: '4px',
                    }}
                  >
                    <button
                      onClick={() => setSupportTab('chat')}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '9px',
                        border: 'none',
                        background: supportTab === 'chat' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                        color: supportTab === 'chat' ? '#000' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Bot size={15} color="#38bdf8" />
                      <span>Live AI Chat</span>
                      <span
                        style={{
                          background: supportTab === 'chat' ? '#000' : '#10b981',
                          color: supportTab === 'chat' ? '#fbbf24' : '#fff',
                          fontSize: '9px',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: '10px',
                        }}
                      >
                        24/7
                      </span>
                    </button>

                    <button
                      onClick={() => setSupportTab('help')}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '9px',
                        border: 'none',
                        background: supportTab === 'help' ? 'linear-gradient(135deg, #38bdf8, #2563eb)' : 'transparent',
                        color: supportTab === 'help' ? '#fff' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <FileText size={14} color="#38bdf8" />
                      <span>Helpline & FAQs</span>
                    </button>
                  </div>

                  {supportTab === 'chat' ? (
                    <div>
                      {/* Security Header Banner */}
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '10px',
                          padding: '7px 12px',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                          color: '#6ee7b7',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                          <strong style={{ color: '#fff' }}>PAYNEX Neural AI Agent</strong>
                          <span>• Instant reply</span>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '10px' }}>Real-time 24/7 Desk</span>
                      </div>

                      {/* Chat Messages Container */}
                      <div
                        style={{
                          height: '320px',
                          overflowY: 'auto',
                          background: 'rgba(10, 11, 18, 0.85)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        {chatLoading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '12px' }}>
                            <span>Connecting to PAYNEX AI Desk...</span>
                          </div>
                        ) : chatMessages.length === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><Bot size={32} color="#38bdf8" /></div>
                            <div style={{ color: '#fff', fontWeight: 700, marginBottom: '4px' }}>PAYNEX Live AI Support</div>
                            <div>Poochhiye koi bhi sawaal (Deposit, Withdrawal, KYC, Trading Rules) in Hindi ya English.</div>
                          </div>
                        ) : (
                          chatMessages.map((msg, idx) => {
                            const isUser = msg.sender === 'user';
                            const isAdmin = msg.sender === 'admin';
                            const timeStr = msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '';
                            return (
                              <div
                                key={idx}
                                style={{
                                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                                  maxWidth: '85%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: isUser ? 'flex-end' : 'flex-start',
                                }}
                              >
                                {!isUser && (
                                  <div style={{ fontSize: '10px', fontWeight: 800, color: isAdmin ? '#818cf8' : '#fbbf24', marginBottom: '3px', paddingLeft: '4px' }}>
                                    {isAdmin ? 'Admin Support' : 'PAYNEX AI Agent'}
                                  </div>
                                )}
                                <div
                                  style={{
                                    background: isUser
                                      ? 'linear-gradient(135deg, #d97706, #b45309)'
                                      : isAdmin
                                      ? '#1e1b4b'
                                      : '#141522',
                                    border: isUser
                                      ? '1px solid rgba(251, 191, 36, 0.4)'
                                      : isAdmin
                                      ? '1px solid rgba(99, 102, 241, 0.4)'
                                      : '1px solid rgba(245, 158, 11, 0.25)',
                                    color: '#fff',
                                    padding: '10px 13px',
                                    borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    fontSize: '12.5px',
                                    lineHeight: 1.45,
                                    whiteSpace: 'pre-line',
                                    boxShadow: isUser ? '0 4px 15px rgba(217, 119, 6, 0.25)' : 'none',
                                  }}
                                >
                                  {msg.text}
                                </div>
                                {timeStr && (
                                  <span style={{ fontSize: '9.5px', color: '#64748b', marginTop: '3px', paddingRight: isUser ? '4px' : 0, paddingLeft: !isUser ? '4px' : 0 }}>
                                    {timeStr}
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}

                        {isAiTyping && (
                          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: '#141522', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '8px 12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                            <span style={{ fontSize: '11px', color: '#fbbf24', fontStyle: 'italic' }}>PAYNEX AI is typing...</span>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Quick Prompt Suggestion Chips */}
                      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '8px' }}>
                        {[
                          'Deposit nahi aaya',
                          'Withdrawal kab aayega?',
                          'Password reset',
                          'KYC verification',
                          '30% Return rules',
                        ].map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendChat(prompt)}
                            disabled={isAiTyping}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: '16px',
                              padding: '5px 10px',
                              color: '#e2e8f0',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#fbbf24';
                              e.currentTarget.style.color = '#fbbf24';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                              e.currentTarget.style.color = '#e2e8f0';
                            }}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>

                      {/* Chat Input Bar */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendChat();
                        }}
                        style={{ display: 'flex', gap: '8px' }}
                      >
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your query (Hindi ya English)..."
                          disabled={isAiTyping}
                          style={{
                            flex: 1,
                            background: '#141520',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '12px',
                            padding: '11px 14px',
                            color: '#fff',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#fbbf24')}
                          onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                        />
                        <button
                          type="submit"
                          disabled={isAiTyping || !chatInput.trim()}
                          style={{
                            background: isAiTyping || !chatInput.trim()
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0 18px',
                            color: isAiTyping || !chatInput.trim() ? '#64748b' : '#000',
                            fontWeight: 800,
                            fontSize: '13px',
                            cursor: isAiTyping || !chatInput.trim() ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: !isAiTyping && chatInput.trim() ? '0 4px 15px rgba(245, 158, 11, 0.35)' : 'none',
                          }}
                        >
                          <span>Send</span>
                          <Send size={14} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      {/* Help & Escalation Tab Content */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                        <button
                          onClick={() => window.open('mailto:support@paynex.com', '_blank')}
                          style={{
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15))',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            borderRadius: '12px',
                            padding: '12px 10px',
                            color: '#fff',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}><Mail size={20} color="#38bdf8" /></div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>Email Support</div>
                          <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Direct Desk Assistance</div>
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
                          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}><Send size={20} color="#38bdf8" /></div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>Telegram Official</div>
                          <div style={{ fontSize: '10px', color: '#cbd5e1' }}>24x7 Community channel</div>
                        </button>
                      </div>

                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Phone size={14} color="#38bdf8" />
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Toll-Free Helpline:</span>
                          <strong style={{ color: '#fbbf24', fontSize: '13px', fontFamily: 'monospace' }}>1800 234 5678</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={14} color="#38bdf8" />
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Official Email:</span>
                          <strong style={{ color: '#38bdf8', fontSize: '12px' }}>support@paynex.com</strong>
                        </div>
                      </div>

                      {/* FAQs List */}
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', marginBottom: '8px' }}>
                        Frequently Asked Questions
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                          { q: 'How fast are withdrawals processed?', a: 'Withdrawals are processed instantly through IMPS/UPI rails within 2 to 15 minutes.' },
                          { q: 'How is the fixed 2% - 12% return credited?', a: 'Upon maturity of your active round duration (e.g. 15s or 30s), your stake plus fixed profit (2% to 12%) is directly added to your real balance.' },
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
            <CheckCircle2 size={14} color="#10b981" /> <span>{toastMessage}</span>
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
                <Sparkles size={28} color="#10b981" />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
                PLAN MATURED SUCCESSFULLY!
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
      <nav className="portal-bottom-nav">
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
            { id: 'home', label: 'Home', icon: <Home size={19} /> },
            { id: 'market', label: 'Market', icon: <TrendingUp size={19} /> },
            { id: 'game', label: 'Trade Game', icon: <Zap size={19} /> },
            { id: 'contracts', label: 'Contracts', icon: <FileText size={19} /> },
            { id: 'wallet', label: 'Wallet', icon: <Wallet size={19} /> },
            { id: 'profile', label: 'Profile', icon: <User size={19} /> },
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
                  <AssetIcon symbol={purchaseModalAsset.symbol} iconName={purchaseModalAsset.icon} category={purchaseModalAsset.category} size={20} color="#fff" />
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Investment Amount Input & Chips */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                  INVESTMENT AMOUNT (Min ₹{Math.max(1000, Number(purchaseModalAsset.minStake) || 1000).toLocaleString('en-IN')})
                </label>
                <span style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 700 }}>
                  Wallet Balance: ₹{realBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <input
                type="number"
                min={Math.max(1000, Number(purchaseModalAsset.minStake) || 1000)}
                step="500"
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
                {[
                  Math.max(1000, Number(purchaseModalAsset.minStake) || 1000),
                  Math.max(1000, Number(purchaseModalAsset.minStake) || 1000) * 2,
                  Math.max(1000, Number(purchaseModalAsset.minStake) || 1000) * 5,
                  10000,
                  25000,
                  50000,
                ].filter((v, i, a) => a.indexOf(v) === i).map((amt) => (
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
                  <Smartphone size={14} color="#38bdf8" />
                  <span>UPI / QR Code</span>
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
                  <Wallet size={14} color="#10b981" />
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
                    src={getCompanyQrUrl(purchaseModalAsset, purchaseAmount)}
                    alt={`${purchaseModalAsset.name} Payment QR`}
                    style={{ width: '150px', height: '150px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#000', marginTop: '6px' }}>
                    Scan with PhonePe / GPay / Paytm
                  </div>
                </div>

                {/* Direct QR Scanner Security Notice */}
                <div
                  style={{
                    background: 'rgba(251, 191, 36, 0.06)',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Lock size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    <strong style={{ color: '#fbbf24' }}>Real Payment Security:</strong> Scan the QR code above with any UPI app (PhonePe, GPay, Paytm). Complete the real payment and enter the 12-digit UTR reference number from your bank receipt. Fake submissions are automatically rejected.
                  </div>
                </div>

                {/* 1-Tap UPI Apps Shortcut */}
                {purchaseModalAsset.upiId && (
                  <div>
                    <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, marginBottom: '5px' }}>
                      ⚡ Pay Directly via UPI App (1-Tap):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      <a
                        href={`phonepe://pay?pa=${encodeURIComponent(purchaseModalAsset.upiId)}&pn=${encodeURIComponent(purchaseModalAsset.name)}&am=${purchaseAmount}&cu=INR`}
                        style={{ padding: '7px 4px', background: '#5f259f', borderRadius: '6px', color: '#fff', fontSize: '10.5px', fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}
                      >
                        PhonePe
                      </a>
                      <a
                        href={`gpay://upi/pay?pa=${encodeURIComponent(purchaseModalAsset.upiId)}&pn=${encodeURIComponent(purchaseModalAsset.name)}&am=${purchaseAmount}&cu=INR`}
                        style={{ padding: '7px 4px', background: '#1a73e8', borderRadius: '6px', color: '#fff', fontSize: '10.5px', fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}
                      >
                        Google Pay
                      </a>
                      <a
                        href={`paytmmp://pay?pa=${encodeURIComponent(purchaseModalAsset.upiId)}&pn=${encodeURIComponent(purchaseModalAsset.name)}&am=${purchaseAmount}&cu=INR`}
                        style={{ padding: '7px 4px', background: '#00baf2', borderRadius: '6px', color: '#fff', fontSize: '10.5px', fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}
                      >
                        Paytm
                      </a>
                      <a
                        href={`upi://pay?pa=${encodeURIComponent(purchaseModalAsset.upiId)}&pn=${encodeURIComponent(purchaseModalAsset.name)}&am=${purchaseAmount}&cu=INR`}
                        style={{ padding: '7px 4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#fbbf24', fontSize: '10.5px', fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}
                      >
                        Any UPI
                      </a>
                    </div>
                  </div>
                )}

                {/* 12-Digit UTR Input (No Fake Auto-Fill) */}
                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Enter 12-Digit NPCI UTR / Transaction Reference ID *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 423985123490 (from PhonePe / GPay receipt)"
                    value={purchaseUtr}
                    maxLength={16}
                    onChange={(e) => setPurchaseUtr(e.target.value.replace(/\D/g, ''))}
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
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                    12-digit reference number found on your successful bank / UPI payment receipt.
                  </div>
                </div>

                {/* Payment Screenshot Proof (Optional / Recommended) */}
                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Attach Payment Screenshot Proof (Recommended):
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(251, 191, 36, 0.4)',
                      color: purchaseScreenshotName ? '#34d399' : '#cbd5e1',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span>📷 {purchaseScreenshotName || 'Upload Screenshot (PNG / JPG)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePurchaseScreenshotUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
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
                    ? '⏳ Submitting Real Payment Proof...'
                    : 'Submit Real Payment Proof (Admin Verification)'}
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
                      Insufficient balance. Please switch to "Pay via {purchaseModalAsset.name} QR Code" above.
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
                  Pay ₹{Number(purchaseAmount || 0).toLocaleString('en-IN')} from Wallet & Start Stake
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
