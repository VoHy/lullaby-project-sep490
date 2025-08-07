import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    // Format data theo yêu cầu của backend
    const zoneData = {
      zoneName: body.zoneName,
      city: body.city,
      managerID: body.managerID || 1 // Default manager ID nếu không có
    };
    const response = await fetch(`${backendUrl}/api/zones/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData),
    });
    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      console.error('Response is not JSON:', text);
      return NextResponse.json({ error: text || 'Lỗi server không trả về JSON' }, { status: 500 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: data.message || data.error || 'Tạo zone thất bại' }, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating zone:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
} 
