'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaUser, FaUsers, FaWallet } from 'react-icons/fa';

import { AuthContext } from '@/context/AuthContext';
import accountsService from '@/services/api/accountService';
import ProfileCard from './components/ProfileCard';

const TabNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: <FaUser />, href: '/profile' },
    { id: 'care-profiles', name: 'Hồ sơ người thân', icon: <FaUsers />, href: '/profile/patient' },
    { id: 'wallet', name: 'Ví điện tử', icon: <FaWallet />, href: '/wallet' },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(tab.href)}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${
            pathname === tab.href
              ? 'bg-white text-purple-600 border-b-2 border-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
};

const StatusDisplay = ({ type, message }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
    <div className="text-center">
      {type === 'loading' ? (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-600 text-lg">{message}</p>
        </>
      )}
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Đồng bộ dữ liệu hồ sơ mới nhất từ BE ngay khi vào trang
  useEffect(() => {
    const syncLatestProfile = async () => {
      try {
        if (user?.accountID) {
          const fresh = await accountsService.getAccount(user.accountID);
          updateUser(fresh);
        }
      } catch (e) {
        // bỏ qua lỗi để không chặn UI
      }
    };
    syncLatestProfile();
    // chỉ chạy khi có user id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accountID]);

  if (!user) {
    return <StatusDisplay type="loading" message="Đang tải thông tin tài khoản..." />;
  }

  const handleEditClick = () => {
    setEditData({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      avatarUrl: user.avatarUrl || '',
      email: user.email || '',
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = { ...user, ...editData };
      await accountsService.updateAccount(user.accountID, updatedData);

      const refreshedUser = await accountsService.getAccount(user.accountID);
      updateUser(refreshedUser); // ⚡ Trigger global update

      setIsEditing(false);
      setSuccess('Cập nhật thành công!');
    } catch (err) {
      console.error('Update error:', err);
      setError('Có lỗi khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const getRoleName = (roleID) => {
    const roles = {
      1: "Quản trị viên",
      2: "Y tá/Chuyên gia",
      3: "Quản lý",
      4: "Khách hàng"
    };
    return roles[roleID] || "Khác";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản và hồ sơ chăm sóc</p>
        </div>

        {/* Tabs */}
        <TabNavigation />

        {/* Success message */}
        {success && (
          <div className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg">
          <ProfileCard
            profile={user}
            isEditing={isEditing}
            editData={editData}
            onEditClick={handleEditClick}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            roleName={getRoleName(user.roleID)}
          />
        </div>
      </div>
    </div>
  );
}
