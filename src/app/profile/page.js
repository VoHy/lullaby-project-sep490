"use client";
import { useEffect, useState, useContext } from "react";
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt, FaMapMarkerAlt, FaStickyNote, FaUsers } from "react-icons/fa";
import accountsService from '@/services/api/accountService';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import careProfileService from '@/services/api/careProfileService';
import { AuthContext } from "@/context/AuthContext";
import ProfileCard from './components/ProfileCard';
import CareProfileList from './components/CareProfileList';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [careProfiles, setCareProfiles] = useState([]);
  const [relativesList, setRelativesList] = useState([]);
  const [zones, setZones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // Thêm email vào editData
  const [editData, setEditData] = useState({ full_name: '', phone_number: '', avatar_url: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy thông tin tài khoản và các dữ liệu liên quan
  useEffect(() => {
    if (!user) return;
    const currentAccountId = user.AccountID;
    accountsService.getAccount(currentAccountId).then(account => {
      setProfile(account);
      // Nếu là tài khoản account (role_id === 3) thì lấy thêm CareProfile và Relative
      if (user.role_id === 3) {
        careProfileService.getCareProfiles().then(careProfiles => {
          const myCareProfiles = careProfiles.filter(c => c.AccountID === currentAccountId);
          setCareProfiles(myCareProfiles);
          relativesService.getRelatives().then(relatives => {
            setRelativesList(relatives);
          });
        });
      } else {
        setCareProfiles([]);
        setRelativesList([]);
      }
    });
    zoneService.getZones().then(setZones);
  }, [user]);

  // Khi bấm nút sửa, set dữ liệu form
  const handleEditClick = () => {
    setEditData({
      full_name: profile.full_name || '',
      phone_number: profile.phone_number || '',
      avatar_url: profile.avatar_url || '',
      email: profile.email || ''
    });
    setIsEditing(true);
    setError('');
  };

  // Khi thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Khi lưu thông tin
  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const updated = await accountsService.updateAccount(profile.AccountID, editData);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setError('Có lỗi khi cập nhật.');
    }
    setLoading(false);
  };

  // Khi hủy
  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  // Hiển thị loading khi chưa có user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo khi không tìm thấy profile
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-600 text-lg">Không tìm thấy thông tin tài khoản.</p>
        </div>
      </div>
    );
  }

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1: return "Quản trị viên";
      case 2: return "Y tá/Chuyên gia";
      case 3: return "Người thân";
      case 4: return "Quản lý";
      default: return "Khác";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản và hồ sơ chăm sóc</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
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
              getRoleName={getRoleName}
            />
          </div>
          <div className="lg:col-span-2">
            {profile && profile.role_id === 3 && (
              <CareProfileList
                careProfiles={careProfiles}
                relativesList={relativesList}
                zones={zones}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}