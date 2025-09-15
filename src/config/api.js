// API Configuration
export const API_BASE_URL = 'https://phamlequyanh.name.vn/api';

// API Endpoints mapping, aligned to Swagger paths (controller bases only).
// Service modules will append concrete actions such as /getall, /update/{id}, ...
export const API_ENDPOINTS = {
  // Accounts/Auth
  ACCOUNTS: '/accounts',
  LOGIN: '/accounts/login',

  // Nursing Specialists
  NURSING_SPECIALISTS: '/nursingspecialists',
  NURSING_SPECIALIST_SERVICE_TYPES: '/nursingspecialist-servicetype',

  // Bookings
  BOOKINGS: '/Booking',

  // Services
  SERVICE_TYPES: '/servicetypes',
  SERVICE_TASKS: '/servicetasks',

  // Zones
  ZONES: '/zones',
  ZONE_DETAILS: '/zonedetails',

  // Care Profiles
  CARE_PROFILES: '/careprofiles',

  // Customize
  CUSTOMIZE_PACKAGES: '/CustomizePackage',
  CUSTOMIZE_TASKS: '/CustomizeTask',

  // Blog
  BLOGS: '/Blog',
  BLOG_CATEGORIES: '/BlogCategory',

  // Feedback
  FEEDBACK: '/Feedback',

  // Holiday
  HOLIDAYS: '/Holiday',

  // Invoice
  INVOICES: '/Invoice',

  // Medical Notes
  MEDICAL_NOTES: '/MedicalNote',

  // Notifications
  NOTIFICATIONS: '/Notification',

  // Payment / PayOS Web
  PAYOS: '/PayOS',

  // Relatives
  RELATIVES: '/relatives',

  // Roles
  ROLES: '/roles',

  // Transaction History
  TRANSACTION_HISTORY: '/TransactionHistory',

  // Wallet
  WALLET: '/Wallet',

  // Wishlist (Favorites)
  WISHLIST: '/Wishlist',

  // Work Schedules
  WORK_SCHEDULES: '/WorkSchedule'
};
