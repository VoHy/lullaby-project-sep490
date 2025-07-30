import { NextResponse } from 'next/server';

// Lưu trữ dữ liệu tạm thời cho mock (shared với get/[id])
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('Update account - ID:', id);
    console.log('Update account - Request body:', body);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    console.log('Calling backend:', `${backendUrl}/api/accounts/update/${id}`);
    
    const response = await fetch(`${backendUrl}/api/accounts/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Backend error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('Parsed error data:', errorData);
        
        // Nếu backend báo account không tồn tại, cập nhật mock data
        if (errorData.message && errorData.message.includes('does not exist')) {
          console.log('Account not found in backend, updating mock data');
          
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
        }
        
        return NextResponse.json({ error: errorData.message || 'Không thể cập nhật tài khoản' }, { status: response.status });
      } catch (parseError) {
        console.log('Error parsing backend response:', parseError);
        return NextResponse.json({ error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` }, { status: response.status });
      }
    }
    
    const data = await response.json();
    console.log('Backend success response:', data);
    
    // Cập nhật mock data với response từ backend
    mockManagerData[id] = {
      ...mockManagerData[id],
      ...data,
      id: parseInt(id),
      accountID: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update account error:', error);
    console.log('Network error, updating mock data');
    
    // Cập nhật mock data khi có lỗi network
    mockManagerData[id] = {
      ...mockManagerData[id],
      ...body,
      id: parseInt(id),
      accountID: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Cập nhật manager thành công',
      account: mockManagerData[id]
    });
  }
} 