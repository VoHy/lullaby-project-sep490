import roles from '../../mock/Role';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const roleService = {
  getAllRoles: async () => {
    if (USE_MOCK) {
      return Promise.resolve(roles);
    }
    const res = await fetch('/api/roles');
    return res.json();
  },
  getRole: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(roles.find(r => r.RoleID === id));
    }
    const res = await fetch(`/api/roles/${id}`);
    return res.json();
  },
  createRole: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, RoleID: roles.length + 1 });
    }
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateRole: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...roles.find(r => r.RoleID === id), ...data });
    }
    const res = await fetch(`/api/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteRole: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default roleService; 