const nursingSpecialistService = {
  getNursingSpecialists: async () => {
    const res = await fetch('/api/nursingspecialists/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách nursing specialists');
    return Array.isArray(data) ? data : data.nursingSpecialists || data || [];
  },
  
  getNursingSpecialistById: async (id) => {
    const res = await fetch(`/api/nursingspecialists/get/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin nursing specialist');
    return data;
  },
  
  createNursingSpecialist: async (data) => {
    const res = await fetch('/api/nursingspecialists', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo nursing specialist thất bại');
    return result;
  },
  
  updateNursingSpecialist: async (id, data) => {
    const res = await fetch(`/api/nursingspecialists/update/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật nursing specialist thất bại');
    return result;
  },
  
  deleteNursingSpecialist: async (id) => {
    const res = await fetch(`/api/nursingspecialists/delete/${id}`, { 
      method: 'DELETE' 
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa nursing specialist thất bại');
    return result;
  },

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