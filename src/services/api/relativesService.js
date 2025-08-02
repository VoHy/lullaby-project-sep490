import { createService } from './serviceFactory';

// Tạo base service với factory
const baseRelativesService = createService('relatives', 'Relative', true);

// Thêm method đặc biệt
const relativesService = {
  // Base CRUD methods từ factory
  ...baseRelativesService,

  // Count method
  getRelativeCount: async () => {
    const res = await fetch('/api/relatives/count', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng relatives');
    return data;
  },

  // Thêm method createRelative để đảm bảo
  createRelative: async (data) => {
    const res = await fetch('/api/relatives/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách relatives');
    return data;
  },

  // Thêm method getRelative để lấy relative cụ thể
  getRelative: async (id) => {
    const res = await fetch(`/api/relatives/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy relative');
    return data;
  },

  // Thêm method updateRelative để đảm bảo
  updateRelative: async (id, data) => {
    const res = await fetch(`/api/relatives/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const responseText = await res.text();
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!res.ok) {
      throw new Error(responseData.error || 'Không thể cập nhật relative');
    }
    
    return responseData;
  }
};

export default relativesService; 