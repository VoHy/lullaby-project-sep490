'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faCalendar, faMoneyBill, faCog, faChartLine, faStethoscope, 
  faUserMd, faFileAlt, faCalendarAlt, faMapMarkerAlt, faBell, faSearch
} from '@fortawesome/free-solid-svg-icons';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import bookingService from '@/services/api/bookingService';
import feedbackService from '@/services/api/feedbackService';
import { useRouter, useSearchParams } from 'next/navigation';

// Import các tab components
import OverviewTab from './OverviewTab';
import UsersTab from './users/UsersTab';
import ManagerTab from './manager/ManagerTab';
import BookingsTab from './booking/BookingsTab';
import ServicesTab from './services/ServicesTab';
import RevenueTab from './revenue/RevenueTab';
import BlogTab from './blog/BlogTab';
import HolidayTab from './holiday/HolidayTab';
import AdminZoneTab from './zone/AdminZoneTab';

const AdminDashboard = ({ user, initialTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabsConfig = [
    { id: 'overview', label: 'Tổng quan', icon: faChartLine, color: 'from-blue-500 to-cyan-500' },
    { id: 'users', label: 'Quản lý người dùng', icon: faUsers, color: 'from-purple-500 to-pink-500' },
    { id: 'managers', label: 'Quản lý', icon: faUserMd, color: 'from-indigo-500 to-purple-500' },
    { id: 'zone', label: 'Quản lý khu vực', icon: faMapMarkerAlt, color: 'from-green-500 to-emerald-500' },
    { id: 'bookings', label: 'Quản lý lịch hẹn', icon: faCalendar, color: 'from-orange-500 to-red-500' },
    { id: 'services', label: 'Quản lý dịch vụ', icon: faStethoscope, color: 'from-teal-500 to-cyan-500' },
    { id: 'revenue', label: 'Doanh thu', icon: faMoneyBill, color: 'from-yellow-500 to-orange-500' },
    { id: 'blog', label: 'Quản lý tin tức', icon: faFileAlt, color: 'from-pink-500 to-rose-500' },
    { id: 'holiday', label: 'Quản lý lịch nghỉ lễ', icon: faCalendarAlt, color: 'from-violet-500 to-purple-500' },
  ];

  const validTabIds = tabsConfig.map(tab => tab.id);
  
  const getInitialTab = () => {
    if (initialTab && validTabIds.includes(initialTab)) return initialTab;
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [accounts, setAccounts] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [revenue, setRevenue] = useState({
    total: 0,
    monthly: 0,
    daily: 0
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && validTabIds.includes(tabParam)) {
      setActiveTab(tabParam);
    }
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [accountData, specialistData, bookingData, feedbackData] = await Promise.all([
        accountService.getAllAccounts(),
        nursingSpecialistService.getNursingSpecialists(),
        bookingService.getAllBookings(),
        // feedbackService.getFeedbacks()
      ]);

      setAccounts(accountData);
      setNursingSpecialists(specialistData);
      setBookings(bookingData);
      // setFeedbacks(feedbackData);

      // Calculate revenue
      const totalRevenue = (bookingData || []).reduce((sum, booking) => sum + (booking.total_price || 0), 0);
      setRevenue({
        total: totalRevenue,
        monthly: totalRevenue * 0.8,
        daily: totalRevenue * 0.1
      });

      // Mock notifications
      setNotifications([
        { id: 1, message: 'Có 5 booking mới trong ngày', type: 'info', time: '2 phút trước' },
        { id: 2, message: '3 người dùng mới đăng ký', type: 'success', time: '10 phút trước' },
        { id: 3, message: 'Cập nhật dịch vụ thành công', type: 'warning', time: '1 giờ trước' }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (accountId, newStatus) => {
    try {
      const updatedAccounts = accounts.map(account =>
        account.account_id === accountId
          ? { ...account, status: newStatus }
          : account
      );
      setAccounts(updatedAccounts);
      alert(`Đã cập nhật trạng thái tài khoản thành công!`);
    } catch (error) {
      console.error('Error updating account status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (searchParams.get('tab') !== tabId) {
      router.push(`?tab=${tabId}`, { scroll: false });
    }
  };

  const getActiveTabConfig = () => {
    return tabsConfig.find(tab => tab.id === activeTab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm">Chào mừng {user?.full_name} - Quản trị viên hệ thống</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-lg">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex items-center px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap
                    text-sm font-medium relative overflow-hidden group
                    ${isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105'
                    }
                  `}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-3 text-lg" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Indicator */}
        {getActiveTabConfig() && (
          <div className="mb-6 flex items-center space-x-3">
            <div className={`w-8 h-8 bg-gradient-to-r ${getActiveTabConfig().color} rounded-lg flex items-center justify-center`}>
              <FontAwesomeIcon icon={getActiveTabConfig().icon} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{getActiveTabConfig().label}</h2>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[600px]">
          {activeTab === 'overview' && <OverviewTab accounts={accounts} bookings={bookings} revenue={revenue} />}
          {activeTab === 'users' && (
            <UsersTab
              accounts={accounts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onStatusChange={handleStatusChange}
            />
          )}
          {activeTab === 'managers' && <ManagerTab />}
          {activeTab === 'zone' && <AdminZoneTab />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'revenue' && <RevenueTab revenue={revenue} bookings={bookings} />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'holiday' && <HolidayTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

