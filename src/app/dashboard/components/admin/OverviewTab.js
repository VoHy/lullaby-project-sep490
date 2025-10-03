"use client";

<<<<<<< HEAD
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendar, faMoneyBill, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import careProfileService from '@/services/api/careProfileService';
import accountService from '@/services/api/accountService';
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import invoiceService from '@/services/api/invoiceService';
=======
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendar,
  faMoneyBill,
  faUserCheck,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faClock,
  faStar,
  faExclamationTriangle,
  faStethoscope,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
// Thay thế import mock data bằng services
import careProfileService from "@/services/api/careProfileService";
import accountService from "@/services/api/accountService";
import serviceTypeService from "@/services/api/serviceTypeService";
// import customizePackageService from '@/services/api/customizePackageService';
// import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from "@/services/api/serviceTaskService";
import nursingSpecialistService from "@/services/api/nursingSpecialistService";

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10

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
<<<<<<< HEAD
        const [, accountsData, , , nursingSpecialistsData, invoicesData] = await Promise.all([
=======

        const [
          careProfilesData,
          serviceTypesData,
          // customizePackagesData,
          // customizeTasksData,
          serviceTasksData,
          nursingSpecialistsData,
        ] = await Promise.all([
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
          careProfileService.getCareProfiles(),
          accountService.getAllAccounts(),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists(),
<<<<<<< HEAD
          invoiceService.getAllInvoices(),
=======
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
        ]);
        setAccounts(accountsData);
        setNursingSpecialists(nursingSpecialistsData);
<<<<<<< HEAD
        setInvoices(invoicesData);
      } catch (e) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
=======
      } catch (error) {
        console.error("Error fetching admin overview data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

<<<<<<< HEAD
=======
  function getBookingDetail(booking) {
    const careProfile = careProfiles.find(
      (c) => c.CareProfileID === booking.CareProfileID
    );
    const account = accounts.find(
      (a) => a.AccountID === careProfile?.AccountID
    );
    let service = null;
    let packageInfo = null;
    // if (booking.CustomizePackageID) {
    //   packageInfo = customizePackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
    //   service = serviceTypes.find(s => s.ServiceID === packageInfo?.ServiceID);
    // } else if (booking.CareProfileID) {
    service = serviceTypes.find(
      (s) => s.ServiceID === booking.CareProfileID
    );
    // }
    // const customizeTasksOfBooking = customizeTasks.filter(t => t.BookingID === booking.BookingID);
    const serviceTasksOfBooking = serviceTasks.filter(
      (t) => t.BookingID === booking.BookingID
    );
    const serviceTask = serviceTasks.find(
      (st) => st.ServiceTaskID === serviceTasksOfBooking.ServiceTaskID
    );
    const nurse = nursingSpecialists.find(
      (n) => n.NursingID === serviceTask.NursingID
    );
    return {
      ...serviceTask,
      price: serviceTask.Price,
      quantity: serviceTask.Quantity,
      total: serviceTask.Total,
      status: serviceTask.Status,
      nurseName: nurse?.FullName,
      nurseRole: nurse?.Major,
    };
    // });
    return {
      careProfile,
      account,
      service,
      packageInfo,
      serviceTasksOfBooking,
    };
  }

  const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const {
      careProfile,
      account,
      service,
      packageInfo,
      serviceTasksOfBooking,
    } = getBookingDetail(booking);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold"
            onClick={onClose}>
            &times;
          </button>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">
              Chi tiết Booking #{booking.BookingID}
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Tên:</span>{" "}
                    {careProfile?.ProfileName} ({account?.full_name})
                  </div>
                  <div>
                    <span className="font-medium">Điện thoại:</span>{" "}
                    {careProfile?.PhoneNumber}
                  </div>
                  <div>
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {careProfile?.Address}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">
                  Thông tin dịch vụ
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Dịch vụ:</span>{" "}
                    {packageInfo
                      ? packageInfo.Name
                      : service?.ServiceName || "-"}
                  </div>
                  {packageInfo && (
                    <div>
                      <span className="font-medium">Mô tả:</span>{" "}
                      {packageInfo.Description}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Ngày đặt:</span>{" "}
                    {booking.CreatedAt
                      ? new Date(booking.CreatedAt).toLocaleString(
                          "vi-VN"
                        )
                      : "-"}
                  </div>
                  <div>
                    <span className="font-medium">
                      Ngày thực hiện:
                    </span>{" "}
                    {booking.WorkDate
                      ? new Date(booking.WorkDate).toLocaleString(
                          "vi-VN"
                        )
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Trạng thái & Giá tiền
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.Status === "completed"
                          ? "bg-green-100 text-green-700"
                          : booking.Status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {booking.Status === "completed"
                        ? "Hoàn thành"
                        : booking.Status === "pending"
                        ? "Đang xử lý"
                        : "Đã hủy"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="text-lg font-bold text-green-600">
                      {booking.Amount?.toLocaleString("vi-VN") || "-"}{" "}
                      VND
                    </span>
                  </div>
                </div>
              </div>

              {serviceTasksOfBooking.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Danh sách dịch vụ
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                      {serviceTasksOfBooking.map((task, idx) => (
                        <li
                          key={idx}
                          className="bg-white p-3 rounded-lg border">
                          <div className="font-medium text-sm">
                            {task?.Description}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                            <span className="font-medium">
                              {task?.price?.toLocaleString()}đ
                            </span>
                            {task.nurseName && (
                              <span className="text-blue-700">
                                - {task.nurseName} ({task.nurseRole})
                              </span>
                            )}
                            {task.status && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  task.status === "active"
                                    ? "bg-blue-100 text-blue-700"
                                    : task.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                {task.status}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300"
              onClick={onClose}>
              Đóng
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Cập nhật trạng thái
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
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
<<<<<<< HEAD
        <div className="text-red-500 text-6xl mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
=======
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Có lỗi xảy ra
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
          Thử lại
        </button>
      </div>
    );
  }

<<<<<<< HEAD
  const StatCard = ({ title, value, icon, color, subtitle }) => (
=======
  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
    trendValue,
    subtitle,
  }) => (
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <FontAwesomeIcon
            icon={icon}
            className="text-white text-xl"
          />
        </div>
<<<<<<< HEAD
=======
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
            <FontAwesomeIcon
              icon={trend === "up" ? faArrowUp : faArrowDown}
              className="mr-1"
            />
            {trendValue}
          </div>
        )}
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );

  // Thống kê
  const totalUsers = accounts?.length || 0;
  const totalBookings = bookings?.length || 0;
<<<<<<< HEAD
  const totalRevenue = Array.isArray(invoices)
    ? invoices.reduce((sum, inv) => {
      const status = inv?.status ?? inv?.Status;
      const isPaid = status === true || String(status).toLowerCase() === 'paid' || String(status).toLowerCase() === 'completed' || String(status).toLowerCase() === 'success';
      return isPaid ? sum + Number(inv?.totalAmount ?? inv?.TotalAmount ?? 0) : sum;
    }, 0)
    : 0;
  const activeNurses = (nursingSpecialists || []).filter(n => String(n?.status ?? n?.Status).toLowerCase() === 'active').length;
=======
  const totalRevenue = revenue?.total || 0;
  const activeNurses =
    nursingSpecialists?.filter((n) => n.Status === "active").length ||
    0;
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10

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
<<<<<<< HEAD
          subtitle={viewMode === "day" ? "So với hôm qua" : "So với tháng trước"}
=======
          trend="up"
          trendValue="+12%"
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
        />
        <StatCard
          title="Tổng lịch hẹn"
          value={totalBookings}
          icon={faCalendar}
          color="from-green-500 to-emerald-500"
<<<<<<< HEAD
          subtitle={viewMode === "day" ? "So với hôm qua" : "So với tháng trước"}
=======
          trend="up"
          trendValue="+8%"
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
        />
        <StatCard
          title="Doanh thu"
          value={formatCurrency(totalRevenue)}
          icon={faMoneyBill}
          color="from-purple-500 to-pink-500"
<<<<<<< HEAD
          subtitle={viewMode === "day" ? "So với hôm qua" : "So với tháng trước"}
=======
          trend="up"
          trendValue="+15%"
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
        />
        <StatCard
          title="Nhân viên hoạt động"
          value={activeNurses}
          icon={faUserCheck}
          color="from-orange-500 to-red-500"
<<<<<<< HEAD
          subtitle={viewMode === "day" ? "So với hôm qua" : "So với tháng trước"}
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
=======
          trend="up"
          trendValue="+5%"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Booking gần đây
          </h3>
          <button className="text-pink-600 hover:text-pink-700 font-semibold">
            Xem tất cả →
          </button>
        </div>

        <div className="space-y-4">
          {recentBookings.length > 0 ? (
            recentBookings.map((booking) => {
              const { careProfile, account, service, packageInfo } =
                getBookingDetail(booking);
              return (
                <div
                  key={booking.BookingID}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {careProfile?.ProfileName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {careProfile?.ProfileName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {packageInfo
                          ? packageInfo.Name
                          : service?.ServiceName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {booking.Amount?.toLocaleString()} VNĐ
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.CreatedAt
                        ? new Date(
                            booking.CreatedAt
                          ).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.Status === "completed"
                          ? "bg-green-100 text-green-700"
                          : booking.Status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {booking.Status === "completed"
                        ? "Hoàn thành"
                        : booking.Status === "pending"
                        ? "Đang xử lý"
                        : "Đã hủy"}
                    </span>
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-pink-600 hover:text-pink-700">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-4xl text-gray-300 mb-4"
              />
              <p className="text-gray-500">Chưa có booking nào</p>
            </div>
          )}
        </div>
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
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
