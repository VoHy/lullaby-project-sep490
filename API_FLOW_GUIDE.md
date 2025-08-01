# 🔄 LUỒNG API HIỆN TẠI

## 📋 **Tổng quan:**

Hiện tại bạn đang sử dụng **API thật** với **Next.js API Routes** làm proxy để bypass CORS.

## 🏗️ **Cấu trúc thư mục:**

```
src/
├── services/
│   ├── api/           # ✅ Service layer (đang dùng)
│   ├── auth/          # ✅ Auth service (đang dùng)  
│   └── http/          # ⚠️ Axios config (đã comment)
├── app/api/           # ✅ Next.js API routes (đang dùng)
├── mock/              # ❌ Mock data (không dùng)
└── context/           # ✅ Auth context (đang dùng)
```

## 🔄 **Luồng hoạt động:**

### **1. Login Flow:**
```
Frontend (login page) 
    ↓
authService.login() 
    ↓
fetch('/api/login') 
    ↓
Next.js API Route (/api/login/route.js)
    ↓
fetch('http://localhost:5294/api/accounts/login')
    ↓
Backend (localhost:5294)
    ↓
Response: { token, account }
    ↓
Frontend: localStorage.setItem('user', account)
```

### **2. Register Flow:**
```
Frontend (register page)
    ↓
fetch('/api/register')
    ↓
Next.js API Route (/api/register/route.js)
    ↓
fetch('http://localhost:5294/api/accounts/register/customer')
    ↓
Backend (localhost:5294)
    ↓
Response: { account }
    ↓
Frontend: localStorage.setItem('user', account)
```

## 📁 **Files đang được sử dụng:**

### **✅ Đang dùng:**

1. **`src/services/auth/authService.js`**
   - Chứa logic login/register
   - Sử dụng fetch với proxy
   - Lưu user vào localStorage

2. **`src/services/api/accountService.js`**
   - Chứa logic CRUD cho accounts
   - Sử dụng fetch với proxy
   - getAccount, getAllAccounts, updateAccount, deleteAccount

3. **`src/app/api/login/route.js`**
   - Proxy cho login API
   - Gọi backend: `http://localhost:5294/api/accounts/login`

4. **`src/app/api/register/route.js`**
   - Proxy cho register API  
   - Gọi backend: `http://localhost:5294/api/accounts/register/customer`

5. **`src/app/api/accounts/route.js`**
   - Proxy cho getAllAccounts API
   - Gọi backend: `http://localhost:5294/api/accounts`

6. **`src/app/api/accounts/get/[id]/route.js`**
   - Proxy cho getAccount API
   - Gọi backend: `http://localhost:5294/api/accounts/get/{id}`

7. **`src/app/api/accounts/[id]/route.js`**
   - Proxy cho updateAccount và deleteAccount API
   - Gọi backend: `http://localhost:5294/api/accounts/{id}`

8. **`src/context/AuthContext.js`**
   - Quản lý state user
   - Login/logout functions
   - Auto load user từ localStorage

9. **`src/app/auth/login/page.js`**
   - UI login form
   - Gọi authService.login()

10. **`src/app/auth/register/page.js`**
    - UI register form
    - Gọi fetch('/api/register')

### **⚠️ Đã comment (không dùng):**

1. **`src/services/http/axios.js`**
   - Axios config đã comment
   - Hiện tại dùng fetch với proxy

2. **`src/mock/Account.js`**
   - Mock data đã comment
   - Không dùng khi `NEXT_PUBLIC_USE_MOCK=false`

### **❌ Không dùng:**

1. **`src/mock/`** - Tất cả mock data
2. **`src/services/api/`** - Các service khác (booking, wallet, etc.)

## 🔧 **Environment Variables:**

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=false  # Sử dụng API thật
```

## 🚀 **Cách test:**

1. **Backend phải chạy:** `http://localhost:5294`
2. **Frontend:** `http://localhost:3002`
3. **Login:** `huy@example.com` / `Huy@123`
4. **Register:** Tạo tài khoản mới

## 📊 **Response Format:**

### **Login Response:**
```json
{
  "message": "Login successful for 'huy@example.com'.",
  "account": {
    "accountID": 2,
    "roleID": 4,
    "roleName": "Customer", 
    "fullName": "Huy",
    "phoneNumber": "0393252056",
    "email": "huy@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### **Register Response:**
```json
{
  "account": {
    "accountID": 3,
    "roleID": 4,
    "roleName": "Customer",
    "fullName": "New User",
    "phoneNumber": "0123456789", 
    "email": "new@example.com"
  }
}
```

## 🎯 **Kết luận:**

- ✅ **Đang dùng API thật** qua Next.js proxy
- ✅ **Login/Register hoạt động** với backend
- ✅ **Header hiển thị đúng** theo role
- ❌ **Mock data không dùng** nữa
- ⚠️ **Axios config đã comment** (có thể xóa nếu không cần) 