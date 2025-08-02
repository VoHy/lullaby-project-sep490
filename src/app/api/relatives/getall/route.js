import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/relatives/getall`);
    
    if (!response.ok) {
      console.error('Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Không thể lấy danh sách relatives' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching relatives:', error);
    return NextResponse.json(
      { error: 'Lỗi kết nối đến backend' },
      { status: 500 }
    );
  }
} 