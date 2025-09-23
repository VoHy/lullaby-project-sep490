'use client';
import { useState, useEffect, useContext } from 'react';
import { FaUserNurse, FaUserMd, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaUsers, FaMapMarkedAlt, FaBell } from 'react-icons/fa';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ManagerNurseTab from './ManagerNurseTab';
import ManagerSpecialistTab from './ManagerSpecialistTab';
import ManagerBookingTab from './ManagerBookingTab';
import { useRouter, useSearchParams } from 'next/navigation';
import zoneService from '@/services/api/zoneService';
import bookingService from '@/services/api/bookingService';
import invoiceService from '@/services/api/invoiceService';
import careProfileService from '@/services/api/careProfileService';
import zoneDetailService from '@/services/api/zoneDetailService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import notificationService from '@/services/api/notificationService';
import { AuthContext } from '@/context/AuthContext';

const TABS = [
  { id: 'nurse', label: 'Quản lý chuyên viên chăm sóc', icon: FaUserNurse },
  { id: 'specialist', label: 'Quản lý chuyên viên tư vấn', icon: FaUserMd },
  { id: 'booking', label: 'Quản lý lịch hẹn', icon: FaCalendarAlt },
];

const ManagerDashboard = ({ user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser } = useContext(AuthContext);
  const validTabs = TABS.map(t => t.id);
  const getInitialTab = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam && validTabs.includes(tabParam)) return tabParam;
    return 'nurse';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [zoneNurses, setZoneNurses] = useState([]);
  const [zoneSpecialists, setZoneSpecialists] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabLoading, setTabLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'month'
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);

  // Load data từ API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [zonesData, nursingSpecialistsData, bookingsData, invoicesData, careProfilesData, zoneDetailsData] = await Promise.all([
        zoneService.getZones(),
        nursingSpecialistService.getAllNursingSpecialists(),
        bookingService.getAllBookings(),
        invoiceService.getAllInvoices(),
        careProfileService.getCareProfiles(),
        zoneDetailService.getZoneDetails()
      ]);

      setZones(zonesData);
      setNursingSpecialists(nursingSpecialistsData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setCareProfiles(Array.isArray(careProfilesData) ? careProfilesData : []);
      setZoneDetails(Array.isArray(zoneDetailsData) ? zoneDetailsData : []);
    } catch (error) {
      console.error('Error fetching manager dashboard data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!authUser) return;
        const accountId = authUser.accountID || authUser.AccountID;
        if (!accountId) return;

        const unread = await notificationService.getUnreadByAccount(accountId);
        setUnreadNotifications(Array.isArray(unread) ? unread.length : 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setUnreadNotifications(0);
      }
    };

    fetchNotifications();
  }, [authUser]);

  useEffect(() => {
    if (!selectedZone) {
      setZoneNurses([]);
      setZoneSpecialists([]);
      return;
    }
    // Lọc nurse
    const nurses = nursingSpecialists.filter(n => n.nursingID && n.zoneID == selectedZone);
    // Lọc specialist
    const specialists = nursingSpecialists.filter(s => s.nursingID && s.zoneID == selectedZone);
    setZoneNurses(nurses);
    setZoneSpecialists(specialists);
  }, [selectedZone, nursingSpecialists]);

  // Khi URL query string thay đổi thì cập nhật tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Khi click tab thì cập nhật URL
  const handleTabChange = async (tabId) => {
    if (tabId === activeTab) return;

    setTabLoading(true);
    setActiveTab(tabId);

    if (searchParams.get('tab') !== tabId) {
      router.push(`?tab=${tabId}`, { scroll: false });
    }

    // Hiển thị thông báo
    const selectedTab = TABS.find(tab => tab.id === tabId);
    setNotificationMessage(`Đã chuyển sang ${selectedTab.label}`);
    setShowNotification(true);

    // Simulate loading time for better UX
    setTimeout(() => {
      setTabLoading(false);
      // Ẩn thông báo sau 2 giây
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }, 300);
  };

  // Tính toán thống kê
  const getManagedZone = () => {
    if (!user?.accountID) return null;
    return zones.find(zone => zone.managerID === user.accountID);
  };

  const getZoneStats = () => {
    const managedZone = getManagedZone();
    if (!managedZone) return { nurses: 0, specialists: 0, total: 0 };

    const zoneNurses = nursingSpecialists.filter(ns =>
      ns.zoneID === managedZone.zoneID && (ns.major === 'nurse' || ns.major === 'Nurse' || ns.major === 'Nursing')
    );
    const zoneSpecialists = nursingSpecialists.filter(ns =>
      ns.zoneID === managedZone.zoneID && (ns.major === 'specialist' || ns.major === 'Specialist')
    );

    return {
      nurses: zoneNurses.length,
      specialists: zoneSpecialists.length,
      total: zoneNurses.length + zoneSpecialists.length
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4 inline-block" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  const managedZone = getManagedZone();
  const stats = getZoneStats();

  // Chart data (booking & revenue) theo zone
  const formatKey = (date) => (viewMode === 'day'
    ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    : `${date.getMonth() + 1}/${date.getFullYear()}`);

  const zoneId = managedZone?.zoneID;
  const cpMap = new Map((careProfiles || []).map(cp => [cp.careProfileID || cp.CareProfileID, cp]));
  const zdMap = new Map((zoneDetails || []).map(zd => [zd.zoneDetailID || zd.ZoneDetailID, zd]));

  const belongsToZone = (booking) => {
    if (!zoneId) return false;
    const cp = cpMap.get(booking?.careProfileID || booking?.CareProfileID);
    if (!cp) return false;
    const zd = zdMap.get(cp.zoneDetailID || cp.ZoneDetailID);
    return zd && (zd.zoneID || zd.ZoneID) === zoneId;
  };

  const zoneBookings = (bookings || []).filter(belongsToZone);
  const zoneInvoices = (invoices || []).filter(inv => {
    const bId = inv?.bookingID || inv?.BookingID;
    if (!bId) return false;
    const b = zoneBookings.find(x => (x.bookingID || x.BookingID) === bId);
    return !!b;
  });

  const revenueAndBookings = zoneBookings.reduce((acc, b) => {
    const status = String(b?.status ?? b?.Status).toLowerCase();
    if (status !== 'paid') return acc;
    const date = new Date(b?.createdAt ?? b?.CreatedAt ?? new Date());
    const key = formatKey(date);
    if (!acc[key]) acc[key] = { revenue: 0, bookings: 0 };
    acc[key].bookings += 1;
    return acc;
  }, {});

  zoneInvoices.forEach(inv => {
    const status = String(inv?.status ?? inv?.Status).toLowerCase();
    if (status === 'paid' || status === 'success' || status === 'completed' || status === 'true') {
      const date = new Date(inv?.paymentDate ?? inv?.CreatedAt ?? new Date());
      const key = formatKey(date);
      if (!revenueAndBookings[key]) revenueAndBookings[key] = { revenue: 0, bookings: 0 };
      revenueAndBookings[key].revenue += Number(inv?.totalAmount ?? inv?.TotalAmount ?? 0);
    }
  });

  const chartData = Object.keys(revenueAndBookings).map(k => ({
    label: k,
    revenue: revenueAndBookings[k].revenue,
    bookings: revenueAndBookings[k].bookings
  }));

  return (
    <div className="space-y-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in">
          <div className="flex items-center gap-2">
            <FaCheckCircle />
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chào mừng quản lý: {user.fullName}</h2>
          <button
            onClick={() => router.push('/notifications')}
            className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
            title="Xem thông báo"
          >
          </button>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-400 rounded-lg">
                <FaUserNurse className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Tổng số chuyên viên chăm sóc</p>
                <p className="text-2xl font-bold">{stats.nurses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-400 rounded-lg">
                <FaUserMd className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Tổng số chuyên viên tư vấn</p>
                <p className="text-2xl font-bold">{stats.specialists}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-400 rounded-lg">
                <FaUsers className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Tổng nhân sự</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-pink-400 rounded-lg">
                <FaMapMarkedAlt className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Khu vực quản lý</p>
                <p className="text-lg font-bold">{managedZone?.zoneName || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Doanh thu & Lịch hẹn theo zone quản lý */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Doanh thu & lịch hẹn ({managedZone?.zoneName || 'N/A'}) {viewMode === 'day' ? 'theo ngày' : 'theo tháng'}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('day')} className={`px-3 py-1 rounded ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Ngày</button>
              <button onClick={() => setViewMode('month')} className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Tháng</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="label" />
              <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => Math.round(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v, n) => (n === 'revenue' ? `${Number(v).toLocaleString()} VNĐ` : v)} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="#413ea0" name="Doanh thu" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#ff7300" name="Lịch hẹn" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={tabLoading}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                  }`}
              >
                <span className="text-lg">{tab.icon && (() => { const Icon = tab.icon; return <Icon />; })()}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tabLoading && activeTab === tab.id && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] relative">
          {tabLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Đang chuyển tab...</p>
              </div>
            </div>
          )}

          <div className={`transition-all duration-300 ${activeTab === 'nurse' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {activeTab === 'nurse' && (
              <ManagerNurseTab
                refetchNurses={fetchData}
                nurses={nursingSpecialists.filter(ns => ns.zoneID === (managedZone?.zoneID) && (ns.major === 'nurse' || ns.major === 'Nurse' || ns.major === 'Nursing'))}
                zones={zones}
                managedZone={managedZone}
                loading={loading}
                error={error}
              />
            )}
          </div>

          <div className={`transition-all duration-300 ${activeTab === 'specialist' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {activeTab === 'specialist' && (
              <ManagerSpecialistTab
                refetchSpecialists={fetchData}
                specialists={nursingSpecialists.filter(ns => ns.zoneID === (managedZone?.zoneID) && (ns.major === 'specialist' || ns.major === 'Specialist'))}
                zones={zones}
                managedZone={managedZone}
                loading={loading}
                error={error}
              />
            )}
          </div>

          <div className={`transition-all duration-300 ${activeTab === 'booking' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {activeTab === 'booking' && <ManagerBookingTab />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
