import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/accounts/register/manager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: 'Đăng ký manager thất bại' }, { status: 500 });
  }
} 