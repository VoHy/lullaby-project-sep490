import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { walletId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🔍 Wallet API: Lấy ví theo walletID:', walletId);
    
    const response = await fetch(`${backendUrl}/api/Wallet/${walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 Wallet API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Wallet API: Backend error:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Wallet API: Ví từ backend:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 Wallet API: Error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { walletId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🔍 Wallet API: Xóa ví walletID:', walletId);
    
    const response = await fetch(`${backendUrl}/api/Wallet/${walletId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 Wallet API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Wallet API: Backend error:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Wallet API: Ví được xóa:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 Wallet API: Error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 