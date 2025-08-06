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
    try {
      const res = await fetch('/api/wallet/getall', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Không thể lấy danh sách wallets');
      }
      return data;
    } catch (error) {
      throw error;
    }
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
    const res = await fetch(`/api/wallet/create/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body as per API spec
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo wallet thất bại');
    return data;
  },

  // Update wallet amount
  updateWalletAmount: async (walletId, newAmount) => {
    const res = await fetch(`/api/wallet/updateamount/${walletId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: newAmount })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật số dư wallet');
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
    try {
      console.log('🔍 WalletService: Gọi API lấy ví cho accountID:', accountId);
      const res = await fetch(`/api/wallet/getall`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          console.log('🔍 WalletService: Không tìm thấy ví cho accountID:', accountId);
          return null;
        }
        const errorData = await res.json();
        throw new Error(errorData.error || 'Không thể lấy thông tin ví');
      }
      
      const wallet = await res.json();
      console.log('🔍 WalletService: Ví tìm thấy:', wallet);
      return wallet;
    } catch (error) {
      console.error('�� WalletService: Lỗi lấy ví:', error);
      throw error;
    }
  }
};

export default walletService; 