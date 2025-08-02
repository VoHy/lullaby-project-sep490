import { createService } from './serviceFactory';

// Tạo base service với factory
const baseInvoiceService = createService('invoices', 'Invoice', true);

// Thêm method đặc biệt
const invoiceService = {
  // Base CRUD methods từ factory
  ...baseInvoiceService,

  // Thêm method getInvoices để đảm bảo
  getInvoices: async () => {
    const res = await fetch('/api/invoices', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách invoices');
    return data;
  },

  getInvoiceById: async (id) => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin invoice');
    return data;
  }
};

export default invoiceService; 