const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://paynex-backend-hsit.onrender.com/api';

/**
 * Universal request wrapper for User Panel with JWT Bearer auth
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('paynex_user_token');
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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`User API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const userApi = {
  // Auth
  register: async (name, email, phone, password) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
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

  getMe: () => request('/auth/me'),
  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Wallet
  getWalletHistory: () => request('/wallet/history'),
  submitDeposit: (amount, method, utr, screenshotUrl = '') =>
    request('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, method, utr, screenshotUrl }),
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
  getMyStakes: () => request('/staking/my-rounds'),
  getLivePool: () => request('/staking/live-pool'),

  // Dynamic Stocks & Game Assets
  getAssets: () => request('/assets'),

  // Investment Plans
  getPlans: () => request('/plans'),
  subscribePlan: (planId) =>
    request('/plans/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
};

export default userApi;
