import React, { useEffect, useMemo, useState, useContext } from 'react';
import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import customizeTaskService from '@/services/api/customizeTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { AuthContext } from '@/context/AuthContext';

// const NursePatientsTab = ({ patients }) => {
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   return (
//     <div>
//       <h3 className="font-semibold text-lg mb-2">Hồ sơ bệnh nhân phụ trách</h3>
//       <ul className="space-y-2">
//         {patients.length === 0 && (
//           <li className="text-gray-500">Không có bệnh nhân nào.</li>
//         )}
//         {patients.map(p => (
//           <li key={p.CareProfileID} className="p-3 bg-gray-50 rounded flex flex-col md:flex-row md:justify-between md:items-center">
//             <div>
//               <span className="font-semibold">{p.ProfileName}</span> - {p.DateOfBirth}
//               <div className="text-xs text-gray-500">Địa chỉ: {p.Address}</div>
//             </div>
//             <button
//               className="mt-2 md:mt-0 px-4 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold hover:shadow-lg"
//               onClick={() => setSelectedPatient(p)}
//             >
//               Xem hồ sơ
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Modal chi tiết bệnh nhân */}
//       {selectedPatient && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative animate-fade-in">
//             <button
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
//               onClick={() => setSelectedPatient(null)}
//               title="Đóng"
//             >✕</button>
//             <h4 className="text-xl font-bold mb-4 text-blue-700">Chi tiết hồ sơ bệnh nhân</h4>
//             <div className="flex flex-col items-center mb-4">
//               <img
//                 src={selectedPatient.Image && selectedPatient.Image !== 'string' ? selectedPatient.Image : '/images/logo-eldora.png'}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mb-2"
//               />
//               <div className="font-semibold text-lg text-gray-800 mb-1">{selectedPatient.ProfileName}</div>
//               <div className="text-xs text-gray-500 mb-1">{selectedPatient.DateOfBirth} - {selectedPatient.Gender}</div>
//             </div>
//             <div className="space-y-2 text-sm">
//               <div><span className="font-medium text-gray-600">Địa chỉ:</span> {selectedPatient.Address}</div>
//               <div><span className="font-medium text-gray-600">Số điện thoại:</span> {selectedPatient.PhoneNumber}</div>
//               <div><span className="font-medium text-gray-600">Ghi chú:</span> {selectedPatient.Notes}</div>
//               <div>
//                 <span className="font-medium text-gray-600">Trạng thái:</span>{' '}
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                   selectedPatient.Status === 'active'
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-red-100 text-red-700'
//                 }`}>
//                   {selectedPatient.Status === 'active' ? 'Đang theo dõi' : 'Ngưng theo dõi'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
const NursePatientsTab = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const patientRows = useMemo(() => {
    return bookings.map(b => {
      const cpId = b.careProfileID || b.CareProfileID;
      const cp = (b.careProfile || b.CareProfile) || careProfiles.find(p => (p.careProfileID || p.CareProfileID) === cpId);
      return { booking: b, patient: cp };
    });
  }, [bookings, careProfiles]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Bệnh nhân tôi phụ trách</h3>
      <div className="w-full bg-white rounded shadow">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Booking</th>
              <th className="px-4 py-2 text-left">Bệnh nhân</th>
              <th className="px-4 py-2 text-left">Ngày sinh</th>
              <th className="px-4 py-2 text-left">SĐT</th>
              <th className="px-4 py-2 text-left">Địa chỉ</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {patientRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Không có bệnh nhân nào.</td>
              </tr>
            )}
            {patientRows.map(({ booking, patient }) => (
              <tr key={booking.bookingID || booking.BookingID} className="border-t">
                <td className="px-4 py-2">#{booking.bookingID || booking.BookingID}</td>
                <td className="px-4 py-2">{patient?.profileName || patient?.ProfileName || '-'}</td>
                <td className="px-4 py-2">{patient?.dateOfBirth || patient?.DateOfBirth || '-'}</td>
                <td className="px-4 py-2">{patient?.phoneNumber || patient?.PhoneNumber || '-'}</td>
                <td className="px-4 py-2">{patient?.address || patient?.Address || '-'}</td>
                <td className="px-4 py-2">
                  {(() => {
                    const raw = (booking.status || booking.Status || '').toString().toLowerCase();
                    const mapping = {
                      paid: { label: 'Đã thanh toán', cls: 'bg-green-100 text-green-700' },
                      pending: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700' },
                      confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700' },
                      completed: { label: 'Hoàn thành', cls: 'bg-emerald-100 text-emerald-700' },
                      cancelled: { label: 'Đã hủy', cls: 'bg-gray-200 text-gray-700' },
                      canceled: { label: 'Đã hủy', cls: 'bg-gray-200 text-gray-700' },
                      waiting: { label: 'Đang chờ', cls: 'bg-slate-100 text-slate-700' },
                      isscheduled: { label: 'Đã lên lịch', cls: 'bg-indigo-100 text-indigo-700' },
                    };
                    const v = mapping[raw] || { label: booking.status || booking.Status || '-', cls: 'bg-gray-100 text-gray-700' };
                    return <span className={`px-2 py-1 rounded-full text-xs ${v.cls}`}>{v.label}</span>;
                  })()}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="px-3 py-1.5 bg-blue-600 text-white rounded"
                    onClick={() => setSelectedPatient({ booking, patient })}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">Chi tiết bệnh nhân</h4>
              <button className="text-gray-500" onClick={() => setSelectedPatient(null)}>✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Booking:</span> #{selectedPatient.booking.bookingID || selectedPatient.booking.BookingID}</div>
              <div><span className="text-gray-500">Bệnh nhân:</span> {selectedPatient.patient?.profileName || selectedPatient.patient?.ProfileName}</div>
              <div><span className="text-gray-500">Ngày sinh:</span> {selectedPatient.patient?.dateOfBirth || selectedPatient.patient?.DateOfBirth}</div>
              <div><span className="text-gray-500">SĐT:</span> {selectedPatient.patient?.phoneNumber || selectedPatient.patient?.PhoneNumber}</div>
              <div><span className="text-gray-500">Địa chỉ:</span> {selectedPatient.patient?.address || selectedPatient.patient?.Address}</div>
              <div><span className="text-gray-500">Ghi chú:</span> {selectedPatient.patient?.notes || selectedPatient.patient?.Notes || '-'}</div>
              <div><span className="text-gray-500">Trạng thái booking:</span> {selectedPatient.booking?.status || selectedPatient.booking?.Status}</div>
              <div><span className="text-gray-500">Ngày làm việc:</span> {(selectedPatient.booking?.workdate || selectedPatient.booking?.workDate || selectedPatient.booking?.WorkDate) ? new Date(selectedPatient.booking.workdate || selectedPatient.booking.workDate || selectedPatient.booking.WorkDate).toLocaleString('vi-VN') : '-'}</div>
            </div>
            <div className="mt-4 text-right">
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setSelectedPatient(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  
export default NursePatientsTab; 