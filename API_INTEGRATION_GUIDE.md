# Hướng dẫn tích hợp API thật

## Cấu hình hiện tại

Đã cập nhật code để sử dụng API thật từ backend local của bạn khi `NEXT_PUBLIC_USE_MOCK=false`.

### Các thay đổi đã thực hiện:

1. **Cập nhật `src/services/auth/authService.js`**:
   - Thêm logic để sử dụng API thật khi `USE_MOCK=false`
   - Endpoint đăng ký: `POST /api/accounts/register/customer`
   - Endpoint đăng nhập: `POST /api/accounts/login`
   - Endpoint Google login: `POST /api/accounts/login/google`

2. **Cập nhật `src/services/api/accountService.js`**:
   - Sử dụng axios thay vì fetch
   - Thêm xử lý lỗi tốt hơn

3. **Cập nhật `src/app/auth/register/page.js`**:
   - Xử lý response từ API thật
   - Cập nhật logic chuyển hướng

### Cách sử dụng:

1. **Đảm bảo backend đang chạy**:
   ```bash
   # Backend của bạn phải chạy trên http://localhost:5294
   ```

2. **Tạo file `.env.local`** (nếu chưa có):
   ```env
   NEXT_PUBLIC_USE_MOCK=false
   ```

3. **Khởi động frontend**:
   ```bash
   npm run dev
   ```

### Cấu trúc Role:

Hệ thống có 4 role chính:
- **roleID: 1** - Admin
- **roleID: 2** - NurseSpecialist  
- **roleID: 3** - Manager
- **roleID: 4** - Customer (mặc định cho đăng ký mới)

### API Endpoints được sử dụng:

#### Đăng ký tài khoản:
- **URL**: `POST http://localhost:5294/api/accounts/register/customer`
- **Body**:
  ```json
  {
    "fullName": "Huy",
    "phoneNumber": "0393252056", 
    "email": "huy@example.com",
    "password": "Huy@123",
    "avatarUrl": "string"
  }
  ```

#### Đăng nhập:
- **URL**: `POST http://localhost:5294/api/accounts/login`
- **Body**:
  ```json
  {
    "emailOrPhoneNumber": "huy@example.com",
    "password": "Huy@123"
  }
  ```

### Lưu ý quan trọng:

1. **CORS**: Đảm bảo backend của bạn cho phép CORS từ `http://localhost:3000`

2. **Response format**: API response phải có format:
   ```json
   {
     "message": "Relative account 'huy@example.com' with ID 2 created successfully.",
     "account": {
       "accountID": 2,
       "roleID": 4,
       "fullName": "Huy",
       "phoneNumber": "0393252056",
       "email": "huy@example.com",
       "password": "$2a$11$...",
       "avatarUrl": "string",
       "createAt": "2025-07-29T05:19:22.2129588Z",
       "deletedAt": null,
       "status": "active"
     }
   }
   ```

3. **Error handling**: Tất cả lỗi sẽ được hiển thị cho người dùng

### Testing:

1. Truy cập `http://localhost:3000/auth/register`
2. Điền thông tin đăng ký
3. Sau khi đăng ký thành công:
   - Sẽ có thông báo "Đăng ký thành công! Chào mừng bạn đến với Lullaby."
   - Người dùng sẽ được chuyển đến trang chủ với thông báo chào mừng đẹp mắt
   - Chuyển hướng dựa trên roleID:
     - **roleID 1 (Admin)**: Dashboard
     - **roleID 2 (NurseSpecialist)**: Dashboard  
     - **roleID 3 (Manager)**: Dashboard
     - **roleID 4 (Customer)**: Trang chủ với thông báo chào mừng
4. Kiểm tra console để xem request/response
5. Kiểm tra localStorage để xem token và user data

### Troubleshooting:

- **Lỗi CORS**: Kiểm tra cấu hình CORS trong backend
- **Lỗi kết nối**: Đảm bảo backend đang chạy trên port 5294
- **Lỗi validation**: Kiểm tra format dữ liệu gửi lên 