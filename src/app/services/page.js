'use client';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import customerPackageService from '@/services/api/customerPackageService';
import serviceTypeService from '@/services/api/serviceTypeService';   
import serviceTasks from '@/mock/ServiceTask';
import feedbacks from '@/mock/Feedback';
import { 
  SearchFilter, 
  ServiceSection, 
  DetailModal, 
  MultiServiceBooking 
} from './components';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [packageServiceTypes, setPackageServiceTypes] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [serviceDetail, setServiceDetail] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    customerPackageService.getCustomerPackages().then(setPackages);
    serviceTypeService.getServiceTypes().then(setServiceTypes);
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
  const singleServices = serviceTypes.filter(s => !s.IsPackage && s.Status === 'active');
  const servicePackages = serviceTypes.filter(s => s.IsPackage && s.Status === 'active');

  // Lấy dịch vụ lẻ thuộc về 1 package
  function getServicesOfPackage(packageId) {
    const tasks = serviceTasks.filter(t => t.Package_ServiceID === packageId);
    return tasks.map(task => serviceTypes.find(s => s.ServiceID === task.Child_ServiceID)).filter(Boolean);
  }

  const handleToggleExpand = (pkgId) => {
    setExpandedPackage(expandedPackage === pkgId ? null : pkgId);
  };

  // Search/filter logic with category
  const filterService = (item) => {
    const text = searchText.toLowerCase();
    const categoryMatch = selectedCategory === 'all' || item.Category === selectedCategory;
    const textMatch = item.ServiceName.toLowerCase().includes(text) ||
                     (item.Description || '').toLowerCase().includes(text);
    return categoryMatch && textMatch;
  };

  const filteredServicePackages = servicePackages.filter(filterService);
  const filteredSingleServices = singleServices.filter(filterService);

  // Calculate rating
  const getRating = (serviceId) => {
    const fb = feedbacks.filter(f => f.ServiceID === serviceId);
    if (!fb.length) return { rating: 5.0, count: 0 };
    const rating = (fb.reduce((sum, f) => sum + (f.Rating || 5), 0) / fb.length).toFixed(1);
    return { rating, count: fb.length };
  };

  // Handle booking
  const handleBook = (serviceId) => {
    if (selectedPackage) {
      router.push(`/booking?package=${serviceId}`);
    } else {
      router.push(`/booking?service=${serviceId}`);
    }
  };

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

        {/* Single Services Section */}
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