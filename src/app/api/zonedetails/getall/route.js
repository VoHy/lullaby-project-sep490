import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    console.log('Calling backend zone details:', `${backendUrl}/api/zonedetails`);
    
    const response = await fetch(`${backendUrl}/api/zonedetails`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Zone details response status:', response.status);
    
    if (!response.ok) {
      // Mock data cho zone details
      return NextResponse.json([
        {
          "zoneDetailID": 1,
          "zoneID": 1,
          "name": "Phường Bến Nghé",
          "note": "Trung tâm Quận 1"
        },
        {
          "zoneDetailID": 2,
          "zoneID": 1,
          "name": "Phường Bến Thành",
          "note": "Khu vực thương mại"
        },
        {
          "zoneDetailID": 3,
          "zoneID": 1,
          "name": "Phường Cánh",
          "note": "Trung quận"
        },
        {
          "zoneDetailID": 4,
          "zoneID": 2,
          "name": "Phường Qua",
          "note": ""
        }
      ]);
    }
    
    const data = await response.json();
    console.log('Zone details data from backend:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock data nếu có lỗi
    return NextResponse.json([
      {
        "zoneDetailID": 1,
        "zoneID": 1,
        "name": "Phường Bến Nghé",
        "note": "Trung tâm Quận 1"
      },
      {
        "zoneDetailID": 2,
        "zoneID": 1,
        "name": "Phường Bến Thành",
        "note": "Khu vực thương mại"
      },
      {
        "zoneDetailID": 3,
        "zoneID": 1,
        "name": "Phường Cánh",
        "note": "Trung quận"
      },
      {
        "zoneDetailID": 4,
        "zoneID": 2,
        "name": "Phường Qua",
        "note": ""
      }
    ]);
  }
} 