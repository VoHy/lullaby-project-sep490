import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    console.log('🔍 Wallet API: Gọi backend URL:', `${backendUrl}/api/Wallet/GetAll`);
    
    const response = await fetch(`${backendUrl}/api/Wallet/GetAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 Wallet API: Response status:', response.status);
    console.log('🔍 Wallet API: Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Wallet API: Backend error:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 Wallet API: Backend data type:', typeof data);
    console.log('🔍 Wallet API: Backend data:', data);
    console.log('🔍 Wallet API: Is array?', Array.isArray(data));
    console.log('🔍 Wallet API: Data length:', Array.isArray(data) ? data.length : 'Not array');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 Wallet API: Error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 