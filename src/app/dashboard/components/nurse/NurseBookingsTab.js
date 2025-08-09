import React, { useState, useEffect, useContext, useMemo } from 'react';
import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import bookingService from '@/services/api/bookingService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { AuthContext } from '@/context/AuthContext';

const NurseBookingsTab = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
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
        const me = specialists.find(s => (s.accountID || s.AccountID) === user.accountID);
        const nursingID = me?.nursingID || me?.NursingID;

        // Optimized: lấy bookings trực tiếp theo nurse qua aggregator route
        const [mine, pkgs, tasks, sts, svTypes] = await Promise.all([
          bookingService.getBookingsByNursing(nursingID),
          customizePackageService.getCustomizePackages ? customizePackageService.getCustomizePackages() : customizePackageService.getAllCustomizePackages?.() || Promise.resolve([]),
          customizeTaskService.getAllCustomizeTasks ? customizeTaskService.getAllCustomizeTasks() : customizeTaskService.getAllCustomizeTasks(),
          serviceTaskService.getServiceTasks ? serviceTaskService.getServiceTasks() : serviceTaskService.getAllServiceTasks?.() || Promise.resolve([]),
          serviceTypeService.getServiceTypes ? serviceTypeService.getServiceTypes() : serviceTypeService.getAllServiceTypes?.() || Promise.resolve([]),
        ]);
        setBookings(Array.isArray(mine) ? mine : []);

        setCustomizePackages(Array.isArray(pkgs) ? pkgs : []);
        setCustomizeTasks(Array.isArray(tasks) ? tasks : []);
        setServiceTasks(Array.isArray(sts) ? sts : []);
        setServiceTypes(Array.isArray(svTypes) ? svTypes : []);
      } catch (e) {
        setError(e?.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

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
    return { patient, detailTasks };
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Booking của tôi</h3>
      <div className="w-full bg-white rounded shadow">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Booking</th>
              <th className="px-4 py-2 text-left">Bệnh nhân</th>
              <th className="px-4 py-2 text-left">Ngày làm việc</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">Không có booking nào.</td>
              </tr>
            )}
            {bookings.map(b => {
              const cpId = b.careProfileID || b.CareProfileID;
              const patient = (b.careProfile || b.CareProfile) || careProfiles.find(p => (p.careProfileID || p.CareProfileID) === cpId);
              const workdate = b.workdate || b.workDate || b.WorkDate;
              const status = b.status || b.Status;
              return (
                <tr key={b.bookingID || b.BookingID} className="border-t">
                  <td className="px-4 py-2">#{b.bookingID || b.BookingID}</td>
                  <td className="px-4 py-2">{patient?.profileName || patient?.ProfileName || '-'}</td>
                  <td className="px-4 py-2">{workdate ? new Date(workdate).toLocaleString('vi-VN') : '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${status === 'completed' ? 'bg-green-100 text-green-700' : status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{status}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="px-3 py-1.5 bg-purple-600 text-white rounded" onClick={() => setSelectedBooking(b)}>Xem</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedBooking && (() => {
        const { patient, detailTasks } = getBookingDetail(selectedBooking);
        const workdate = selectedBooking.workdate || selectedBooking.workDate || selectedBooking.WorkDate;
        const status = selectedBooking.status || selectedBooking.Status;
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">Chi tiết Booking #{selectedBooking.bookingID || selectedBooking.BookingID}</h4>
                <button className="text-gray-500" onClick={() => setSelectedBooking(null)}>✕</button>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Bệnh nhân:</span> {patient?.profileName || patient?.ProfileName}</div>
                <div><span className="text-gray-500">Địa chỉ:</span> {patient?.address || patient?.Address}</div>
                <div><span className="text-gray-500">SĐT:</span> {patient?.phoneNumber || patient?.PhoneNumber}</div>
                <div><span className="text-gray-500">Ngày làm việc:</span> {workdate ? new Date(workdate).toLocaleString('vi-VN') : '-'}</div>
                <div><span className="text-gray-500">Trạng thái:</span> {status}</div>
                <div className="pt-2">
                  <div className="font-semibold mb-1">Dịch vụ chi tiết</div>
                  <ul className="list-disc ml-5">
                    {detailTasks.length === 0 && <li className="text-gray-500">Không có dịch vụ chi tiết.</li>}
                    {detailTasks.map((t, idx) => (
                      <li key={idx}>{t.serviceName} <span className="text-xs text-gray-500">({(t.price || 0).toLocaleString('vi-VN')}đ x {t.quantity || 1} = {(t.total || 0).toLocaleString('vi-VN')}đ)</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setSelectedBooking(null)}>Đóng</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default NurseBookingsTab; 