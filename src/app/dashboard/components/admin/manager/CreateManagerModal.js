import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faUser, faEnvelope, faPhone,
  faSave, faTimes, faImage
} from '@fortawesome/free-solid-svg-icons';
import accountService from '@/services/api/accountService';

const CreateManagerModal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    avatar_url: '',
    role_id: 3, // Manager role
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const DEFAULT_AVATAR = 'https://i.ibb.co/6JYchKy9/396c741c3d37ad0199ac220d16169e3e.jpg';
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_AVATAR);
  const [imageError, setImageError] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Tên không được để trống';
    }

    if (String(formData.full_name).trim().length < 2) {
      newErrors.full_name = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại không được để trống';
    } else if (!/^0\d{8,9}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 và có 9-10 chữ số.';
    }

    // Strong password checks (stepwise messages)
    const pwd = formData.password || '';
    if (!pwd) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (pwd.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[a-z]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường [a-z]';
    } else if (!/[A-Z]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa [A-Z]';
    } else if (!/[0-9]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 số [0-9]';
    } else if (!/[!@#$%^&*]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt [!@#$%^&*]';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || hasSubmitted) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      // duplicate email check
      try {
        const allAccounts = await accountService.getAllAccounts();
        const exists = Array.isArray(allAccounts) && allAccounts.some(a => String(a.email || a.Email || '').toLowerCase() === String(formData.email).toLowerCase());
        if (exists) {
          alert('Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
          setIsSubmitting(false);
          setHasSubmitted(false);
          return;
        }
      } catch (err) {
        console.error('Email check failed:', err);
        // proceed; backend will validate
      }

      const data = {
        fullName: formData.full_name,
        email: formData.email,
        phoneNumber: formData.phone_number,
        password: formData.password,
        avatarUrl: formData.avatar_url || DEFAULT_AVATAR,
      };

      // Gọi API để tạo manager
      const result = await accountService.registerManager(data);

      alert('Tạo tài khoản manager thành công!');

      // Gọi callback để refresh danh sách (không truyền data)
      if (onSubmit) {
        onSubmit(); // Không truyền data để tránh duplicate request
      }

      handleClose();
    } catch (error) {
      console.error('CreateManagerModal: Error creating manager:', error);

      // Hiển thị thông báo lỗi chi tiết
      let errorMessage = 'Tạo tài khoản manager thất bại!';
      if (error.message.includes('email address already exists')) {
        errorMessage = 'Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.';
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    const url = formData.avatar_url && formData.avatar_url.trim() ? formData.avatar_url.trim() : DEFAULT_AVATAR;
    setImageError(false);
    setPreviewUrl(url);
  }, [formData.avatar_url]);

  const handleClose = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      avatar_url: '',
      role_id: 3,
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col relative">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10"
          onClick={handleClose}
        >
          &times;
        </button>

        {/* Nội dung có scroll */}
        <div className="overflow-y-auto px-8 pt-8 pb-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faUserPlus} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Thêm quản lý
                </h3>
                <p className="text-gray-600">Thêm quản lý vào hệ thống</p>
              </div>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          </div>

          {/* Form */}
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.full_name ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0123456789"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                )}
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faImage} className="mr-2 text-purple-500" />
                  Avatar URL (không bắt buộc)
                </label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu không có ảnh đại diện
                </p>
                {/* Avatar preview */}
                <div className="mt-3 flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
                    <img
                      src={previewUrl}
                      alt="avatar preview"
                      onError={() => setImageError(true)}
                      className={`w-full h-full object-cover ${imageError ? 'hidden' : ''}`}
                    />
                    {imageError && (
                      <div className="text-xs text-gray-500 px-2 text-center">Ảnh không hợp lệ</div>
                    )}
                  </div>
                </div>
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                )}
              </div>
            </div>

            {/* Thông báo */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>Lưu ý:</strong> Khu vực quản lý sẽ được phân công sau khi tạo quản lý.
                Quản trị viên có thể cập nhật khu vực cho quản lý trong phần quản lý khu vực.
              </p>
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
                    Tạo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default CreateManagerModal;