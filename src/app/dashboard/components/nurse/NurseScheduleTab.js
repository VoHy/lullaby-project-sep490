'use client';
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
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
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { AuthContext } from '@/context/AuthContext';

export default function NurseScheduleTab({ workSchedules = [] }) {
  // -------------------------- Helpers & Constants --------------------------
  const K = useMemo(() => ({
    workScheduleID: ['workScheduleID', 'WorkScheduleID'],
    workDate: ['workDate', 'WorkDate'],
    endTime: ['endTime', 'EndTime'],
    bookingID: ['bookingID', 'BookingID', 'bookingId', 'BookingId'],
    serviceID: ['serviceID', 'ServiceID', 'serviceId', 'ServiceId'],
    status: ['status', 'Status'],
    isAttended: ['isAttended', 'IsAttended'],
    nursingID: ['nursingID', 'NursingID', 'nursingId'],

    // CustomizeTask
    customizeTaskID: ['customizeTaskID', 'CustomizeTaskID', 'customizeTaskId'],
    serviceTaskID: ['serviceTaskID', 'ServiceTaskID', 'serviceTaskId'],

    // Detail task numbers
    serviceName: ['serviceName', 'ServiceName', 'serviceTaskName'],
    quantity: ['quantity', 'Quantity'],
    price: ['price', 'Price'],
    total: ['total', 'Total'],
  }), []);

  const g = (o, keysArr) => {
    for (const k of keysArr) if (o && o[k] !== undefined) return o[k];
    return undefined;
  };
  const S = (v) => (v ?? '').toString().trim();
  const SLC = (v) => S(v).toLowerCase();
  const isCancelledOrPending = (s) => ['cancelled', 'canceled', 'pending'].includes(SLC(s));
  const parseDT = (x) => (x ? new Date(x) : null);
  const fmtDateTime = (x) => (x ? parseDT(x).toLocaleString('vi-VN') : '-');
  const fmtTime = (x) => (x ? parseDT(x).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '');
  const timeRange = (start, end) => `${fmtTime(start)} - ${fmtTime(end)}`;

  const getStatusView = (raw) => {
    const s = SLC(raw);
    const map = {
      paid: ['Đã thanh toán', 'bg-green-600 text-white'],
      pending: ['Chờ xử lý', 'bg-yellow-500 text-white'],
      confirmed: ['Đã xác nhận', 'bg-blue-600 text-white'],
      completed: ['Hoàn thành', 'bg-teal-600 text-white'],
      cancelled: ['Đã hủy', 'bg-gray-500 text-white'],
      canceled: ['Đã hủy', 'bg-gray-500 text-white'],
      waiting: ['Đang đến', 'bg-gray-500 text-white'],
      isscheduled: ['Đã lên lịch', 'bg-indigo-600 text-white'],
      scheduled: ['Đã lên lịch', 'bg-indigo-600 text-white'],
      holiday: ['Ngày nghỉ', 'bg-red-600 text-white'],
    };
    const [label, cls] = map[s] || [raw || 'Không xác định', 'bg-gray-500 text-white'];
    return { label, cls };
  };

  // ------------------------------- State ----------------------------------
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localSchedules, setLocalSchedules] = useState(Array.isArray(workSchedules) ? workSchedules : []);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [error, setError] = useState(null);

  // Medical Note modals/state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [notePayload, setNotePayload] = useState({ note: '', advice: '', imageFile: null, relativeID: null });
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [currentCustomizeTask, setCurrentCustomizeTask] = useState(null);

  const [editNoteModal, setEditNoteModal] = useState(false);
  const [editNotePayload, setEditNotePayload] = useState({ note: '', advice: '', image: '', medicalNoteID: null });
  const [editNoteLoading, setEditNoteLoading] = useState(false);
  const [editNoteMeta, setEditNoteMeta] = useState({ task: null, booking: null, careProfile: null });
  const [myNursingID, setMyNursingID] = useState(null);

  // Service Notes (view by careProfile + service)
  const [showServiceNotesModal, setShowServiceNotesModal] = useState(false);
  const [serviceNotesLoading, setServiceNotesLoading] = useState(false);
  const [serviceNotes, setServiceNotes] = useState([]);
  const [selectedServiceIdForNotes, setSelectedServiceIdForNotes] = useState(null);

  // caches to avoid repeated calls
  const cacheRef = useRef({
    bookings: new Map(),
    serviceTasks: null,
    serviceTypes: null,
    medicalNotes: null,
    nurses: [],
  });

  const safe = async (fn, fallback) => {
    try { return await fn(); } catch { return fallback; }
  };

  // ----------------------------- Data loading -----------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [hs, stasks, stypes, mnotes, nurses] = await Promise.all([
          safe(() => holidayService.getAllHolidays(), []),
          safe(() => (serviceTaskService.getServiceTasks?.() || serviceTaskService.getAllServiceTasks?.()), []),
          safe(() => (serviceTypeService.getAllServiceTypes?.() || serviceTypeService.getServiceTypes?.()), []),
          safe(() => medicalNoteService.getAllMedicalNotes(), []),
          safe(() => nursingSpecialistService.getAllNursingSpecialists(), []),
        ]);
        setHolidays(hs || []);
        cacheRef.current.serviceTasks = stasks || [];
        cacheRef.current.serviceTypes = stypes || [];
        cacheRef.current.medicalNotes = mnotes || [];
        cacheRef.current.nurses = Array.isArray(nurses) ? nurses : [];
        // try resolve my nursingID from nurses list if user has accountID
        try {
          const acctId = user?.accountID ?? user?.AccountID ?? null;
          if (acctId) {
            const me = (cacheRef.current.nurses || []).find(s => String(s.accountID ?? s.AccountID) === String(acctId));
            const nid = me?.nursingID ?? me?.NursingID ?? me?.nursingId ?? null;
            if (nid != null) setMyNursingID(nid);
          }
        } catch { }
      } catch (e) {
        setError('Không tải được dữ liệu ban đầu.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update localSchedules when props change + filter cancelled/pending
  useEffect(() => {
    if (!Array.isArray(workSchedules)) return setLocalSchedules([]);
    const filtered = workSchedules.filter(ws => !isCancelledOrPending(g(ws, K.status)));
    setLocalSchedules(filtered);
  }, [workSchedules, K.status]);

  // ------------------------------- Helpers --------------------------------
  const getHolidayByDate = (dateStr) => {
    for (const h of holidays) {
      try {
        const start = parseISO(h.startDate);
        const end = parseISO(h.endDate);
        const d = parseISO(dateStr);
        if (isWithinInterval(d, { start, end })) return h;
      } catch { }
    }
    return null;
  };

  const getDaysInMonthGrid = (month) => {
    const startMonth = startOfMonth(month);
    const endMonth = endOfMonth(month);
    const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });
    const days = [];
    for (let d = startDate; d <= endDate; d = addDays(d, 1)) days.push(d);
    return days;
  };

  // Resolve nurse full name by nursingID using cached nurses list
  const resolveNurseNameById = (nursingId) => {
    try {
      const nurses = cacheRef.current?.nurses || [];
      const nurse = nurses.find(ns => String(ns.nursingID ?? ns.NursingID ?? ns.nursingId) === String(nursingId));
      return nurse?.fullName ?? nurse?.FullName ?? (nursingId != null ? `#${nursingId}` : 'Không rõ');
    } catch { return 'Không rõ'; }
  };

  const fetchBookingBundle = async (bookingId, fallbackServiceId, workObj = null) => {
    if (!bookingId) return null;
    if (cacheRef.current.bookings.has(bookingId)) return cacheRef.current.bookings.get(bookingId);

    const serviceTasksList = cacheRef.current.serviceTasks || [];
    const serviceTypesList = cacheRef.current.serviceTypes || [];
    const allMedicalNotes = cacheRef.current.medicalNotes || [];

    // booking
    const bookingDetail = await safe(() => bookingService.getBookingById(bookingId), null);

    // careProfile (prefer embedded)
    let careProfile = bookingDetail?.careProfile || bookingDetail?.CareProfile || null;
    if (!careProfile) {
      const cpId = bookingDetail?.careProfileID || bookingDetail?.CareProfileID || bookingDetail?.careProfileId;
      if (cpId) careProfile = await safe(() => careProfileService.getCareProfileById(cpId), null);
    }

    // customize tasks
    let customizeTasks = null;
    const ctId = bookingDetail?.customizeTaskID || bookingDetail?.CustomizeTaskID || bookingDetail?.customizeTaskId;
    if (ctId && customizeTaskService.getCustomizeTaskById) {
      customizeTasks = await safe(() => customizeTaskService.getCustomizeTaskById(ctId), null);
    } else if (customizeTaskService.getAllByBooking) {
      customizeTasks = await safe(() => customizeTaskService.getAllByBooking(bookingId), []);
    }

    // serviceMain
    const sid = bookingDetail?.serviceID || bookingDetail?.ServiceID || bookingDetail?.serviceId || fallbackServiceId || g(workObj || {}, K.serviceID);
    let serviceMain = null;
    if (sid && serviceTypeService.getServiceTypeById) {
      serviceMain = await safe(() => serviceTypeService.getServiceTypeById(sid), null);
    }
    if (!serviceMain && Array.isArray(serviceTypesList) && sid) {
      serviceMain = serviceTypesList.find(st => (st.serviceID || st.ServiceID) === sid) || null;
    }

    // normalize detail tasks & attach medical notes by customizeTaskID + nursingID
    const tasksArray = Array.isArray(customizeTasks) ? customizeTasks : (customizeTasks ? [customizeTasks] : []);
    const detailTasksNormalized = tasksArray.map(t => {
      const stKey = g(t, K.serviceTaskID);
      const svKey = g(t, K.serviceID);
      const stMeta = serviceTasksList.find(x => (x.serviceTaskID || x.ServiceTaskID) === stKey) || null;
      const svMeta = serviceTypesList.find(x => (x.serviceID || x.ServiceID) === svKey) || null;

      const serviceName = g(t, K.serviceName) || stMeta?.description || svMeta?.serviceName || '-';
      const quantity = g(t, K.quantity) ?? 1;
      const price = (g(t, K.price)) ?? svMeta?.price ?? 0;
      const total = (g(t, K.total)) ?? (price * quantity);

      const taskCustomizeTaskID = g(t, K.customizeTaskID);
      // One medical note per customizeTask → match only by customizeTaskID
      const medicalNotes = allMedicalNotes.filter(mn => {
        const mnTaskID = mn.customizeTaskID || mn.CustomizeTaskID || mn.customizeTaskId;
        return mnTaskID === taskCustomizeTaskID;
      });

      return { ...t, serviceName, quantity, price, total, status: g(t, K.status) || null, medicalNotes };
    });

    const bundle = { booking: bookingDetail, careProfile, detailTasks: detailTasksNormalized, serviceType: serviceMain, serviceMain };
    cacheRef.current.bookings.set(bookingId, bundle);
    return bundle;
  };

  // ------------------------------- Handlers -------------------------------
  const handleEventClick = async (event) => {
    if (!event || event.type !== 'booking') return;
    setSelectedEvent(event);
    setEventLoading(true);
    try {
      const bid = event.bookingId || g(event.workObj || {}, K.bookingID);
      const fallbackServiceId = event.serviceId || g(event.workObj || {}, K.serviceID);
      if (!bid) return;
      const bundle = await fetchBookingBundle(bid, fallbackServiceId, event.workObj);
      setSelectedEvent(prev => ({ ...prev, bookingDetail: bundle }));
    } catch (e) {
      setError('Không thể tải chi tiết sự kiện.');
    } finally {
      setEventLoading(false);
    }
  };

  const markAttended = async (ws) => {
    if (!ws) return;
    const id = g(ws, K.workScheduleID);
    if (!id) return;

    const startTime = parseDT(g(ws, K.workDate));
    const endTime = parseDT(g(ws, K.endTime));
    const now = new Date();
    const workTimeStr = timeRange(g(ws, K.workDate), g(ws, K.endTime));

    if (!endTime || isNaN(endTime.getTime())) {
      if (!confirm(`Không có thời gian kết thúc hợp lệ cho ca làm. Bạn vẫn muốn điểm danh?\nCa làm: ${workTimeStr}`)) return;
    } else if (now < endTime) {
      alert(`Chưa đến giờ điểm danh! Ca làm: ${workTimeStr}\nChỉ được điểm danh sau khi ca làm kết thúc.`);
      return;
    }

    try {
      await workScheduleService.updateIsAttended(id);
      setSelectedEvent(prev => {
        if (!prev) return prev;
        const next = { ...prev, isAttended: true, status: 'completed' };
        if (next.bookingDetail?.booking) next.bookingDetail.booking.status = 'completed';
        return next;
      });
      setLocalSchedules(prev => prev.map(item => {
        const wid = g(item, K.workScheduleID);
        if (wid === id) return { ...item, isAttended: true, IsAttended: true, status: 'completed', Status: 'completed' };
        return item;
      }));
      alert(`Điểm danh thành công!\nCa làm: ${workTimeStr}`);
    } catch (e) {
      alert(e?.message || 'Không thể điểm danh');
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const openAddNoteModal = (task) => {
    setCurrentCustomizeTask(task);
    setNotePayload({ note: '', advice: '', imageFile: null, relativeID: null });
    setShowNoteModal(true);
  };

  const submitMedicalNote = async () => {
    if (!currentCustomizeTask) return;

    const userNursingID = (() => {
      let id = user?.nursingID ?? user?.NursingID ?? user?.nursingId ?? null;
      if (!id && user?.accountID) {
        try {
          const nurses = cacheRef.current?.nurses || [];
          const me = nurses.find(s => String(s.accountID ?? s.AccountID) === String(user.accountID));
          id = me?.nursingID ?? me?.NursingID ?? me?.nursingId ?? null;
        } catch { }
      }
      return id;
    })();

    const taskNurseId = g(currentCustomizeTask, K.nursingID) ?? null;
    const taskStatus = SLC(g(currentCustomizeTask, K.status));

    if (taskNurseId != null && userNursingID != null && String(taskNurseId) !== String(userNursingID)) {
      return alert('Chỉ nurse được phân công mới có thể ghi chú.');
    }
    // Cho phép ghi chú sau khi ca đã điểm danh, không bắt buộc task phải 'completed'
    if (!notePayload.note || !notePayload.note.trim()) return alert('Ghi chú (note) là bắt buộc.');
    if (selectedEvent && selectedEvent.isAttended === false) return alert('Không thể ghi chú trước khi ca được điểm danh (attended).');

    setNoteSubmitting(true);
    try {
      let base64Image = null;
      if (notePayload.imageFile) {
        try { base64Image = await fileToBase64(notePayload.imageFile); }
        catch { alert('Không thể đọc file hình. Bỏ qua hình và tiếp tục lưu ghi chú.'); }
      }

      const bookingIdCandidate = selectedEvent?.bookingId || g(selectedEvent?.workObj || {}, K.bookingID) || g(currentCustomizeTask, K.bookingID) || null;
      const resolveCareProfileId = async () => {
        try {
          const b = selectedEvent?.bookingDetail?.booking || await safe(() => bookingService.getBookingById(bookingIdCandidate), null);
          return b?.careProfileID || b?.CareProfileID || b?.careProfileId || null;
        } catch { return null; }
      };

      const payload = {
        customizeTaskID: g(currentCustomizeTask, K.customizeTaskID),
        note: notePayload.note.trim(),
        image: base64Image ? `data:${(notePayload.imageFile?.type || 'image/*')};base64,${base64Image}` : null,
        advice: notePayload.advice || null,
        relativeID: notePayload.relativeID ?? null,
        nursingID: userNursingID ?? null,
        bookingID: bookingIdCandidate ?? null,
      };

      // Nếu backend yêu cầu careProfileID, thêm vào payload nếu có
      try {
        const cpId = await resolveCareProfileId();
        if (cpId && payload.careProfileID === undefined) payload.careProfileID = cpId;
      } catch { }

      await medicalNoteService.createMedicalNote(payload);
      alert('Tạo ghi chú y tế thành công.');

      // Update local medicalNotes cache for instant UI
      try {
        if (Array.isArray(cacheRef.current.medicalNotes)) {
          cacheRef.current.medicalNotes.push({
            customizeTaskID: payload.customizeTaskID,
            nursingID: payload.nursingID,
            note: payload.note,
            advice: payload.advice,
            image: payload.image,
            relativeID: payload.relativeID,
          });
        }
      } catch { }

      // Clear booking cache and refetch bundle for the open modal
      if (bookingIdCandidate && cacheRef.current.bookings.has(bookingIdCandidate)) {
        cacheRef.current.bookings.delete(bookingIdCandidate);
        const newBundle = await fetchBookingBundle(bookingIdCandidate, selectedEvent?.serviceId, selectedEvent?.workObj);
        setSelectedEvent(prev => ({ ...prev, bookingDetail: newBundle }));
      }

      setShowNoteModal(false);
      setCurrentCustomizeTask(null);
    } catch (e) {
      const backendMsg = e?.response?.data?.message ?? e?.message ?? 'Không thể tạo ghi chú';
      alert(`Lỗi khi tạo ghi chú: ${backendMsg}`);
    } finally {
      setNoteSubmitting(false);
    }
  };

  // ------------------------------- Derived UI ------------------------------
  const days = useMemo(() => getDaysInMonthGrid(currentMonth), [currentMonth]);
  const workDatesSet = useMemo(() => new Set(localSchedules.map(ws => (g(ws, K.workDate) || '').split('T')[0]).filter(Boolean)), [localSchedules, K.workDate]);
  const isWork = (dStr) => workDatesSet.has(dStr);

  const eventsOfDay = useMemo(() => {
    if (!selectedDate) return [];
    const list = [];

    // work schedules on the selected day (already filtered for cancelled/pending at source)
    (localSchedules || []).filter(ws => S(g(ws, K.workDate)).startsWith(selectedDate)).forEach(ws => {
      const status = g(ws, K.status) || 'pending';
      if (isCancelledOrPending(status)) return; // defensive
      const workDate = g(ws, K.workDate);
      const endTime = g(ws, K.endTime);
      list.push({
        type: 'booking',
        time: timeRange(workDate, endTime),
        label: `Lịch hẹn #${g(ws, K.bookingID) || g(ws, K.workScheduleID) || '-'}`,
        status,
        isAttended: !!g(ws, K.isAttended),
        workObj: ws,
        bookingId: g(ws, K.bookingID),
        serviceId: g(ws, K.serviceID),
      });
    });

    const holiday = getHolidayByDate(selectedDate);
    if (holiday) list.push({ type: 'holiday', label: holiday.holidayName, status: 'holiday', holidayObj: holiday });

    return list;
  }, [selectedDate, localSchedules, K]);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-gray-600">Đang tải dữ liệu...</div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="text-red-600 mb-3">Có lỗi: {error}</div>
      <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => window.location.reload()}>Tải lại</button>
    </div>
  );

  const userNursingID = (() => {
    let id = user?.nursingID ?? user?.NursingID ?? user?.nursingId ?? myNursingID ?? null;
    if (!id && user?.accountID) {
      try {
        const nurses = cacheRef.current?.nurses || [];
        const me = nurses.find(s => String(s.accountID ?? s.AccountID) === String(user.accountID));
        id = me?.nursingID ?? me?.NursingID ?? me?.nursingId ?? null;
      } catch { }
    }
    return id;
  })();

  // --------------------------------- UI -----------------------------------
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
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (<div key={d} className="py-3">{d}</div>))}
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
                className={`min-h-[90px] p-3 border-l border-t hover:bg-gray-50 cursor-pointer transition-colors ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white'} ${isToday ? 'ring-2 ring-purple-200' : ''} ${selectedDate === dayStr ? 'bg-purple-50' : ''}`}
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
                  <div key={idx} onClick={() => handleEventClick(ev)} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition cursor-pointer">
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
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setSelectedEvent(null)} />
          <div className="relative bg-white w-full max-w-7xl h-[90vh] rounded-xl shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Chi tiết sự kiện</div>
                <div className="text-sm text-gray-500">#{selectedEvent.bookingId || selectedEvent.label || ''}</div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 rounded hover:bg-gray-100"><FaTimes /></button>
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
                        <div className="text-lg font-semibold">#{selectedEvent.bookingId || g(selectedEvent.workObj || {}, K.bookingID) || '-'}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm space-y-2">
                      {eventLoading ? (
                        <div className="text-gray-500 flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-t-2 border-purple-600 rounded-full" />
                          Đang tải chi tiết booking...
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="text-gray-600">Dịch vụ chính</div>
                            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-lg font-medium">
                              {selectedEvent.bookingDetail?.serviceMain?.serviceName ||
                                selectedEvent.bookingDetail?.serviceType?.serviceName ||
                                '-'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-gray-600">Ngày làm việc</div>
                            <div className="text-gray-800">{selectedEvent.bookingDetail?.booking?.workDate ? fmtDateTime(selectedEvent.bookingDetail.booking.workDate) : (g(selectedEvent.workObj || {}, K.workDate) ? fmtDateTime(g(selectedEvent.workObj || {}, K.workDate)) : '-')}</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* attendance (hide if cancelled) */}
                    {selectedEvent.workObj && !isCancelledOrPending(selectedEvent.status) && (
                      <div className="mt-4 flex items-center justify-end">
                        {!selectedEvent.isAttended ? (
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={async () => { await markAttended(selectedEvent.workObj); }}>
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
                      <div className="text-sm text-gray-500">Bệnh </div>
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
                    {/* View notes by service button */}
                    <div className="pt-2">
                      <button
                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                        onClick={async () => {
                          // Prefer serviceID of this work schedule/event
                          const defaultServiceId = selectedEvent.serviceId
                            || selectedEvent.bookingDetail?.serviceMain?.serviceID
                            || selectedEvent.bookingDetail?.serviceType?.serviceID
                            || null;
                          setSelectedServiceIdForNotes(defaultServiceId || null);
                          // Load notes
                          try {
                            setServiceNotesLoading(true);
                            setShowServiceNotesModal(true);
                            const cpId = selectedEvent.bookingDetail?.careProfile?.careProfileID
                              || selectedEvent.bookingDetail?.careProfile?.CareProfileID
                              || null;
                            if (cpId) {
                              const res = await medicalNoteService.getMedicalNotesByCareProfile(cpId, defaultServiceId || undefined);
                              const arr = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);
                              setServiceNotes(arr);
                            } else {
                              setServiceNotes([]);
                            }
                          } catch {
                            setServiceNotes([]);
                          } finally {
                            setServiceNotesLoading(false);
                          }
                        }}
                      >Xem ghi chú (dịch vụ)</button>
                    </div>
                  </div>
                </div>

                {/* Ghi chú y tế - chỉ hiển thị một nút thêm cho customizeTask duy nhất */}
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">Ghi chú y tế</div>
                      <div className="text-base font-semibold">Thêm ghi chú cho nhiệm vụ</div>
                    </div>
                  </div>

                  {(() => {
                    const tasks = selectedEvent.bookingDetail?.detailTasks || [];
                    if (tasks.length === 0) return <div className="p-2 text-sm text-gray-500">Không có dữ liệu nhiệm vụ.</div>;

                    // Ưu tiên nhiệm vụ được phân công cho nurse hiện tại
                    const t = tasks.find(x => String(g(x, K.nursingID)) === String(userNursingID)) || tasks[0];
                    const medicalNote = t.medicalNote || t.medicalNotes?.[0];
                    const hasNote = !!(medicalNote && (
                      medicalNote.medicalNoteID || medicalNote.MedicalNoteID ||
                      (S(medicalNote.note) || S(medicalNote.Note))
                    ));
                    const tNursingId = g(t, K.nursingID) ?? null;
                    const isTaskOwner = userNursingID && String(tNursingId) === String(userNursingID);
                    const canAddNote = isTaskOwner && selectedEvent.isAttended && !hasNote;

                    if (canAddNote) {
                      return (
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          onClick={() => openAddNoteModal(t)}
                        >
                          <FaPlus /> Thêm ghi chú y tế
                        </button>
                      );
                    }
                    if (hasNote) return <span className="text-xs text-gray-500">Đã có ghi chú</span>;
                    if (!isTaskOwner) return <span className="text-xs text-gray-400">Bạn không được phân công nhiệm vụ</span>;
                    return null;
                  })()}
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
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowNoteModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Thêm ghi chú y tế</div>
              <button onClick={() => setShowNoteModal(false)} className="p-2 rounded hover:bg-gray-100"><FaTimes /></button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Nhiệm vụ</div>
                <div className="font-medium">{g(currentCustomizeTask, K.serviceName) || `Task #${g(currentCustomizeTask, K.customizeTaskID)}`}</div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Ghi chú (bắt buộc)</label>
                <textarea className="w-full mt-1 p-2 border rounded" rows={4} value={notePayload.note} onChange={e => setNotePayload(p => ({ ...p, note: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-700">Lời khuyên (tùy chọn)</label>
                <textarea className="w-full mt-1 p-2 border rounded" rows={2} value={notePayload.advice} onChange={e => setNotePayload(p => ({ ...p, advice: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-700">Hình ảnh (tùy chọn)</label>
                <input type="file" accept="image/*" className="mt-1" onChange={e => setNotePayload(p => ({ ...p, imageFile: e.target.files?.[0] || null }))} />
              </div>

              <div>
                <label className="text-sm text-gray-700">Relative ID (tùy chọn)</label>
                <input type="number" className="w-full mt-1 p-2 border rounded" value={notePayload.relativeID ?? ''} onChange={e => setNotePayload(p => ({ ...p, relativeID: e.target.value ? Number(e.target.value) : null }))} />
              </div>

              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={() => setShowNoteModal(false)}>Hủy</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={submitMedicalNote} disabled={noteSubmitting}>
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
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setEditNoteModal(false)} />
          <form
            className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editNotePayload.medicalNoteID) return;

              const editTaskNursingID = g(editNoteMeta?.task || {}, K.nursingID) ?? null;
              if (String(editTaskNursingID) !== String(userNursingID)) return alert('Chỉ nurse được phân công mới có thể sửa ghi chú.');

              setEditNoteLoading(true);
              try {
                await medicalNoteService.updateMedicalNote(editNotePayload.medicalNoteID, {
                  note: editNotePayload.note,
                  advice: editNotePayload.advice,
                  image: editNotePayload.image,
                  relativeID: editNoteMeta.careProfile?.relativeID || editNoteMeta.careProfile?.RelativeID || null,
                });
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
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setEditNoteModal(false)} type="button" title="Đóng">✕</button>
            <h4 className="text-xl font-bold mb-4 text-purple-700">Xem/Sửa ghi chú y tế</h4>
            <div className="mb-2"><span className="font-semibold">Khách hàng:</span> {editNoteMeta.careProfile?.profileName || editNoteMeta.careProfile?.ProfileName}</div>
            <div className="mb-2"><span className="font-semibold">Mã lịch hẹn:</span> #{editNoteMeta.booking?.bookingID || editNoteMeta.booking?.BookingID}</div>
            <div className="mb-2"><span className="font-semibold">Nhiệm vụ:</span> {g(editNoteMeta.task || {}, K.serviceName) || '-'}</div>
            <div className="mb-2">
              <label className="font-semibold">Nội dung:</label>
              <textarea className="w-full border rounded px-2 py-1" value={editNotePayload.note} onChange={e => setEditNotePayload(p => ({ ...p, note: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Lời khuyên:</label>
              <textarea className="w-full border rounded px-2 py-1" value={editNotePayload.advice} onChange={e => setEditNotePayload(p => ({ ...p, advice: e.target.value }))} />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Ảnh (URL):</label>
              <input className="w-full border rounded px-2 py-1" value={editNotePayload.image} onChange={e => setEditNotePayload(p => ({ ...p, image: e.target.value }))} placeholder="Nhập đường dẫn ảnh hoặc để trống" />
              {editNotePayload.image && <img src={editNotePayload.image} alt="note" className="w-16 h-16 object-cover rounded mt-2" />}
            </div>
            <button type="submit" className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg" disabled={editNoteLoading}>
              {editNoteLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}

      {/* Service Notes Modal */}
      {showServiceNotesModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowServiceNotesModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Ghi chú theo dịch vụ</div>
              <button onClick={() => setShowServiceNotesModal(false)} className="p-2 rounded hover:bg-gray-100"><FaTimes /></button>
            </div>

            {/* Service info: resolve name by serviceID of current work schedule */}
            <div className="mb-4 text-sm text-gray-700">
              <div className="font-medium">Dịch vụ:</div>
              <div>
                {(() => {
                  const evSid = selectedEvent?.serviceId ?? null;
                  const tasks = selectedEvent?.bookingDetail?.detailTasks || [];
                  const task = tasks.find(t => (g(t, K.serviceID) === evSid));
                  const fallbackName = selectedEvent?.bookingDetail?.serviceMain?.serviceName || selectedEvent?.bookingDetail?.serviceType?.serviceName || '-';
                  return (task ? (g(task, K.serviceName) || fallbackName) : fallbackName);
                })()}
              </div>
            </div>

            {/* Notes list */}
            <div className="max-h-[60vh] overflow-y-auto border rounded">
              {serviceNotesLoading ? (
                <div className="p-4 text-gray-500">Đang tải ghi chú...</div>
              ) : serviceNotes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Chưa có ghi chú.</div>
              ) : (
                <ul className="divide-y">
                  {serviceNotes.map((n, i) => (
                    <li key={i} className="p-3">
                      <div className="font-medium text-purple-700">{n.note || n.Note || '(Không có nội dung)'}</div>
                      {n.advice && <div className="text-sm text-gray-600 mt-1">Lời khuyên: {n.advice}</div>}
                      {n.createdAt && (
                        <div className="text-sm text-gray-600 mt-1">
                          <div>
                            Ngày: {new Date(n.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </div>
                          <div>
                            Lúc: {new Date(n.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">Tạo bởi: {resolveNurseNameById(n.nursingID || n.NursingID || n.nursingId)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={() => setShowServiceNotesModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
