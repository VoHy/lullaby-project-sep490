import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    console.log('Calling backend zones:', `${backendUrl}/api/zones/getall`);
    
    const response = await fetch(`${backendUrl}/api/zones/getall`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Zones response status:', response.status);
    
    if (!response.ok) {
      // Mock data cho zones
      return NextResponse.json([
        {
          "zoneID": 1,
          "zoneName": "Quận 2",
          "managerID": 6,
          "city": "Hồ Chí Minh"
        },
        {
          "zoneID": 2,
          "zoneName": "Quận 8",
          "managerID": 7,
          "city": "Hồ Chí Minh"
        },
        {
          "zoneID": 4,
          "zoneName": "Quận Binh",
          "managerID": 16,
          "city": "Hồ Chí Minh"
        }
      ]);
    }
    
    const data = await response.json();
    console.log('Zones data from backend:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock data nếu có lỗi
    return NextResponse.json([
      {
        "zoneID": 1,
        "zoneName": "Quận 2",
        "managerID": 6,
        "city": "Hồ Chí Minh"
      },
      {
        "zoneID": 2,
        "zoneName": "Quận 8",
        "managerID": 7,
        "city": "Hồ Chí Minh"
      },
      {
        "zoneID": 4,
        "zoneName": "Quận",
        "managerID": 16,
        "city": "Hồ Chí Minh"
      }
    ]);
  }
} 