'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faCalendar, faMoneyBill, faCog, faChartLine, faStethoscope, faUserMd, faFileAlt, faCalendarAlt
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
import BookingsTab from './BookingsTab';
import ServicesTab from './services/ServicesTab';
import RevenueTab from './revenue/RevenueTab';
import SettingsTab from './settings/SettingsTab';
import BlogTab from './blog/BlogTab';
import HolidayTab from './holiday/HolidayTab';

const AdminDashboard = ({ user, initialTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabsConfig = [
    { id: 'overview', label: 'Tổng quan', icon: faChartLine },
    { id: 'users', label: 'Quản lý User', icon: faUsers },
    { id: 'managers', label: 'Quản lý Manager', icon: faUserMd },
    { id: 'bookings', label: 'Quản lý Booking', icon: faCalendar },
    { id: 'services', label: 'Quản lý Dịch vụ', icon: faStethoscope },
    { id: 'revenue', label: 'Doanh thu', icon: faMoneyBill },
    { id: 'blog', label: 'Quản lý Blog', icon: faFileAlt },
    { id: 'holiday', label: 'Quản lý Holiday', icon: faCalendarAlt },
    { id: 'settings', label: 'Cài đặt', icon: faCog },
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
      const [accountData, specialistData, bookingData, feedbackData] = await Promise.all([
        accountService.getAllAccounts(),
        nursingSpecialistService.getNursingSpecialists(),
        bookingService.getBookingServices(),
        feedbackService.getFeedbacks()
      ]);

      setAccounts(accountData);
      setNursingSpecialists(specialistData);
      setBookings(bookingData);
      setFeedbacks(feedbackData);

      // Calculate revenue
      const totalRevenue = bookingData.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
      setRevenue({
        total: totalRevenue,
        monthly: totalRevenue * 0.8, // Mock monthly
        daily: totalRevenue * 0.1    // Mock daily
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleStatusChange = async (accountId, newStatus) => {
    try {
      // Update account status
      const updatedAccounts = accounts.map(account =>
        account.account_id === accountId
          ? { ...account, status: newStatus }
          : account
      );
      setAccounts(updatedAccounts);

      // Here you would call the actual API
      // await accountService.updateAccountStatus(accountId, newStatus);

      alert(`Đã cập nhật trạng thái tài khoản thành công!`);
    } catch (error) {
      console.error('Error updating account status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  // Hàm đồng bộ tab và URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (searchParams.get('tab') !== tabId) {
      router.push(`?tab=${tabId}`, { scroll: false });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Chào mừng {user.full_name} - Quản trị viên hệ thống</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex flex-nowrap gap-6 bg-white p-2 rounded-2xl shadow-lg overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center px-6 py-2 rounded-xl transition-all duration-300 whitespace-nowrap
                  min-w-[200px] text-base font-medium
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105 font-bold'
                    : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                  }
                `}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2 text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Nội dung chính */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[300px]">
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
          {activeTab === 'managers' && (
            <ManagerTab />
          )}
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
