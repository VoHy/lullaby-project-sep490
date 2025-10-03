"use client";
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaSync,
  FaSearch,
  FaCalendarAlt,
  FaListUl,
} from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import { useWalletContext } from "@/context/WalletContext";
import {
  bookingService,
  serviceTypeService,
  nursingSpecialistService,
  serviceTaskService,
  invoiceService,
  zoneDetailService,
  customizePackageService,
  customizeTaskService,
  careProfileService,
  transactionHistoryService,
} from "@/services/api";
import {
  AppointmentCard,
  AppointmentDetailModal,
  EmptyState,
} from "./components";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { refreshWalletData } = useWalletContext();

  // Helpers
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN");
  const getStatusColor = (status) => {
    // support calling with (status, isSchedule)
    const isSchedule =
      arguments.length > 1 ? arguments[1] : undefined;
    if (
      (status === "paid" || status === "paid") &&
      isSchedule === false
    )
      return "yellow";
    if (
      (status === "paid" || status === "paid") &&
      isSchedule === true
    )
      return "blue";
    switch (status) {
      case "pending":
        return "yellow";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "isScheduled":
        return "blue";
      default:
        return "gray";
    }
  };
  const getStatusText = (status) => {
    // support calling with (status, isSchedule)
    const isSchedule =
      arguments.length > 1 ? arguments[1] : undefined;
    if (isSchedule === false && status === "paid")
      return "Chưa lên lịch";
    switch (status) {
      case "pending":
        return "Chưa thanh toán";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "isScheduled":
        return "Đã lên lịch";
      case "paid":
        return isSchedule ? "Đã lên lịch" : "Chưa lên lịch";
      default:
        return "Không xác định";
    }
  };

  // Filter + sort appointments
  const userAppointments = useMemo(
    () =>
      (appointments || []).filter((a) => a.userID === user?.userID),
    [appointments, user]
  );

  const filteredAppointments = useMemo(() => {
    let filtered = userAppointments;
    if (statusFilter !== "all") {
      if (statusFilter === "isScheduled") {
        // Only show bookings that are paid and have been scheduled
        filtered = filtered.filter(
          (a) =>
            (a.status === "paid" || a.Status === "paid") &&
            a.isSchedule === true
        );
      } else if (statusFilter === "paid") {
        // 'Chưa lên lịch' filter: paid but not scheduled
        filtered = filtered.filter(
          (a) =>
            (a.status === "paid" || a.Status === "paid") &&
            a.isSchedule === false
        );
      } else {
        filtered = filtered.filter(
          (a) => (a.status || a.Status) === statusFilter
        );
      }
    }
    if (searchText) {
      filtered = filtered.filter(
        (a) =>
          a.serviceName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          a.bookingID?.toString().includes(searchText) ||
          a.careProfile?.profileName
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }
    // Ẩn các booking pending nếu còn < 2 giờ đến thời gian làm việc
    const now = new Date();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    filtered = filtered.filter((booking) => {
      const status = booking.status || booking.Status;
      if (status !== "pending") return true;
      const workRaw =
        booking.workdate || booking.Workdate || booking.BookingDate;
      const work = workRaw ? new Date(workRaw) : null;
      if (!work || isNaN(work.getTime())) return true;
      const diffMs = work.getTime() - now.getTime();
      return diffMs > twoHoursMs;
    });

    // Sorting: priority then by workdate ascending
    const getPriority = (b) => {
      const status = String(b.status || b.Status || "").toLowerCase();
      const isSchedule = !!b.isSchedule;

      if (status === "pending" || status === "unpaid") return 0; // needs payment
      if (status === "paid" && isSchedule === false) return 1; // paid but not scheduled
      if (
        isSchedule === true &&
        (status === "paid" || status === "isscheduled")
      )
        return 2; // scheduled
      if (status === "completed") return 3;
      if (status === "cancelled") return 4;
      return 5;
    };

    const toTime = (b) => {
      const raw = b.workdate || b.Workdate || b.BookingDate;
      const t = raw ? new Date(raw).getTime() : NaN;
      return isNaN(t) ? Number.POSITIVE_INFINITY : t;
    };

    const sorted = filtered.slice().sort((a, b) => {
      const pa = getPriority(a);
      const pb = getPriority(b);
      if (pa !== pb) return pa - pb;
      return toTime(a) - toTime(b);
    });

    return sorted;
  }, [userAppointments, statusFilter, searchText]);

  const totalPages = Math.ceil(
    filteredAppointments.length / pageSize
  );
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAppointments.slice(start, start + pageSize);
  }, [filteredAppointments, currentPage, pageSize]);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!user) return router.push("/auth/login");
      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);

        // Lấy careProfiles của user
        const [
          careProfiles,
          services,
          tasks,
          specialists,
          zones,
          invoiceData,
          packages,
          customizeTasksRaw,
        ] = await Promise.all([
          careProfileService.getCareProfilesByAccount(user.accountID),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getAllNursingSpecialists(),
          zoneDetailService.getZoneDetails(),
          invoiceService.getAllInvoices(),
          customizePackageService.getAllCustomizePackages(),
          customizeTaskService.getAllCustomizeTasks(),
        ]);
        console.log("CareProfiles:", careProfiles, "User:", user);
        // Lấy tất cả booking của từng careProfile
        const bookingsArr = await Promise.all(
          careProfiles.map((profile) =>
            bookingService.getAllByCareProfile(profile.careProfileID)
          )
        );
        // Gộp tất cả booking lại thành 1 mảng
        const bookings = bookingsArr.flat();

        const bookingsWithProfile = bookings.map((b) => {
          const profileId = b.careProfileId || b.careProfileID;
          if (!b.careProfile && profileId) {
            const foundProfile = careProfiles.find(
              (p) => p.careProfileID === profileId
            );
            return { ...b, careProfile: foundProfile };
          }
          return b;
        });

        setAppointments(bookingsWithProfile);
        setServiceTypes(services);
        setServiceTasks(tasks);
        setNursingSpecialists(specialists);
        setZoneDetails(zones);
        setInvoices(invoiceData);
        setCustomizePackages(packages);
        setCustomizeTasks(customizeTasksRaw);

        if (!isRefresh) await refreshWalletData();
      } catch (err) {
        setError(`Không thể tải dữ liệu: ${err.message}`);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user, router, refreshWalletData]
  );

  useEffect(() => {
    if (user) fetchData();
  }, [fetchData, user]);

  // Hủy lịch hẹn + hoàn tiền về ví
  const handleCancelWithRefund = useCallback(
    async (appointment) => {
      try {
        const bookingId =
          appointment?.bookingID || appointment?.BookingID;
        if (!bookingId) {
          throw new Error("Không tìm thấy mã đặt lịch");
        }

        // Tìm invoice của booking này
        const invoice = invoices.find(
          (inv) =>
            inv.bookingID === bookingId || inv.BookingID === bookingId
        );

        if (!invoice) {
          throw new Error("Không tìm thấy hóa đơn của booking");
        }

        const invoiceId =
          invoice.invoiceID ||
          invoice.invoice_ID ||
          invoice.InvoiceID;
        if (!invoiceId) {
          throw new Error("Không tìm thấy mã hóa đơn");
        }

        // Gọi API hoàn tiền (endpoint này đã tự cập nhật trạng thái hóa đơn trên server)
        await transactionHistoryService.refundMoneyToWallet(
          parseInt(invoiceId)
        );

        // Refresh data ví và danh sách lịch hẹn
        await Promise.all([refreshWalletData(), fetchData(true)]);
        alert("Hủy lịch hẹn thành công và đã hoàn tiền vào ví.");
      } catch (err) {
        console.error("Cancel with refund failed:", err);
        alert(
          `Không thể hủy/hoàn tiền: ${
            err.message || "Vui lòng thử lại sau."
          }`
        );
      }
    },
    [fetchData, invoices, refreshWalletData]
  );

  if (loading)
    return (
      <LoadingSpinner message="Đang tải lịch hẹn..." fullScreen />
    );
  if (error) {
    if (error.includes("No CareProfiles found")) {
      return (
        <div className="text-center py-8 text-gray-500">
          Bạn chưa có lịch hẹn nào.
          <br />
          Hãy tạo hồ sơ người thân và đặt lịch dịch vụ để bắt đầu trải
          nghiệm!
          <div className="mt-6">
            <button
              onClick={() => router.push("/services")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Đặt lịch ngay
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center text-red-600 py-8">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Lịch hẹn của bạn
          </h1>
        </motion.div>

        {/* View Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-2 rounded-xl shadow-md flex gap-2">
            <button
              onClick={() => router.push("/calendar")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors">
              📅 Hiển thị lịch
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md">
              📋 Chi tiết lịch
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid gap-4 md:grid-cols-2 items-center">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
              placeholder="Tìm kiếm theo mã đặt lịch hoặc tên người thân..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400">
              <FaSearch />
            </span>
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chưa thanh toán</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="isScheduled">Đã lên lịch</option>
            <option value="paid">Chưa lên lịch</option>
          </select>
        </div>

        {/* Appointment List */}
        {paginatedAppointments.length === 0 ? (
          <EmptyState
            onNewAppointment={() => router.push("/services")}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {paginatedAppointments.map((appointment, idx) => (
                <AppointmentCard
                  key={appointment.bookingID || idx}
                  appointment={appointment}
                  index={idx}
                  serviceTypes={serviceTypes}
                  onSelect={setSelectedAppointment}
                  onCancel={handleCancelWithRefund}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold disabled:opacity-50 hover:bg-purple-200 transition-colors"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }>
                  Trước
                </button>
                <span className="font-semibold text-gray-700 px-4">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold disabled:opacity-50 hover:bg-purple-200 transition-colors"
                  disabled={
                    currentPage === totalPages || totalPages === 0
                  }
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }>
                  Sau
                </button>
              </div>
            )}
          </>
        )}

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            serviceTypes={serviceTypes}
            serviceTasks={serviceTasks}
            nursingSpecialists={nursingSpecialists}
            zoneDetails={zoneDetails}
            invoices={invoices}
            customizePackages={customizePackages}
            customizeTasks={customizeTasks}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}
