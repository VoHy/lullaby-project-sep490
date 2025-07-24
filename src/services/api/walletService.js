import wallets from '../../mock/Wallet';
import walletHistories from '../../mock/WalletHistory';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const walletService = {
  getWallets: async () => {
    if (USE_MOCK) {
      return Promise.resolve(wallets);
    }
    const res = await fetch('/api/wallets');
    return res.json();
  },
  getWalletById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(wallets.find(w => w.WalletID === id));
    }
    const res = await fetch(`/api/wallets/${id}`);
    return res.json();
  },
  getWalletHistories: async (walletId) => {
    if (USE_MOCK) {
      return Promise.resolve(walletHistories.filter(h => h.WalletID === walletId));
    }
    const res = await fetch(`/api/wallets/${walletId}/histories`);
    return res.json();
  },
  createWallet: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, WalletID: wallets.length + 1 });
    }
    const res = await fetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateWallet: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...wallets.find(w => w.WalletID === id), ...data });
    }
    const res = await fetch(`/api/wallets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteWallet: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/wallets/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default walletService; 