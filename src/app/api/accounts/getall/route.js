import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('Calling backend:', `${backendUrl}/api/accounts/getall`);
    
    const response = await fetch(`${backendUrl}/api/accounts/getall`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.log('Backend not available, using mock data');
      // Mock data cho accounts
      return NextResponse.json([
        {
          "AccountID": 1,
          "Username": "admin",
          "Email": "admin@lullaby.com",
          "RoleID": 1,
          "Status": "active",
          "CreatedAt": "2024-01-01T00:00:00Z"
        },
        {
          "AccountID": 2,
          "Username": "nurse1",
          "Email": "nurse1@lullaby.com",
          "RoleID": 2,
          "Status": "active",
          "CreatedAt": "2024-01-01T00:00:00Z"
        },
        {
          "AccountID": 3,
          "Username": "manager1",
          "Email": "manager1@lullaby.com",
          "RoleID": 3,
          "Status": "active",
          "CreatedAt": "2024-01-01T00:00:00Z"
        }
      ]);
    }
    
    const data = await response.json();
    console.log('Backend data received:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Mock data nếu có lỗi
    return NextResponse.json([
      {
        "AccountID": 1,
        "Username": "admin",
        "Email": "admin@lullaby.com",
        "RoleID": 1,
        "Status": "active",
        "CreatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "AccountID": 2,
        "Username": "nurse1",
        "Email": "nurse1@lullaby.com",
        "RoleID": 2,
        "Status": "active",
        "CreatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "AccountID": 3,
        "Username": "manager1",
        "Email": "manager1@lullaby.com",
        "RoleID": 3,
        "Status": "active",
        "CreatedAt": "2024-01-01T00:00:00Z"
      }
    ]);
  }
} 