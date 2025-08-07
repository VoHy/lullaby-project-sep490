import { createService } from './serviceFactory';
// Tạo base service với factory
const baseCustomizeTaskService = createService('customizetask', 'CustomizeTask', true);

// Thêm methods đặc biệt cho CustomizeTask
const customizeTaskService = {
  // GET /api/CustomizeTask/GetAll
  getAllCustomizeTasks: async () => {
    try {
      console.log('🔄 Fetching all customize tasks...');
      const res = await fetch('/api/customizetask/getall');
      
      // Check if response is OK
      if (!res.ok) {
        console.error('❌ API response not ok:', res.status, res.statusText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('❌ Response is not JSON:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await res.json();
      console.log('✅ Fetched customize tasks:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching customize tasks:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  },

  // GET /api/CustomizeTask/{customizeTaskId}
  getCustomizeTaskById: async (customizeTaskId) => {
    const res = await fetch(`/api/customizetask/${customizeTaskId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Lấy customize task thất bại');
    return data;
  },

  // POST /api/CustomizeTask
  createCustomizeTask: async (taskData) => {
    try {
      console.log('🔄 Creating customize task:', taskData);
      const res = await fetch('/api/customizetask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('✅ Created customize task:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating customize task:', error);
      throw error;
    }
  },

  // DELETE /api/CustomizeTask/{customizeTaskId}
  deleteCustomizeTask: async (customizeTaskId) => {
    const res = await fetch(`/api/customizetask/${customizeTaskId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa customize task thất bại');
    return data;
  },

  // GET /api/CustomizeTask/GetAllByBooking/{bookingId}
  getTasksByBooking: async (bookingId) => {
    try {
      console.log(`🔄 Fetching tasks for booking ${bookingId}...`);
      const res = await fetch(`/api/customizetask/getallbybooking/${bookingId}`);
      
      if (!res.ok) {
        console.error('❌ API response not ok:', res.status, res.statusText);
        return [];
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Response is not JSON for booking:', bookingId);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Fetched tasks for booking ${bookingId}:`, data);
      return data || [];
    } catch (error) {
      console.error(`❌ Error fetching tasks for booking ${bookingId}:`, error);
      return [];
    }
  },

  // GET /api/CustomizeTask/GetAllByCustomizePackage/{customizePackageId}
  getTasksByPackage: async (customizePackageId) => {
    try {
      const res = await fetch(`/api/customizetask/getallbycustomizepackage/${customizePackageId}`);
      
      if (!res.ok) {
        console.error('❌ API response not ok:', res.status, res.statusText);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Fetched tasks for package ${customizePackageId}:`, data);
      return data || [];
    } catch (error) {
      console.error(`❌ Error fetching tasks for package ${customizePackageId}:`, error);
      return [];
    }
  },

  // PUT /api/CustomizeTask/UpdateNursing/{customizeTaskId}/{nursingId}
  updateTaskNursing: async (customizeTaskId, nursingId) => {
    try {
      console.log(`🔄 Updating nursing for task ${customizeTaskId} to nursing ${nursingId}`);
      const res = await fetch(`/api/customizetask/updatenursing/${customizeTaskId}/${nursingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log(`✅ Updated nursing for task ${customizeTaskId}:`, data);
      return data;
    } catch (error) {
      console.error('❌ Error updating task nursing:', error);
      throw error;
    }
  },

  // PUT /api/CustomizeTask/UpdateStatus/{customizePackageId}
  updateTaskStatus: async (customizePackageId, statusData) => {
    try {
      console.log(`🔄 Updating status for package ${customizePackageId}:`, statusData);
      const res = await fetch(`/api/customizetask/updatestatus/${customizePackageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log(`✅ Updated status for package ${customizePackageId}:`, data);
      return data;
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      throw error;
    }
  }
};

export default customizeTaskService;