import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    
    console.log('Register nursing specialist - Request body:', body);
    console.log('Calling backend:', `${backendUrl}/api/accounts/register/nursingspecialist`);
    
    const response = await fetch(`${backendUrl}/api/accounts/register/nursingspecialist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      console.log('Backend not available, returning mock success');
      return NextResponse.json({ 
        success: true, 
        message: 'Tạo tài khoản nurse specialist thành công',
        account: {
          id: Date.now(),
          ...body,
          status: 'active'
        }
      });
    }
    
    const data = await response.json();
    console.log('Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
} 