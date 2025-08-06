import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { walletId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🔍 Wallet API: Kích hoạt ví walletID:', walletId);
    
    // Sử dụng WalletId (chữ W viết hoa) như trong Swagger
    const response = await fetch(`${backendUrl}/api/Wallet/Active/${walletId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('🔍 Wallet API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Wallet API: Backend error:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Wallet API: Ví được kích hoạt:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 Wallet API: Error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 