import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Implement actual API call to backend
    const response = await fetch(`${process.env.API_BASE_URL}/api/accounts/count/non-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch non-admin count');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Get non-admin count error:', error);
    return NextResponse.json(
      { error: 'Không thể lấy số lượng non-admin accounts' },
      { status: 500 }
    );
  }
} 