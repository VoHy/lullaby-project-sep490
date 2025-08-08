import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const nursingSpecialistService = {  // Thêm method getNursingSpecialists để đảm bảo
  getNursingSpecialists: async () => {
    const res = await fetch('/api/nursingspecialists', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách nursing specialists');
    return data;
  },

  updateNursingSpecialist: async (id, data) => {
    const res = await fetch(`/api/nursingspecialists/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật hồ sơ thất bại');
    return result;
  },

  // Thêm method getAllNursingSpecialists để lấy tất cả nursing specialists
  getAllNursingSpecialists: async () => {
    const res = await fetch('/api/nursingspecialists/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách nursing specialists');
    return data;
  },

  // Method đặc biệt
  changeNursingSpecialistStatus: async (id, status) => {
    const res = await fetch(`/api/nursingspecialists/changestatus/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng nursing specialists');
    return data;
  }
};

export default nursingSpecialistService; 

