import React from "react";
import {
  FaTimes,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarDay,
} from "react-icons/fa";
import { formatDate, formatTime } from "../utils/dateUtils";

export default function AppointmentModal({ appointment, onClose }) {
  if (!appointment) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chưa thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Nếu là view ngày (nhiều lịch hẹn)
  if (appointment.isDateView) {
    // Sắp xếp appointments theo thời gian bắt đầu (workdate)
    const sortedAppointments = [...appointment.appointments].sort(
      (a, b) => {
        const timeA = new Date(
          a.workdate || a.Workdate || a.BookingDate
        );
        const timeB = new Date(
          b.workdate || b.Workdate || b.BookingDate
        );
        return timeA - timeB; // Sắp xếp từ sớm nhất đến muộn nhất
      }
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <FaCalendarDay className="text-purple-500 text-xl" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Lịch hẹn ngày
                </h2>
                <p className="text-gray-600">
                  {formatDate(appointment.date)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content - Danh sách lịch hẹn đã sắp xếp */}
          <div className="p-6">
            <div className="space-y-4">
              {sortedAppointments.map((appt, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-purple-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {appt.careProfile?.profileName ||
                            "Không xác định"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mã: #{appt.bookingID || appt.BookingID}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        appt.status || appt.Status
                      )}`}>
                      {getStatusText(appt.status || appt.Status)}
                    </div>
                  </div>

                  {/* Service */}
                  {appt.serviceName && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">
                        Dịch vụ:{" "}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {appt.serviceName}
                      </span>
                    </div>
                  )}

                  {/* Time với Start Time và End Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaClock className="text-gray-400" />
                    <div className="flex flex-col">
                      <span>
                        {formatDate(
                          appt.workdate ||
                            appt.Workdate ||
                            appt.BookingDate
                        )}
                      </span>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            Bắt đầu:
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            {formatTime(
                              appt.workdate || appt.Workdate
                            ) || "08:00"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            Kết thúc:
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            {formatTime(
                              appt.endTime || appt.EndTime
                            ) || "17:00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {appt.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                      <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                      <span className="line-clamp-2">
                        {appt.address}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View chi tiết một lịch hẹn
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết lịch hẹn
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Booking ID */}
          <div>
            <label className="text-sm font-medium text-gray-500">
              Mã đặt lịch
            </label>
            <p className="text-lg font-semibold text-gray-800">
              #{appointment.bookingID || appointment.BookingID}
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-500">
              Trạng thái
            </label>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getStatusColor(
                appointment.status || appointment.Status
              )}`}>
              {getStatusText(
                appointment.status || appointment.Status
              )}
            </div>
          </div>

          {/* Care Profile */}
          {appointment.careProfile && (
            <div className="flex items-center gap-3">
              <FaUser className="text-purple-500" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Người được chăm sóc
                </label>
                <p className="font-semibold text-gray-800">
                  {appointment.careProfile.profileName}
                </p>
              </div>
            </div>
          )}

          {/* Date & Time với Start Time và End Time */}
          <div className="flex items-start gap-3">
            <FaClock className="text-purple-500 mt-1" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">
                Thời gian
              </label>
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {formatDate(
                    appointment.workdate ||
                      appointment.Workdate ||
                      appointment.BookingDate
                  )}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Bắt đầu:</span>
                    <span className="font-medium text-gray-700">
                      {formatTime(
                        appointment.workdate || appointment.Workdate
                      ) || "08:00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Kết thúc:</span>
                    <span className="font-medium text-gray-700">
                      {formatTime(
                        appointment.endTime || appointment.EndTime
                      ) || "17:00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service */}
          {appointment.serviceName && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Dịch vụ
              </label>
              <p className="font-semibold text-gray-800">
                {appointment.serviceName}
              </p>
            </div>
          )}

          {/* Address */}
          {appointment.address && (
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-purple-500 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Địa chỉ
                </label>
                <p className="text-gray-800">{appointment.address}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Ghi chú
              </label>
              <p className="text-gray-800">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
