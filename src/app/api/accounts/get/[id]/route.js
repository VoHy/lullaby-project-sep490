import { NextResponse } from 'next/server';

// Lưu trữ dữ liệu tạm thời cho mock
let mockManagerData = {
  1: {
    id: 1,
    accountID: 1,
    fullName: 'Koh',
    email: 'koh@example.com',
    phoneNumber: '0393252054',
    role_id: 3,
    status: 'active',
    zoneID: 1,
    zoneName: 'Quận 2',
    created_at: '2025-07-29T10:38:09.000Z',
    updated_at: null
  }
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('Get account by ID:', id);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    console.log('Calling backend:', `${backendUrl}/api/accounts/get/${id}`);
    
    const response = await fetch(`${backendUrl}/api/accounts/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Backend error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('Parsed error data:', errorData);
        
        // Nếu backend báo account không tồn tại, trả về mock data
        if (errorData.message && errorData.message.includes('does not exist')) {
          console.log('Account not found in backend, returning mock data');
          return NextResponse.json(mockManagerData[id] || {
            id: parseInt(id),
            accountID: parseInt(id),
            fullName: 'Manager Example',
            email: 'manager@example.com',
            phoneNumber: '0123456789',
            role_id: 3,
            status: 'active',
            zoneID: 1,
            zoneName: 'Quận 2',
            created_at: '2025-07-29T10:38:09.000Z',
            updated_at: null
          });
        }
        
        return NextResponse.json({ error: errorData.message || 'Không thể lấy thông tin tài khoản' }, { status: response.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` }, { status: response.status });
      }
    }
    
    const data = await response.json();
    console.log('Backend success response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    console.log('Network error, returning mock data');
    return NextResponse.json(mockManagerData[params.id] || {
      id: parseInt(params.id),
      accountID: parseInt(params.id),
      fullName: 'Manager Example',
      email: 'manager@example.com',
      phoneNumber: '0123456789',
      role_id: 3,
      status: 'active',
      zoneID: 1,
      zoneName: 'Quận 2',
      created_at: '2025-07-29T10:38:09.000Z',
      updated_at: null
    });
  }
}

// Thêm endpoint để cập nhật mock data
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('Updating mock data for ID:', id, 'with data:', body);
    
    // Cập nhật mock data
    mockManagerData[id] = {
      ...mockManagerData[id],
      ...body,
      id: parseInt(id),
      accountID: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    console.log('Updated mock data:', mockManagerData[id]);
    
    return NextResponse.json({
      success: true,
      message: 'Cập nhật manager thành công',
      account: mockManagerData[id]
    });
  } catch (error) {
    console.error('Error updating mock data:', error);
    return NextResponse.json({ error: 'Không thể cập nhật mock data' }, { status: 500 });
  }
} 