import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trong thực tế, chúng ta sẽ nhận token ID từ Google và xác thực
    // Ở đây chỉ giả lập thành công đăng nhập với Google
    
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Giả lập thông tin người dùng từ Google
    const googleUser = {
      id: 100,
      email: 'user.google@gmail.com',
      name: 'Google User',
      role: 'relative', // Mặc định người dùng từ Google sẽ có vai trò là relative
      picture: 'https://lh3.googleusercontent.com/a/default-user=s120-p',
      provider: 'google',
    };
    
    // Tạo token giả
    const jwtToken = `fake-google-jwt-token-${googleUser.id}-${Date.now()}`;
    
    return NextResponse.json({
      message: 'Đăng nhập với Google thành công',
      user: googleUser,
      token: jwtToken,
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi đăng nhập với Google' },
      { status: 500 }
    );
  }
} 