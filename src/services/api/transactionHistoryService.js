// Transaction History Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.TRANSACTION_HISTORY; // '/TransactionHistory'

const transactionHistoryService = {
  getAllTransactionHistory: async () => apiGet(`${base}/GetAll`, 'Không thể lấy lịch sử giao dịch'),
  getTransactionHistoryById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy giao dịch'),
  getAllByAccount: async (accountId) => apiGet(`${base}/GetAllByAccount/${accountId}`, 'Không thể lấy giao dịch theo tài khoản'),
  addMoneyToWallet: async (data) => apiPost(`${base}/AddMoneyToWallet`, data, 'Không thể tạo giao dịch nạp ví (web)'),
  addMoneyToWalletMobile: async (data) => apiPost(`${base}/AddMoneyToWalletMobile`, data, 'Không thể tạo giao dịch nạp ví (mobile)'),
  invoicePayment: async (invoiceId) => apiPost(`${base}/InvoicePayment/${invoiceId}`, {}, 'Không thể thanh toán hóa đơn'),
  refundMoneyToWallet: async (invoiceId) => apiPost(`${base}/RefundMoneyToWallet/${invoiceId}`, {}, 'Không thể hoàn tiền'),
  successAddToWallet: async (transactionHistoryId) => apiPut(`${base}/SuccessAddToWallet/${transactionHistoryId}`, {}, 'Không thể xác nhận giao dịch'),
  deleteTransaction: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa giao dịch'),
};

export default transactionHistoryService;
