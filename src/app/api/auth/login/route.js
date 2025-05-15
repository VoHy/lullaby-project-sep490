import { NextResponse } from 'next/server';

// Danh sách người dùng giả
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { email, password } = await request.json();
    
    // Kiểm tra nếu email và password trống
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email và mật khẩu không được để trống' },
        { status: 400 }
      );
    }
    
    // Tìm người dùng trong danh sách giả
    const user = fakeUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    // Loại bỏ password trước khi trả về
    const { password: _, ...userWithoutPassword } = user;
    
    // Tạo token giả
    const token = `fake-jwt-token-${user.id}-${Date.now()}`;
    
    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      token,
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi đăng nhập' },
      { status: 500 }
    );
  }
} 