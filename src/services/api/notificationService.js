const notificationService = {
  getNotifications: async () => {
    const res = await fetch('/api/Notification');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách notification');
    return data;
  },
  getNotificationById: async (id) => {
    const res = await fetch(`/api/Notification/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin notification');
    return data;
  },
  createNotification: async (data) => {
    const res = await fetch('/api/Notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo notification thất bại');
    return result;
  },
  updateNotification: async (id, data) => {
    const res = await fetch(`/api/Notification/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật notification thất bại');
    return result;
  },
  deleteNotification: async (id) => {
    const res = await fetch(`/api/Notification/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa notification thất bại');
    return result;
  }
};

export default notificationService; 