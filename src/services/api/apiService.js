import accountService from './accountService';
import walletService from './walletService';
// import bookingService from './bookingService';
import blogService from './blogService';
import blogCategoryService from './blogCategoryService';
import feedbackService from './feedbackService';
import roleService from './roleService';
import serviceTypeService from './serviceTypeService';
import zoneService from './zoneService';
import notificationService from './notificationService';
import invoiceService from './invoiceService';
import holidayService from './holidayService';
// import workScheduleService from './workScheduleService';
import careProfileService from './careProfileService';
// import customizePackageService from './customizePackageService';
// import customizeTaskService from './customizeTaskService';
import medicalNoteService from './medicalNoteService';
import nursingSpecialistService from './nursingSpecialistService';
import nursingSpecialistServiceTypeService from './nursingSpecialistServiceTypeService';
import relativesService from './relativesService';
import serviceTaskService from './serviceTaskService';
import transactionHistoryService from './transactionHistoryService';
import payOSService from './payOSService';
import zoneDetailService from './zoneDetailService';

// Utility function để lấy token từ localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Utility function để tạo headers với token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth service functions - gọi trực tiếp API thay vì qua authService
const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Sai thông tin đăng nhập');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Sai thông tin đăng nhập');
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch('/api/accounts/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  },

  loginWithGoogle: async (googleToken) => {
    try {
      const response = await fetch('/api/accounts/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập Google thất bại');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Đăng nhập Google thất bại');
    }
  }
};

const apiService = {
  auth: authService,
  account: accountService,
  wallet: walletService,
  // booking: bookingService,
  blog: blogService,
  blogCategory: blogCategoryService,
  feedback: feedbackService,
  role: roleService,
  serviceType: serviceTypeService,
  zone: zoneService,
  notification: notificationService,
  invoice: invoiceService,
  holiday: holidayService,
  // workSchedule: workScheduleService,
  careProfile: careProfileService,
  // customizePackage: customizePackageService,
  // customizeTask: customizeTaskService,
  medicalNote: medicalNoteService,
  nursingSpecialist: nursingSpecialistService,
  nursingSpecialistServiceType: nursingSpecialistServiceTypeService,
  relatives: relativesService,
  serviceTask: serviceTaskService,
  transactionHistory: transactionHistoryService,
  payOS: payOSService,
  zoneDetail: zoneDetailService,
  // Utility functions
  getAuthToken,
  getAuthHeaders,
};

export default apiService; 