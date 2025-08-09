"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useContext, useEffect, Suspense } from "react";
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
import customizePackageService from '@/services/api/customizePackageService';
import {
  BookingHeader,
  PackageInfo,
  ServicesList,
  BookingForm
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
  const packageId = searchParams.get("packageId") || searchParams.get("package");
  const serviceId = searchParams.get("serviceId") || searchParams.get("service");
  const servicesId = searchParams.get("services"); // Thêm parameter services cho multi-service
  const packageDataParam = searchParams.get("packageData");
  const serviceDataParam = searchParams.get("serviceData");
  const servicesDataParam = searchParams.get("servicesData"); // Thêm parameter servicesData
  const quantityParam = searchParams.get("quantity"); // Thêm parameter quantity

  // Parse service/package data from URL
  const packageData = packageDataParam ? JSON.parse(decodeURIComponent(packageDataParam)) : null;
  const serviceData = serviceDataParam ? JSON.parse(decodeURIComponent(serviceDataParam)) : null;
  const servicesData = servicesDataParam ? JSON.parse(decodeURIComponent(servicesDataParam)) : null; // Parse servicesData
  const quantity = quantityParam ? parseInt(quantityParam) || 1 : 1; // Parse quantity

  // State management
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [selectedCareProfile, setSelectedCareProfile] = useState(null);
  const [datetime, setDatetime] = useState("");
  const [note, setNote] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [careProfilesLoading, setCareProfilesLoading] = useState(true);

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

  // Load packages
  const loadPackages = async () => {
    try {
      const packagesData = await customizePackageService.getCustomizePackages();
      setPackages(packagesData);
    } catch (error) {
      console.error("Error loading packages:", error);
      // Không set error vì packages có thể không cần thiết
    }
  };

  // Bỏ nạp ServiceTasks tổng quát để không chặn việc nạp theo gói

  // Load service tasks for specific package
  const loadServiceTasksByPackage = async (packageId) => {
    try {
      const serviceTasksData = await serviceTaskService.getServiceTasksByPackage(packageId);
      
      // Lấy thông tin đầy đủ của service cho mỗi service task
      const enrichedServiceTasks = await Promise.all(
        serviceTasksData.map(async (task) => {
          try {
            // Lấy thông tin service từ child_ServiceID
            const childServiceId = task.child_ServiceID || task.childServiceID;
            if (childServiceId) {
              const serviceInfo = services.find(s => s.serviceID === childServiceId || s.serviceTypeID === childServiceId);
              if (serviceInfo) {
                return {
                  ...task,
                  serviceName: serviceInfo.serviceName || serviceInfo.ServiceName,
                  description: task.description || task.Description,
                  duration: serviceInfo.duration || serviceInfo.Duration,
                  price: task.price || task.Price,
                  major: serviceInfo.major || serviceInfo.Major,
                  isServiceTask: true
                };
              }
            }
            return task;
          } catch (error) {
            console.error('Error enriching service task:', error);
            return task;
          }
        })
      );
      
      setServiceTasks(enrichedServiceTasks);
    } catch (error) {
      console.error('Error loading service tasks for package:', error);
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

  // Load nursing specialists - REMOVED: Not needed in booking page anymore

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        loadServices(),
        loadPackages(),
        loadCareProfiles()
      ]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  // Load service tasks for package
  useEffect(() => {
    const loadTasks = async () => {
      // Chỉ load khi có package và services đã sẵn sàng
      if (services.length === 0) return;
      
      let targetPackageId = null;
      
      // Xác định package ID cần load
      if (packageData && packageData.serviceID) {
        targetPackageId = packageData.serviceID;
      } else if (packageId && !serviceId) {
        targetPackageId = packageId;
      }
      
      // Chỉ load nếu có package ID và chưa có service tasks
      if (targetPackageId && serviceTasks.length === 0) {
        await loadServiceTasksByPackage(parseInt(targetPackageId, 10));
      }
    };
    
    loadTasks();
  }, [packageId, serviceId, packageData, services, serviceTasks.length]);

  // Computed values
  const userCareProfiles = useMemo(() => {
    if (!user || !careProfiles.length) return [];
    return careProfiles.filter(cp => cp.AccountID === user.AccountID);
  }, [user, careProfiles]);

  const detail = useMemo(() => {
    // Ưu tiên sử dụng data từ URL parameters
    if (packageData) {
      return packageData;
    }
    if (serviceData) {
      return serviceData;
    }
    
    // Fallback: Tìm trong services trước
    if (services.length > 0) {
      const serviceResult = services.find(p => p.serviceTypeID === parseInt(packageId));
      if (serviceResult) {
        return serviceResult;
      }
    }
    
    // Tìm trong packages nếu không tìm thấy trong services
    if (packages.length > 0) {
      const packageResult = packages.find(p => p.customizePackageID === parseInt(packageId));
      if (packageResult) {
        return packageResult;
      }
    }
    
    return null;
  }, [packageId, services, packages, packageData, serviceData]);

  const selectedServicesList = useMemo(() => {
    if (!serviceId && !servicesId && !packageId) return [];
    
    // Nếu có servicesData từ URL (multi-service với số lượng)
    if (servicesData && Array.isArray(servicesData)) {
      return servicesData;
    }
    
    // Nếu có serviceData từ URL (dịch vụ lẻ đơn)
    if (serviceData) {
      return [serviceData];
    }
    
    // Nếu có packageData từ URL (gói dịch vụ)
    if (packageData) {
      return [packageData];
    }
    
    // Nếu có servicesId (multi-service không có servicesData)
    if (servicesId && services.length > 0) {
      const serviceIds = servicesId.split(',').map(id => parseInt(id.trim(), 10));
      const selectedServices = services.filter(service => 
        serviceIds.includes(service.serviceID) || serviceIds.includes(service.serviceTypeID)
      );
      return selectedServices;
    }
    
    // Nếu có serviceId (dịch vụ lẻ - có thể nhiều dịch vụ)
    if (serviceId && services.length > 0) {
      const serviceIds = serviceId.split(',').map(id => parseInt(id.trim(), 10));
      const selectedServices = services.filter(service => 
        serviceIds.includes(service.serviceID) || serviceIds.includes(service.serviceTypeID)
      );
      
      // Nếu không tìm thấy trong services, thử tìm trong packages
      if (selectedServices.length === 0 && packages.length > 0) {
        return packages.filter(pkg => 
          serviceIds.includes(pkg.customizePackageID)
        );
      }
      
      return selectedServices;
    }
    
    // Nếu có packageId (gói dịch vụ) - sử dụng serviceTasks đã load
    if (packageId && serviceTasks.length > 0) {
      return serviceTasks; // Trả về tất cả service tasks đã load cho package
    }
    
    return [];
  }, [serviceId, servicesId, packageId, services, serviceTasks, serviceData, packageData, servicesData, packages]);

  // Thêm thông tin gói chính vào selectedServicesList khi có package
  const displayServicesList = useMemo(() => {
    // Nếu có servicesData (multi-service với số lượng)
    if (servicesData && Array.isArray(servicesData)) {
      return servicesData;
    }
    
    // Nếu có serviceData (dịch vụ lẻ đơn)
    if (serviceData) {
      return [{
        ...serviceData,
        quantity: quantity // Thêm thông tin số lượng
      }];
    }
    
    // Nếu có packageData (gói dịch vụ)
    if (packageData) {
      const displayList = [packageData];
      
      // Thêm service tasks nếu có
      if (serviceTasks.length > 0) {
        displayList.push(...serviceTasks);
      }
      
      return displayList;
    }
    
    // Nếu có servicesId (multi-service không có servicesData)
    if (servicesId && selectedServicesList.length > 0) {
      return selectedServicesList;
    }
    
    // Nếu có serviceId (dịch vụ lẻ - có thể nhiều dịch vụ)
    if (serviceId && selectedServicesList.length > 0) {
      return selectedServicesList;
    }
    
    // Fallback cho logic cũ - package
    if (!packageId) return selectedServicesList;
    
    // Nếu có package, thêm thông tin gói chính vào đầu danh sách
    if (detail && selectedServicesList.length > 0) {
      return [
        {
          ...detail,
          isPackage: true, // Đánh dấu đây là gói chính
          serviceName: detail.serviceName || detail.ServiceName,
          description: detail.description || detail.Description,
          duration: detail.duration || detail.Duration,
          price: detail.price || detail.Price
        },
        ...selectedServicesList
      ];
    }
    
    return selectedServicesList;
  }, [packageId, detail, selectedServicesList, serviceData, packageData, serviceTasks, serviceId, servicesId, servicesData, quantity]);

  const total = useMemo(() => {
    // Nếu có servicesData (multi-service với số lượng)
    if (servicesData && Array.isArray(servicesData)) {
      return servicesData.reduce((sum, service) => {
        const price = service.price || 0;
        const qty = service.quantity || 1;
        return sum + (price * qty);
      }, 0);
    }
    
    // Nếu có serviceData (dịch vụ lẻ đơn)
    if (serviceData) {
      return (serviceData.price || 0) * quantity;
    }
    
    // Nếu có packageData (gói dịch vụ) - package không có số lượng
    if (packageData) {
      return packageData.price || 0;
    }
    
    // Nếu có servicesId hoặc serviceId (dịch vụ lẻ - có thể nhiều dịch vụ)
    if ((servicesId || serviceId) && selectedServicesList.length > 0) {
      return selectedServicesList.reduce((sum, service) => {
        const price = service.price || 0;
        const qty = service.quantity || 1;
        return sum + (price * qty);
      }, 0);
    }
    
    // Fallback cho logic cũ
    if (packageId && detail) {
      return detail.price || 0;
    }
    
    return 0;
  }, [packageId, detail, serviceId, servicesId, selectedServicesList, serviceData, packageData, servicesData, quantity]);

  const isDatetimeValid = useMemo(() => {
    if (!datetime) return false;
    const selectedDate = new Date(datetime);
    const now = new Date();
    const minTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    return selectedDate >= minTime;
  }, [datetime]);

  // Staff selection functions - REMOVED: Staff selection moved to appointment page

  // Payment handling
  // ==============================================
  // BOOKING FLOW EXPLANATION:
  // ==============================================
  // 
  // DATA STRUCTURE:
  // - ServiceTypes: { serviceID, serviceName, isPackage: true/false, ... }
  // - ServiceTasks: { 
  //     serviceTaskID, 
  //     child_ServiceID (serviceID với isPackage=false),
  //     package_ServiceID (serviceID với isPackage=true),
  //     ... 
  //   }
  //
  // 1. PACKAGE BOOKING (isPackage: true):
  //    - User đặt 1 gói dịch vụ (ServiceType với isPackage=true)
  //    - Frontend lấy ServiceTasks có package_ServiceID = packageId
  //    - Frontend gửi: packageId, quantity=1, serviceTasks[] 
  //    - Backend tạo:
  //      + 1 Booking record
  //      + 1 CustomizePackage (quantity=1, isPackage=true)  
  //      + N CustomizeTask (N = số lượng ServiceTask, mỗi cái dựa trên child_ServiceID)
  //    - Kết quả: User thấy 1 gói + N dịch vụ con, mỗi dịch vụ có nút "Add Nurse"
  //
  // 2. SERVICE BOOKING (isPackage: false):  
  //    - User đặt dịch vụ lẻ (ServiceType với isPackage=false)
  //    - Frontend gửi: serviceId, quantity=X, isPackage=false
  //    - Backend tạo:
  //      + 1 Booking record
  //      + 1 CustomizePackage (quantity=X, isPackage=false)
  //      + X CustomizeTask (dựa trên quantity, tất cả cùng serviceID)  
  //    - Kết quả: User thấy X CustomizeTask giống nhau, mỗi cái có nút "Add Nurse"
  //
  // ==============================================
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

    // Xác định loại booking dựa trên URL parameters
    const isPackageBooking = packageId && !serviceId && !servicesId;
    let requestData = null; // Để lưu request data cho error handling

    console.log('🔍 Debug booking type:', {
      packageId,
      serviceId,
      servicesId,
      isPackageBooking,
      urlParams: {
        hasPackageId: !!packageId,
        hasServiceId: !!serviceId,
        hasServicesId: !!servicesId
      }
    });

    try {
      setIsProcessingPayment(true);
      
      let createdBooking;
      
      if (isPackageBooking) {
        // ========== PACKAGE BOOKING ==========
        // Khi đặt gói (isPackage: true):
        // - Tạo 1 Booking 
        // - Tạo 1 CustomizePackage với quantity = 1
        // - Tự động tạo nhiều CustomizeTask dựa trên ServiceTasks trong gói
        
        // Chuẩn bị dữ liệu ServiceTasks nếu có
        // ServiceTask chứa thông tin về dịch vụ con trong gói:
        // - child_ServiceID: ID của ServiceType có isPackage = false (dịch vụ lẻ)
        // - package_ServiceID: ID của ServiceType có isPackage = true (gói dịch vụ)
        const packageServiceTasks = serviceTasks.length > 0 ? serviceTasks.map(task => ({
          serviceTaskID: task.serviceTaskID || task.ServiceTaskID,
          childServiceID: task.child_ServiceID || task.childServiceID, // ID của dịch vụ lẻ
          packageServiceID: task.package_ServiceID || task.packageServiceID, // ID của gói dịch vụ
          duration: task.duration || task.Duration || 0,
          price: task.price || task.Price || 0,
          quantity: task.quantity || 1,
          taskName: task.serviceName || task.ServiceName || task.taskName || 'Dịch vụ con',
          description: task.description || task.Description || '',
          taskOrder: task.taskOrder || 1,
          status: task.status || 'active'
        })) : [];
        
        console.log('ServiceTasks được chuẩn bị:', {
          packageId: parseInt(packageId),
          totalServiceTasks: packageServiceTasks.length,
          serviceTaskDetails: packageServiceTasks
        });
        
        const packageBookingData = {
          careProfileID: parseInt(selectedCareProfile.careProfileID, 10),
          amount: parseInt(total, 10),
          workdate: datetime,
          customizePackageCreateDto: {
            serviceID: parseInt(packageId, 10),
            quantity: 1 // Package luôn có quantity = 1
          }
        };

        console.log('Package Booking Data:', {
          ...packageBookingData,
          packageInfo: {
            packageId: parseInt(packageId),
            isPackage: true,
            totalServiceTasks: packageServiceTasks.length
          },
          expectedResult: {
            booking: '1 Booking record',
            customizePackage: '1 CustomizePackage (quantity=1, isPackage=true)',
            customizeTasks: `${packageServiceTasks.length} CustomizeTask (1 cho mỗi ServiceTask)`,
            nurseSelection: 'Mỗi CustomizeTask có nurseID=null để user chọn nurse sau'
          },
          serviceTaskBreakdown: packageServiceTasks.map(task => ({
            taskName: task.taskName,
            childServiceID: task.childServiceID,
            willCreateCustomizeTask: true
          }))
        });

        // Gọi API tạo package booking 
        // Backend logic cần thực hiện:
        // 1. Tạo 1 Booking record với thông tin cơ bản
        // 2. Tạo 1 CustomizePackage với:
        //    - serviceID = packageId (ServiceType có isPackage=true)
        //    - quantity = 1 (gói chỉ có 1)  
        //    - isPackage = true
        // 3. Với mỗi ServiceTask trong packageServiceTasks:
        //    - Tạo 1 CustomizeTask với:
        //    - serviceID = task.childServiceID (ServiceType có isPackage=false)
        //    - nurseID = null (để user chọn nurse sau)
        //    - status = 'pending'
        // Kết quả: N CustomizeTask (N = số ServiceTask trong gói)
        console.log('📞 Calling createPackageBooking API...');
        createdBooking = await bookingService.createPackageBooking(packageBookingData);
        console.log('✅ createPackageBooking response:', createdBooking);
        
      } else {
        // ========== SERVICE BOOKING ==========
        // Khi đặt dịch vụ lẻ (isPackage: false):
        // - Tạo 1 Booking
        // - Tạo CustomizePackage với quantity theo user chọn, isPackage = false  
        // - Tạo CustomizeTask theo số lượng đó
        // Backend logic cần thực hiện:
        // 1. Tạo 1 Booking record với thông tin cơ bản
        // 2. Với mỗi service trong services[]:
        //    - Tạo 1 CustomizePackage với:
        //    - serviceID = service.serviceID (ServiceType có isPackage=false)
        //    - quantity = service.quantity
        //    - isPackage = false
        // 3. Với mỗi CustomizePackage:
        //    - Tạo quantity CustomizeTask với:
        //    - serviceID = service.serviceID
        //    - nurseID = null (để user chọn nurse sau)
        //    - status = 'pending'
        // Kết quả: Tổng số CustomizeTask = sum(service.quantity)
        
        let servicesForRequest = [];
        
        if (servicesData && Array.isArray(servicesData)) {
          // Multi-service với đầy đủ thông tin số lượng
          servicesForRequest = servicesData.map(service => ({
            serviceID: service.serviceID,
            quantity: service.quantity || 1
          }));
        } else {
          // Single service hoặc multi-service fallback
          const serviceIds = (servicesId || serviceId) ? (servicesId || serviceId).split(',').map(id => parseInt(id.trim(), 10)) : [];
          
          servicesForRequest = serviceIds.map((id) => {
            // Tìm service trong selectedServicesList để lấy quantity
            const serviceInList = selectedServicesList.find(s => 
              (s.serviceID === id || s.serviceTypeID === id)
            );
            
            // Ưu tiên quantity từ serviceInList, sau đó là quantity từ URL parameter
            const serviceQuantity = serviceInList?.quantity || quantity || 1;
            
            return {
              serviceID: id,
              quantity: serviceQuantity
            };
          });
        }
        
        const serviceBookingData = {
          careProfileID: parseInt(selectedCareProfile.careProfileID, 10),
          amount: parseInt(total, 10),
          workdate: datetime,
          customizePackageCreateDtos: servicesForRequest
        };

        requestData = serviceBookingData; // Lưu cho error handling

        console.log('Service Booking Data:', {
          ...serviceBookingData,
          serviceInfo: {
            totalServices: servicesForRequest.length,
            allAreIndividualServices: servicesForRequest.every(s => s.isPackage === false)
          },
          expectedResult: {
            booking: '1 Booking record',
            customizePackages: `${servicesForRequest.length} CustomizePackage (isPackage=false)`,
            customizeTasks: `${servicesForRequest.reduce((total, s) => total + s.quantity, 0)} CustomizeTask total`,
            nurseSelection: 'Mỗi CustomizeTask có nurseID=null để user chọn nurse sau'
          },
          serviceBreakdown: servicesForRequest.map(service => ({
            serviceID: service.serviceID,
            quantity: service.quantity,
            isPackage: service.isPackage,
            willCreateCustomizeTasks: service.quantity
          }))
        });

        // Gọi API tạo service booking
        // Backend sẽ tạo CustomizeTask theo số lượng cho mỗi dịch vụ
        console.log('📞 Calling createServiceBooking API...');
        createdBooking = await bookingService.createServiceBooking(serviceBookingData);
        console.log('✅ createServiceBooking response:', createdBooking);
      }
      
      if (createdBooking) {
        // Thành công - chuyển sang trang payment
        const bookingId = createdBooking.bookingID || createdBooking.id;
        
        console.log('✅ Booking created successfully:', {
          bookingId,
          bookingResponse: createdBooking,
          isPackageBooking,
          expectedCustomizeTasks: isPackageBooking 
            ? `${serviceTasks.length} CustomizeTask (dựa trên ServiceTasks)` 
            : `${(createdBooking?.customizePackages || []).reduce((total, pkg) => total + (pkg?.quantity || 0), 0)} CustomizeTask (dựa trên quantity)`,
          redirectUrl: `/payment?bookingId=${bookingId}`
        });
        
        // Đảm bảo bookingId có giá trị và là số hợp lệ trước khi redirect
        if (bookingId && !isNaN(parseInt(bookingId))) {
          const redirectUrl = `/payment?bookingId=${bookingId}`;
          console.log('🔄 Redirecting to payment page:', redirectUrl);
          router.push(redirectUrl);
        } else {
          console.error('❌ BookingID không hợp lệ:', {
            bookingId,
            createdBooking,
            bookingIDType: typeof bookingId
          });
          setError(`Không thể lấy ID booking hợp lệ (${bookingId}). Vui lòng thử lại sau.`);
        }
      } else {
        console.error('❌ CreatedBooking is null or undefined:', createdBooking);
        setError("Không thể tạo booking. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("❌ Error creating booking:", {
        error,
        errorMessage: error.message,
        errorStack: error.stack,
        isPackageBooking,
        requestData
      });
      
      // Kiểm tra xem có phải lỗi network không
      if (error.response) {
        setError(`Lỗi từ server: ${error.response.data?.message || error.response.status}`);
      } else if (error.request) {
        setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      } else {
        setError(`Có lỗi xảy ra khi tạo booking: ${error.message}`);
      }
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
               {!packageId && <PackageInfo packageDetail={detail} />}
                              <ServicesList
                 selectedServicesList={displayServicesList}
                 packageId={packageId}
                 isDatetimeValid={isDatetimeValid}
                 total={total}
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

          {/* Popup chọn nhân sự - REMOVED: Staff selection moved to appointment page */}


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