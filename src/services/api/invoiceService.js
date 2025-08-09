import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const invoiceService = {  // GET /api/Invoice/GetAll
  getAllInvoices: async () => {
    const res = await fetch('/api/invoice/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách invoices');
    return data;
  },

  // GET /api/Invoice/{invoiceId}
  getInvoiceById: async (id) => {
    const res = await fetch(`/api/invoice/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin invoice');
    return data;
  },

  // DELETE /api/Invoice/{invoiceId}
  deleteInvoice: async (id) => {
    const res = await fetch(`/api/invoice/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể xóa invoice');
    return data;
  },

  // GET /api/Invoice/GetByBooking/{bookingId}
  getInvoiceByBooking: async (bookingId) => {
    const res = await fetch(`/api/invoice/getbybooking/${bookingId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy invoice theo booking');
    return data;
  },

  // POST /api/Invoice
  createInvoice: async (invoiceData) => {
    // Validate required fields
    if (!invoiceData.bookingID || !invoiceData.content) {
      throw new Error('bookingID và content là bắt buộc');
    }

    const res = await fetch('/api/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(invoiceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo invoice thất bại');
    return data;
  },

  // PUT /api/Invoice/UpdateStatus/{invoiceId}
  updateInvoiceStatus: async (invoiceId, statusData) => {
    const res = await fetch(`/api/invoice/updatestatus/${invoiceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật trạng thái invoice thất bại');
    return data;
  }
};

export default invoiceService; 

