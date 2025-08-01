import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const response = await fetch(`${backendUrl}/api/accounts/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json({ error: data.message || 'Đăng ký thất bại' }, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Đăng ký thất bại' }, { status: 500 });
  }
} 