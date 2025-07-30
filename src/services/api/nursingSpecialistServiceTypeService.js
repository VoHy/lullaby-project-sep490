const nursingSpecialistServiceTypeService = {
  getNursingSpecialistServiceTypes: async () => {
    const res = await fetch('/api/NursingSpecialist_ServiceType');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách nursing specialist service types');
    return data;
  },
  getNursingSpecialistServiceTypeById: async (id) => {
    const res = await fetch(`/api/NursingSpecialist_ServiceType/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin nursing specialist service type');
    return data;
  },
  createNursingSpecialistServiceType: async (data) => {
    const res = await fetch('/api/NursingSpecialist_ServiceType', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo nursing specialist service type thất bại');
    return result;
  },
  updateNursingSpecialistServiceType: async (id, data) => {
    const res = await fetch(`/api/NursingSpecialist_ServiceType/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật nursing specialist service type thất bại');
    return result;
  },
  deleteNursingSpecialistServiceType: async (id) => {
    const res = await fetch(`/api/NursingSpecialist_ServiceType/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa nursing specialist service type thất bại');
    return result;
  }
};

export default nursingSpecialistServiceTypeService; 