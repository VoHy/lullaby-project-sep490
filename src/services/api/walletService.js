import { createService } from './serviceFactory';

// Tạo base service với factory
const baseWalletService = createService('wallet', 'Wallet', true);

// Utility function để lấy walletID một cách nhất quán
const getWalletId = (wallet) => {
  return wallet?.walletID || wallet?.WalletID;
};

// Thêm method đặc biệt
const walletService = {
  // Base CRUD methods từ factory
  ...baseWalletService,

  // Get all wallets
  getAllWallets: async () => {
    const res = await fetch('/api/wallet/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách wallets');
    return data;
  },

  // Get wallet by ID
  getWalletById: async (walletId) => {
    const res = await fetch(`/api/wallet/${walletId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin wallet');
    return data;
  },

  // Create wallet for account
  createWallet: async (accountId) => {
    const res = await fetch(`/api/wallet/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body as per API spec
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo wallet thất bại');
    return data;
  },

  // Delete wallet
  deleteWallet: async (walletId) => {
    const res = await fetch(`/api/wallet/${walletId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa wallet thất bại');
    return data;
  },

  // Update wallet note
  updateWalletNote: async (walletId, noteData) => {
    const res = await fetch(`/api/wallet/updatenote/${walletId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật ghi chú wallet thất bại');
    return data;
  },

  // Update wallet amount
  updateWalletAmount: async (walletId, amountData) => {
    const res = await fetch(`/api/wallet/updateamount/${walletId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(amountData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật số tiền wallet thất bại');
    return data;
  },

  // Activate wallet
  activateWallet: async (walletId) => {
    const res = await fetch(`/api/wallet/active/${walletId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Kích hoạt wallet thất bại');
    return data;
  },

  // Deactivate wallet
  deactivateWallet: async (walletId) => {
    const res = await fetch(`/api/wallet/inactive/${walletId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Vô hiệu hóa wallet thất bại');
    return data;
  },

  // Get wallet by account ID
  getWalletByAccountId: async (accountId) => {
    const wallets = await walletService.getAllWallets();
    return wallets.find(wallet => 
      (wallet.accountID === accountId) || (wallet.AccountID === accountId)
    );
  }
};

export default walletService; 