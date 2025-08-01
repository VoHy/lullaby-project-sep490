import authService from '../auth/authService';
import accountService from './accountService';
import walletService from './walletService';
import bookingService from './bookingService';
import blogService from './blogService';
import blogCategoryService from './blogCategoryService';
import feedbackService from './feedbackService';
import roleService from './roleService';
import serviceTypeService from './serviceTypeService';
import zoneService from './zoneService';
import notificationService from './notificationService';
import invoiceService from './invoiceService';
import holidayService from './holidayService';
import workScheduleService from './workScheduleService';
import careProfileService from './careProfileService';
import customerPackageService from './customerPackageService';
import customerTaskService from './customerTaskService';
import medicalNoteService from './medicalNoteService';
import nursingSpecialistService from './nursingSpecialistService';
import nursingSpecialistServiceTypeService from './nursingSpecialistServiceTypeService';
import relativesService from './relativesService';
import serviceTaskService from './serviceTaskService';
import transactionHistoryService from './transactionHistoryService';
import walletHistoryService from './walletHistoryService';
import zoneDetailService from './zoneDetailService';

const apiService = {
  auth: authService,
  account: accountService,
  wallet: walletService,
  booking: bookingService,
  blog: blogService,
  blogCategory: blogCategoryService,
  feedback: feedbackService,
  role: roleService,
  serviceType: serviceTypeService,
  zone: zoneService,
  notification: notificationService,
  invoice: invoiceService,
  holiday: holidayService,
  workSchedule: workScheduleService,
  careProfile: careProfileService,
  customerPackage: customerPackageService,
  customerTask: customerTaskService,
  medicalNote: medicalNoteService,
  nursingSpecialist: nursingSpecialistService,
  nursingSpecialistServiceType: nursingSpecialistServiceTypeService,
  relatives: relativesService,
  serviceTask: serviceTaskService,
  transactionHistory: transactionHistoryService,
  walletHistory: walletHistoryService,
  zoneDetail: zoneDetailService,
};

export default apiService; 