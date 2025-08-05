import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('Fetching care profiles from:', `${backendUrl}/api/careprofiles/getall`);
    
    const response = await fetch(`${backendUrl}/api/careprofiles/getall`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Care profiles API response status:', response.status);
    
    const data = await response.json();
    console.log('Care profiles API response data:', data);
    
    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json({ error: data.message || 'Không thể lấy danh sách hồ sơ' }, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
} 