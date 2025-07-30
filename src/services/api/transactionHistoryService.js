const transactionHistoryService = {
  getTransactionHistories: async () => {
    const res = await fetch('/api/TransactionHistory');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách transaction histories');
    return data;
  },
  getTransactionHistoryById: async (id) => {
    const res = await fetch(`/api/TransactionHistory/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin transaction history');
    return data;
  },
  createTransactionHistory: async (data) => {
    const res = await fetch('/api/TransactionHistory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo transaction history thất bại');
    return result;
  },
  updateTransactionHistory: async (id, data) => {
    const res = await fetch(`/api/TransactionHistory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật transaction history thất bại');
    return result;
  },
  deleteTransactionHistory: async (id) => {
    const res = await fetch(`/api/TransactionHistory/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa transaction history thất bại');
    return result;
  }
};

export default transactionHistoryService; 