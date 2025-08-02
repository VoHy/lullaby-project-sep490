import { createService } from './serviceFactory';

// Tạo base service với factory
const baseNotificationService = createService('notifications', 'Notification', true);

// Thêm method đặc biệt
const notificationService = {
  // Base CRUD methods từ factory
  ...baseNotificationService,

  // Thêm method getNotifications để đảm bảo
  getNotifications: async () => {
    const res = await fetch('/api/notifications', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách notifications');
    return data;
  },

  getNotificationById: async (id) => {
    const res = await fetch(`/api/notifications/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin notification');
    return data;
  }
};

export default notificationService; 