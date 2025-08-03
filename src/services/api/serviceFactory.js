// Simple Service Factory - Tạo service với pattern đơn giản
const createService = (endpoint, entityName, isCustomEndpoint = false) => {
  const baseUrl = `/api/${endpoint}`;
  
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
  
  // Xác định method name dựa trên entityName
  const getMethodName = () => {
    if (entityName === 'Account') return 'getAllAccounts';
    if (entityName === 'Blog') return 'getBlogs';
    if (entityName === 'Booking') return 'getBookingServices';
    if (entityName === 'CareProfile') return 'getCareProfiles';
    if (entityName === 'CustomerPackage') return 'getCustomerPackages';
    if (entityName === 'CustomerTask') return 'getCustomerTasks';
    if (entityName === 'Feedback') return 'getFeedbacks';
    if (entityName === 'Holiday') return 'getHolidays';
    if (entityName === 'Invoice') return 'getInvoices';
    if (entityName === 'MedicalNote') return 'getMedicalNotes';
    if (entityName === 'Notification') return 'getNotifications';
    if (entityName === 'NursingSpecialist') return 'getNursingSpecialists';
    if (entityName === 'Relative') return 'getRelatives';
    if (entityName === 'ServiceTask') return 'getServiceTasks';
    if (entityName === 'ServiceType') return 'getServiceTypes';
    if (entityName === 'TransactionHistory') return 'getTransactionHistories';
    // if (entityName === 'Wallet') return 'getWallets';
    // if (entityName === 'WalletHistory') return 'getWalletHistories';
    if (entityName === 'WorkSchedule') return 'getWorkSchedules';
    if (entityName === 'BlogCategory') return 'getBlogCategories';
    if (entityName === 'NursingSpecialistServiceType') return 'getNursingSpecialistServiceTypes';
    if (entityName === 'Role') return 'getRoles';
    if (entityName === 'Zone') return 'getZones';
    if (entityName === 'ZoneDetail') return 'getZoneDetails';
    // Default pattern
    return `get${entityName}s`;
  };
  
  const getByIdMethodName = () => {
    if (entityName === 'Account') return 'getAccount';
    if (entityName === 'Blog') return 'getBlogById';
    if (entityName === 'Booking') return 'getBookingServiceById';
    if (entityName === 'CareProfile') return 'getCareProfileById';
    if (entityName === 'CustomerPackage') return 'getCustomerPackageById';
    if (entityName === 'CustomerTask') return 'getCustomerTaskById';
    if (entityName === 'Feedback') return 'getFeedbackById';
    if (entityName === 'Holiday') return 'getHolidayById';
    if (entityName === 'Invoice') return 'getInvoiceById';
    if (entityName === 'MedicalNote') return 'getMedicalNoteById';
    if (entityName === 'Notification') return 'getNotificationById';
    if (entityName === 'NursingSpecialist') return 'getNursingSpecialistById';
    if (entityName === 'Relative') return 'getRelativeById';
    if (entityName === 'ServiceTask') return 'getServiceTaskById';
    if (entityName === 'ServiceType') return 'getServiceTypeById';
    if (entityName === 'TransactionHistory') return 'getTransactionHistoryById';
    // if (entityName === 'Wallet') return 'getWalletById';
    // if (entityName === 'WalletHistory') return 'getWalletHistoryById';
    if (entityName === 'WorkSchedule') return 'getWorkScheduleById';
    if (entityName === 'BlogCategory') return 'getBlogCategoryById';
    if (entityName === 'NursingSpecialistServiceType') return 'getNursingSpecialistServiceTypeById';
    if (entityName === 'Role') return 'getRoleById';
    if (entityName === 'Zone') return 'getZoneById';
    if (entityName === 'ZoneDetail') return 'getZoneDetailById';
    // Default pattern
    return `get${entityName}ById`;
  };
  
  const createMethodName = () => {
    if (entityName === 'Account') return 'createAccount';
    if (entityName === 'Blog') return 'createBlog';
    if (entityName === 'Booking') return 'createBookingService';
    if (entityName === 'CareProfile') return 'createCareProfile';
    if (entityName === 'CustomerPackage') return 'createCustomerPackage';
    if (entityName === 'CustomerTask') return 'createCustomerTask';
    if (entityName === 'Feedback') return 'createFeedback';
    if (entityName === 'Holiday') return 'createHoliday';
    if (entityName === 'Invoice') return 'createInvoice';
    if (entityName === 'MedicalNote') return 'createMedicalNote';
    if (entityName === 'Notification') return 'createNotification';
    if (entityName === 'NursingSpecialist') return 'createNursingSpecialist';
    if (entityName === 'Relative') return 'createRelative';
    if (entityName === 'ServiceTask') return 'createServiceTask';
    if (entityName === 'ServiceType') return 'createServiceType';
    if (entityName === 'TransactionHistory') return 'createTransactionHistory';
    // if (entityName === 'Wallet') return 'createWallet';
    // if (entityName === 'WalletHistory') return 'createWalletHistory';
    if (entityName === 'WorkSchedule') return 'createWorkSchedule';
    if (entityName === 'BlogCategory') return 'createBlogCategory';
    if (entityName === 'NursingSpecialistServiceType') return 'createNursingSpecialistServiceType';
    if (entityName === 'Role') return 'createRole';
    if (entityName === 'Zone') return 'createZone';
    if (entityName === 'ZoneDetail') return 'createZoneDetail';
    // Default pattern
    return `create${entityName}`;
  };
  
  const updateMethodName = () => {
    if (entityName === 'Account') return 'updateAccount';
    if (entityName === 'Blog') return 'updateBlog';
    if (entityName === 'Booking') return 'updateBookingService';
    if (entityName === 'CareProfile') return 'updateCareProfile';
    if (entityName === 'CustomerPackage') return 'updateCustomerPackage';
    if (entityName === 'CustomerTask') return 'updateCustomerTask';
    if (entityName === 'Feedback') return 'updateFeedback';
    if (entityName === 'Holiday') return 'updateHoliday';
    if (entityName === 'Invoice') return 'updateInvoice';
    if (entityName === 'MedicalNote') return 'updateMedicalNote';
    if (entityName === 'Notification') return 'updateNotification';
    if (entityName === 'NursingSpecialist') return 'updateNursingSpecialist';
    if (entityName === 'Relative') return 'updateRelative';
    if (entityName === 'ServiceTask') return 'updateServiceTask';
    if (entityName === 'ServiceType') return 'updateServiceType';
    if (entityName === 'TransactionHistory') return 'updateTransactionHistory';
    // if (entityName === 'Wallet') return 'updateWallet';
    // if (entityName === 'WalletHistory') return 'updateWalletHistory';
    if (entityName === 'WorkSchedule') return 'updateWorkSchedule';
    if (entityName === 'BlogCategory') return 'updateBlogCategory';
    if (entityName === 'NursingSpecialistServiceType') return 'updateNursingSpecialistServiceType';
    if (entityName === 'Role') return 'updateRole';
    if (entityName === 'Zone') return 'updateZone';
    if (entityName === 'ZoneDetail') return 'updateZoneDetail';
    // Default pattern
    return `update${entityName}`;
  };
  
  const deleteMethodName = () => {
    if (entityName === 'Account') return 'deleteAccount';
    if (entityName === 'Blog') return 'deleteBlog';
    if (entityName === 'Booking') return 'deleteBookingService';
    if (entityName === 'CareProfile') return 'deleteCareProfile';
    if (entityName === 'CustomerPackage') return 'deleteCustomerPackage';
    if (entityName === 'CustomerTask') return 'deleteCustomerTask';
    if (entityName === 'Feedback') return 'deleteFeedback';
    if (entityName === 'Holiday') return 'deleteHoliday';
    if (entityName === 'Invoice') return 'deleteInvoice';
    if (entityName === 'MedicalNote') return 'deleteMedicalNote';
    if (entityName === 'Notification') return 'deleteNotification';
    if (entityName === 'NursingSpecialist') return 'deleteNursingSpecialist';
    if (entityName === 'Relative') return 'deleteRelative';
    if (entityName === 'ServiceTask') return 'deleteServiceTask';
    if (entityName === 'ServiceType') return 'deleteServiceType';
    if (entityName === 'TransactionHistory') return 'deleteTransactionHistory';
    if (entityName === 'Wallet') return 'deleteWallet';
    if (entityName === 'WalletHistory') return 'deleteWalletHistory';
    if (entityName === 'WorkSchedule') return 'deleteWorkSchedule';
    if (entityName === 'BlogCategory') return 'deleteBlogCategory';
    if (entityName === 'NursingSpecialistServiceType') return 'deleteNursingSpecialistServiceType';
    if (entityName === 'Role') return 'deleteRole';
    if (entityName === 'Zone') return 'deleteZone';
    if (entityName === 'ZoneDetail') return 'deleteZoneDetail';
    // Default pattern
    return `delete${entityName}`;
  };
  
  const countMethodName = () => {
    if (entityName === 'Account') return 'getAccountCount';
    if (entityName === 'NursingSpecialist') return 'getNursingSpecialistCount';
    if (entityName === 'ServiceType') return 'getServiceTypeCount';
    if (entityName === 'Zone') return 'getZoneCount';
    if (entityName === 'Relative') return 'getRelativeCount';
    if (entityName === 'CareProfile') return 'getCareProfileCount';
    // Default pattern
    return `get${entityName}Count`;
  };
  
  return {
    [getMethodName()]: async () => {
      const url = isCustomEndpoint ? `${baseUrl}/getall` : baseUrl;
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Không thể lấy danh sách ${entityName.toLowerCase()}`);
      return data;
    },
    [getByIdMethodName()]: async (id) => {
      const url = isCustomEndpoint ? `${baseUrl}/get/${id}` : `${baseUrl}/${id}`;
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Không thể lấy thông tin ${entityName.toLowerCase()}`);
      return data;
    },
    [createMethodName()]: async (data) => {
      const url = isCustomEndpoint ? `${baseUrl}/create` : baseUrl;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Tạo ${entityName.toLowerCase()} thất bại`);
      return result;
    },
    [updateMethodName()]: async (id, data) => {
      const url = isCustomEndpoint ? `${baseUrl}/update/${id}` : `${baseUrl}/${id}`;
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || `Cập nhật ${entityName.toLowerCase()} thất bại`);
      }
      return result;
    },
    [deleteMethodName()]: async (id) => {
      const url = isCustomEndpoint ? `${baseUrl}/delete/${id}` : `${baseUrl}/${id}`;
      const res = await fetch(url, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Xóa ${entityName.toLowerCase()} thất bại`);
      return result;
    },
    [countMethodName()]: async () => {
      const url = `${baseUrl}/count`;
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Không thể lấy số lượng ${entityName.toLowerCase()}`);
      return data;
    }
  };
};

export { createService };