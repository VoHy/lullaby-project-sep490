'use client';

import { useEffect, useState, useContext, useMemo } from 'react';
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
  FaUserMd,
  FaQuoteLeft,
  FaStar,
  FaHeart
} from 'react-icons/fa';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import zoneService from '@/services/api/zoneService';
import accountService from '@/services/api/accountService';
import feedbackService from '@/services/api/feedbackService';
import wishlistService from '@/services/api/wishlistService';
import { AuthContext } from '@/context/AuthContext';
// import customizeTaskService from '@/services/api/customizeTaskService';
// import bookingService from '@/services/api/bookingService';
// import serviceTaskService from '@/services/api/serviceTaskService';

export default function TeamPage() {
  const { user } = useContext(AuthContext);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zones, setZones] = useState([]);
  const [customerTasks, setCustomerTasks] = useState([]);
  // const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  // const [serviceTasks, setServiceTasks] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [accountsMap, setAccountsMap] = useState({}); // Map accountID -> account
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoriteMap, setFavoriteMap] = useState({});
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const majorMap = {
    Nurse: "Chuyên viên chăm sóc",
    Specialist: "Chuyên viên tư vấn"
  }

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          nursingSpecialistsData,
          zonesData,
          feedbacksData,
          accountsData
        ] = await Promise.all([
          nursingSpecialistService.getNursingSpecialists(),
          zoneService.getZones(),
          feedbackService.getAllFeedbacks(),
          accountService.getAllAccounts()
        ]);

        setNursingSpecialists(Array.isArray(nursingSpecialistsData) ? nursingSpecialistsData : []);
        setZones(Array.isArray(zonesData) ? zonesData : []);
        setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : []);

        // Tạo map accountID -> account để tra nhanh avatarUrl/email/phone
        if (Array.isArray(accountsData)) {
          const map = {};
          for (const acc of accountsData) {
            const id = acc.accountID || acc.AccountID || acc.id || acc.ID;
            if (id != null) map[id] = acc;
          }
          setAccountsMap(map);
        } else {
          setAccountsMap({});
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load favorites theo account khi đăng nhập
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!user?.accountID && !user?.AccountID) {
          setFavorites([]);
          setFavoriteMap({});
          return;
        }
        const accountId = user.accountID || user.AccountID;
        const list = await wishlistService.getAllByAccount(accountId);
        setFavorites(Array.isArray(list) ? list : []);
        const map = {};
        (Array.isArray(list) ? list : []).forEach(item => {
          const nId = item.nursingID || item.NursingID;
          if (nId != null) map[nId] = item.wishlistID || item.WishlistID || item.id || item.ID;
        });
        setFavoriteMap(map);
      } catch (err) {
        // ignore silently
      }
    };
    loadFavorites();
  }, [user]);

  const isFavorite = useMemo(() => (nursingId) => !!favoriteMap[nursingId], [favoriteMap]);

  const toggleFavorite = async (member) => {
    try {
      const nursingId = member.NursingID || member.nursingID;
      if (!nursingId) return;
      const accountId = user?.accountID || user?.AccountID;
      if (!accountId) return;
      if (favoriteMap[nursingId]) {
        const wishlistId = favoriteMap[nursingId];
        await wishlistService.remove(wishlistId);
        const newFav = (favorites || []).filter(it => (it.wishlistID || it.WishlistID || it.id || it.ID) !== wishlistId);
        setFavorites(newFav);
        const { [nursingId]: _removed, ...rest } = favoriteMap;
        setFavoriteMap(rest);
      } else {
        const created = await wishlistService.add({ nursingID: nursingId, accountID: accountId });
        const createdId = created?.wishlistID || created?.WishlistID || created?.id || created?.ID;
        setFavorites([...(favorites || []), created]);
        setFavoriteMap({ ...favoriteMap, [nursingId]: createdId });
      }
    } catch (err) {
      // ignore or add toast later
    }
  };

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

  let filteredNurses = nurses.filter(filterMember);
  let filteredSpecialists = specialists.filter(filterMember);
  if (showOnlyFavorites) {
    filteredNurses = filteredNurses.filter(m => isFavorite(m.NursingID || m.nursingID));
    filteredSpecialists = filteredSpecialists.filter(m => isFavorite(m.NursingID || m.nursingID));
  }

  // Lấy danh sách zone unique
  const allZoneNames = Array.from(new Set(zones.map(z => z.Zone_name || z.zoneName || z.City || z.city).filter(Boolean)));

  // Tính rate trung bình cho mỗi member
  const getAverageRate = (nursingID) => {
    if (!nursingID || !feedbacks.length) return 0;
    const rates = feedbacks.filter(fb => (fb.nursingID || fb.NursingID) === nursingID).map(fb => fb.rate);
    if (!rates.length) return 0;
    return (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1);
  };

  // Lấy số ca hoàn thành (feedbacks count)
  const getCompletedCases = (nursingID) => {
    if (!nursingID || !feedbacks.length) return 0;
    return feedbacks.filter(fb => (fb.nursingID || fb.NursingID) === nursingID).length;
  };

  // Lấy danh sách feedback content cho member
  const getFeedbackContents = (nursingID) => {
    if (!nursingID || !feedbacks.length) return [];
    return feedbacks.filter(fb => (fb.nursingID || fb.NursingID) === nursingID && fb.content).map(fb => fb.content);
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
      {/* Favorite icon */}
      <button
        aria-label="Yêu thích"
        className={`absolute right-4 top-4 text-xl ${isFavorite(member.NursingID || member.nursingID) ? 'text-pink-500' : 'text-gray-300'} hover:text-pink-500 transition`}
        onClick={(e) => { e.stopPropagation(); toggleFavorite(member); }}
      >
        <FaHeart />
      </button>
      {/* Avatar + Badge */}
      <div className="relative mb-4">
        <img
          src={
            accountsMap[member.accountID || member.AccountID]?.avatarUrl ||
            member.avatar_url ||
            member.avatarUrl ||
            '/images/hero-bg.jpg'
          }
          alt={member.FullName || member.Nurse_Name || member.fullName}
          className="w-24 h-24 rounded-full object-cover border-4 border-pink-200 group-hover:scale-105 transition"
        />
        {/* Badge Major ở góc phải */}
        <span
          className={`absolute top-0 right-0 translate-x-2 -translate-y-2 px-2 py-0.5 rounded-full text-xs font-semibold shadow-md
            ${(member.Major || member.major)?.toLowerCase().includes("nurse")
              ? "bg-blue-100 text-blue-700"
              : "bg-pink-100 text-pink-700"
            }`}
        >
          {(member.Major || member.major)?.toLowerCase() === "nurse"
            ? "Chăm sóc"
            : (member.Major || member.major)?.toLowerCase() === "specialist"
              ? "Tư vấn"
              : member.Major || member.major}
        </span>
      </div>

      {/* Tên */}
      <h3 className="text-lg font-bold text-blue-700 mb-1 flex items-center gap-2">
        {member.FullName || member.Nurse_Name || member.fullName}
      </h3>

      {/* Zone */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-600 text-sm">
          {getZoneName(member.ZoneID || member.zoneID || member.Address || member.address)}
        </span>
      </div>

      {/* Stats */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-pink-600">
          {getCompletedCases(member.NursingID || member.nursingID)}
        </div>
        <div className="text-xs text-gray-500">Ca hoàn thành</div>
        <div className="flex items-center justify-center gap-1 mt-1 text-yellow-600 font-bold">
          <FaStar className="text-yellow-500" />
          <span>{getAverageRate(member.NursingID || member.nursingID)}/5</span>
        </div>
      </div>

      {/* Button */}
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
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

              {/* Favorites */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-semibold">Danh sách yêu thích:</label>
                <input type="checkbox" checked={showOnlyFavorites} onChange={(e) => setShowOnlyFavorites(e.target.checked)} />
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
                <div className="text-gray-600">Chuyên viên chăm sóc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{filteredSpecialists.length}</div>
                <div className="text-gray-600">Chuyên viên tư vấn</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{Object.keys(favoriteMap).length}</div>
                <div className="text-gray-600">Yêu thích</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Nurses Section */}
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Đội ngũ chuyên viên chăm sóc</h2>
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
            <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">Đội ngũ chuyên viên tư vấn</h2>
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
                      src={
                        accountsMap[detailData.accountID || detailData.AccountID]?.avatarUrl ||
                        detailData.avatar_url ||
                        detailData.avatarUrl ||
                        '/images/hero-bg.jpg'
                      }
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
                        {majorMap[detailData.Major || detailData.major] || 'Chưa cập nhật'}                      </span>
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
                      <span className="font-semibold text-blue-700">
                        {(detailData.Major || detailData.major)?.toLowerCase() === "nurse"
                          ? "Y tá"
                          : (detailData.Major || detailData.major)?.toLowerCase() === "specialist"
                            ? "Chuyên gia"
                            : detailData.Major || detailData.major || "N/A"}
                      </span>
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
                      <span className="font-bold text-yellow-600 text-xl">{getAverageRate(detailData.NursingID || detailData.nursingID)}/5</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${(detailData.Status || detailData.status) === "active"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                          }`}
                      >
                        {(detailData.Status || detailData.status) === "active"
                          ? "Hoạt động"
                          : "Ngưng hoạt động"}
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

              {/* Feedback content list */}
              {getFeedbackContents(detailData.NursingID || detailData.nursingID).length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                    <FaChartBar className="text-yellow-500" /> Đánh giá từ khách hàng
                  </h4>
                  <div className="space-y-3">
                    {getFeedbackContents(detailData.NursingID || detailData.nursingID).map((content, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition"
                      >
                        <FaQuoteLeft className="text-pink-400 mt-1" />
                        <p className="text-gray-700 leading-relaxed">{content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 