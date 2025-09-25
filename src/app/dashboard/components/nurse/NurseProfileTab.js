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

  // Dữ liệu tổng hợp từ cả accountService và nursingSpecialistService
  const [mergedAccount, setMergedAccount] = useState(null);
  const [accountFormData, setAccountFormData] = useState({});
  const [profileFormData, setProfileFormData] = useState({});

  useEffect(() => {
    const fetchNurseProfile = async () => {
      if (!user?.accountID) return;
      try {
        setLoading(true);
        // Lấy thông tin account
        const acc = await accountService.getAccountById(user.accountID);
        setAccountInfo(acc);

        // Lấy thông tin chuyên môn
        const specialists = await nursingSpecialistService.getAllNursingSpecialists();
        const currentSpecialist = specialists.find(n => n.accountID === user.accountID);
        setNurseProfile(currentSpecialist);

        // Gộp dữ liệu
        const merged = {
          ...acc,
          ...currentSpecialist,
          status: acc?.status || currentSpecialist?.status || 'active',
        };
        setMergedAccount(merged);

        setAccountFormData({
          accountID: merged.accountID || '',
          roleID: merged.roleID || 2,
          fullName: merged.fullName || '',
          phoneNumber: merged.phoneNumber || '',
          email: merged.email || '',
          password: merged.password || 'string',
          avatarUrl: merged.avatarUrl || 'string',
          createAt: merged.createAt || new Date().toISOString(),
          deletedAt: merged.deletedAt || null,
          status: merged.status || 'active'
        });

        setProfileFormData({
          nursingID: merged.nursingID || '',
          accountID: merged.accountID || '',
          zoneID: merged.zoneID || '',
          gender: merged.gender || 'Nam',
          dateOfBirth: merged.dateOfBirth ? merged.dateOfBirth.split('T')[0] : '',
          fullName: merged.fullName || '',
          address: merged.address || '',
          experience: merged.experience || '',
          slogan: merged.slogan || '',
          major: merged.major || 'Nurse',
          status: merged.status || 'active'
        });
      } catch (error) {
        setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchNurseProfile();
  }, [user?.accountID]);

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (nurseProfile?.nursingID) {
        // Build payload exactly as API expects
        const payload = {
          zoneID: Number(profileFormData.zoneID) || nurseProfile.zoneID || 0,
          gender: profileFormData.gender || nurseProfile.gender || 'Nam',
          dateOfBirth: profileFormData.dateOfBirth ? new Date(profileFormData.dateOfBirth).toISOString() : (nurseProfile.dateOfBirth || new Date().toISOString()),
          // prefer the account-level fullName (header input) if the user edited it
          fullName: accountFormData.fullName || profileFormData.fullName || nurseProfile.fullName || '',
          address: profileFormData.address || nurseProfile.address || '',
          experience: profileFormData.experience || nurseProfile.experience || '',
          slogan: profileFormData.slogan || nurseProfile.slogan || '',
          major: nurseProfile?.major || profileFormData.major || 'Nurse'
        };

        // Only call the nursing specialist update endpoint
        await nursingSpecialistService.updateNursingSpecialist(nurseProfile.nursingID, payload);

        // Update local profileFormData with the saved payload (keep zoneID hidden in UI)
        setProfileFormData(prev => ({ ...prev, ...{
          zoneID: payload.zoneID,
          gender: payload.gender,
          dateOfBirth: payload.dateOfBirth ? payload.dateOfBirth.split('T')[0] : prev.dateOfBirth,
          fullName: payload.fullName,
          address: payload.address,
          experience: payload.experience,
          slogan: payload.slogan,
          major: payload.major
        }}));

        // Keep the account header in sync so the displayed fullName updates immediately
        setAccountFormData(prev => ({ ...prev, fullName: payload.fullName }));
      }

      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
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
        major: nurseProfile.major || 'Nurse',
        status: nurseProfile.status || 'active'
      });
    }

    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h2>
          <div className="flex gap-3">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow hover:scale-105 transition-transform">
                <FaEdit /> Chỉnh sửa
              </button>
            ) : (
              <>
                <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition-colors disabled:opacity-50">
                  <FaSave /> Lưu
                </button>
                <button onClick={handleCancel} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-xl shadow hover:bg-gray-500 transition-colors disabled:opacity-50">
                  <FaTimes /> Hủy
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-inner">
            <div className="relative">
              <img src={accountFormData.avatarUrl !== 'string' ? accountFormData.avatarUrl : '/images/logo-eldora.png'} alt="avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
            </div>
            {isEditing ? (
              <input type="text" name="fullName" value={accountFormData.fullName} onChange={handleAccountInputChange} className="text-center border-b-2 border-blue-300 focus:border-blue-500 outline-none text-lg font-semibold" />
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">{accountFormData.fullName}</h3>
            )}
            <p className="text-gray-600">{profileFormData.major === 'Nurse' ? 'Chuyên viên chăm sóc' : 'Chuyên viên tư vấn'}</p>
          </div>

          {/* Info Sections */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Account Info */}
            <Card title="Thông tin tài khoản" icon={<FaUser />} color="blue">
              <InfoRow label="Email" value={accountFormData.email} icon={<FaEnvelope />} />
              <InfoRow label="Số điện thoại" value={accountFormData.phoneNumber} icon={<FaPhone />} />
              <InfoRow label="Ngày tạo" value={accountInfo?.createAt ? new Date(accountInfo.createAt).toLocaleDateString('vi-VN') : '-'} icon={<FaCalendar />} />
              <InfoRow label="Trạng thái" value={(
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accountFormData.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {accountFormData.status?.toLowerCase() === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              )} icon={<FaShieldAlt />} />
            </Card>

            {/* Personal Info */}
            <Card title="Thông tin cá nhân" icon={<FaUser />} color="green">
              <InfoRow label="Giới tính" value={isEditing ? (
                <select name="gender" value={profileFormData.gender} onChange={handleProfileInputChange} className="w-full border px-2 py-1 rounded-lg">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              ) : profileFormData.gender} icon={<FaVenusMars />} />
              <InfoRow label="Ngày sinh" value={isEditing ? (
                <input type="date" name="dateOfBirth" value={profileFormData.dateOfBirth} onChange={handleProfileInputChange} className="w-full border px-2 py-1 rounded-lg" />
              ) : profileFormData.dateOfBirth ? new Date(profileFormData.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'} icon={<FaCalendar />} />
              <InfoRow label="Địa chỉ" value={isEditing ? (
                <input type="text" name="address" value={profileFormData.address} onChange={handleProfileInputChange} placeholder="Số nhà, đường..." className="w-full border px-2 py-1 rounded-lg" />
              ) : profileFormData.address} icon={<FaMapMarkerAlt />} />
            </Card>

            {/* Professional Info */}
            <Card title="Thông tin chuyên môn" icon={<FaGraduationCap />} color="purple">
              <InfoRow label="Kinh nghiệm" value={isEditing ? <input type="text" name="experience" value={profileFormData.experience} onChange={handleProfileInputChange} className="w-full border px-2 py-1 rounded-lg" /> : profileFormData.experience} />
              <InfoRow
                label="Chuyên môn"
                value={profileFormData.major === "Nurse" ? "Chuyên viên chăm sóc" :
                  profileFormData.major === "Specialist" ? "Chuyên viên tư vấn" : "-"}
              />
              <InfoRow label="Slogan" value={isEditing ? <input type="text" name="slogan" value={profileFormData.slogan} onChange={handleProfileInputChange} className="w-full border px-2 py-1 rounded-lg" /> : profileFormData.slogan} icon={<FaQuoteLeft />} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, icon, color, children }) => (
  <div className={`bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-2xl p-5 shadow`}>
    <h4 className={`flex items-center gap-2 text-lg font-semibold text-${color}-700 mb-4`}>{icon}{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, icon }) => (
  <div className="flex flex-col md:flex-row md:items-center md:gap-3">
    {icon && <div className="text-gray-500">{icon}</div>}
    <span className="text-sm font-medium text-gray-700 w-32">{label}</span>
    <div className="flex-1 text-gray-800">{value || 'N/A'}</div>
  </div>
);

export default NurseProfileTab;
