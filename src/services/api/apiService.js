import authService from '../auth/authService';
import userService from '../user/userService';
import nurseService from '../nurse/nurseService';
import bookingService from '../booking/bookingService';
import paymentService from '../payment/paymentService';
import medicalReportService from '../medical/medicalReportService';

// Tập hợp tất cả các service để dễ dàng import
const apiService = {
  auth: authService,
  user: userService,
  nurse: nurseService,
  booking: bookingService,
  payment: paymentService,
  medicalReport: medicalReportService,
};

export default apiService; 