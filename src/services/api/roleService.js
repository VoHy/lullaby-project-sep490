import { createService } from './serviceFactory';

// Tạo base service với factory
const baseRoleService = createService('roles', 'Role', true);

// Thêm method đặc biệt
const roleService = {
  // Base CRUD methods từ factory
  ...baseRoleService,

  // Thêm method getRoles để đảm bảo
  getRoles: async () => {
    const res = await fetch('/api/roles', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách roles');
    return data;
  },

  getRoleById: async (id) => {
    const res = await fetch(`/api/roles/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin role');
    return data;
  }
};

export default roleService; 