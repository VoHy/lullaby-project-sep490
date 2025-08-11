'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendar, faMoneyBill, faUserCheck, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import careProfileService from '@/services/api/careProfileService';
import accountService from '@/services/api/accountService';
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import invoiceService from '@/services/api/invoiceService';

const OverviewTab = ({ bookings }) => {
  const [careProfiles, setCareProfiles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [careProfilesData, accountsData, serviceTypesData, serviceTasksData, nursingSpecialistsData, invoicesData] = await Promise.all([
          careProfileService.getCareProfiles(),
          accountService.getAllAccounts(),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists(),
          invoiceService.getAllInvoices(),
        ]);
        setCareProfiles(careProfilesData);
        setAccounts(accountsData);
        setServiceTypes(serviceTypesData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
        setInvoices(invoicesData);
      } catch (e) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
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
    );
  }

  const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} className="mr-1" />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Tính toán thống kê
  const totalUsers = accounts?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalRevenue = Array.isArray(invoices)
    ? invoices.reduce((sum, inv) => {
        const status = inv?.status ?? inv?.Status;
        const isPaid = status === true || String(status).toLowerCase() === 'paid' || String(status).toLowerCase() === 'completed' || String(status).toLowerCase() === 'success';
        const amount = inv?.totalAmount ?? inv?.TotalAmount ?? 0;
        return isPaid ? sum + Number(amount || 0) : sum;
      }, 0)
    : 0;
  const activeNurses = (nursingSpecialists || []).filter(n => String(n?.status ?? n?.Status).toLowerCase() === 'active').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={totalUsers}
          icon={faUsers}
          color="from-blue-500 to-cyan-500"
          trend="up"
          trendValue="+12%"
          subtitle="So với tháng trước"
        />
        <StatCard
          title="Tổng booking"
          value={totalBookings}
          icon={faCalendar}
          color="from-green-500 to-emerald-500"
          trend="up"
          trendValue="+8%"
          subtitle="So với tháng trước"
        />
        <StatCard
          title="Doanh thu"
          value={`${totalRevenue.toLocaleString()} VNĐ`}
          icon={faMoneyBill}
          color="from-purple-500 to-pink-500"
          trend="up"
          trendValue="+15%"
          subtitle="So với tháng trước"
        />
        <StatCard
          title="Nhân viên active"
          value={activeNurses}
          icon={faUserCheck}
          color="from-orange-500 to-red-500"
          trend="up"
          trendValue="+5%"
          subtitle="So với tháng trước"
        />
      </div>
    </div>
  );
};

export default OverviewTab;