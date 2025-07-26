import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone,
  faSave, faTimes, faEdit, faEye,
  faUserMd, faShieldAlt, faClock
} from '@fortawesome/free-solid-svg-icons';
import zonesData from '@/mock/Zone';

const ManagerDetailModal = ({ show, manager, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: manager?.full_name || '',
    email: manager?.email || '',
    phone_number: manager?.phone_number || '',
    zone_id: manager?.zone_id || '',
    status: manager?.status || 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const zones = zonesData;

  // Cập nhật form data khi manager thay đổi
  React.useEffect(() => {
    if (manager) {
      setFormData({
        full_name: manager.full_name || '',
        email: manager.email || '',
        phone_number: manager.phone_number || '',
        zone_id: manager.zone_id || '',
        status: manager.status || 'active'
      });
    }
  }, [manager]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Tên không được để trống';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedManager = {
        ...manager,
        ...formData,
        updated_at: new Date().toISOString()
      };

      await onSave(manager.AccountID, updatedManager);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating manager:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Tìm khu vực mà Manager đang quản lý (giống logic trong ManagerTab.js)
  const getManagedZone = (managerId) => {
    const zone = zones.find(z => z.AccountID === managerId);
    return zone;
  };

  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.ZoneID === Number(zoneId));
    return zone ? zone.Zone_name : 'Chưa có khu vực';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Tạm khóa';
  };

  if (!show || !manager) return null;

  // Lấy khu vực quản lý hiện tại của Manager
  const currentManagedZone = getManagedZone(manager.AccountID);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" 
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Chi tiết Manager
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <FontAwesomeIcon icon={isEditing ? faEye : faEdit} className="mr-2" />
              {isEditing ? 'Xem' : 'Chỉnh sửa'}
            </button>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {manager.full_name?.charAt(0) || 'M'}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{manager.full_name}</h4>
                <p className="text-gray-600">{manager.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    manager.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {getStatusText(manager.status)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Manager
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                Thông tin cá nhân
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{manager.full_name}</p>
                  )}
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-500" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{manager.email}</p>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-purple-500" />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.phone_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0123456789"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{manager.phone_number || 'Chưa cập nhật'}</p>
                  )}
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin quản lý */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUserMd} className="mr-2 text-purple-500" />
                Thông tin quản lý
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khu vực quản lý
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.zone_id}
                      onChange={(e) => handleInputChange('zone_id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn khu vực (có thể để trống)</option>
                      {zones.map(zone => (
                        <option key={zone.ZoneID} value={zone.ZoneID} disabled={zone.AccountID && zone.AccountID !== manager.AccountID}>
                          {zone.Zone_name} - {zone.City}
                          {zone.AccountID && zone.AccountID !== manager.AccountID ? ' (Đã có Manager)' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">
                      {currentManagedZone ? currentManagedZone.Zone_name : 'Chưa có khu vực'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-purple-500" />
                    Trạng thái
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm khóa</option>
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{getStatusText(manager.status)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-500" />
                    Ngày tạo tài khoản
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl">
                    {manager.created_at ? new Date(manager.created_at).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-500" />
                    Cập nhật lần cuối
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl">
                    {manager.updated_at ? new Date(manager.updated_at).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ManagerDetailModal; 