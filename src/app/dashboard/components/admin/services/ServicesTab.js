'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faBoxes, faList, faSearch
} from '@fortawesome/free-solid-svg-icons';
import serviceTypeService from '@/services/api/serviceTypeService';
import ServiceCard from './components/ServiceCard';
import ServiceModal from './components/ServiceModal';
import PackageDetailModal from './components/PackageDetailModal';
import ServiceDetailModal from './components/ServiceDetailModal';

const ServicesTab = () => {
  const [activeServiceTab, setActiveServiceTab] = useState('services');
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    major: 'nurse',
    price: 0,
    duration: 0,
    description: '',
    isPackage: false
  });
  const [showPackageDetailModal, setShowPackageDetailModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);

  // Load data
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const [servicesData, packagesData] = await Promise.all([
        serviceTypeService.getServiceTypes(),
        serviceTypeService.getServiceTypes()
      ]);

      const singleServices = servicesData.filter(item => !item.isPackage);
      const packageServices = packagesData.filter(item => item.isPackage);
      
      setServices(singleServices);
      setPackages(packageServices);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort functions
  const getFilteredData = () => {
    let data = [];
    
    switch (activeServiceTab) {
      case 'services':
        data = services;
        break;
      case 'packages':
        data = packages;
        break;
      default:
        data = [];
    }
    
    let filtered = data.filter(item => {
      const matchesSearch = item.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMajor = filterMajor === 'all' || item.major === filterMajor;
      
      return matchesSearch && matchesMajor;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.serviceName.localeCompare(b.serviceName);
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration - b.duration;
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  // CRUD Operations for Services
  const handleCreate = async () => {
    try {
      const newService = {
        ...formData,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        // Dịch vụ lẻ mặc định active, gói dịch vụ mặc định inactive
        status: formData.isPackage ? 'inactive' : 'active'
      };

      if (formData.isPackage) {
        await serviceTypeService.createServiceTypePackage(newService);
      } else {
        await serviceTypeService.createServiceType(newService);
      }

      setShowCreateModal(false);
      setFormData({
        serviceName: '',
        major: 'nurse',
        price: 0,
        duration: 0,
        description: '',
        isPackage: false
      });
      loadServices();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedService = {
        ...formData,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        status: formData.status
      };

      await serviceTypeService.updateServiceType(selectedService.serviceID, updatedService);
      
      setShowEditModal(false);
      setSelectedService(null);
      setFormData({
        serviceName: '',
        major: 'nurse',
        price: 0,
        duration: 0,
        description: '',
        isPackage: false,
        status: 'active'
      });
      loadServices();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await serviceTypeService.softDeleteServiceType(serviceId);
        loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        
        // Kiểm tra nếu dịch vụ đã được đánh dấu removed
        if (error.message.includes('already marked as removed')) {
          alert('Dịch vụ này đã được xóa trước đó. Đang tải lại danh sách...');
          loadServices(); // Reload để cập nhật trạng thái
        } else {
          alert('Có lỗi xảy ra khi xóa dịch vụ: ' + error.message);
        }
      }
    }
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      serviceName: service.serviceName,
      major: service.major,
      price: service.price,
      duration: service.duration,
      description: service.description,
      isPackage: service.isPackage,
      status: service.status || 'active'
    });
    setShowEditModal(true);
  };

  const openCreateModal = (isPackage = false) => {
    setFormData({
      serviceName: '',
      major: 'nurse',
      price: 0,
      duration: 0,
      description: '',
      isPackage,
      status: isPackage ? 'inactive' : 'active'
    });
    setShowCreateModal(true);
  };

  const openPackageDetailModal = (packageService) => {
    setSelectedPackage(packageService);
    setShowPackageDetailModal(true);
  };

  const openServiceDetailModal = (service) => {
    setSelectedService(service);
    setShowServiceDetailModal(true);
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
            <p className="text-gray-600 mt-1">Quản lý dịch vụ lẻ và gói dịch vụ của hệ thống</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => openCreateModal(false)}
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-sm" />
              Thêm dịch vụ
            </button>
            <button 
              onClick={() => openCreateModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-sm"
            >
              <FontAwesomeIcon icon={faBoxes} className="mr-2 text-sm" />
              Thêm gói dịch vụ
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveServiceTab('services')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeServiceTab === 'services'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center">
              <FontAwesomeIcon icon={faList} className="mr-2 text-sm" />
              Dịch vụ đơn lẻ
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                activeServiceTab === 'services' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {services.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveServiceTab('packages')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeServiceTab === 'packages'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center">
              <FontAwesomeIcon icon={faBoxes} className="mr-2 text-sm" />
              Gói dịch vụ
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                activeServiceTab === 'packages' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {packages.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeServiceTab === 'services' ? 'dịch vụ' : 'gói dịch vụ'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div>
            <select
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="all">Tất cả chuyên môn</option>
              <option value="nurse">Y tá</option>
              <option value="specialist">Chuyên gia</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="price">Sắp xếp theo giá</option>
              <option value="duration">Sắp xếp theo thời gian</option>
              <option value="status">Sắp xếp theo trạng thái</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Service Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">
              {activeServiceTab === 'services' ? '🏥' : '📦'}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {activeServiceTab === 'services' ? 'Chưa có dịch vụ nào' : 'Chưa có gói dịch vụ nào'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeServiceTab === 'services' 
                ? 'Hãy tạo dịch vụ đầu tiên để bắt đầu quản lý' 
                : 'Hãy tạo gói dịch vụ đầu tiên để bắt đầu quản lý'
              }
            </p>
            <button
              onClick={() => openCreateModal(activeServiceTab === 'packages')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Thêm {activeServiceTab === 'services' ? 'dịch vụ' : 'gói dịch vụ'} đầu tiên
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeServiceTab === 'services' ? 'Danh sách dịch vụ' : 'Danh sách gói dịch vụ'}
              </h3>
              <p className="text-sm text-gray-600">
                Hiển thị {filteredData.length} kết quả
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <ServiceCard
                  key={item.serviceID}
                  item={item}
                  type={activeServiceTab}
                  onEdit={() => openEditModal(item)}
                  onDelete={() => handleDelete(item.serviceID)}
                  onViewDetail={() => activeServiceTab === 'services' ? openServiceDetailModal(item) : openPackageDetailModal(item)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        formData={formData}
        setFormData={setFormData}
        title="Thêm dịch vụ mới"
        submitText="Tạo dịch vụ"
      />

      <ServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEdit}
        formData={formData}
        setFormData={setFormData}
        title="Chỉnh sửa dịch vụ"
        submitText="Cập nhật"
      />

      <PackageDetailModal
        isOpen={showPackageDetailModal}
        onClose={() => setShowPackageDetailModal(false)}
        packageService={selectedPackage}
      />

      <ServiceDetailModal
        isOpen={showServiceDetailModal}
        onClose={() => setShowServiceDetailModal(false)}
        service={selectedService}
      />
    </div>
  );
};

export default ServicesTab;
