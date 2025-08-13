// appointmentUtils.js
export const STATUS_MAP = {
  pending: { color: 'yellow', text: 'Chờ thanh toán', sortOrder: 1 },
  scheduled: { color: 'purple', text: 'Đã lên lịch', sortOrder: 2 },
  paid: { color: 'blue', text: 'Đã thanh toán', sortOrder: 3 },
  completed: { color: 'green', text: 'Hoàn thành', sortOrder: 4 },
  cancelled: { color: 'red', text: 'Đã hủy', sortOrder: 5 },
  all: { color: 'gray', text: 'Tất cả', sortOrder: 99 }
};

export const getStatusColor = (status) =>
  STATUS_MAP[normalizeStatus({ status })]?.color || 'gray';

export const getStatusText = (status) =>
  STATUS_MAP[status]?.text || status;

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const normalizeStatus = (appointment) => {
  const rawStatus = String(appointment?.status ?? appointment?.Status ?? '').toLowerCase().trim();

  // Ưu tiên trạng thái 'completed' nếu có cờ isSchedule
  const scheduleFlags = [
    'isSchedule', 'isScheduled', 'isscheduled', 'is_scheduled', 'isshedule'
  ];
  const hasScheduleFlag = scheduleFlags.some(
    key => appointment?.[key] === true || String(appointment?.[key]).toLowerCase() === 'true'
  );

  if (rawStatus === 'completed' && hasScheduleFlag) return 'completed';
  if (rawStatus === 'paid' && hasScheduleFlag) return 'scheduled';
  if (rawStatus === 'paid') return 'paid';
  if (rawStatus === 'cancelled' || rawStatus === 'canceled') return 'cancelled';
  if (rawStatus === 'pending' || rawStatus === 'unpaid') return 'pending';

  return 'pending';
};

export const filterAppointments = (appointments, searchText, statusFilter, dateFilter) => {
  return appointments.filter(app => {
    const lowerSearch = searchText?.toLowerCase() || '';
    const matchesSearch =
      !searchText ||
      [
        app.careProfile?.profileName,
        app.careProfile?.phoneNumber,
        app.careProfile?.address,
        String(app.bookingID ?? '')
      ].some(field => (field || '').toLowerCase().includes(lowerSearch));

    const matchesStatus = statusFilter === 'all' || normalizeStatus(app) === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const appDate = new Date(app.bookingDate || app.date || app.createdAt);
      if (dateFilter === 'today') {
        matchesDate = appDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        matchesDate = appDate >= weekStart && appDate <= weekEnd;
      } else if (dateFilter === 'month') {
        matchesDate =
          appDate.getMonth() === now.getMonth() &&
          appDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });
};

export const normalizeCareProfile = (cp) => ({
  ...cp,
  profileName: cp.profileName ?? cp.ProfileName ?? cp.fullName ?? cp.name ?? 'Không xác định',
  phoneNumber: cp.phoneNumber ?? cp.PhoneNumber ?? cp.Phone ?? '',
  address: cp.address ?? cp.Address ?? '',
  zoneDetailID: cp.zoneDetailID ?? cp.ZoneDetailID ?? cp.Zone_DetailID
});

export const normalizeCustomizeTask = (t) => ({
  ...t,
  customizeTaskID: t.customizeTaskID ?? t.CustomizeTaskID ?? t.id,
  serviceID: t.serviceID ?? t.ServiceID,
  bookingID: t.bookingID ?? t.BookingID,
  nursingID: t.nursingID ?? t.NursingID ?? null,
  status: t.status ?? t.Status ?? 'pending'
});
