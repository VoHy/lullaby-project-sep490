import React, { useState } from 'react';
import bookingsData from '@/mock/Booking';
import accounts from '@/mock/Account';
import careProfiles from '@/mock/CareProfile';
import serviceTypes from '@/mock/ServiceType';
import customerPackages from '@/mock/CustomerPackage';
import serviceTasks from '@/mock/ServiceTask';
import zoneDetails from '@/mock/Zone_Detail';
import nursingSpecialists from '@/mock/NursingSpecialist';

const allNurses = accounts.filter(acc => acc.role_id === 2 && nursingSpecialists.find(n => n.AccountID === acc.AccountID));
const allSpecialists = accounts.filter(acc => acc.role_id === 5 && nursingSpecialists.find(s => s.AccountID === acc.AccountID));

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'accepted', label: 'Đã nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

function getBookingDetail(booking) {
  const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
  const account = accounts.find(a => a.AccountID === careProfile?.AccountID);
  let service = null;
  let packageInfo = null;
  if (booking.CustomizePackageID) {
    packageInfo = customerPackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
    service = serviceTypes.find(s => s.ServiceID === packageInfo?.ServiceID);
  } else if (booking.care_id) {
    service = serviceTypes.find(s => s.ServiceID === booking.care_id);
  }
  return { careProfile, account, service, packageInfo };
}

