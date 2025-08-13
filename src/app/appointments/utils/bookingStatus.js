// bookingStatus.js - dùng chung cho status booking

export function getBookingStatusText(status, isSchedule) {
  if (isSchedule === false && status === 'paid') return 'Chưa lên lịch';
  if (isSchedule === true && status === 'paid') return 'Đã lên lịch';
  switch (String(status).toLowerCase()) {
    case 'pending': return 'Đang chờ';
    case 'completed': return 'Hoàn thành';
    case 'cancelled':
    case 'canceled': return 'Đã hủy';
    case 'isScheduled': return 'Đã lên lịch';
    case 'unpaid': return 'Chưa thanh toán';
    case 'paid': return isSchedule ? 'Đã lên lịch' : 'Chưa lên lịch';
    default: return 'Không xác định';
  }
}

export function getBookingStatusColor(status, isSchedule) {
  if (status === 'paid' && isSchedule === false) return 'bg-yellow-100 text-yellow-700'; // Chưa lên lịch
  if (status === 'paid' && isSchedule === true) return 'bg-blue-100 text-blue-700'; // Đã lên lịch
  switch (String(status).toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'completed': return 'bg-green-100 text-green-700';
    case 'cancelled':
    case 'canceled': return 'bg-red-100 text-red-700';
    case 'isScheduled': return 'bg-blue-100 text-blue-700';
    case 'unpaid': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
