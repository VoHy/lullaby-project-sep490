'use client';
import { useState, useEffect } from 'react';
import accountService from '@/services/api/accountService';
import { FaTimes, FaUser, FaGraduationCap, FaMapMarkerAlt, FaPlus, FaHourglassHalf } from 'react-icons/fa';

const AddSpecialistModal = ({ onClose, onAdd, managedZone, error }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    gender: 'Nam',
    dateOfBirth: '',
    address: '',
    experience: '',
    slogan: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const DEFAULT_MALE = 'https://i.ibb.co/zWchkWb9/bae8ac1e948df3e40f745095485a1351.jpg';
  const DEFAULT_FEMALE = 'https://i.ibb.co/qX4Pprh/ae4af3fa63764c2b2d27ff9a35f7097a.jpg';
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_MALE);
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const url = formData.avatarUrl && String(formData.avatarUrl).trim() !== ''
      ? formData.avatarUrl.trim()
      : (formData.gender === 'Nam' ? DEFAULT_MALE : DEFAULT_FEMALE);
    setImageError(false);
    setPreviewUrl(url);
  }, [formData.avatarUrl, formData.gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // validation
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    const phoneRegex = /^0\d{8,9}$/;
    const pwd = formData.password || '';
    const newErrors = {};
    if (!formData.fullName || String(formData.fullName).trim().length < 2) newErrors.fullName = 'Họ tên không hợp lệ. Vui lòng nhập ít nhất 2 ký tự.';
    if (!formData.email || !emailRegex.test(String(formData.email))) newErrors.email = 'Email không hợp lệ.';
    if (!formData.phoneNumber || !phoneRegex.test(String(formData.phoneNumber))) newErrors.phoneNumber = 'Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 và có 9-10 chữ số.';
    if (pwd.length < 8) newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    else if (!/[a-z]/.test(pwd)) newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường [a-z]';
    else if (!/[A-Z]/.test(pwd)) newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa [A-Z]';
    else if (!/[0-9]/.test(pwd)) newErrors.password = 'Mật khẩu phải có ít nhất 1 số [0-9]';
    else if (!/[!@#$%^&*]/.test(pwd)) newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt [!@#$%^&*]';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // duplicate email check
    try {
      const allAccounts = await accountService.getAllAccounts();
      const exists = Array.isArray(allAccounts) && allAccounts.some(a => String(a.email || a.Email || '').toLowerCase() === String(formData.email).toLowerCase());
      if (exists) {
        setErrors({ email: 'Email đã tồn tại trong hệ thống' });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Email check failed', err);
    }

    try {
      // resolve avatar using top-level defaults
      const resolvedAvatar = formData.avatarUrl && String(formData.avatarUrl).trim() !== ''
        ? formData.avatarUrl
        : (formData.gender === 'Nam' ? DEFAULT_MALE : formData.gender === 'Nữ' ? DEFAULT_FEMALE : '');

      await onAdd({ ...formData, avatarUrl: resolvedAvatar });
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Tạo thất bại, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Thêm chuyên viên tư vấn mới</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.form}
          </div>
        )}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Thông tin tài khoản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaGraduationCap className="text-gray-500" />
                Thông tin chuyên môn
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="VD: 5 năm, 10 năm..."
                  />
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="VD: Chăm sóc tận tình..."
                  />
                </div>

                <div className="bg-white rounded-lg p-0 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white ${errors.avatarUrl ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="URL hình ảnh (tùy chọn)"
                  />
                  {errors.avatarUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.avatarUrl}</p>
                  )}

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
            </section>

            {/* Personal Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="bg-white rounded-lg p-0 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Số nhà, đường, phường, quận, thành phố"
                  />
                </div>
              </div>
            </section>

            {/* Zone Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" />
                Khu vực quản lý
              </h4>
              <p className="text-sm font-medium text-gray-700">
                {managedZone?.zoneName || 'N/A'}
              </p>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black/80 transition-all duration-200 font-semibold shadow-sm disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2"><FaHourglassHalf /> Đang thêm...</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><FaPlus /> Thêm chuyên viên tư vấn</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpecialistModal; 