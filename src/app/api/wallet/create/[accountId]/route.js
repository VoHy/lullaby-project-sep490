import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { accountId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🔍 Wallet API: Tạo ví cho accountID:', accountId);
    
    const response = await fetch(`${backendUrl}/api/Wallet/${accountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Empty body as per API spec
    });

    console.log('🔍 Wallet API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Wallet API: Backend error:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Wallet API: Ví được tạo:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 Wallet API: Error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 