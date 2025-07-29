// ⚠️ MOCK DATA - KHÔNG DÙNG KHI NEXT_PUBLIC_USE_MOCK=false
// import accounts from '../../mock/Account';
import axiosInstance from '../http/axios';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const accountService = {
  getAccount: async (id) => {
    if (USE_MOCK) {
      // Mock data đã comment
      return Promise.resolve(null);
    }
    
    try {
      console.log('Getting account with ID:', id);
      
      // Sử dụng proxy để bypass CORS
      const response = await fetch(`/api/accounts/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Get account response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy thông tin tài khoản');
      }

      return data;
    } catch (error) {
      console.error('Get account error:', error);
      throw new Error(error.message || 'Không thể lấy thông tin tài khoản');
    }
  },
  
  getAllAccounts: async () => {
    if (USE_MOCK) {
      // Mock data đã comment
      return Promise.resolve([]);
    }
    
    try {
      console.log('Getting all accounts');
      
      // Sử dụng proxy để bypass CORS
      const response = await fetch('/api/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Get all accounts response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy danh sách tài khoản');
      }

      return data;
    } catch (error) {
      console.error('Get all accounts error:', error);
      throw new Error(error.message || 'Không thể lấy danh sách tài khoản');
    }
  },
  
  updateAccount: async (id, data) => {
    if (USE_MOCK) {
      // Mock data đã comment
      return Promise.resolve({ id, ...data });
    }
    
    try {
      console.log('Updating account with ID:', id, 'Data:', data);
      
      // Sử dụng proxy để bypass CORS
      const response = await fetch(`/api/accounts/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('Update account response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Không thể cập nhật tài khoản');
      }

      return responseData;
    } catch (error) {
      console.error('Update account error:', error);
      throw new Error(error.message || 'Không thể cập nhật tài khoản');
    }
  },
  
  deleteAccount: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    
    try {
      console.log('Deleting account with ID:', id);
      
      // Sử dụng proxy để bypass CORS
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Delete account response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Không thể xóa tài khoản');
      }

      return response.status === 200;
    } catch (error) {
      console.error('Delete account error:', error);
      throw new Error(error.message || 'Không thể xóa tài khoản');
    }
  }
};

export default accountService; 