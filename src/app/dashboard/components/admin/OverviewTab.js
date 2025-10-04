'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendar, faMoneyBill, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import careProfileService from '@/services/api/careProfileService';
import accountService from '@/services/api/accountService';
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import invoiceService from '@/services/api/invoiceService';

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const OverviewTab = ({ bookings }) => {
  const [accounts, setAccounts] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("day"); // "day" hoặc "month"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [, accountsData, , , nursingSpecialistsData, invoicesData] = await Promise.all([
          careProfileService.getCareProfiles(),
          accountService.getAllAccounts(),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists(),
          invoiceService.getAllInvoices(),
        ]);
        setAccounts(accountsData);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4"></div>
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

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Thống kê
  const totalUsers = accounts?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalRevenue = Array.isArray(invoices)
    ? invoices.reduce((sum, inv) => {
      const status = inv?.status ?? inv?.Status;
      const isPaid = status === true || String(status).toLowerCase() === 'paid' || String(status).toLowerCase() === 'completed' || String(status).toLowerCase() === 'success';
      return isPaid ? sum + Number(inv?.totalAmount ?? inv?.TotalAmount ?? 0) : sum;
    }, 0)
    : 0;
  const activeNurses = (nursingSpecialists || []).filter(n => String(n?.status ?? n?.Status).toLowerCase() === 'active').length;

  // Hàm format key theo viewMode
  const formatKey = (date) => {
    return viewMode === "day"
      ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      : `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Tạo dữ liệu
  const revenueAndBookings = bookings.reduce((acc, booking) => {
    const status = String(booking?.status ?? booking?.Status).toLowerCase();
    if (status !== 'paid') return acc; // chỉ tính booking đã thanh toán

    const date = new Date(booking?.createdAt ?? booking?.CreatedAt ?? new Date());
    const key = formatKey(date);
    if (!acc[key]) acc[key] = { revenue: 0, bookings: 0 };
    acc[key].bookings += 1;
    return acc;
  }, {});
  invoices.forEach(inv => {
    const status = String(inv?.status ?? inv?.Status).toLowerCase();
    if (status === 'paid') { // chỉ lấy hóa đơn paid
      const date = new Date(inv?.paymentDate ?? inv?.CreatedAt ?? new Date());
      const key = formatKey(date);
      if (!revenueAndBookings[key]) revenueAndBookings[key] = { revenue: 0, bookings: 0 };
      revenueAndBookings[key].revenue += Number(inv?.totalAmount ?? inv?.TotalAmount ?? 0);
    }
  });

  const chartData = Object.keys(revenueAndBookings).map(key => ({
    label: key,
    revenue: revenueAndBookings[key].revenue,
    bookings: revenueAndBookings[key].bookings
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={totalUsers}
          icon={faUsers}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Tổng lịch hẹn"
          value={totalBookings}
          icon={faCalendar}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Doanh thu"
          value={`${totalRevenue.toLocaleString()} VNĐ`}
          icon={faMoneyBill}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Nhân viên hoạt động"
          value={activeNurses}
          icon={faUserCheck}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Nút chuyển đổi */}
      <div className="flex gap-3">
        <button
          onClick={() => setViewMode("day")}
          className={`px-4 py-2 rounded-lg ${viewMode === "day" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Theo ngày
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`px-4 py-2 rounded-lg ${viewMode === "month" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Theo tháng
        </button>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">
          Doanh thu & lịch hẹn {viewMode === "day" ? "theo ngày" : "theo tháng"}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="label" />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => Math.round(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => name === 'revenue'
                ? `${value.toLocaleString()} VNĐ`
                : value}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="#413ea0" name="Doanh thu" />
            <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#ff7300" name="Lịch hẹn" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewTab;
