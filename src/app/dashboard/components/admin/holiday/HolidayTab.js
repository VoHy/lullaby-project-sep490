import React, { useEffect, useState } from 'react';
import holidayService from '@/services/api/holidayService';

const initialForm = {
  HolidayName: '',
  StartDate: '',
  EndDate: '',
};

const HolidayTab = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editHoliday, setEditHoliday] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    const data = await holidayService.getHolidays();
    setHolidays(data);
    setLoading(false);
  };

  const handleOpenModal = (holiday = null) => {
    setEditHoliday(holiday);
    setForm(holiday ? { ...holiday } : initialForm);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditHoliday(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editHoliday) {
      await holidayService.updateHoliday(editHoliday.HolidayID, form);
    } else {
      await holidayService.createHoliday(form);
    }
    await fetchHolidays();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await holidayService.deleteHoliday(id);
    setConfirmDelete(null);
    await fetchHolidays();
  };

  const filteredHolidays = holidays.filter(h =>
    h.HolidayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Quản lý Lịch nghỉ</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm ngày nghỉ..."
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
            onClick={() => handleOpenModal()}
          >
            Thêm Lịch nghỉ
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              <th className="p-3 text-left">Tên ngày nghỉ</th>
              <th className="p-3 text-left">Bắt đầu</th>
              <th className="p-3 text-left">Kết thúc</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Đang tải...</td></tr>
            ) : filteredHolidays.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">Không có ngày nghỉ nào</td></tr>
            ) : filteredHolidays.map(holiday => (
              <tr key={holiday.HolidayID} className="border-b hover:bg-pink-50">
                <td className="p-3 font-semibold">{holiday.HolidayName}</td>
                <td className="p-3">{new Date(holiday.StartDate).toLocaleDateString('vi-VN')}</td>
                <td className="p-3">{new Date(holiday.EndDate).toLocaleDateString('vi-VN')}</td>
                <td className="p-3 flex gap-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleOpenModal(holiday)}>Sửa</button>
                  <button className="text-red-600 hover:underline" onClick={() => setConfirmDelete(holiday.HolidayID)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4 relative" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-2">{editHoliday ? 'Sửa Lịch nghỉ' : 'Thêm Lịch nghỉ'}</h3>
            <input name="HolidayName" value={form.HolidayName} onChange={handleChange} required placeholder="Tên ngày nghỉ" className="w-full border rounded px-3 py-2" />
            <div className="flex gap-2">
              <input name="StartDate" type="date" value={form.StartDate?.slice(0,10) || ''} onChange={handleChange} required className="flex-1 border rounded px-3 py-2" />
              <input name="EndDate" type="date" value={form.EndDate?.slice(0,10) || ''} onChange={handleChange} required className="flex-1 border rounded px-3 py-2" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleCloseModal}>Hủy</button>
              <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow">Lưu</button>
            </div>
          </form>
        </div>
      )}
      {/* Xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs">
            <p className="mb-4">Bạn có chắc muốn xóa ngày nghỉ này?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setConfirmDelete(null)}>Hủy</button>
              <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold shadow" onClick={() => handleDelete(confirmDelete)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayTab; 