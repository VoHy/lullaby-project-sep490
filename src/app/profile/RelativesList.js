import React, { useState } from "react";

export default function RelativesList({ relatives, setRelatives, zones }) {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [form, setForm] = useState({
    Relative_Name: "",
    DateOfBirth: "",
    PhoneNumber: "",
    Address: "",
    Note: "",
    Gender: "",
    Status: "active",
    Image: "",
    ZoneID: ""
  });
  const [avatarPreview, setAvatarPreview] = useState("");

  // Thêm mới
  const handleAdd = (e) => {
    e.preventDefault();
    const nextId = relatives.length > 0 ? Math.max(...relatives.map(r => r.RelativeID)) + 1 : 1;
    const newRelative = {
      ...form,
      RelativeID: nextId,
      CreateAt: new Date().toISOString(),
    };
    setRelatives([...relatives, newRelative]);
    setShowAdd(false);
    setForm({ Relative_Name: "", DateOfBirth: "", PhoneNumber: "", Address: "", Note: "", Gender: "", Status: "active", Image: "", ZoneID: "" });
    setAvatarPreview("");
  };

  // Sửa
  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(relatives[index]);
    setAvatarPreview(relatives[index].Image || "");
    setShowEdit(true);
  };
  const handleEditSave = (e) => {
    e.preventDefault();
    const updated = [...relatives];
    updated[editIndex] = { ...form };
    setRelatives(updated);
    setShowEdit(false);
    setAvatarPreview("");
  };

  // Xóa
  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDelete(true);
  };
  const confirmDelete = () => {
    const updated = relatives.filter((_, i) => i !== deleteIndex);
    setRelatives(updated);
    setShowDelete(false);
    setDeleteIndex(null);
  };

  // Xử lý đổi ảnh đại diện
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

  // Form thêm mới
  const renderAddForm = () => (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-2xl" onClick={() => setShowAdd(false)} type="button">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-center pt-8 text-pink-600">Thêm hồ sơ con</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
          <div className="col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Họ và tên *</label>
              <input type="text" name="Relative_Name" value={form.Relative_Name} onChange={e => setForm(f => ({ ...f, Relative_Name: e.target.value }))} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
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
              <label className="block text-xs font-medium mb-1 text-gray-600">Giới tính</label>
              <select name="Gender" value={form.Gender} onChange={e => setForm(f => ({ ...f, Gender: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
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
            <button type="button" className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition" onClick={() => setShowAdd(false)}>Hủy</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 shadow transition">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );

  // Form sửa
  const renderEditForm = () => (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-2xl" onClick={() => setShowEdit(false)} type="button">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-center pt-8 text-pink-600">Sửa hồ sơ con</h2>
        <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
          <div className="col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Họ và tên *</label>
              <input type="text" name="Relative_Name" value={form.Relative_Name} onChange={e => setForm(f => ({ ...f, Relative_Name: e.target.value }))} required className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm" />
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
              <label className="block text-xs font-medium mb-1 text-gray-600">Giới tính</label>
              <select name="Gender" value={form.Gender} onChange={e => setForm(f => ({ ...f, Gender: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-pink-500 text-sm">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
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
  );

  // Popup xác nhận xóa
  const renderDeleteConfirm = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full relative">
        <button className="absolute top-2 right-2 text-xl text-gray-400 hover:text-pink-600" onClick={() => setShowDelete(false)}>&times;</button>
        <h2 className="text-xl font-bold text-pink-600 mb-4">Xác nhận xóa</h2>
        <div className="mb-4">Bạn có chắc chắn muốn xóa hồ sơ này không?</div>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition" onClick={() => setShowDelete(false)}>Hủy</button>
          <button className="px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition" onClick={confirmDelete}>Xóa</button>
        </div>
      </div>
    </div>
  );

  // Xem chi tiết
  const renderDetail = () => {
    if (!selected) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
          <button className="absolute top-2 right-2 text-xl text-gray-400 hover:text-pink-600" onClick={() => setSelected(null)}>&times;</button>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Chi tiết hồ sơ con</h2>
          <div className="mb-2"><span className="font-semibold">Tên: </span>{selected.Relative_Name}</div>
          <div className="mb-2"><span className="font-semibold">Ngày sinh: </span>{selected.DateOfBirth}</div>
          <div className="mb-2"><span className="font-semibold">Giới tính: </span>{selected.Gender}</div>
          <div className="mb-2"><span className="font-semibold">SĐT: </span>{selected.PhoneNumber}</div>
          <div className="mb-2"><span className="font-semibold">Địa chỉ: </span>{selected.Address}</div>
          <div className="mb-2"><span className="font-semibold">Zone: </span>{zones.find(z => z.zone_id == selected.ZoneID)?.zone_name || ""}</div>
          <div className="mb-2"><span className="font-semibold">Ghi chú: </span>{selected.Note}</div>
          <div className="mb-2"><span className="font-semibold">Trạng thái: </span>{selected.Status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-pink-600">Hồ sơ các con</h1>
        <button className="px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition" onClick={() => {
          setShowAdd(true);
          setForm({ Relative_Name: "", DateOfBirth: "", PhoneNumber: "", Address: "", Note: "", Gender: "", Status: "active", Image: "", ZoneID: "" });
          setAvatarPreview("");
        }}>Thêm hồ sơ con</button>
      </div>
      {relatives.length === 0 ? (
        <div className="text-gray-500">Chưa có hồ sơ con nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatives.map((r, idx) => (
            <div key={r.RelativeID} className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group relative">
              <img src={r.Image || "/images/avatar1.jpg"} alt={r.Relative_Name} className="w-20 h-20 rounded-full mb-2 object-cover" />
              <div className="font-bold text-lg mb-1">{r.Relative_Name}</div>
              <div className="text-gray-500 text-sm mb-1">Ngày sinh: {r.DateOfBirth}</div>
              <div className="text-gray-500 text-sm mb-1">Giới tính: {r.Gender}</div>
              <div className="text-gray-500 text-sm mb-1">Trạng thái: {r.Status}</div>
              <div className="absolute top-3 right-3 flex gap-2 opacity-100 group-hover:opacity-100">
                <button className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={e => {e.stopPropagation(); handleEdit(idx);}}>Sửa</button>
                <button className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition" onClick={e => {e.stopPropagation(); handleDelete(idx);}}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && renderDetail()}
      {showAdd && renderAddForm()}
      {showEdit && renderEditForm()}
      {showDelete && renderDeleteConfirm()}
    </div>
  );
} 