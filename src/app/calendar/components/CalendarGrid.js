import React from "react";
import { formatDate, isSameDay, isToday } from "../utils/dateUtils";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function CalendarGrid({
    monthData,
    selectedDate,
    onDateClick,
    onAppointmentClick,
}) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "paid":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "Chưa thanh toán";
            case "paid":
                return "Lịch hẹn";
            case "completed":
                return "Hoàn thành";
            case "cancelled":
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    };

    return (
        <div className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
                {WEEKDAYS.map((day) => (
                    <div
                        key={day}
                        className="text-center py-2 text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {monthData.map((week, weekIndex) =>
                    week.map((day, dayIndex) => {
                        const isCurrentMonth = day.isCurrentMonth;
                        const isSelected =
                            selectedDate && isSameDay(day.date, selectedDate);
                        const isTodayDate = isToday(day.date);

                        return (
                            <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`
                  min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors
                  ${!isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
                  ${isSelected ? "ring-2 ring-purple-500" : ""}
                  ${isTodayDate ? "bg-blue-50" : ""}
                `}
                                onClick={() =>
                                    onDateClick(day.date, day.appointments)
                                }>
                                <div
                                    className={`
                  text-sm font-medium mb-1
                  ${isTodayDate ? "text-blue-600" : ""}
                `}>
                                    {day.date.getDate()}
                                </div>

                                {/* Appointments */}
                                <div className="space-y-1">
                                    {day.appointments
                                        .slice(0, 3)
                                        .map((appointment, idx) => (
                                            <div
                                                key={idx}
                                                className={`
                        text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80
                        ${getStatusColor(
                                                    appointment.status || appointment.Status
                                                )}
                      `}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Click vào appointment cụ thể sẽ hiển thị chi tiết appointment đó
                                                    onAppointmentClick(appointment);
                                                }}
                                                title={`${appointment.careProfile?.profileName
                                                    } - ${getStatusText(
                                                        appointment.status || appointment.Status
                                                    )}`}>
                                                {appointment.careProfile?.profileName ||
                                                    "Lịch hẹn"}
                                            </div>
                                        ))}

                                    {day.appointments.length > 3 && (
                                        <div
                                            className="text-xs text-purple-600 px-2 cursor-pointer hover:text-purple-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Click vào "+X lịch khác" sẽ hiển thị tất cả lịch trong ngày
                                                onDateClick(day.date, day.appointments);
                                            }}>
                                            +{day.appointments.length - 3} lịch khác
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}