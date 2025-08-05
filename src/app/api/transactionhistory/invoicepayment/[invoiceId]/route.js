import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { invoiceId } = await params;
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';

    const response = await fetch(`${backendUrl}/api/TransactionHistory/InvoicePayment/${invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || `Thanh toán invoice #${invoiceId} thất bại` },
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