import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Implement actual API call to backend
    const response = await fetch(`${process.env.API_BASE_URL}/api/accounts/count/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customers count');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Get customers count error:', error);
    return NextResponse.json(
      { error: 'Không thể lấy số lượng customers' },
      { status: 500 }
    );
  }
} 