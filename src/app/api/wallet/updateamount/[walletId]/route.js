import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { walletId } = params;
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🔍 Wallet API: Cập nhật số tiền ví walletID:', walletId, 'amount:', body.amount);
    
    const response = await fetch(`${backendUrl}/api/Wallet/UpdateAmount/${walletId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('🔍 Wallet API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Wallet API: Backend error:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Wallet API: Ví được cập nhật:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 Wallet API: Error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 