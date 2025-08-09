'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
// Icons
import {
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaChartBar,
  FaStickyNote,
  FaTimes,
  FaTimesCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUserMd
} from 'react-icons/fa';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import zoneService from '@/services/api/zoneService';
import accountService from '@/services/api/accountService';
// import customizeTaskService from '@/services/api/customizeTaskService';
// import bookingService from '@/services/api/bookingService';
// import feedbackService from '@/services/api/feedbackService';
// import serviceTaskService from '@/services/api/serviceTaskService';

export default function TeamPage() {
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zones, setZones] = useState([]);
  const [customerTasks, setCustomerTasks] = useState([]);
  // const [bookings, setBookings] = useState([]);
  // const [feedbacks, setFeedbacks] = useState([]);
  // const [serviceTasks, setServiceTasks] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchText, setSearchText] = useState('');
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
          // customizeTasksData,
          // bookingsData,
          // feedbacksData,
          // serviceTasksData
        ] = await Promise.all([
          nursingSpecialistService.getNursingSpecialists(),
          zoneService.getZones(),
          // customizeTaskService.getCustomizeTasks(),
          // bookingService.getBookings(),
          // feedbackService.getFeedbacks(),
          // serviceTaskService.getServiceTasks()
        ]);

        setNursingSpecialists(Array.isArray(nursingSpecialistsData) ? nursingSpecialistsData : []);
        setZones(Array.isArray(zonesData) ? zonesData : []);
        // setCustomerTasks(Array.isArray(customizeTasksData) ? customizeTasksData : []);
        // setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        // setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : []);
        // setServiceTasks(Array.isArray(serviceTasksData) ? serviceTasksData : []);
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
  const nurses = nursingSpecialists.filter(m => m && (m.Major || m.major) && (m.Major || m.major).toLowerCase().includes('nurse'));
  const specialists = nursingSpecialists.filter(m => m && (m.Major || m.major) && !(m.Major || m.major).toLowerCase().includes('nurse'));

  // Map Address hoặc ZoneID sang Zone_name
  const getZoneName = (addressOrZoneID) => {
    if (!addressOrZoneID) return '';
    if (typeof addressOrZoneID === 'string') {
      const found = zones.find(z => (z.City || z.city) === addressOrZoneID || (z.Zone_name || z.zoneName) === addressOrZoneID);
      return found ? (found.Zone_name || found.zoneName || found.City || found.city) : addressOrZoneID;
    }
    if (typeof addressOrZoneID === 'number') {
      const found = zones.find(z => (z.ZoneID || z.zoneID) === addressOrZoneID);
      return found ? (found.Zone_name || found.zoneName || found.City || found.city) : addressOrZoneID;
    }
    return addressOrZoneID;
  };

  // Lọc theo zone và search
  const filterMember = (member) => {
    if (!member) return false;
    
    let memberZone = '';
    if (member.ZoneID || member.zoneID) {
      const zoneObj = zones.find(z => (z.ZoneID || z.zoneID) === (member.ZoneID || member.zoneID));
      memberZone = zoneObj ? (zoneObj.Zone_name || zoneObj.zoneName || zoneObj.City || zoneObj.city || '').toLowerCase().trim() : '';
    } else {
      memberZone = getZoneName(member.Address || member.address)?.toLowerCase().trim() || '';
    }
    const selectedZoneName = selectedZone?.toLowerCase().trim() || '';
    const zoneMatch = selectedZone === 'all' || memberZone === selectedZoneName;
    const searchMatch = !searchText || (
      (member.FullName || member.Nurse_Name || member.fullName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (member.Address || member.address || '').toLowerCase().includes(searchText.toLowerCase())
    );
    return zoneMatch && searchMatch;
  };

  const filteredNurses = nurses.filter(filterMember);
  const filteredSpecialists = specialists.filter(filterMember);
  
  // Lấy danh sách zone unique
  const allZoneNames = Array.from(new Set(zones.map(z => z.Zone_name || z.zoneName || z.City || z.city).filter(Boolean)));

  // Lấy số ca hoàn thành cho mỗi member
  const getCompletedCases = (nursingID) => {
    if (!nursingID) return 0;
    // const tasks = customerTasks.filter(t => (t.NursingID || t.nursingID) === nursingID);
    // const bookingIDs = [...new Set(tasks.map(t => t.BookingID || t.bookingID).filter(Boolean))];
    // return bookingIDs.filter(bid => {
    //   const b = bookings.find(bk => (bk.BookingID || bk.bookingID) === bid);
    //   return b && (b.Status === 'completed' || b.status === 'completed');
    // }).length;
    
    // Tạm thời return 0 vì customizeTaskService đã bị comment
    return 0;
  };

  const handleViewDetail = async (member) => {
    setDetailData(member);
    setShowDetail(true);
    
    // Lấy thông tin account nếu có accountID
    if (member.accountID || member.AccountID) {
      try {
        const accountId = member.accountID || member.AccountID;
        const accountInfo = await accountService.getAccountById(accountId);
        setAccountData(accountInfo);
      } catch (error) {
        console.error('Error fetching account data:', error);
        setAccountData(null);
      }
    } else {
      setAccountData(null);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
    setAccountData(null);
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
            <FaExclamationTriangle className="text-red-500 text-6xl mb-4 inline-block" />
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
        src={member.avatar_url || member.avatarUrl || '/images/hero-bg.jpg'}
        alt={member.FullName || member.Nurse_Name || member.fullName}
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pink-200 group-hover:scale-105 transition"
      />
      <h3 className="text-lg font-bold text-blue-700 mb-1 flex items-center gap-2">
        {member.FullName || member.Nurse_Name || member.fullName}
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${(member.Major || member.major) && (member.Major || member.major).toLowerCase().includes('nurse') ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{member.Major || member.major}</span>
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-600 text-sm">{getZoneName(member.ZoneID || member.zoneID || member.Address || member.address)}</span>
      </div>
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-pink-600">{getCompletedCases(member.NursingID || member.nursingID)}</div>
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
              <MemberCard key={nurse.NursingID || nurse.nursingID} member={nurse} onViewDetail={handleViewDetail} />
            ))}
            </div>
      {filteredNurses.length === 0 && (
              <div className="text-center py-12">
        <FaUser className="text-gray-400 text-6xl mb-4 inline-block" />
                <p className="text-gray-600">Không tìm thấy y tá nào phù hợp</p>
              </div>
            )}
          </div>

          {/* Specialists Section */}
          <div>
            <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">Đội ngũ Chuyên gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredSpecialists.map((specialist) => (
              <MemberCard key={specialist.NursingID || specialist.nursingID} member={specialist} onViewDetail={handleViewDetail} />
            ))}
            </div>
      {filteredSpecialists.length === 0 && (
              <div className="text-center py-12">
        <FaUserMd className="text-gray-400 text-6xl mb-4 inline-block" />
                <p className="text-gray-600">Không tìm thấy chuyên gia nào phù hợp</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetail && detailData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-5xl relative max-h-[80vh] overflow-y-auto">
              <button
                aria-label="Đóng"
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl transition-colors z-10"
                onClick={handleCloseDetail}
              >
                <FaTimes />
              </button>

              {/* Header: Avatar + Name */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={detailData.avatar_url || detailData.avatarUrl || '/images/hero-bg.jpg'}
                      alt={detailData.FullName || detailData.Nurse_Name || detailData.fullName}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-pink-200 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2">
                      {(detailData.Status || detailData.status)?.toLowerCase() === 'active' ? (
                        <FaCheckCircle className="text-green-500 text-2xl drop-shadow" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-2xl drop-shadow" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {detailData.FullName || detailData.Nurse_Name || detailData.fullName}
                    </h3>
                    <div className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {(detailData.Major || detailData.major) || 'Chưa cập nhật'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-500" />
                        {getZoneName(detailData.ZoneID || detailData.zoneID || detailData.Address || detailData.address)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-column content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="rounded-2xl border gradient-to-r from-blue-50 to-blue-100 p-6">
                  <h4 className="font-semibold text-blue-800 mb-4 text-lg flex items-center gap-2">
                    <FaUser />
                    Thông tin cá nhân
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-200/70">
                      <span className="text-gray-600">Họ và tên:</span>
                      <span className="font-semibold text-blue-800">{detailData.FullName || detailData.Nurse_Name || detailData.fullName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200/70">
                      <span className="text-gray-600">Chuyên môn:</span>
                      <span className="font-semibold text-blue-700">{detailData.Major || detailData.major || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200/70">
                      <span className="text-gray-600">Khu vực:</span>
                      <span className="font-semibold flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" />{getZoneName(detailData.ZoneID || detailData.zoneID || detailData.Address || detailData.address)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium text-sm text-right max-w-xs">{detailData.Address || detailData.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="rounded-2xl border gradient-to-r from-blue-50 to-blue-100 p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg flex items-center gap-2">
                    <FaPhone />
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-green-200/70">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-semibold text-green-700">
                        {accountData?.phoneNumber || accountData?.PhoneNumber || detailData.PhoneNumber || detailData.phoneNumber || detailData.Phone || detailData.phone || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold text-green-700 inline-flex items-center gap-2">
                        <FaEnvelope />
                        {accountData?.email || accountData?.Email || detailData.Email || detailData.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="rounded-2xl border gradient-to-r from-blue-50 to-blue-100 p-6">
                  <h4 className="font-semibold text-yellow-800 mb-4 text-lg flex items-center gap-2">
                    <FaChartBar />
                    Thống kê & Đánh giá
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-yellow-200/70">
                      <span className="text-gray-600">Ca hoàn thành:</span>
                      <span className="font-bold text-blue-600 text-xl">{getCompletedCases(detailData.NursingID || detailData.nursingID)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-yellow-200/70">
                      <span className="text-gray-600">Đánh giá trung bình:</span>
                      <span className="font-bold text-yellow-600 text-xl">4.8/5.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (detailData.Status || detailData.status) === 'Active'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}>
                        {detailData.Status || detailData.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(detailData.Note || detailData.note || detailData.Description || detailData.description) && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                      <FaStickyNote />
                      Ghi chú
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {detailData.Note || detailData.note || detailData.Description || detailData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 