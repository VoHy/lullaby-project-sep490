// Feedback Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.FEEDBACK; // '/Feedback'

const feedbackService = {
  getAllFeedbacks: async () => apiGet(`${base}/GetAll`, 'Không thể lấy feedback'),
  getFeedbackById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy feedback'),
  getAllByService: async (serviceId) => apiGet(`${base}/GetAllByService/${serviceId}`, 'Không thể lấy feedback theo dịch vụ'),
  getAllByNursing: async (nursingId) => apiGet(`${base}/GetAllByNursing/${nursingId}`, 'Không thể lấy feedback theo nurse'),
  getByCustomizeTask: async (customizeTaskId) => apiGet(`${base}/GetByCustomizeTask/${customizeTaskId}`, 'Không thể lấy feedback theo task'),
  getAverageRatingByNursing: async (nursingId) => apiGet(`${base}/AverageRatingByNursing/${nursingId}`, 'Không thể lấy rating trung bình theo nurse'),
  getAverageRatingByService: async (serviceId) => apiGet(`${base}/AverageRatingByService/${serviceId}`, 'Không thể lấy rating trung bình theo dịch vụ'),
  createFeedback: async (data) => apiPost(`${base}`, data, 'Không thể tạo feedback'),
  updateFeedback: async (id, data) => apiPut(`${base}/${id}`, data, 'Không thể cập nhật feedback'),
  deleteFeedback: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa feedback'),
};

export default feedbackService;
