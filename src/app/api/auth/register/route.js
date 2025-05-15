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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Đảm bảo request có định dạng JSON hợp lệ
    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.error('Lỗi phân tích JSON request:', error);
      return NextResponse.json(
        { message: 'Định dạng dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    
    const { email, password, name, role = 'relative' } = data;
    
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = fakeUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }
    
    // Giả lập việc tạo người dùng mới
    const newUser = {
      id: fakeUsers.length + 1,
      email,
      password,
      name,
      role
    };
    
    // Trong thực tế, chúng ta sẽ lưu người dùng vào cơ sở dữ liệu
    // Ở đây chỉ giả lập thành công
    
    // Loại bỏ password trước khi trả về
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Tạo token giả
    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
    
    return NextResponse.json({
      message: 'Đăng ký tài khoản thành công',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
} 