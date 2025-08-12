import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import holidayService from '@/services/api/holidayService';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import serviceTypeService from '@/services/api/serviceTypeService';
import { FaFlag, FaCalendarCheck, FaTimes } from 'react-icons/fa';
import workScheduleService from '@/services/api/workScheduleService';

const NurseScheduleTab = ({ workSchedules, nurseBookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localSchedules, setLocalSchedules] = useState(Array.isArray(workSchedules) ? workSchedules : []);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [bookingDetailById, setBookingDetailById] = useState({});
  const [serviceTasksCache, setServiceTasksCache] = useState(null);
  const [serviceTypesCache, setServiceTypesCache] = useState(null);

  const getStatusView = (rawStatus) => {
    const s = (rawStatus || '').toString().toLowerCase();
    switch (s) {
      case 'paid': return { label: 'Đã thanh toán', cls: 'bg-green-100 text-green-800' };
      case 'pending': return { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed': return { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-800' };
      case 'completed': return { label: 'Hoàn thành', cls: 'bg-teal-100 text-teal-800' };
      case 'cancelled': case 'canceled': return { label: 'Đã hủy', cls: 'bg-gray-100 text-gray-800' };
      case 'waiting': return { label: 'Đang chờ', cls: 'bg-gray-100 text-gray-800' };
      case 'isscheduled': case 'scheduled': return { label: 'Đã lên lịch', cls: 'bg-indigo-100 text-indigo-800' };
      case 'holiday': return { label: 'Ngày nghỉ', cls: 'bg-red-100 text-red-800' };
      default: return { label: rawStatus || 'Không xác định', cls: 'bg-gray-100 text-gray-800' };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const holidaysData = await holidayService.getAllHolidays();
        setHolidays(holidaysData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getHolidayByDate = (dateStr) => {
    for (let h of holidays) {
      const start = parseISO(h.startDate);
      const end = parseISO(h.endDate);
      const d = parseISO(dateStr);
      if (isWithinInterval(d, { start, end })) {
        return h;
      }
    }
    return null;
  };

  const getDaysInMonthGrid = (currentMonth) => {
    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  useEffect(() => {
    setLocalSchedules(Array.isArray(workSchedules) ? workSchedules : []);
  }, [workSchedules]);

  const days = getDaysInMonthGrid(currentMonth);
  const workDates = Array.isArray(localSchedules) ? localSchedules.map(ws => (ws.workDate || ws.WorkDate || '').split('T')[0]).filter(Boolean) : [];

  const isWork = (dStr) => workDates.includes(dStr);
  const isHoliday = (dStr) => !!getHolidayByDate(dStr);

  const eventsOfDay = [];
  if (selectedDate) {
    Array.isArray(localSchedules) && localSchedules.filter(ws => (ws.workDate || ws.WorkDate || '').startsWith(selectedDate)).forEach(ws => {
      const workDate = ws.workDate || ws.WorkDate;
      const endTime = ws.endTime || ws.EndTime;
      const bookingId = ws.bookingID || ws.BookingID || ws.bookingId || ws.BookingId || ws.workScheduleID || ws.WorkScheduleID;
      const serviceId = ws.serviceID || ws.ServiceID;
      eventsOfDay.push({
        type: 'booking',
        time: `${workDate ? new Date(workDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''} - ${endTime ? new Date(endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}`,
        label: `Lịch hẹn #${bookingId || '-'}`,
        status: ws.status || ws.Status,
        isAttended: ws.isAttended || ws.IsAttended,
        workObj: ws,
        workDate,
        endTime,
        bookingId,
        serviceId,
      });
    });
    const holiday = getHolidayByDate(selectedDate);
    if (holiday) {
      eventsOfDay.push({
        type: 'holiday',
        workDate: holiday.startDate,
        endTime: holiday.endDate,
        label: holiday.holidayName,
        status: 'holiday',
        holidayObj: holiday,
      });
    }
  }

  const handleDateClick = (date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    setSelectedEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    (async () => {
      if (event?.type === 'booking') {
        const tryFetchById = async (bid) => {
          const serviceId = event?.serviceId || event?.workObj?.serviceID || event?.workObj?.ServiceID;
          const [detail, tasks, svcTasks, svcTypes, serviceMain] = await Promise.all([
            bookingService.getBookingById(bid),
            customizeTaskService.getAllByBooking(bid).catch(() => []),
            serviceTasksCache ? Promise.resolve(serviceTasksCache) : serviceTaskService.getServiceTasks().catch(() => []),
            serviceTypesCache ? Promise.resolve(serviceTypesCache) : (serviceTypeService.getServiceTypes?.() || serviceTypeService.getAllServiceTypes?.() || Promise.resolve([])),
            serviceId ? serviceTypeService.getServiceTypeById(serviceId).catch(() => null) : Promise.resolve(null),
          ]);

          if (!serviceTasksCache && Array.isArray(svcTasks)) setServiceTasksCache(svcTasks);
          if (!serviceTypesCache && Array.isArray(svcTypes)) setServiceTypesCache(svcTypes);

          let patient = detail.careProfile || detail.CareProfile;
          if (!patient) {
            const cpId = detail.careProfileID || detail.CareProfileID;
            if (cpId) {
              try { patient = await careProfileService.getCareProfileById(cpId); } catch (_) { }
            }
          }
          const booker = detail.customer || detail.Customer || detail.account || detail.Account || null;
          const detailTasks = (Array.isArray(tasks) ? tasks : []).map(t => {
            const st = (Array.isArray(svcTasks) ? svcTasks : []).find(x => (x.serviceTaskID || x.ServiceTaskID) === (t.serviceTaskID || t.ServiceTaskID));
            const sv = (Array.isArray(svcTypes) ? svcTypes : []).find(sv => (sv.serviceID || sv.ServiceID) === (t.serviceID || t.ServiceID));
            const serviceName = t.serviceName || t.ServiceName || st?.description || st?.Description || sv?.serviceName || sv?.name || sv?.Name || '-';
            const quantity = t.quantity ?? t.Quantity ?? 1;
            const unitPrice = (t.price ?? t.Price ?? sv?.price ?? 0);
            const total = (t.total ?? t.Total ?? (unitPrice * quantity));
            const status = t.status || t.Status;
            return { serviceName, quantity, price: unitPrice, total, status };
          });
          const bundle = { booking: detail, patient, booker, detailTasks, serviceMain };
          setBookingDetailById(prev => ({ ...prev, [bid]: bundle }));
          setSelectedEvent(prev => ({ ...prev, bookingDetail: bundle }));
        };

        try {
          setEventLoading(true);
          let id = event.bookingId || event.bookingObj?.bookingID || event.bookingObj?.BookingID;
          if (id && bookingDetailById[id]) {
            setSelectedEvent(prev => ({ ...prev, bookingDetail: bookingDetailById[id] }));
            return;
          }
          if (!id) return;
          await tryFetchById(id);
        } catch (e) {
          console.error('Không thể lấy chi tiết booking', e);
        } finally {
          setEventLoading(false);
        }
      }
    })();
  };

  const closeEventDetail = () => {
    setSelectedEvent(null);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50">
      {/* Calendar Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800">Lịch làm việc</h3>
        <div className="flex items-center space-x-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-lg font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy', { locale: vi })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-100">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const hasWork = isWork(dayStr);
            const holiday = getHolidayByDate(dayStr);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isToday ? 'border-blue-400 bg-blue-50' : ''}
                  ${selectedDate === dayStr ? 'border-blue-500 bg-blue-100' : ''}
                `}
              >
                <div className="text-sm font-medium text-gray-800">{format(day, 'd')}</div>
                <div className="mt-2 space-y-1">
                  {hasWork && (
                    <div className="flex items-center text-xs text-green-600">
                      <FaCalendarCheck className="mr-1 w-3 h-3" />
                      <span>Lịch hẹn</span>
                    </div>
                  )}
                  {holiday && (
                    <div className="flex items-center text-xs text-red-600">
                      <FaFlag className="mr-1 w-3 h-3" />
                      <span className="truncate">{holiday.holidayName}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Sự kiện ngày {format(parseISO(selectedDate), 'dd/MM/yyyy')}
          </h4>
          {eventsOfDay.length === 0 ? (
            <p className="text-gray-500 text-sm">Không có sự kiện nào trong ngày này.</p>
          ) : (
            <div className="space-y-3">
              {eventsOfDay.map((event, index) => {
                const typeLabel = event.type === 'holiday' ? 'Ngày nghỉ' : 'Lịch hẹn';
                const typeCls = event.type === 'holiday' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
                return (
                  <div
                    key={index}
                    onClick={() => handleEventClick(event)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${typeCls}`}>
                          {typeLabel}
                        </span>
                        <span className="text-sm font-medium text-gray-800">{event.label}</span>
                      </div>
                      <span className="text-xs text-gray-600">{event.time || '-'}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      Trạng thái: <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusView(event.status).cls}`}>
                        {getStatusView(event.status).label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Chi tiết sự kiện</h3>
              <button onClick={closeEventDetail} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Booking Info and Attendance */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Thông tin sự kiện</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-24 font-medium text-gray-700">Loại:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${selectedEvent.type === 'holiday' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {selectedEvent.type === 'holiday' ? 'Ngày nghỉ' : 'Lịch hẹn'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 font-medium text-gray-700">Thời gian:</span>
                      <span className="text-gray-600">{selectedEvent.time || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 font-medium text-gray-700">Trạng thái:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusView(selectedEvent.status).cls}`}>
                        {getStatusView(selectedEvent.status).label}
                      </span>
                    </div>
                  </div>
                </div>
                {(selectedEvent.type === 'booking' || (selectedEvent.type === 'work' && selectedEvent.bookingDetail)) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Thông tin lịch hẹn</h4>
                    {eventLoading && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500 mr-2"></div>
                        Đang tải chi tiết booking...
                      </div>
                    )}
                    {(() => {
                      const bundle = selectedEvent.bookingDetail || {};
                      const detail = bundle.booking || selectedEvent.bookingObj || {};
                      const mainService = bundle.serviceMain || null;
                      const bookingCode = selectedEvent.bookingId || detail.bookingID || detail.BookingID || '-';
                      const workdate = detail.workdate || detail.workDate || detail.WorkDate;
                      const sv = getStatusView(detail.status || detail.Status || selectedEvent.status);
                      return (
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center">
                            <span className="w-24 font-medium text-gray-700">Mã:</span>
                            <span className="font-medium">#{bookingCode}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 font-medium text-gray-700">Trạng thái:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${sv.cls}`}>{sv.label}</span>
                          </div>
                          {mainService && (
                            <div className="flex items-center">
                              <span className="w-24 font-medium text-gray-700">Dịch vụ chính:</span>
                              <span className="font-medium">{mainService.serviceName || mainService.name || mainService.Name || '-'}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="w-24 font-medium text-gray-700">Ngày làm việc:</span>
                            <span>{workdate ? new Date(workdate).toLocaleString('vi-VN') : '-'}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                {selectedEvent.workObj && selectedEvent.status?.toLowerCase() !== 'cancelled' && selectedEvent.status?.toLowerCase() !== 'canceled' && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <span className="w-24 font-medium text-gray-700">Đã tham gia:</span>
                      <span className="text-gray-600">{selectedEvent.isAttended ? 'Có' : 'Chưa'}</span>
                    </div>
                    {!selectedEvent.isAttended && (
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={async () => {
                          const id = selectedEvent.workObj.workScheduleID || selectedEvent.workObj.WorkScheduleID;
                          try {
                            await workScheduleService.updateIsAttended(id);
                            setSelectedEvent(prev => ({ ...prev, isAttended: true, status: 'completed' }));
                            setLocalSchedules(prev => prev.map(ws => {
                              const wsId = ws.workScheduleID || ws.WorkScheduleID;
                              if (wsId === id) {
                                return { ...ws, isAttended: true, IsAttended: true, status: 'completed', Status: 'completed' };
                              }
                              return ws;
                            }));
                          } catch (e) {
                            alert(e?.message || 'Không thể điểm danh');
                          }
                        }}
                      >
                        Điểm danh
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Patient and Services */}
              {(selectedEvent.type === 'booking' || (selectedEvent.type === 'work' && selectedEvent.bookingDetail)) && (
                <div className="space-y-4">
                  {(() => {
                    const bundle = selectedEvent.bookingDetail || {};
                    const detail = bundle.booking || selectedEvent.bookingObj || {};
                    const patient = bundle.patient || detail.careProfile || detail.CareProfile || {};
                    const patientName = patient.profileName || 'Không xác định';
                    const phone = patient.phoneNumber || '-';
                    const addr = patient.address || patient.Address || patient.addressDetail || patient.AddressDetail || '-';
                    const tasks = bundle.detailTasks || [];
                    const tasksTotal = tasks.reduce((sum, t) => sum + (t.total || 0), 0);

                    return (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Bệnh nhân</h4>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-24 font-medium text-gray-700">Họ tên:</span>
                              <span className="font-medium">{patientName}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-24 font-medium text-gray-700">SĐT:</span>
                              <span>{phone}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-24 font-medium text-gray-700">Địa chỉ:</span>
                              <span>{addr}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Dịch vụ chi tiết</h4>
                          <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200 rounded-lg">
                              <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium">Dịch vụ</th>
                                  <th className="px-4 py-2 text-right font-medium">SL</th>
                                  <th className="px-4 py-2 text-right font-medium">Đơn giá</th>
                                  <th className="px-4 py-2 text-right font-medium">Thành tiền</th>
                                  <th className="px-4 py-2 text-left font-medium">Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tasks.length === 0 && (
                                  <tr><td colSpan={5} className="px-4 py-3 text-center text-gray-500">Không có dịch vụ.</td></tr>
                                )}
                                {tasks.map((t, idx) => (
                                  <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">{t.serviceName}</td>
                                    <td className="px-4 py-2 text-right">{t.quantity || 1}</td>
                                    <td className="px-4 py-2 text-right">{(t.price || 0).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-4 py-2 text-right">{(t.total || 0).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-4 py-2">
                                      <span className={`px-2 py-1 rounded text-xs ${getStatusView(t.status).cls}`}>
                                        {getStatusView(t.status).label || '-'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              {tasks.length > 0 && (
                                <tfoot>
                                  <tr className="border-t bg-gray-100">
                                    <td className="px-4 py-2 text-right font-semibold" colSpan={3}>Tổng</td>
                                    <td className="px-4 py-2 text-right font-semibold">{tasksTotal.toLocaleString('vi-VN')}đ</td>
                                    <td></td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeEventDetail}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseScheduleTab;