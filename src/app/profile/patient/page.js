'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth/authService';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import careProfileService from '@/services/api/careProfileService';

export default function RelativesProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relativesList, setRelativesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editRelative, setEditRelative] = useState(null);
  const [currentCareID, setCurrentCareID] = useState(null);
  const [showCareProfileForm, setShowCareProfileForm] = useState(false);
  const [careProfileForm, setCareProfileForm] = useState({
    ProfileName: '',
    DateOfBirth: '',
    PhoneNumber: '',
    Address: '',
    ZoneDetailID: 1,
    Note: '',
    Status: 'active',
    Image: '',
  });
  const [careProfileAvatar, setCareProfileAvatar] = useState('');
  const [careProfileAvatarFile, setCareProfileAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    Relative_Name: '',
    DateOfBirth: '',
    Gender: '',
    Note: '',
    Status: 'active',
    Image: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [zones, setZones] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  // CareProfile edit/delete state
  const [editCareProfile, setEditCareProfile] = useState(null);
  const [showEditCareProfileForm, setShowEditCareProfileForm] = useState(false);
  const [deleteCareProfileId, setDeleteCareProfileId] = useState(null);
  // Relatives edit/delete state
  const [editRelativeIndex, setEditRelativeIndex] = useState(null);
  const [showDeleteRelativeId, setShowDeleteRelativeId] = useState(null);
  // Filter state for CareProfile
  const [careProfileFilter, setCareProfileFilter] = useState('all');
  // State cho filter Relatives theo CareProfileID
  const [relativesFilter, setRelativesFilter] = useState({});

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    careProfileService.getCareProfiles().then(careProfiles => {
      // Lấy các care profile thuộc account này
      const myCareProfiles = careProfiles.filter(c => c.AccountID === currentUser.AccountID);
      setCareProfiles(myCareProfiles);
    relativesService.getRelatives().then(relatives => {
        setRelativesList(relatives);
      });
    });
    zoneService.getZones().then(setZones);
    setLoading(false);
  }, [router]);

  const handleOpenForm = (relative = null, careProfileID = null) => {
    setEditRelative(relative);
    setShowForm(true);
    setCurrentCareID(careProfileID);
    if (relative) {
      setFormData({
        Relative_Name: relative.Relative_Name || '',
        DateOfBirth: relative.DateOfBirth || '',
        Gender: relative.Gender || '',
        Note: relative.Note || '',
        Status: relative.Status || 'active',
        Image: relative.Image || '',
      });
      setAvatarPreview(relative.Image || '');
    } else {
      setFormData({
        Relative_Name: '',
        DateOfBirth: '',
        Gender: '',
        Note: '',
        Status: 'active',
        Image: '',
      });
      setAvatarPreview('');
    }
    setAvatarFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    let newList = [...relativesList];
    let image = avatarFile ? avatarPreview : formData.Image;
    const now = new Date().toISOString();
    if (editRelative) {
      // Sửa
      newList = newList.map(r =>
        r.RelativeID === editRelative.RelativeID
          ? { ...r, ...formData, Image: image }
          : r
      );
    } else {
      // Thêm mới
      const newRelative = {
        ...formData,
        Image: image,
        RelativeID: Math.max(0, ...newList.map(r => r.RelativeID || 0)) + 1,
        CareProfileID: currentCareID,
        CreateAt: now,
      };
      newList.push(newRelative);
    }
    setRelativesList(newList);
    setShowForm(false);
    setEditRelative(null);
    setCurrentCareID(null);
    setFormData({
      Relative_Name: '',
      DateOfBirth: '',
      Gender: '',
      Note: '',
      Status: 'active',
      Image: '',
    });
    setAvatarPreview('');
    setAvatarFile(null);
  };

  const handleDelete = (relativeId) => {
    setRelativesList(relativesList.filter(r => r.relative_id !== relativeId));
    setConfirmDelete(null);
  };

  const handleOpenCareProfileForm = () => {
    setShowCareProfileForm(true);
    setCareProfileForm({
      ProfileName: '',
      DateOfBirth: '',
      PhoneNumber: '',
      Address: '',
      ZoneDetailID: 1,
      Note: '',
      Status: 'active',
      Image: '',
    });
    setCareProfileAvatar('');
    setCareProfileAvatarFile(null);
  };

  const handleCareProfileInputChange = (e) => {
    const { name, value } = e.target;
    setCareProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCareProfileAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCareProfileAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCareProfileAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCareProfile = (e) => {
    e.preventDefault();
    let newList = [...careProfiles];
    let image = careProfileAvatarFile ? careProfileAvatar : careProfileForm.Image;
    const now = new Date().toISOString();
    const newCareProfile = {
      ...careProfileForm,
      Image: image,
      CareProfileID: Math.max(0, ...newList.map(c => c.CareProfileID || 0)) + 1,
      AccountID: user.AccountID,
      CreateAt: now,
    };
    newList.push(newCareProfile);
    setCareProfiles(newList);
    setShowCareProfileForm(false);
    setCareProfileForm({
      ProfileName: '',
      DateOfBirth: '',
      PhoneNumber: '',
      Address: '',
      ZoneDetailID: 1,
      Note: '',
      Status: 'active',
      Image: '',
    });
    setCareProfileAvatar('');
    setCareProfileAvatarFile(null);
  };

  // Mở form sửa CareProfile
  const handleEditCareProfile = (care) => {
    setEditCareProfile(care);
    setShowEditCareProfileForm(true);
    setCareProfileForm({
      ProfileName: care.ProfileName,
      DateOfBirth: care.DateOfBirth,
      PhoneNumber: care.PhoneNumber,
      Address: care.Address,
      ZoneDetailID: care.ZoneDetailID,
      Note: care.Note,
      Status: care.Status,
      Image: care.Image,
    });
    setCareProfileAvatar(care.Image || '');
    setCareProfileAvatarFile(null);
  };

  // Lưu sửa CareProfile
  const handleUpdateCareProfile = (e) => {
    e.preventDefault();
    let newList = [...careProfiles];
    let image = careProfileAvatarFile ? careProfileAvatar : careProfileForm.Image;
    const updated = {
      ...editCareProfile,
      ...careProfileForm,
      Image: image,
    };
    newList = newList.map(c => c.CareProfileID === editCareProfile.CareProfileID ? updated : c);
    setCareProfiles(newList);
    setShowEditCareProfileForm(false);
    setEditCareProfile(null);
    setCareProfileForm({
      ProfileName: '',
      DateOfBirth: '',
      PhoneNumber: '',
      Address: '',
      ZoneDetailID: 1,
      Note: '',
      Status: 'active',
      Image: '',
    });
    setCareProfileAvatar('');
    setCareProfileAvatarFile(null);
  };

  // Xóa CareProfile
  const handleDeleteCareProfile = (id) => {
    setDeleteCareProfileId(id);
  };
  const confirmDeleteCareProfile = () => {
    setCareProfiles(careProfiles.filter(c => c.CareProfileID !== deleteCareProfileId));
    setDeleteCareProfileId(null);
  };
  const cancelDeleteCareProfile = () => setDeleteCareProfileId(null);

  // Sửa Relatives
  const handleEditRelative = (relative, index) => {
    setEditRelative(relative);
    setEditRelativeIndex(index);
    setShowForm(true);
    setCurrentCareID(relative.CareProfileID);
    setFormData({
      Relative_Name: relative.Relative_Name,
      DateOfBirth: relative.DateOfBirth,
      Gender: relative.Gender,
      Note: relative.Note,
      Status: relative.Status,
      Image: relative.Image,
    });
    setAvatarPreview(relative.Image || '');
    setAvatarFile(null);
  };

  // Lưu sửa Relatives
  const handleUpdateRelative = (e) => {
    e.preventDefault();
    let newList = [...relativesList];
    let image = avatarFile ? avatarPreview : formData.Image;
    const updated = {
      ...editRelative,
      ...formData,
      Image: image,
    };
    newList[editRelativeIndex] = updated;
    setRelativesList(newList);
    setShowForm(false);
    setEditRelative(null);
    setEditRelativeIndex(null);
    setCurrentCareID(null);
    setFormData({
      Relative_Name: '',
      DateOfBirth: '',
      Gender: '',
      Note: '',
      Status: 'active',
      Image: '',
    });
    setAvatarPreview('');
    setAvatarFile(null);
  };

  // Xóa Relatives
  const handleDeleteRelative = (id) => {
    setShowDeleteRelativeId(id);
  };
  const confirmDeleteRelative = () => {
    setRelativesList(relativesList.filter(r => r.RelativeID !== showDeleteRelativeId));
    setShowDeleteRelativeId(null);
  };
  const cancelDeleteRelative = () => setShowDeleteRelativeId(null);

  function getZoneName(zone_id) {
    const z = zones.find(z => z.zone_id === zone_id);
    return z ? z.name : 'N/A';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter All/Active */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <label className="font-semibold mr-2">Lọc hồ sơ:</label>
            <select
              className="px-3 py-2 rounded border border-gray-300 focus:outline-pink-500"
              value={careProfileFilter}
              onChange={e => setCareProfileFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
            </select>
          </div>
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-purple-100 to-pink-200 text-black font-semibold hover:bg-blue-700"
            onClick={handleOpenCareProfileForm}
          >
            + Thêm Hồ Sơ Người Thân
          </button>
        </div>
        {/* Hiển thị hồ sơ chăm sóc và người thân liên kết */}
        {(() => {
          // Lọc theo filter
          let filtered = careProfiles;
          if (careProfileFilter === 'active') {
            filtered = careProfiles.filter(c => c.Status === 'active');
          }
          if (filtered.length === 0) {
            return <div className="text-gray-500">Bạn chưa có hồ sơ chăm sóc nào.</div>;
          }
          return (
            <div className="flex flex-col gap-6">
              {filtered.map(care => (
                <div key={care.CareID} className="bg-white shadow rounded-lg p-6 mb-8">
                  <div className="flex gap-6 items-center mb-4">
                    <img src={care.Image || '/default-avatar.png'} alt={care.Care_Name} className="w-24 h-24 rounded-full object-cover border-2 border-blue-200" />
                    <div>
                      <div className="font-bold text-lg text-blue-700 mb-1">{care.ProfileName}</div>
                      <div className="text-gray-500 text-sm mb-1">Ngày sinh: {care.DateOfBirth || 'N/A'}</div>
                      <div className="text-gray-500 text-sm mb-1">Địa chỉ: {care.Address || 'N/A'}</div>
                      <div className="text-gray-500 text-sm mb-1">Zone: {(() => {
                        const z = zones.find(z => z.ZoneID === care.ZoneDetailID);
                        return z ? z.Zone_name : 'N/A';
                      })()}</div>
                      <div className="text-gray-500 text-sm mb-1">Ghi chú: {care.Notes || 'Không có'}</div>
                      <div className="text-sm text-gray-400">Trạng thái: {care.Status}</div>
                    </div>
                  </div>
                  {/* Button thêm người thân */}
                  <div className="mb-2 flex gap-2">
            <button
              className="px-4 py-2 rounded bg-gradient-to-r from-pink-100 to-rose-200 text-black font-semibold hover:bg-blue-700"
                      onClick={() => handleOpenForm(null, care.CareProfileID)}
            >
              + Thêm người thân
            </button>
                    <button
                      className="px-4 py-2 rounded bg-gradient-to-r from-yellow-100 to-yellow-300 text-black font-semibold hover:bg-yellow-400"
                      onClick={() => handleEditCareProfile(care)}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-gradient-to-r from-red-100 to-red-300 text-black font-semibold hover:bg-red-400"
                      onClick={() => handleDeleteCareProfile(care.CareProfileID)}
                    >
                      Xóa
                    </button>
                  </div>
                  {/* Danh sách người thân của CareProfile này */}
                  <div className="mt-4">
                    <div className="font-semibold text-base mb-2 flex items-center gap-2">
                      Con:
                      <select
                        className="ml-2 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-pink-500"
                        value={relativesFilter[care.CareID] || 'all'}
                        onChange={e => setRelativesFilter(f => ({...f, [care.CareID]: e.target.value}))}
                      >
                        <option value="all">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
                    {(() => {
                      let rels = relativesList.filter(r => r.CareID === care.CareID);
                      const filter = relativesFilter[care.CareID] || 'all';
                      if (filter === 'active') rels = rels.filter(r => r.Status === 'active');
                      if (filter === 'inactive') rels = rels.filter(r => r.Status === 'inactive');
                      if (rels.length === 0) return <div className="text-gray-500 text-sm">Không có người thân nào.</div>;
                      return rels.map((r, idx) => (
                        <div key={r.RelativeID} className="border rounded p-2 mb-2 bg-gray-50 flex gap-4 items-center relative">
                          <img src={r.Image || '/default-avatar.png'} alt={r.Relative_Name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
                          <div>
                            <div className="font-bold text-blue-600">{r.Relative_Name}</div>
                            <div className="text-xs text-gray-500">Ngày sinh: {r.DateOfBirth || 'N/A'}</div>
                            <div className="text-xs text-gray-500">Trạng thái: {r.Status}</div>
                            <div className="flex gap-2 mt-1">
                              <button className="px-2 py-1 rounded bg-yellow-100 text-black text-xs font-semibold hover:bg-yellow-300" onClick={() => handleEditRelative(r, relativesList.findIndex(x => x.RelativeID === r.RelativeID))}>Sửa</button>
                              <button className="px-2 py-1 rounded bg-red-100 text-black text-xs font-semibold hover:bg-red-300" onClick={() => handleDeleteRelative(r.RelativeID)}>Xóa</button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Form thêm/sửa người thân */}
        {showForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowForm(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-2 text-center pt-8">{editRelative ? 'Sửa thông tin người thân' : 'Thêm người thân mới'}</h2>
              <form onSubmit={editRelative ? handleUpdateRelative : handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
                <div className="col-span-1 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Họ và tên *</label>
                    <input type="text" name="Relative_Name" value={formData.Relative_Name} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ngày sinh</label>
                    <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Giới tính</label>
                    <select name="Gender" value={formData.Gender} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ghi chú</label>
                    <input type="text" name="Note" value={formData.Note} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                </div>
                <div className="col-span-1 flex flex-col gap-4 justify-between">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
                    <div className="relative w-24 h-24">
                      <img src={avatarPreview || '/default-avatar.png'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mx-auto" />
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-700 transition" title="Đổi ảnh">
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Trạng thái</label>
                    <select name="Status" value={formData.Status} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 rounded bg-gradient-to-r from-pink-100 to-rose-200 text-black font-semibold hover:bg-blue-700">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Form thêm hồ sơ người thân */}
        {showCareProfileForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowCareProfileForm(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-2 text-center pt-8">Thêm Hồ Sơ Người Thân</h2>
              <form onSubmit={handleSaveCareProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
                <div className="col-span-1 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Tên hồ sơ *</label>
                    <input type="text" name="ProfileName" value={careProfileForm.ProfileName} onChange={handleCareProfileInputChange} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ngày sinh</label>
                    <input type="date" name="DateOfBirth" value={careProfileForm.DateOfBirth} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Số điện thoại</label>
                    <input type="text" name="PhoneNumber" value={careProfileForm.PhoneNumber} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Địa chỉ</label>
                    <input type="text" name="Address" value={careProfileForm.Address} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Zone</label>
                    <select name="ZoneDetailID" value={careProfileForm.ZoneDetailID} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                      {zones.map(z => (
                        <option key={z.ZoneID} value={z.ZoneID}>{z.Zone_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-1 flex flex-col gap-4 justify-between">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
                    <div className="relative w-24 h-24">
                      <img src={careProfileAvatar || '/default-avatar.png'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mx-auto" />
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-700 transition" title="Đổi ảnh">
                        <input type="file" accept="image/*" onChange={handleCareProfileAvatarChange} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ghi chú</label>
                    <input type="text" name="Note" value={careProfileForm.Note} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Trạng thái</label>
                    <select name="Status" value={careProfileForm.Status} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 rounded bg-gradient-to-r from-purple-200 to-pink-300 text-black font-semibold hover:bg-blue-700">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Popup xác nhận xóa */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs relative animate-fadeIn">
              <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
              <p>Bạn có chắc chắn muốn xóa người thân này?</p>
              <div className="flex justify-end gap-2 mt-6">
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setConfirmDelete(null)}>Hủy</button>
                <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700" onClick={() => handleDelete(confirmDelete)}>Xóa</button>
              </div>
            </div>
          </div>
        )}
        {deleteCareProfileId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full relative">
              <button className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-600" onClick={cancelDeleteCareProfile}>&times;</button>
              <h2 className="text-xl font-bold text-red-600 mb-4">Xác nhận xóa</h2>
              <div className="mb-4">Bạn có chắc chắn muốn xóa hồ sơ này không?</div>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition" onClick={cancelDeleteCareProfile}>Hủy</button>
                <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition" onClick={confirmDeleteCareProfile}>Xóa</button>
              </div>
            </div>
          </div>
        )}
        {showEditCareProfileForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowEditCareProfileForm(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-2 text-center pt-8">Sửa Hồ Sơ Người Thân</h2>
              <form onSubmit={handleUpdateCareProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
                <div className="col-span-1 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Tên hồ sơ *</label>
                    <input type="text" name="ProfileName" value={careProfileForm.ProfileName} onChange={handleCareProfileInputChange} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ngày sinh</label>
                    <input type="date" name="DateOfBirth" value={careProfileForm.DateOfBirth} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Số điện thoại</label>
                    <input type="text" name="PhoneNumber" value={careProfileForm.PhoneNumber} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Địa chỉ</label>
                    <input type="text" name="Address" value={careProfileForm.Address} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Zone</label>
                    <select name="ZoneDetailID" value={careProfileForm.ZoneDetailID} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                      {zones.map(z => (
                        <option key={z.ZoneID} value={z.ZoneID}>{z.Zone_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-1 flex flex-col gap-4 justify-between">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
                    <div className="relative w-24 h-24">
                      <img src={careProfileAvatar || '/default-avatar.png'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mx-auto" />
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-700 transition" title="Đổi ảnh">
                        <input type="file" accept="image/*" onChange={handleCareProfileAvatarChange} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Ghi chú</label>
                    <input type="text" name="Note" value={careProfileForm.Note} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Trạng thái</label>
                    <select name="Status" value={careProfileForm.Status} onChange={handleCareProfileInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 rounded bg-gradient-to-r from-purple-200 to-pink-300 text-black font-semibold hover:bg-blue-700">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDeleteRelativeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full relative">
              <button className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-600" onClick={cancelDeleteRelative}>&times;</button>
              <h2 className="text-xl font-bold text-red-600 mb-4">Xác nhận xóa</h2>
              <div className="mb-4">Bạn có chắc chắn muốn xóa người thân này không?</div>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition" onClick={cancelDeleteRelative}>Hủy</button>
                <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition" onClick={confirmDeleteRelative}>Xóa</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 