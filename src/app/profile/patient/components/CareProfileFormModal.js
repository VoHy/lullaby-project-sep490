import React from 'react';

export default function CareProfileFormModal({ open, onClose, onSave, formData, onChange, onAvatarChange, loading, isEdit, zones = [], zoneDetails = [] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-center pt-8">{isEdit ? 'Sửa' : 'Thêm'}</h2>
        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
          <div className="col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Tên hồ sơ *</label>
              <input type="text" name="ProfileName" value={formData.ProfileName} onChange={onChange} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Ngày sinh</label>
              <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Số điện thoại</label>
              <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Địa chỉ</label>
              <input type="text" name="Address" value={formData.Address} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Zone</label>
              <select name="ZoneDetailID" value={formData.ZoneDetailID} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                {zoneDetails && zoneDetails.length > 0 ? zoneDetails.map(zd => {
                  const zone = zones.find(z => z.ZoneID === zd.ZoneID);
                  return (
                    <option key={zd.ZoneDetailID} value={zd.ZoneDetailID}>
                      {zone ? zone.Zone_name : 'Unknown Zone'} - {zd.Name}
                    </option>
                  );
                }) : <option value="">Chưa có zone</option>}
              </select>
              {formData.ZoneDetailID === 999 && (
                <div className="mt-2">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Tên quận tùy chỉnh</label>
                  <input 
                    type="text" 
                    name="CustomZoneName" 
                    value={formData.CustomZoneName || ''} 
                    onChange={onChange} 
                    placeholder="Nhập tên quận..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" 
                  />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-4 justify-between">
            <div className="flex flex-col items-center gap-2 mb-2">
              <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
              <div className="relative w-24 h-24">
                <img src={formData.Image || '/images/hero-bg.jpg'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mx-auto" />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-700 transition" title="Đổi ảnh">
                  <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                  </svg>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Ghi chú</label>
              <input type="text" name="Note" value={formData.Note} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Trạng thái</label>
              <select name="Status" value={formData.Status} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 rounded bg-gradient-to-r from-purple-200 to-pink-300 text-black font-semibold hover:bg-blue-700" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 