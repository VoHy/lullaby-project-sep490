import { createService } from './serviceFactory';

// Tạo base service với factory
const baseNotificationService = createService('notification', 'Notification', true);

// Thêm method đặc biệt
const notificationService = {
  // Base CRUD methods từ factory
  ...baseNotificationService,

  // Get all notifications
  getAllNotifications: async () => {
    const res = await fetch('/api/notification/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách notifications');
    return data;
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    const res = await fetch(`/api/notification/${notificationId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin notification');
    return data;
  },

  // Create new notification
  createNotification: async (notificationData) => {
    const res = await fetch('/api/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo notification thất bại');
    return data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const res = await fetch(`/api/notification/${notificationId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa notification thất bại');
    return data;
  },

  // Get all notifications by account
  getAllNotificationsByAccount: async (accountId) => {
    const res = await fetch(`/api/notification/getallbyaccount/${accountId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách notifications theo account');
    return data;
  },

  // Get unread notifications by account
  getUnreadNotificationsByAccount: async (accountId) => {
    const res = await fetch(`/api/notification/getunreadbyaccount/${accountId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách notifications chưa đọc');
    return data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const res = await fetch(`/api/notification/markasread/${notificationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đánh dấu notification đã đọc thất bại');
    return data;
  },

  // Mark all notifications as read by account
  markAllNotificationsAsReadByAccount: async (accountId) => {
    const res = await fetch(`/api/notification/markallasreadbyaccount/${accountId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đánh dấu tất cả notifications đã đọc thất bại');
    return data;
  },

  // Get unread notifications count by account
  getUnreadNotificationsCountByAccount: async (accountId) => {
    const res = await fetch(`/api/notification/getunreadcountbyaccount/${accountId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng notifications chưa đọc');
    return data;
  }
};

export default notificationService; 