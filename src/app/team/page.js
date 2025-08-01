'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import nursingSpecialistService from '@/services/nurse/nursingSpecialistService';
// Thay thế import mock data bằng services
import zoneService from '@/services/api/zoneService';
import customerTaskService from '@/services/api/customerTaskService';
import bookingService from '@/services/api/bookingService';
import feedbackService from '@/services/api/feedbackService';
import serviceTaskService from '@/services/api/serviceTaskService';

export default function TeamPage() {
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zones, setZones] = useState([]);
  const [customerTasks, setCustomerTasks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [
          nursingSpecialistsData,
          zonesData,
          customerTasksData,
          bookingsData,
          feedbacksData,
          serviceTasksData
        ] = await Promise.all([
          nursingSpecialistService.getNursingSpecialists(),
          zoneService.getZones(),
          customerTaskService.getCustomerTasks(),
          bookingService.getBookings(),
          feedbackService.getFeedbacks(),
          serviceTaskService.getServiceTasks()
        ]);

        setNursingSpecialists(nursingSpecialistsData);
        setZones(zonesData);
        setCustomerTasks(customerTasksData);
        setBookings(bookingsData);
        setFeedbacks(feedbacksData);
        setServiceTasks(serviceTasksData);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin team...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <span className="text-gray-600 text-sm">{getZoneName(member.ZoneID || member.Address)}</span>
      </div>
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-pink-600">{getCompletedCases(member.NursingID)}</div>
        <div className="text-xs text-gray-500">Ca hoàn thành</div>
      </div>
      <button
        onClick={() => onViewDetail(member)}
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
      >
        Xem chi tiết
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            Đội ngũ chuyên nghiệp
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đội ngũ y tá và chuyên gia giàu kinh nghiệm, tận tâm chăm sóc sức khỏe cho gia đình bạn
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Zone Filter */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-semibold">Khu vực:</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">Tất cả khu vực</option>
                  {allZoneNames.map((zoneName) => (
                    <option key={zoneName} value={zoneName}>
                      {zoneName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-semibold">Tìm kiếm:</label>
                <input
                  type="text"
                  placeholder="Tên, địa chỉ..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredNurses.length}</div>
                <div className="text-gray-600">Y tá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{filteredSpecialists.length}</div>
                <div className="text-gray-600">Chuyên gia</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Nurses Section */}
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Đội ngũ Y tá</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNurses.map((nurse) => (
                <MemberCard key={nurse.NursingID} member={nurse} onViewDetail={handleViewDetail} />
              ))}
            </div>
            {filteredNurses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👩‍⚕️</div>
                <p className="text-gray-600">Không tìm thấy y tá nào phù hợp</p>
              </div>
            )}
          </div>

          {/* Specialists Section */}
          <div>
            <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">Đội ngũ Chuyên gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSpecialists.map((specialist) => (
                <MemberCard key={specialist.NursingID} member={specialist} onViewDetail={handleViewDetail} />
              ))}
            </div>
            {filteredSpecialists.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                <p className="text-gray-600">Không tìm thấy chuyên gia nào phù hợp</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetail && detailData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold" 
                onClick={handleCloseDetail}
              >
                &times;
              </button>
              
              <div className="text-center mb-6">
                <img
                  src={detailData.avatar_url || '/images/hero-bg.jpg'}
                  alt={detailData.FullName || detailData.Nurse_Name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-pink-200"
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {detailData.FullName || detailData.Nurse_Name}
                </h3>
                <p className="text-lg text-gray-600 mb-4">{detailData.Major}</p>
                <p className="text-gray-500">{getZoneName(detailData.ZoneID || detailData.Address)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Thống kê</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ca hoàn thành:</span>
                      <span className="font-bold text-blue-600">{getCompletedCases(detailData.NursingID)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đánh giá:</span>
                      <span className="font-bold text-yellow-600">4.8/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-4">
                  <h4 className="font-semibold text-pink-800 mb-3">Thông tin liên hệ</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Điện thoại:</span>
                      <span>{detailData.PhoneNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{detailData.Email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 