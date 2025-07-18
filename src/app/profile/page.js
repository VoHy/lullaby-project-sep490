"use client";
import { useEffect, useState } from "react";
import accountsService from '@/services/api/accountService'; // Giả sử bạn có service này để lấy Account
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import careProfileService from '@/services/api/careProfileService';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [careProfiles, setCareProfiles] = useState([]);
  const [relativesList, setRelativesList] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const currentAccountId = 1;
    accountsService.getAccount(currentAccountId).then(account => {
      setProfile(account);
      careProfileService.getCareProfiles().then(careProfiles => {
        // Lấy các care profile thuộc account này
        const myCareProfiles = careProfiles.filter(c => c.AccountID === currentAccountId);
        setCareProfiles(myCareProfiles);
        relativesService.getRelatives().then(relatives => {
          setRelativesList(relatives);
        });
      });
    });
    zoneService.getZones().then(setZones);
  }, []);

  const handleUpdateAccount = (newProfile) => {
    setProfile({ ...newProfile });
  };
  const handleUpdateRelatives = (newRelatives) => {
    setRelativesList(newRelatives);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Thông tin tài khoản */}
        {profile && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-6 relative">
            <img src={profile.avatar_url || "/images/avatar1.jpg"} alt={profile.full_name} className="w-20 h-20 rounded-full object-cover" />
            <div>
              <div className="font-bold text-xl mb-1">{profile.full_name}</div>
              <div className="text-gray-500 text-sm mb-1">SĐT: {profile.phone_number}</div>
              <div className="text-gray-500 text-sm mb-1">Email: {profile.email}</div>
              <div className="text-gray-500 text-sm mb-1">Trạng thái: {profile.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
              <div className="text-gray-500 text-sm mb-1">Vai trò: {profile.role_id === 3 ? "Người thân" : profile.role_id === 1 ? "Admin" : profile.role_id === 2 ? "Y tá/Chuyên gia" : profile.role_id === 4 ? "Quản lý" : "Khác"}</div>
            </div>
            {/* Có thể thêm nút sửa thông tin tài khoản ở đây nếu muốn */}
          </div>
        )}
        {/* Nếu là người thân thì hiển thị danh sách CareProfile và relatives của từng CareProfile */}
        {profile && profile.role_id === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Danh sách hồ sơ chăm sóc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careProfiles.length === 0 ? (
                <div className="text-gray-500">Bạn chưa có hồ sơ chăm sóc nào.</div>
              ) : (
                careProfiles.map(care => (
                  <div key={care.CareID} className="border rounded-lg p-4 bg-gray-50 mb-6">
                    <div className="font-bold text-lg text-blue-700 mb-1">{care.Care_Name}</div>
                    <div className="text-sm text-gray-500 mb-1">Ngày sinh: {care.DateOfBirth || 'N/A'}</div>
                    <div className="text-sm text-gray-500 mb-1">Địa chỉ: {care.Address || 'N/A'}</div>
                    <div className="text-sm text-gray-500 mb-1">Zone: {(() => {
                      const z = zones.find(z => z.ZoneID === care.ZoneDetailID);
                      return z ? z.Zone_name : 'N/A';
                    })()}</div>
                    <div className="text-sm text-gray-500 mb-1">Ghi chú: {care.Notes || 'Không có'}</div>
                    <div className="text-xs text-gray-400">Ngày tạo: {care.CreatedAt ? new Date(care.CreatedAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
                    <div className="text-xs text-gray-400">Trạng thái: {care.Status}</div>
                    {/* Danh sách người thân của CareProfile này */}
                    <div className="mt-4">
                      <div className="font-semibold text-base mb-2">Người thân:</div>
                      {relativesList.filter(r => r.CareID === care.CareID).length === 0 ? (
                        <div className="text-gray-500 text-sm">Không có người thân nào.</div>
                      ) : (
                        relativesList.filter(r => r.CareID === care.CareID).map(r => (
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