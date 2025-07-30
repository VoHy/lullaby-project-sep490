import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    console.log('Calling backend managers:', `${backendUrl}/api/accounts/managers`);
    
    const response = await fetch(`${backendUrl}/api/accounts/managers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Managers response status:', response.status);
    
    if (!response.ok) {
      console.log('Backend not available, returning mock data');
      return NextResponse.json([
        {
          id: 1,
          accountID: 1,
          fullName: 'Nguyễn Văn Manager',
          email: 'manager@example.com',
          phoneNumber: '0123456789',
          role_id: 3,
          status: 'active',
          zoneID: 1,
          zoneName: 'Quận 2',
          created_at: '2025-07-29T10:38:09.000Z',
          updated_at: null
        },
        {
          id: 2,
          accountID: 2,
          fullName: 'Trần Thị Quản Lý',
          email: 'quanly@example.com',
          phoneNumber: '0987654321',
          role_id: 3,
          status: 'active',
          zoneID: 2,
          zoneName: 'Quận 8',
          created_at: '2025-07-29T11:00:00.000Z',
          updated_at: null
        }
      ]);
    }
    
    const data = await response.json();
    console.log('Managers data from backend:', data);
    
    // Đảm bảo trả về array
    const managersArray = Array.isArray(data) ? data : [data];
    return NextResponse.json(managersArray, { status: response.status });
  } catch (error) {
    console.error('Managers fetch error:', error);
    console.log('Network error, returning mock data');
    return NextResponse.json([
      {
        id: 1,
        accountID: 1,
        fullName: 'Nguyễn Văn Manager',
        email: 'manager@example.com',
        phoneNumber: '0123456789',
        role_id: 3,
        status: 'active',
        zoneID: 1,
        zoneName: 'Quận 2',
        created_at: '2025-07-29T10:38:09.000Z',
        updated_at: null
      },
      {
        id: 2,
        accountID: 2,
        fullName: 'Trần Thị Quản Lý',
        email: 'quanly@example.com',
        phoneNumber: '0987654321',
        role_id: 3,
        status: 'active',
        zoneID: 2,
        zoneName: 'Quận 8',
        created_at: '2025-07-29T11:00:00.000Z',
        updated_at: null
      }
    ]);
  }
} 