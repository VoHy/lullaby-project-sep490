"use client";
import { useEffect, useState, useContext } from "react";
import { FaHistory, FaCalendarAlt, FaMoneyBillWave, FaUser, FaStickyNote, FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import invoiceService from '@/services/api/invoiceService';
import serviceTypeService from '@/services/api/serviceTypeService';
import careProfileService from '@/services/api/careProfileService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import serviceTaskService from '@/services/api/serviceTaskService';

export default function PaymentHistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [localInvoices, setLocalInvoices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null); // invoice đang xem chi tiết
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [
          invoicesData,
          serviceTypesData,
          careProfilesData,
          nursingSpecialistsData,
          serviceTasksData
        ] = await Promise.all([
          invoiceService.getAllInvoices(),
          serviceTypeService.getServiceTypes(),
          careProfileService.getCareProfiles(),
          nursingSpecialistService.getNursingSpecialists(),
          serviceTaskService.getServiceTasks()
        ]);

        setInvoices(invoicesData);
        setServiceTypes(serviceTypesData);
        setCareProfiles(careProfilesData);
        setNursingSpecialists(nursingSpecialistsData);
        setServiceTasks(serviceTasksData);
      } catch (error) {
        console.error('Error fetching payment history data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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
  }, [user, serviceTypes, serviceTasks]);

  // Kết hợp dữ liệu từ API và localStorage
  const allInvoices = [...invoices, ...localInvoices];

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch sử thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lấy thông tin CareProfile
  const getCareProfileInfo = (careProfileId) => {
    if (!careProfileId) return null;
    return careProfiles.find(cp => cp.CareProfileID === Number(careProfileId));
  };

  // Lấy thông tin nhân sự
  const getStaffInfo = (staffData, serviceId) => {
    if (!staffData || !staffData[serviceId]) return null;
    
    const staff = staffData[serviceId];
    const specialist = nursingSpecialists.find(n => n.NursingID === Number(staff.id));
    return {
      name: specialist?.FullName || 'Không xác định',
      role: specialist?.Major || 'Nhân viên',
      type: staff.type
    };
  };

  const renderDetail = () => {
    if (!selected) return null;

    const careProfile = getCareProfileInfo(selected.careProfileId);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold" 
            onClick={() => setSelected(null)}
          >
            &times;
          </button>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Chi tiết giao dịch #{selected.invoice_id}</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin khách hàng */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <FaUser className="mr-2" />
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Tên:</span>
                    <span>{careProfile ? careProfile.ProfileName : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Điện thoại:</span>
                    <span>{careProfile?.PhoneNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Địa chỉ:</span>
                    <span className="text-right">{careProfile?.Address || '-'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Thông tin dịch vụ
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Dịch vụ:</span>
                    <span>{selected.serviceInfo?.ServiceName || '-'}</span>
                  </div>
                  {selected.serviceInfo && (
                    <div className="flex justify-between">
                      <span className="font-medium">Mô tả:</span>
                      <span className="text-right">{selected.serviceInfo.Description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày đặt:</span>
                    <span>{new Date(selected.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Thông tin thanh toán */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <FaMoneyBillWave className="mr-2" />
                  Thông tin thanh toán
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Số hóa đơn:</span>
                    <span>#{selected.invoice_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="font-bold text-green-600">{selected.amount?.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span className="flex items-center text-green-600">
                      <FaCheckCircle className="mr-1" />
                      Hoàn thành
                    </span>
                  </div>
                </div>
              </div>
              
              {selected.note && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <FaStickyNote className="mr-2" />
                    Ghi chú
                  </h4>
                  <p className="text-sm text-gray-700">{selected.note}</p>
                </div>
              )}
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
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Lịch sử thanh toán
          </h1>
          <p className="text-gray-600">Xem lại các giao dịch đã thực hiện</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {allInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có giao dịch nào</h3>
              <p className="text-gray-500 mb-6">Bạn chưa có lịch sử thanh toán nào</p>
              <button 
                onClick={() => router.push('/services')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              >
                Đặt dịch vụ ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {allInvoices.map((invoice) => (
                <div 
                  key={invoice.invoice_id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => setSelected(invoice)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <FaHistory className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{invoice.content}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {new Date(invoice.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">
                        {invoice.amount?.toLocaleString()} VNĐ
                      </p>
                      <p className="text-sm text-gray-500 flex items-center justify-end">
                        <FaCheckCircle className="mr-1 text-green-500" />
                        Hoàn thành
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {renderDetail()}
    </div>
  );
} 