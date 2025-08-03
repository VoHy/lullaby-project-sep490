'use client';
import { useState, useEffect } from 'react';

const EditSpecialistModal = ({ specialist, onClose, onUpdate, zones }) => {
  const [formData, setFormData] = useState({
    accountID: specialist.accountID,
    nursingID: specialist.nursingID,
    fullName: specialist.fullName || '',
    phoneNumber: specialist.phoneNumber || '',
    email: specialist.email || '',
    password: specialist.password || 'string',
    avatarUrl: specialist.avatarUrl || 'string',
    createAt: specialist.createAt || new Date().toISOString(),
    deletedAt: specialist.deletedAt || null,
    gender: specialist.gender || 'Nam',
    dateOfBirth: specialist.dateOfBirth ? specialist.dateOfBirth.split('T')[0] : '',
    address: specialist.address || '',
    experience: specialist.experience || '',
    slogan: specialist.slogan || '',
    zoneID: specialist.zoneID || '',
    major: specialist.major || 'specialist',
    status: specialist.status || 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      accountID: specialist.accountID,
      nursingID: specialist.nursingID,
      fullName: specialist.fullName || '',
      phoneNumber: specialist.phoneNumber || '',
      email: specialist.email || '',
      password: specialist.password || 'string',
      avatarUrl: specialist.avatarUrl || 'string',
      createAt: specialist.createAt || new Date().toISOString(),
      deletedAt: specialist.deletedAt || null,
      gender: specialist.gender || 'Nam',
      dateOfBirth: specialist.dateOfBirth ? specialist.dateOfBirth.split('T')[0] : '',
      address: specialist.address || '',
      experience: specialist.experience || '',
      slogan: specialist.slogan || '',
      zoneID: specialist.zoneID || '',
      major: specialist.major || 'specialist',
      status: specialist.status || 'active'
    });
  }, [specialist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.fullName || !formData.phoneNumber || !formData.email) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      await onUpdate(specialist.nursingID, formData);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Sửa thông tin Chuyên gia</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
          {/* Account Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-purple-700 flex items-center">
              <span className="mr-2">👤</span>
              Thông tin tài khoản
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-green-700 flex items-center">
              <span className="mr-2">👤</span>
              Thông tin cá nhân
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-purple-700 flex items-center">
              <span className="mr-2">🎓</span>
              Thông tin chuyên môn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kinh nghiệm
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="VD: 5 năm, 10 năm..."
                />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="VD: Chăm sóc tận tình..."
                />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chuyên môn
                </label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="specialist">Chuyên gia</option>
                  <option value="nurse">Y tá</option>
                </select>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Khu vực
                </label>
                <select
                  name="zoneID"
                  value={formData.zoneID}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                >
                  {zones.map(zone => (
                    <option key={zone.zoneID} value={zone.zoneID}>
                      {zone.zoneName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Avatar Information */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-orange-700 flex items-center">
              <span className="mr-2">📋</span>
              Thông tin bổ sung
            </h4>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="URL hình ảnh (tùy chọn)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '⏳ Đang cập nhật...' : '💾 Cập nhật'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSpecialistModal; 