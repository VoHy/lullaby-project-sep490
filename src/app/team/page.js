'use client';

import { useState } from 'react';

const nurses = [
  {
    id: 1,
    name: 'Nguyễn Thị A',
    role: 'Y tá trưởng',
    avatar: '/default-avatar.png',
    description: '10 năm kinh nghiệm chăm sóc bệnh nhân cao tuổi, tận tâm và chu đáo.',
    experience: '10 năm',
    specialty: 'Chăm sóc người cao tuổi',
  },
  {
    id: 2,
    name: 'Trần Văn B',
    role: 'Y tá',
    avatar: '/default-avatar.png',
    description: 'Chuyên môn cao, thân thiện, luôn hỗ trợ bệnh nhân hết mình.',
    experience: '7 năm',
    specialty: 'Chăm sóc hậu phẫu',
  }
];

const consultants = [
  {
    id: 3,
    name: 'Lê Thị C',
    role: 'Tư vấn viên sức khỏe',
    avatar: '/default-avatar.png',
    description: 'Tư vấn dinh dưỡng, tâm lý cho người cao tuổi và gia đình.',
    experience: '8 năm',
    specialty: 'Dinh dưỡng, tâm lý',
  },
  {
    id: 4,
    name: 'Phạm Văn D',
    role: 'Chuyên gia vật lý trị liệu',
    avatar: '/default-avatar.png',
    description: 'Hỗ trợ phục hồi chức năng, hướng dẫn tập luyện tại nhà.',
    experience: '12 năm',
    specialty: 'Vật lý trị liệu',
  }
];

const allMembers = [...nurses, ...consultants];

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ date: '', time: '', note: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleOpenDetail = (member) => {
    setSelectedMember(member);
    setShowBooking(false);
    setBookingSuccess(false);
  };

  const handleOpenBooking = () => {
    setShowBooking(true);
    setBookingInfo({ date: '', time: '', note: '' });
    setBookingSuccess(false);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Gửi booking tới backend ở đây nếu có
    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đội Ngũ</h1>
        <p className="text-gray-600 mb-8">Gặp gỡ các y tá và tư vấn viên tận tâm của Lullaby</p>

        {/* Nhóm Y tá */}
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 mt-8">Y tá</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nurses.map((nurse) => (
            <div key={nurse.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-lg transition" onClick={() => handleOpenDetail(nurse)}>
              <img src={nurse.avatar} alt={nurse.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{nurse.name}</h3>
                <p className="text-blue-600 font-medium">{nurse.role}</p>
                <p className="text-gray-600 mt-1 text-sm">{nurse.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nhóm Tư vấn viên */}
        <h2 className="text-2xl font-semibold text-pink-700 mb-4 mt-10">Tư vấn viên</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consultants.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-lg transition" onClick={() => handleOpenDetail(c)}>
              <img src={c.avatar} alt={c.name} className="w-20 h-20 rounded-full object-cover border-2 border-pink-200" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                <p className="text-pink-600 font-medium">{c.role}</p>
                <p className="text-gray-600 mt-1 text-sm">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal chi tiết thành viên */}
      {selectedMember && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedMember(null)}>&times;</button>
            <div className="flex flex-col items-center">
              <img src={selectedMember.avatar} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover border-2 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedMember.name}</h3>
              <p className="font-medium mb-2" style={{ color: selectedMember.role.includes('Tư vấn') ? '#db2777' : '#2563eb' }}>{selectedMember.role}</p>
              <p className="text-gray-600 text-center mb-2">{selectedMember.description}</p>
              <div className="flex gap-4 text-sm text-gray-500 mb-4">
                <span>Kinh nghiệm: <b>{selectedMember.experience}</b></span>
                <span>Chuyên môn: <b>{selectedMember.specialty}</b></span>
              </div>
              <button onClick={handleOpenBooking} className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 font-semibold">Đặt lịch</button>
            </div>
            {/* Modal booking */}
            {showBooking && (
              <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative animate-fadeIn">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowBooking(false)}>&times;</button>
                  <h4 className="text-lg font-bold mb-4 text-center">Đặt lịch với {selectedMember.name}</h4>
                  {bookingSuccess ? (
                    <div className="text-green-600 text-center font-semibold py-8">Đặt lịch thành công!</div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ngày</label>
                        <input type="date" name="date" value={bookingInfo.date} onChange={handleBookingChange} required className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Giờ</label>
                        <input type="time" name="time" value={bookingInfo.time} onChange={handleBookingChange} required className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú</label>
                        <textarea name="note" value={bookingInfo.note} onChange={handleBookingChange} rows={2} className="w-full px-3 py-2 border rounded" placeholder="Yêu cầu thêm (nếu có)" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Xác nhận đặt lịch</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 