const ManagerBookingTab = () => {
  const [bookings] = useState(bookingsData);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [taskAssignments, setTaskAssignments] = useState({}); // { [ServiceTaskID]: { nurse: '', specialist: '' } }

  // Lọc nurse/specialist theo khu vực của khách hàng booking (join Account với NursingSpecialist để lấy ZoneID)
  function getFilteredNursesSpecialists(careProfile) {
    if (!careProfile) return { nurses: [], specialists: [] };
    const zoneDetail = zoneDetails.find(z => z.ZoneDetailID === careProfile.ZoneDetailID);
    if (!zoneDetail) return { nurses: [], specialists: [] };
    const zoneId = zoneDetail.ZoneID;
    // Join Account với NursingSpecialist để lấy đúng ZoneID
    const nurses = allNurses.filter(acc => {
      const n = nursingSpecialists.find(n => n.AccountID === acc.AccountID);
      return n && n.ZoneID === zoneId;
    });
    const specialists = allSpecialists.filter(acc => {
      const s = nursingSpecialists.find(s => s.AccountID === acc.AccountID);
      return s && s.ZoneID === zoneId;
    });
    return { nurses, specialists };
  }

  const handleViewDetail = (booking) => {
    setDetailData(booking);
    setSelectedNurse('');
    setSelectedSpecialist('');
    setSelectedStatus(booking.status);
    setTaskAssignments({});
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };
  const handleTaskAssign = (taskId, type, value) => {
    setTaskAssignments(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], [type]: value }
    }));
  };
  const handleAccept = () => {
    if (detailData && detailData.CustomizePackageID) {
      const tasks = serviceTasks.filter(task => task.Package_ServiceID === detailData.package_id);
      const result = tasks.map(task => {
        const nurse = allNurses.find(n => n.AccountID === Number(taskAssignments[task.ServiceTaskID]?.nurse));
        const specialist = allSpecialists.find(s => s.AccountID === Number(taskAssignments[task.ServiceTaskID]?.specialist));
        return `- ${task.Description}: Nurse: ${nurse ? nurse.full_name : 'Chưa chọn'}, Specialist: ${specialist ? specialist.full_name : 'Chưa chọn'}`;
      }).join('\n');
      alert(`Gán cho từng dịch vụ:\n${result}`);
    } else {
      const nurse = allNurses.find(n => n.AccountID === Number(selectedNurse));
      const specialist = allSpecialists.find(s => s.AccountID === Number(selectedSpecialist));
      alert(`Đã gán:\nNurse: ${nurse ? nurse.full_name : 'Chưa chọn'}\nSpecialist: ${specialist ? specialist.full_name : 'Chưa chọn'}\nStatus: ${selectedStatus}`);
    }
    setShowDetail(false);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Danh sách Booking</h3>
      <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Mã Booking</th>
            <th className="px-6 py-3 text-left">Khách hàng</th>
            <th className="px-6 py-3 text-left">Dịch vụ</th>
            <th className="px-6 py-3 text-left">Trạng thái</th>
            <th className="px-6 py-3 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map(booking => {
            const { careProfile, account, service, packageInfo } = getBookingDetail(booking);
            return (
              <tr key={booking.BookingID} className="hover:bg-gray-50">
                <td className="px-6 py-4">#{booking.BookingID}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold">{careProfile?.ProfileName || '-'}</div>
                  <div className="text-xs text-gray-500">SĐT: {careProfile?.PhoneNumber || '-'}</div>
                  <div className="text-xs text-gray-500">Địa chỉ: {careProfile?.Address || '-'}</div>
                  <div className="text-xs text-gray-500">Email: {account?.email || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  {packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {statusOptions.find(opt => opt.value === booking.status)?.label || booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewDetail(booking)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded hover:shadow-lg">Xem chi tiết</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Popup chi tiết booking */}
      {showDetail && detailData && (() => {
        const { careProfile, account, service, packageInfo } = getBookingDetail(detailData);
        const isPackage = !!detailData.CustomizePackageID;
        // Lọc nurse/specialist cùng khu vực
        const { nurses, specialists } = getFilteredNursesSpecialists(careProfile);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
              <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">Chi tiết Booking #{detailData.BookingID}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
                <div className="font-medium text-gray-600">Khách hàng:</div>
                <div>{careProfile?.ProfileName || '-'}</div>
                <div className="font-medium text-gray-600">SĐT:</div>
                <div>{careProfile?.PhoneNumber || '-'}</div>
                <div className="font-medium text-gray-600">Địa chỉ:</div>
                <div>{careProfile?.Address || '-'}</div>
                <div className="font-medium text-gray-600">Email:</div>
                <div>{account?.email || '-'}</div>
                <div className="font-medium text-gray-600">Dịch vụ:</div>
                <div>{packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}</div>
                {packageInfo && <><div className="font-medium text-gray-600">Chi tiết gói:</div><div>{packageInfo.Description}</div></>}
                <div className="font-medium text-gray-600">Ngày đặt:</div>
                <div>{detailData.booking_date ? new Date(detailData.booking_date).toLocaleString('vi-VN') : '-'}</div>
                <div className="font-medium text-gray-600">Ngày làm việc:</div>
                <div>{detailData.work_date ? new Date(detailData.work_date).toLocaleString('vi-VN') : '-'}</div>
                <div className="font-medium text-gray-600">Giá tiền:</div>
                <div>{detailData.total_price?.toLocaleString('vi-VN') || '-'} VND</div>
                <div className="font-medium text-gray-600">Trạng thái:</div>
                <div>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="px-2 py-1 rounded border"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {isPackage ? (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Danh sách dịch vụ trong gói:</h4>
                  <table className="w-full text-sm border rounded">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                        <th className="p-2 text-left">Dịch vụ</th>
                        <th className="p-2 text-left">Mô tả</th>
                        <th className="p-2 text-left">Chọn Nurse</th>
                        <th className="p-2 text-left">Chọn Specialist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceTasks.filter(task => task.Package_ServiceID === detailData.package_id).map(task => {
                        const childService = serviceTypes.find(s => s.ServiceID === task.Child_ServiceID);
                        return (
                          <tr key={task.ServiceTaskID}>
                            <td className="p-2">{childService?.ServiceName || '-'}</td>
                            <td className="p-2">{task.Description}</td>
                            <td className="p-2">
                              <select
                                value={taskAssignments[task.ServiceTaskID]?.nurse || ''}
                                onChange={e => handleTaskAssign(task.ServiceTaskID, 'nurse', e.target.value)}
                                className="px-2 py-1 rounded border"
                              >
                                <option value="">Chọn nurse</option>
                                {nurses.map(n => (
                                  <option key={n.AccountID} value={n.AccountID}>{n.full_name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <select
                                value={taskAssignments[task.ServiceTaskID]?.specialist || ''}
                                onChange={e => handleTaskAssign(task.ServiceTaskID, 'specialist', e.target.value)}
                                className="px-2 py-1 rounded border"
                              >
                                <option value="">Chọn specialist</option>
                                {specialists.map(s => (
                                  <option key={s.AccountID} value={s.AccountID}>{s.full_name}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
                  <div className="font-medium text-gray-600">Chọn Nurse:</div>
                  <div>
                    <select
                      value={selectedNurse}
                      onChange={e => setSelectedNurse(e.target.value)}
                      className="px-2 py-1 rounded border"
                    >
                      <option value="">Chọn nurse</option>
                      {nurses.map(n => (
                        <option key={n.AccountID} value={n.AccountID}>{n.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="font-medium text-gray-600">Chọn Specialist:</div>
                  <div>
                    <select
                      value={selectedSpecialist}
                      onChange={e => setSelectedSpecialist(e.target.value)}
                      className="px-2 py-1 rounded border"
                    >
                      <option value="">Chọn specialist</option>
                      {specialists.map(s => (
                        <option key={s.AccountID} value={s.AccountID}>{s.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAccept}
                  className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ManagerBookingTab; 