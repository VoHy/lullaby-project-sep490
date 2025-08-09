import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const bookingService = {  // GET /api/Booking/GetAll
  getAllBookings: async () => {
    const res = await fetch('/api/booking/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings');
    return data;
  },

  // Aggregated: Get all bookings with embedded care profile
  getAllBookingsWithCareProfile: async () => {
    const res = await fetch('/api/booking/getall/withcareprofile', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings kèm care profile');
    return data;
  },

  // GET /api/Booking/GetAll with CareProfile information
  getAllByCareProfile: async (careProfileId) => {
    const res = await fetch(`/api/booking/getallbycareprofile?careProfileId=${careProfileId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings với thông tin care profile');
    return data;
  },

  // GET /api/Booking/{bookingId}
  getBookingById: async (id) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin booking');
    return data;
  },

  // GET /api/Booking/{bookingId} with CareProfile information
  getBookingByIdWithCareProfile: async (id) => {
    const res = await fetch(`/api/booking/${id}/withcareprofile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin booking với care profile');
    return data;
  },

  // Aggregated: Get bookings of a nurse (optimized fewer calls)
  getBookingsByNursing: async (nursingId) => {
    const res = await fetch(`/api/nurse/${nursingId}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách booking của y tá');
    return data;
  },

  // DELETE /api/Booking/{bookingId}
  deleteBooking: async (id) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể xóa booking');
    return data;
  },

  // GET /api/Booking/GetAllByCareProfile
  getAllByCareProfile: async (careProfileId) => {
    const res = await fetch(`/api/booking/getallbycareprofile?careProfileId=${careProfileId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings theo care profile');
    return data;
  },

  // GET /api/Booking/GetAllByStatusAndCareProfile
  getAllByStatusAndCareProfile: async (status, careProfileId) => {
    const res = await fetch(`/api/booking/getallbystatusandcareprofile?status=${status}&careProfileId=${careProfileId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings theo status và care profile');
    return data;
  },

  // GET /api/Booking/GetAllByStatus
  getAllByStatus: async (status) => {
    const res = await fetch(`/api/booking/getallbystatus?status=${status}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings theo status');
    return data;
  },

  // POST /api/Booking/CreateServiceBooking
  // BookingServicesCreateDto: { careProfileID*, amount*, workdate*, customizePackageCreateDtos }
  // CustomizePackageCreateDto: { serviceID*, quantity* }
  createServiceBooking: async (bookingData) => {
    // Validate required fields
    if (!bookingData.careProfileID || !bookingData.amount || !bookingData.workdate) {
      throw new Error('careProfileID, amount, và workdate là bắt buộc');
    }

    // Validate customizePackageCreateDtos if provided
    if (bookingData.customizePackageCreateDtos) {
      if (!Array.isArray(bookingData.customizePackageCreateDtos)) {
        throw new Error('customizePackageCreateDtos phải là một array');
      }
      
      bookingData.customizePackageCreateDtos.forEach((item, index) => {
        if (!item.serviceID || !item.quantity) {
          throw new Error(`customizePackageCreateDtos[${index}]: serviceID và quantity là bắt buộc`);
        }
      });
    }

    const res = await fetch('/api/booking/createservicebooking', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể tạo service booking');
    return data;
  },

  // POST /api/Booking/CreatePackageBooking
  // BookingPackageCreateDto: { careProfileID*, amount*, workdate*, customizePackageCreateDto }
  // CustomizePackageCreateDto: { serviceID*, quantity* }
  createPackageBooking: async (bookingData) => {
    // Validate required fields
    if (!bookingData.careProfileID || !bookingData.amount || !bookingData.workdate) {
      throw new Error('careProfileID, amount, và workdate là bắt buộc');
    }

    // Validate customizePackageCreateDto if provided
    if (bookingData.customizePackageCreateDto) {
      if (!bookingData.customizePackageCreateDto.serviceID || !bookingData.customizePackageCreateDto.quantity) {
        throw new Error('customizePackageCreateDto: serviceID và quantity là bắt buộc');
      }
    }

    const res = await fetch('/api/booking/createpackagebooking', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể tạo package booking');
    return data;
  },

  // PUT /api/Booking/UpdateStatus/{bookingId}
  updateStatus: async (bookingId, status) => {
    const res = await fetch(`/api/booking/updatestatus/${bookingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật status booking');
    return data;
  },

  // PUT /api/Booking/UpdateWorkdate/{bookingId}
  updateWorkdate: async (bookingId, workdate) => {
    const res = await fetch(`/api/booking/updateworkdate/${bookingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ workdate })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật workdate booking');
    return data;
  },

  // PUT /api/Booking/UpdateStatus/{bookingId}
  updateBookingStatus: async (bookingId, statusData) => {
    const res = await fetch(`/api/booking/updatestatus/${bookingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật trạng thái booking thất bại');
    return data;
  },

  // Helper methods để tạo booking data
  createServiceBookingData: (careProfileID, amount, workdate, services = []) => {
    return {
      careProfileID,
      amount,
      workdate,
      customizePackageCreateDtos: services.map(service => ({
        serviceID: service.serviceID,
        quantity: service.quantity
      }))
    };
  },

  createPackageBookingData: (careProfileID, amount, workdate, serviceID, quantity = 1) => {
    return {
      careProfileID,
      amount,
      workdate,
      customizePackageCreateDto: {
        serviceID,
        quantity
      }
    };
  },

  // Method để tạo booking từ booking page
  createBooking: async (bookingData) => {
    try {
      const { serviceId, datetime, note, careProfileId, totalAmount } = bookingData;
      
      // Xác định loại booking (package hoặc service)
      const isPackage = serviceId && !serviceId.includes(',');
      
      if (isPackage) {
        // Package booking - sử dụng CreatePackageBooking API với customizePackageCreateDto
        const packageBookingData = {
          careProfileID: parseInt(careProfileId),
          amount: parseInt(totalAmount),
          workdate: datetime,
          customizePackageCreateDto: {
            serviceID: parseInt(serviceId),
            quantity: 1
          }
        };
        
        const result = await bookingService.createPackageBooking(packageBookingData);
        return result;
      } else {
        // Service booking - sử dụng CreateServiceBooking API với customizePackageCreateDtos
        const serviceIds = serviceId.split(',').map(id => parseInt(id.trim()));
        const services = serviceIds.map(id => ({
          serviceID: id,
          quantity: 1 // Mặc định quantity = 1, có thể cập nhật sau
        }));
        
        const serviceBookingData = {
          careProfileID: parseInt(careProfileId),
          amount: parseInt(totalAmount),
          workdate: datetime,
          customizePackageCreateDtos: services
        };
        
        const result = await bookingService.createServiceBooking(serviceBookingData);
        return result;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Không thể tạo booking: ' + error.message);
    }
  }
};

export default bookingService; 

