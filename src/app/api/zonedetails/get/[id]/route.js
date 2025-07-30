import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const response = await fetch(`${backendUrl}/api/zonedetails/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      // Mock data cho zone detail
      return NextResponse.json({
        "ZoneDetailID": parseInt(id),
        "ZoneID": 1,
        "DetailName": `Zone Detail ${id}`,
        "Description": `Mô tả cho zone detail ${id}`,
        "Status": "active",
        "CreatedAt": "2024-01-01T00:00:00Z"
      });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock data nếu có lỗi
    return NextResponse.json({
      "ZoneDetailID": parseInt(id),
      "ZoneID": 1,
      "DetailName": `Zone Detail ${id}`,
      "Description": `Mô tả cho zone detail ${id}`,
      "Status": "active",
      "CreatedAt": "2024-01-01T00:00:00Z"
    });
  }
} 