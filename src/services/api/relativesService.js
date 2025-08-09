import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const relativesService = {  // Count method
  getRelativeCount: async () => {
    const res = await fetch('/api/relatives/count', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng relatives');
    return data;
  },

  // Thêm method createRelative để đảm bảo
  createRelative: async (data) => {
    const res = await fetch('/api/relatives/create', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(data)
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể tạo relative');
    return responseData;
  },

  // Thêm method getRelatives để đảm bảo
  getRelatives: async () => {
    const res = await fetch('/api/relatives/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách relatives');
    return data;
  },

  // Thêm method getRelative để lấy relative cụ thể
  getRelative: async (id) => {
    const res = await fetch(`/api/relatives/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy relative');
    return data;
  },

  // Thêm method updateRelative để đảm bảo
  updateRelative: async (id, data) => {
    const res = await fetch(`/api/relatives/update/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(data)
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(responseData.error || 'Không thể cập nhật relative');
    }
    
    return responseData;
  }
};

export default relativesService; 

