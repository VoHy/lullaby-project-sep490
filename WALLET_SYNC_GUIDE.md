# Hướng dẫn Kiểm tra và Sửa Vấn đề Đồng bộ Wallet

## Vấn đề hiện tại

Có sự không đồng bộ giữa số dư hiển thị trên header (200.000đ) và trong wallet page (0đ).

## Nguyên nhân có thể

1. **Cache khác nhau** - Header và wallet page đang lấy dữ liệu từ các nguồn khác nhau
2. **API calls khác nhau** - Có thể header đang dùng mock data còn wallet page dùng real API
3. **State management** - Không có đồng bộ state giữa các component

## Giải pháp đã triển khai

### 1. Tạo WalletContext
- **Vị trí**: `src/context/WalletContext.js`
- **Chức năng**: Quản lý state wallet tập trung cho toàn bộ ứng dụng
- **Lợi ích**: Đồng bộ dữ liệu giữa tất cả component

### 2. Cập nhật Layout
- **Vị trí**: `src/app/layout.js`
- **Thay đổi**: Thêm `WalletProvider` bao quanh toàn bộ ứng dụng
- **Kết quả**: Tất cả component đều sử dụng cùng wallet state

### 3. Cập nhật Components
- **WalletIcon**: Sử dụng `useWalletContext` thay vì `useWallet`
- **WalletPage**: Sử dụng `useWalletContext` thay vì `useWallet`
- **PaymentConfirmationModal**: Sử dụng `useWalletContext`

### 4. Debug Component
- **Vị trí**: `src/app/components/WalletDebug.js`
- **Chức năng**: Hiển thị thông tin wallet real-time ở góc màn hình
- **Mục đích**: Kiểm tra dữ liệu wallet đang được load

## Cách kiểm tra

### 1. Kiểm tra Console Logs
Mở Developer Tools và xem console logs:
```
🔍 WalletContext: User account ID: [account_id]
🔍 WalletContext: Đang tìm ví cho account ID: [account_id]
🔍 WalletContext: Ví hiện tại: [wallet_data]
```

### 2. Kiểm tra Debug Component
- Debug component sẽ hiển thị ở góc dưới bên phải màn hình
- Màu xanh: Có wallet data
- Màu đỏ: Không có wallet hoặc có lỗi

### 3. Kiểm tra Network Tab
- Xem các API calls đến `/api/wallet/getall`
- Kiểm tra response data có đúng không

## Các bước khắc phục

### Bước 1: Kiểm tra API Response
```javascript
// Trong browser console
fetch('/api/wallet/getall')
  .then(res => res.json())
  .then(data => console.log('Wallet API Response:', data))
  .catch(err => console.error('Wallet API Error:', err));
```

### Bước 2: Kiểm tra User Account ID
```javascript
// Trong browser console
// Kiểm tra user object trong localStorage hoặc context
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Bước 3: Force Refresh Wallet Data
```javascript
// Trong browser console
// Gọi refresh function
window.walletContext?.refreshWalletData();
```

## Các trường hợp có thể xảy ra

### Trường hợp 1: Header hiển thị mock data
**Triệu chứng**: Header hiển thị 200.000đ nhưng wallet page hiển thị 0đ
**Giải pháp**: Đảm bảo WalletIcon sử dụng `useWalletContext`

### Trường hợp 2: API trả về dữ liệu khác nhau
**Triệu chứng**: Cả hai đều dùng real API nhưng kết quả khác nhau
**Giải pháp**: Kiểm tra API response và cache

### Trường hợp 3: User account ID không đúng
**Triệu chứng**: Không tìm thấy wallet cho user
**Giải pháp**: Kiểm tra user object và account ID

## Debug Commands

### 1. Kiểm tra Wallet Context
```javascript
// Trong browser console
console.log('Wallet Context:', window.walletContext);
```

### 2. Force Refresh
```javascript
// Trong browser console
window.walletContext?.refreshWalletData();
```

### 3. Kiểm tra User
```javascript
// Trong browser console
console.log('Current User:', JSON.parse(localStorage.getItem('user')));
```

## Các file đã cập nhật

1. **`src/context/WalletContext.js`** - Context mới cho wallet
2. **`src/app/layout.js`** - Thêm WalletProvider
3. **`src/app/components/header/WalletIcon.js`** - Sử dụng WalletContext
4. **`src/app/wallet/page.js`** - Sử dụng WalletContext
5. **`src/app/booking/components/PaymentConfirmationModal.js`** - Sử dụng WalletContext
6. **`src/app/wallet/hooks/useWallet.js`** - Re-export WalletContext
7. **`src/app/components/WalletDebug.js`** - Component debug

## Kết quả mong đợi

Sau khi triển khai WalletContext:
- ✅ Header và wallet page hiển thị cùng số dư
- ✅ Tất cả component sử dụng cùng wallet state
- ✅ Tự động refresh khi có thay đổi
- ✅ Debug component hiển thị thông tin real-time

## Troubleshooting

### Nếu vẫn không đồng bộ:
1. Kiểm tra console logs
2. Kiểm tra debug component
3. Force refresh wallet data
4. Kiểm tra network requests
5. Clear browser cache và reload

### Nếu có lỗi:
1. Kiểm tra user authentication
2. Kiểm tra API endpoints
3. Kiểm tra wallet creation logic
4. Kiểm tra account ID mapping 