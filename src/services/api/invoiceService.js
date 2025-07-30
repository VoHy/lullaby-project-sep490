const invoiceService = {
  getInvoices: async () => {
    const res = await fetch('/api/Invoice');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách invoice');
    return data;
  },
  getInvoiceById: async (id) => {
    const res = await fetch(`/api/Invoice/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin invoice');
    return data;
  },
  createInvoice: async (data) => {
    const res = await fetch('/api/Invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo invoice thất bại');
    return result;
  },
  updateInvoice: async (id, data) => {
    const res = await fetch(`/api/Invoice/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật invoice thất bại');
    return result;
  },
  deleteInvoice: async (id) => {
    const res = await fetch(`/api/Invoice/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa invoice thất bại');
    return result;
  }
};

export default invoiceService; 