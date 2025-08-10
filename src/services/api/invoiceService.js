// Invoice Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.INVOICES; // '/Invoice'

const invoiceService = {
  getAllInvoices: async () => apiGet(`${base}/GetAll`, 'Không thể lấy hóa đơn'),
  getInvoiceById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy hóa đơn'),
  getInvoiceByBooking: async (bookingId) => apiGet(`${base}/GetByBooking/${bookingId}`, 'Không thể lấy hóa đơn theo booking'),
  createInvoice: async (data) => apiPost(`${base}`, data, 'Không thể tạo hóa đơn'),
  updateStatus: async (invoiceId, status) => apiPut(`${base}/UpdateStatus/${invoiceId}`, { status }, 'Không thể cập nhật trạng thái hóa đơn'),
  deleteInvoice: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa hóa đơn'),
};

export default invoiceService;
