import { createService } from './serviceFactory';

// Tạo base service với factory
const baseNursingSpecialistService = createService('nursingspecialists', 'NursingSpecialist', true);

// Thêm method đặc biệt
const nursingSpecialistService = {
  // Base CRUD methods từ factory
  ...baseNursingSpecialistService,

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
  }
};

export default nursingSpecialistService; 