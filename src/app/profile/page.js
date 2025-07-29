"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaUsers, FaWallet } from "react-icons/fa";
import accountsService from '@/services/api/accountService';
import { AuthContext } from "@/context/AuthContext";
import ProfileCard from './components/ProfileCard';

// Component TabNavigation chuyển route
const TabNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    {
      id: 'profile',
      name: 'Thông tin cá nhân',
      icon: <FaUser className="text-sm" />,
      href: '/profile',
      active: pathname === '/profile',
    },
    {
      id: 'care-profiles',
      name: 'Hồ sơ người thân',
      icon: <FaUsers className="text-sm" />,
      href: '/profile/patient',
      active: pathname === '/profile/patient',
    },
    {
      id: 'wallet',
      name: 'Ví điện tử',
      icon: <FaWallet className="text-sm" />,
      href: '/wallet',
      active: pathname === '/wallet',
    }
  ];
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(tab.href)}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${
            tab.active
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
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function để lấy role name
  const getRoleName = (roleId) => {
    const roles = {
      1: "Quản trị viên",
      2: "Y tá/Chuyên gia", 
      3: "Người thân",
      4: "Quản lý"
    };
    return roles[roleId] || "Khác";
  };

  useEffect(() => {
    if (!user) return;
    const loadProfileData = async () => {
      try {
        console.log('Loading profile for user:', user);
        const accountId = user.accountID || user.AccountID;
        console.log('Account ID:', accountId);
        
        if (!accountId) {
          console.error('No account ID found in user object');
          setError('Không tìm thấy ID tài khoản');
          return;
        }
        
        const account = await accountsService.getAccount(accountId);
        console.log('Loaded account:', account);
        setProfile(account);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Không thể tải thông tin tài khoản');
      }
    };
    loadProfileData();
  }, [user]);

  const handleEditClick = () => {
    setEditData({
      fullName: profile.fullName || profile.full_name || '',
      phoneNumber: profile.phoneNumber || profile.phone_number || '',
      avatarUrl: profile.avatarUrl || profile.avatar_url || '',
      email: profile.email || ''
    });
    setIsEditing(true);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const accountId = profile.accountID || profile.AccountID;
      const updated = await accountsService.updateAccount(accountId, editData);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setError('Có lỗi khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  if (!user) {
    return <StatusDisplay type="loading" message="Đang tải thông tin tài khoản..." />;
  }
  if (!profile) {
    return <StatusDisplay type="error" message="Không tìm thấy thông tin tài khoản." />;
  }

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
        {/* Tab Navigation */}
        <TabNavigation />
        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg">
          <ProfileCard
            profile={profile}
            isEditing={isEditing}
            editData={editData}
            onEditClick={handleEditClick}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            roleName={getRoleName(profile.roleID || profile.role_id)}
          />
        </div>
      </div>
    </div>
  );
}