import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt, FaMapMarkerAlt, FaGraduationCap, FaQuoteLeft, FaVenusMars } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';

const NurseProfileTab = ({ nurseAccount }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nurseProfile, setNurseProfile] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);

  // Form data cho account
  const [accountFormData, setAccountFormData] = useState({
    accountID: nurseAccount?.accountID || '',
    roleID: nurseAccount?.roleID || 2,
    fullName: nurseAccount?.fullName || '',
    phoneNumber: nurseAccount?.phoneNumber || '',
    email: nurseAccount?.email || '',
    password: nurseAccount?.password || 'string',
    avatarUrl: nurseAccount?.avatarUrl || 'string',
    createAt: nurseAccount?.createAt || new Date().toISOString(),
    deletedAt: nurseAccount?.deletedAt || null,
    status: nurseAccount?.status || 'active'
  });

  // Form data cho nursing specialist profile
  const [profileFormData, setProfileFormData] = useState({
    nursingID: '',
    accountID: nurseAccount?.accountID || '',
    zoneID: '',
    gender: '',
    dateOfBirth: '',
    fullName: nurseAccount?.fullName || '',
    address: '',
    experience: '',
    slogan: '',
    major: '',
    status: 'active'
  });

  // Load thông tin chi tiết nursing specialist
  useEffect(() => {
    const fetchNurseProfile = async () => {
      if (!user?.accountID) return;

      try {
        setLoading(true);
        const specialists = await nursingSpecialistService.getAllNursingSpecialists();
        const currentSpecialist = specialists.find(n => n.accountID === user.accountID);
        
        if (currentSpecialist) {
          setNurseProfile(currentSpecialist);
          setProfileFormData({
            nursingID: currentSpecialist.nursingID,
            accountID: currentSpecialist.accountID,
            zoneID: currentSpecialist.zoneID,
            gender: currentSpecialist.gender || 'Nam',
            dateOfBirth: currentSpecialist.dateOfBirth ? currentSpecialist.dateOfBirth.split('T')[0] : '',
            fullName: currentSpecialist.fullName || '',
            address: currentSpecialist.address || '',
            experience: currentSpecialist.experience || '',
            slogan: currentSpecialist.slogan || '',
            major: currentSpecialist.major || 'nurse',
            status: currentSpecialist.status || 'active'
          });
        }

        // Lấy thông tin account để hiển thị createAt chính xác
        try {
          const acc = await accountService.getAccountById(user.accountID);
          setAccountInfo(acc);
        } catch (e) {
          console.warn('Không thể lấy account info:', e?.message);
        }
      } catch (error) {
        console.error('Error fetching nurse profile:', error);
        setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchNurseProfile();
  }, [user?.accountID]);

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // CHỈ cập nhật hồ sơ nurse specialist theo API PUT /api/nursingspecialists/update/{id}
      // Không cập nhật email/phoneNumber (thuộc Account)
      if (nurseProfile?.nursingID) {
        const payload = {
          zoneID: Number(profileFormData.zoneID) || nurseProfile.zoneID || 0,
          gender: profileFormData.gender || nurseProfile.gender || 'Nam',
          dateOfBirth: profileFormData.dateOfBirth ? new Date(profileFormData.dateOfBirth).toISOString() : (nurseProfile.dateOfBirth || new Date().toISOString()),
          fullName: profileFormData.fullName || nurseProfile.fullName || '',
          address: profileFormData.address || nurseProfile.address || '',
          experience: profileFormData.experience || nurseProfile.experience || '',
          slogan: profileFormData.slogan || nurseProfile.slogan || '',
          major: profileFormData.major || nurseProfile.major || 'nurse'
        };
        await nursingSpecialistService.updateNursingSpecialist(nurseProfile.nursingID, payload);
      }

      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAccountFormData({
      accountID: nurseAccount?.accountID || '',
      roleID: nurseAccount?.roleID || 2,
      fullName: nurseAccount?.fullName || '',
      phoneNumber: nurseAccount?.phoneNumber || '',
      email: nurseAccount?.email || '',
      password: nurseAccount?.password || 'string',
      avatarUrl: nurseAccount?.avatarUrl || 'string',
      createAt: nurseAccount?.createAt || new Date().toISOString(),
      deletedAt: nurseAccount?.deletedAt || null,
      status: nurseAccount?.status || 'active'
    });

    if (nurseProfile) {
      setProfileFormData({
        nursingID: nurseProfile.nursingID,
        accountID: nurseProfile.accountID,
        zoneID: nurseProfile.zoneID,
        gender: nurseProfile.gender || 'Nam',
        dateOfBirth: nurseProfile.dateOfBirth ? nurseProfile.dateOfBirth.split('T')[0] : '',
        fullName: nurseProfile.fullName || '',
        address: nurseProfile.address || '',
        experience: nurseProfile.experience || '',
        slogan: nurseProfile.slogan || '',
        major: nurseProfile.major || 'nurse',
        status: nurseProfile.status || 'active'
      });
    }

    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h3>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaEdit className="text-sm" />
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaSave className="text-sm" />
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTimes className="text-sm" />
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center">
              <div className="relative inline-block">
                <img 
                  src={accountFormData.avatarUrl && accountFormData.avatarUrl !== 'string' ? accountFormData.avatarUrl : '/images/logo-eldora.png'} 
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
                      name="fullName"
                      value={accountFormData.fullName}
                      onChange={handleAccountInputChange}
                      className="text-center bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    nurseAccount?.fullName
                  )}
                </h4>
                <p className="text-gray-600 mt-1">
                  {nurseProfile?.major === 'Nurse' ? 'Y tá' : 'Chuyên gia'}
                </p>
              </div>
            </div>
          </div>

          {/* Information Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                <FaUser className="mr-2" />
                Thông tin tài khoản
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    Email
                  </label>
                  <p className="text-gray-800">{nurseAccount?.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaPhone className="mr-2 text-gray-500" />
                    Số điện thoại
                  </label>
                  <p className="text-gray-800">{nurseAccount?.phoneNumber}</p>
                </div>

                {/* Created Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaCalendar className="mr-2 text-gray-500" />
                    Ngày tạo tài khoản
                  </label>
                  <p className="text-gray-800">
                    {accountInfo?.createAt || accountInfo?.CreateAt || accountInfo?.createdAt || accountInfo?.CreatedAt
                      ? new Date(accountInfo.createAt || accountInfo.CreateAt || accountInfo.createdAt || accountInfo.CreatedAt).toLocaleDateString('vi-VN')
                      : '-'}
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
                      value={accountFormData.status}
                      onChange={handleAccountInputChange}
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

            {/* Personal Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                <FaUser className="mr-2" />
                Thông tin cá nhân
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaVenusMars className="mr-2 text-gray-500" />
                    Giới tính
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profileFormData.gender}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  ) : (
                    <p className="text-gray-800">{nurseProfile?.gender || 'N/A'}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaCalendar className="mr-2 text-gray-500" />
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileFormData.dateOfBirth}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {nurseProfile?.dateOfBirth ? new Date(nurseProfile.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={profileFormData.address}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Số nhà, đường, phường, quận, thành phố"
                    />
                  ) : (
                    <p className="text-gray-800">{nurseProfile?.address || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                <FaGraduationCap className="mr-2" />
                Thông tin chuyên môn
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="experience"
                      value={profileFormData.experience}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="VD: 5 năm, 10 năm..."
                    />
                  ) : (
                    <p className="text-gray-800">{nurseProfile?.experience || 'N/A'}</p>
                  )}
                </div>

                {/* Major */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  {isEditing ? (
                    <select
                      name="major"
                      value={profileFormData.major}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Nurse">Y tá</option>
                      <option value="Specialist">Chuyên gia</option>
                    </select>
                  ) : (
                    <p className="text-gray-800">
                      {nurseProfile?.major === 'Nurse' ? 'Y tá' : 'Chuyên gia'}
                    </p>
                  )}
                </div>

                {/* Slogan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaQuoteLeft className="mr-2 text-gray-500" />
                    Slogan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="slogan"
                      value={profileFormData.slogan}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="VD: Chăm sóc tận tình..."
                    />
                  ) : (
                    <p className="text-gray-800 italic">{nurseProfile?.slogan || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-orange-700 mb-4">Thông tin bổ sung</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã tài khoản</label>
                  <p className="text-gray-800 font-mono">#{nurseAccount?.accountID}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã y tá/chuyên gia</label>
                  <p className="text-gray-800 font-mono">#{nurseProfile?.nursingID || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                  <p className="text-gray-800">#{nurseProfile?.zoneID || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày xóa</label>
                  <p className="text-gray-800">
                    {nurseAccount?.deletedAt ? new Date(nurseAccount.deletedAt).toLocaleDateString('vi-VN') : 'Chưa xóa'}
                  </p>
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
              disabled={loading}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Hủy thay đổi
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseProfileTab; 