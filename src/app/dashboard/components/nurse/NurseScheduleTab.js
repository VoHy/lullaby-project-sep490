import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import holidays from '@/mock/Holiday';
import careProfiles from '@/mock/CareProfile';
import customerPackages from '@/mock/CustomerPackage';
import { FaRegClock, FaFlag, FaCalendarCheck } from 'react-icons/fa';

const getHolidayByDate = (dateStr) => {
  for (let h of holidays) {
    const start = parseISO(h.StartDate);
    const end = parseISO(h.EndDate);
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

const NurseScheduleTab = ({ workSchedules, nurseBookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const days = getDaysInMonthGrid(currentMonth);
  const workDates = workSchedules.map(ws => ws.WorkDate.split('T')[0]);
  const bookingDates = nurseBookings.map(b => b.work_date?.split('T')[0]).filter(Boolean);

  // Highlight ngày có ca trực, lịch hẹn, hoặc ngày nghỉ
  const isWork = (dStr) => workDates.includes(dStr);
  const isBooking = (dStr) => bookingDates.includes(dStr);
  const isHoliday = (dStr) => !!getHolidayByDate(dStr);

  // Lấy sự kiện trong ngày đã chọn
  const eventsOfDay = [];
  if (selectedDate) {
    // Ca trực
    workSchedules.filter(ws => ws.WorkDate.startsWith(selectedDate)).forEach(ws => {
      eventsOfDay.push({
        type: 'work',
        time: `${new Date(ws.WorkDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(ws.EndTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        label: `Ca trực #${ws.WorkScheduleID}`,
        status: ws.Status,
        isAttended: ws.IsAttended,
        workObj: ws,
      });
    });
    // Lịch hẹn (Booking) chỉ lấy từ nurseBookings
    nurseBookings.filter(b => b.work_date?.startsWith(selectedDate)).forEach(b => {
      eventsOfDay.push({
        type: 'booking',
        time: `${new Date(b.work_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        label: `Lịch hẹn #${b.BookingID}`,
        status: b.status,
        patient: b.CareProfileID,
        bookingObj: b,
      });
    });
    // Ngày nghỉ
    const holiday = getHolidayByDate(selectedDate);
    if (holiday) {
      eventsOfDay.push({
        type: 'holiday',
        label: `Ngày nghỉ: ${holiday.HolidayName}`,
        time: `${format(parseISO(holiday.StartDate), 'dd/MM/yyyy')} - ${format(parseISO(holiday.EndDate), 'dd/MM/yyyy')}`,
        holidayObj: holiday,
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Calendar custom */}
      <div className="bg-white rounded shadow p-4 w-full md:w-1/3 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
          <span className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 w-full text-center text-xs font-semibold text-gray-500 mb-1">
          {['T2','T3','T4','T5','T6','T7','CN'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 w-full">
          {days.map((day, idx) => {
            const dStr = format(day, 'yyyy-MM-dd');
            if (!isSameMonth(day, currentMonth)) return <div key={idx}></div>;
            const today = isSameDay(day, new Date());
            const selected = selectedDate === dStr;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(dStr);
                  setSelectedEvent(null);
                }}
                className={`
                  flex items-center justify-center
                  w-9 h-9 md:w-10 md:h-10
                  rounded-full mx-auto
                  text-base
                  transition
                  ${isWork(dStr) ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                  ${isBooking(dStr) ? 'bg-green-100 text-green-700 font-bold' : ''}
                  ${isHoliday(dStr) ? 'bg-red-100 text-red-700 font-bold' : ''}
                  ${today ? 'border border-blue-400' : ''}
                  ${selected ? 'bg-purple-500 text-white shadow-lg' : ''}
                  hover:bg-purple-200
                `}
                title={
                  isHoliday(dStr)
                    ? (() => {
                        const h = getHolidayByDate(dStr);
                        return h ? `Nghỉ lễ: ${h.HolidayName}` : '';
                      })()
                    : ''
                }
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
      {/* Timeline sự kiện */}
      <div className="bg-white rounded shadow p-4 w-full md:w-2/3 min-h-[350px]">
        {!selectedDate && (
          <div className="text-gray-400 text-center mt-10">Chọn ngày để xem chi tiết lịch hẹn, ca trực hoặc ngày nghỉ</div>
        )}
        {selectedDate && (
          <>
            <h4 className="font-bold text-purple-700 mb-2">
              {format(new Date(selectedDate), 'EEEE, dd/MM/yyyy')}
            </h4>
            {eventsOfDay.length === 0 && (
              <div className="text-gray-500">Không có sự kiện nào.</div>
            )}
            {eventsOfDay.map((ev, idx) => (
              <div
                key={idx}
                className={`
                  mb-3 p-3 rounded shadow flex items-center gap-3
                  ${ev.type === 'work' ? 'bg-blue-50' : ev.type === 'booking' ? 'bg-green-50' : 'bg-red-100'}
                  cursor-pointer
                  ${selectedEvent === ev ? 'ring-2 ring-purple-400' : ''}
                `}
                onClick={() => setSelectedEvent(ev)}
              >
                <div>
                  {ev.type === 'work' ? (
                    <FaRegClock className="text-blue-500 text-lg" />
                  ) : ev.type === 'booking' ? (
                    <FaCalendarCheck className="text-green-500 text-lg" />
                  ) : (
                    <FaFlag className="text-red-500 text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${ev.type === 'work' ? 'text-blue-700' : ev.type === 'booking' ? 'text-green-700' : 'text-red-700'} text-base`}>
                    {ev.label}
                  </div>
                  <div className="text-sm text-gray-600">{ev.time}</div>
                  {ev.type === 'work' && (
                    <>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ev.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {ev.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${ev.isAttended ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {ev.isAttended ? 'Đã điểm danh' : 'Chưa điểm danh'}
                      </span>
                    </>
                  )}
                  {ev.type === 'booking' && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ev.status === 'completed' ? 'bg-green-100 text-green-700' : ev.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {ev.status === 'completed' ? 'Hoàn thành' : ev.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {/* Hiển thị chi tiết sự kiện đã chọn (nếu có) */}
            {selectedEvent && selectedEvent.type === 'booking' && (() => {
              const b = selectedEvent.bookingObj;
              const patient = careProfiles.find(p => p.CareProfileID === b.CareProfileID);
              const customerPackage = customerPackages.find(pkg => pkg.CustomizePackageID === b.CustomizePackageID);
              return (
                <div className="mt-4 p-4 bg-green-50 rounded shadow">
                  <h4 className="text-lg font-bold text-green-700 mb-2">Chi tiết lịch hẹn #{b.BookingID}</h4>
                  <div className="mb-2"><span className="font-semibold">Bệnh nhân:</span> {patient?.ProfileName}</div>
                  <div className="mb-2"><span className="font-semibold">Địa chỉ:</span> {patient?.Address}</div>
                  <div className="mb-2"><span className="font-semibold">Gói dịch vụ:</span> {customerPackage?.Name}</div>
                  <div className="mb-2"><span className="font-semibold">Thời gian:</span> {b.work_date ? new Date(b.work_date).toLocaleString('vi-VN') : '-'}</div>
                  <div className="mb-2"><span className="font-semibold">Trạng thái:</span> {b.status}</div>
                </div>
              );
            })()}
          </>
        )}
      </div>
  </div>
);
};

export default NurseScheduleTab; 