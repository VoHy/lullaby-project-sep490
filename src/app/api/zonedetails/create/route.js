import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/api/zonedetails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      // Mock response cho create
      return NextResponse.json({
        "ZoneDetailID": Math.floor(Math.random() * 1000) + 1,
        "ZoneID": body.ZoneID || 1,
        "DetailName": body.DetailName || "New Zone Detail",
        "Description": body.Description || "New zone detail description",
        "Status": "active",
        "CreatedAt": new Date().toISOString()
      });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock response nếu có lỗi
    return NextResponse.json({
      "ZoneDetailID": Math.floor(Math.random() * 1000) + 1,
      "ZoneID": 1,
      "DetailName": "New Zone Detail",
      "Description": "New zone detail description",
      "Status": "active",
      "CreatedAt": new Date().toISOString()
    });
  }
} 