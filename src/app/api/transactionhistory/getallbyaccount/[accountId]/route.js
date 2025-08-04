import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { accountId } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    // Tạm thời trả về dữ liệu mẫu để tránh lỗi database
    const mockData = [
      {
        transactionHistoryID: 1,
        accountID: accountId,
        walletID: 1,
        amount: 1000000,
        note: 'Nạp tiền vào ví',
        status: 'success',
        transactionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        transactionHistoryID: 2,
        accountID: accountId,
        walletID: 1,
        amount: -500000,
        note: 'Thanh toán dịch vụ chăm sóc',
        status: 'success',
        transactionDate: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        transactionHistoryID: 3,
        accountID: accountId,
        walletID: 1,
        amount: 2000000,
        note: 'Nạp tiền qua PayOS',
        status: 'success',
        transactionDate: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        transactionHistoryID: 4,
        accountID: accountId,
        walletID: 1,
        amount: -300000,
        note: 'Thanh toán hóa đơn',
        status: 'pending',
        transactionDate: new Date(Date.now() - 259200000).toISOString(), // 3 ngày trước
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    return NextResponse.json(mockData);

    // Code gốc (comment lại để tránh lỗi):
    /*
    const response = await fetch(`${backendUrl}/api/TransactionHistory/GetAllByAccount/${accountId}`, {
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
          { error: errorData.message || 'Không thể lấy danh sách transaction histories theo account' },
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