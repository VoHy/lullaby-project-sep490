# 🔄 **Kế hoạch tích hợp API vào Pages**

## 📊 **Phân tích hiện trạng:**

### ✅ **Đã tích hợp API:**
1. **Wallet** - Sử dụng `walletService` ✅
2. **Services** - Sử dụng `customerPackageService`, `serviceTypeService` ✅
3. **Admin Dashboard** - Sử dụng `accountService`, `nursingSpecialistService` ✅
4. **Care Profile** - Sử dụng `careProfileService` ✅

### ❌ **Cần tích hợp API (đang dùng mock data):**

#### **1. Booking Page** 📅
- **File**: `src/app/booking/page.js`
- **Mock data hiện tại**: `serviceTypes`, `serviceTasks`, `workSchedules`, `nursingSpecialists`, `careProfiles`
- **API cần tích hợp**:
  - `serviceTypeService.getServiceTypes()`
  - `serviceTaskService.getServiceTasks()`
  - `workScheduleService.getWorkSchedules()`
  - `nursingSpecialistService.getNursingSpecialists()`
  - `careProfileService.getCareProfiles()`

#### **2. Payment Pages** 💳
- **Files**: `src/app/payment/page.js`, `src/app/payment/history/page.js`
- **Mock data hiện tại**: `serviceTasks`, `serviceTypes`, `nursingSpecialists`, `careProfiles`, `invoices`
- **API cần tích hợp**:
  - `serviceTaskService.getServiceTasks()`
  - `serviceTypeService.getServiceTypes()`
  - `nursingSpecialistService.getNursingSpecialists()`
  - `careProfileService.getCareProfiles()`
  - `invoiceService.getInvoices()`

#### **3. Team Page** 👥
- **File**: `src/app/team/page.js`
- **Mock data hiện tại**: `zones`, `customerTasks`, `bookings`, `feedbacks`, `serviceTasks`
- **API cần tích hợp**:
  - `zoneService.getZones()`
  - `customerTaskService.getCustomerTasks()`
  - `bookingService.getBookings()`
  - `feedbackService.getFeedbacks()`
  - `serviceTaskService.getServiceTasks()`

#### **4. Admin Dashboard Components** 🏢
- **Files**: 
  - `src/app/dashboard/components/admin/BookingsTab.js`
  - `src/app/dashboard/components/admin/OverviewTab.js`
  - `src/app/dashboard/components/admin/users/CreateUserModal.js`
  - `src/app/dashboard/components/admin/manager/CreateManagerModal.js`
  - `src/app/dashboard/components/admin/manager/ManagerDetailModal.js`
- **Mock data hiện tại**: `careProfiles`, `accounts`, `serviceTypes`, `customerPackages`, `customerTasks`, `serviceTasks`, `nursingSpecialists`, `zoneDetails`, `zones`
- **API cần tích hợp**:
  - `careProfileService.getCareProfiles()`
  - `accountService.getAllAccounts()`
  - `serviceTypeService.getServiceTypes()`
  - `customerPackageService.getCustomerPackages()`
  - `customerTaskService.getCustomerTasks()`
  - `serviceTaskService.getServiceTasks()`
  - `nursingSpecialistService.getNursingSpecialists()`
  - `zoneService.getZoneDetails()`
  - `zoneService.getZones()`

#### **5. Manager Dashboard Components** 👨‍💼
- **Files**:
  - `src/app/dashboard/components/manager/ManagerDashboard.js`
  - `src/app/dashboard/components/manager/ManagerBookingTab.js`
  - `src/app/dashboard/components/manager/ManagerNurseTab.js`
  - `src/app/dashboard/components/manager/ManagerSpecialistTab.js`
  - `src/app/dashboard/components/manager/ManagerZoneTab.js`
