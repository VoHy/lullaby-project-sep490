# Lullaby - Home Healthcare Platform

Lullaby là nền tảng chăm sóc sức khỏe tại nhà hiện đại, hỗ trợ đặt lịch dịch vụ, quản lý y tá, báo cáo y tế, thanh toán và nhiều tiện ích khác cho người cao tuổi và gia đình.

## 🚀 Tính năng nổi bật
- Đăng ký, đăng nhập, quên mật khẩu với giao diện hiện đại, hiệu ứng chuyển động mượt mà
- Đặt lịch dịch vụ chăm sóc tại nhà, phục hồi chức năng, chăm sóc sau phẫu thuật
- Xem danh sách y tá, tin tức, báo cáo y tế, lịch sử thanh toán
- Dashboard cho từng vai trò: Admin, Y tá, Người thân, Chuyên gia
- Responsive UI, tối ưu cho cả desktop và mobile
- Tích hợp hiệu ứng animation, slider, xác thực token, API giả lập

## 🛠️ Công nghệ sử dụng
- **Next.js 15 (App Router)**
- **React 19**
- **TailwindCSS 4** (tùy biến theme, responsive)
- **Framer Motion** (animation chuyển trang, hiệu ứng động)
- **Swiper** (slider dịch vụ, banner)
- **Axios** (giao tiếp API, xác thực token)
- **Radix UI** (UI primitives)
- **Lucide React** (icon hiện đại)
- **PostCSS, Autoprefixer**

## 📂 Cấu trúc thư mục chính
```
lullaby/
  ├─ src/
  │   ├─ app/
  │   │   ├─ api/           # API routes (Next.js)
  │   │   ├─ auth/          # Đăng nhập, đăng ký, quên mật khẩu
  │   │   ├─ booking/       # Đặt lịch dịch vụ
  │   │   ├─ nurse/         # Trang y tá, chi tiết y tá
  │   │   ├─ news/          # Tin tức
  │   │   ├─ dashboard/     # Dashboard các vai trò
  │   │   ├─ components/    # Header, Footer, UI components
  │   │   └─ ...
  │   ├─ services/          # Giao tiếp API, logic nghiệp vụ
  │   ├─ lib/, utils/, helper/ # Tiện ích, thư viện phụ trợ
  │   └─ public/images/     # Ảnh minh họa, banner
  ├─ tailwind.config.js
  ├─ package.json
  └─ README.md
```

## ⚡ Hướng dẫn khởi động
```bash
npm install
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để trải nghiệm giao diện.

## 📞 Liên hệ & đóng góp
- Email: support@lullaby.com (demo)
- Đóng góp, báo lỗi: tạo issue hoặc pull request trên repo này.

---
> Dự án xây dựng với mục tiêu nâng cao chất lượng chăm sóc sức khỏe tại nhà cho người cao tuổi Việt Nam.
