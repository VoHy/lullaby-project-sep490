import authService from '../auth/authService';
import accountService from './accountService';
import walletService from './walletService';
import bookingService from './bookingService';
import blogService from './blogService';
import feedbackService from './feedbackService';
import roleService from './roleService';
import serviceTypeService from './serviceTypeService';
import zoneService from './zoneService';
import notificationService from './notificationService';
import invoiceService from './invoiceService';
import holidayService from './holidayService';
import workScheduleService from './workScheduleService';

const apiService = {
  auth: authService,
  account: accountService,
  wallet: walletService,
  booking: bookingService,
  blog: blogService,
  feedback: feedbackService,
  role: roleService,
  serviceType: serviceTypeService,
  zone: zoneService,
  notification: notificationService,
  invoice: invoiceService,
  holiday: holidayService,
  workSchedule: workScheduleService,
};

export default apiService; 