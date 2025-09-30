"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faDollarSign, faList, faBoxes, faTimes } from '@fortawesome/free-solid-svg-icons';
import serviceTaskService from '@/services/api/serviceTaskService';
import serviceTypeService from '@/services/api/serviceTypeService';

const PackageDetailModal = ({ isOpen, onClose, packageService, onUpdate }) => {
  // Hooks must be called unconditionally on every render
  const [packageTasks, setPackageTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false); // legacy state, no longer used in read-only view
  const [availableServices, setAvailableServices] = useState([]);
  const [allServices, setAllServices] = useState([]); // Lưu tất cả services để lookup tên
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [taskFormData, setTaskFormData] = useState({
    description: '',
    price: 0,
    quantity: 1
  });

  useEffect(() => {
    const loadPackageTasks = async () => {
      try {
        setLoading(true);
        if (!packageService) return;
        const tasks = await serviceTaskService.getServiceTasksByPackage(packageService.serviceID);
        setPackageTasks(tasks);
      } catch (error) {
        console.error('Error loading package tasks:', error);
        setPackageTasks([]);
      } finally {
        setLoading(false);
      }
    };

    const loadAvailableServices = async () => {
      try {
        const services = await serviceTypeService.getServiceTypes();
        // Lưu tất cả services để lookup tên
        setAllServices(services);
        // Chỉ lấy các dịch vụ con (isPackage: false) và chưa được thêm vào gói này
        const singleServices = services.filter(service =>
          !service.isPackage &&
          service.status === 'active'
        );
        setAvailableServices(singleServices);
      } catch (error) {
        console.error('Error loading available services:', error);
        setAvailableServices([]);
        setAllServices([]);
      }
    };

    if (isOpen && packageService) {
      loadPackageTasks();
      loadAvailableServices();
    }
  }, [isOpen, packageService]);

  // Cập nhật availableServices khi packageTasks thay đổi
  useEffect(() => {
    if (isOpen && packageService && availableServices.length > 0) {
      const filteredServices = availableServices.filter(service =>
        !packageTasks.some(task => task.child_ServiceID === service.serviceID)
      );
      setAvailableServices(filteredServices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageTasks, isOpen, packageService]);

  // After hooks are declared, it's safe to conditionally render
  if (!isOpen) return null;

  if (!packageService) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin gói dịch vụ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Read-only modal: no add/edit/delete actions

  const handleDeleteTask = async () => {};

  const calculateTotalPrice = () => {
    // Exclude tasks whose child service status indicates removal
    const visibleTasks = packageTasks.filter(task => {
      const childService = allServices.find(s => s.serviceID === task.child_ServiceID);
      const status = (childService?.status || '').toString().toLowerCase();
      return status !== 'remove' && status !== 'removed';
    });
    return visibleTasks.reduce((total, task) => total + (task.price * task.quantity), 0);
  };

  const calculateTotalDuration = () => {
    const visibleTasks = packageTasks.filter(task => {
      const childService = allServices.find(s => s.serviceID === task.child_ServiceID);
      const status = (childService?.status || '').toString().toLowerCase();
      return status === 'active';
    });
    return visibleTasks.reduce((total, task) => {
      const childService = allServices.find(s => s.serviceID === task.child_ServiceID);
      return total + ((childService?.duration || 0) * task.quantity);
    }, 0);
  };

  // Visible tasks should only be active child services
  const visibleTasks = packageTasks.filter(task => {
    const childService = allServices.find(s => s.serviceID === task.child_ServiceID);
    const status = (childService?.status || '').toString().toLowerCase();
    return status === 'active';
  });

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="mr-3 p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100">
                <FontAwesomeIcon icon={faBoxes} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Chi tiết gói dịch vụ</h3>
                <p className="text-gray-600 mt-1">{packageService.serviceName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center"
              aria-label="Đóng"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Package Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Giá gói</p>
                  <p className="font-semibold text-lg">{packageService.price?.toLocaleString()} VNĐ</p>
                </div>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian</p>
                  <p className="font-semibold text-lg">{packageService.duration} phút</p>
                </div>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faList} className="text-purple-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Số dịch vụ con</p>
                  <p className="font-semibold text-lg">{visibleTasks.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Dịch vụ con trong gói</h4>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Đang tải...</p>
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FontAwesomeIcon icon={faList} className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600">Chưa có dịch vụ con nào trong gói</p>
              </div>
            ) : (
                <div className="space-y-4">
                  {visibleTasks.map((task, index) => {
                      const childService = allServices.find(s => s.serviceID === task.child_ServiceID);
                      return (
                        <div key={task.serviceTaskID || task.taskID} className={`bg-white border border-gray-200 rounded-lg p-4`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3">
                                  {index + 1}
                                </span>
                                <h5 className="font-semibold text-gray-800">
                                  {childService?.serviceName || `Dịch vụ #${task.child_ServiceID}`}
                                </h5>
                                {childService?.major && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                    {childService.major === 'Nurse' ? 'Chăm sóc' : 'Chuyên viên tư vấn'}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{task.description || childService?.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center text-green-600">
                                  <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                  <span className="font-medium">{task.price?.toLocaleString()} VNĐ</span>
                                </div>
                                <div className="flex items-center text-blue-600">
                                  <span className="mr-1">Số lượng:</span>
                                  <span className="font-medium">{task.quantity}</span>
                                </div>
                                {childService && (
                                  <div className="flex items-center text-purple-600">
                                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                                    <span className="font-medium">{childService.duration} phút</span>
                                  </div>
                                )}
                                <div className="flex items-center text-orange-600">
                                  <span className="mr-1">Tổng:</span>
                                  <span className="font-medium">{(task.price * task.quantity).toLocaleString()} VNĐ</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
            )}
          </div>

          {/* Package Summary */}
          {visibleTasks.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt gói dịch vụ</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faDollarSign} className="text-green-500 mr-3 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Tổng giá trị các dịch vụ</p>
                    <p className="font-bold text-xl text-green-700">{calculateTotalPrice().toLocaleString()} VNĐ</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faList} className="text-purple-500 mr-3 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Tiết kiệm được</p>
                    <p className="font-bold text-xl text-purple-700">
                      {(calculateTotalPrice() - (packageService.price || 0)).toLocaleString()} VNĐ
                    </p>
                    {calculateTotalPrice() > 0 && (
                      <p className="text-xs text-purple-600">
                        ({(((calculateTotalPrice() - (packageService.price || 0)) / calculateTotalPrice()) * 100).toFixed(1)}% giảm giá)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailModal;