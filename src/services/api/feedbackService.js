import feedbacks from '../../mock/Feedback';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const feedbackService = {
  getFeedbacks: async () => {
    if (USE_MOCK) {
      return Promise.resolve(feedbacks);
    }
    const res = await fetch('/api/feedbacks');
    return res.json();
  },
  getFeedbackById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(feedbacks.find(f => f.FeedbackID === id));
    }
    const res = await fetch(`/api/feedbacks/${id}`);
    return res.json();
  },
  createFeedback: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, FeedbackID: feedbacks.length + 1 });
    }
    const res = await fetch('/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateFeedback: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...feedbacks.find(f => f.FeedbackID === id), ...data });
    }
    const res = await fetch(`/api/feedbacks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteFeedback: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/feedbacks/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default feedbackService; 