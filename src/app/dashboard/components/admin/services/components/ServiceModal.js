import React, { useEffect, useState } from 'react';
import serviceTypeService from '@/services/api/serviceTypeService';

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
    <div className="space-y-3">
      {childTasks.length === 0 && (
        <p className="text-sm text-gray-500">Chưa thêm dịch vụ con nào. Nhấn "Thêm" để bắt đầu.</p>
      )}
      {childTasks.map((row, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-6">
            <select
              value={row.child_ServiceID}
              onChange={(e) => updateRow(idx, 'child_ServiceID', e.target.value)}
              className="w-full px-3 py-2 border rounded"
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
          <div className="col-span-3">
            <input
              type="number"
              placeholder="Số lượng"
              value={row.quantity}
              min={1}
              onChange={(e) => updateRow(idx, 'quantity', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <input
              type="number"
              placeholder="#"
              value={row.taskOrder}
              min={1}
              onChange={(e) => updateRow(idx, 'taskOrder', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="col-span-1 text-right">
            <button type="button" onClick={() => removeRow(idx)} className="px-3 py-2 text-red-600">Xóa</button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? 'Đang tải...' : 'Thêm'}
        </button>
      </div>
      <p className="text-xs text-gray-500">Danh sách chọn lấy từ các dịch vụ đơn lẻ đang hoạt động.</p>
    </div>
  );
}

const ServiceModal = ({ isOpen, onClose, onSubmit, formData, setFormData, title, submitText }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                      onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, major: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="nurse">Y tá</option>
                      <option value="specialist">Chuyên gia</option>
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
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                          onChange={() => setFormData({...formData, isPackage: false})}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Dịch vụ lẻ</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          checked={formData.isPackage}
                          onChange={() => setFormData({...formData, isPackage: true})}
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
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>

                {/* Package builder: chọn dịch vụ con từ list service */}
                {formData.isPackage && (
                  <div className="mt-6 border-t pt-6">
                    <h5 className="text-md font-semibold mb-3">Danh sách dịch vụ con</h5>
                    <PackageBuilder formData={formData} setFormData={setFormData} />
                  </div>
                )}
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