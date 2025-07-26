import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, faUser, faEnvelope, faPhone, 
  faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';
import zonesData from '@/mock/Zone';

const CreateManagerModal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    zone_id: '', // Thêm field khu vực quản lý
    role_id: 4, // Manager role
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const zones = zonesData;

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

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Mật khẩu xác nhận không khớp';
    }

    // Nếu chọn khu vực, kiểm tra khu vực đã có Manager chưa
    if (formData.zone_id) {
      const selectedZone = zones.find(z => z.ZoneID === Number(formData.zone_id));
      if (selectedZone && selectedZone.AccountID) {
        newErrors.zone_id = 'Khu vực này đã có Manager!';
      }
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
      // Tạo account data với thông tin cơ bản
      const accountData = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role_id: formData.role_id,
        status: formData.status,
        created_at: new Date().toISOString(),
        zone_id: formData.zone_id || null // Thêm zone_id nếu có
      };

      await onSubmit(accountData);
      handleClose();
    } catch (error) {
      console.error('Error creating manager:', error);
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

  const handleClose = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      zone_id: '',
      role_id: 4,
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" 
          onClick={handleClose}
        >
          &times;
        </button>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faUserPlus} className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Tạo Manager mới
              </h3>
              <p className="text-gray-600">Thêm Manager vào hệ thống</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ và tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập họ và tên"
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-500" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-purple-500" />
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0123456789"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>

            {/* Khu vực quản lý */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khu vực quản lý (không bắt buộc)
              </label>
              <select
                value={formData.zone_id}
                onChange={(e) => handleInputChange('zone_id', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.zone_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn khu vực (có thể để trống)</option>
                {zones.map(zone => (
                  <option key={zone.ZoneID} value={zone.ZoneID} disabled={zone.AccountID}>
                    {zone.Zone_name} - {zone.City}
                    {zone.AccountID ? ' (Đã có Manager)' : ''}
                  </option>
                ))}
              </select>
              {errors.zone_id && (
                <p className="text-red-500 text-sm mt-1">{errors.zone_id}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Nếu chọn, khu vực này sẽ được phân công cho Manager mới. Mỗi khu vực chỉ có thể có một Manager.
              </p>
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                Mật khẩu
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
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
                  Đang tạo...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Tạo Manager
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManagerModal; 