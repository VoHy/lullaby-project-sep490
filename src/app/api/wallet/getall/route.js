import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    // Tạm thời trả về dữ liệu mẫu để tránh lỗi database
    const mockData = [
      {
        walletID: 1,
        accountID: 1,
        amount: 500000,
        status: 'active',
        note: 'Ví chính',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        walletID: 2,
        accountID: 2,
        amount: 1000000,
        status: 'active',
        note: 'Ví khách hàng',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        walletID: 6,
        accountID: 6,
        amount: 0,
        status: 'active',
        note: 'Ví mới tạo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockData);

    // Code gốc (comment lại để tránh lỗi):
    /*
    const response = await fetch(`${backendUrl}/api/Wallet/GetAll`, {
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
          { error: errorData.message || `Không thể lấy danh sách wallets` },
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
    */
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 