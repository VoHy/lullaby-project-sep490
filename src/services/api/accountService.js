const accountService = {
  getAccount: async (id) => {
    try {
      const response = await fetch(`/api/accounts/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy thông tin tài khoản');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Không thể lấy thông tin tài khoản');
    }
  },
  
  getAllAccounts: async () => {
    try {
      const response = await fetch('/api/accounts/getall', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy danh sách tài khoản');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Không thể lấy danh sách tài khoản');
    }
  },
  
  updateAccount: async (id, data) => {
    try {
      const response = await fetch(`/api/accounts/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Không thể cập nhật tài khoản');
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || 'Không thể cập nhật tài khoản');
    }
  },
  
  deleteAccount: async (id) => {
    try {
      const response = await fetch(`/api/accounts/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể xóa tài khoản');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Không thể xóa tài khoản');
    }
  },

  // === REGISTER METHODS ===
  
  registerNursingSpecialist: async (data) => {
    try {
      const response = await fetch('/api/accounts/register/nursingspecialist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Đăng ký nursing specialist thất bại');
      }

      return result;
    } catch (error) {
      throw new Error(error.message || 'Đăng ký nursing specialist thất bại');
    }
  },

  registerManager: async (data) => {
    try {
      const response = await fetch('/api/accounts/register/manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Đăng ký manager thất bại');
      }

      return result;
    } catch (error) {
      throw new Error(error.message || 'Đăng ký manager thất bại');
    }
  },

  registerCustomer: async (data) => {
    try {
      const response = await fetch('/api/accounts/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Đăng ký customer thất bại');
      }

      return result;
    } catch (error) {
      throw new Error(error.message || 'Đăng ký customer thất bại');
    }
  },

  // === BAN/UNBAN METHODS ===
  
  banAccount: async (id) => {
    try {
      const response = await fetch(`/api/accounts/ban/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ban tài khoản thất bại');
      }

      return result;
    } catch (error) {
      throw new Error(error.message || 'Ban tài khoản thất bại');
    }
  },

  // === GET SPECIFIC ACCOUNTS ===
  
  getManagers: async () => {
    try {
      const response = await fetch('/api/accounts/managers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy danh sách managers');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Không thể lấy danh sách managers');
    }
  },

  getCustomers: async () => {
    try {
      const response = await fetch('/api/accounts/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy danh sách customers');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Không thể lấy danh sách customers');
    }
  }
};

export default accountService; 