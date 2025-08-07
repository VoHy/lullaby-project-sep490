import { getAuthHeaders } from './serviceUtils';

const customizePackageService = createService('customizepackages', 'CustomizePackage');

// Thêm các methods đặc biệt cho CustomizePackage
const customizePackageServiceExtended = {
  ...customizePackageService,
  
  // Lấy tất cả CustomizePackage
  getCustomizePackages: async () => {
    const res = await fetch('/api/customizepackages/getall', {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách CustomizePackage');
    return data;
  },
  
  // Lấy CustomizePackage theo ID
  getCustomizePackageById: customizePackageService.getCustomizePackageById,
  
  // Xóa CustomizePackage
  deleteCustomizePackage: customizePackageService.deleteCustomizePackage,
  
  // Lấy tất cả CustomizePackage theo Booking ID
  getAllByBooking: async (bookingId) => {
    const res = await fetch(`/api/CustomizePackage/GetAllByBooking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách CustomizePackage theo Booking');
    return data;
  },
  
  // Lấy tất cả CustomizePackage theo Status và Booking ID
  getAllByStatusAndBooking: async (bookingId, status) => {
    const res = await fetch(`/api/CustomizePackage/GetAllByStatusAndBooking/${bookingId}/${status}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách CustomizePackage theo Status và Booking');
    return data;
  },
  
  // Lấy tất cả CustomizePackage theo Status
  getAllByStatus: async (status) => {
    const res = await fetch(`/api/CustomizePackage/GetAllByStatus/${status}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách CustomizePackage theo Status');
    return data;
  },
  
  // Cập nhật Status của CustomizePackage
  updateStatus: async (customizePackageId, status) => {
    const res = await fetch(`/api/CustomizePackage/UpdateStatus/${customizePackageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật status của CustomizePackage');
    return data;
  }
};

export default customizePackageServiceExtended; 

