import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    
    const response = await fetch(`${backendUrl}/api/accounts/register/manager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    // Chỉ trả về error nếu có error message rõ ràng
    if (data && (data.error || data.message?.includes('already exists') || data.message?.includes('failed'))) {
      console.error('Backend error detected:', data);
      return NextResponse.json({ error: data.message || data.error || 'Đăng ký manager thất bại' }, { status: 400 });
    }
    
    // Nếu không có error rõ ràng, coi như thành công
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Đăng ký manager thất bại' }, { status: 500 });
  }
} 