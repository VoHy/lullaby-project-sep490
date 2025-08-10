// PayOS Web Service
import { API_ENDPOINTS } from '../../config/api';
import { apiPost, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.PAYOS; // '/PayOS_Web'

const payOSService = {
  confirmWebhook: async (data) => apiPost(`${base}/ConfirmWebhook`, data, 'Không thể xác nhận webhook'),
  webhookHandler: async (data) => apiPost(`${base}/WebhookHandler`, data, 'Không thể xử lý webhook'),
  delete: async () => apiDelete(`${base}`, 'Không thể xóa PayOS config'),
};

export default payOSService;
