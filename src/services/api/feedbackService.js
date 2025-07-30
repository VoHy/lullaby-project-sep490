const feedbackService = {
  getFeedbacks: async () => {
    const res = await fetch('/api/FeedBack');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách feedback');
    return data;
  },
  getFeedbackById: async (id) => {
    const res = await fetch(`/api/FeedBack/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin feedback');
    return data;
  },
  createFeedback: async (data) => {
    const res = await fetch('/api/FeedBack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo feedback thất bại');
    return result;
  },
  updateFeedback: async (id, data) => {
    const res = await fetch(`/api/FeedBack/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật feedback thất bại');
    return result;
  },
  deleteFeedback: async (id) => {
    const res = await fetch(`/api/FeedBack/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa feedback thất bại');
    return result;
  }
};

export default feedbackService; 