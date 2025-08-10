"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faDollarSign, faList, faBoxes } from '@fortawesome/free-solid-svg-icons';
import serviceTaskService from '@/services/api/serviceTaskService';
import serviceTypeService from '@/services/api/serviceTypeService';

const PackageDetailModal = ({ isOpen, onClose, packageService, onUpdate }) => {
  // Hooks must be called unconditionally on every render
  const [packageTasks, setPackageTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false); // legacy state, no longer used in read-only view
  const [availableServices, setAvailableServices] = useState([]);
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
        // Chỉ lấy các dịch vụ con (isPackage: false) và chưa được thêm vào gói này
        const singleServices = services.filter(service =>
          !service.isPackage &&
          service.status === 'active'
        );
        setAvailableServices(singleServices);
      } catch (error) {
        console.error('Error loading available services:', error);
        setAvailableServices([]);
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
    return packageTasks.reduce((total, task) => total + (task.price * task.quantity), 0);
  };

  const calculateTotalDuration = () => {
    return packageTasks.reduce((total, task) => {
      // Lấy thời gian từ dịch vụ con
      const childService = availableServices.find(s => s.serviceID === task.child_ServiceID);
      return total + ((childService?.duration || 0) * task.quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faBoxes} className="mr-3 text-blue-500" />
                Chi tiết gói dịch vụ: {packageService.serviceName}
              </h3>
              <p className="text-gray-600 mt-1">{packageService.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                  <p className="font-semibold text-lg">{packageTasks.length}</p>
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
            ) : packageTasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FontAwesomeIcon icon={faList} className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600">Chưa có dịch vụ con nào trong gói</p>
              </div>
            ) : (
              <div className="space-y-4">
                {packageTasks.map((task, index) => {
                  const childService = availableServices.find(s => s.serviceID === task.child_ServiceID);
                  return (
                    <div key={task.serviceTaskID || task.taskID} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3">
                              {index + 1}
                            </span>
                            <h5 className="font-semibold text-gray-800">
                              {childService?.serviceName || `Dịch vụ #${task.child_ServiceID}`}
                            </h5>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Giá: {task.price?.toLocaleString()} VNĐ</span>
                            <span>Số lượng: {task.quantity}</span>
                            {childService && (
                              <span>Thời gian: {childService.duration} phút</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 text-gray-300">
                          {/* read-only: no actions */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          {packageTasks.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Tổng kết</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tổng giá dịch vụ con: </span>
                  <span className="font-semibold">{calculateTotalPrice().toLocaleString()} VNĐ</span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng thời gian: </span>
                  <span className="font-semibold">{calculateTotalDuration()} phút</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Read-only: remove add modal */}
    </div>
  );
};

export default PackageDetailModal;