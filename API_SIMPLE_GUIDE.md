# 🚀 HƯỚNG DẪN API ĐƠN GIẢN

## 📖 **Tóm tắt nhanh:**

Bạn đang dùng **API thật** từ backend `localhost:5294` thông qua **proxy** của Next.js để tránh lỗi CORS.

---

## 🔄 **Luồng hoạt động:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js       │    │   Backend       │
│   (Browser)     │───▶│   API Routes    │───▶│   (localhost:5294)│
│                 │    │   (Proxy)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📁 **Files quan trọng:**

### **1. Service Layer (Logic nghiệp vụ)**
```
src/services/
├── auth/authService.js     # ✅ Login/Register
└── api/accountService.js   # ✅ CRUD Accounts
```

### **2. API Routes (Proxy)**
```
src/app/api/
├── login/route.js                    # ✅ Proxy login
├── register/route.js                 # ✅ Proxy register  
├── accounts/route.js                 # ✅ Proxy get all accounts
├── accounts/get/[id]/route.js        # ✅ Proxy get account
└── accounts/[id]/route.js            # ✅ Proxy update/delete
```

### **3. UI Pages**
```
src/app/auth/
├── login/page.js         # ✅ Form đăng nhập
└── register/page.js      # ✅ Form đăng ký
```

---

## 🎯 **Cách hoạt động:**

### **Ví dụ Login:**
1. User nhập email/password → Click "Đăng nhập"
2. `login/page.js` gọi `authService.login()`
3. `authService.js` gọi `fetch('/api/login')`
4. `api/login/route.js` nhận request → Gọi `localhost:5294/api/accounts/login`
5. Backend trả về `{ token, account }`
6. Frontend lưu vào localStorage → Chuyển trang

### **Ví dụ Get Account:**
1. Code gọi `accountService.getAccount(123)`
2. `accountService.js` gọi `fetch('/api/accounts/get/123')`
3. `api/accounts/get/[id]/route.js` → Gọi `localhost:5294/api/accounts/get/123`
4. Backend trả về account data
5. Frontend nhận được data

---

## 🔧 **Environment Variables:**

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=false  # Dùng API thật
```

---

## 📊 **Response Format:**

### **Login Success:**
```json
{
  "message": "Login successful",
  "account": {
    "accountID": 2,
    "roleID": 4,
    "roleName": "Customer",
    "fullName": "Huy",
    "email": "huy@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### **Get Account:**
```json
{
  "accountID": 2,
  "roleID": 4,
  "roleName": "Customer",
  "fullName": "Huy",
  "email": "huy@example.com"
}
```

---

## 🚀 **Cách test:**

### **1. Backend phải chạy:**
```bash
# Backend chạy trên port 5294
http://localhost:5294
```

### **2. Frontend chạy:**
```bash
# Frontend chạy trên port 3002
http://localhost:3002
```

### **3. Test Login:**
- URL: `http://localhost:3002/auth/login`
- Email: `huy@example.com`
- Password: `Huy@123`

### **4. Test Register:**
- URL: `http://localhost:3002/auth/register`
- Điền form đăng ký

---

## ❓ **FAQ:**

### **Q: Tại sao cần proxy?**
A: Browser không cho phép gọi trực tiếp từ `localhost:3002` đến `localhost:5294` (CORS). Proxy giúp bypass lỗi này.

### **Q: Mock data có dùng không?**
A: Không! Khi `NEXT_PUBLIC_USE_MOCK=false`, tất cả mock data đều bị bỏ qua.

### **Q: Axios có dùng không?**
A: Không! Hiện tại dùng `fetch()` với proxy thay vì axios.

### **Q: Làm sao thêm API mới?**
A: 
1. Tạo service trong `src/services/api/`
2. Tạo proxy route trong `src/app/api/`
3. Gọi từ frontend

---

## 🎯 **Kết luận:**

- ✅ **Đang dùng API thật** từ backend
- ✅ **Có proxy** để tránh CORS
- ✅ **Login/Register hoạt động**
- ✅ **Header hiển thị đúng** theo role
- ✅ **Code sạch sẽ**, không có file thừa

**Chỉ cần nhớ:** Frontend → Proxy → Backend 🚀 