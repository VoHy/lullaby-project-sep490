# 🔐 HƯỚNG DẪN TEST ROLE-BASED NAVIGATION

## 📋 **Thông tin đăng nhập test:**

### **1. Admin (role_id: 1)**
- **Email:** `admin@example.com`
- **Password:** `password`
- **Hiển thị:** Header chỉ có menu "Quản lý" → AdminDashboard

### **2. Manager (role_id: 4)**  
- **Email:** `manager@example.com`
- **Password:** `password`
- **Hiển thị:** Header chỉ có menu "Dashboard" → ManagerDashboard

### **3. Nurse (role_id: 2)**
- **Email:** `nurse@example.com` 
- **Password:** `password`
- **Hiển thị:** Header chỉ có menu "Dashboard" → NurseDashboard

### **4. Specialist (role_id: 5)**
- **Email:** `specialist@example.com`
- **Password:** `password` 
- **Hiển thị:** Header chỉ có menu "Dashboard" → SpecialistDashboard

### **5. Relative/Customer (role_id: 3)**
- **Email:** `e@example.com`
- **Password:** `password`
- **Hiển thị:** Header đầy đủ (Trang chủ, Điều dưỡng viên, Dịch vụ, Tin tức, Lịch hẹn, Hồ sơ Người Thân)

---

## 🎯 **Kết quả mong đợi:**

### **🔹 Admin Login:**
- Header: `[Logo] Quản lý [User Menu]`
- Dashboard: AdminDashboard với thống kê tổng quan hệ thống

### **🔹 Staff Login (Manager/Nurse/Specialist):**
- Header: `[Logo] Dashboard [User Menu]` 
- Dashboard: Dashboard riêng cho từng role với thống kê cá nhân
- **Ẩn hoàn toàn:** Trang chủ, Điều dưỡng viên, Dịch vụ, Tin tức

### **🔹 Relative/Customer Login:**
- Header: `[Logo] Trang chủ | Điều dưỡng viên | Dịch vụ | Tin tức | Lịch hẹn | Hồ sơ Người Thân [User Menu]`
- Access: Tất cả trang công khai + booking features

### **🔹 Guest (Chưa login):**
- Header: `[Logo] Trang chủ | Điều dưỡng viên | Dịch vụ | Tin tức [Login/Register]`
- Access: Chỉ trang công khai

---

## 🚀 **Test Steps:**

1. **Truy cập:** `http://localhost:3000`
2. **Login:** Với từng tài khoản ở trên
3. **Kiểm tra:** Header navigation thay đổi theo role
4. **Kiểm tra:** Dashboard hiển thị đúng component
5. **Logout:** Refresh về trang chủ với menu guest

---

## ✨ **Features đã implement:**

- ✅ **Role-based Navigation** - Menu khác nhau cho từng role
- ✅ **Dashboard Components** - 4 dashboard riêng biệt  
- ✅ **Authentication Flow** - Login/logout với role detection
- ✅ **Responsive Design** - Desktop + Mobile menu
- ✅ **Auto Refresh** - Logout tự động refresh trang
