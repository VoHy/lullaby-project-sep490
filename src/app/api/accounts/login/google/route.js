import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;
    
    // TODO: Implement actual API call to backend
    const response = await fetch(`${process.env.API_BASE_URL}/api/accounts/login/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Google');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { error: 'Đăng nhập Google thất bại' },
      { status: 500 }
    );
  }
} 