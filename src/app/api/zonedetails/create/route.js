import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/api/zonedetails/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Không thể tạo chi tiết khu vực' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating zone detail:', error);
    return NextResponse.json(
      { error: 'Lỗi kết nối đến backend' },
      { status: 500 }
    );
  }
} 
