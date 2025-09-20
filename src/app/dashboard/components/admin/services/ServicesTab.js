'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faBoxes, faList, faSearch, faCogs, faHeart, faUserMd, faStethoscope,
  faFilter, faSort, faStar, faChartLine, faGift, faTags
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
    major: '',
    price: 0,
    duration: 0,
    description: '',
    isPackage: false,
    discount: 0,
    forMom: false,
    childServiceTasks: [] // for package create
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
      // Chỉ gọi API một lần, sau đó phân loại dữ liệu
      const allServicesData = await serviceTypeService.getServiceTypes();

      const singleServices = allServicesData.filter(item => !item.isPackage);
      const packageServices = allServicesData.filter(item => item.isPackage);

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
      if (formData.isPackage) {
        // Build payload for /api/servicetypes/createpackage
        const payload = {
          serviceName: formData.serviceName,
          duration: parseInt(formData.duration) || 0,
          description: formData.description,
          discount: parseInt(formData.discount) || 0,
          childServiceTasks: (formData.childServiceTasks || []).map((c, idx) => ({
            child_ServiceID: parseInt(c.child_ServiceID),
            taskOrder: parseInt(c.taskOrder ?? idx + 1),
            quantity: parseInt(c.quantity) || 1
          }))
        };
        await serviceTypeService.createServiceTypePackage(payload);
      } else {
        // Build payload for /api/servicetypes/createsingle
        const payload = {
          serviceName: formData.serviceName,
          major: formData.major,
          price: parseInt(formData.price) || 0,
          duration: parseInt(formData.duration) || 0,
          description: formData.description,
          forMom: !!formData.forMom,
          discount: parseInt(formData.discount) || 0
        };
        await serviceTypeService.createServiceType(payload);
      }
      await loadServices();

      setFormData({
        serviceName: '',
        major: '',
        price: 0,
        duration: 0,
        description: '',
        isPackage: false,
        discount: 0,
        forMom: false,
        childServiceTasks: []
      });
      setShowCreateModal(false);
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
        major: 'Nurse',
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
      major: service.major || '',
      price: service.price,
      duration: service.duration,
      description: service.description,
      isPackage: service.isPackage,
      discount: service.discount || 0,
      forMom: service.forMom || false,
      status: service.status || 'active'
    });
    setShowEditModal(true);
  };

  const openCreateModal = (isPackage = false) => {
    setFormData({
      serviceName: '',
      major: isPackage ? '' : 'Nurse',
      price: isPackage ? 0 : 0,
      duration: 0,
      description: '',
      isPackage,
      discount: 0,
      forMom: false,
      childServiceTasks: isPackage ? [] : undefined,
      status: isPackage ? 'inactive' : 'active'
    });
    setShowCreateModal(true);
  };

  const openPackageDetailModal = (packageService) => {
    setSelectedPackage(packageService);
    setShowPackageDetailModal(true);
  };

  const handlePackageUpdate = () => {
    loadServices(); // Reload services after package update
  };

  const openServiceDetailModal = (service) => {
    setSelectedService(service);
    setShowServiceDetailModal(true);
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
                <FontAwesomeIcon icon={faCogs} className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  <FontAwesomeIcon icon={faStethoscope} className="mr-2 text-blue-500" />
                  Quản lý dịch vụ lẻ và gói dịch vụ của hệ thống
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faList} className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">{services.length} dịch vụ lẻ</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBoxes} className="text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">{packages.length} gói dịch vụ</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="text-green-500 mr-2" />
                <span className="text-sm text-gray-600">
                  {services.filter(s => s.status === 'active').length + packages.filter(p => p.status === 'active').length} đang hoạt động
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openCreateModal(false)}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-3 text-sm group-hover:scale-110 transition-transform" />
              <FontAwesomeIcon icon={faUserMd} className="mr-2 text-sm opacity-75" />
              Thêm dịch vụ
            </button>
            <button
              onClick={() => openCreateModal(true)}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-3 text-sm group-hover:scale-110 transition-transform" />
              <FontAwesomeIcon icon={faGift} className="mr-2 text-sm opacity-75" />
              Thêm gói dịch vụ
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-50 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveServiceTab('services')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeServiceTab === 'services'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
          >
            <div className="flex items-center justify-center">
              <FontAwesomeIcon icon={faUserMd} className="mr-3 text-sm" />
              Dịch vụ đơn lẻ
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${activeServiceTab === 'services'
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 text-blue-700'
                }`}>
                {services.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveServiceTab('packages')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeServiceTab === 'packages'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
          >
            <div className="flex items-center justify-center">
              <FontAwesomeIcon icon={faGift} className="mr-3 text-sm" />
              Gói dịch vụ
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${activeServiceTab === 'packages'
                ? 'bg-white/20 text-white'
                : 'bg-purple-100 text-purple-700'
                }`}>
                {packages.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faFilter} className="text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Tìm kiếm & Lọc</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeServiceTab === 'services' ? 'dịch vụ' : 'gói dịch vụ'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faTags} className="text-gray-400" />
            </div>
            <select
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
            >
              <option value="all">Tất cả chuyên môn</option>
              <option value="Nurse">Chuyên viên chăm sóc</option>
              <option value="Specialist">Chuyên viên tư vấn</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSort} className="text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-500 to-purple-500 border-t-transparent mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCogs} className="text-2xl text-blue-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang tải dữ liệu...</h3>
              <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                <FontAwesomeIcon 
                  icon={activeServiceTab === 'services' ? faUserMd : faGift} 
                  className="text-4xl text-gray-400"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
                <FontAwesomeIcon icon={faStar} className="text-white text-sm" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {activeServiceTab === 'services' ? 'Chưa có dịch vụ nào' : 'Chưa có gói dịch vụ nào'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {activeServiceTab === 'services'
                ? 'Hãy tạo dịch vụ đầu tiên để bắt đầu cung cấp dịch vụ chăm sóc cho khách hàng'
                : 'Hãy tạo gói dịch vụ đầu tiên để cung cấp các combo dịch vụ hấp dẫn cho khách hàng'
              }
            </p>
            <button
              onClick={() => openCreateModal(activeServiceTab === 'packages')}
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-3 group-hover:scale-110 transition-transform" />
              <FontAwesomeIcon icon={activeServiceTab === 'services' ? faUserMd : faGift} className="mr-2" />
              Tạo {activeServiceTab === 'services' ? 'dịch vụ' : 'gói dịch vụ'} đầu tiên
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl mr-4 ${activeServiceTab === 'services' 
                  ? 'bg-gradient-to-r from-blue-100 to-cyan-100' 
                  : 'bg-gradient-to-r from-purple-100 to-pink-100'
                }`}>
                  <FontAwesomeIcon 
                    icon={activeServiceTab === 'services' ? faUserMd : faGift} 
                    className={`text-xl ${activeServiceTab === 'services' 
                      ? 'text-blue-600' 
                      : 'text-purple-600'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {activeServiceTab === 'services' ? 'Danh sách dịch vụ' : 'Danh sách gói dịch vụ'}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-500" />
                    Hiển thị {filteredData.length} kết quả
                    {searchTerm && ` cho từ khóa "${searchTerm}"`}
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Thao tác nhanh:</span>
                <button
                  onClick={() => openCreateModal(activeServiceTab === 'packages')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={`Thêm ${activeServiceTab === 'services' ? 'dịch vụ' : 'gói dịch vụ'}`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        editingService={null}
      />

      <ServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEdit}
        formData={formData}
        setFormData={setFormData}
        title="Chỉnh sửa dịch vụ"
        submitText="Cập nhật"
        editingService={selectedService}
      />

      <PackageDetailModal
        isOpen={showPackageDetailModal}
        onClose={() => setShowPackageDetailModal(false)}
        packageService={selectedPackage}
        onUpdate={handlePackageUpdate}
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
