import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const response = await fetch(`${backendUrl}/api/bookings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      // Mock data cho bookings
      return NextResponse.json([
        {
          "BookingID": 1,
          "CareProfileID": 1,
          "CustomizePackageID": null,
          "Amount": 500000,
          "total_price": 500000,
          "Status": "completed",
          "CreatedAt": "2024-01-01T00:00:00Z"
        },
        {
          "BookingID": 2,
          "CareProfileID": 2,
          "CustomizePackageID": 1,
          "Amount": 750000,
          "total_price": 750000,
          "Status": "pending",
          "CreatedAt": "2024-01-02T00:00:00Z"
        }
      ]);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock data nếu có lỗi
    return NextResponse.json([
      {
        "BookingID": 1,
        "CareProfileID": 1,
        "CustomizePackageID": null,
        "Amount": 500000,
        "total_price": 500000,
        "Status": "completed",
        "CreatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "BookingID": 2,
        "CareProfileID": 2,
        "CustomizePackageID": 1,
        "Amount": 750000,
        "total_price": 750000,
        "Status": "pending",
        "CreatedAt": "2024-01-02T00:00:00Z"
      }
    ]);
  }
} 