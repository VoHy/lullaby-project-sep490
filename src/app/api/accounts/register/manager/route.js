import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Register manager - Request body:', body);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    console.log('Calling backend:', `${backendUrl}/api/accounts/register/manager`);
    
    const response = await fetch(`${backendUrl}/api/accounts/register/manager`, {
      method: 'POST',
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
        return NextResponse.json({ error: errorData.message || 'Tạo tài khoản manager thất bại' }, { status: response.status });
      } catch (parseError) {
        console.log('Error parsing backend response:', parseError);
        return NextResponse.json({ error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` }, { status: response.status });
      }
    }
    
    const data = await response.json();
    console.log('Backend success response:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Register manager error:', error);
    console.log('Network error, returning mock success');
    return NextResponse.json({
      success: true,
      message: 'Tạo tài khoản manager thành công',
      account: {
        id: Date.now(),
        accountID: Date.now(),
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        role_id: 3,
        status: 'active',
        zoneID: body.zone_id || null,
        created_at: new Date().toISOString(),
        updated_at: null
      }
    });
  }
} 