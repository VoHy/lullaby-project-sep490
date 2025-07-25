'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import nursingSpecialistService from '@/services/nurse/nursingSpecialistService';
import zones from '@/mock/Zone';

export default function TeamPage() {
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedZone, setSelectedZone] = useState('all');

  useEffect(() => {
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
  }, []);

  const nurses = nursingSpecialists.filter(m => m.NursingID);
  const specialists = nursingSpecialists.filter(m => m.NursingID);

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
  // Lọc theo zone
  const filteredNurses = nurses.filter(m =>
    selectedZone === 'all' ||
    getZoneName(m.Address || m.ZoneID) === selectedZone
  );
  const filteredSpecialists = specialists.filter(m =>
    selectedZone === 'all' ||
    getZoneName(m.Address || m.ZoneID) === selectedZone
  );
  // Lấy danh sách zone unique
  const allZoneNames = Array.from(new Set(zones.map(z => z.Zone_name)));

  const handleViewDetail = (member) => {
    setDetailData(member);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đội ngũ Y tá & Chuyên gia</h1>
        <p className="text-gray-600 mb-8">Danh sách đội ngũ y tá, chuyên gia, tư vấn viên của Lullaby</p>
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
        </div>
        <h2 className="text-2xl font-bold text-purple-700 mb-4 mt-8">Y tá</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredNurses.map((member, idx) => (
            <motion.div
              key={`nurse-${member.NursingID}`}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={member.avatar_url || '/default-avatar.png'}
                alt={member.Nurse_Name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pink-200"
              />
              <h3 className="text-xl font-semibold text-blue-700 mb-1">{member.Nurse_Name}</h3>
              <p className="text-gray-500 text-sm mb-2">{member.Major}</p>
              <p className="text-gray-600 text-center text-sm mb-2">Kinh nghiệm: {member.Experience} năm</p>
              <p className="text-gray-500 text-xs mb-2">{member.Slogan}</p>
              <button onClick={() => handleViewDetail(member)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded hover:shadow-lg">Xem chi tiết</button>
            </motion.div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-pink-700 mb-4 mt-12">Chuyên gia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredSpecialists.map((member, idx) => (
            <motion.div
              key={`specialist-${member.NursingID}`}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={member.avatar_url || '/default-avatar.png'}
                alt={member.FullName}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pink-200"
              />
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 mb-1">{member.FullName}</h3>
              <p className="text-gray-500 text-sm mb-2">{member.Major}</p>
              <p className="text-gray-600 text-center text-sm mb-2">Kinh nghiệm: {member.Experience} năm</p>
              <p className="text-gray-500 text-xs mb-2">{member.Slogan}</p>
              <button onClick={() => handleViewDetail(member)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded hover:shadow-lg">Xem chi tiết</button>
            </motion.div>
          ))}
        </div>
        {/* Popup chi tiết */}
        {showDetail && detailData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-pink-300 overflow-hidden mb-2">
                  <img src={detailData.avatar_url || '/default-avatar.png'} alt="avatar" className="object-cover w-full h-full" />
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1">{detailData.FullName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${detailData.Status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{detailData.Status || 'Không có'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 