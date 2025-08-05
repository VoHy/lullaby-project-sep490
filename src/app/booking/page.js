"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useContext, useEffect, Suspense } from "react";
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
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

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // URL parameters
  const packageId = searchParams.get("packageId");
  const serviceId = searchParams.get("serviceId");

  // State management
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [selectedCareProfile, setSelectedCareProfile] = useState(null);
  const [datetime, setDatetime] = useState("");
  const [note, setNote] = useState("");
  const [selectedStaff, setSelectedStaff] = useState({});
  const [staffPopup, setStaffPopup] = useState({ show: false, serviceId: null });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [careProfilesLoading, setCareProfilesLoading] = useState(true);
  const [nursesLoading, setNursesLoading] = useState(true);

  // Error states
  const [error, setError] = useState("");
  const [careProfileError, setCareProfileError] = useState("");

  // Payment state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load services and packages
  const loadServices = async () => {
    try {
      setServicesLoading(true);
      const servicesData = await serviceTypeService.getAllServiceTypes();
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading services:", error);
      setError("Không thể tải danh sách dịch vụ");
    } finally {
      setServicesLoading(false);
    }
  };

  // Load care profiles
  const loadCareProfiles = async () => {
    try {
      setCareProfilesLoading(true);
      const careProfilesData = await careProfileService.getCareProfiles();
      setCareProfiles(careProfilesData);
    } catch (error) {
      console.error("Error loading care profiles:", error);
      setError("Không thể tải hồ sơ người thân");
    } finally {
      setCareProfilesLoading(false);
    }
  };

  // Load nursing specialists
  const loadNurses = async () => {
    try {
      setNursesLoading(true);
      const nursesData = await nursingSpecialistService.getAllNursingSpecialists();
      setNursingSpecialists(nursesData);
    } catch (error) {
      console.error("Error loading nurses:", error);
      setError("Không thể tải danh sách điều dưỡng viên");
    } finally {
      setNursesLoading(false);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        loadServices(),
        loadCareProfiles(),
        loadNurses()
      ]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  // Computed values
  const userCareProfiles = useMemo(() => {
    if (!user || !careProfiles.length) return [];
    return careProfiles.filter(cp => cp.AccountID === user.AccountID);
  }, [user, careProfiles]);

  const selectedServicesList = useMemo(() => {
    if (!serviceId || !services.length) return [];
    const serviceIds = serviceId.split(',').map(id => parseInt(id.trim()));
    return services.filter(service => serviceIds.includes(service.serviceTypeID));
  }, [serviceId, services]);

  const detail = useMemo(() => {
    if (!packageId || !packages.length) return null;
    return packages.find(p => p.serviceTypeID === parseInt(packageId));
  }, [packageId, packages]);

  const total = useMemo(() => {
    if (packageId && detail) {
      return detail.price || 0;
    } else if (serviceId && selectedServicesList.length > 0) {
      return selectedServicesList.reduce((sum, service) => sum + (service.price || 0), 0);
    }
    return 0;
  }, [packageId, detail, serviceId, selectedServicesList]);

  const isDatetimeValid = useMemo(() => {
    if (!datetime) return false;
    const selectedDate = new Date(datetime);
    const now = new Date();
    const minTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    return selectedDate >= minTime;
  }, [datetime]);

  // Staff selection functions
  const getAvailableStaff = (serviceId) => {
    return nursingSpecialists.filter(nurse => 
      nurse.serviceTypes && nurse.serviceTypes.some(st => st.serviceTypeID === parseInt(serviceId))
    );
  };

  const handleSelectStaff = (serviceId, type, id) => {
    setSelectedStaff(prev => ({
      ...prev,
      [serviceId]: { type, id }
    }));
    setStaffPopup({ show: false, serviceId: null });
  };

  const handleToggleNurse = (id) => {
    setSelectedStaff(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (newState[key] && newState[key].id === id) {
          delete newState[key];
        }
      });
      return newState;
    });
  };

  // Payment handling
  const handlePayment = async () => {
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

    try {
      setIsProcessingPayment(true);
      
      // Xác định loại booking (package hoặc service)
      const isPackage = packageId && !serviceId;
      
      let createdBooking;
      
      if (isPackage) {
        // Package booking - sử dụng CreatePackageBooking API
        const packageBookingData = {
          careProfileID: parseInt(selectedCareProfile.careProfileID),
          amount: parseInt(total),
          workdate: datetime,
          customizePackageCreateDto: {
            serviceID: parseInt(packageId),
            quantity: 1
          }
        };

        console.log('Package Booking Data:', JSON.stringify(packageBookingData, null, 2));
        createdBooking = await bookingService.createPackageBooking(packageBookingData);
      } else {
        // Service booking - sử dụng CreateServiceBooking API
        const serviceIds = serviceId ? serviceId.split(',').map(id => parseInt(id.trim())) : [];
        const services = serviceIds.map(id => ({
          serviceID: id,
          quantity: 1
        }));
        
        const serviceBookingData = {
          careProfileID: parseInt(selectedCareProfile.careProfileID),
          amount: parseInt(total),
          workdate: datetime,
          customizePackageCreateDtos: services
        };

        console.log('Service Booking Data:', JSON.stringify(serviceBookingData, null, 2));
        createdBooking = await bookingService.createServiceBooking(serviceBookingData);
      }
      
      if (createdBooking) {
        // Chuyển sang trang payment với booking ID
        const bookingId = createdBooking.bookingID || createdBooking.id;
        router.push(`/payment?bookingId=${bookingId}`);
      } else {
        setError("Không thể tạo booking. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Có lỗi xảy ra khi tạo booking. Vui lòng thử lại sau.");
    } finally {
      setIsProcessingPayment(false);
    }
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
                isProcessingPayment={isProcessingPayment}
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

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải trang đặt lịch...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
} 