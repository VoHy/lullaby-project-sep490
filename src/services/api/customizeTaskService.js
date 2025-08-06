import { createService } from './serviceFactory';

const customizeTaskService = createService('CustomizeTask', 'CustomizeTask', true);

// Thêm các methods đặc biệt cho CustomizeTask
const customizeTaskServiceExtended = {
  // Lấy tất cả CustomizeTask
  getAllCustomizeTasks: customizeTaskService.getCustomizeTasks,
  
  // Lấy CustomizeTask theo ID
  getCustomizeTaskById: customizeTaskService.getCustomizeTaskById,
  
  // Xóa CustomizeTask
  deleteCustomizeTask: customizeTaskService.deleteCustomizeTask,
  
  // Lấy tất cả CustomizeTask theo CustomizePackage ID
  getAllByCustomizePackage: async (customizePackageId) => {
    const res = await fetch(`/api/customizetasks/getallbycustomizepackage/${customizePackageId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách CustomizeTask theo CustomizePackage');
    return data;
  },
  
  // Lấy tất cả CustomizeTask theo Booking ID
  getAllByBooking: async (bookingId) => {
    const res = await fetch(`/api/customizetasks/getallbybooking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách CustomizeTask theo Booking');
    return data;
  },
  
  // Cập nhật Status của CustomizeTask theo CustomizePackage ID
  updateStatus: async (customizePackageId, status) => {
    const res = await fetch(`/api/customizetasks/updatestatus/${customizePackageId}`, {
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
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật status của CustomizeTask');
    return data;
  },
  
  // Cập nhật Nursing cho CustomizeTask
  updateNursing: async (customizeTaskId, nursingId) => {
    const res = await fetch(`/api/customizetasks/updatenursing/${customizeTaskId}/${nursingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        })
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật Nursing cho CustomizeTask');
    return data;
  }
};

export default customizeTaskServiceExtended; 