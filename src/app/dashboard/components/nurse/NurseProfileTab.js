import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt } from 'react-icons/fa';

const NurseProfileTab = ({ nurseAccount }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: nurseAccount?.full_name || '',
    email: nurseAccount?.email || '',
    phone_number: nurseAccount?.phone_number || '',
    avatar_url: nurseAccount?.avatar_url || '',
    status: nurseAccount?.status || 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
  };

  const handleCancel = () => {
    setFormData({
      full_name: nurseAccount?.full_name || '',
      email: nurseAccount?.email || '',
      phone_number: nurseAccount?.phone_number || '',
      avatar_url: nurseAccount?.avatar_url || '',
      status: nurseAccount?.status || 'active'
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h3>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaEdit className="text-sm" />
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FaTimes className="text-sm" />
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center">
              <div className="relative inline-block">
                <img 
                  src={formData.avatar_url && formData.avatar_url !== 'string' ? formData.avatar_url : '/images/logo-eldora.png'} 
                  alt="avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
                    <FaEdit className="text-sm" />
                  </button>
                )}
              </div>
              <div className="mt-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="text-center bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    nurseAccount?.full_name
                  )}
                </h4>
                <p className="text-gray-600 mt-1">{nurseAccount?.role_name}</p>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Thông tin cá nhân
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">{nurseAccount?.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaPhone className="mr-2 text-gray-500" />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">{nurseAccount?.phone_number}</p>
                  )}
                </div>

                {/* Created Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaCalendar className="mr-2 text-gray-500" />
                    Ngày tạo tài khoản
                  </label>
                  <p className="text-gray-800">
                    {nurseAccount?.created_at ? new Date(nurseAccount.created_at).toLocaleDateString('vi-VN') : '-'}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaShieldAlt className="mr-2 text-gray-500" />
                    Trạng thái
                  </label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm khóa</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      nurseAccount?.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {nurseAccount?.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bổ sung</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã tài khoản</label>
                  <p className="text-gray-800 font-mono">#{nurseAccount?.AccountID}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                  <p className="text-gray-800">{nurseAccount?.role_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Vai trò</label>
                  <p className="text-gray-800">{nurseAccount?.role_id}</p>
                </div>
  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày xóa</label>
                  <p className="text-gray-800">{nurseAccount?.delete_at ? new Date(nurseAccount.delete_at).toLocaleDateString('vi-VN') : 'Chưa xóa'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Hủy thay đổi
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
    </div>
  </div>
);
};

export default NurseProfileTab; 