# Hướng dẫn Quy trình Thanh toán Booking

## Tổng quan

Quy trình thanh toán booking đã được tích hợp hoàn chỉnh với các tính năng sau:

1. **Tạo booking** - Gọi API để tạo booking
2. **Hiện popup xác nhận** - Hiển thị thông tin thanh toán
3. **Kiểm tra số dư ví** - Xác minh đủ tiền để thanh toán
4. **Thanh toán qua ví** - Trừ tiền từ ví điện tử
5. **Thông báo thành công** - Hiển thị kết quả thanh toán

## Các Component đã tạo

### 1. PaymentConfirmationModal
- **Vị trí**: `src/app/booking/components/PaymentConfirmationModal.js`
- **Chức năng**: 
  - Hiển thị thông tin booking và thanh toán
  - Kiểm tra số dư ví
  - Cảnh báo nếu số dư không đủ
  - Xử lý thanh toán qua ví

### 2. PaymentSuccessModal
- **Vị trí**: `src/app/booking/components/PaymentSuccessModal.js`
- **Chức năng**:
  - Hiển thị thông báo thanh toán thành công
  - Hiển thị chi tiết booking và invoice
  - Nút chuyển đến trang booking

### 3. Customer Dashboard
- **Vị trí**: `src/app/customer/page.js`
- **Chức năng**:
  - Dashboard riêng cho customer
  - Quản lý booking, thông báo, hồ sơ
  - Navigation từ header và avatar menu

## Quy trình hoạt động

### Bước 1: Tạo Booking
```javascript
// Khi user click "Thanh toán"
const handlePayment = async () => {
  // Validate user và data
  // Tạo booking qua API
  const createdBooking = await bookingService.createServiceBooking(bookingData);
  
  // Hiển thị popup xác nhận
  setBookingData(paymentData);
  setShowPaymentConfirmation(true);
};
```

### Bước 2: Xác nhận Thanh toán
```javascript
// Trong PaymentConfirmationModal
const handleConfirmPayment = async () => {
  // Kiểm tra số dư ví
  const balance = wallet.amount || wallet.Amount || 0;
  if (balance < amount) {
    throw new Error('Số dư không đủ');
  }
  
  // Tạo invoice
  const invoiceResult = await invoiceService.createInvoice(invoiceData);
  
  // Thanh toán qua ví
  const paymentResult = await transactionHistoryService.invoicePayment(
    invoiceResult.invoiceID,
    { walletID: walletId, invoiceID: invoiceResult.invoiceID }
  );
  
  // Hiển thị thông báo thành công
  onPaymentSuccess(result);
};
```

### Bước 3: Thông báo Thành công
```javascript
// Trong PaymentSuccessModal
// Hiển thị thông tin booking, invoice, và ví
// Nút chuyển đến customer dashboard
```

## Navigation đã cập nhật

### Header Navigation
- Thêm "Dashboard" cho customer đã đăng nhập
- Hiển thị trong cả desktop và mobile menu

### Avatar Menu
- Thêm "Dashboard" trong dropdown menu
- Chỉ hiển thị cho customer (roleID = 4)

### Customer Layout
- **Vị trí**: `src/app/customer/layout.js`
- **Chức năng**: Kiểm tra authentication và role
- **Bảo mật**: Chỉ cho phép customer truy cập

## Các tính năng bảo mật

### 1. Kiểm tra Authentication
```javascript
// Trong customer layout
if (!user) {
  router.push('/auth/login');
  return null;
}
```

### 2. Kiểm tra Role
```javascript
// Chỉ cho phép customer (roleID = 4)
if (user.roleID !== 4 && user.RoleID !== 4) {
  router.push('/dashboard');
  return null;
}
```

### 3. Kiểm tra số dư ví
```javascript
// Trước khi thanh toán
const balance = wallet.amount || wallet.Amount || 0;
if (balance < amount) {
  throw new Error(`Số dư không đủ. Hiện tại: ${balance.toLocaleString()}đ, Cần: ${amount.toLocaleString()}đ`);
}
```

## Cách sử dụng

### 1. Truy cập Booking
- Vào trang booking với URL: `/booking?serviceId=1,2` hoặc `/booking?packageId=1`
- Chọn hồ sơ người thân, ngày giờ, ghi chú
- Click "Thanh toán"

### 2. Xác nhận Thanh toán
- Popup hiển thị thông tin booking và ví
- Kiểm tra số dư tự động
- Nếu đủ tiền: Click "Xác nhận thanh toán"
- Nếu thiếu tiền: Click "Nạp tiền vào ví"

### 3. Kết quả
- Nếu thành công: Hiển thị thông báo thành công
- Nếu thất bại: Hiển thị lỗi và hướng dẫn

### 4. Truy cập Dashboard
- Từ header: Click "Dashboard"
- Từ avatar menu: Click "Dashboard"
- URL: `/customer`

## API Endpoints sử dụng

### Booking APIs
- `POST /api/booking/createservicebooking` - Tạo service booking
- `POST /api/booking/createpackagebooking` - Tạo package booking

### Invoice APIs
- `POST /api/invoice/create` - Tạo invoice

### Wallet APIs
- `GET /api/wallet/getall` - Lấy thông tin ví
- `POST /api/transactionhistory/invoicepayment` - Thanh toán qua ví

## Lưu ý quan trọng

1. **Số dư ví**: Hệ thống sẽ kiểm tra số dư trước khi cho phép thanh toán
2. **Cảnh báo nạp tiền**: Nếu số dư không đủ, sẽ hiển thị nút "Nạp tiền vào ví"
3. **Bảo mật**: Chỉ customer mới có thể truy cập customer dashboard
4. **Error handling**: Tất cả lỗi đều được xử lý và hiển thị thông báo phù hợp

## Troubleshooting

### Lỗi thường gặp

1. **"Không tìm thấy ví"**
   - Giải pháp: Tạo ví trước khi thanh toán

2. **"Số dư không đủ"**
   - Giải pháp: Nạp tiền vào ví

3. **"Không thể tạo booking"**
   - Giải pháp: Kiểm tra lại thông tin và thử lại

4. **"Lỗi thanh toán"**
   - Giải pháp: Kiểm tra kết nối mạng và thử lại

### Debug

Để debug, kiểm tra console log:
```javascript
console.log('✅ Thanh toán thành công:', result);
console.error('❌ Lỗi thanh toán:', error);
``` 