import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Không thể lấy danh sách tài khoản' },
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
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 