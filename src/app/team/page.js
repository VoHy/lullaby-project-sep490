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

export default function TeamPage() {
  const { user } = useContext(AuthContext);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zones, setZones] = useState([]);
  const [customerTasks, setCustomerTasks] = useState([]);
  // const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({}); // Map nursingID -> { rating, count }
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

  // Default avatars by gender (kept here to avoid creating new files)
  const MALE_DEFAULT_AVATAR = 'https://i.ibb.co/zWchkWb9/bae8ac1e948df3e40f745095485a1351.jpg';
  const FEMALE_DEFAULT_AVATAR = 'https://i.ibb.co/qX4Pprh/ae4af3fa63764c2b2d27ff9a35f7097a.jpg';

  // Determine if a member is female based on common gender fields (loose matching)
  const isFemaleMember = (m) => {
    if (!m) return false;
    const g = ((m.Gender || m.gender || m.sex || '') + '').toLowerCase();
    return /female|f$|^f\b|nu|nữ|fem/i.test(g);
  };

  // Resolve avatar URL for a member: account avatar -> member avatar -> gendered default
  const resolveAvatar = (m) => {
    if (!m) return (MALE_DEFAULT_AVATAR);
    const accountAv = accountsMap[m.accountID || m.AccountID]?.avatarUrl;
    if (accountAv) return accountAv;
    if (m.avatar_url) return m.avatar_url;
    if (m.avatarUrl) return m.avatarUrl;
    return isFemaleMember(m) ? FEMALE_DEFAULT_AVATAR : MALE_DEFAULT_AVATAR;
  };

  // Cache duration - 5 phút để ratings được cập nhật định kỳ
  const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

  // Utility function to clear team cache
  const clearTeamCache = () => {
    localStorage.removeItem('team_data');
    localStorage.removeItem('team_cache_time');
    localStorage.removeItem('team_ratings_data');
    localStorage.removeItem('team_ratings_cache_time');
  };

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Check cache first
        const cachedTeamData = localStorage.getItem('team_data');
        const teamCacheTime = localStorage.getItem('team_cache_time');
        const cachedRatingsData = localStorage.getItem('team_ratings_data');
        const ratingsCacheTime = localStorage.getItem('team_ratings_cache_time');
        const now = Date.now();

        // Use cache if it's less than 5 minutes old
        if (cachedTeamData && teamCacheTime && (now - parseInt(teamCacheTime)) < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedTeamData);
          setNursingSpecialists(parsedData.nursingSpecialists);
          setZones(parsedData.zones);
          setFeedbacks(parsedData.feedbacks);
          setAccountsMap(parsedData.accountsMap);

          // Use cached ratings if available and fresh. If ratings were cached without counts
          // (API previously returned only average), derive counts from cached feedbacks when possible.
          if (cachedRatingsData && ratingsCacheTime && (now - parseInt(ratingsCacheTime)) < CACHE_DURATION) {
            try {
              const parsedRatings = JSON.parse(cachedRatingsData) || {};
              const feedbacksCached = Array.isArray(parsedData.feedbacks) ? parsedData.feedbacks : [];
              // For each rating entry, if count is missing or 0, try to derive from cached feedbacks
              Object.keys(parsedRatings).forEach(nId => {
                const rd = parsedRatings[nId];
                if (!rd) return;
                // if count absent or zero, compute from feedbacksCached
                if (!rd.count || rd.count === 0) {
                  const nCount = feedbacksCached.filter(fb => (fb.nursingID || fb.NursingID) === (Number(nId) || nId)).length;
                  parsedRatings[nId].count = nCount;
                }
              });
              setRatingsMap(parsedRatings);
            } catch (err) {
              // fallback to raw cached ratings
              setRatingsMap(JSON.parse(cachedRatingsData));
            }
            setLoading(false);
            return;
          }
        }

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

        // Fetch ratings cho từng nursing specialist qua API getAverageRatingByNursing
        if (Array.isArray(nursingSpecialistsData) && nursingSpecialistsData.length > 0) {
          let ratingsData = {};
          try {
            const ratingPromises = nursingSpecialistsData.map(async (specialist) => {
              const nursingId = specialist.NursingID || specialist.nursingID;
              if (!nursingId) return null;
              
              try {
                // Sử dụng API mới để lấy rating trung bình trực tiếp
                const ratingResult = await feedbackService.getAverageRatingByNursing(nursingId);

                // API có thể trả về số (ví dụ: 4.8) hoặc object { rating, count }
                let ratingVal = 0;
                let countVal = 0;
                if (typeof ratingResult === 'number') {
                  ratingVal = ratingResult;
                  // Derive count from local feedbacksData if available
                  const nursingFeedbacks = Array.isArray(feedbacksData) ? feedbacksData.filter(fb => (fb.nursingID || fb.NursingID) === nursingId) : [];
                  countVal = nursingFeedbacks.length;
                } else if (ratingResult && typeof ratingResult === 'object') {
                  ratingVal = typeof ratingResult.rating === 'number' ? ratingResult.rating : parseFloat((ratingResult.rating || 0));
                  countVal = Number(ratingResult.count) || 0;
                }

                return [nursingId, { 
                  rating: parseFloat((ratingVal || 0).toFixed(1)), 
                  count: countVal
                }];
              } catch (error) {
                // Fallback về cách cũ nếu API mới không hoạt động
                console.warn(`Fallback to old method for nursing ${nursingId}:`, error);
                const nursingFeedbacks = feedbacksData.filter(fb => 
                  (fb.nursingID || fb.NursingID) === nursingId
                );
                if (nursingFeedbacks.length === 0) {
                  return [nursingId, { rating: 0, count: 0 }];
                }
                const rates = nursingFeedbacks.map(fb => fb.rate || 0);
                const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
                return [nursingId, { rating: parseFloat(avg.toFixed(1)), count: rates.length }];
              }
            });

            const results = await Promise.allSettled(ratingPromises);
            results.forEach(result => {
              if (result.status === 'fulfilled' && result.value) {
                const [nursingId, ratingData] = result.value;
                if (nursingId) {
                  ratingsData[nursingId] = ratingData;
                }
              }
            });
            
            setRatingsMap(ratingsData);
            
            // Cache the ratings data
            localStorage.setItem('team_ratings_data', JSON.stringify(ratingsData));
            localStorage.setItem('team_ratings_cache_time', now.toString());
          } catch (error) {
            console.warn('Không thể tải ratings cho nursing specialists:', error);
            setRatingsMap({});
          }
        }

        // Cache the team data
        localStorage.setItem('team_data', JSON.stringify({
          nursingSpecialists: Array.isArray(nursingSpecialistsData) ? nursingSpecialistsData : [],
          zones: Array.isArray(zonesData) ? zonesData : [],
          feedbacks: Array.isArray(feedbacksData) ? feedbacksData : [],
          accountsMap: Array.isArray(accountsData) ? (() => {
            const map = {};
            for (const acc of accountsData) {
              const id = acc.accountID || acc.AccountID || acc.id || acc.ID;
              if (id != null) map[id] = acc;
            }
            return map;
          })() : {}
        }));
        localStorage.setItem('team_cache_time', now.toString());

      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        // Clear cache on error
        clearTeamCache();
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

  // Phân biệt Chuyên viên chăm sóc và Chuyên viên
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

  // Pagination state for Nurses and Specialists
  const [nursesPage, setNursesPage] = useState(1);
  const [specialistsPage, setSpecialistsPage] = useState(1);
  const [nursesPageSize, setNursesPageSize] = useState(6);
  const [specialistsPageSize, setSpecialistsPageSize] = useState(6);

  // Reset pages when filters/search change
  useEffect(() => {
    setNursesPage(1);
    setSpecialistsPage(1);
  }, [selectedZone, searchText, showOnlyFavorites, zones]);

  const nursesTotalPages = Math.max(1, Math.ceil((filteredNurses.length || 0) / nursesPageSize));
  const specialistsTotalPages = Math.max(1, Math.ceil((filteredSpecialists.length || 0) / specialistsPageSize));

  const paginatedNurses = filteredNurses.slice((nursesPage - 1) * nursesPageSize, nursesPage * nursesPageSize);
  const paginatedSpecialists = filteredSpecialists.slice((specialistsPage - 1) * specialistsPageSize, specialistsPage * specialistsPageSize);

  const gotoNursesPage = (p) => {
    const page = Math.max(1, Math.min(nursesTotalPages, p));
    setNursesPage(page);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gotoSpecialistsPage = (p) => {
    const page = Math.max(1, Math.min(specialistsTotalPages, p));
    setSpecialistsPage(page);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lấy danh sách zone unique
  const allZoneNames = Array.from(new Set(zones.map(z => z.Zone_name || z.zoneName || z.City || z.city).filter(Boolean)));

  // Lấy rate trung bình cho mỗi member từ ratingsMap
  const getAverageRate = (nursingID) => {
    if (!nursingID) return "0.0";
    const ratingData = ratingsMap[nursingID];
    if (!ratingData) return "0.0";
    // Đảm bảo rating luôn là string với 1 chữ số thập phân
    return typeof ratingData.rating === 'number' ? ratingData.rating.toFixed(1) : String(ratingData.rating);
  };

  // Kiểm tra member có đánh giá hay không (count > 0)
  const hasRating = (nursingID) => {
    if (!nursingID) return false;
    const ratingData = ratingsMap[nursingID];
    return !!(ratingData && (ratingData.count || ratingData.count === 0) && ratingData.count > 0);
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

  // Card member (dùng cho cả Chuyên viên chăm sóc và Chuyên viên)
  const MemberCard = ({ member, onViewDetail }) => (
    <motion.div
      key={member.NursingID}
      className="bg-white rounded-xl shadow p-6 flex flex-col hover:shadow-xl transition group relative"
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

      <div className="flex flex-col items-center gap-3 h-full">
        <div className="relative mb-2">
          <img
            src={resolveAvatar(member)}
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
              ? "Chuyên viên chăm sóc"
              : (member.Major || member.major)?.toLowerCase() === "specialist"
                ? "Chuyên viên tư vấn"
                : member.Major || member.major}
          </span>
        </div>

        <div className="text-center flex-1 flex flex-col items-center justify-start">
          <h3 className="text-lg font-bold text-blue-700 mb-1">
            {member.FullName || member.Nurse_Name || member.fullName}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-600 text-sm">
              {getZoneName(member.ZoneID || member.zoneID || member.Address || member.address)}
            </span>
          </div>

          {hasRating(member.NursingID || member.nursingID) && (
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold text-lg">
                <FaStar className="text-yellow-500" />
                <span>{getAverageRate(member.NursingID || member.nursingID)}/5</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Đánh giá</div>
            </div>
          )}
        </div>

        <div className="mt-3">
          <button
            onClick={() => onViewDetail(member)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
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
            Đội ngũ Chuyên viên chăm sóc và Chuyên viên giàu kinh nghiệm, tận tâm chăm sóc sức khỏe cho gia đình bạn
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
              {paginatedNurses.map((nurse) => (
                <MemberCard key={nurse.NursingID || nurse.nursingID} member={nurse} onViewDetail={handleViewDetail} />
              ))}
            </div>

            {/* Pagination for Nurses (moved to bottom of section) */}
            {filteredNurses.length === 0 && (
              <div className="text-center py-12">
                <FaUser className="text-gray-400 text-6xl mb-4 inline-block" />
                <p className="text-gray-600">Không tìm thấy Chuyên viên chăm sóc nào phù hợp</p>
              </div>
            )}
          </div>

          {/* Specialists Section */}
          <div>
            <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">Đội ngũ chuyên viên tư vấn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedSpecialists.map((specialist) => (
                <MemberCard key={specialist.NursingID || specialist.nursingID} member={specialist} onViewDetail={handleViewDetail} />
              ))}
            </div>

            {filteredSpecialists.length === 0 && (
              <div className="text-center py-12">
                <FaUserMd className="text-gray-400 text-6xl mb-4 inline-block" />
                <p className="text-gray-600">Không tìm thấy chuyên viên tư vấn nào phù hợp</p>
              </div>
            )}

            {/* Combined pagination controls placed after both sections */}
            {(filteredNurses.length > nursesPageSize || filteredSpecialists.length > specialistsPageSize) && (
              <div className="flex flex-col items-center gap-6 mt-8">
                {filteredNurses.length > nursesPageSize && (
                  <div className="flex items-center justify-center gap-2">
                    <button disabled={nursesPage === 1} onClick={() => gotoNursesPage(nursesPage - 1)} className={`px-3 py-2 rounded-lg border ${nursesPage === 1 ? 'text-gray-400 border-gray-200' : 'text-purple-600 border-purple-200 hover:bg-purple-50'}`}>Trước</button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: nursesTotalPages }).map((_, i) => {
                        const p = i + 1;
                        return (
                          <button key={`n-${p}`} onClick={() => gotoNursesPage(p)} className={`px-3 py-2 rounded-lg ${nursesPage === p ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{p}</button>
                        );
                      })}
                    </div>
                    <button disabled={nursesPage === nursesTotalPages} onClick={() => gotoNursesPage(nursesPage + 1)} className={`px-3 py-2 rounded-lg border ${nursesPage === nursesTotalPages ? 'text-gray-400 border-gray-200' : 'text-purple-600 border-purple-200 hover:bg-purple-50'}`}>Sau</button>
                  </div>
                )}

                {filteredSpecialists.length > specialistsPageSize && (
                  <div className="flex items-center justify-center gap-2">
                    <button disabled={specialistsPage === 1} onClick={() => gotoSpecialistsPage(specialistsPage - 1)} className={`px-3 py-2 rounded-lg border ${specialistsPage === 1 ? 'text-gray-400 border-gray-200' : 'text-pink-600 border-pink-200 hover:bg-pink-50'}`}>Trước</button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: specialistsTotalPages }).map((_, i) => {
                        const p = i + 1;
                        return (
                          <button key={`s-${p}`} onClick={() => gotoSpecialistsPage(p)} className={`px-3 py-2 rounded-lg ${specialistsPage === p ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{p}</button>
                        );
                      })}
                    </div>
                    <button disabled={specialistsPage === specialistsTotalPages} onClick={() => gotoSpecialistsPage(specialistsPage + 1)} className={`px-3 py-2 rounded-lg border ${specialistsPage === specialistsTotalPages ? 'text-gray-400 border-gray-200' : 'text-pink-600 border-pink-200 hover:bg-pink-50'}`}>Sau</button>
                  </div>
                )}
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
                      src={resolveAvatar(detailData)}
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
                          ? "Chuyên viên chăm sóc"
                          : (detailData.Major || detailData.major)?.toLowerCase() === "specialist"
                            ? "Chuyên viên"
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
                    {hasRating(detailData.NursingID || detailData.nursingID) && (
                      <div className="flex justify-between items-center py-2 border-b border-yellow-200/70">
                        <span className="text-gray-600">Đánh giá trung bình:</span>
                        <span className="font-bold text-yellow-600 text-xl">{getAverageRate(detailData.NursingID || detailData.nursingID)}/5</span>
                      </div>
                    )}
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