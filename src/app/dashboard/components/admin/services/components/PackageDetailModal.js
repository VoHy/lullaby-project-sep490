import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faDollarSign, faList, faBoxes } from '@fortawesome/free-solid-svg-icons';
import serviceTaskService from '@/services/api/serviceTaskService';
import serviceTypeService from '@/services/api/serviceTypeService';

const PackageDetailModal = ({ isOpen, onClose, packageService, onUpdate }) => {

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

  const [packageTasks, setPackageTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
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
  }, [packageTasks, isOpen, packageService]);

  const handleAddTask = async () => {
    if (!selectedServiceId) {
      alert('Vui lòng chọn dịch vụ con');
      return;
    }

    if (!taskFormData.description.trim()) {
      alert('Vui lòng nhập mô tả cho dịch vụ con');
      return;
    }

    try {
      const selectedService = availableServices.find(s => s.serviceID == selectedServiceId);
      if (!selectedService) {
        alert('Dịch vụ không tồn tại');
        return;
      }

      const newTask = {
        child_ServiceID: parseInt(selectedServiceId),
        package_ServiceID: packageService.serviceID,
        description: taskFormData.description,
        taskOrder: packageTasks.length + 1,
        price: parseInt(taskFormData.price) || selectedService.price,
        quantity: parseInt(taskFormData.quantity) || 1
      };

      await serviceTaskService.createServiceTask(newTask);

      // Reload package tasks
      const tasks = await serviceTaskService.getServiceTasksByPackage(packageService.serviceID);
      setPackageTasks(tasks);

      // Reset form
      setSelectedServiceId('');
      setTaskFormData({
        description: '',
        price: 0,
        quantity: 1
      });
      setShowAddTaskModal(false);

      // Thông báo cập nhật
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Có lỗi xảy ra khi thêm dịch vụ con: ' + error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ con này khỏi gói?')) {
      try {
        await serviceTaskService.deleteServiceTask(taskId);
        const tasks = await serviceTaskService.getServiceTasksByPackage(packageService.serviceID);
        setPackageTasks(tasks);

        // Thông báo cập nhật
        if (onUpdate) {
          onUpdate();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Có lỗi xảy ra khi xóa dịch vụ con');
      }
    }
  };

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
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Thêm dịch vụ con
              </button>
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
                <p className="text-sm text-gray-500 mt-1">Nhấn "Thêm dịch vụ con" để bắt đầu</p>
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
                        <button
                          onClick={() => handleDeleteTask(task.serviceTaskID || task.taskID)}
                          className="text-red-500 hover:text-red-700 transition-colors ml-4"
                          title="Xóa dịch vụ con"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
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

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Thêm dịch vụ con</h4>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn dịch vụ con <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      const selected = availableServices.find(s => s.serviceID == e.target.value);
                      if (selected) {
                        setTaskFormData({
                          ...taskFormData,
                          price: selected.price,
                          description: selected.description || ''
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn dịch vụ...</option>
                    {availableServices.map(service => (
                      <option key={service.serviceID} value={service.serviceID}>
                        {service.serviceName} - {service.price?.toLocaleString()} VNĐ
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Mô tả chi tiết dịch vụ con..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={taskFormData.price}
                      onChange={(e) => setTaskFormData({ ...taskFormData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      value={taskFormData.quantity}
                      onChange={(e) => setTaskFormData({ ...taskFormData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetailModal; 