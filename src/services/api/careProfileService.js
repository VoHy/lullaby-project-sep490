import { createService } from './serviceFactory';

// Tạo base service với factory
const baseCareProfileService = createService('careprofiles', 'CareProfile', true);

// Thêm method đặc biệt
const careProfileService = {
  // Base CRUD methods từ factory
  ...baseCareProfileService,

  // Count method
  getCareProfileCount: async () => {
    const res = await fetch('/api/careprofiles/count', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng care profiles');
    return data;
  },

  // Thêm method createCareProfile để đảm bảo
  createCareProfile: async (data) => {
    const res = await fetch('/api/careprofiles/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể tạo care profile');
    return responseData;
  },

  // Thêm method getCareProfiles để đảm bảo
  getCareProfiles: async () => {
    const res = await fetch('/api/careprofiles/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách care profiles');
    return data;
  },

  updateCareProfile: async (id, data) => {
    const res = await fetch(`/api/careprofiles/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể cập nhật care profile');
    return responseData;
  },

  getCareProfileById: async (id) => {
    const res = await fetch(`/api/careprofiles/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể lấy thông tin care profile');
    return responseData;
  },

  deleteCareProfile: async (id) => {
    const res = await fetch(`/api/careprofiles/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể xóa care profile');
    return responseData;
  }
};

export default careProfileService; 