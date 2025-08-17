'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, addDays, format,
  isSameMonth, isSameDay, isWithinInterval, parseISO
} from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  FaFlag, FaCalendarCheck, FaTimes, FaUser, FaClipboardList,
  FaMoneyBillWave, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaPlus
} from 'react-icons/fa';

import holidayService from '@/services/api/holidayService';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import serviceTypeService from '@/services/api/serviceTypeService';
import workScheduleService from '@/services/api/workScheduleService';
import medicalNoteService from '@/services/api/medicalNoteService';
import { AuthContext } from '@/context/AuthContext';

export default function NurseScheduleTab({ workSchedules = [] }) {
  // Modal xem/sửa MedicalNote
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [editNotePayload, setEditNotePayload] = useState({ note: '', advice: '', image: '', medicalNoteID: null });
  const [editNoteLoading, setEditNoteLoading] = useState(false);
  const [editNoteMeta, setEditNoteMeta] = useState({ task: null, booking: null, careProfile: null });
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localSchedules, setLocalSchedules] = useState(Array.isArray(workSchedules) ? workSchedules : []);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [error, setError] = useState(null);

  // Medical Note modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [notePayload, setNotePayload] = useState({ note: '', advice: '', imageFile: null, relativeID: null });
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [currentCustomizeTask, setCurrentCustomizeTask] = useState(null); // task object being annotated

  // caches to avoid repeated calls
  const cacheRef = useRef({
    bookings: new Map(),
    serviceTasks: null,
    serviceTypes: null,
    medicalNotes: null
  });

  const getStatusView = (rawStatus) => {
    const s = (rawStatus || '').toString().toLowerCase();
    switch (s) {
      case 'paid': return { label: 'Đã thanh toán', cls: 'bg-green-600 text-white' };
      case 'pending': return { label: 'Chờ xử lý', cls: 'bg-yellow-500 text-white' };
      case 'confirmed': return { label: 'Đã xác nhận', cls: 'bg-blue-600 text-white' };
      case 'completed': return { label: 'Hoàn thành', cls: 'bg-teal-600 text-white' };
      case 'cancelled': case 'canceled': return { label: 'Đã hủy', cls: 'bg-gray-500 text-white' };
      case 'waiting': return { label: 'Đang chờ', cls: 'bg-gray-500 text-white' };
      case 'isscheduled': case 'scheduled': return { label: 'Đã lên lịch', cls: 'bg-indigo-600 text-white' };
      case 'holiday': return { label: 'Ngày nghỉ', cls: 'bg-red-600 text-white' };
      default: return { label: rawStatus || 'Không xác định', cls: 'bg-gray-500 text-white' };
    }
  };

  // preload holidays, serviceTasks, serviceTypes, medicalNotes once
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        try {
          const hs = await holidayService.getAllHolidays();
          setHolidays(hs || []);
        } catch (e) {
          console.error('Holiday fetch error', e);
          setHolidays([]);
        }

        if (!cacheRef.current.serviceTasks) {
          try {
            cacheRef.current.serviceTasks = await (serviceTaskService.getServiceTasks?.() || serviceTaskService.getAllServiceTasks?.() || []);
          } catch (e) {
            console.warn('serviceTasks fetch failed', e);
            cacheRef.current.serviceTasks = [];
          }
        }
        if (!cacheRef.current.serviceTypes) {
          try {
            cacheRef.current.serviceTypes = await (serviceTypeService.getAllServiceTypes?.() || serviceTypeService.getServiceTypes?.() || []);
          } catch (e) {
            console.warn('serviceTypes fetch failed', e);
            cacheRef.current.serviceTypes = [];
          }
        }
        if (!cacheRef.current.medicalNotes) {
          try {
            cacheRef.current.medicalNotes = await medicalNoteService.getAllMedicalNotes();
          } catch (e) {
            console.warn('medicalNotes fetch failed', e);
            cacheRef.current.medicalNotes = [];
          }
        }
      } catch (e) {
        console.error(e);
        setError('Không tải được dữ liệu ban đầu.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // update localSchedules when props change
  useEffect(() => {
    setLocalSchedules(Array.isArray(workSchedules) ? workSchedules : []);
  }, [workSchedules]);

  const getHolidayByDate = (dateStr) => {
    for (let h of holidays) {
      try {
        const start = parseISO(h.startDate);
        const end = parseISO(h.endDate);
        const d = parseISO(dateStr);
        if (isWithinInterval(d, { start, end })) return h;
      } catch (e) { /* ignore parse errors */ }
    }
    return null;
  };

  const getDaysInMonthGrid = (month) => {
    const startMonth = startOfMonth(month);
    const endMonth = endOfMonth(month);
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

  // fetchBookingBundle: booking + careProfile + customize tasks + serviceMain, normalized detailTasks
  const fetchBookingBundle = async (bookingId, fallbackServiceId, workObj = null) => {
    if (!bookingId) return null;
    if (cacheRef.current.bookings.has(bookingId)) {
      return cacheRef.current.bookings.get(bookingId);
    }

    let bookingDetail = null;
    try {
      bookingDetail = await bookingService.getBookingById(bookingId);
    } catch (e) {
      console.error('Booking API Error:', e);
      bookingDetail = null;
    }

    // careProfile
    let careProfile = null;
    try {
      careProfile = bookingDetail?.careProfile || bookingDetail?.CareProfile || null;
      if (!careProfile) {
        const cpId = bookingDetail?.careProfileID || bookingDetail?.CareProfileID || bookingDetail?.careProfileId;
        if (cpId) {
          careProfile = await careProfileService.getCareProfileById(cpId).catch(e => {
            console.error('CareProfile API Error:', e);
            return null;
          });
        }
      }
    } catch (e) {
      console.error('CareProfile handling error', e);
      careProfile = null;
    }

    // customize tasks
    let customizeTasks = null;
    try {
      const ctId = bookingDetail?.customizeTaskID || bookingDetail?.CustomizeTaskID || bookingDetail?.customizeTaskId;
      if (ctId && customizeTaskService.getCustomizeTaskById) {
        customizeTasks = await customizeTaskService.getCustomizeTaskById(ctId).catch(() => null);
      } else if (customizeTaskService.getAllByBooking) {
        customizeTasks = await customizeTaskService.getAllByBooking(bookingId).catch(() => []);
      } else {
        customizeTasks = null;
      }
    } catch (e) {
      console.error('Customize tasks error', e);
      customizeTasks = null;
    }

    const serviceTasksList = cacheRef.current.serviceTasks || [];
    const serviceTypesList = cacheRef.current.serviceTypes || [];

    // serviceMain prefer booking.serviceID then fallback
    let serviceMain = null;
    try {
      const sid = bookingDetail?.serviceID || bookingDetail?.ServiceID || bookingDetail?.serviceId || fallbackServiceId || workObj?.serviceID || workObj?.ServiceID;
      if (sid && serviceTypeService.getServiceTypeById) {
        serviceMain = await serviceTypeService.getServiceTypeById(sid).catch(() => null);
      } else if (Array.isArray(serviceTypesList) && serviceTypesList.length > 0 && sid) {
        serviceMain = serviceTypesList.find(st => (st.serviceID || st.ServiceID) === sid) || null;
      }
    } catch (e) { console.error('ServiceMain error', e); serviceMain = null; }

    // normalize detailTasks from customizeTasks (array or single) and attach correct medicalNote
    let detailTasksNormalized = [];
    try {
      const tasksArray = Array.isArray(customizeTasks) ? customizeTasks : (customizeTasks ? [customizeTasks] : []);
      const allMedicalNotes = cacheRef.current.medicalNotes || [];
      detailTasksNormalized = (tasksArray || []).map(t => {
        const stKey = t.serviceTaskID || t.ServiceTaskID || t.serviceTaskId;
        const svKey = t.serviceID || t.ServiceID || t.serviceId;
        const stMeta = serviceTasksList.find(x => (x.serviceTaskID || x.ServiceTaskID) === stKey) || null;
        const svMeta = serviceTypesList.find(x => (x.serviceID || x.ServiceID) === svKey) || null;

        const serviceName = t.serviceName || t.ServiceName || stMeta?.description || svMeta?.serviceName || '-';
        const quantity = t.quantity ?? t.Quantity ?? 1;
        const price = (t.price ?? t.Price) ?? svMeta?.price ?? 0;
        const total = (t.total ?? t.Total) ?? (price * quantity);

        // Lọc medicalNote đúng customizeTaskID và nursingID
        const taskNursingID = t.nursingID || t.NursingID;
        const taskCustomizeTaskID = t.customizeTaskID || t.CustomizeTaskID || t.customizeTaskId;
        const medicalNotes = allMedicalNotes.filter(mn => {
          const mnTaskID = mn.customizeTaskID || mn.CustomizeTaskID || mn.customizeTaskId;
          const mnNursingID = mn.nursingID || mn.NursingID;
          return mnTaskID === taskCustomizeTaskID && mnNursingID === taskNursingID;
        });

        return {
          ...t, // preserve original fields like customizeTaskID, nursingID, status...
          serviceName,
          quantity,
          price,
          total,
          status: t.status || t.Status || null,
          medicalNotes
        };
      });
    } catch (e) {
      console.error('Detail tasks normalization error', e);
      detailTasksNormalized = [];
    }

    const bundle = {
      booking: bookingDetail,
      careProfile,
      detailTasks: detailTasksNormalized,
      serviceType: serviceMain,
      serviceMain
    };

    cacheRef.current.bookings.set(bookingId, bundle);
    return bundle;
  };

  // handle event click
  const handleEventClick = async (event) => {
    if (!event) return;
    setSelectedEvent(event);
    if (event.type !== 'booking') return;

    setEventLoading(true);
    try {
      const bid = event.bookingId || event.bookingID || event.workObj?.bookingID || event.workObj?.BookingID;
      const fallbackServiceId = event.serviceId || event.serviceID || event.workObj?.serviceID;
      if (!bid) {
        console.warn('No booking id in event', event);
        setEventLoading(false);
        return;
      }

      if (cacheRef.current.bookings.has(bid)) {
        const cached = cacheRef.current.bookings.get(bid);
        setSelectedEvent(prev => ({ ...prev, bookingDetail: cached }));
        setEventLoading(false);
        return;
      }

      const bundle = await fetchBookingBundle(bid, fallbackServiceId, event.workObj);
      setSelectedEvent(prev => ({ ...prev, bookingDetail: bundle }));
    } catch (e) {
      console.error('Error fetching event details:', e);
      setError('Không thể tải chi tiết sự kiện.');
    } finally {
      setEventLoading(false);
    }
  };

  // mark attended AFTER endTime only, show work time in alerts
  const markAttended = async (ws) => {
    if (!ws) return;
    const id = ws.workScheduleID || ws.WorkScheduleID;
    if (!id) return;

    const startTime = new Date(ws.workDate || ws.WorkDate);
    const endTime = new Date(ws.endTime || ws.EndTime);
    const now = new Date();

    const workTimeStr = `${startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

    if (isNaN(endTime.getTime())) {
      // if endTime invalid, allow but warn
      if (!confirm(`Không có thời gian kết thúc hợp lệ cho ca làm. Bạn vẫn muốn điểm danh?\nCa làm: ${workTimeStr}`)) return;
    } else {
      if (now < endTime) {
        alert(`Chưa đến giờ điểm danh! Ca làm: ${workTimeStr}\nChỉ được điểm danh sau khi ca làm kết thúc.`);
        return;
      }
    }

    try {
      await workScheduleService.updateIsAttended(id);
      setSelectedEvent(prev => {
        const next = { ...prev, isAttended: true, status: 'completed' };
        if (next.bookingDetail && next.bookingDetail.booking) {
          next.bookingDetail.booking.status = 'completed';
        }
        return next;
      });
      setLocalSchedules(prev => prev.map(item => {
        const wid = item.workScheduleID || item.WorkScheduleID;
        if (wid === id) {
          return { ...item, isAttended: true, IsAttended: true, status: 'completed', Status: 'completed' };
        }
        return item;
      }));
      alert(`Điểm danh thành công!\nCa làm: ${workTimeStr}`);
    } catch (e) {
      console.error('updateIsAttended failed', e);
      alert(e?.message || 'Không thể điểm danh');
    }
  };

  // helper to convert file to base64 string
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // open add-note modal for a customizeTask
  const openAddNoteModal = (task) => {
    setCurrentCustomizeTask(task);
    setNotePayload({ note: '', advice: '', imageFile: null, relativeID: null });
    setShowNoteModal(true);
  };

  // submit medical note
  const submitMedicalNote = async () => {
    if (!currentCustomizeTask) return;

    // use the logged-in user's nursingID as authoritative
    const nurseId = user?.nursingID ?? user?.NursingID ?? user?.nursingId ?? selectedEvent?.workObj?.nursingID ?? selectedEvent?.workObj?.NursingID ?? selectedEvent?.workObj?.nursingId ?? null;
    const taskNurseId = currentCustomizeTask.nursingID ?? currentCustomizeTask.NursingID ?? currentCustomizeTask.nursingId ?? null;
    const taskStatusRaw = (currentCustomizeTask.status ?? currentCustomizeTask.Status ?? '').toString();


    if (String(taskNurseId) !== String(nurseId)) {
      alert('Chỉ nurse được phân công mới có thể ghi chú.');
      return;
    }

    const taskStatus = taskStatusRaw.trim().toLowerCase();
    if (taskStatus !== 'completed') {
      alert('Chỉ ghi chú khi task đã hoàn thành (completed).');
      return;
    }

    if (!notePayload.note || notePayload.note.trim() === '') {
      alert('Ghi chú (note) là bắt buộc.');
      return;
    }

    if (selectedEvent && selectedEvent.isAttended === false) {
      alert('Không thể ghi chú trước khi ca được điểm danh (attended).');
      return;
    }

    setNoteSubmitting(true);
    try {
      let base64Image = null;
      if (notePayload.imageFile) {
        try {
          base64Image = await fileToBase64(notePayload.imageFile);
        } catch (readErr) {
          console.error('fileToBase64 error', readErr);
          alert('Không thể đọc file hình. Bỏ qua hình và tiếp tục lưu ghi chú.');
          base64Image = null;
        }
      }

      const bookingIdCandidate =
        selectedEvent?.bookingId ?? selectedEvent?.bookingID ?? selectedEvent?.workObj?.bookingID ?? currentCustomizeTask.bookingID ?? currentCustomizeTask.BookingID ?? null;

      const payload = {
        customizeTaskID: currentCustomizeTask.customizeTaskID ?? currentCustomizeTask.CustomizeTaskID ?? currentCustomizeTask.customizeTaskId,
        note: notePayload.note.trim(),
        image: base64Image ? `data:${(notePayload.imageFile?.type || 'image/*')};base64,${base64Image}` : null,
        advice: notePayload.advice || null,
        relativeID: notePayload.relativeID ?? null,
        nursingID: nurseId ?? null, // thêm trường nursingID phòng trường hợp BE cần
        bookingID: bookingIdCandidate ?? null // thêm bookingID nếu backend cần
      };

      await medicalNoteService.createMedicalNote(payload);

      alert('Tạo ghi chú y tế thành công.');

      // Nếu có cache medicalNotes, cập nhật luôn để UI phản ánh nhanh
      try {
        if (Array.isArray(cacheRef.current.medicalNotes)) {
          cacheRef.current.medicalNotes.push({
            customizeTaskID: payload.customizeTaskID,
            nursingID: payload.nursingID,
            note: payload.note,
            advice: payload.advice,
            image: payload.image,
            relativeID: payload.relativeID
            // có thể bổ sung các trường khác nếu BE trả về
          });
        }
      } catch (cErr) {
        console.warn('Could not update local medicalNotes cache', cErr);
      }

      // clear booking cache so details refetch (giống logic cũ)
      const bookingId = bookingIdCandidate;
      if (bookingId && cacheRef.current.bookings.has(bookingId)) {
        cacheRef.current.bookings.delete(bookingId);
        // reload booking detail into modal (nếu có selectedEvent)
        const newBundle = await fetchBookingBundle(bookingId, selectedEvent?.serviceId, selectedEvent?.workObj);
        setSelectedEvent(prev => ({ ...prev, bookingDetail: newBundle }));
      }

      setShowNoteModal(false);
      setCurrentCustomizeTask(null);
    } catch (e) {
      console.error('Create medical note failed', e);
      // Hiển thị lỗi chi tiết hơn nếu backend trả về lỗi có body
      const backendMsg = e?.response?.data?.message ?? e?.message ?? 'Không thể tạo ghi chú';
      alert(`Lỗi khi tạo ghi chú: ${backendMsg}`);
    } finally {
      setNoteSubmitting(false);
    }
  };


  const days = getDaysInMonthGrid(currentMonth);
  const workDates = Array.isArray(localSchedules) ? localSchedules.map(ws => (ws.workDate || ws.WorkDate || '').split('T')[0]).filter(Boolean) : [];
  const isWork = (dStr) => workDates.includes(dStr);

  // build eventsOfDay for UI list
  const eventsOfDay = [];
  if (selectedDate) {
    Array.isArray(localSchedules) && localSchedules.filter(ws => (ws.workDate || ws.WorkDate || '').startsWith(selectedDate)).forEach(ws => {
      const workDate = ws.workDate || ws.WorkDate;
      const endTime = ws.endTime || ws.EndTime;
      const bookingId = ws.bookingID || ws.BookingID || ws.bookingId || ws.BookingId || ws.workScheduleID || ws.WorkScheduleID;
      const serviceId = ws.serviceID || ws.ServiceID || ws.serviceId || ws.ServiceId;
      eventsOfDay.push({
        type: 'booking',
        time: `${workDate ? new Date(workDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''} - ${endTime ? new Date(endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}`,
        label: `Lịch hẹn #${bookingId || '-'}`,
        status: ws.status || ws.Status || 'pending',
        isAttended: ws.isAttended || ws.IsAttended || false,
        workObj: ws,
        bookingId,
        serviceId
      });
    });

    const holiday = getHolidayByDate(selectedDate);
    if (holiday) {
      eventsOfDay.push({
        type: 'holiday',
        label: holiday.holidayName,
        status: 'holiday',
        holidayObj: holiday
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-3">Có lỗi: {error}</div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => window.location.reload()}>Tải lại</button>
      </div>
    );
  }

  // normalize logged-in user's nursingID for consistent checks in render
  const userNursingID = user?.nursingID ?? user?.NursingID ?? user?.nursingId ?? null;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-[300px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Lịch làm việc</div>
          <div className="text-sm text-gray-600">Quản lý lịch & điểm danh</div>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded shadow-sm">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-3 py-2 rounded hover:bg-gray-100">◀</button>
          <div className="font-medium">{format(currentMonth, 'MMMM yyyy', { locale: vi })}</div>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-3 py-2 rounded hover:bg-gray-100">▶</button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 bg-gradient-to-r from-purple-50 to-blue-50 text-center font-semibold text-sm">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
            <div key={d} className="py-3">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const holiday = getHolidayByDate(dayStr);
            return (
              <div
                key={idx}
                onClick={() => { setSelectedDate(dayStr); setSelectedEvent(null); }}
                className={`min-h-[90px] p-3 border-l border-t hover:bg-gray-50 cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white'}
                  ${isToday ? 'ring-2 ring-purple-200' : ''}
                  ${selectedDate === dayStr ? 'bg-purple-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-lg font-semibold">{format(day, 'd')}</div>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  {isWork(dayStr) && <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800"><FaCalendarCheck /> <span>Lịch hẹn</span></div>}
                  {holiday && <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800"><FaFlag /> <span>{holiday.holidayName}</span></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events list */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-lg font-semibold">Sự kiện ngày {format(parseISO(selectedDate), 'dd/MM/yyyy')}</div>
              <div className="text-sm text-gray-500">Click vào sự kiện để xem chi tiết</div>
            </div>
            <div className="text-sm text-gray-500">{eventsOfDay.length} sự kiện</div>
          </div>

          {eventsOfDay.length === 0 ? (
            <div className="py-6 text-center text-gray-500">Không có sự kiện vào ngày này.</div>
          ) : (
            <div className="space-y-3">
              {eventsOfDay.map((ev, idx) => {
                const sv = getStatusView(ev.status);
                return (
                  <div key={idx}
                    onClick={() => handleEventClick(ev)}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-sm ${sv.cls}`}>{sv.label}</div>
                      <div className="font-medium">{ev.label}</div>
                    </div>
                    <div className="text-sm text-gray-600">{ev.time || '-'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setSelectedEvent(null)}></div>
          <div className="relative bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Chi tiết sự kiện</div>
                <div className="text-sm text-gray-500">#{selectedEvent.bookingId || selectedEvent.label || ''}</div>
              </div>
              <div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 rounded hover:bg-gray-100"><FaTimes /></button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaClipboardList className="text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-500">Thông tin sự kiện</div>
                        <div className="text-lg font-semibold">{selectedEvent.type === 'holiday' ? 'Ngày nghỉ' : 'Lịch hẹn'}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{selectedEvent.time || '-'}</div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Trạng thái</div>
                      <div className={`px-3 py-1 rounded text-sm ${getStatusView(selectedEvent.status).cls}`}>{getStatusView(selectedEvent.status).label}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Đã tham gia</div>
                      <div className="text-gray-700">{selectedEvent.isAttended ? 'Có' : 'Chưa'}</div>
                    </div>
                  </div>
                </div>

                {(selectedEvent.type === 'booking' || selectedEvent.type === 'work') && (
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <FaCalendarCheck className="text-green-600" />
                      <div>
                        <div className="text-sm text-gray-500">Thông tin lịch hẹn</div>
                        <div className="text-lg font-semibold">#{selectedEvent.bookingId || selectedEvent.workObj?.bookingID || '-'}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm space-y-2">
                      {eventLoading ? (
                        <div className="text-gray-500 flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-t-2 border-purple-600 rounded-full"></div>
                          Đang tải chi tiết booking...
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="text-gray-600">Dịch vụ chính</div>
                            <div className="text-gray-800">
                              {selectedEvent.bookingDetail?.serviceMain?.serviceName || selectedEvent.bookingDetail?.serviceType?.serviceName || '-'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-gray-600">Ngày làm việc</div>
                            <div className="text-gray-800">
                              {selectedEvent.bookingDetail?.booking?.workDate
                                ? new Date(selectedEvent.bookingDetail.booking.workDate).toLocaleString('vi-VN')
                                : (selectedEvent.workObj?.workDate ? new Date(selectedEvent.workObj.workDate).toLocaleString('vi-VN') : '-')}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* attendance */}
                    {selectedEvent.workObj && selectedEvent.status?.toLowerCase() !== 'cancelled' && selectedEvent.status?.toLowerCase() !== 'canceled' && (
                      <div className="mt-4 flex items-center justify-end">
                        {!selectedEvent.isAttended ? (
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            onClick={async () => { await markAttended(selectedEvent.workObj); }}>
                            <FaCheckCircle /> Điểm danh
                          </button>
                        ) : (
                          <div className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm flex items-center gap-2"><FaCheckCircle /> Đã điểm danh</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right */}
              <div className="space-y-4">
                {/* Patient */}
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-indigo-600" />
                    <div>
                      <div className="text-sm text-gray-500">Bệnh nhân</div>
                      <div className="text-lg font-semibold">{selectedEvent.bookingDetail?.careProfile?.profileName || '-'}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm space-y-2 text-gray-700">
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400" /><span>{selectedEvent.bookingDetail?.careProfile?.phoneNumber || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{selectedEvent.bookingDetail?.careProfile?.address || selectedEvent.bookingDetail?.careProfile?.addressDetail || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Service details (with +Ghi chú per customizeTask) */}
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <FaMoneyBillWave className="text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">Dịch vụ chi tiết</div>
                      <div className="text-base font-semibold">{(selectedEvent.bookingDetail?.detailTasks?.length ?? 0)} mục</div>
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700 w-3/4">
                          <th className="p-2 text-left">Dịch vụ</th>
                          <th className="p-2 text-right">SL</th>
                          <th className="p-2 text-right">Đơn giá</th>
                          <th className="p-2 text-right">Thành tiền</th>
                          <th className="p-2 text-left">Trạng thái</th>
                          <th className="p-2 text-center">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedEvent.bookingDetail?.detailTasks && selectedEvent.bookingDetail.detailTasks.length > 0) ? (
                          selectedEvent.bookingDetail.detailTasks.map((t, i) => {
                            const taskStatus = (t.status || t.Status || '').toString().toLowerCase();
                            const medicalNote = t.medicalNote || t.medicalNotes?.[0];
                            // Only the nurse assigned to the task can add/view/edit notes
                            const tNursingId = t.nursingID ?? t.NursingID ?? t.nursingId ?? null;
                            const isTaskOwner = userNursingID && String(tNursingId) === String(userNursingID);
                            const canAddNote = isTaskOwner && selectedEvent.isAttended && taskStatus === 'completed' && !medicalNote;
                            const canEditNote = isTaskOwner && medicalNote;
                            return (
                              <tr key={i} className="hover:bg-purple-50">
                                <td className="p-2">{t.serviceName || t.ServiceName || '-'}</td>
                                <td className="p-2 text-right">{t.quantity || t.Quantity || 1}</td>
                                <td className="p-2 text-right">{(t.price || t.Price || 0).toLocaleString('vi-VN')}đ</td>
                                <td className="p-2 text-right">{(t.total || t.Total || 0).toLocaleString('vi-VN')}đ</td>
                                <td className="p-2">
                                  <span className={`px-2 py-1 rounded text-xs ${getStatusView(t.status || t.Status).cls}`}>
                                    {getStatusView(t.status || t.Status).label}
                                  </span>
                                </td>
                                <td className="p-2 text-center">
                                  {medicalNote && isTaskOwner ? (
                                    <button
                                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                                      onClick={() => {
                                        setEditNotePayload({
                                          note: medicalNote.note || medicalNote.Note || '',
                                          advice: medicalNote.advice || medicalNote.Advice || '',
                                          image: medicalNote.image || medicalNote.Image || '',
                                          medicalNoteID: medicalNote.medicalNoteID || medicalNote.MedicalNoteID
                                        });
                                        setEditNoteMeta({ task: t, booking: selectedEvent.bookingDetail?.booking, careProfile: selectedEvent.bookingDetail?.careProfile });
                                        setEditNoteModal(true);
                                      }}
                                    >Xem/Sửa ghi chú</button>
                                  ) : medicalNote ? (
                                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-500 rounded text-xs">Đã có ghi chú</span>
                                  ) : (
                                    isTaskOwner ? (
                                      canAddNote ? (
                                        <button
                                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                          onClick={() => openAddNoteModal(t)}
                                        >
                                          <FaPlus /> Ghi chú
                                        </button>
                                      ) : (
                                        <div className="text-xs text-gray-400">—</div>
                                      )
                                    ) : null
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr><td className="p-4 text-center text-gray-500" colSpan={6}>Không có dịch vụ.</td></tr>
                        )}
                      </tbody>
                      {selectedEvent.bookingDetail?.detailTasks && selectedEvent.bookingDetail.detailTasks.length > 0 && (
                        <tfoot>
                          <tr className="bg-gray-100">
                            <td className="p-2 text-right font-semibold" colSpan={3}>Tổng</td>
                            <td className="p-2 text-right font-semibold">
                              {selectedEvent.bookingDetail.detailTasks.reduce((s, x) => s + (x.total || x.Total || 0), 0).toLocaleString('vi-VN')}đ
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3 bg-white">
              <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medical Note Modal */}
      {showNoteModal && currentCustomizeTask && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowNoteModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Thêm ghi chú y tế</div>
              <button onClick={() => setShowNoteModal(false)} className="p-2 rounded hover:bg-gray-100"><FaTimes /></button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Task</div>
                <div className="font-medium">{currentCustomizeTask.serviceName || currentCustomizeTask.serviceTaskName || `Task #${currentCustomizeTask.customizeTaskID || currentCustomizeTask.CustomizeTaskID}`}</div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Ghi chú (bắt buộc)</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded"
                  rows={4}
                  value={notePayload.note}
                  onChange={e => setNotePayload(p => ({ ...p, note: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Lời khuyên (tùy chọn)</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded"
                  rows={2}
                  value={notePayload.advice}
                  onChange={e => setNotePayload(p => ({ ...p, advice: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Hình ảnh (tùy chọn)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1"
                  onChange={e => setNotePayload(p => ({ ...p, imageFile: e.target.files?.[0] || null }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Relative ID (tùy chọn)</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={notePayload.relativeID ?? ''}
                  onChange={e => setNotePayload(p => ({ ...p, relativeID: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={() => setShowNoteModal(false)}>Hủy</button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={submitMedicalNote}
                  disabled={noteSubmitting}
                >
                  {noteSubmitting ? 'Đang gửi...' : 'Lưu ghi chú'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medical Note Modal */}
      {editNoteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setEditNoteModal(false)}></div>
          <form
            className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editNotePayload.medicalNoteID) return;

              // Authorization backstop: ensure logged-in nurse is the task owner
              const editTaskNursingID = editNoteMeta?.task?.nursingID ?? editNoteMeta?.task?.NursingID ?? editNoteMeta?.task?.nursingId ?? null;
              if (String(editTaskNursingID) !== String(userNursingID)) {
                alert('Chỉ nurse được phân công mới có thể sửa ghi chú.');
                return;
              }

              setEditNoteLoading(true);
              try {
                await medicalNoteService.updateMedicalNote(
                  editNotePayload.medicalNoteID,
                  {
                    note: editNotePayload.note,
                    advice: editNotePayload.advice,
                    image: editNotePayload.image,
                    relativeID: editNoteMeta.careProfile?.relativeID || editNoteMeta.careProfile?.RelativeID || null
                  }
                );
                setEditNoteModal(false);
                setEditNotePayload({ note: '', advice: '', image: '', medicalNoteID: null });
                alert('Cập nhật ghi chú thành công!');
              } catch (err) {
                alert(err?.message || 'Cập nhật ghi chú thất bại');
              } finally {
                setEditNoteLoading(false);
              }
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setEditNoteModal(false)}
              type="button"
              title="Đóng"
            >✕</button>
            <h4 className="text-xl font-bold mb-4 text-purple-700">Xem/Sửa ghi chú y tế</h4>
            <div className="mb-2"><span className="font-semibold">Bệnh nhân:</span> {editNoteMeta.careProfile?.profileName || editNoteMeta.careProfile?.ProfileName}</div>
            <div className="mb-2"><span className="font-semibold">Booking:</span> #{editNoteMeta.booking?.bookingID || editNoteMeta.booking?.BookingID}</div>
            <div className="mb-2"><span className="font-semibold">Task:</span> {editNoteMeta.task?.serviceName || editNoteMeta.task?.ServiceName || '-'}</div>
            <div className="mb-2">
              <label className="font-semibold">Nội dung:</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                value={editNotePayload.note}
                onChange={e => setEditNotePayload(p => ({ ...p, note: e.target.value }))}
                required
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Lời khuyên:</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                value={editNotePayload.advice}
                onChange={e => setEditNotePayload(p => ({ ...p, advice: e.target.value }))}
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Ảnh (URL):</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={editNotePayload.image}
                onChange={e => setEditNotePayload(p => ({ ...p, image: e.target.value }))}
                placeholder="Nhập đường dẫn ảnh hoặc để trống"
              />
              {editNotePayload.image && <img src={editNotePayload.image} alt="note" className="w-16 h-16 object-cover rounded mt-2" />}
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
              disabled={editNoteLoading}
            >
              {editNoteLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
