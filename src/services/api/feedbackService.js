import { createService } from './serviceFactory';

// Tạo base service với factory
const baseFeedbackService = createService('feedbacks', 'Feedback', true);

// Thêm method đặc biệt
const feedbackService = {
  // Base CRUD methods từ factory
  ...baseFeedbackService,

  // Thêm method getFeedbacks để đảm bảo
  getFeedbacks: async () => {
    const res = await fetch('/api/feedbacks', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách feedbacks');
    return data;
  },

  getFeedbackById: async (id) => {
    const res = await fetch(`/api/feedbacks/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin feedback');
    return data;
  }
};

export default feedbackService; 