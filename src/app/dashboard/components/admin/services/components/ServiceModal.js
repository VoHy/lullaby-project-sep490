"use client";

import React, { useEffect, useState } from 'react';
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faClock, faDollarSign, faList, faTimes, faUserMd, faGift, faEdit } from '@fortawesome/free-solid-svg-icons';

function PackageBuilder({ formData, setFormData }) {
  const childTasks = formData.childServiceTasks || [];
  const [allSingles, setAllSingles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const all = await serviceTypeService.getServiceTypes();
        const singles = (all || []).filter(s => !s.isPackage && (s.status === 'active' || !s.status));
        setAllSingles(singles);
      } catch (e) {
        setAllSingles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addRow = () => {
    setFormData({
      ...formData,
      childServiceTasks: [...childTasks, { child_ServiceID: '', taskOrder: childTasks.length + 1, quantity: 1 }]
    });
  };

  const updateRow = (idx, field, value) => {
    const next = childTasks.map((row, i) => i === idx ? { ...row, [field]: value } : row);
    setFormData({ ...formData, childServiceTasks: next });
  };

  const removeRow = (idx) => {
    const next = childTasks.filter((_, i) => i !== idx).map((row, i) => ({ ...row, taskOrder: i + 1 }));
    setFormData({ ...formData, childServiceTasks: next });
  };

  const alreadySelectedIds = new Set(childTasks.map(t => parseInt(t.child_ServiceID)).filter(Boolean));
  const options = allSingles.filter(s => !alreadySelectedIds.has(s.serviceID));

  return (
    <div className="space-y-4">
      {childTasks.length === 0 && (
        <p className="text-sm text-gray-500">Chưa thêm dịch vụ con nào. Nhấn "Thêm" để bắt đầu.</p>
      )}
      {childTasks.map((row, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-12 md:col-span-6">
            <select
              value={row.child_ServiceID}
              onChange={(e) => updateRow(idx, 'child_ServiceID', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Chọn dịch vụ...</option>
              {([row.child_ServiceID] // allow keep selected even if filtered out
                .map(id => allSingles.find(s => s.serviceID === parseInt(id)))
                .filter(Boolean)
                .concat(options)
              ).map(s => (
                <option key={s.serviceID} value={s.serviceID}>
                  {s.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-6 md:col-span-3">
            <input
              type="number"
              placeholder="Số lượng"
              value={row.quantity}
              min={1}
              onChange={(e) => updateRow(idx, 'quantity', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="col-span-5 md:col-span-2">
            <input
              type="number"
              placeholder="#"
              value={row.taskOrder}
              min={1}
              onChange={(e) => updateRow(idx, 'taskOrder', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="col-span-1 text-right">
            <button type="button" onClick={() => removeRow(idx)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Xóa</button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={loading}>
          {loading ? 'Đang tải...' : 'Thêm'}
        </button>
      </div>
      <p className="text-xs text-gray-500">Danh sách chọn lấy từ các dịch vụ đơn lẻ đang hoạt động.</p>
    </div>
  );
}

const ServiceModal = ({ isOpen, onClose, onSubmit, formData, setFormData, title, submitText, editingService }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[92vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`mr-3 p-3 rounded-xl ${formData.isPackage ? 'bg-purple-100' : 'bg-blue-100'}`}>
                <FontAwesomeIcon icon={formData.isPackage ? faGift : faUserMd} className={`${formData.isPackage ? 'text-purple-600' : 'text-blue-600'}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center"
              aria-label="Đóng"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông tin cơ bản
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.serviceName}
                      onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Nhập tên dịch vụ..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chuyên môn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="Nurse">Chuyên viên chăm sóc</option>
                      <option value="Specialist">Chuyên gia tư vấn</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Duration Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Giá cả & Thời gian
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian (phút) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Discount & ForMom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                    <input
                      type="number"
                      value={formData.discount || 0}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center mt-8">
                    <input
                      id="forMom"
                      type="checkbox"
                      checked={!!formData.forMom}
                      onChange={(e) => setFormData({ ...formData, forMom: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="forMom" className="ml-2 block text-sm text-gray-700">Dịch vụ dành cho mẹ</label>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Mô tả
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả dịch vụ
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Mô tả chi tiết về dịch vụ..."
                  />
                </div>
              </div>

              {/* Service Type, Package Builder & Status Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Loại dịch vụ & Trạng thái
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Loại dịch vụ
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          checked={!formData.isPackage}
                          onChange={() => setFormData({ ...formData, isPackage: false })}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Dịch vụ lẻ</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          checked={formData.isPackage}
                          onChange={() => setFormData({ ...formData, isPackage: true })}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Gói dịch vụ</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
                {/* Package management */}
                <PackageChildrenManager
                  isOpen={isOpen}
                  isPackage={!!formData.isPackage}
                  editingService={editingService}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors font-medium"
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;

// Reusable manager to make edit modal look/behave like detail modal
function PackageChildrenManager({ isOpen, isPackage, editingService, formData, setFormData }) {
  // If creating a new package (no editingService), reuse the simple builder
  const isEditingExistingPackage = Boolean(isPackage && editingService?.serviceID);

  // State for existing package management
  const [packageTasks, setPackageTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [taskFormData, setTaskFormData] = useState({ description: '', price: 0, quantity: 1 });
  const [editingTaskMap, setEditingTaskMap] = useState({});
  const [editDraftMap, setEditDraftMap] = useState({});

  // Load for edit case to mimic detail modal
  useEffect(() => {
    const load = async () => {
      if (!isEditingExistingPackage || !isOpen) return;
      try {
        setLoading(true);
        const [tasks, allServices] = await Promise.all([
          serviceTaskService.getServiceTasksByPackage(editingService.serviceID),
          serviceTypeService.getServiceTypes(),
        ]);
        setPackageTasks(tasks || []);
        const singles = (allServices || []).filter(s => !s.isPackage && (s.status === 'active' || !s.status));
        setAvailableServices(singles);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEditingExistingPackage, isOpen, editingService?.serviceID]);

  // Create/Remove tasks for existing package
  const handleAddTask = async () => {
    if (!selectedServiceId) {
      alert('Vui lòng chọn dịch vụ con');
      return;
    }
    if (!taskFormData.description.trim()) {
      alert('Vui lòng nhập mô tả cho dịch vụ con');
      return;
    }
    await serviceTaskService.createServiceTask({
      package_ServiceID: editingService.serviceID,
      childServiceTasks: [
        {
          child_ServiceID: parseInt(selectedServiceId),
          taskOrder: (packageTasks?.length || 0) + 1,
          quantity: parseInt(taskFormData.quantity) || 1,
        },
      ],
    });
    const refreshed = await serviceTaskService.getServiceTasksByPackage(editingService.serviceID);
    setPackageTasks(refreshed || []);
    setSelectedServiceId('');
    setTaskFormData({ description: '', price: 0, quantity: 1 });
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ con này khỏi gói?')) return;
    await serviceTaskService.deleteServiceTask(taskId);
    const refreshed = await serviceTaskService.getServiceTasksByPackage(editingService.serviceID);
    setPackageTasks(refreshed || []);
  };

  const toggleEditTask = (task) => {
    const id = task.serviceTaskID || task.taskID;
    setEditingTaskMap(prev => ({ ...prev, [id]: !prev[id] }));
    setEditDraftMap(prev => ({
      ...prev,
      [id]: prev[id] || { description: task.description || '', price: task.price || 0, quantity: task.quantity || 1 },
    }));
  };

  const updateEditDraft = (id, field, value) => {
    setEditDraftMap(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const saveTaskEdits = async (task) => {
    const id = task.serviceTaskID || task.taskID;
    const draft = editDraftMap[id];
    await serviceTaskService.updateServiceTask(id, {
      description: draft.description,
      price: parseInt(draft.price) || 0,
      quantity: parseInt(draft.quantity) || 1,
    });
    const refreshed = await serviceTaskService.getServiceTasksByPackage(editingService.serviceID);
    setPackageTasks(refreshed || []);
    setEditingTaskMap(prev => ({ ...prev, [id]: false }));
  };

  const calculateTotalPrice = () => (packageTasks || []).reduce((sum, t) => sum + (t.price * t.quantity), 0);
  const calculateTotalDuration = () => (packageTasks || []).reduce((sum, t) => {
    const svc = availableServices.find(s => s.serviceID === t.child_ServiceID);
    return sum + ((svc?.duration || 0) * t.quantity);
  }, 0);

  if (!isPackage) return null;

  // If creating a new package, keep the original builder UI
  if (!isEditingExistingPackage) {
    return (
      <div className="mt-6 border-t pt-6">
        <h5 className="text-md font-semibold mb-3">Danh sách dịch vụ con</h5>
        {/* Highlight services already selected in builder by preventing re-select */}
        <PackageBuilder formData={formData} setFormData={setFormData} />
      </div>
    );
  }

  // Editing existing package -> show detail-like UI with add/edit in two-row layout
  return (
    <div className="mt-6 border-t pt-6">
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faList} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Số dịch vụ con</p>
              <p className="font-semibold text-lg">{packageTasks.length}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tổng thời gian</p>
              <p className="font-semibold text-lg">{calculateTotalDuration()} phút</p>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tổng giá ước tính</p>
              <p className="font-semibold text-lg">{calculateTotalPrice().toLocaleString()} VNĐ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h5 className="text-md font-semibold">Dịch vụ con trong gói</h5>
        <button
          type="button"
          onClick={() => setShowAddTaskModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Thêm dịch vụ con
        </button>
      </div>

      {loading ? (
        <div className="text-center py-6">Đang tải...</div>
      ) : packageTasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FontAwesomeIcon icon={faList} className="text-gray-400 text-3xl mb-2" />
          <p className="text-gray-600">Chưa có dịch vụ con nào trong gói</p>
        </div>
      ) : (
        <div className="space-y-3">
          {packageTasks.map((task, index) => {
            const childService = availableServices.find(s => s.serviceID === task.child_ServiceID);
            const taskId = task.serviceTaskID || task.taskID;
            const isEditing = !!editingTaskMap[taskId];
            const draft = editDraftMap[taskId] || {};
            return (
              <div key={task.serviceTaskID || task.taskID} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3">{index + 1}</span>
                      <h5 className="font-semibold text-gray-800">{childService?.serviceName || `Dịch vụ #${task.child_ServiceID}`}</h5>
                    </div>
                    {isEditing ? (
                      <div className="space-y-3 mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-600 mb-1">Mô tả</label>
                            <textarea
                              className="w-full px-3 py-2 border rounded-lg"
                              rows="3"
                              value={draft.description}
                              onChange={(e) => updateEditDraft(taskId, 'description', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <label className="block text-gray-600 mb-1">Giá (VNĐ)</label>
                              <input type="number" className="w-full px-3 py-2 border rounded-lg" value={draft.price} onChange={(e) => updateEditDraft(taskId, 'price', e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Số lượng</label>
                              <input type="number" className="w-full px-3 py-2 border rounded-lg" value={draft.quantity} onChange={(e) => updateEditDraft(taskId, 'quantity', e.target.value)} />
                            </div>
                            {childService && (
                              <div className="col-span-2 flex items-end">
                                <span className="text-gray-500">Thời gian: {childService.duration} phút</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
                          <span>Giá: {task.price?.toLocaleString()} VNĐ</span>
                          <span>Số lượng: {task.quantity}</span>
                          {childService && <span>Thời gian: {childService.duration} phút</span>}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    {isEditing ? (
                      <>
                        <button type="button" onClick={() => saveTaskEdits(task)} className="px-3 py-2 bg-blue-500 text-white rounded">Lưu</button>
                        <button type="button" onClick={() => toggleEditTask(task)} className="px-3 py-2 border rounded">Hủy</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => toggleEditTask(task)} className="px-3 py-2 border rounded flex items-center"><FontAwesomeIcon icon={faEdit} className="mr-2" />Sửa</button>
                    )}
                    <button type="button" onClick={() => handleDeleteTask(task.serviceTaskID || task.taskID)} className="text-red-500 hover:text-red-700">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Thêm dịch vụ con</h4>
                <button type="button" onClick={() => setShowAddTaskModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn dịch vụ con <span className="text-red-500">*</span></label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      const selected = availableServices.find(s => s.serviceID == e.target.value);
                      if (selected) {
                        setTaskFormData({ ...taskFormData, price: selected.price, description: selected.description || '' });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn dịch vụ...</option>
                    {availableServices.map(s => {
                      const alreadyInPackage = (packageTasks || []).some(t => t.child_ServiceID === s.serviceID);
                      return (
                        <option
                          key={s.serviceID}
                          value={s.serviceID}
                          disabled={alreadyInPackage}
                          style={alreadyInPackage ? { color: '#dc2626', backgroundColor: '#fff5f5' } : {}}
                        >
                          {s.serviceName} - {s.price?.toLocaleString()} VNĐ{alreadyInPackage ? ' (đã có trong gói)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả <span className="text-red-500">*</span></label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ)</label>
                    <input type="number" value={taskFormData.price} onChange={(e) => setTaskFormData({ ...taskFormData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                    <input type="number" value={taskFormData.quantity} onChange={(e) => setTaskFormData({ ...taskFormData, quantity: e.target.value })} className="w-full px-3 py-2 border rounded-lg" min="1" />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowAddTaskModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Hủy</button>
                  <button type="button" onClick={handleAddTask} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Thêm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}