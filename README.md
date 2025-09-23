# Lullaby - Home Healthcare Platform

Lullaby là nền tảng chăm sóc sức khỏe tại nhà hiện đại, kết nối giữa mẹ và bé với các Chuyên viên chăm sóc chuyên nghiệp, hỗ trợ đặt lịch dịch vụ, quản lý hồ sơ bệnh án, thanh toán trực tuyến và nhiều tiện ích khác.

## 🚀 Tính năng nổi bật

### 👤 **Quản lý người dùng & Xác thực**
- Đăng ký, đăng nhập với email/số điện thoại
- Đăng nhập với Google OAuth 2.0
- Quên mật khẩu và đặt lại mật khẩu
- Phân quyền theo vai trò: Admin, Chuyên viên chăm sóc, Manager, Khách hàng
- JWT token authentication với auto-refresh

### 🏥 **Dịch vụ chăm sóc**
- Đặt lịch dịch vụ chăm sóc tại nhà
- Quản lý hồ sơ bệnh nhân (Care Profile)
- Báo cáo y tế và ghi chú điều dưỡng
- Quản lý công việc và chấm công cho Chuyên viên chăm sóc
- Phản hồi và đánh giá dịch vụ

### 💰 **Thanh toán & Ví điện tử**
- Ví điện tử tích hợp với số dư
- Thanh toán dịch vụ trực tuyến
- Lịch sử giao dịch chi tiết
- Tạo mã QR cho thanh toán
- Tính toán phí dịch vụ với giảm giá

### 📊 **Dashboard & Báo cáo**
- Dashboard theo vai trò với charts và thống kê
- Quản lý đặt lịch và doanh thu (Admin/Manager)
- Lịch làm việc và nhiệm vụ (Chuyên viên chăm sóc)
- Thông tin dịch vụ và lịch hẹn (Khách hàng)

## 🛠️ Công nghệ sử dụng

### **Frontend Framework**
- **Next.js 15** với App Router - SSR và client-side routing
- **React 19** - Component-based UI với hooks
- **JavaScript** - Development với ES6+

### **Styling & UI**
- **TailwindCSS 4** - Utility-first CSS framework với custom config
- **Framer Motion 12** - Animation và page transitions
- **React Icons 5** - Icon library (FontAwesome, Lucide)
- **Swiper 11** - Touch slider cho carousel
- **Recharts 3** - Charts và visualizations cho dashboard

### **Authentication & Security**
- **NextAuth.js 4** - Authentication framework
- **@react-oauth/google** - Google OAuth 2.0 integration
- **JWT Decode** - JWT token parsing và validation
- **@auth/core** - Core authentication utilities

### **State Management & API**
- **React Context API** - Global state (Auth, Wallet)
- **Axios 1.9** - HTTP client với interceptors
- **Custom hooks** - Reusable business logic

### **UI Components & Utils**
- **@radix-ui/react-*** - Accessible UI primitives
- **React Calendar 6** - Date picker và calendar views  
- **React DatePicker 8** - Enhanced date/time selection
- **QRCode 1.5** - QR code generation cho thanh toán

### **Development Tools**
- **PostCSS 8** với **Autoprefixer** - CSS processing
- **ESLint 9** với **Next.js config** - Code linting
- **Critters** - Critical CSS extraction

## 📂 Cấu trúc thư mục chính

