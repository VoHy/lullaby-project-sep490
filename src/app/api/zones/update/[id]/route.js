import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    
    // Format data theo yêu cầu của backend
    const zoneData = {
      zoneID: parseInt(id), // ID từ URL path
      zoneName: body.zoneName,
      city: body.city,
      managerID: body.managerID || 1 // Default manager ID nếu không có
    };
    
    const response = await fetch(`${backendUrl}/api/zones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData),
    });
    
    let data;
    const responseText = await response.text();
    
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON response from backend' }, { status: 500 });
    }
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || data.error || 'Cập nhật zone thất bại' }, { status: response.status });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating zone:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
} 