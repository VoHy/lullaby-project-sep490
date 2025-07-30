const walletHistoryService = {
  getWalletHistories: async () => {
    const res = await fetch('/api/WalletHistory');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách wallet histories');
    return data;
  },
  getWalletHistoryById: async (id) => {
    const res = await fetch(`/api/WalletHistory/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin wallet history');
    return data;
  },
  createWalletHistory: async (data) => {
    const res = await fetch('/api/WalletHistory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo wallet history thất bại');
    return result;
  },
  updateWalletHistory: async (id, data) => {
    const res = await fetch(`/api/WalletHistory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật wallet history thất bại');
    return result;
  },
  deleteWalletHistory: async (id) => {
    const res = await fetch(`/api/WalletHistory/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa wallet history thất bại');
    return result;
  }
};

export default walletHistoryService; 