'use client';
import { useEffect, useState } from 'react';
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

export default function ServicesPage() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  // const [feedbacks, setFeedbacks] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [serviceDetail, setServiceDetail] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Lấy dữ liệu từ API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        // Lấy tất cả service types từ API servicetypes/getall
        const services = await serviceTypeService.getServiceTypes();
        console.log('Loaded services:', services);
        setServiceTypes(services);

        // Lấy danh sách service task (liên kết giữa package và service lẻ)
        const tasks = await serviceTaskService.getServiceTasks();
        console.log('Loaded service tasks:', tasks);
        setServiceTasks(tasks);

        // Lấy feedbacks cho dịch vụ
        // fetch('/api/feedbacks')
        //   .then(res => res.json())
        //   .then(data => setFeedbacks(Array.isArray(data) ? data : []));
      } catch (error) {
        console.error('Error loading services:', error);
        setServiceTypes([]);
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
    }
  };

  // Khi chọn service lẻ thì reset chọn package
  const handleToggleService = (serviceId) => {
    if (selectedPackage) setSelectedPackage(null);
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Tách dịch vụ lẻ và package
  const singleServices = serviceTypes.filter(s => !s.isPackage && s.status === 'active');
  const servicePackages = serviceTypes.filter(s => s.isPackage && s.status === 'active');

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
  const filterService = (item) => {
    const text = searchText.toLowerCase();
    const categoryMatch = selectedCategory === 'all' || item.major === selectedCategory;
    const textMatch = item.serviceName?.toLowerCase().includes(text) ||
                     (item.description || '').toLowerCase().includes(text);
    return categoryMatch && textMatch;
  };

  const filteredServicePackages = servicePackages.filter(filterService);
  const filteredSingleServices = singleServices.filter(filterService);

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
    if (type === 'package') {
      router.push(`/booking?package=${serviceId}`);
    } else {
      router.push(`/booking?service=${serviceId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dịch vụ...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
        {filteredServicePackages.length > 0 && (
          <ServiceSection
            title="Gói dịch vụ"
            services={filteredServicePackages}
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

        {/* Single Services Section */}
        {filteredSingleServices.length > 0 && (
          <ServiceSection
            title="Dịch vụ lẻ"
            services={filteredSingleServices}
            type="service"
            selectedItems={selectedServices}
            onSelect={handleToggleService}
            onDetail={setServiceDetail}
            onBook={handleBook}
            isDisabled={!!selectedPackage}
            getRating={getRating}
          />
        )}

        {/* Empty State */}
        {filteredServicePackages.length === 0 && filteredSingleServices.length === 0 && (
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
        <MultiServiceBooking selectedServices={selectedServices} />

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