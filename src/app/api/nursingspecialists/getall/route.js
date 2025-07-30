import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('Calling backend:', `${backendUrl}/api/nursingspecialists`);
    
    const response = await fetch(`${backendUrl}/api/nursingspecialists`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      
      // Tạm thời trả về mock data nếu backend không khả dụng
      console.log('Backend not available, returning mock data');
      return NextResponse.json([
        {
          "NursingSpecialistID": 1,
          "AccountID": 2,
          "FullName": "Nguyễn Văn A",
          "Email": "nguyenvana@example.com",
          "Phone": "0123456789",
          "Major": "Y tá",
          "Experience": 5,
          "Status": "active",
          "ZoneID": 1,
          "CreatedAt": "2024-01-01T00:00:00Z",
          "UpdatedAt": "2024-01-01T00:00:00Z"
        },
        {
          "NursingSpecialistID": 2,
          "AccountID": 3,
          "FullName": "Trần Thị B",
          "Email": "tranthib@example.com",
          "Phone": "0987654321",
          "Major": "Chuyên gia",
          "Experience": 8,
          "Status": "active",
          "ZoneID": 2,
          "CreatedAt": "2024-01-01T00:00:00Z",
          "UpdatedAt": "2024-01-01T00:00:00Z"
        }
      ]);
    }
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!responseText) {
      return NextResponse.json({ error: 'Empty response from backend' }, { status: 500 });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: `Invalid JSON response: ${responseText.substring(0, 100)}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Fetch error:', error);
    
    // Tạm thời trả về mock data nếu có lỗi network
    console.log('Network error, returning mock data');
    return NextResponse.json([
      {
        "NursingSpecialistID": 1,
        "AccountID": 2,
        "FullName": "Nguyễn Văn A",
        "Email": "nguyenvana@example.com",
        "Phone": "0123456789",
        "Major": "Y tá",
        "Experience": 5,
        "Status": "active",
        "ZoneID": 1,
        "CreatedAt": "2024-01-01T00:00:00Z",
        "UpdatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "NursingSpecialistID": 2,
        "AccountID": 3,
        "FullName": "Trần Thị B",
        "Email": "tranthib@example.com",
        "Phone": "0987654321",
        "Major": "Chuyên gia",
        "Experience": 8,
        "Status": "active",
        "ZoneID": 2,
        "CreatedAt": "2024-01-01T00:00:00Z",
        "UpdatedAt": "2024-01-01T00:00:00Z"
      }
    ]);
  }
} 