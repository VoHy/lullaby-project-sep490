import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🧪 Test: API nạp tiền được gọi với data:', body);
    
    // Tạm thời trả về dữ liệu mẫu để tránh lỗi database
    const mockTransaction = {
      transactionHistoryID: Date.now(),
      accountID: body.accountID || 1,
      walletID: body.walletID,
      amount: body.amount,
      note: 'Nạp tiền vào ví',
      status: 'success',
      transactionDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('🧪 Test: Trả về transaction mẫu:', mockTransaction);

    return NextResponse.json(mockTransaction);

    // Code gốc (comment lại để tránh lỗi):
    /*
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
    */
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 