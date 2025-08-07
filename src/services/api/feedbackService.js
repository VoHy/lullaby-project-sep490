import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const feedbackService = {  // Get all feedbacks
  getAllFeedbacks: async () => {
    const res = await fetch('/api/feedback/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách feedbacks');
    return data;
  },

  // Get feedback by ID
  getFeedbackById: async (feedbackId) => {
    const res = await fetch(`/api/feedback/${feedbackId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin feedback');
    return data;
  },

  // Update feedback
  updateFeedback: async (feedbackId, feedbackData) => {
    const res = await fetch(`/api/feedback/${feedbackId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(feedbackData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật feedback thất bại');
    return data;
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    const res = await fetch(`/api/feedback/${feedbackId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa feedback thất bại');
    return data;
  },

  // Get all feedbacks by service
  getAllFeedbacksByService: async (serviceId) => {
    const res = await fetch(`/api/feedback/getallbyservice/${serviceId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách feedbacks theo service');
    return data;
  },

  // Get all feedbacks by nursing
  getAllFeedbacksByNursing: async (nursingId) => {
    const res = await fetch(`/api/feedback/getallbynursing/${nursingId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách feedbacks theo nursing');
    return data;
  },

  // Get feedback by customize task
  getFeedbackByCustomizeTask: async (customizeTaskId) => {
    const res = await fetch(`/api/feedback/getbycustomizetask/${customizeTaskId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy feedback theo customize task');
    return data;
  },

  // Create feedback
  createFeedback: async (feedbackData) => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(feedbackData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo feedback thất bại');
    return data;
  }
};

export default feedbackService; 