```
lullaby/
├─ src/
│   ├─ app/                    # Next.js App Router
│   │   ├─ api/               # API routes (Proxy & utilities)
│   │   ├─ auth/              # Authentication pages
│   │   │   ├─ login/         # Đăng nhập (Google OAuth, JWT)
│   │   │   ├─ register/      # Đăng ký khách hàng
│   │   │   └─ reset-password/ # Đặt lại mật khẩu
│   │   ├─ booking/           # Đặt lịch dịch vụ
│   │   │   ├─ components/    # Service selection, payment calc
│   │   │   └─ utils/         # Booking logic & validation
│   │   ├─ appointments/      # Quản lý lịch hẹn
│   │   │   ├─ components/    # Appointment cards, status
│   │   │   └─ utils/         # Booking status helpers
│   │   ├─ dashboard/         # Multi-role dashboards
│   │   │   └─ components/    
│   │   │       ├─ admin/     # Admin panels (users, revenue)
│   │   │       ├─ nurse/     # Nurse schedule, medical notes
│   │   │       └─ manager/   # Manager analytics, reports
│   │   ├─ payment/           # Payment processing
│   │   │   ├─ components/    # Payment info, QR codes
│   │   │   ├─ history/       # Transaction history
│   │   │   └─ hooks/         # Payment logic hooks
│   │   ├─ profile/           # User profile management
│   │   │   ├─ patient/       # Care profiles, relatives
│   │   │   └─ components/    # Profile forms, validation
│   │   ├─ wallet/            # Digital wallet management
│   │   ├─ notifications/     # Real-time notifications
│   │   ├─ news/              # News and articles
│   │   ├─ services/          # Service catalog
│   │   ├─ team/              # Nurse directory
│   │   └─ components/        # Shared UI components
│   │       ├─ header/        # Navigation, notifications
│   │       ├─ footer/        # Site footer
│   │       └─ ui/            # Reusable UI elements
│   ├─ services/              # API service layer
│   │   └─ api/               # Service modules per domain
│   │       ├─ authService.js         # Authentication APIs
│   │       ├─ bookingService.js      # Booking management
│   │       ├─ walletService.js       # Payment & wallet
│   │       ├─ notificationService.js # Notifications
│   │       ├─ medicalNoteService.js  # Medical records
│   │       ├─ feedbackService.js     # Service feedback
│   │       └─ serviceUtils.js        # HTTP utilities
│   ├─ context/               # React Context providers
│   │   ├─ AuthContext.js     # User authentication state
│   │   └─ WalletContext.js   # Wallet balance state
│   ├─ config/                # Configuration files
│   │   └─ api.js             # API endpoints & base URL
│   ├─ lib/                   # Utility libraries
│   │   ├─ realtime.js        # SignalR + Firebase messaging
│   │   └─ proxyRequest.js    # API proxy utilities
│   ├─ utils/                 # Helper functions
│   ├─ hooks/                 # Custom React hooks
│   └─ helper/                # Business logic helpers
├─ public/                    # Static assets
│   ├─ firebase-messaging-sw.js # Firebase service worker
│   └─ images/                # Application images
├─ diagrams/                  # PlantUML documentation
│   ├─ 3.6.* # Manage Relatives (CRUD operations)
│   ├─ 3.9.* # Work Schedule Management  
│   ├─ 3.10.* # Medical Notes Management
│   └─ 3.11.* # Feedback Management
├─ tailwind.config.js         # TailwindCSS configuration
├─ next.config.mjs            # Next.js optimization config
├─ package.json               # Dependencies & scripts
└─ README.md                  # Project documentation
```

## ⚡ Hướng dẫn khởi động

### **Yêu cầu hệ thống**
- Node.js 18+ 
- npm hoặc yarn

### **Cài đặt & Chạy**
```bash
# Clone repository
git clone <repository-url>
cd lullaby

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Hoặc chạy với backend local
npm run dev:local

# Build cho production
npm run build
npm start
```

### **Available Scripts**
```bash
npm run dev          # Development server (port 3000)
npm run dev:local    # Dev với backend local (port 5294)  
npm run dev:prodapi  # Dev với production API
npm run build        # Build cho production
npm run start        # Start production server
npm run lint         # Chạy ESLint
```

Truy cập [http://localhost:3000](http://localhost:3000) để sử dụng ứng dụng.
Truy cập [https://www.lullaby.health.vn/](https://www.lullaby.health.vn/) để sử dụng ứng dụng

## 🏗️ Kiến trúc hệ thống

### **Frontend Architecture**
- **Page-based routing** với Next.js App Router
- **Component composition** với React hooks
- **Service layer pattern** cho API calls
- **Context providers** cho global state
- **Custom hooks** cho business logic reuse

### **State Management**
- **AuthContext**: User authentication, JWT tokens
- **WalletContext**: Digital wallet balance, transactions  
- **Local state**: Component-specific state với useState/useReducer
- **Caching**: LocalStorage cho API response caching

### **API Integration**
- **Service modules**: Tách biệt theo domain (auth, booking, payment...)
- **HTTP interceptors**: Automatic token attachment
- **Error handling**: Centralized error processing
- **Request/Response transformation**: Chuẩn hóa data format

## 🔧 Tính năng kỹ thuật

### **Performance Optimizations**
- **Code splitting**: Automatic bundle splitting theo routes
- **Image optimization**: Next.js Image component với WebP/AVIF
- **CSS optimization**: TailwindCSS purging và minification
- **Lazy loading**: Component và route-based lazy loading

### **Security Features**  
- **JWT Authentication**: Secure token-based auth
- **Role-based access**: Route protection theo user roles
- **CORS handling**: Cross-origin request security
- **Input validation**: Client và server-side validation
- **XSS Protection**: Content Security Policy headers

### **Developer Experience**
- **TypeScript support**: Type safety cho development
- **ESLint configuration**: Code quality enforcement  
- **Hot reload**: Instant development feedback
- **Component documentation**: Comprehensive code comments

## 📱 Responsive Design

Giao diện được tối ưu cho:
- **Desktop**: Full dashboard experience với charts
- **Tablet**: Adaptive layouts với touch-friendly controls  
- **Mobile**: Mobile-first approach với gesture support
- **PWA-ready**: Service worker support cho offline functionality

---
> **Lullaby** - Nâng cao chất lượng chăm sóc sức khỏe tại nhà cho mẹ và bé Việt Nam thông qua công nghệ hiện đại.
