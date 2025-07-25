import React, { useState } from 'react';
import bookingsData from '@/mock/Booking';
import accounts from '@/mock/Account';
import careProfiles from '@/mock/CareProfile';
import serviceTypes from '@/mock/ServiceType';
import customerPackages from '@/mock/CustomerPackage';
import customerTasks from '@/mock/CustomerTask';
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
  } else if (booking.CareProfileID) {
    service = serviceTypes.find(s => s.ServiceID === booking.CareProfileID);
  }
  // Lấy các dịch vụ con/lẻ thực tế từ CustomerTask
  const customerTasksOfBooking = customerTasks.filter(t => t.BookingID === booking.BookingID);
  const serviceTasksOfBooking = customerTasksOfBooking.map(task => {
    const serviceTask = serviceTasks.find(st => st.ServiceTaskID === task.ServiceTaskID);
    const nurse = nursingSpecialists.find(n => n.NursingID === task.NursingID);
    return {
      ...serviceTask,
      price: task.Price,
      quantity: task.Quantity,
      total: task.Total,
      status: task.Status,
      nurseName: nurse?.FullName,
      nurseRole: nurse?.Major
    };
  });
  return { careProfile, account, service, packageInfo, serviceTasksOfBooking };
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
    setSelectedStatus(booking.Status);
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
    if (detailData) {
      // Lấy các dịch vụ con thực tế của booking
      const { serviceTasksOfBooking } = getBookingDetail(detailData);
      const result = serviceTasksOfBooking.map(task => {
        // Ưu tiên lấy nhân sự đã có, nếu chưa có thì lấy từ taskAssignments
        const nurseName = task.nurseName
          || (taskAssignments[task.ServiceTaskID]?.nurse
            ? allNurses.find(n => n.AccountID === Number(taskAssignments[task.ServiceTaskID]?.nurse))?.full_name
            : 'Chưa chọn');
        const specialistName = task.nurseRole
          || (taskAssignments[task.ServiceTaskID]?.specialist
            ? allSpecialists.find(s => s.AccountID === Number(taskAssignments[task.ServiceTaskID]?.specialist))?.full_name
            : 'Chưa chọn');
        return `- ${task.Description}: Nurse: ${nurseName}, Specialist: ${specialistName}`;
      }).join('\n');
      alert(`Gán cho từng dịch vụ:\n${result}`);
      setShowDetail(false);
    }
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
            const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(booking);
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
                  {packageInfo
                    ? packageInfo.Name
                    : (
                      serviceTasksOfBooking && serviceTasksOfBooking.length > 1
                        ? (
                          <ul className="space-y-1">
                            {serviceTasksOfBooking.map((task, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-800">
                                <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                                {task.Description}
                              </li>
                            ))}
                          </ul>
                        )
                        : (serviceTasksOfBooking[0]?.Description || service?.ServiceName || '-')
                    )
                  }
                </td>
                <td className="px-6 py-4">
                  <span className={` inline-block min-w-[80px] px-2 py-0.5 rounded-full text-xs font-semibold text-center shadow-sm 
                  ${booking.Status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.Status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                    }`}>
                    {statusOptions.find(opt => opt.value === booking.Status)?.label || booking.Status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewDetail(booking)} className="min-w-[80px] px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:shadow-sm">Xem chi tiết</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Popup chi tiết booking */}
      {showDetail && detailData && (() => {
        const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(detailData);
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
                {packageInfo && <><div className="font-medium text-gray-600">Mô tả gói:</div><div>{packageInfo.Description}</div></>}
                <div className="font-medium text-gray-600">Ngày đặt:</div>
                <div>{detailData.CreatedAt ? new Date(detailData.CreatedAt).toLocaleString('vi-VN') : '-'}</div>
                <div className="font-medium text-gray-600">Ngày làm việc:</div>
                <div>{detailData.WorkDate ? new Date(detailData.WorkDate).toLocaleString('vi-VN') : '-'}</div>
                <div className="font-medium text-gray-600">Giá tiền:</div>
                <div>{detailData.Amount?.toLocaleString('vi-VN') || '-'} VND</div>
                <div className="font-medium text-gray-600">Trạng thái:</div>
                <div>
                  <select
                    value={selectedStatus || detailData.Status}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="px-2 py-1 rounded border"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Dịch vụ chi tiết:</span>
                <ul className="list-disc ml-6 mt-1">
                  {serviceTasksOfBooking.length === 0 && <li className="text-gray-400 text-xs">Không có dịch vụ chi tiết.</li>}
                  {serviceTasksOfBooking.map((task, idx) => (
                    <li key={idx} className="text-sm">
                      {task?.Description} <span className="text-xs text-gray-500">({task?.price?.toLocaleString()}đ)</span>
                      {task.nurseName && (
                        <span className="ml-2 text-xs text-blue-700">- {task.nurseName} ({task.nurseRole})</span>
                      )}
                      {task.Status && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${task.Status === 'active' ? 'bg-blue-100 text-blue-700' : task.Status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{task.Status}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {isPackage ? (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Danh sách dịch vụ trong gói:</h4>
                  <table className="w-full text-sm border rounded">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                        <th className="p-2 text-left">Dịch vụ</th>
                        <th className="p-2 text-left">Giá</th>
                        <th className="p-2 text-left">Nhân sự</th>
                        <th className="p-2 text-left">Vai trò</th>
                        <th className="p-2 text-left">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceTasksOfBooking.map((task, idx) => (
                        <tr key={task.ServiceTaskID}>
                          <td className="p-2">{task?.Description}</td>
                          <td className="p-2">{task?.price?.toLocaleString()}đ</td>
                          <td className="p-2">
                            {task.nurseName
                              ? task.nurseName
                              : (
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
                              )
                            }
                          </td>
                          <td className="p-2">
                            {task.nurseRole
                              ? task.nurseRole
                              : (
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
                              )
                            }
                          </td>
                          <td className="p-2">{task.status}</td>
                        </tr>
                      ))}
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