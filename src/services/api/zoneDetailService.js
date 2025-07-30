const zoneDetailService = {
  // Lấy tất cả zone details
  getZoneDetails: async () => {
    try {
      const response = await fetch('/api/zonedetails/getall');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
      return data;
    } catch (error) {
      console.error('Error fetching zone details:', error);
      throw error;
    }
  },

  // Alias cho getAllZoneDetails (để tương thích)
  getAllZoneDetails: async () => {
    try {
      const response = await fetch('/api/zonedetails/getall');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
      return data;
    } catch (error) {
      console.error('Error fetching zone details:', error);
      throw error;
    }
  },

  // Lấy zone detail theo ID
  getZoneDetail: async (id) => {
    try {
      const response = await fetch(`/api/zonedetails/get/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lấy thông tin zone detail');
      return data;
    } catch (error) {
      console.error('Error fetching zone detail:', error);
      throw error;
    }
  },

  // Tạo zone detail mới
  createZoneDetail: async (data) => {
    try {
      const response = await fetch('/api/zonedetails/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể tạo zone detail');
      return result;
    } catch (error) {
      console.error('Error creating zone detail:', error);
      throw error;
    }
  },

  // Cập nhật zone detail
  updateZoneDetail: async (id, data) => {
    try {
      const response = await fetch(`/api/zonedetails/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể cập nhật zone detail');
      return result;
    } catch (error) {
      console.error('Error updating zone detail:', error);
      throw error;
    }
  },

  // Xóa zone detail
  deleteZoneDetail: async (id) => {
    try {
      const response = await fetch(`/api/zonedetails/delete/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể xóa zone detail');
      return result;
    } catch (error) {
      console.error('Error deleting zone detail:', error);
      throw error;
    }
  }
};

export default zoneDetailService; 