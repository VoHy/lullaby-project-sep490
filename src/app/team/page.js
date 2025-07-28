'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import nursingSpecialistService from '@/services/nurse/nursingSpecialistService';
import zones from '@/mock/Zone';
import customerTasks from '@/mock/CustomerTask';
import bookings from '@/mock/Booking';
import feedbacks from '@/mock/Feedback';
import serviceTasks from '@/mock/ServiceTask';

export default function TeamPage() {
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
  }, []);

  // Phân biệt Y tá và Chuyên gia
  const nurses = nursingSpecialists.filter(m => m.Major && m.Major.toLowerCase().includes('y tá'));
  const specialists = nursingSpecialists.filter(m => m.Major && !m.Major.toLowerCase().includes('y tá'));

  // Map Address hoặc ZoneID sang Zone_name
  const getZoneName = (addressOrZoneID) => {
    if (!addressOrZoneID) return '';
    if (typeof addressOrZoneID === 'string') {
      const found = zones.find(z => z.City === addressOrZoneID || z.Zone_name === addressOrZoneID);
      return found ? found.Zone_name : addressOrZoneID;
    }
    if (typeof addressOrZoneID === 'number') {
      const found = zones.find(z => z.ZoneID === addressOrZoneID);
      return found ? found.Zone_name : addressOrZoneID;
    }
    return addressOrZoneID;
  };
  // Lọc theo zone và search
  const filterMember = (member) => {
    let memberZone = '';
    if (member.ZoneID) {
      const zoneObj = zones.find(z => z.ZoneID === member.ZoneID);
      memberZone = zoneObj ? zoneObj.Zone_name.toLowerCase().trim() : '';
    } else {
      memberZone = getZoneName(member.Address)?.toLowerCase().trim();
    }
    const selectedZoneName = selectedZone?.toLowerCase().trim();
    const zoneMatch = selectedZone === 'all' || memberZone === selectedZoneName;
    const searchMatch = !searchText || (
      (member.FullName || member.Nurse_Name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (member.Address || '').toLowerCase().includes(searchText.toLowerCase())
    );
    return zoneMatch && searchMatch;
  };
  const filteredNurses = nurses.filter(filterMember);
  const filteredSpecialists = specialists.filter(filterMember);
  // Lấy danh sách zone unique
  const allZoneNames = Array.from(new Set(zones.map(z => z.Zone_name)));

  // Lấy số ca hoàn thành cho mỗi member
  const getCompletedCases = (nursingID) => {
    const tasks = customerTasks.filter(t => t.NursingID === nursingID);
    const bookingIDs = [...new Set(tasks.map(t => t.BookingID))];
    return bookingIDs.filter(bid => {
      const b = bookings.find(bk => bk.BookingID === bid);
      return b && b.Status === 'completed';
    }).length;
  };

  const handleViewDetail = (member) => {
    setDetailData(member);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  // Card member (dùng cho cả Y tá và Chuyên gia)
  const MemberCard = ({ member, onViewDetail }) => (
    <motion.div
      key={member.NursingID}
      className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-xl transition group relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <img
        src={member.avatar_url || '/images/hero-bg.jpg'}
        alt={member.FullName || member.Nurse_Name}
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pink-200 group-hover:scale-105 transition"
      />
      <h3 className="text-lg font-bold text-blue-700 mb-1 flex items-center gap-2">
        {member.FullName || member.Nurse_Name}
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${member.Major && member.Major.toLowerCase().includes('y tá') ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{member.Major}</span>
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-400 text-lg">★</span>
        <span className="text-sm font-semibold text-gray-700">{member.Rating || '5.0'}</span>
        <span className="text-xs text-gray-400">({getCompletedCases(member.NursingID)} ca hoàn thành)</span>
      </div>
      <p className="text-gray-600 text-center text-sm mb-2">Kinh nghiệm: {member.Experience} năm</p>
      <p className="text-gray-500 text-xs mb-2 italic">{member.Slogan}</p>
      <button onClick={() => onViewDetail(member)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded hover:shadow-lg mt-2">Xem chi tiết</button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">Đội ngũ Y tá & Chuyên gia</h1>
        <p className="text-center text-gray-600 mb-8">Danh sách đội ngũ y tá, chuyên gia, tư vấn viên của Lullaby</p>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <label className="font-medium text-gray-700 mr-2">Khu vực:</label>
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả khu vực</option>
            {allZoneNames.map((z, idx) => (
              <option key={idx} value={z}>{z}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="ml-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 min-w-[220px]"
          />
        </div>
        <h2 className="text-2xl font-bold text-purple-700 mb-4 mt-8">Y tá</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredNurses.map((member, idx) => (
            <MemberCard key={member.NursingID} member={member} onViewDetail={handleViewDetail} />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-pink-700 mb-4 mt-12">Chuyên gia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredSpecialists.map((member, idx) => (
            <MemberCard key={member.NursingID} member={member} onViewDetail={handleViewDetail} />
          ))}
        </div>
        {/* Popup chi tiết */}
        {showDetail && detailData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-pink-300 overflow-hidden mb-2">
                  <img src={detailData.avatar_url || '/images/hero-bg.jpg'} alt="avatar" className="object-cover w-full h-full" />
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1">{detailData.FullName || detailData.Nurse_Name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${detailData.Status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{detailData.Status || 'Không có'}</span>
              </div>
              {/* Tabs nhỏ */}
              <div className="flex gap-4 mb-4 border-b pb-2">
                <button className={`font-semibold px-2 ${activeTab === 'info' ? 'text-purple-700 border-b-2 border-purple-500' : 'text-gray-500 hover:text-purple-700'}`} onClick={() => setActiveTab('info')}>Thông tin</button>
                <button className={`font-semibold px-2 ${activeTab === 'history' ? 'text-purple-700 border-b-2 border-purple-500' : 'text-gray-500 hover:text-purple-700'}`} onClick={() => setActiveTab('history')}>Lịch sử dịch vụ</button>
                <button className={`font-semibold px-2 ${activeTab === 'feedback' ? 'text-purple-700 border-b-2 border-purple-500' : 'text-gray-500 hover:text-purple-700'}`} onClick={() => setActiveTab('feedback')}>Đánh giá</button>
              </div>
              {/* Nội dung tab */}
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                  <div className="font-medium text-gray-600">Chuyên ngành:</div>
                  <div>{detailData.Major || 'Không có'}</div>
                  <div className="font-medium text-gray-600">Kinh nghiệm:</div>
                  <div>{detailData.Experience || 'Không có'} năm</div>
                  <div className="font-medium text-gray-600">Slogan:</div>
                  <div>{detailData.Slogan || 'Không có'}</div>
                  <div className="font-medium text-gray-600">Địa chỉ:</div>
                  <div>{detailData.Address || 'Không có'}</div>
                  <div className="font-medium text-gray-600">Ngày sinh:</div>
                  <div>{detailData.DateOfBirth || 'Không có'}</div>
                  <div className="font-medium text-gray-600">Giới tính:</div>
                  <div>{detailData.Gender || 'Không có'}</div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="mb-4">
                  <h4 className="font-semibold text-purple-700 mb-2">Lịch sử dịch vụ đã hoàn thành</h4>
                  <ul className="list-disc ml-6">
                    {customerTasks.filter(t => t.NursingID === detailData.NursingID).map((task, idx) => {
                      const booking = bookings.find(b => b.BookingID === task.BookingID && b.Status === 'completed');
                      const service = task.ServiceTaskID && serviceTasks.find(st => st.ServiceTaskID === task.ServiceTaskID);
                      if (!booking || !service) return null;
                      return (
                        <li key={idx} className="mb-1 text-sm text-gray-700">
                          <span className="font-semibold">#{booking.BookingID}</span> - {service.Description} <span className="text-xs text-gray-500">({booking.WorkDate ? new Date(booking.WorkDate).toLocaleDateString('vi-VN') : '-'})</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {activeTab === 'feedback' && (
                <div className="mb-4">
                  <h4 className="font-semibold text-pink-700 mb-2">Đánh giá từ khách hàng</h4>
                  <ul className="list-disc ml-6">
                    {feedbacks.filter(fb => fb.NursingID === detailData.NursingID).map((fb, idx) => (
                      <li key={idx} className="mb-1 text-sm text-gray-700">
                        <span className="font-semibold">{fb.CustomerName}:</span> {fb.Content} <span className="text-xs text-gray-500">({fb.Rating}★)</span>
                      </li>
                    ))}
                    {feedbacks.filter(fb => fb.NursingID === detailData.NursingID).length === 0 && (
                      <li className="text-xs text-gray-400">Chưa có đánh giá nào.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 