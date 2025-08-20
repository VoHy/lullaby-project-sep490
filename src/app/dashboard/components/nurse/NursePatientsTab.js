import React, { useEffect, useMemo, useState, useContext } from 'react';
import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import customizeTaskService from '@/services/api/customizeTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { AuthContext } from '@/context/AuthContext';
import { formatDateToDDMMYYYY, formatDateTimeToVN } from '@/app/profile/utils/dateUtils';

const NursePatientsTab = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!user?.accountID) {
          setBookings([]);
          setCareProfiles([]);
          return;
        }
        // Lấy nursingID theo account
        const specialists = await nursingSpecialistService.getAllNursingSpecialists();
        const me = specialists.find(s => (s.accountID || s.AccountID) === user.accountID);
        const nursingID = me?.nursingID || me?.NursingID;

        // Try aggregator route first
        let mine = [];
        try {
          mine = await bookingService.getBookingsByNursing(nursingID);
        } catch (_) {
          // ignore; fallback below
        }

        const cps = await careProfileService.getCareProfiles();
        setCareProfiles(Array.isArray(cps) ? cps : []);

        // Fallback: derive bookings by nurse from customize tasks if aggregator not available
        if (!Array.isArray(mine) || mine.length === 0) {
          const tasks = await customizeTaskService.getAllCustomizeTasks();
          const bookingIds = new Set((tasks || [])
            .filter(t => (t.nursingID || t.NursingID) === nursingID)
            .map(t => t.bookingID || t.BookingID)
            .filter(Boolean));
          try {
            const all = await bookingService.getAllBookings();
            mine = (all || []).filter(b => bookingIds.has(b.bookingID || b.BookingID));
          } catch (err) {
            // keep empty
          }
        }
        setBookings(Array.isArray(mine) ? mine : []);
      } catch (e) {
        setError(e?.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Filter, search, and sort patientRows
  const patientRows = useMemo(() => {
    const rows = bookings.map(b => {
      const cpId = b.careProfileID || b.CareProfileID;
      const cp = (b.careProfile || b.CareProfile) || careProfiles.find(p => (p.careProfileID || p.CareProfileID) === cpId);
      return { booking: b, patient: cp };
    });
    // Filter by status
    let filtered = filterStatus === 'all'
      ? rows
      : rows.filter(({ booking }) => {
        const status = (booking.status || booking.Status || '').toLowerCase();
        return status === filterStatus;
      });

    // Search filter
    if (search.trim() !== '') {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(({ patient }) => {
        const name = (patient?.profileName || patient?.ProfileName || '').toLowerCase();
        const address = (patient?.address || patient?.Address || '').toLowerCase();
        const phone = (patient?.phoneNumber || patient?.PhoneNumber || '').toLowerCase();
        return (
          name.includes(s) ||
          address.includes(s) ||
          phone.includes(s)
        );
      });
    }

    // Sort
    const statusOrder = {
      isscheduled: 1,
      paid: 2,
      completed: 3,
      cancelled: 4,
      canceled: 4,
    };
    filtered.sort((a, b) => {
      const aStatus = (a.booking.status || a.booking.Status || '').toLowerCase();
      const bStatus = (b.booking.status || b.booking.Status || '').toLowerCase();
      const aOrder = statusOrder[aStatus] || 99;
      const bOrder = statusOrder[bStatus] || 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      // Secondary sort: by workdate descending
      const aDate = new Date(a.booking.workdate || a.booking.workDate || a.booking.WorkDate || 0);
      const bDate = new Date(b.booking.workdate || b.booking.workDate || b.booking.WorkDate || 0);
      return bDate - aDate;
    });
    return filtered;
  }, [bookings, careProfiles, filterStatus, search]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
      <span className="text-lg text-gray-700">Đang tải...</span>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-600 text-lg font-semibold">{error}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h3 className="font-bold text-2xl mb-6 text-blue-700 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M12 6v6l4 2" strokeLinecap="round" /></svg>
        Bệnh nhân tôi phụ trách
      </h3>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              className="w-full px-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Tìm kiếm theo tên, địa chỉ, SĐT..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {/* Search icon SVG */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
                <path stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3" />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Lọc trạng thái:</label>
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="isscheduled">Đã lên lịch</option>
            <option value="paid">Đã thanh toán</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patientRows.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow text-gray-500">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path stroke="#a3a3a3" strokeWidth="2" d="M12 6v6l4 2" strokeLinecap="round" /></svg>
            Không có bệnh nhân nào.
          </div>
        )}
        {patientRows.map(({ booking, patient }, index) => {
          const raw = (booking.status || booking.Status || '').toString().toLowerCase();
          const mapping = {
            paid: { label: 'Đã thanh toán', cls: 'bg-pink-100 text-green-700' },
            pending: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700' },
            confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700' },
            completed: { label: 'Hoàn thành', cls: 'bg-emerald-100 text-emerald-700' },
            cancelled: { label: 'Đã hủy', cls: 'bg-gray-200 text-gray-700' },
            canceled: { label: 'Đã hủy', cls: 'bg-gray-200 text-gray-700' },
            waiting: { label: 'Đang chờ', cls: 'bg-slate-100 text-slate-700' },
            isscheduled: { label: 'Đã lên lịch', cls: 'bg-indigo-100 text-indigo-700' },
          };
          const v = mapping[raw] || { label: booking.status || booking.Status || '-', cls: 'bg-gray-100 text-gray-700' };
          return (
            <div key={booking.bookingID || booking.BookingID} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">#{booking.bookingID || booking.BookingID}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.cls}`}>{v.label}</span>
              </div>
              <div className="font-semibold text-lg text-gray-800 mb-1 flex items-center gap-2">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#2563eb" strokeWidth="2" /><path stroke="#2563eb" strokeWidth="2" d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" /></svg>
                {patient?.profileName || patient?.ProfileName || '-'}
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div><span className="font-medium">Ngày sinh:</span> {formatDateToDDMMYYYY(patient?.dateOfBirth || patient?.DateOfBirth) || '-'}</div>
                <div><span className="font-medium">SĐT:</span> {patient?.phoneNumber || patient?.PhoneNumber || '-'}</div>
                <div><span className="font-medium">Địa chỉ:</span> {patient?.address || patient?.Address || '-'}</div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                  onClick={() => setSelectedPatient({ booking, patient })}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setSelectedPatient(null)}
              aria-label="Đóng"
            >✕</button>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-700 font-bold text-lg">Lịch hẹn #{selectedPatient.booking.bookingID || selectedPatient.booking.BookingID}</span>
              </div>
              <div className="text-gray-600 text-sm">Ngày làm việc: <span className="font-medium">{formatDateToDDMMYYYY(selectedPatient.booking?.workdate || selectedPatient.booking?.workDate || selectedPatient.booking?.WorkDate) || '-'}</span></div>
              <div className="text-gray-600 text-sm">Giờ làm việc: <span className="font-medium">{(() => {
                const dt = selectedPatient.booking?.workdate || selectedPatient.booking?.workDate || selectedPatient.booking?.WorkDate;
                if (!dt) return '-';
                try {
                  const date = new Date(dt);
                  if (isNaN(date.getTime())) return '-';
                  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                } catch {
                  return '-';
                }
              })()}</span></div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-800 mb-1">Bệnh nhân</div>
              <div className="flex items-center gap-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#2563eb" strokeWidth="2" /><path stroke="#2563eb" strokeWidth="2" d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" /></svg>
                <span className="text-gray-700 text-base font-medium">{selectedPatient.patient?.profileName || selectedPatient.patient?.ProfileName}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">SĐT: {selectedPatient.patient?.phoneNumber || selectedPatient.patient?.PhoneNumber || '-'}</div>
              <div className="text-xs text-gray-500 mt-1">Ngày sinh: {formatDateToDDMMYYYY(selectedPatient.patient?.dateOfBirth || selectedPatient.patient?.DateOfBirth) || '-'}</div>
              <div className="text-xs text-gray-500 mt-1">Địa chỉ: {selectedPatient.patient?.address || selectedPatient.patient?.Address || '-'}</div>
              <div className="text-xs text-gray-500 mt-1">Ghi chú: {selectedPatient.patient?.notes || selectedPatient.patient?.Notes || '-'}</div>
            </div>
            <div className="mt-6 text-right">
              <button className="px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors duration-150" onClick={() => setSelectedPatient(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NursePatientsTab; 