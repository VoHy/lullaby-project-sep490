import authService from '../auth/authService';
import userService from '../user/userService';
import nurseService from '../nurse/nurseService';
import bookingService from '../booking/bookingService';
import paymentService from '../payment/paymentService';
import medicalReportService from '../medical/medicalReportService';
import blogService from './blogService';
import feedbackService from './feedbackService';
import managerService from './managerService';
import relativesService from './relativesService';
import roleService from './roleService';
import serviceTypeService from './serviceTypeService';
import holidayService from './holidayService';
import invoiceService from './invoiceService';
import notificationService from './notificationService';
import packageService from './packageService';
import packageServiceTypeService from './packageServiceTypeService';
import workScheduleService from './workScheduleService';
import zoneService from './zoneService';

// Tập hợp tất cả các service để dễ dàng import
const apiService = {
  auth: authService,
  user: userService,
  nurse: nurseService,
  booking: bookingService,
  payment: paymentService,
  medicalReport: medicalReportService,
  blog: blogService,
  feedback: feedbackService,
  manager: managerService,
  relatives: relativesService,
  role: roleService,
  serviceType: serviceTypeService,
  holiday: holidayService,
  invoice: invoiceService,
  notification: notificationService,
  package: packageService,
  packageServiceType: packageServiceTypeService,
  workSchedule: workScheduleService,
  zone: zoneService,
};

export default apiService; 