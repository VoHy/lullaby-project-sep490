// Wallet Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.WALLET; // '/Wallet'

const walletService = {
  getAllWallets: async () => apiGet(`${base}/GetAll`, 'Không thể lấy danh sách ví'),
  getWalletById: async (walletId) => apiGet(`${base}/${walletId}`, 'Không thể lấy ví'),
  createWallet: async (accountId) => apiPost(`${base}/${accountId}`, {}, 'Không thể tạo ví'),
  updateNote: async (walletId, note) => apiPut(`${base}/UpdateNote/${walletId}`, { note }, 'Không thể cập nhật ghi chú ví'),
  updateAmount: async (walletId, amount) => apiPut(`${base}/UpdateAmount/${walletId}`, { amount }, 'Không thể cập nhật số dư ví'),
  activate: async (walletId) => apiPut(`${base}/Active/${walletId}`, {}, 'Không thể kích hoạt ví'),
  inactivate: async (walletId) => apiPut(`${base}/Inactive/${walletId}`, {}, 'Không thể vô hiệu hóa ví'),
  deleteWallet: async (walletId) => apiDelete(`${base}/${walletId}`, 'Không thể xóa ví'),
};

export default walletService;


