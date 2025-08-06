import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { invoiceId } = await params;
    
    // Sửa: Không parse body nếu không có
    let body = null;
    try {
      const text = await request.text();
      if (text && text.trim() !== '') {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      console.log('No request body or invalid JSON, proceeding without body');
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';

    console.log('Calling backend InvoicePayment with invoiceId:', invoiceId);
    
    const response = await fetch(`${backendUrl}/api/TransactionHistory/InvoicePayment/${invoiceId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      // Chỉ gửi body nếu có
      ...(body && { body: JSON.stringify(body) })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return Response.json({ error: data.message || 'Payment failed' }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error('InvoicePayment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}