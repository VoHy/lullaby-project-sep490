// Work Schedule Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.WORK_SCHEDULES; // '/WorkSchedule'

const workScheduleService = {
  getAllWorkSchedules: async () => apiGet(`${base}/GetAll`, 'Không thể lấy lịch làm việc'),
  getWorkScheduleById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy lịch làm việc'),
  getAllByNursing: async (nursingId) => apiGet(`${base}/GetAllByNursing/${nursingId}`, 'Không thể lấy lịch theo nurse'),
  getAllByStatus: async (status) => apiGet(`${base}/GetAllByStatus/${status}`, 'Không thể lấy lịch theo trạng thái'),
  getAllByStatusAndNursing: async (nursingId, status) => apiGet(`${base}/GetAllByStatusAndNursing/${nursingId}/${status}`, 'Không thể lấy lịch'),
  updateStatus: async (workScheduleId, status) => apiPut(`${base}/UpdateStatus/${workScheduleId}/${status}`, {}, 'Không thể cập nhật trạng thái'),
  updateIsAttended: async (workScheduleId) => apiPut(`${base}/UpdateIsAttended/${workScheduleId}`, {}, 'Không thể cập nhật điểm danh'),
  deleteWorkSchedule: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa lịch làm việc'),
};

export default workScheduleService;
