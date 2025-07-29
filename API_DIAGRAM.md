# 📊 SƠ ĐỒ LUỒNG API

## 🔄 **Luồng Login:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Login Page    │    │  AuthService    │    │ AuthContext │ │
│  │                 │───▶│                 │───▶│             │ │
│  │ - Form submit   │    │ - fetch('/api/  │    │ - setUser   │ │
│  │ - Validation    │    │   login')       │    │ - localStorage│ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                          │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ /api/login      │    │ /api/register   │    │ /api/accounts│ │
│  │                 │    │                 │    │             │ │
│  │ - Proxy request │    │ - Proxy request │    │ - Proxy CRUD│ │
│  │ - Error handling│    │ - Error handling│    │ - Error handling│ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ /api/accounts/  │    │ /api/accounts/  │    │ /api/accounts│ │
│  │ login           │    │ register/customer│   │ /get/{id}   │ │
│  │                 │    │                 │    │             │ │
│  │ - Validate      │    │ - Create account│    │ - Get account│ │
│  │ - Generate JWT  │    │ - Return account│    │ - Return data│ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 **Cấu trúc Files:**

```
src/
├── services/                    # 🔧 Service Layer
│   ├── auth/
│   │   └── authService.js      # ✅ Login/Register logic
│   └── api/
│       └── accountService.js   # ✅ CRUD Accounts
│
├── app/api/                    # 🌐 API Routes (Proxy)
│   ├── login/route.js          # ✅ Proxy login
│   ├── register/route.js       # ✅ Proxy register
│   └── accounts/
│       ├── route.js            # ✅ Proxy GET all
│       ├── get/[id]/route.js   # ✅ Proxy GET one
│       └── [id]/route.js       # ✅ Proxy PUT/DELETE
│
├── app/auth/                   # 🎨 UI Pages
│   ├── login/page.js           # ✅ Login form
│   └── register/page.js        # ✅ Register form
│
└── context/
    └── AuthContext.js          # 🔐 User state management
```

## 🎯 **Ví dụ cụ thể:**

### **1. User Login:**
```
1. User nhập: huy@example.com / Huy@123
2. Click "Đăng nhập"
3. login/page.js → authService.login()
4. authService.js → fetch('/api/login')
5. /api/login/route.js → fetch('localhost:5294/api/accounts/login')
6. Backend trả về: { token, account }
7. AuthContext lưu: localStorage.setItem('user', account)
8. Router chuyển: /?welcome=true
```

### **2. Get User Account:**
```
1. Code gọi: accountService.getAccount(2)
2. accountService.js → fetch('/api/accounts/get/2')
3. /api/accounts/get/[id]/route.js → fetch('localhost:5294/api/accounts/get/2')
4. Backend trả về: { accountID: 2, roleID: 4, ... }
5. Frontend nhận được data
```

## 🔧 **Environment Setup:**

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=false  # Dùng API thật
```

## 🚀 **Test URLs:**

| Chức năng | Frontend URL | Backend URL |
|-----------|--------------|-------------|
| Login | `localhost:3002/auth/login` | `localhost:5294/api/accounts/login` |
| Register | `localhost:3002/auth/register` | `localhost:5294/api/accounts/register/customer` |
| Get Account | `localhost:3002/api/accounts/get/2` | `localhost:5294/api/accounts/get/2` |
| Get All | `localhost:3002/api/accounts` | `localhost:5294/api/accounts` |

## ✅ **Kết quả:**

- **Login/Register:** Hoạt động với API thật
- **Header:** Hiển thị đúng theo role (1:Admin, 2:Nurse, 3:Manager, 4:Customer)
- **Proxy:** Bypass CORS thành công
- **Code:** Sạch sẽ, không có file thừa

**Chỉ cần nhớ:** Frontend → Proxy → Backend 🎯 