- **Mock data hiện tại**: `nursingSpecialists`, `bookingsData`, `accounts`, `careProfiles`, `serviceTypes`, `customerPackages`, `customerTasks`, `serviceTasks`, `zoneDetails`, `zones`
- **API cần tích hợp**:
  - `nursingSpecialistService.getNursingSpecialists()`
  - `bookingService.getBookings()`
  - `accountService.getAllAccounts()`
  - `careProfileService.getCareProfiles()`
  - `serviceTypeService.getServiceTypes()`
  - `customerPackageService.getCustomerPackages()`
  - `customerTaskService.getCustomerTasks()`
  - `serviceTaskService.getServiceTasks()`
  - `zoneService.getZoneDetails()`
  - `zoneService.getZones()`

#### **6. Nurse Dashboard Components** 👩‍⚕️
- **Files**:
  - `src/app/dashboard/components/nurse/NurseDashboard.js`
  - `src/app/dashboard/components/nurse/NurseBookingsTab.js`
  - `src/app/dashboard/components/nurse/NurseMedicalNoteTab.js`
  - `src/app/dashboard/components/nurse/NurseScheduleTab.js`
- **Mock data hiện tại**: `bookingsMock`, `careProfilesMock`, `notificationsMock`, `accounts`, `workSchedulesMock`, `nursingSpecialists`, `medicalNotesMock`, `customerTasks`, `holidays`, `customerPackages`
- **API cần tích hợp**:
  - `bookingService.getBookings()`
  - `careProfileService.getCareProfiles()`
  - `notificationService.getNotifications()`
  - `accountService.getAllAccounts()`
  - `workScheduleService.getWorkSchedules()`
  - `nursingSpecialistService.getNursingSpecialists()`
  - `medicalNoteService.getMedicalNotes()`
  - `customerTaskService.getCustomerTasks()`
  - `holidayService.getHolidays()`
  - `customerPackageService.getCustomerPackages()`

## 🎯 **Thứ tự ưu tiên tích hợp:**

### **Phase 1: Core User Pages** (Ưu tiên cao)
1. **Booking Page** - Trang đặt lịch chính
2. **Payment Pages** - Trang thanh toán
3. **Team Page** - Trang giới thiệu team

### **Phase 2: Dashboard Components** (Ưu tiên trung bình)
1. **Admin Dashboard** - Quản lý tổng thể
2. **Manager Dashboard** - Quản lý khu vực
3. **Nurse Dashboard** - Quản lý lịch trình

### **Phase 3: Specialized Components** (Ưu tiên thấp)
1. **Modal Components** - Các modal tạo/sửa
2. **Detail Components** - Các component chi tiết

## 🔧 **Cách thức tích hợp:**

### **Pattern chung:**
```javascript
// Thay thế import mock data
// import data from '@/mock/Data';

// Thêm import service
import dataService from '@/services/api/dataService';

// Thay thế sử dụng mock data
// const data = mockData;

// Sử dụng API với useEffect
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await dataService.getData();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### **Error Handling:**
```javascript
const [error, setError] = useState(null);

// Trong useEffect
try {
  const result = await dataService.getData();
  setData(result);
  setError(null);
} catch (error) {
  console.error('Error fetching data:', error);
  setError('Không thể tải dữ liệu');
} finally {
  setLoading(false);
}
```

### **Loading States:**
```javascript
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}
```

## 📋 **Checklist tích hợp:**

### **Phase 1:**
- [ ] Booking Page
- [ ] Payment Page
- [ ] Payment History Page
- [ ] Team Page

### **Phase 2:**
- [ ] Admin BookingsTab
- [ ] Admin OverviewTab
- [ ] Manager Dashboard
- [ ] Manager BookingTab
- [ ] Nurse Dashboard
- [ ] Nurse BookingTab

### **Phase 3:**
- [ ] Admin Modals
- [ ] Manager Modals
- [ ] Nurse Modals
- [ ] Detail Components

## 🚀 **Bắt đầu tích hợp:**

Bạn có muốn tôi bắt đầu với **Phase 1** (Booking Page) trước không? 