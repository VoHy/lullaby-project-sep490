"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useContext, useEffect } from "react";
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import careProfileService from '@/services/api/careProfileService';
// import workScheduleService from '@/services/api/workScheduleService';
import {
  BookingHeader,
  PackageInfo,
  ServicesList,
  BookingForm,
  StaffSelectionModal
} from './components';
import { AuthContext } from "@/context/AuthContext";

// Utility function to clear booking cache
const clearBookingCache = () => {
  localStorage.removeItem('booking_services');
  localStorage.removeItem('booking_tasks');
  localStorage.removeItem('booking_cache_time');
  localStorage.removeItem('booking_care_profiles');
  localStorage.removeItem('booking_care_cache_time');
  localStorage.removeItem('booking_nurses');
  localStorage.removeItem('booking_nurses_cache_time');
};

// Skeleton Loading Component
const BookingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
    <div className="max-w-5xl mx-auto px-2 md:px-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Left Column Skeleton */}
          <div className="md:w-1/2 space-y-4">
            <div className="border rounded-2xl p-4 md:p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
            <div className="border rounded-2xl p-4 md:p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="md:w-1/2 space-y-4">
            <div className="border rounded-2xl p-4 md:p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border rounded-2xl p-4 md:p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="border rounded-2xl p-4 md:p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function BookingPage() {
  const [datetime, setDatetime] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const serviceId = searchParams.get('service');
  const packageId = searchParams.get('package');

  // State cho API data
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  // const [workSchedules, setWorkSchedules] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Separate loading states for better UX
  const [servicesLoading, setServicesLoading] = useState(true);
  const [careProfilesLoading, setCareProfilesLoading] = useState(true);
  const [nursesLoading, setNursesLoading] = useState(true);

  // Mock data cho workSchedules API chưa hoàn thiện
  const [workSchedules] = useState([]);

  // Load services data first (most important)
  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        
        // Check cache first
        const cachedServices = localStorage.getItem('booking_services');
        const cachedTasks = localStorage.getItem('booking_tasks');
        const cacheTime = localStorage.getItem('booking_cache_time');
        const now = Date.now();
        
        // Use cache if it's less than 5 minutes old
        if (cachedServices && cachedTasks && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
          setServiceTypes(JSON.parse(cachedServices));
          setServiceTasks(JSON.parse(cachedTasks));
          setServicesLoading(false);
          return;
        }
        
        const [serviceTypesData, serviceTasksData] = await Promise.all([
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks()
        ]);
        
        setServiceTypes(serviceTypesData);
        setServiceTasks(serviceTasksData);
        
        // Cache the data
        localStorage.setItem('booking_services', JSON.stringify(serviceTypesData));
        localStorage.setItem('booking_tasks', JSON.stringify(serviceTasksData));
        localStorage.setItem('booking_cache_time', now.toString());
        
      } catch (error) {
        console.error('Error loading services:', error);
        setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.');
        // Clear cache on error
        clearBookingCache();
      } finally {
        setServicesLoading(false);
      }
    };

    if (user) {
      loadServices();
    }
  }, [user]);

  // Load care profiles after services
  useEffect(() => {
    const loadCareProfiles = async () => {
      try {
        setCareProfilesLoading(true);
        
        // Check cache for care profiles
        const cachedProfiles = localStorage.getItem('booking_care_profiles');
        const cacheTime = localStorage.getItem('booking_care_cache_time');
        const now = Date.now();
        
        // Use cache if it's less than 2 minutes old (care profiles change more frequently)
        if (cachedProfiles && cacheTime && (now - parseInt(cacheTime)) < 2 * 60 * 1000) {
          setCareProfiles(JSON.parse(cachedProfiles));
          setCareProfilesLoading(false);
          return;
        }
        
        const careProfilesData = await careProfileService.getCareProfiles();
        setCareProfiles(careProfilesData);
        
        // Cache the data
        localStorage.setItem('booking_care_profiles', JSON.stringify(careProfilesData));
        localStorage.setItem('booking_care_cache_time', now.toString());
        
      } catch (error) {
        console.error('Error loading care profiles:', error);
        // Don't set main error, just log
      } finally {
        setCareProfilesLoading(false);
      }
    };

    if (user && !servicesLoading) {
      loadCareProfiles();
    }
  }, [user, servicesLoading]);

  // Load nurses last (least critical for initial display)
  useEffect(() => {
    const loadNurses = async () => {
      try {
        setNursesLoading(true);
        
        // Check cache for nurses
        const cachedNurses = localStorage.getItem('booking_nurses');
        const cacheTime = localStorage.getItem('booking_nurses_cache_time');
        const now = Date.now();
        
        // Use cache if it's less than 10 minutes old (nurses change less frequently)
        if (cachedNurses && cacheTime && (now - parseInt(cacheTime)) < 10 * 60 * 1000) {
          setNursingSpecialists(JSON.parse(cachedNurses));
          setNursesLoading(false);
          return;
        }
        
        const nursingSpecialistsData = await nursingSpecialistService.getNursingSpecialists();
        setNursingSpecialists(nursingSpecialistsData);
        
        // Cache the data
        localStorage.setItem('booking_nurses', JSON.stringify(nursingSpecialistsData));
        localStorage.setItem('booking_nurses_cache_time', now.toString());
        
      } catch (error) {
        console.error('Error loading nurses:', error);
        // Don't set main error, just log
      } finally {
        setNursesLoading(false);
      }
    };

    if (user && !servicesLoading) {
      loadNurses();
    }
  }, [user, servicesLoading]);

  // Update main loading state
  useEffect(() => {
    setLoading(servicesLoading || careProfilesLoading || nursesLoading);
  }, [servicesLoading, careProfilesLoading, nursesLoading]);

  // Lấy thông tin dịch vụ lẻ hoặc package
  let detail = null;
  let childServices = [];

  if (packageId) {
    detail = serviceTypes.find(s => s.serviceID === Number(packageId) || s.ServiceID === Number(packageId));
    const tasks = serviceTasks.filter(t => 
      t.packageServiceID === Number(packageId) || 
      t.Package_ServiceID === Number(packageId) ||
      t.package_ServiceID === Number(packageId)
    );
    childServices = tasks.map(t => {
      const childServiceId = t.childServiceID || t.Child_ServiceID || t.child_ServiceID;
      const foundService = serviceTypes.find(s => s.serviceID === childServiceId || s.ServiceID === childServiceId);
      return foundService;
    }).filter(Boolean);
  } else if (serviceId) {
    // Có thể là 1 dịch vụ hoặc nhiều dịch vụ lẻ (danh sách id)
    if (serviceId.includes(',')) {
      childServices = serviceId.split(',').map(id => serviceTypes.find(st => st.serviceID === Number(id) || st.ServiceID === Number(id))).filter(Boolean);
    } else {
      detail = serviceTypes.find(s => s.serviceID === Number(serviceId) || s.ServiceID === Number(serviceId));
    }
  }

  // Form state
  const [note, setNote] = useState("");
  const [selectedNurses, setSelectedNurses] = useState([]);
  const [selectedCareProfile, setSelectedCareProfile] = useState(null);
  const [careProfileError, setCareProfileError] = useState("");

  // Kiểm tra ngày giờ hợp lệ cho dịch vụ lẻ (cách hiện tại ít nhất 30 phút)
  const isDatetimeValid = useMemo(() => {
    if (!datetime) return false;
    const selected = new Date(datetime);
    const now = new Date();
    return selected.getTime() - now.getTime() >= 30 * 60 * 1000;
  }, [datetime]);

  // Lấy danh sách CareProfile của user hiện tại (chỉ lấy active)
  const userCareProfiles = user ? careProfiles.filter(p => p.accountID === user.accountID && (p.status === 'active' || p.status === 'Active')) : [];
  
  // Reset selectedCareProfile nếu nó không active
  if (selectedCareProfile && selectedCareProfile.status !== 'active' && selectedCareProfile.status !== 'Active') {
    setSelectedCareProfile(null);
  }

  // Lấy ZoneID của user (giả sử lấy từ careProfiles)
  const userProfile = user ? careProfiles.find(p => p.accountID === user.accountID) : careProfiles[0];
  const userZoneID = userProfile?.zoneDetailID || 1;

  // State chọn nhân sự cho từng dịch vụ
  const [selectedStaff, setSelectedStaff] = useState({}); // {serviceId: {type: 'nurse'|'specialist', id: id}}
  const [staffPopup, setStaffPopup] = useState({ open: false, serviceId: null });

  // Lấy danh sách dịch vụ đã chọn
  // selectedServicesList: luôn là mảng các dịch vụ lẻ (nếu là package thì là childServices, nếu là dịch vụ lẻ thì là [detail], nếu là nhiều dịch vụ lẻ thì là childServices)
  let selectedServicesList = [];
  if (packageId && detail) {
    selectedServicesList = childServices;
  } else if (serviceId && serviceId.includes(',')) {
    selectedServicesList = childServices;
  } else if (serviceId && detail) {
    selectedServicesList = [detail];
  }
  


  // Tính tổng tiền
  let total = 0;
  if (packageId && detail) {
    // Tổng tiền là giá của gói, không phải cộng các dịch vụ con
    total = detail.price || detail.Price || 0;
  } else if (!packageId && selectedServicesList.length > 0) {
    total = selectedServicesList.reduce((sum, s) => sum + (s.price || s.Price || 0), 0);
  }

  // Lọc nhân sự rảnh theo ZoneID và workSchedules (có ca trực, status active, đúng ngày user chọn)
  const getAvailableStaff = (serviceId) => {
    if (!isDatetimeValid) return [];
    const targetDate = datetime.split('T')[0];
    // Lấy danh sách nhân sự cùng ZoneID, active
    const available = nursingSpecialists.filter(n => n.zoneID === userZoneID && n.status === 'active');
    // Lọc theo lịch rảnh (workSchedules) - comment lại vì workSchedules API chưa hoàn thiện
    // return available.filter(n =>
    //   workSchedules.some(ws =>
    //     ws.nursingID === n.nursingID &&
    //     ws.workDate.startsWith(targetDate) &&
    //     ws.status === 'active'
    //   )
    // );
    return available; // Trả về tất cả nhân sự available vì workSchedules API chưa hoàn thiện
  };

  const handleSelectStaff = (serviceId, type, id) => {
    setSelectedStaff(prev => ({
      ...prev,
      [serviceId]: { type, id }
    }));
    setStaffPopup({ open: false, serviceId: null });
  };

  // Chọn/bỏ chọn nurse
  const handleToggleNurse = (id) => {
    setSelectedNurses(prev =>
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
  };

  // Xử lý thanh toán
  const handlePayment = () => {
    setError("");
    setCareProfileError("");
    
    // Validate user login
    if (!user) {
      setError("Vui lòng đăng nhập để tiếp tục");
      return;
    }
    
    // Validate CareProfile
    if (!selectedCareProfile) {
      setCareProfileError("Vui lòng chọn hồ sơ người thân để tiếp tục");
      return;
    }
    
    // Validate CareProfile status
    if (selectedCareProfile.status !== 'active' && selectedCareProfile.status !== 'Active') {
      setCareProfileError("Hồ sơ người thân không hoạt động. Vui lòng chọn hồ sơ khác hoặc kích hoạt hồ sơ này.");
      return;
    }
    
    if (!datetime || !isDatetimeValid) {
      setError("Vui lòng chọn ngày giờ hợp lệ (cách hiện tại ít nhất 30 phút)");
      return;
    }

    const params = new URLSearchParams();
    if (packageId) {
      params.set("package", packageId);
    } else if (serviceId) {
      // Truyền services (danh sách id, kể cả 1 dịch vụ lẻ)
      params.set("services", serviceId);
    }
    params.set("datetime", datetime);
    params.set("note", note);
    params.set("careProfileId", selectedCareProfile.careProfileID);
    // Truyền selectedStaff (object) sang payment
    params.set("selectedStaff", encodeURIComponent(JSON.stringify(
      Object.fromEntries(
        Object.entries(selectedStaff).map(([serviceId, staff]) => [
          serviceId,
          {
            ...staff,
            name: (() => {
              const found = nursingSpecialists.find(n => n.nursingID === Number(staff.id));
              return found ? found.fullName : '';
            })()
          }
        ])
      )
    )));
    router.push(`/payment?${params.toString()}`);
  };

  // Loading state khi đang fetch data
  if (loading) {
    return <BookingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => {
                    clearBookingCache();
                    window.location.reload();
                  }} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
                <button 
                  onClick={() => {
                    clearBookingCache();
                    setError("");
                    setServicesLoading(true);
                    setCareProfilesLoading(true);
                    setNursesLoading(true);
                  }} 
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Làm mới dữ liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state khi user chưa load xong
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin người dùng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-2 md:px-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
          {/* Header */}
          <BookingHeader />

          {/* Main 2-column layout */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* LEFT COLUMN: Info, dịch vụ, tổng tiền */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <PackageInfo packageDetail={detail} />
              <ServicesList
                selectedServicesList={selectedServicesList}
                packageId={packageId}
                isDatetimeValid={isDatetimeValid}
                getAvailableStaff={getAvailableStaff}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
                setStaffPopup={setStaffPopup}
                nursingSpecialists={nursingSpecialists}
              />
            </div>

            {/* RIGHT COLUMN: Form, chọn ngày giờ, ghi chú, thanh toán */}
            <div className="md:w-1/2">
              <BookingForm
                datetime={datetime}
                setDatetime={setDatetime}
                note={note}
                setNote={setNote}
                isDatetimeValid={isDatetimeValid}
                error={error}
                handlePayment={handlePayment}
                careProfiles={userCareProfiles}
                selectedCareProfile={selectedCareProfile}
                setSelectedCareProfile={setSelectedCareProfile}
                careProfileError={careProfileError}
              />
            </div>
          </div>

        {/* Popup chọn nhân sự */}
          <StaffSelectionModal
            staffPopup={staffPopup}
            setStaffPopup={setStaffPopup}
            getAvailableStaff={getAvailableStaff}
            handleSelectStaff={handleSelectStaff}
            nursingSpecialists={nursingSpecialists}
          />
          </div>
      </div>
    </div>
  );
}