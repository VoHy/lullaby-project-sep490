import { NextResponse } from 'next/server';

// Danh sách người dùng giả (giống như trong login)
const fakeUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'nurse@example.com',
    password: 'nurse123',
    name: 'Nurse User',
    role: 'nurse',
  },
  {
    id: 3,
    email: 'relative@example.com',
    password: 'relative123',
    name: 'Relative User',
    role: 'relative',
  },
  {
    id: 4,
    email: 'specialist@example.com',
    password: 'specialist123',
    name: 'Specialist User',
    role: 'specialist',
  },
];

export async function POST(request) {
  try {
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { email } = await request.json();
    
    // Kiểm tra email tồn tại
    if (!email) {
      return NextResponse.json(
        { message: 'Vui lòng nhập địa chỉ email' },
        { status: 400 }
      );
    }
    
    // Kiểm tra xem email có tồn tại trong danh sách người dùng không
    const existingUser = fakeUsers.find(u => u.email === email);
    
    // Luôn trả về thành công, ngay cả khi email không tồn tại (để tránh lộ thông tin người dùng)
    // Trong thực tế, chúng ta sẽ gửi email reset mật khẩu
    return NextResponse.json({
      message: 'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn',
      success: true,
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
} 