import { createService } from './serviceFactory';

// Tạo base service với factory
const baseInvoiceService = createService('invoice', 'Invoice', true);

// Thêm method đặc biệt
const invoiceService = {
  // Base CRUD methods từ factory
  ...baseInvoiceService,

  // Get all invoices
  getAllInvoices: async () => {
    const res = await fetch('/api/invoice/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách invoices');
    return data;
  },

  // Get invoice by ID
  getInvoiceById: async (invoiceId) => {
    const res = await fetch(`/api/invoice/${invoiceId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin invoice');
    return data;
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    const res = await fetch('/api/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo invoice thất bại');
    return data;
  },

  // Delete invoice
  deleteInvoice: async (invoiceId) => {
    const res = await fetch(`/api/invoice/${invoiceId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa invoice thất bại');
    return data;
  },

  // Get invoice by booking
  getInvoiceByBooking: async (bookingId) => {
    const res = await fetch(`/api/invoice/getbybooking/${bookingId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy invoice theo booking');
    return data;
  },

  // Get all invoices by account
  getAllInvoicesByAccount: async (accountId) => {
    const res = await fetch(`/api/invoice/getallbyaccount/${accountId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách invoices theo account');
    return data;
  },

  // Get all invoices by care profile
  getAllInvoicesByCareProfile: async (careProfileId) => {
    const res = await fetch(`/api/invoice/getallbycareprofile/${careProfileId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách invoices theo care profile');
    return data;
  },

  // Update invoice status
  updateInvoiceStatus: async (invoiceId, statusData) => {
    const res = await fetch(`/api/invoice/updatestatus/${invoiceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật trạng thái invoice thất bại');
    return data;
  }
};

export default invoiceService; 