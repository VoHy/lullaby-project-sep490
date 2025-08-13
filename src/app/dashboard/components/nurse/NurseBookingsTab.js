import React, { useState, useEffect, useContext } from 'react';
import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import bookingService from '@/services/api/bookingService';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import careProfileService from '@/services/api/careProfileService';
import { AuthContext } from '@/context/AuthContext';

const NurseBookingsTab = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!user?.accountID) {
          setBookings([]);
          return;
        }
        const specialists = await nursingSpecialistService.getAllNursingSpecialists();
        const me = specialists.find(s => (s.accountID || s.AccountID) === (user.accountID || user.AccountID));
        const nursingID = me?.nursingID || me?.NursingID;

        // Try aggregator endpoint first; if it fails, fall back to client-side join
        let mine = [];
        try {
          mine = await bookingService.getBookingsByNursing(nursingID);
        } catch (_) {
          // fallback below
        }

        const [pkgs, tasks, sts, svTypes, cps, accs] = await Promise.all([
          customizePackageService.getAllCustomizePackages ? customizePackageService.getAllCustomizePackages() : Promise.resolve([]),
          customizeTaskService.getAllCustomizeTasks ? customizeTaskService.getAllCustomizeTasks() : Promise.resolve([]),
          serviceTaskService.getServiceTasks ? serviceTaskService.getServiceTasks() : Promise.resolve([]),
          serviceTypeService.getServiceTypes ? serviceTypeService.getServiceTypes() : (serviceTypeService.getAllServiceTypes?.() || Promise.resolve([])),
          careProfileService.getCareProfiles ? careProfileService.getCareProfiles() : Promise.resolve([]),
          accountService.getAllAccounts ? accountService.getAllAccounts() : Promise.resolve([]),
        ]);

        // If aggregator route not available or empty, compute from customize tasks
        if (!Array.isArray(mine) || mine.length === 0) {
          const bookingIds = new Set((tasks || [])
            .filter(t => (t.nursingID || t.NursingID) === nursingID)
            .map(t => t.bookingID || t.BookingID)
            .filter(Boolean));

          try {
            const all = await bookingService.getAllBookings();
            mine = (all || []).filter(b => bookingIds.has(b.bookingID || b.BookingID));
          } catch (err) {
            // Keep mine as [] and surface error below
            if (!mine || mine.length === 0) throw err;
          }
        }

        setBookings(Array.isArray(mine) ? mine : []);
        setCustomizePackages(Array.isArray(pkgs) ? pkgs : []);
        setCustomizeTasks(Array.isArray(tasks) ? tasks : []);
        setServiceTasks(Array.isArray(sts) ? sts : []);
        setServiceTypes(Array.isArray(svTypes) ? svTypes : []);
        setCareProfiles(Array.isArray(cps) ? cps : []);
        setAccounts(Array.isArray(accs) ? accs : []);
      } catch (e) {
        setError(e?.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getStatusView = (rawStatus) => {
    const s = (rawStatus || '').toString().toLowerCase();
    switch (s) {
      case 'paid':
        return { label: 'Đã thanh toán', cls: 'bg-green-100 text-green-700' };
      case 'pending':
        return { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700' };
      case 'completed':
        return { label: 'Hoàn thành', cls: 'bg-emerald-100 text-emerald-700' };
      case 'cancelled':
      case 'canceled':
        return { label: 'Đã hủy', cls: 'bg-gray-200 text-gray-700' };
      case 'waiting':
        return { label: 'Đang chờ', cls: 'bg-slate-100 text-slate-700' };
      case 'isscheduled':
        return { label: 'Đã lên lịch', cls: 'bg-indigo-100 text-indigo-700' };
      default:
        return { label: rawStatus || '-', cls: 'bg-gray-100 text-gray-700' };
    }
  };

  const getBookingDetail = (booking) => {
    const patient = booking.careProfile || booking.CareProfile;
    // Tập dịch vụ chi tiết từ customize task nếu có
    const ctOfBooking = customizeTasks.filter(t => (t.bookingID || t.BookingID) === (booking.bookingID || booking.BookingID));
    const detailTasks = ctOfBooking.map(t => {
      const st = serviceTasks.find(x => (x.serviceTaskID || x.ServiceTaskID) === (t.serviceTaskID || t.ServiceTaskID));
      const sv = serviceTypes.find(sv => (sv.serviceID || sv.ServiceID) === (t.serviceID || t.ServiceID));
      const serviceName = st?.description || st?.Description || sv?.serviceName || sv?.name || sv?.Name || '-';
      const quantity = t.quantity ?? t.Quantity ?? 1;
      const unitPrice = (t.price ?? t.Price ?? sv?.price ?? 0);
      const total = (t.total ?? t.Total ?? (unitPrice * quantity));
      return {
        serviceName,
        price: unitPrice,
        quantity,
        total,
        status: t.status || t.Status,
      };
    });
    const acc = accounts.find(a => (a.accountID || a.AccountID) === (patient?.accountID || patient?.AccountID));
    return { patient, detailTasks, account: acc };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mr-3"></div>
      <span className="text-lg text-gray-700">Đang tải...</span>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-600 text-lg font-semibold">{error}</div>
    </div>
  );

  // Filter and sort bookings
  const filteredSortedBookings = (bookings || [])
    .filter(b => {
      if (filterStatus === 'all') return true;
      const status = (b.status || b.Status || '').toLowerCase();
      return status === filterStatus;
    })
    .sort((a, b) => {
      const statusOrder = {
        isscheduled: 1,
        completed: 2,
        cancelled: 3,
        canceled: 3,
      };
      const aStatus = (a.status || a.Status || '').toLowerCase();
      const bStatus = (b.status || b.Status || '').toLowerCase();
      const aOrder = statusOrder[aStatus] || 99;
      const bOrder = statusOrder[bStatus] || 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      // Secondary sort: by workdate descending
      const aDate = new Date(a.workdate || a.workDate || a.WorkDate || 0);
      const bDate = new Date(b.workdate || b.workDate || b.WorkDate || 0);
      return bDate - aDate;
    });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h3 className="font-bold text-2xl mb-6 text-purple-700 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#7c3aed" strokeWidth="2" d="M7 7h10M7 11h10M7 15h6" strokeLinecap="round" /></svg>
        Lịch hẹn của tôi
      </h3>
      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium text-gray-700">Lọc trạng thái:</label>
        <select
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="isscheduled">Đã lên lịch</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
          <option value="paid">Đã thanh toán</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSortedBookings.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow text-gray-500">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path stroke="#a3a3a3" strokeWidth="2" d="M12 6v6l4 2" strokeLinecap="round" /></svg>
            Không có booking nào.
          </div>
        )}
        {filteredSortedBookings.map((b, index) => {
          const cpId = b.careProfileID || b.CareProfileID;
          const patient = (b.careProfile || b.CareProfile) || careProfiles.find(p => (p.careProfileID || p.CareProfileID) === cpId);
          const workdate = b.workdate || b.workDate || b.WorkDate;
          const status = b.status || b.Status;
          const sv = getStatusView(status);
          return (
            <div key={b.bookingID || b.BookingID} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">#{b.bookingID || b.BookingID}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sv.cls}`}>{sv.label}</span>
              </div>
              <div className="font-semibold text-lg text-gray-800 mb-1">Khách hàng: {patient?.profileName || patient?.ProfileName || '-'}</div>
              <div className="text-sm text-gray-500 mb-2">SĐT: {patient?.phoneNumber || patient?.Phone || '-'}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#7c3aed" strokeWidth="2" d="M8 7V3h8v4" /><rect x="4" y="7" width="16" height="13" rx="2" stroke="#7c3aed" strokeWidth="2" /></svg>
                {workdate ? new Date(workdate).toLocaleString('vi-VN') : '-'}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                  onClick={() => setSelectedBooking(b)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBooking && (() => {
        const { patient, detailTasks, account } = getBookingDetail(selectedBooking);
        const workdate = selectedBooking.workdate || selectedBooking.workDate || selectedBooking.WorkDate;
        const status = selectedBooking.status || selectedBooking.Status;
        const sv = getStatusView(status);
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setSelectedBooking(null)}
                aria-label="Đóng"
              >✕</button>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-700 font-bold text-lg">Booking #{selectedBooking.bookingID || selectedBooking.BookingID}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sv.cls}`}>{sv.label}</span>
                </div>
                <div className="text-gray-600 text-sm">Ngày làm việc: <span className="font-medium">{workdate ? new Date(workdate).toLocaleString('vi-VN') : '-'}</span></div>
              </div>
              <div className="mb-4">
                {account && (
                  <div className="text-xs text-gray-500 mt-1">SĐT: {account.phoneNumber || account.Phone || '-'}</div>
                )}
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Dịch vụ chi tiết</div>
                <ul className="list-none ml-0">
                  {detailTasks.length === 0 && <li className="text-gray-500">Không có dịch vụ chi tiết.</li>}
                  {detailTasks.map((t, idx) => (
                    <li key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="text-gray-700 font-medium">{t.serviceName}</span>
                      <span className="text-xs text-gray-500">{(t.price || 0).toLocaleString('vi-VN')}đ x {t.quantity || 1} = <span className="font-semibold text-purple-700">{(t.total || 0).toLocaleString('vi-VN')}đ</span></span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 text-right">
                <button className="px-5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-semibold transition-colors duration-150" onClick={() => setSelectedBooking(null)}>Đóng</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default NurseBookingsTab; 