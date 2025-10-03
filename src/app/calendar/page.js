"use client";
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaListUl,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import { bookingService, careProfileService } from "@/services/api";
import CalendarGrid from "./components/CalendarGrid";
import AppointmentModal from "./components/AppointmentModal";
import { getMonthData, formatDate } from "./utils/dateUtils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CalendarPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user } = useContext(AuthContext);

  // Lấy dữ liệu appointments
  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Lấy careProfiles của user
      const careProfiles =
        await careProfileService.getCareProfilesByAccount(
          user.accountID
        );

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

      // Lọc chỉ lấy appointments của user hiện tại và loại bỏ lịch đã hủy
      const userAppointments = bookingsWithProfile.filter((a) => {
        const status = (a.status || a.Status || "").toLowerCase();
        return a.userID === user?.userID && status !== "cancelled";
      });
      setAppointments(userAppointments);
    } catch (err) {
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Lấy dữ liệu tháng hiện tại
  const monthData = useMemo(
    () => getMonthData(currentMonth, appointments),
    [currentMonth, appointments]
  );

  // Chuyển tháng
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Xử lý click vào ngày
  const handleDateClick = (date, dayAppointments) => {
    setSelectedDate(date);
    // Nếu có lịch hẹn trong ngày, hiển thị modal danh sách
    if (dayAppointments.length > 0) {
      // Tạo một appointment đặc biệt để hiển thị danh sách
      setSelectedAppointment({
        isDateView: true,
        date: date,
        appointments: dayAppointments,
      });
    }
  };

  if (loading)
    return <LoadingSpinner message="Đang tải lịch..." fullScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center text-red-600 py-8">{error}</div>
      </div>
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
            Lịch
          </h1>
          <p className="text-gray-600 mt-2">Những lịch hẹn đã đặt</p>
        </motion.div>

        {/* View Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-2 rounded-xl shadow-md flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md">
              <FaCalendarAlt />
              Hiển thị lịch
            </button>
            <button
              onClick={() => router.push("/appointments")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors">
              <FaListUl />
              Chi tiết lịch
            </button>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex items-center justify-between p-6 border-b">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FaChevronLeft className="text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800">
              tháng {currentMonth.getMonth() + 1}{" "}
              {currentMonth.getFullYear()}
            </h2>

            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <CalendarGrid
            monthData={monthData}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onAppointmentClick={setSelectedAppointment}
          />
        </div>

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </div>
    </div>
  );
}
