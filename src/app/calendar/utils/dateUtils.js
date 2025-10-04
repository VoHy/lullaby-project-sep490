// Format date to Vietnamese locale
export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
};

// Format time to HH:mm (chỉ giờ và phút)
export const formatTime = (timeStr) => {
    if (!timeStr) return "";

    try {
        // Nếu timeStr có định dạng ISO (2025-10-01T09:00:00 hoặc 2025-10-01T10:40:00)
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return "";

        // Trả về giờ:phút theo định dạng 24h
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    } catch (error) {
        return "";
    }
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
};

// Check if date is today
export const isToday = (date) => {
    return isSameDay(date, new Date());
};

// Get calendar month data with appointments
export const getMonthData = (currentMonth, appointments) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from Monday of the week containing the first day
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
    startDate.setDate(firstDay.getDate() + mondayOffset);

    // Create calendar grid (6 weeks x 7 days = 42 days)
    const weeks = [];
    const currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
        const days = [];

        for (let day = 0; day < 7; day++) {
            const date = new Date(currentDate);
            const isCurrentMonth = date.getMonth() === month;

            // Find appointments for this day
            const dayAppointments = appointments.filter((appointment) => {
                const appointmentDate = new Date(
                    appointment.workdate ||
                    appointment.Workdate ||
                    appointment.BookingDate
                );
                return isSameDay(date, appointmentDate);
            });

            days.push({
                date,
                isCurrentMonth,
                appointments: dayAppointments,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        weeks.push(days);
    }

    return weeks;
};

// Get month name in Vietnamese
export const getMonthName = (monthIndex) => {
    const months = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ];
    return months[monthIndex];
};