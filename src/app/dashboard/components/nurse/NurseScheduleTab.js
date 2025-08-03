import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import holidayService from '@/services/api/holidayService';
import careProfileService from '@/services/api/careProfileService';
import customizePackageService from '@/services/api/customizePackageService';
import { FaRegClock, FaFlag, FaCalendarCheck } from 'react-icons/fa';

// const NurseScheduleTab = ({ workSchedules, nurseBookings }) => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [holidays, setHolidays] = useState([]);
//   const [careProfiles, setCareProfiles] = useState([]);
//   const [customizePackages, setCustomizePackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [holidaysData, careProfilesData, customizePackagesData] = await Promise.all([
//           holidayService.getAllHolidays(),
//           careProfileService.getAllCareProfiles(),
//           customizePackageService.getAllCustomizePackages()
//         ]);
//         setHolidays(holidaysData);
//         setCareProfiles(careProfilesData);
//         setCustomizePackages(customizePackagesData);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getHolidayByDate = (dateStr) => {
//     for (let h of holidays) {
//       const start = parseISO(h.startDate);
//       const end = parseISO(h.endDate);
//       const d = parseISO(dateStr);
//       if (isWithinInterval(d, { start, end })) {
//         return h;
//       }
//     }
//     return null;
//   };

//   const getDaysInMonthGrid = (currentMonth) => {
//     const startMonth = startOfMonth(currentMonth);
//     const endMonth = endOfMonth(currentMonth);
//     const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
//     const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
//     const days = [];
//     let day = startDate;
//     while (day <= endDate) {
//       days.push(day);
//       day = addDays(day, 1);
//     }
//     return days;
//   };

//   const days = getDaysInMonthGrid(currentMonth);
//   const workDates = workSchedules.map(ws => ws.workDate?.split('T')[0]).filter(Boolean);
//   // Sửa: lấy ngày booking từ WorkDate (theo mock mới)
//   const bookingDates = nurseBookings.map(b => b.workDate?.split('T')[0]).filter(Boolean);

//   // Highlight ngày có ca trực, lịch hẹn, hoặc ngày nghỉ
//   const isWork = (dStr) => workDates.includes(dStr);
//   const isBooking = (dStr) => bookingDates.includes(dStr);
//   const isHoliday = (dStr) => !!getHolidayByDate(dStr);

//   // Lấy sự kiện trong ngày đã chọn
//   const eventsOfDay = [];
//   if (selectedDate) {
//     // Ca trực
//     workSchedules.filter(ws => ws.workDate?.startsWith(selectedDate)).forEach(ws => {
//       eventsOfDay.push({
//         type: 'work',
//         time: `${new Date(ws.workDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(ws.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
//         label: `Ca trực #${ws.workScheduleID}`,
//         status: ws.status,
//         isAttended: ws.isAttended,
//         workObj: ws,
//       });
//     });
//     // Lịch hẹn (Booking) chỉ lấy từ nurseBookings
//     nurseBookings.filter(b => b.workDate?.startsWith(selectedDate)).forEach(b => {
//       eventsOfDay.push({
//         type: 'booking',
//         time: b.workDate ? new Date(b.workDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
//         label: `Lịch hẹn #${b.bookingID}`,
//         status: b.status,
//         bookingObj: b,
//       });
//     });
//   }

//   const handleDateClick = (date) => {
//     setSelectedDate(format(date, 'yyyy-MM-dd'));
//     setSelectedEvent(null);
//   };

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//   };

//   const closeEventDetail = () => {
//     setSelectedEvent(null);
//   };

