import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faDollarSign, faList } from '@fortawesome/free-solid-svg-icons';
import serviceTaskService from '@/services/api/serviceTaskService';
import serviceTypeService from '@/services/api/serviceTypeService';

const PackageDetailModal = ({ isOpen, onClose, packageService }) => {
  if (!isOpen || !packageService) return null;

  const [packageTasks, setPackageTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [taskFormData, setTaskFormData] = useState({
    description: '',
    price: 0
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
        const singleServices = services.filter(service => !service.isPackage);
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

  const handleAddTask = async () => {
    if (!selectedServiceId) {
      alert('Vui lòng chọn dịch vụ con');
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
        price: parseInt(taskFormData.price),
        quantity: 1
      };

      await serviceTaskService.createServiceTask(newTask);
      
      // Reload package tasks
      const tasks = await serviceTaskService.getServiceTasksByPackage(packageService.serviceID);
      setPackageTasks(tasks);
      
      // Reset form
      setSelectedServiceId('');
      setTaskFormData({
        description: '',
        price: 0
      });
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Có lỗi xảy ra khi thêm dịch vụ con');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ con này?')) {
      try {
        await serviceTaskService.deleteServiceTask(taskId);
        const tasks = await serviceTaskService.getServiceTasksByPackage(packageService.serviceID);
        setPackageTasks(tasks);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Có lỗi xảy ra khi xóa dịch vụ con');
      }
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Chi tiết gói dịch vụ</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Package Information and Sub-services in 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Package Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin gói dịch vụ</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tên gói dịch vụ</label>
                  <p className="text-lg font-semibold text-gray-800">{packageService.serviceName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Trạng thái</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    packageService.status === 'active' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  }`}>
                    {packageService.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Chuyên môn</label>
                  <p className="text-gray-800">
                    {packageService.major === 'nurse' ? 'Y tá' : 
                     packageService.major === 'specialist' ? 'Chuyên gia' : packageService.major}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Giá</label>
                  <p className="text-lg font-semibold text-green-600">{packageService.price?.toLocaleString()} VNĐ</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Thời gian</label>
                  <p className="text-gray-800">{packageService.duration} phút</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Số dịch vụ con</label>
                  <p className="text-gray-800">{packageTasks.length} dịch vụ</p>
                </div>
                {packageService.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
                    <p className="text-gray-800">{packageService.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sub-services List */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800">Danh sách dịch vụ con</h4>
                {packageService.status === 'active' && (
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors text-sm font-medium flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Thêm dịch vụ con
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải dịch vụ con...</p>
                </div>
              ) : packageTasks.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-4xl mb-3">📦</div>
                  <h5 className="text-lg font-medium text-gray-600 mb-2">Chưa có dịch vụ con nào</h5>
                  <p className="text-gray-500 text-sm">
                    {packageService.status === 'active' 
                      ? 'Hãy thêm dịch vụ con vào gói dịch vụ này' 
                      : 'Cần kích hoạt gói dịch vụ trước khi thêm dịch vụ con'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {packageTasks.map((task, index) => (
                    <div key={task.serviceTaskID} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3">
                              {index + 1}
                            </span>
                            <h5 className="text-lg font-semibold text-gray-800">{task.serviceName}</h5>
                          </div>
                          {task.description && (
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-1 text-green-500">Giá</span>
                              <span className="font-medium">{task.price?.toLocaleString()} VNĐ</span>
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faList} className="mr-1 text-purple-500" />
                              <span>Số lượng: {task.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteTask(task.serviceTaskID)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa dịch vụ con"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Task Modal */}
          {showAddTaskModal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Thêm dịch vụ con</h3>
                  <p className="text-sm text-gray-600 mb-4">Gói dịch vụ: <span className="font-medium">{packageService.serviceName}</span></p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chọn dịch vụ lẻ <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedServiceId}
                          onChange={(e) => setSelectedServiceId(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          required
                        >
                          <option value="">Chọn dịch vụ lẻ...</option>
                          {availableServices.map(service => (
                            <option key={service.serviceID} value={service.serviceID}>
                              {service.serviceName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={taskFormData.price}
                          onChange={(e) => setTaskFormData({...taskFormData, price: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả (tùy chọn)
                        </label>
                        <textarea
                          value={taskFormData.description}
                          onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                          placeholder="Mô tả thêm về dịch vụ con này..."
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddTaskModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors font-medium"
                      >
                        Thêm dịch vụ con
                      </button>
                    </div>
                  </form>
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