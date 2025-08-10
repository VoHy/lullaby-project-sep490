// Notification Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.NOTIFICATIONS; // '/Notification'

const notificationService = {
  getAllNotifications: async () => apiGet(`${base}/GetAll`, 'Không thể lấy thông báo'),
  getNotificationById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy thông báo'),
  getAllByAccount: async (accountId) => apiGet(`${base}/GetAllByAccount/${accountId}`, 'Không thể lấy thông báo'),
  getUnreadByAccount: async (accountId) => apiGet(`${base}/GetUnReadByAccount/${accountId}`, 'Không thể lấy thông báo chưa đọc'),
  getUnreadCountByAccount: async (accountId) => apiGet(`${base}/GetUnReadCountByAccount/${accountId}`, 'Không thể lấy số thông báo chưa đọc'),
  markAllAsReadByAccount: async (accountId) => apiPut(`${base}/MarkAllAsReadByAccount/${accountId}`, {}, 'Không thể đánh dấu đã đọc'),
  markAsRead: async (notificationId) => apiPut(`${base}/IsRead/${notificationId}`, {}, 'Không thể đánh dấu đã đọc'),
  createNotification: async (data) => apiPost(`${base}`, data, 'Không thể tạo thông báo'),
  deleteNotification: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa thông báo'),
};

export default notificationService;
