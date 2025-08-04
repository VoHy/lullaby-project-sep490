import { createService } from './serviceFactory';

// Tạo base service với factory
const basePayOSService = createService('payos', 'PayOS', true);

// Thêm method đặc biệt
const payOSService = {
  // Base CRUD methods từ factory
  ...basePayOSService,

  // Confirm webhook
  confirmWebhook: async (webhookData) => {
    const res = await fetch('/api/payos/confirmwebhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xác nhận webhook thất bại');
    return data;
  },

  // Webhook handler
  webhookHandler: async (webhookData) => {
    const res = await fetch('/api/payos/webhookhandler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xử lý webhook thất bại');
    return data;
  },

  // Webhook process
  webhookProcess: async (webhookData) => {
    const res = await fetch('/api/payos/webhookprocess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xử lý webhook process thất bại');
    return data;
  },

  // Delete PayOS
  deletePayOS: async () => {
    const res = await fetch('/api/payos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa PayOS thất bại');
    return data;
  }
};

export default payOSService; 