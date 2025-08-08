import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const careProfileService = {  // Count method
  getCareProfileCount: async () => {
    const res = await fetch('/api/careprofiles/count', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng care profiles');
    return data;
  },

  // Thêm method createCareProfile để đảm bảo
  createCareProfile: async (data) => {
    const res = await fetch('/api/careprofiles/create', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(data)
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể tạo care profile');
    return responseData;
  },

  // Thêm method getCareProfiles để đảm bảo
  getCareProfiles: async () => {
    try {
      const res = await fetch('/api/careprofiles/getall', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể lấy danh sách care profiles');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateCareProfile: async (id, data) => {
    const res = await fetch(`/api/careprofiles/update/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Không thể cập nhật care profile');
    return result;
  },

  getCareProfileById: async (id) => {
    const res = await fetch(`/api/careprofiles/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể lấy thông tin care profile');
    return responseData;
  },

  deleteCareProfile: async (id) => {
    const res = await fetch(`/api/careprofiles/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || 'Không thể xóa care profile');
    return responseData;
  }
};

export default careProfileService;

