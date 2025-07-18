import notifications from '../../mock/Notification';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const notificationService = {
  getNotifications: async () => {
    if (USE_MOCK) {
      return Promise.resolve(notifications);
    }
    const res = await fetch('/api/notifications');
    return res.json();
  },
  getNotificationById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(notifications.find(n => n.NotificationID === id));
    }
    const res = await fetch(`/api/notifications/${id}`);
    return res.json();
  },
  createNotification: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, NotificationID: notifications.length + 1 });
    }
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateNotification: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...notifications.find(n => n.NotificationID === id), ...data });
    }
    const res = await fetch(`/api/notifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteNotification: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default notificationService; 