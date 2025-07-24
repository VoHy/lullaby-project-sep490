import React, { useState } from "react";

export default function CareProfileInfo({ careProfile, zones, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(careProfile);
  const [avatarPreview, setAvatarPreview] = useState("");

  React.useEffect(() => {
    setForm(careProfile);
  }, [careProfile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setForm(f => ({ ...f, Image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(form);
    setShowEdit(false);
    setAvatarPreview("");
  };

  const zone = zones?.find(z => z.zone_id == careProfile.ZoneID);
  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-6 relative">
        <img src={careProfile.Image || "/images/avatar1.jpg"} alt={careProfile.Care_Name} className="w-20 h-20 rounded-full object-cover" />
        <div>
          <div className="font-bold text-xl mb-1">{careProfile.Care_Name}</div>
          <div className="text-gray-500 text-sm mb-1">Ngày sinh: {careProfile.DateOfBirth}</div>
          <div className="text-gray-500 text-sm mb-1">SĐT: {careProfile.PhoneNumber}</div>
          <div className="text-gray-500 text-sm mb-1">Địa chỉ: {careProfile.Address}</div>
          <div className="text-gray-500 text-sm mb-1">Zone: {zone ? `${zone.zone_name} - ${zone.city}` : ""}</div>
          <div className="text-gray-500 text-sm mb-1">Ghi chú: {careProfile.Note}</div>
          <div className="text-gray-500 text-sm mb-1">Trạng thái: {careProfile.Status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
        </div>
        <button className="absolute top-4 right-4 px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition" onClick={() => setShowEdit(true)}>Sửa</button>
      </div>
      {showEdit && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-2xl" onClick={() => setShowEdit(false)} type="button">&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-center pt-8 text-pink-600">Sửa thông tin mẹ</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
              <div className="col-span-1 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Họ và tên *</label>
                  <input type="text" name="Care_Name" value={form.Care_Name} onChange={e => setForm(f => ({ ...f, Care_Name: e.target.value }))} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Ngày sinh</label>
                  <input type="date" name="DateOfBirth" value={form.DateOfBirth} onChange={e => setForm(f => ({ ...f, DateOfBirth: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Số điện thoại</label>
                  <input type="tel" name="PhoneNumber" value={form.PhoneNumber} onChange={e => setForm(f => ({ ...f, PhoneNumber: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Địa chỉ</label>
                  <input type="text" name="Address" value={form.Address} onChange={e => setForm(f => ({ ...f, Address: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Zone</label>
                  <select name="ZoneID" value={form.ZoneID || ""} onChange={e => setForm(f => ({ ...f, ZoneID: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm">
                    <option value="">Chọn khu vực</option>
                    {zones.map(z => (
                      <option key={z.zone_id} value={z.zone_id}>{z.zone_name} - {z.city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-1 flex flex-col gap-4 justify-between">
                <div className="flex flex-col items-center gap-2 mb-2">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
                  <div className="relative w-24 h-24">
                    <img src={avatarPreview || form.Image || "/images/avatar1.jpg"} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-pink-200 mx-auto" />
                    <label className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-pink-600 transition" title="Đổi ảnh">
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                      </svg>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Ghi chú</label>
                  <input type="text" name="Note" value={form.Note} onChange={e => setForm(f => ({ ...f, Note: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Trạng thái</label>
                  <select name="Status" value={form.Status} onChange={e => setForm(f => ({ ...f, Status: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm">
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition" onClick={() => setShowEdit(false)}>Hủy</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 shadow transition">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 