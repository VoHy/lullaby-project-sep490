"use client";
import invoices from "@/mock/Invoice";
import { useEffect, useState, useContext } from "react";
import { FaHistory, FaCalendarAlt, FaMoneyBillWave, FaUser, FaStickyNote, FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import serviceTypes from '@/mock/ServiceType';
import careProfiles from '@/mock/CareProfile';
import nursingSpecialists from '@/mock/NursingSpecialist';
import serviceTasks from '@/mock/ServiceTask';

export default function PaymentHistoryPage() {
  const [localInvoices, setLocalInvoices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null); // invoice đang xem chi tiết
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Lấy các giao dịch vừa thanh toán từ localStorage (chỉ của user hiện tại)
    const data = localStorage.getItem("appointments");
    if (data && user) {
      const arr = JSON.parse(data);
      // Lọc theo user hiện tại (nếu có user ID trong data)
      // Và chuyển đổi thành invoice chi tiết hơn
      const mapped = arr
        .filter(appt => {
          // Nếu có user ID trong appointment data, lọc theo user
          if (appt.userId) {
            return appt.userId === user.AccountID;
          }
          // Nếu không có user ID, hiển thị tất cả (cho demo)
          return true;
        })
        .map((appt, idx) => {
          // Lấy thông tin package/service
          let serviceInfo = null;
          let totalAmount = 0;
          
          if (appt.package) {
            serviceInfo = serviceTypes.find(s => s.ServiceID === Number(appt.package));
            totalAmount = serviceInfo?.Price || 0;
          } else if (appt.services) {
            const serviceIds = appt.services.split(",").map(Number);
            const services = serviceTypes.filter(s => serviceIds.includes(s.ServiceID));
            totalAmount = services.reduce((sum, s) => sum + (s.Price || 0), 0);
          }

          return {
        invoice_id: 1000 + idx,
        content: appt.package ? `Thanh toán gói dịch vụ #${appt.package}` : `Thanh toán dịch vụ lẻ: ${appt.services}`,
            amount: totalAmount,
        created_at: appt.datetime || new Date().toISOString(),
        note: appt.note || "",
            nurses: appt.nurses || "",
            package: appt.package,
            services: appt.services,
            careProfileId: appt.careProfileId,
            selectedStaff: appt.selectedStaff ? JSON.parse(decodeURIComponent(appt.selectedStaff)) : {},
            // Thêm thông tin chi tiết
            serviceInfo,
            serviceIds: appt.services ? appt.services.split(",").map(Number) : [],
            childServices: appt.package ? serviceTasks.filter(t => t.Package_ServiceID === Number(appt.package))
              .map(t => serviceTypes.find(s => s.ServiceID === t.Child_ServiceID)).filter(Boolean) : []
          };
        });
      setLocalInvoices(mapped);
    }
  }, [user]);

  // Chỉ lấy dữ liệu từ localStorage (dữ liệu thực tế của user)
  // Không hiển thị mock data để tránh nhầm lẫn
  const allInvoices = localInvoices;

  // Check authentication
  if (!mounted) return null;
  
  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Cần đăng nhập</h3>
            <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem lịch sử thanh toán</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lấy thông tin CareProfile
  const getCareProfileInfo = (careProfileId) => {
    if (!careProfileId) return null;
    return careProfiles.find(p => p.CareProfileID === Number(careProfileId));
  };

  // Lấy thông tin nhân sự
  const getStaffInfo = (staffData, serviceId) => {
    if (!staffData || !staffData[serviceId]) return null;
    const staff = staffData[serviceId];
    const found = nursingSpecialists.find(n => n.NursingID === Number(staff.id));
    return found ? { ...staff, name: found.FullName, major: found.Major } : staff;
  };

  // Modal chi tiết invoice
  const renderDetail = () => {
    if (!selected) return null;

    const careProfile = getCareProfileInfo(selected.careProfileId);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <FaHistory className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Chi tiết thanh toán</h2>
                  <p className="text-gray-600">#{selected.invoice_id}</p>
                </div>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                onClick={() => setSelected(null)}
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin thanh toán */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaMoneyBillWave className="text-pink-600" />
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="text-2xl font-bold text-pink-600">{selected.amount?.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày thanh toán:</span>
                      <span className="font-semibold">
                        {selected.created_at ? new Date(selected.created_at).toLocaleString('vi-VN') : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`flex items-center gap-1 font-semibold ${
                        selected.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        <FaCheckCircle className="text-sm" />
                        {selected.status === 'success' ? 'Hoàn thành' : 'Đang xử lý'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin lịch hẹn */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-600" />
                    Thông tin lịch hẹn
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600 text-sm" />
                      <span className="font-semibold">
                        {selected.created_at ? new Date(selected.created_at).toLocaleString('vi-VN') : "-"}
                      </span>
                    </div>
                    {careProfile && (
                      <div className="flex items-center gap-2">
                        <FaUser className="text-blue-600 text-sm" />
                        <span className="font-semibold">{careProfile.ProfileName}</span>
                        <span className="text-sm text-gray-600">({careProfile.PhoneNumber})</span>
                      </div>
                    )}
                    {selected.note && (
                      <div className="flex items-start gap-2">
                        <FaStickyNote className="text-blue-600 text-sm mt-1" />
                        <span className="text-sm">{selected.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin dịch vụ */}
              <div className="space-y-6">
                {selected.package && selected.serviceInfo && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">Gói dịch vụ</h3>
                    <div className="space-y-2">
                      <div className="font-bold text-xl text-pink-700">{selected.serviceInfo.ServiceName}</div>
                      <div className="text-gray-700">{selected.serviceInfo.Description}</div>
                      <div className="text-2xl font-bold text-pink-600">
                        {(selected.serviceInfo.Price || 0).toLocaleString()}đ
                      </div>
                    </div>

                    {/* Child Services */}
                    {selected.childServices && selected.childServices.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Các dịch vụ trong gói:</h4>
                        <div className="space-y-2">
                          {selected.childServices.map((s, idx) => (
                            <div key={s.ServiceID || idx} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-blue-700">{s.ServiceName}</span>
                                <span className="text-pink-600 font-semibold">{(s.Price || 0).toLocaleString()}đ</span>
                              </div>
                              <div className="text-gray-600 text-sm">{s.Description}</div>
                              {getStaffInfo(selected.selectedStaff, s.ServiceID) && (
                                <div className="text-green-700 text-xs mt-1">
                                  {getStaffInfo(selected.selectedStaff, s.ServiceID).name} 
                                  ({getStaffInfo(selected.selectedStaff, s.ServiceID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selected.serviceIds && selected.serviceIds.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-green-700 mb-3">Dịch vụ lẻ</h3>
                    <div className="space-y-2">
                      {selected.serviceIds.map(serviceId => {
                        const service = serviceTypes.find(s => s.ServiceID === serviceId);
                        if (!service) return null;
                        return (
                          <div key={serviceId} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-green-700">{service.ServiceName}</span>
                              <span className="text-pink-600 font-semibold">{(service.Price || 0).toLocaleString()}đ</span>
                            </div>
                            <div className="text-gray-600 text-sm">{service.Description}</div>
                            {getStaffInfo(selected.selectedStaff, serviceId) && (
                              <div className="text-green-700 text-xs mt-1">
                                {getStaffInfo(selected.selectedStaff, serviceId).name} 
                                ({getStaffInfo(selected.selectedStaff, serviceId).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg mx-auto mb-4">
            <FaHistory className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Lịch sử thanh toán
          </h1>
          <p className="text-gray-600 mt-2">Xem lại các giao dịch thanh toán của bạn</p>
        </div>

        {/* Danh sách thanh toán */}
        {allInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có lịch sử thanh toán</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có giao dịch thanh toán nào.</p>
            <button 
              onClick={() => router.push('/services')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              Đặt dịch vụ ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allInvoices.map((inv) => (
            <div
              key={inv.invoice_id}
                className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => setSelected(inv)}
            >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <FaMoneyBillWave className="text-pink-600" />
                  </div>
                  <span className="text-sm text-gray-500">#{inv.invoice_id}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {inv.content}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">
                      {inv.created_at ? new Date(inv.created_at).toLocaleDateString('vi-VN') : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-gray-400 text-sm" />
                    <span className="text-lg font-bold text-pink-600">
                      {inv.amount?.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 text-sm font-semibold ${
                    inv.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    <FaCheckCircle className="text-xs" />
                    {inv.status === 'success' ? 'Hoàn thành' : 'Đang xử lý'}
                  </span>
                  <button className="text-blue-600 text-sm font-semibold hover:text-blue-800">
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            ))}
            </div>
        )}

        {renderDetail()}
      </div>
    </div>
  );
} 