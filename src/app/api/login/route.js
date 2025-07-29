import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Proxy login request:', body);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
      const response = await fetch(`${backendUrl}/api/accounts/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    // Kiểm tra content-type của response
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!response.ok) {
      // Thử đọc response text trước
      const errorText = await response.text();
      console.log('Error response text:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Đăng nhập thất bại' },
          { status: response.status }
        );
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json(
          { error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` },
          { status: response.status }
        );
      }
    }
    
    // Kiểm tra xem response có phải JSON không
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Backend response data:', data);
      return NextResponse.json(data);
    } else {
      // Nếu không phải JSON, đọc text
      const textData = await response.text();
      console.log('Backend response text:', textData);
      
      try {
        const data = JSON.parse(textData);
        return NextResponse.json(data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return NextResponse.json(
          { error: 'Server returned invalid JSON response' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 