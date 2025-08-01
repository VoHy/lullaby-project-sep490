import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const res = await fetch(`${backendUrl}/api/zonedetails/get/${id}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Không thể lấy thông tin chi tiết khu vực' },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching zone detail:', error);
    return NextResponse.json(
      { error: 'Lỗi kết nối đến backend' },
      { status: 500 }
    );
  }
} 