//   const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
//   const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="text-red-500 mb-4">⚠️</div>
//           <p className="text-red-600">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
//           >
//             Thử lại
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Calendar Header */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold">Lịch làm việc</h3>
//         <div className="flex items-center space-x-4">
//           <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
//             ←
//           </button>
//           <span className="text-lg font-semibold">
//             {format(currentMonth, 'MMMM yyyy', { locale: require('date-fns/locale/vi') })}
//           </span>
//           <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
//             →
//           </button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {/* Weekday Headers */}
//         <div className="grid grid-cols-7 bg-gray-50">
//           {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
//             <div key={day} className="p-3 text-center font-semibold text-gray-600">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Calendar Days */}
//         <div className="grid grid-cols-7">
//           {days.map((day, index) => {
//             const dayStr = format(day, 'yyyy-MM-dd');
//             const isCurrentMonth = isSameMonth(day, currentMonth);
//             const isToday = isSameDay(day, new Date());
//             const hasWork = isWork(dayStr);
//             const hasBooking = isBooking(dayStr);
//             const holiday = getHolidayByDate(dayStr);

//             return (
//               <div
//                 key={index}
//                 onClick={() => handleDateClick(day)}
//                 className={`
//                   min-h-[80px] p-2 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
//                   ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
//                   ${isToday ? 'bg-blue-50 border-blue-300' : ''}
//                   ${selectedDate === dayStr ? 'bg-purple-100 border-purple-300' : ''}
//                 `}
//               >
//                 <div className="text-sm font-medium mb-1">
//                   {format(day, 'd')}
//                 </div>
                
//                 {/* Event Indicators */}
//                 <div className="space-y-1">
//                   {hasWork && (
//                     <div className="flex items-center text-xs text-blue-600">
//                       <FaRegClock className="mr-1" />
//                       <span>Ca trực</span>
//                     </div>
//                   )}
//                   {hasBooking && (
//                     <div className="flex items-center text-xs text-green-600">
//                       <FaCalendarCheck className="mr-1" />
//                       <span>Lịch hẹn</span>
//                     </div>
//                   )}
//                   {holiday && (
//                     <div className="flex items-center text-xs text-red-600">
//                       <FaFlag className="mr-1" />
//                       <span>{holiday.holidayName}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Selected Date Events */}
//       {selectedDate && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h4 className="text-lg font-semibold mb-4">
//             Sự kiện ngày {format(parseISO(selectedDate), 'dd/MM/yyyy')}
//           </h4>
          
//           {eventsOfDay.length === 0 ? (
//             <p className="text-gray-500">Không có sự kiện nào trong ngày này.</p>
//           ) : (
//             <div className="space-y-3">
//               {eventsOfDay.map((event, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleEventClick(event)}
//                   className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
//                         event.type === 'work' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                       }`}>
//                         {event.type === 'work' ? 'Ca trực' : 'Lịch hẹn'}
//                       </span>
//                       <span className="ml-2 text-sm font-medium">{event.label}</span>
//                     </div>
//                     <span className="text-sm text-gray-600">{event.time}</span>
//                   </div>
//                   <div className="mt-1 text-sm text-gray-500">
//                     Trạng thái: {event.status}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Event Detail Modal */}
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Chi tiết sự kiện</h3>
//               <button onClick={closeEventDetail} className="text-gray-400 hover:text-gray-600">
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-3">
//               <div>
//                 <span className="font-medium">Loại:</span>
//                 <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-medium ${
//                   selectedEvent.type === 'work' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                 }`}>
//                   {selectedEvent.type === 'work' ? 'Ca trực' : 'Lịch hẹn'}
//                 </span>
//               </div>
//               <div>
//                 <span className="font-medium">Thời gian:</span>
//                 <span className="ml-2">{selectedEvent.time}</span>
//               </div>
//               <div>
//                 <span className="font-medium">Trạng thái:</span>
//                 <span className="ml-2">{selectedEvent.status}</span>
//               </div>
//               {selectedEvent.type === 'work' && selectedEvent.workObj && (
//                 <div>
//                   <span className="font-medium">Đã tham gia:</span>
//                   <span className="ml-2">{selectedEvent.isAttended ? 'Có' : 'Chưa'}</span>
//                 </div>
//               )}
//             </div>
            
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={closeEventDetail}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//               >
//                 Đóng
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
 const NurseScheduleTab = () => {
  return (
    <div>
      <h1>Nurse Schedule Tab</h1>
    </div>
  );
 };
export default NurseScheduleTab; 