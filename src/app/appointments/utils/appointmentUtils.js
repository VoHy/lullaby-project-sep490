export const getServiceNames = (serviceIds, serviceTypes) => {
  if (!serviceIds) return [];
  const ids = serviceIds.split(",").map(Number);
  return serviceTypes.filter(s => ids.includes(s.ServiceID)).map(s => s.ServiceName);
};

export const getNurseNames = (nurseIds, nursingSpecialists) => {
  if (!nurseIds) return [];
  const ids = nurseIds.split(",").map(Number);
  return nursingSpecialists.filter(n => ids.includes(n.NursingID)).map(n => n.FullName);
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'paid':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'pending':
      return 'Chờ xác nhận';
    case 'cancelled':
      return 'Đã hủy';
    case 'paid':
      return 'Hoàn thành';
    default:
      return 'Không xác định';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Chưa có';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export const filterAppointments = (appointments, searchText, statusFilter, dateFilter) => {
  if (!Array.isArray(appointments)) return [];
  
  return appointments.filter(appointment => {
    if (!appointment) return false;
    
    const bookingId = appointment.bookingID || appointment.BookingID || '';
    const matchesSearch = searchText === '' || 
      bookingId.toString().includes(searchText) ||
      appointment.Note?.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.note?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.Status === statusFilter || appointment.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all' && (appointment.BookingDate || appointment.workdate)) {
      const appointmentDate = new Date(appointment.BookingDate || appointment.workdate);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = appointmentDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = appointmentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = appointmentDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
}; 