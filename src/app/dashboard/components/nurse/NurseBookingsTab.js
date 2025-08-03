import React, { useState, useEffect } from 'react';
import careProfileService from '@/services/api/careProfileService';
import customizePackageService from '@/services/api/customizePackageService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';

const NurseBookingsTab = ({ nurseBookings }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [careProfiles, setCareProfiles] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [careProfilesData, customizePackagesData, customizeTasksData, serviceTasksData] = await Promise.all([
          careProfileService.getAllCareProfiles(),
          customizePackageService.getAllCustomizePackages(),
          customizeTaskService.getAllCustomizeTasks(),
          serviceTaskService.getAllServiceTasks()
        ]);
        setCareProfiles(careProfilesData);
        setCustomizePackages(customizePackagesData);
        setCustomizeTasks(customizeTasksData);
        setServiceTasks(serviceTasksData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lấy thông tin chi tiết booking
  const getBookingDetail = (booking) => {
    const patient = careProfiles.find(p => p.CareProfileID === booking.CareProfileID);
    const customizePackage = customizePackages.find(pkg => pkg.CustomizePackageID === booking.CustomizePackageID);
    // Lấy các dịch vụ con thực tế từ CustomizeTask
    const customizeTasksOfBooking = customizeTasks.filter(
      t => t.BookingID === booking.BookingID
    );
    const serviceTasksOfBooking = customizeTasksOfBooking.map(task => {
      const serviceTask = serviceTasks.find(st => st.ServiceTaskID === task.ServiceTaskID);
      return {
        ...serviceTask,
        price: task.Price,
        quantity: task.Quantity,
        total: task.Total,
        status: task.Status
      };
    });
    return { patient, customizePackage, serviceTasksOfBooking };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Danh sách lịch hẹn</h3>
      <div className="w-full max-wl mx-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center">Mã Booking</th>
              <th className="px-4 py-2 text-center">Bệnh nhân</th>
              <th className="px-4 py-2 text-center">Gói dịch vụ</th>
              <th className="px-4 py-2 text-center">Ngày đặt</th>
              <th className="px-4 py-2 text-center">Trạng thái</th>
              <th className="px-4 py-2 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {nurseBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">Không có booking nào.</td>
              </tr>
            )}
            {nurseBookings.map(b => {
              const patient = careProfiles.find(p => p.CareProfileID === b.CareProfileID);
              const customizePackage = customizePackages.find(pkg => pkg.CustomizePackageID === b.CustomizePackageID);
              return (
                <tr key={b.BookingID} className="border-t hover:bg-purple-50 transition">
                  <td className="px-4 py-2 text-center font-semibold">#{b.BookingID}</td>
                  <td className="px-4 py-2 text-center">{patient?.ProfileName || '-'}</td>
                  <td className="px-4 py-2 text-center">
                    {customizePackage?.Name
                      ? customizePackage.Name
                      : (
                        (() => {
                          const { serviceTasksOfBooking } = getBookingDetail(b);
                          return serviceTasksOfBooking && serviceTasksOfBooking.length > 1
                            ? (
                              <ul className="space-y-1 inline-block text-left">
                                {serviceTasksOfBooking.map((task, idx) => (
                                  <li key={idx} className="flex items-center text-xs text-gray-800">
                                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                                    {task.Description}
                                  </li>
                                ))}
                              </ul>
                            )
                            : (serviceTasksOfBooking[0]?.Description || '-');
                        })()
                      )
                    }
                  </td>
                  <td className="px-4 py-2 text-center">{b.CreatedAt ? new Date(b.CreatedAt).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.Status === 'completed' ? 'bg-green-100 text-green-700' : b.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {b.Status === 'completed' ? 'Hoàn thành' : b.Status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="px-4 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow hover:scale-105 transition"
                      onClick={() => setSelectedBooking(b)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết booking */}
      {selectedBooking && (() => {
        const { patient, customizePackage, serviceTasksOfBooking } = getBookingDetail(selectedBooking);
        return (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setSelectedBooking(null)}
                title="Đóng"
              >✕</button>
              <h4 className="text-xl font-bold mb-4 text-purple-700">Chi tiết Booking #{selectedBooking.BookingID}</h4>
              <div className="mb-3">
                <span className="font-semibold">Bệnh nhân:</span> {patient?.ProfileName} ({patient?.DateOfBirth})<br />
                <span className="font-semibold">Địa chỉ:</span> {patient?.Address}
              </div>
              <div className="mb-3">
                <span className="font-semibold">Gói dịch vụ:</span> {customizePackage?.Name || '-'}<br />
                <span className="text-xs text-gray-500">{customizePackage?.Description}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold">Dịch vụ chi tiết:</span>
                <ul className="list-disc ml-6 mt-1">
                  {serviceTasksOfBooking.length === 0 && <li className="text-gray-400 text-xs">Không có dịch vụ chi tiết.</li>}
                  {serviceTasksOfBooking.map((task, idx) => (
                    <li key={idx} className="text-sm">
                      {task?.Description} <span className="text-xs text-gray-500">({task?.price?.toLocaleString()}đ)</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Tổng tiền:</span> <span className="text-pink-600 font-bold">{selectedBooking.Amount?.toLocaleString()}đ</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Ngày đặt:</span> {selectedBooking.CreatedAt ? new Date(selectedBooking.CreatedAt).toLocaleString('vi-VN') : '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Ngày làm việc:</span> {selectedBooking.WorkDate ? new Date(selectedBooking.WorkDate).toLocaleString('vi-VN') : '-'}
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedBooking.Status === 'completed' ? 'bg-green-100 text-green-700' : selectedBooking.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedBooking.Status === 'completed' ? 'Hoàn thành' : selectedBooking.Status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default NurseBookingsTab; 