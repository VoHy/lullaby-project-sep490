'use client';
import { useEffect, useState, useContext } from 'react';
import { motion } from "framer-motion";
// import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
// import feedbackService from '@/services/api/feedbackService';
import {
  SearchFilter,
  ServiceSection,
  DetailModal,
  MultiServiceBooking
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

// Utility function to clear services cache
const clearServicesCache = () => {
  localStorage.removeItem('services_data');
  localStorage.removeItem('services_cache_time');
};

export default function ServicesPage() {
  const { user, token } = useContext(AuthContext);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  // const [feedbacks, setFeedbacks] = useState([]);
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

        // Use cache if it's less than 10 minutes old
        if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 10 * 60 * 1000) {
          const parsedData = JSON.parse(cachedData);
          setServiceTypes(parsedData.services);
          setServiceTasks(parsedData.tasks);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const [services, tasks] = await Promise.all([
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks()
        ]);

        setServiceTypes(services);
        setServiceTasks(tasks);

        // Cache the data
        localStorage.setItem('services_data', JSON.stringify({
          services,
          tasks
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
        // Nếu chọn dịch vụ mới, set số lượng mặc định là 1
        setServiceQuantities(prevQuantities => ({
          ...prevQuantities,
          [serviceId]: 1
        }));
        return [...prev, serviceId];
      }
    });
  };

  // Hàm cập nhật số lượng cho dịch vụ
  const handleQuantityChange = (serviceId, quantity) => {
    setServiceQuantities(prevQuantities => ({
      ...prevQuantities,
      [serviceId]: quantity
    }));
  };

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
      return tasks.map(task => {
        const childServiceId = task.child_ServiceID || task.childServiceID;
        return serviceTypes.find(s => s.serviceID === childServiceId);
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

  // Tính rating từ feedbacks API
  const getRating = (serviceId) => {
    // Comment lại vì feedbacks API chưa hoàn thiện
    // const fb = feedbacks.filter(f => f.ServiceID === serviceId);
    // if (!fb.length) return { rating: 5.0, count: 0 };
    // const rating = (fb.reduce((sum, f) => sum + (f.Rating || 5), 0) / fb.length).toFixed(1);
    // return { rating, count: fb.length };

    // Tạm thời return rating mặc định vì feedbacks API đã bị comment
    return { rating: 5.0, count: 0 };
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
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
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

        {/* Service Packages Section */}
        {filteredPackagesForBaby.length > 0 && (
          <ServiceSection
            title="Gói cho bé"
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
            serviceQuantities={serviceQuantities}
            onQuantityChange={handleQuantityChange}
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
            serviceQuantities={serviceQuantities}
            onQuantityChange={handleQuantityChange}
          />
        )}

        {/* Empty State */}
        {filteredPackagesForBaby.length === 0 && filteredPackagesForMomAndBaby.length === 0 &&
          filteredServicesForMom.length === 0 && filteredServicesForBaby.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🏥</div>
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