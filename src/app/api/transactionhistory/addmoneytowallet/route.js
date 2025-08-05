import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🧪 Test: API nạp tiền được gọi với data:', body);
    
    const response = await fetch(`${backendUrl}/api/TransactionHistory/AddMoneyToWallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || 'Thêm tiền vào wallet thất bại' },
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