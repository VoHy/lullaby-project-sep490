"use client";
import { useEffect, useState, useContext } from "react";
import accountsService from '@/services/api/accountService'; // Giả sử bạn có service này để lấy Account
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import careProfileService from '@/services/api/careProfileService';
import { AuthContext } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [careProfiles, setCareProfiles] = useState([]);
  const [relativesList, setRelativesList] = useState([]);
  const [zones, setZones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', phone_number: '', avatar_url: '' });
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
      avatar_url: profile.avatar_url || ''
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
    return <div className="text-center mt-10">Đang tải thông tin tài khoản...</div>;
  }

  // Hiển thị thông báo khi không tìm thấy profile
  if (!profile) {
    return <div className="text-center mt-10">Không tìm thấy thông tin tài khoản.</div>;
  }

  const handleUpdateAccount = (newProfile) => {
    setProfile({ ...newProfile });
  };
  const handleUpdateRelatives = (newRelatives) => {
    setRelativesList(newRelatives);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Thông tin cá nhân: Luôn hiển thị cho mọi tài khoản */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-6 relative">
          {/* Nếu đang sửa thì hiện form */}
          {isEditing ? (
            <div className="w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input name="full_name" value={editData.full_name} onChange={handleInputChange} className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input name="phone_number" value={editData.phone_number} onChange={handleInputChange} className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input name="avatar_url" value={editData.avatar_url} onChange={handleInputChange} className="border rounded px-3 py-2 w-full" />
              </div>
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Lưu</button>
                <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Hủy</button>
              </div>
            </div>
          ) : (
            <>
              <img src={profile.avatar_url || "/images/avatar1.jpg"} alt={profile.full_name} className="w-20 h-20 rounded-full object-cover" />
              <div>
                <div className="font-bold text-xl mb-1">{profile.full_name}</div>
                <div className="text-gray-500 text-sm mb-1">SĐT: {profile.phone_number}</div>
                <div className="text-gray-500 text-sm mb-1">Email: {profile.email}</div>
                <div className="text-gray-500 text-sm mb-1">Trạng thái: {profile.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
                <div className="text-gray-500 text-sm mb-1">Vai trò: {profile.role_id === 3 ? "Con" : profile.role_id === 1 ? "Admin" : profile.role_id === 2 ? "Y tá/Chuyên gia" : profile.role_id === 4 ? "Quản lý" : "Khác"}</div>
              </div>
              <button onClick={handleEditClick} className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sửa thông tin</button>
            </>
          )}
        </div>
        {/* Chỉ hiển thị CareProfile và Relative nếu là tài khoản account (role_id === 3) */}
        {profile && profile.role_id === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Danh sách hồ sơ chăm sóc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careProfiles.length === 0 ? (
                <div className="text-gray-500">Bạn chưa có hồ sơ chăm sóc nào.</div>
              ) : (
                careProfiles.map(care => (
                  <div key={care.CareProfileID} className="border rounded-lg p-4 bg-gray-50 mb-6">
                    <div className="font-bold text-lg text-blue-700 mb-1">{care.ProfileName}</div>
                    <div className="text-sm text-gray-500 mb-1">Ngày sinh: {care.DateOfBirth || 'N/A'}</div>
                    <div className="text-sm text-gray-500 mb-1">Địa chỉ: {care.Address || 'N/A'}</div>
                    <div className="text-sm text-gray-500 mb-1">Zone: {(() => {
                      const z = zones.find(z => z.ZoneID === care.ZoneDetailID);
                      return z ? z.Zone_name : 'N/A';
                    })()}</div>
                    <div className="text-sm text-gray-500 mb-1">Ghi chú: {care.Notes || 'Không có'}</div>
                    <div className="text-sm text-gray-500 mb-1">Trạng thái: {care.Status}</div>
                    {/* Danh sách người thân của CareProfile này */}
                    <div className="mt-4">
                      <div className="font-semibold text-base mb-2">Con:</div>
                      {relativesList.filter(r => r.CareProfileID === care.CareProfileID).length === 0 ? (
                        <div className="text-gray-500 text-sm">Không có người thân nào.</div>
                      ) : (
                        relativesList.filter(r => r.CareProfileID === care.CareProfileID).map(r => (
                          <div key={r.RelativeID} className="border rounded p-2 mb-2 bg-white">
                            <div className="font-bold text-blue-600">{r.Relative_Name}</div>
                            <div className="text-xs text-gray-500">Ngày sinh: {r.DateOfBirth || 'N/A'}</div>
                            <div className="text-xs text-gray-500">Địa chỉ: {r.Address || 'N/A'}</div>
                            <div className="text-xs text-gray-500">Trạng thái: {r.Status}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}