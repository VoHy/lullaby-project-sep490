import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/zones/getall`);
    
    if (!response.ok) {
      console.error('Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Không thể lấy danh sách zones' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      { error: 'Lỗi kết nối đến backend' },
      { status: 500 }
    );
  }
} 
