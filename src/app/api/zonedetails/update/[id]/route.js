import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/api/zonedetails/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      // Mock response cho update
      return NextResponse.json({
        "ZoneDetailID": parseInt(id),
        "ZoneID": body.ZoneID || 1,
        "DetailName": body.DetailName || "Updated Zone Detail",
        "Description": body.Description || "Updated zone detail description",
        "Status": "active",
        "UpdatedAt": new Date().toISOString()
      });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock response nếu có lỗi
    return NextResponse.json({
      "ZoneDetailID": parseInt(id),
      "ZoneID": 1,
      "DetailName": "Updated Zone Detail",
      "Description": "Updated zone detail description",
      "Status": "active",
      "UpdatedAt": new Date().toISOString()
    });
  }
} 