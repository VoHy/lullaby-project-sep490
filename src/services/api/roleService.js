// Role Service - Xử lý tất cả các thao tác liên quan đến vai trò

// Utility function để lấy token từ localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Utility function để tạo headers với token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const roleService = {
  getRoles: async () => {
    const res = await fetch('/api/roles', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách roles');
    return data;
  },

  getRoleById: async (id) => {
    const res = await fetch(`/api/roles/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin role');
    return data;
  }
};

export default roleService; 