import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { transactionHistoryId } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';

    const response = await fetch(`${backendUrl}/api/TransactionHistory/SuccessAddToWallet/${transactionHistoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Cập nhật trạng thái thành công thất bại' },
        { status: response.status }
      );
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