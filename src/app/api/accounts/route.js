import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Proxy get all accounts request');
    
    const response = await fetch('http://localhost:5294/api/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response text:', errorText);
      
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
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 