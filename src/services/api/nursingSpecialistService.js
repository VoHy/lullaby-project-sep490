import { createService } from './serviceFactory';

// Tạo base service với factory
const baseNursingSpecialistService = createService('nursingspecialists', 'NursingSpecialist', true);

// Thêm method đặc biệt
const nursingSpecialistService = {
  // Base CRUD methods từ factory
  ...baseNursingSpecialistService,

  // Thêm method getNursingSpecialists để đảm bảo
  getNursingSpecialists: async () => {
    const res = await fetch('/api/nursingspecialists', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách nursing specialists');
    return data;
  },

  // Method đặc biệt
  changeNursingSpecialistStatus: async (id, status) => {
    const res = await fetch(`/api/nursingspecialists/changestatus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Thay đổi trạng thái nursing specialist thất bại');
    return result;
  },

  // Count method
  getNursingSpecialistCount: async () => {
    const res = await fetch('/api/nursingspecialists/count', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng nursing specialists');
    return data;
  }
};

export default nursingSpecialistService; 