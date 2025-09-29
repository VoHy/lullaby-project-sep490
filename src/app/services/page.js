'use client';
import { useEffect, useState, useContext } from 'react';
import { motion } from "framer-motion";
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import feedbackService from '@/services/api/feedbackService';
import customizeTaskService from '@/services/api/customizeTaskService';
import careProfileService from '@/services/api/careProfileService';
import relativesService from '@/services/api/relativesService';
import {
  SearchFilter,
  ServiceSection,
  DetailModal,
  MultiServiceBooking,
  ServicesRatingStats
} from './components';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

// Skeleton Loading Component
const ServicesSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
      </div>

      {/* Search Filter Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-12 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>
      </div>

      {/* Services Skeleton */}
      <div className="space-y-8">
        {[1, 2].map(section => (
          <div key={section}>
            <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(card => (
                <div key={card} className="border rounded-xl p-6 bg-white">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
// Cache duration - giảm từ 10 phút xuống 30 giây để đồng bộ rating nhanh hơn
const CACHE_DURATION = 30 * 1000; // 30 giây

// Utility function to clear services cache
export const clearServicesCache = () => {
  localStorage.removeItem('services_data');
  localStorage.removeItem('services_cache_time');
  localStorage.removeItem('careProfiles_data');
  localStorage.removeItem('careProfiles_cache_time');
  localStorage.removeItem('relatives_data');
  localStorage.removeItem('relatives_cache_time');
};

// Bỏ tính năng gửi feedback; chỉ giữ dữ liệu để hiển thị rating

export default function ServicesPage() {
  const { user, token } = useContext(AuthContext);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [relatives, setRelatives] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [serviceDetail, setServiceDetail] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingsMap, setRatingsMap] = useState({}); // { [serviceID]: { rating, count } }
  const router = useRouter();

  // Lấy dữ liệu từ API với caching
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        // Check cache first
        const cachedData = localStorage.getItem('services_data');
        const cacheTime = localStorage.getItem('services_cache_time');
        const now = Date.now();

        // Use cache if it's less than 3 minutes old and has ratingsMap
        if (cachedData && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedData);
          // Nếu cache không có ratingsMap hoặc ratingsMap rỗng, force refresh
          if (parsedData.ratingsMap && Object.keys(parsedData.ratingsMap).length > 0) {
            setServiceTypes(parsedData.services);
            setServiceTasks(parsedData.tasks);
            setFeedbacks(parsedData.feedbacks || []);
            setCustomizeTasks(parsedData.customizeTasks || []);
            setCareProfiles(parsedData.careProfiles || []);
            setRelatives(parsedData.relatives || []);
            setRatingsMap(parsedData.ratingsMap || {});
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data
        const [services, tasks, feedbacksData, customizeTasksData, careProfilesData, relativesData] = await Promise.all([
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          feedbackService.getAllFeedbacks(),
          customizeTaskService.getAllCustomizeTasks(),
          careProfileService.getCareProfiles(),
          relativesService.getRelatives()
        ]);

        setServiceTypes(services);
        setServiceTasks(tasks);
        setFeedbacks(feedbacksData);
        setCustomizeTasks(customizeTasksData);
        setCareProfiles(careProfilesData);
        setRelatives(relativesData);

        // Fetch ratings cho từng dịch vụ qua API mới getAverageRatingByService
        let latestRatingsMap = {};
        try {
          const results = await Promise.allSettled(
            services.map(async (s) => {
              try {
                // Sử dụng API mới để lấy rating trung bình trực tiếp
                const ratingResult = await feedbackService.getAverageRatingByService(s.serviceID);
                
                // API trả về số trực tiếp (ví dụ: 4.5)
                const rating = typeof ratingResult === 'number' ? ratingResult : 5.0;
                
                return [s.serviceID, { 
                  rating: parseFloat(rating.toFixed(1)), 
                  count: 0 // API chỉ trả rating, không có count
                }];
              } catch (error) {
                // Fallback về cách cũ nếu API mới không hoạt động
                console.warn(`Fallback to old method for service ${s.serviceID}:`, error);
                const list = await feedbackService.getAllByService(s.serviceID);
                if (!Array.isArray(list) || list.length === 0) {
                  return [s.serviceID, { rating: parseFloat(5.0.toFixed(1)), count: 0 }];
                }
                const sum = list.reduce((acc, f) => acc + Number(f.rate || f.Rate || 0), 0);
                const avg = parseFloat((sum / list.length).toFixed(1));
                return [s.serviceID, { rating: avg, count: list.length }];
              }
            })
          );
          const map = {};
          results.forEach(r => {
            if (r.status === 'fulfilled') {
              const [id, data] = r.value;
              map[id] = data;
            }
          });
          setRatingsMap(map);
          latestRatingsMap = map;
        } catch (e) {
          console.warn('Không thể tải rating theo dịch vụ:', e);
          latestRatingsMap = {};
        }

        // Cache the data (kèm ratingsMap tính được)
        localStorage.setItem('services_data', JSON.stringify({
          services,
          tasks,
          feedbacks: feedbacksData,
          customizeTasks: customizeTasksData,
          careProfiles: careProfilesData,
          relatives: relativesData,
          ratingsMap: latestRatingsMap
        }));
        localStorage.setItem('services_cache_time', now.toString());

      } catch (error) {
        console.error('Error loading services:', error);
        setError('Không thể tải dịch vụ. Vui lòng thử lại sau.');
        // Clear cache on error
        clearServicesCache();
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Khi chọn package thì reset chọn service lẻ
  const handleSelectPackage = (pkgId) => {
    if (selectedPackage === pkgId) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(pkgId);
      setSelectedServices([]);
      setServiceQuantities({}); // Reset số lượng dịch vụ
    }
  };

  // Khi chọn service lẻ thì reset chọn package
  const handleToggleService = (serviceId) => {
    if (selectedPackage) setSelectedPackage(null);
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        // Nếu bỏ chọn dịch vụ, xóa số lượng của nó
        setServiceQuantities(prevQuantities => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[serviceId];
          return newQuantities;
        });
        return prev.filter((id) => id !== serviceId);
      } else {
        // Nếu chọn dịch vụ mới, set số lượng mặc định
        const selectedService = serviceTypes.find(s => s.serviceID === serviceId);
        const defaultQuantity = selectedService?.forMom ? 1 : 1; // Dịch vụ mẹ luôn là 1
        
        setServiceQuantities(prevQuantities => ({
          ...prevQuantities,
          [serviceId]: defaultQuantity
        }));
        return [...prev, serviceId];
      }
    });
  };

  // Hàm cập nhật số lượng cho dịch vụ
  const handleQuantityChange = (serviceId, quantity) => {
    const selectedService = serviceTypes.find(s => s.serviceID === serviceId);
    
    // Nếu là dịch vụ mẹ, luôn giữ số lượng là 1
    if (selectedService?.forMom) {
      setServiceQuantities(prevQuantities => ({
        ...prevQuantities,
        [serviceId]: 1
      }));
      return;
    }

    // Accept requested quantity (ensure at least 1). Caller/server may validate further.
    const validQuantity = Math.max(Math.floor(Number(quantity) || 1), 1);

    setServiceQuantities(prevQuantities => ({
      ...prevQuantities,
      [serviceId]: validQuantity
    }));
  };

  // Removed getMaxQuantityForService — client no longer enforces profile-based limits

  // Tách dịch vụ lẻ và package
  // const singleServices = serviceTypes.filter(s => !s.isPackage && s.status === 'active');
  // const servicePackages = serviceTypes.filter(s => s.isPackage && s.status === 'active');
  const packagesForBaby = serviceTypes.filter(s => s.isPackage && !s.forMom && s.status === 'active');
  const packagesForMomAndBaby = serviceTypes.filter(s => s.isPackage && s.forMom && s.status === 'active');
  const servicesForMom = serviceTypes.filter(s => !s.isPackage && s.forMom && s.status === 'active');
  const servicesForBaby = serviceTypes.filter(s => !s.isPackage && !s.forMom && s.status === 'active');


  // Lấy dịch vụ lẻ thuộc về 1 package từ API
  async function getServicesOfPackage(packageId) {
    try {
      const tasks = await serviceTaskService.getServiceTasksByPackage(packageId);
      // Merge task-level info (quantity, price, description, status) with the canonical service info
      return tasks.map(task => {
        const childServiceId = task.child_ServiceID || task.childServiceID;
        const svc = serviceTypes.find(s => s.serviceID === childServiceId) || {};
        return {
          // preserve canonical service fields
          ...svc,
          // include task-level identifiers
          serviceTaskID: task.serviceTaskID,
          child_ServiceID: childServiceId,
          package_ServiceID: task.package_ServiceID || packageId,
          // task-level overrides / metadata
          description: task.description || task.Description || svc.description || svc.Description,
          price: task.price ?? task.Price ?? svc.price ?? svc.Price,
          status: task.status || task.Status || svc.status || svc.Status,
          quantity: task.quantity ?? task.Quantity ?? 1,
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Error getting services of package:', error);
      return [];
    }
  }

  const handleToggleExpand = (pkgId) => {
    setExpandedPackage(expandedPackage === pkgId ? null : pkgId);
  };

  // Search/filter logic with category
  const filterService = (service) => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.major === selectedCategory;
    return matchesSearch && matchesCategory;
  };

  // const filteredServicePackages = servicePackages.filter(filterService);
  // const filteredSingleServices = singleServices.filter(filterService);

  const filteredPackagesForBaby = packagesForBaby.filter(filterService);
  const filteredPackagesForMomAndBaby = packagesForMomAndBaby.filter(filterService);
  const filteredServicesForMom = servicesForMom.filter(filterService);
  const filteredServicesForBaby = servicesForBaby.filter(filterService);

  // Lấy rating trực tiếp theo dịch vụ từ ratingsMap (được tạo từ API Feedback/GetAllByService)
  const getRating = (serviceId) => {
    const info = ratingsMap[serviceId];
    if (!info) return { rating: "5.0", count: 0 };
    // Đảm bảo rating luôn là string với 1 chữ số thập phân
    const rating = typeof info.rating === 'number' ? info.rating.toFixed(1) : String(info.rating);
    return { ...info, rating };
  };

  // Handle booking
  const handleBook = (serviceId, type = 'service') => {
    // Kiểm tra nếu chưa đăng nhập
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    if (type === 'package') {
      // Tìm thông tin package
      const packageInfo = serviceTypes.find(s => s.serviceID === serviceId);
      if (packageInfo) {
        const packageData = {
          serviceName: packageInfo.serviceName,
          major: packageInfo.major,
          price: packageInfo.price,
          duration: packageInfo.duration,
          description: packageInfo.description,
          serviceID: packageInfo.serviceID
        };
        router.push(`/booking?package=${serviceId}&packageData=${encodeURIComponent(JSON.stringify(packageData))}`);
      } else {
        router.push(`/booking?package=${serviceId}`);
      }
    } else {
      // Tìm thông tin service và số lượng
      const serviceInfo = serviceTypes.find(s => s.serviceID === serviceId);
      const quantity = serviceQuantities[serviceId] || 1;
      if (serviceInfo) {
        const serviceData = {
          serviceName: serviceInfo.serviceName,
          major: serviceInfo.major,
          price: serviceInfo.price,
          duration: serviceInfo.duration,
          description: serviceInfo.description,
          serviceID: serviceInfo.serviceID,
          quantity: quantity
        };
        router.push(`/booking?service=${serviceId}&serviceData=${encodeURIComponent(JSON.stringify(serviceData))}&quantity=${quantity}`);
      } else {
        router.push(`/booking?service=${serviceId}&quantity=${quantity}`);
      }
    }
  };

  if (loading) {
    return <ServicesSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
          <p className="text-gray-500">
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Dịch vụ của chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chọn gói dịch vụ hoặc các dịch vụ lẻ để đặt lịch chăm sóc chuyên nghiệp
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <SearchFilter
          searchText={searchText}
          setSearchText={setSearchText}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Rating Statistics */}
        <ServicesRatingStats
          serviceTypes={serviceTypes}
          ratingsMap={ratingsMap}
          feedbacks={feedbacks}
        />

        {/* Service Packages Section */}
        {filteredPackagesForBaby.length > 0 && (
          <ServiceSection
            title="Gói dịch vụ"
            services={filteredPackagesForBaby}
            type="package"
            selectedItems={selectedPackage ? [selectedPackage] : []}
            onSelect={handleSelectPackage}
            onDetail={setPackageDetail}
            onBook={handleBook}
            isDisabled={selectedServices.length > 0}
            expandedPackage={expandedPackage}
            onToggleExpand={handleToggleExpand}
            getServicesOfPackage={getServicesOfPackage}
            getRating={getRating}
            customizeTasks={customizeTasks}
          />
        )}

        {filteredPackagesForMomAndBaby.length > 0 && (
          <ServiceSection
            title="Gói cho mẹ và bé"
            services={filteredPackagesForMomAndBaby}
            type="package"
            selectedItems={selectedPackage ? [selectedPackage] : []}
            onSelect={handleSelectPackage}
            onDetail={setPackageDetail}
            onBook={handleBook}
            isDisabled={selectedServices.length > 0}
            expandedPackage={expandedPackage}
            onToggleExpand={handleToggleExpand}
            getServicesOfPackage={getServicesOfPackage}
            getRating={getRating}
            customizeTasks={customizeTasks}
          />
        )}

        {filteredServicesForMom.length > 0 && (
          <ServiceSection
            title="Dịch vụ cho mẹ"
            services={filteredServicesForMom}
            type="service"
            selectedItems={selectedServices}
            onSelect={handleToggleService}
            onDetail={setServiceDetail}
            onBook={handleBook}
            isDisabled={!!selectedPackage}
            getRating={getRating}
            customizeTasks={customizeTasks}
            serviceQuantities={serviceQuantities}
            onQuantityChange={handleQuantityChange}
            
            user={user}
            careProfiles={careProfiles}
            relatives={relatives}
          />
        )}

        {filteredServicesForBaby.length > 0 && (
          <ServiceSection
            title="Dịch vụ cho bé"
            services={filteredServicesForBaby}
            type="service"
            selectedItems={selectedServices}
            onSelect={handleToggleService}
            onDetail={setServiceDetail}
            onBook={handleBook}
            isDisabled={!!selectedPackage}
            getRating={getRating}
            customizeTasks={customizeTasks}
            serviceQuantities={serviceQuantities}
            onQuantityChange={handleQuantityChange}
            
            user={user}
            careProfiles={careProfiles}
            relatives={relatives}
          />
        )}

        {/* Empty State */}
        {filteredPackagesForBaby.length === 0 && filteredPackagesForMomAndBaby.length === 0 &&
          filteredServicesForMom.length === 0 && filteredServicesForBaby.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy dịch vụ nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}

        {/* Multi-Service Booking Button */}
        <MultiServiceBooking
          selectedServices={selectedServices}
          serviceQuantities={serviceQuantities}
          serviceTypes={serviceTypes}
          user={user}
          careProfiles={careProfiles}
          relatives={relatives}
        />

        {/* Service Detail Modal */}
        <DetailModal
          isOpen={!!serviceDetail}
          onClose={() => setServiceDetail(null)}
          item={serviceDetail}
          type="service"
        />

        {/* Package Detail Modal */}
        <DetailModal
          isOpen={!!packageDetail}
          onClose={() => setPackageDetail(null)}
          item={packageDetail}
          type="package"
          getServicesOfPackage={getServicesOfPackage}
        />
      </div>
    </div>
  );
} 