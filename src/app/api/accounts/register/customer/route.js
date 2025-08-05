import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, email, password, avatarUrl } = body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !password) {
      return NextResponse.json(
        { error: 'Họ tên, số điện thoại, email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // TODO: Implement actual API call to backend
    const response = await fetch(`${process.env.API_BASE_URL}/api/accounts/register/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        phoneNumber,
        email,
        password,
        avatarUrl: avatarUrl || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Đăng ký customer thất bại');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Đăng ký customer thất bại' },
      { status: 500 }
    );
  }
} 