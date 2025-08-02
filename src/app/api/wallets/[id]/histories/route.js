import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/wallets/${id}/histories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      console.error('Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Không thể lấy lịch sử wallet' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get wallet histories error:', error);
    return NextResponse.json(
      { error: 'Lỗi kết nối đến backend' },
      { status: 500 }
    );
  }
} 