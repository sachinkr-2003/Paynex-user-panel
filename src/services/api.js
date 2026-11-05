const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://paynex-backend-hsit.onrender.com/api';
import { generateRealisticCandles } from '../utils/chartDataGenerator';

/**
 * Universal request wrapper for User Panel with JWT Bearer auth
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('paynex_user_token') || localStorage.getItem('paynex_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error(`Server is offline (${response.status} Bad Gateway). Please check back shortly.`);
    }

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server returned unexpected response (${response.status}): ${text.slice(0, 100)}`);
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to Paynex server. Please verify your connection.');
    }
    console.error(`User API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const userApi = {
  // Auth
  register: async (name, email, phone, password, referralCode) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, referralCode }),
    });
    if (res.token) {
      localStorage.setItem('paynex_user_token', res.token);
    }
    return res;
  },

  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('paynex_user_token', res.token);
    }
    return res;
  },

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyResetOtp: (email, otp) =>
    request('/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  resetPassword: (email, otp, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    }),

  getMe: () => request('/auth/me'),
  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Wallet & Payment Gateway
  getWalletHistory: () => request('/wallet/history'),
  submitDeposit: (amount, method, utr, screenshotUrl = '', extraData = {}) =>
    request('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, method, utr, screenshotUrl, ...extraData }),
    }),
  initiateGatewayOrder: (amount, companyId = '', companyName = '', companyUpi = '', qrCode = '') =>
    request('/gateway/initiate', {
      method: 'POST',
      body: JSON.stringify({ amount, companyId, companyName, companyUpi, qrCode }),
    }),
  getGatewayOrder: (transactionId) => request(`/gateway/orders/${transactionId}`),
  submitGatewayUtr: (transactionId, utr, screenshotProof = '') =>
    request(`/gateway/orders/${transactionId}/submit-utr`, {
      method: 'POST',
      body: JSON.stringify({ utr, screenshotProof }),
    }),
  submitWithdrawal: (withdrawalData) =>
    request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    }),

  // Staking & Fixed Returns (+30%)
  getStakingRate: () => request('/staking/rate'),
  placeStake: (amount, asset = 'BTC/USDT', planId = null) =>
    request('/staking/place', {
      method: 'POST',
      body: JSON.stringify({ amount, asset, planId }),
    }),
  settleStake: (roundId) =>
    request(`/staking/settle/${roundId}`, {
      method: 'POST',
    }),
  exitStake: (roundId) =>
    request(`/staking/exit/${roundId}`, {
      method: 'POST',
    }),
  topUpStake: (roundId, amount) =>
    request(`/staking/topup/${roundId}`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  getMyStakes: () => request('/staking/my-rounds'),
  getLivePool: () => request('/staking/live-pool'),

  // Dynamic Stocks & Game Assets
  getAssets: () => request('/assets'),
  
  // Dedicated Single QR APIs
  getQrAll: () => request('/qr'),
  getGroupQr: (group) => request(`/qr/${group}?format=json`),
  
  // Dedicated Single Interest APIs
  getInterestAll: () => request('/interest'),
  getGroupInterest: (group) => request(`/interest/${group}`),
  
  // Dedicated Groups APIs
  getAllGroups: () => request('/groups'),
  getSingleGroup: (group) => request(`/groups/${group}`),

  // Live Real-Time Market Chart & Quotes (White-Label Groww-Style)
  getMarketChart: async (symbol, timeframe = '1D', fallbackBase = 1000) => {
    const rawClean = String(symbol || '').trim();
    const cleanUpper = rawClean.toUpperCase();
    const isCrypto =
      cleanUpper.includes('BTC') ||
      cleanUpper.includes('ETH') ||
      cleanUpper.includes('SOL') ||
      cleanUpper.includes('BNB') ||
      cleanUpper.includes('USDT') ||
      cleanUpper.includes('XRP') ||
      cleanUpper.includes('DOGE');

    // 1. Direct Binance public Kline + Ticker API for Crypto (100% CORS-friendly, zero server lag)
    if (isCrypto) {
      const stripped = cleanUpper.replace('/', '').replace('-', '');
      const pair = stripped.includes('USDT') ? stripped : `${stripped}USDT`;
      try {
        const [tickerRes, klinesRes] = await Promise.all([
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=5m&limit=60`).then((r) => (r.ok ? r.json() : null)),
        ]);
        if (tickerRes && klinesRes && Array.isArray(klinesRes) && klinesRes.length > 0) {
          const p = Number(tickerRes.lastPrice);
          const ch = Number(tickerRes.priceChange);
          const candles = klinesRes.map((k) => {
            const d = new Date(Number(k[0]));
            return {
              timestamp: Number(k[0]),
              time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
              open: Number(Number(k[1]).toFixed(2)),
              high: Number(Number(k[2]).toFixed(2)),
              low: Number(Number(k[3]).toFixed(2)),
              close: Number(Number(k[4]).toFixed(2)),
              volume: Number(k[5]),
            };
          });
          return {
            success: true,
            symbol,
            currentPrice: p,
            previousClose: Number(tickerRes.prevClosePrice) || p,
            change: ch,
            changePercent: Number(tickerRes.priceChangePercent) || 0,
            isPositive: ch >= 0,
            high: Number(tickerRes.highPrice) || p,
            low: Number(tickerRes.lowPrice) || p,
            open: Number(tickerRes.openPrice) || p,
            volume: Number(tickerRes.volume) || 0,
            currency: 'USDT',
            source: 'live',
            candles,
          };
        }
      } catch (_) {}
    }

    // 2. For Indian Stocks: Try backend service (safely encoding parameter without path slashes)
    try {
      const safeParam = encodeURIComponent(rawClean.replace('/', '-'));
      const res = await request(`/assets/market-chart/${safeParam}?timeframe=${encodeURIComponent(timeframe)}`);
      if (res && res.currentPrice && Array.isArray(res.candles) && res.candles.length > 0) {
        return { ...res, source: 'live' };
      }
    } catch (_) {}

    // 3. Fallback: Return complete, realistic synthesized candle set (100% resilient, zero network crash)
    return generateRealisticCandles(fallbackBase, symbol, timeframe, 60);
  },

  // Investment Plans
  getPlans: () => request('/plans'),
  subscribePlan: (planId) =>
    request('/plans/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),

  // AI Live Support Chat
  getMyChat: () => request('/chat/my-chat'),
  sendChatMessage: (text, chatId = null) =>
    request('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ text, chatId }),
    }),
};

export default userApi;
